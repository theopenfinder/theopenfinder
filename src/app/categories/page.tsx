import type { Metadata } from 'next';
import AsciiBackground from '@/components/AsciiBackground';
import { createServerClient } from '@/lib/supabase-server';
import styles from './categories.module.css';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse open-source tools organized by category — productivity, security, media, AI, and more.',
  openGraph: {
    title:       'Categories — OpenFinder',
    description: 'Browse open-source tools by category.',
    url:         'https://theopenfinder.org/categories',
  },
};

const DISPLAY_NAMES: Record<string, string> = {
  ai: 'AI',
};

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
  education:    'Wikis, flashcard tools, and learning environments.',
  science:      'Research, bioinformatics, simulation, and scientific computing.',
};

interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  subcategories: Array<{ name: string; slug: string }>;
}

async function getCategories(): Promise<CategoryRow[]> {
  const supabase = createServerClient();

  const [{ data: cats }, { data: subs }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug')
      .is('parent_id', null)
      .order('name'),
    supabase
      .from('categories')
      .select('id, name, slug, parent_id')
      .not('parent_id', 'is', null)
      .order('name'),
  ]);

  const subsByParent: Record<number, Array<{ name: string; slug: string }>> = {};
  for (const sub of subs ?? []) {
    if (!subsByParent[sub.parent_id]) subsByParent[sub.parent_id] = [];
    subsByParent[sub.parent_id].push({ name: sub.name, slug: sub.slug });
  }

  return (cats ?? []).map(cat => ({
    id:            cat.id,
    name:          cat.name,
    slug:          cat.slug,
    subcategories: subsByParent[cat.id] ?? [],
  }));
}

const MAX_SUBS_SHOWN = 5;

export default async function CategoriesPage() {
  const categories = await getCategories();

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

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className={styles.header}>
          <h1 className={styles.heading}>categories</h1>
        </header>

        {/* ── Category grid ───────────────────────────────────────── */}
        <div className={styles.grid}>
          {categories.map(cat => {
            const desc = DESCRIPTIONS[cat.slug] ?? `Open-source tools in the ${cat.name} category.`;
            const shown = cat.subcategories.slice(0, MAX_SUBS_SHOWN);
            const overflow = cat.subcategories.length - shown.length;

            return (
              <a key={cat.id} href={`/categories/${cat.slug}`} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{DISPLAY_NAMES[cat.slug] ?? cat.name.toLowerCase()}</span>
                  {cat.subcategories.length > 0 && (
                    <span className={styles.cardSubCount}>
                      {cat.subcategories.length} subcategories
                    </span>
                  )}
                </div>

                <p className={styles.cardDesc}>{desc}</p>

                {shown.length > 0 && (
                  <div className={styles.cardSubs}>
                    {shown.map(sub => (
                      <span key={sub.slug} className={styles.cardSub}>
                        {sub.name.replace(/-/g, '‑')}
                      </span>
                    ))}
                    {overflow > 0 && (
                      <span className={styles.cardSubMore}>+{overflow} more</span>
                    )}
                    <span className={styles.cardArrow}>→</span>
                  </div>
                )}
              </a>
            );
          })}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <img src="/logo1-final.png" alt="OpenFinder" className="footerLogo" />
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
