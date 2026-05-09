import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AsciiBackground from '@/components/AsciiBackground';
import { createServerClient } from '@/lib/supabase-server';
import CategoryClient, { type SubcategoryRow, type ToolCard } from './CategoryClient';
import styles from './category.module.css';

// Placeholder descriptions per category — replace with real copy when ready
const DESCRIPTIONS: Record<string, string> = {
  design:       'Editors, illustration tools, 3D software, and visual design environments.',
  media:        'Players, streaming, recording, and audio tools.',
  productivity: 'Writing, notes, office suites, and task management.',
  security:     'Password managers, encryption, auditing, and hardening tools.',
  development:  'IDEs, version control, databases, and developer infrastructure.',
  ai:           'Local models, inference engines, and AI-powered tools.',
  privacy:      'Browsers, VPNs, ad-blockers, and anonymity tools.',
  utilities:    'System tools, file management, terminals, and automation.',
  data:         'Databases, analytics, visualization, and pipeline tools.',
  networking:   'DNS, proxies, load balancers, and network utilities.',
};

interface CategoryData {
  category: { id: number; name: string; slug: string };
  subcategories: SubcategoryRow[];
  tools: ToolCard[];
}

async function getCategoryData(slug: string): Promise<CategoryData | null> {
  const supabase = createServerClient();

  // 1. Fetch top-level category by slug
  const { data: cat, error: catErr } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .is('parent_id', null)
    .single();

  if (catErr || !cat) return null;

  // 2. Fetch subcategories
  const { data: subs } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('parent_id', cat.id)
    .order('name');

  const subcategories: SubcategoryRow[] = subs ?? [];

  // 3. Get all tool_ids linked to this category or any of its subcategories
  const allCatIds = [cat.id, ...subcategories.map(s => s.id)];

  const { data: links } = await supabase
    .from('tool_categories')
    .select('tool_id, category_id')
    .in('category_id', allCatIds);

  const linkRows = links ?? [];
  const toolIds  = [...new Set(linkRows.map(l => l.tool_id))];

  if (toolIds.length === 0) {
    return { category: cat, subcategories, tools: [] };
  }

  // 4. Fetch tools with tags
  const { data: rawTools } = await supabase
    .from('tools')
    .select(`
      id, name, description, license, platforms, difficulty, self_hosted, year_started,
      tool_tags ( tags ( name ) )
    `)
    .in('id', toolIds)
    .order('name');

  // Build subcategoryId list per tool (exclude top-level category id)
  const subcatIdSet = new Set(subcategories.map(s => s.id));
  const toolSubcatMap: Record<string, number[]> = {};
  for (const link of linkRows) {
    if (!subcatIdSet.has(link.category_id)) continue;
    if (!toolSubcatMap[link.tool_id]) toolSubcatMap[link.tool_id] = [];
    toolSubcatMap[link.tool_id].push(link.category_id);
  }

  const tools: ToolCard[] = (rawTools ?? []).map((t: any) => ({
    id:             t.id,
    name:           t.name,
    description:    t.description,
    license:        t.license,
    platforms:      t.platforms,
    difficulty:     t.difficulty,
    self_hosted:    t.self_hosted,
    year_started:   t.year_started,
    tagNames:       (t.tool_tags ?? []).map((tt: any) => tt.tags?.name).filter(Boolean),
    subcategoryIds: toolSubcatMap[t.id] ?? [],
  }));

  return { category: cat, subcategories, tools };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: cat } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .is('parent_id', null)
    .single();
  if (!cat) return { title: 'Category Not Found' };
  const name = cat.name as string;
  return {
    title: `${name} tools`,
    description: `Open-source ${name.toLowerCase()} tools curated by OpenFinder.`,
    openGraph: {
      title:       `${name} open-source tools — OpenFinder`,
      description: `Browse curated open-source ${name.toLowerCase()} tools.`,
      url:         `https://theopenfinder.org/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  if (!data) notFound();

  const { category, subcategories, tools } = data;
  const description = DESCRIPTIONS[category.slug] ?? `Open-source tools in the ${category.name} category.`;

  return (
    <>
      <AsciiBackground />

      <div className={styles.siteWrapper}>

        {/* ── Navigation ─────────────────────────────────────────── */}
        <nav className={styles.nav}>
          <a href="/" className={styles.navBrand}><img src="/logo1-final.png" alt="OpenFinder" className="navLogo" /></a>
          <div className={styles.navLinks}>
            <a href="/"           className={styles.navLink}>home</a>
            <a href="/tools"      className={styles.navLink}>tools</a>
            <a href="/categories" className={`${styles.navLink} ${styles.navLinkActive}`}>categories</a>
            <a href="/guides"     className={styles.navLink}>guides</a>
            <a href="/contact"    className={styles.navLink}>contact</a>
            <a href="/about"      className={styles.navLink}>about</a>
          </div>
        </nav>

        {/* ── Breadcrumb ────────────────────────────────────────── */}
        <div className={styles.breadcrumb}>
          <a href="/categories" className={styles.breadcrumbLink}>categories</a>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{category.name}</span>
        </div>

        {/* ── Header ───────────────────────────────────────────── */}
        <header className={styles.header}>
          <p className={styles.headerMeta}>category</p>
          <h1 className={styles.heading}>{category.name}.</h1>
          <p className={styles.subheading}>{description}</p>
          <p className={styles.headerCount}>{tools.length} tools</p>
        </header>

        {/* ── Interactive client section ────────────────────────── */}
        <CategoryClient subcategories={subcategories} tools={tools} />

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <span className={styles.footerBrand}>OpenFinder</span>
            <span className={styles.footerTagline}>open source, easier to find.</span>
          </div>
          <div className={styles.footerLinks}>
            <a href="/docs"              className={styles.footerLink}>docs</a>
            <a href="https://github.com" className={styles.footerLink}>github</a>
          </div>
        </footer>

      </div>
    </>
  );
}
