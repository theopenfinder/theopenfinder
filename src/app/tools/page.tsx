import type { Metadata } from 'next';
import AsciiBackground from '@/components/AsciiBackground';
import { createServerClient } from '@/lib/supabase-server';
import ToolsClient, { type ToolRow } from './ToolsClient';
import styles from './tools.module.css';

export const metadata: Metadata = {
  title: 'Browse Tools',
  description: 'Search and filter 200+ curated open-source tools by category, platform, and tag.',
  openGraph: {
    title:       'Browse Tools — OpenFinder',
    description: 'Search and filter 200+ curated open-source tools.',
    url:         'https://theopenfinder.org/tools',
  },
};

async function getTools(): Promise<ToolRow[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('tools')
    .select(`
      id, name, description, license, platforms, difficulty, self_hosted, year_started,
      tool_tags ( tags ( name ) ),
      tool_categories ( categories ( slug, parent_id ) )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to fetch tools:', error.message);
    return [];
  }

  return (data ?? []).map((t: any) => {
    const catEntries = (t.tool_categories ?? [])
      .map((tc: any) => tc.categories)
      .filter(Boolean);
    return {
      id:            t.id,
      name:          t.name,
      description:   t.description,
      license:       t.license,
      platforms:     t.platforms,
      difficulty:    t.difficulty,
      self_hosted:   t.self_hosted,
      year_started:  t.year_started,
      tagNames:      (t.tool_tags ?? []).map((tt: any) => tt.tags?.name).filter(Boolean) as string[],
      categorySlugs: catEntries.filter((c: any) => c.parent_id === null).map((c: any) => c.slug as string),
      subcatSlugs:   catEntries.filter((c: any) => c.parent_id !== null).map((c: any) => c.slug as string),
    };
  });
}

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <>
      <AsciiBackground />

      <div className={styles.siteWrapper}>

        {/* ── Navigation ─────────────────────────────────────────── */}
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <a href="/" className={styles.navBrand}>OpenFinder</a>
          </div>
          <div className={styles.navLinks}>
            <a href="/"           className={styles.navLink}>home</a>
            <a href="/tools"      className={`${styles.navLink} ${styles.navLinkActive}`}>tools</a>
            <a href="/categories" className={styles.navLink}>categories</a>
            <a href="/guides"     className={styles.navLink}>guides</a>
            <a href="/contact"    className={styles.navLink}>contact</a>
            <a href="/about"      className={styles.navLink}>about</a>
          </div>
        </nav>

        {/* ── Page header ────────────────────────────────────────── */}
        <header className={styles.header}>
          <h1 className={styles.heading}>tools</h1>
        </header>

        {/* ── Toolbar + grid (client) ─────────────────────────────── */}
        <ToolsClient tools={tools} />

        {/* ── Footer ─────────────────────────────────────────────── */}
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
