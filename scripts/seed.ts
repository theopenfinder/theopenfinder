import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const DRY_RUN = process.argv.includes("--dry-run");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function pipe(value: string): string[] {
  return value.split("|").map((s) => s.trim()).filter(Boolean);
}

// ── Phase 0: Reset ─────────────────────────────────────────────────
async function resetAll() {
  if (DRY_RUN) {
    console.log("── Phase 0: [DRY RUN] Skipping reset.");
    return;
  }
  console.log("── Phase 0: Resetting all tables…");

  const steps: Array<[string, () => PromiseLike<{ error: any }>]> = [
    ["tool_tags",       () => supabase.from("tool_tags").delete().not("tool_id", "is", null)],
    ["tool_categories", () => supabase.from("tool_categories").delete().not("tool_id", "is", null)],
    ["tools",           () => supabase.from("tools").delete().not("id", "is", null)],
    ["tags",            () => supabase.from("tags").delete().gte("id", 0)],
    ["categories",      () => supabase.from("categories").delete().gte("id", 0)],
  ];

  for (const [table, fn] of steps) {
    const { error } = await fn();
    if (error) throw new Error(`Reset failed on "${table}": ${error.message}`);
    console.log(`  ✓ cleared ${table}`);
  }
}

// ── Phase 1: Seed taxonomy ─────────────────────────────────────────
interface TaxonomyRow {
  category: string;
  subcategory: string;
}

interface SubcatEntry {
  subId: number;
  parentId: number;
  parentName: string;
}

interface TaxonomyIndex {
  // subcategorySlug → canonical parent entry (source of truth: taxonomy_categories.csv only)
  subcatLookup: Map<string, SubcatEntry>;
  taxonomyConflicts: string[];
}

async function seedTaxonomy(): Promise<TaxonomyIndex> {
  console.log("\n── Phase 1: Seeding taxonomy from taxonomy_categories.csv…");

  const csvPath = path.resolve(process.cwd(), "taxonomy_categories.csv");
  const rows: TaxonomyRow[] = (parse(fs.readFileSync(csvPath, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as TaxonomyRow[]).filter((r) => r.category);

  // Detect duplicate subcategory slugs across different parent categories
  const taxonomyConflicts: string[] = [];
  const seenSubcats = new Map<string, string>(); // slug → first parent name
  for (const row of rows) {
    if (!row.subcategory) continue;
    const existing = seenSubcats.get(row.subcategory);
    if (existing) {
      taxonomyConflicts.push(
        `"${row.subcategory}" appears under both "${existing}" and "${row.category}" — only first occurrence will be used`
      );
    } else {
      seenSubcats.set(row.subcategory, row.category);
    }
  }

  const catNames = [...new Set(rows.map((r) => r.category))];
  const categoryMap = new Map<string, number>(); // category name → id

  if (DRY_RUN) {
    catNames.forEach((name, i) => categoryMap.set(name, i + 1));
  } else {
    const { data: insertedCats, error: catErr } = await supabase
      .from("categories")
      .insert(catNames.map((name) => ({ name, slug: toSlug(name), parent_id: null })))
      .select("id, name");
    if (catErr) throw new Error(`Top-level category insert failed: ${catErr.message}`);
    for (const c of insertedCats ?? []) categoryMap.set(c.name, c.id);
  }
  console.log(`  ✓ ${categoryMap.size} top-level categories`);

  // Only use the first occurrence of each subcategory slug (conflicts already logged above)
  const uniqueSubcatRows = rows
    .filter((r) => r.subcategory)
    .filter((r, _, arr) => arr.findIndex((x) => x.subcategory === r.subcategory) === arr.indexOf(r));

  const subcatLookup = new Map<string, SubcatEntry>();

  if (DRY_RUN) {
    uniqueSubcatRows.forEach((r, i) => {
      subcatLookup.set(r.subcategory, {
        subId:      i + 1000,
        parentId:   categoryMap.get(r.category)!,
        parentName: r.category,
      });
    });
  } else {
    const subcatInserts = uniqueSubcatRows.map((r) => ({
      name:      r.subcategory,
      slug:      r.subcategory,
      parent_id: categoryMap.get(r.category)!,
    }));

    const { data: insertedSubs, error: subErr } = await supabase
      .from("categories")
      .insert(subcatInserts)
      .select("id, slug, parent_id");
    if (subErr) throw new Error(`Subcategory insert failed: ${subErr.message}`);

    const idToParentName = new Map<number, string>(
      [...categoryMap.entries()].map(([name, id]) => [id, name])
    );
    for (const sub of insertedSubs ?? []) {
      subcatLookup.set(sub.slug, {
        subId:      sub.id,
        parentId:   sub.parent_id,
        parentName: idToParentName.get(sub.parent_id) ?? "unknown",
      });
    }
  }
  console.log(`  ✓ ${subcatLookup.size} subcategories`);

  return { subcatLookup, taxonomyConflicts };
}

// ── Phase 2: Seed tools ────────────────────────────────────────────
interface ToolRow {
  id: string;
  name: string;
  Category: string;
  subcategory: string;
  description: string;
  website: string;
  github: string;
  license: string;
  platforms: string;
  tags: string;
  difficulty: string;
  self_hosted: string;
  year_started: string;
}

interface SeedStats {
  toolsProcessed: number;
  subcatRelCreated: number;
  parentCatAutoAdded: number;
  skippedUnknownSubcats: number;
  warnings: string[];
}

async function seedTools(subcatLookup: Map<string, SubcatEntry>): Promise<SeedStats> {
  console.log("\n── Phase 2: Seeding tools from tools.csv…");

  const rows: ToolRow[] = parse(
    fs.readFileSync(path.resolve(process.cwd(), "tools.csv"), "utf-8"),
    { columns: true, skip_empty_lines: true, trim: true }
  );
  console.log(`  Found ${rows.length} tools`);

  const warnings: string[] = [];
  const tagCache = new Map<string, number>();
  let toolsProcessed = 0;
  let subcatRelCreated = 0;
  let parentCatAutoAdded = 0;
  let skippedUnknownSubcats = 0;

  async function getOrCreateTag(name: string): Promise<number> {
    if (tagCache.has(name)) return tagCache.get(name)!;
    if (DRY_RUN) { const id = tagCache.size + 1; tagCache.set(name, id); return id; }
    const slug = toSlug(name);
    const { data, error } = await supabase
      .from("tags")
      .upsert({ name, slug }, { onConflict: "slug" })
      .select("id")
      .single();
    if (error) throw new Error(`Tag upsert failed for "${name}": ${error.message}`);
    tagCache.set(name, data.id);
    return data.id;
  }

  for (const row of rows) {
    try {
      if (!DRY_RUN) {
        const { error: toolErr } = await supabase.from("tools").insert({
          id:           row.id,
          name:         row.name,
          description:  row.description || null,
          website:      row.website     || null,
          github:       row.github      || null,
          license:      row.license     || null,
          platforms:    pipe(row.platforms),
          difficulty:   row.difficulty  || null,
          self_hosted:  row.self_hosted.toUpperCase() === "TRUE",
          year_started: row.year_started ? parseInt(row.year_started, 10) : null,
        });
        if (toolErr) throw new Error(`Tool insert failed: ${toolErr.message}`);
      }

      // Resolve category membership purely from subcategory taxonomy lookup.
      // The tool's Category column in tools.csv is NOT used to assign parent categories —
      // each subcategory's canonical parent is determined by taxonomy_categories.csv.
      const resolvedSubcats = new Map<number, string>(); // subId → subcatSlug
      const resolvedParents = new Map<number, string>();  // parentId → parentName (deduplicated)

      for (const sub of pipe(row.subcategory)) {
        const entry = subcatLookup.get(sub);
        if (!entry) {
          warnings.push(`[${row.id}] subcategory "${sub}" not found in taxonomy_categories.csv — skipped`);
          skippedUnknownSubcats++;
        } else {
          resolvedSubcats.set(entry.subId, sub);
          resolvedParents.set(entry.parentId, entry.parentName);
        }
      }

      subcatRelCreated  += resolvedSubcats.size;
      parentCatAutoAdded += resolvedParents.size;

      if (DRY_RUN) {
        const parentList = [...resolvedParents.values()].join(", ") || "(none)";
        const subcatList = [...resolvedSubcats.values()].join(", ") || "(none)";
        console.log(`  [dry] ${row.id}`);
        console.log(`         parents : ${parentList}`);
        console.log(`         subcats : ${subcatList}`);
      } else {
        const allCatIds = [
          ...[...resolvedParents.keys()],
          ...[...resolvedSubcats.keys()],
        ];
        if (allCatIds.length > 0) {
          const { error: tcErr } = await supabase
            .from("tool_categories")
            .insert(allCatIds.map((cid) => ({ tool_id: row.id, category_id: cid })));
          if (tcErr) throw new Error(`tool_categories insert failed: ${tcErr.message}`);
        }

        for (const tagName of pipe(row.tags)) {
          const tagId = await getOrCreateTag(tagName);
          const { error: ttErr } = await supabase
            .from("tool_tags")
            .upsert({ tool_id: row.id, tag_id: tagId }, { onConflict: "tool_id,tag_id" });
          if (ttErr) throw new Error(`tool_tags insert failed: ${ttErr.message}`);
        }

        console.log(`  ✓ ${row.id}`);
      }

      toolsProcessed++;
    } catch (err) {
      console.error(`  ✗ ${row.id}: ${(err as Error).message}`);
    }
  }

  return { toolsProcessed, subcatRelCreated, parentCatAutoAdded, skippedUnknownSubcats, warnings };
}

// ── Main ───────────────────────────────────────────────────────────
async function main() {
  if (DRY_RUN) console.log("🔍 DRY RUN — no database writes\n");

  await resetAll();
  const { subcatLookup, taxonomyConflicts } = await seedTaxonomy();
  const stats = await seedTools(subcatLookup);

  console.log("\n──────────────────────────────────────────");
  console.log("── Summary ───────────────────────────────");
  console.log(`  Total tools processed:               ${stats.toolsProcessed}`);
  console.log(`  Subcategory relationships created:   ${stats.subcatRelCreated}`);
  console.log(`  Parent category relationships added: ${stats.parentCatAutoAdded}`);
  console.log(`  Skipped unknown subcategories:       ${stats.skippedUnknownSubcats}`);
  console.log(`  Taxonomy conflicts detected:         ${taxonomyConflicts.length}`);

  if (taxonomyConflicts.length > 0) {
    console.log("\n── Taxonomy conflicts ────────────────────");
    for (const c of taxonomyConflicts) console.log(`  ⚠ ${c}`);
  }

  if (stats.warnings.length > 0) {
    console.log(`\n── Warnings (${stats.warnings.length}) ─────────────────────────`);
    for (const w of stats.warnings) console.log(`  ⚠ ${w}`);
  }

  if (taxonomyConflicts.length === 0 && stats.warnings.length === 0) {
    console.log("\n  No warnings or conflicts.");
  }

  if (!DRY_RUN) console.log(`\n✓ Done. ${stats.toolsProcessed} tools seeded.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
