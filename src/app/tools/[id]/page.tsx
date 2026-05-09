import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AsciiBackground from '@/components/AsciiBackground';
import { createServerClient } from '@/lib/supabase-server';
import styles from './tool-page.module.css';

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  parent?: { name: string } | null;
}

interface Tag {
  name: string;
}

interface Tool {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  github: string | null;
  license: string | null;
  platforms: string[] | null;
  difficulty: string | null;
  self_hosted: boolean | null;
  year_started: number | null;
  categories: Category[];
  tags: Tag[];
}

async function getTool(id: string): Promise<Tool | null> {
  const supabase = createServerClient();

  const { data: tool, error } = await supabase
    .from('tools')
    .select(`
      id, name, description, website, github,
      license, platforms, difficulty, self_hosted, year_started,
      tool_categories ( category_id, categories ( id, name, parent_id ) ),
      tool_tags       ( tag_id,      tags       ( name ) )
    `)
    .eq('id', id)
    .single();

  if (error || !tool) return null;

  const categories: Category[] = (tool.tool_categories ?? [])
    .map((tc: any) => tc.categories)
    .filter(Boolean);

  const tags: Tag[] = (tool.tool_tags ?? [])
    .map((tt: any) => tt.tags)
    .filter(Boolean);

  return { ...tool, categories, tags };
}

type CategoryGroup = { parent: Category | null; child: Category };

function groupCategories(cats: Category[]): CategoryGroup[] {
  const parents = cats.filter((c) => c.parent_id === null);
  const children = cats.filter((c) => c.parent_id !== null);

  if (parents.length === 0) return cats.map((c) => ({ parent: null, child: c }));

  return parents.flatMap<CategoryGroup>((parent) => {
    const subs = children.filter((c) => c.parent_id === parent.id);
    if (subs.length === 0) return [{ parent: null, child: parent }];
    return subs.map((sub) => ({ parent, child: sub }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tool = await getTool(id);
  if (!tool) return { title: 'Tool Not Found' };
  const desc = tool.description?.slice(0, 155) ?? `${tool.name} is an open-source tool on OpenFinder.`;
  return {
    title: tool.name,
    description: desc,
    openGraph: {
      title:       `${tool.name} — OpenFinder`,
      description: desc,
      url:         `https://theopenfinder.org/tools/${id}`,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await getTool(id);

  if (!tool) notFound();

  const categoryGroups = groupCategories(tool.categories);

  return (
    <>
      <AsciiBackground />

      <div className={styles.siteWrapper} data-tool-id={tool.id}>

        {/* ── Navigation ───────────────────────────────────────── */}
        <nav className={styles.nav}>
          <a href="/" className={styles.navBrand}>OpenFinder</a>
          <div className={styles.navLinks}>
            <a href="/"           className={styles.navLink}>home</a>
            <a href="/tools"      className={`${styles.navLink} ${styles.navLinkActive}`}>tools</a>
            <a href="/categories" className={styles.navLink}>categories</a>
            <a href="/guides"     className={styles.navLink}>guides</a>
            <a href="/contact"    className={styles.navLink}>contact</a>
            <a href="/about"      className={styles.navLink}>about</a>
          </div>
        </nav>

        {/* ── Breadcrumb ────────────────────────────────────────── */}
        <div className={styles.breadcrumb}>
          <a href="/tools" className={styles.breadcrumbLink}>tools</a>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{tool.name}</span>
        </div>

        {/* ── Two-column layout ─────────────────────────────────── */}
        <div className={styles.layout}>

          {/* ── Left: main ───────────────────────────────────────── */}
          <div className={styles.main}>
            <h1 className={styles.name}>{tool.name}</h1>

            {tool.description && (
              <p className={styles.description}>{tool.description}</p>
            )}

            {/* CTA buttons */}
            <div className={styles.ctaRow}>
              {tool.website && (
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaBtn}
                >
                  website ↗
                </a>
              )}
              {tool.github && (
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaGhost}
                >
                  github ↗
                </a>
              )}
            </div>

            <div className={styles.divider} />

            {/* Tags */}
            {tool.tags.length > 0 && (
              <>
                <p className={styles.sectionLabel}>tags</p>
                <div className={styles.tagCloud}>
                  {tool.tags.map((t) => (
                    <span key={t.name} className={styles.tag}>{t.name}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Right: sidebar ───────────────────────────────────── */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>tool info</span>
            </div>

            <div className={styles.metaList}>

              {tool.license && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>license</span>
                  <span className={styles.metaBadge}>{tool.license}</span>
                </div>
              )}

              {tool.year_started && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>since</span>
                  <span className={styles.metaVal}>{tool.year_started}</span>
                </div>
              )}

              {tool.difficulty && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>difficulty</span>
                  <span className={styles.metaVal}>{tool.difficulty}</span>
                </div>
              )}

              {tool.self_hosted !== null && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>self-hosted</span>
                  {tool.self_hosted
                    ? <span className={styles.metaBool}>yes</span>
                    : <span className={styles.metaVal}>no</span>
                  }
                </div>
              )}

              {tool.platforms && tool.platforms.length > 0 && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>platforms</span>
                  <div className={styles.metaPlatforms}>
                    {tool.platforms.map((p) => (
                      <span key={p} className={styles.metaPlatform}>{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {categoryGroups.length > 0 && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>category</span>
                  <div className={styles.metaCategories}>
                    {categoryGroups.map(({ parent, child }) => (
                      <span key={child.id} className={styles.metaCategory}>
                        {parent && (
                          <span className={styles.metaCategoryParent}>
                            {parent.name} /{' '}
                          </span>
                        )}
                        {child.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>

        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
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
