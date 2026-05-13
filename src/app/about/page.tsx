import type { Metadata } from 'next';
import AsciiBackground from '@/components/AsciiBackground';
import SystemOverview from '@/components/SystemOverview';
import SearchTimeline from './SearchTimeline';
import homeStyles from '../page.module.css';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'OpenFinder is a high-signal index of open-source software — structured, contextualized, and immediately usable.',
  openGraph: {
    title:       'About — OpenFinder',
    description: 'OpenFinder is a high-signal index of open-source software.',
    url:         'https://theopenfinder.org/about',
  },
};

const TIMELINE = [
  {
    version: 'v1',
    label: 'current',
    title: 'Directory & Discovery',
    status: 'live',
    items: [
      'Organized index of ~250 open-source tools',
      'Tool pages with use cases, license, platform, and link info',
      'Browse by category, subcategory, and tag',
      'Guides for tool stacks, workflows, and platform setups',
      'Community submissions reviewed manually before listing',
      'Email newsletter featuring new tools, updates, and guides',
      'Transparent methodology, datasets, and documentation',
    ],
  },
  {
    version: 'v2',
    label: 'next',
    title: 'Community Layer',
    status: 'planned',
    items: [
      'User accounts with bookmarks, saved tools, and collections',
      'Advanced search, filtering, and comparison features',
      'User reviews and ratings for each tool',
      'System-assisted review with automation and contributor support',
      'Newsletter highlighting new tools, updates, and notable projects',
      'Expanded guide library to 50+ articles',
      'Comparison pages (e.g. "Obsidian vs Logseq")',
    ],
  },
  {
    version: 'v3',
    label: 'future',
    title: 'Open Hub',
    status: 'planned',
    items: [
      'Forums and discussion threads per tool',
      'Community-authored guides & tutorials',
      'Reputation-based curation with contributor and maintainer input',
      'Verified maintainer profiles and project changelogs',
      'API access for developers and integrations',
      'Localization (multi-language support & regional content)',
      'Tool health and activity tracking (updates, maintenance status)',
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <AsciiBackground />

      <div className={homeStyles.siteWrapper}>

        {/* ── Navigation ───────────────────────────────────────── */}
        <nav className={homeStyles.nav}>
          <div className={homeStyles.navLeft}>
            <a href="/" className={homeStyles.navBrand}><img src="/logo1-final.png" alt="OpenFinder" className="navLogo" /></a>
          </div>
          <div className={homeStyles.navLinks}>
            <a href="/"           className={homeStyles.navLink}>home</a>
            <a href="/tools"      className={homeStyles.navLink}>tools</a>
            <a href="/categories" className={homeStyles.navLink}>categories</a>
            <a href="/guides"     className={homeStyles.navLink}>guides</a>
            <a href="/contact"    className={homeStyles.navLink}>contact</a>
            <a href="/about"      className={`${homeStyles.navLink} ${homeStyles.navLinkActive}`}>about</a>
          </div>
        </nav>

        {/* ── Mission ──────────────────────────────────────────── */}
        <section className={styles.missionSection}>

          {/* Left: text */}
          <div className={styles.missionLeft}>
            <h1 className={styles.missionHeading}>
              Great software shouldn&apos;t be hidden.
            </h1>
            <div className={styles.missionContent}>
              <p className={styles.missionBody}>
                The open-source ecosystem is vast, powerful, and largely invisible
                to the people who would benefit from it most. Discovery is fragmented.
                Tools are scattered across GitHub stars, Reddit threads, and word-of-mouth.
                If you don&apos;t already know where to look, you don&apos;t find anything.
              </p>
              <p className={styles.missionBody}>
                Most open-source projects never reach the people who need them.
                Not because they aren&apos;t good enough, but because there&apos;s no clear path to them.
                OpenFinder is built to change that: a place where tools are structured,
                contextualized, and immediately usable.
              </p>
              <p className={styles.missionBody}>
                OpenFinder is a high-signal index of open-source software, not a raw list
                of everything on GitHub. Tools are organized by category, tagged by use,
                and presented with enough context to make discovery easier.
              </p>
              <p className={styles.missionBody}>
                Access to great software shouldn&apos;t depend on knowing the right communities.
                It should be one search away.
              </p>
              <div className={styles.missionLinks}>
                <a href="https://github.com" className={styles.missionLink}>github →</a>
                <a href="/contact" className={styles.missionLink}>contact →</a>
              </div>
            </div>
          </div>

          {/* Right: system overview visualization */}
          <div className={styles.missionRight}>
            <SystemOverview />
          </div>

        </section>

        {/* ── How it's built ───────────────────────────────────── */}
        <section className={styles.infraSection}>
          <div className={styles.infraLeft}>
            <h2 className={styles.infraHeading}>How it&apos;s built.</h2>
            <p className={styles.infraBody}>
              OpenFinder is a Next.js app written in TypeScript, styled with CSS
              Modules, and deployed on Vercel. The tool directory is backed by Supabase,
              a PostgreSQL database seeded from structured CSV files via a custom script.
              The animated ASCII canvas is a hand-rolled canvas renderer that runs
              entirely client-side.
            </p>
            <p className={styles.infraBody}>
              Everything is open source. The full architecture, data schema, and
              contribution guide are documented on the docs page.
            </p>
            <a href="/docs" className={styles.infraLink}>read the docs →</a>
          </div>

          <div className={styles.stackPanel}>
            <div className={styles.stackPanelHeader}>
              <span className={styles.stackPanelTitle}>stack</span>
            </div>
            {[
              ['framework',  'Next.js 16 — App Router, SSR + Turbopack'],
              ['language',   'TypeScript'],
              ['styling',    'CSS Modules — no Tailwind, no UI library'],
              ['database',   'Supabase — PostgreSQL, service-role client'],
              ['background', 'Canvas API — custom ASCII renderer'],
              ['hosting',    'Vercel — edge CDN, automatic deploys'],
              ['source',     'GitHub — fully open source, MIT license'],
            ].map(([key, val]) => (
              <div key={key} className={styles.stackRow}>
                <span className={styles.stackKey}>{key}</span>
                <span className={styles.stackVal}>{val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Timeline ─────────────────────────────────────────── */}
        <section className={styles.timelineSection}>
          <div className={styles.timelineHeader}>
            <h2 className={styles.timelineHeading}>Where we&apos;re going</h2>
          </div>

          <div className={styles.timelineGrid}>
            {TIMELINE.map((phase) => (
              <div key={phase.version} className={`${styles.phasePane} ${phase.status === 'live' ? styles.phaseLive : ''}`}>

                {/* Pane header */}
                <div className={styles.phaseHeader}>
                  <span className={styles.phaseVersion}>{phase.version}</span>
                  <span className={styles.phaseTitle}>{phase.title}</span>
                  <span className={`${styles.phaseStatus} ${styles[`status_${phase.status}`]}`}>
                    {phase.label}
                  </span>
                </div>

                {/* Items */}
                <ul className={styles.phaseItems}>
                  {phase.items.map((item) => (
                    <li key={item} className={styles.phaseItem}>
                      <span className={styles.itemDot}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

              </div>
            ))}
          </div>

          <SearchTimeline />
        </section>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className={homeStyles.footer}>
          <div className={homeStyles.footerLeft}>
            <img src="/logo1-final.png" alt="OpenFinder" className="footerLogo" />
            <span className={homeStyles.footerTagline}>open source, easier to find.</span>
          </div>
          <div className={homeStyles.footerLinks}>
            <a href="/docs"              className={homeStyles.footerLink}>docs</a>
            <a href="https://github.com" className={homeStyles.footerLink}>github</a>
          </div>
        </footer>

      </div>
    </>
  );
}
