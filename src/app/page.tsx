import AsciiBackground from '@/components/AsciiBackground';
import GuidesScroll from '@/components/GuidesScroll';
import TerminalStats from '@/components/TerminalStats';
import styles from './page.module.css';

// ── Platform abbreviation map ──────────────────────────────────────────────────
const PLAT: Record<string, string> = {
  linux: 'lnx', macos: 'mac', windows: 'win',
  android: 'and', ios: 'ios', web: 'web',
};

// ── Tools data ─────────────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: 'gimp',
    name: 'GIMP',
    category: 'Design',
    subcategory: 'image-editing',
    license: 'GPL-3.0',
    platforms: 'linux|macos|windows',
    tags: 'cross-platform|offline-capable|plugin-based|extensible',
    year: 1995,
  },
  {
    id: 'blender',
    name: 'Blender',
    category: 'Design',
    subcategory: '3d-modeling',
    license: 'GPL-3.0',
    platforms: 'linux|macos|windows',
    tags: 'cross-platform|animation|extensible|customizable',
    year: 1994,
  },
  {
    id: 'obs',
    name: 'OBS Studio',
    category: 'Media',
    subcategory: 'screen-recording',
    license: 'GPL-2.0',
    platforms: 'linux|macos|windows',
    tags: 'real-time|cross-platform|plugin-based|customizable',
    year: 2012,
  },
  {
    id: 'libreoffice',
    name: 'LibreOffice',
    category: 'Productivity',
    subcategory: 'document-editing',
    license: 'MPL-2.0',
    platforms: 'linux|macos|windows',
    tags: 'cross-platform|offline-capable|beginner-friendly',
    year: 2010,
  },
  {
    id: 'keepassxc',
    name: 'KeePassXC',
    category: 'Security',
    subcategory: 'password-managers',
    license: 'GPL-2.0',
    platforms: 'linux|macos|windows',
    tags: 'encrypted|privacy-focused|offline-capable|local-first',
    year: 2016,
  },
  {
    id: 'languagetool',
    name: 'LanguageTool',
    category: 'Productivity',
    subcategory: 'learning',
    license: 'LGPL',
    platforms: 'web|linux|macos|windows',
    tags: 'api|cross-platform|real-time|self-hosted',
    year: 2005,
  },
  {
    id: 'latex-gboard',
    name: 'LaTeX Gboard Dict.',
    category: 'Utilities',
    subcategory: 'language-learning',
    license: 'MIT',
    platforms: 'android',
    tags: 'lightweight|local-first|customizable',
    year: 2021,
  },
  {
    id: 'owncast',
    name: 'Owncast',
    category: 'Media',
    subcategory: 'streaming',
    license: 'MIT',
    platforms: 'web|linux|macos|windows',
    tags: 'self-hosted|real-time|multi-user|server-based',
    year: 2020,
  },
  {
    id: 'vlc',
    name: 'VLC Media Player',
    category: 'Media',
    subcategory: 'media-players',
    license: 'LGPL',
    platforms: 'linux|macos|windows|android|ios',
    tags: 'cross-platform|offline-capable|no-tracking',
    year: 2001,
  },
];

// ── Categories data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Productivity',  count: 22, desc: 'Notes, tasks, calendars, and collaboration',       subs: ['notes', 'tasks', 'calendars', 'collaboration'] },
  { name: 'Education',     count: 12, desc: 'Wikis, flashcards, courses, and references',        subs: ['wikis', 'flashcards', 'courses', 'references'] },
  { name: 'Development',   count: 38, desc: 'IDEs, CLIs, version control, and devtools',         subs: ['IDEs', 'CLIs', 'version control', 'devtools'] },
  { name: 'Design',        count: 24, desc: 'Creative tools, editors, and asset managers',       subs: ['image editing', '3d modeling', 'vector', 'UI design'] },
  { name: 'Media',         count: 18, desc: 'Players, streaming, editing, and broadcasting',     subs: ['players', 'streaming', 'screen recording', 'podcasting'] },
  { name: 'AI',            count: 14, desc: 'Local models, frameworks, and AI tools',            subs: ['local models', 'frameworks', 'inference', 'assistants'] },
  { name: 'Security',      count: 15, desc: 'Password managers, auditing, and encryption',       subs: ['password managers', 'VPN', 'encryption', 'auditing'] },
  { name: 'Privacy',       count: 11, desc: 'VPNs, trackers, ad-blocking, and anonymity',        subs: ['browsers', 'ad-blocking', 'proxies', 'anonymity'] },
  { name: 'Data',          count: 9,  desc: 'Databases, analytics, and data management',         subs: ['databases', 'analytics', 'visualization', 'pipelines'] },
  { name: 'Utilities',     count: 16, desc: 'System tools, automation, and file management',     subs: ['file management', 'automation', 'system tools', 'terminals'] },
];

// ── Quick start guides ─────────────────────────────────────────────────────────
const QUICK_START = [
  {
    type: 'guide',
    title: 'GitHub for Newcomers',
    desc: 'Find, star, and fork projects. Understand repos, issues, and how to navigate the largest open-source hub in the world.',
    href: '/guides',
  },
  {
    type: 'guide',
    title: 'Open Source 101',
    desc: 'What open-source means, how licenses work, and how to get the most out of free software without compromise.',
    href: '/guides',
  },
  {
    type: 'starter pack',
    title: 'Privacy Starter Pack',
    desc: 'Replace the most data-hungry tools in your everyday life with curated open-source alternatives — in a weekend.',
    href: '/guides',
  },
];

// ── Guides data ────────────────────────────────────────────────────────────────
const GUIDES = [
  {
    type: 'starter pack',
    title: 'De-Google Your Life',
    desc: 'Replace every Google product with a curated open-source alternative — step by step.',
    tools: ['Nextcloud', 'Brave', 'ProtonMail', 'Organic Maps'],
    href: '#',
  },
  {
    type: 'workflow',
    title: 'Self-Host Your Stack',
    desc: 'Infrastructure essentials for the privacy-conscious developer. Your data stays yours.',
    tools: ['Coolify', 'Traefik', 'Uptime Kuma', 'Vaultwarden'],
    href: '#',
  },
  {
    type: 'starter pack',
    title: 'Open Design Suite',
    desc: 'Professional-grade creative tools without a subscription — for designers who value freedom.',
    tools: ['Inkscape', 'Penpot', 'Blender', 'GIMP'],
    href: '#',
  },
  {
    type: 'workflow',
    title: 'Privacy-First Browsing',
    desc: 'A layered browser + extension setup that keeps trackers, ads, and surveillance at bay.',
    tools: ['Firefox', 'uBlock Origin', 'LibreWolf', 'Mullvad'],
    href: '#',
  },
  {
    type: 'guide',
    title: 'AI Without Big Tech',
    desc: 'Run powerful language models locally. No API keys, no data sent to the cloud.',
    tools: ['Ollama', 'LM Studio', 'Open WebUI', 'llama.cpp'],
    href: '#',
  },
  {
    type: 'starter pack',
    title: 'Developer Essentials',
    desc: 'Terminal, editor, version control, and productivity tools — a complete open-source workflow.',
    tools: ['Neovim', 'Zellij', 'Gitui', 'Fish Shell'],
    href: '#',
  },
  {
    type: 'guide',
    title: 'Home Lab Starter',
    desc: 'Everything you need to run your first home server and start self-hosting in a weekend.',
    tools: ['Proxmox', 'Home Assistant', 'Pi-hole', 'Portainer'],
    href: '#',
  },
  {
    type: 'workflow',
    title: 'Open Media Stack',
    desc: 'Manage, stream, and enjoy your music, video, and photos without platform lock-in.',
    tools: ['Jellyfin', 'Navidrome', 'Immich', 'Kavita'],
    href: '#',
  },
];

export default function Home() {
  return (
    <>
      <AsciiBackground />

      <div className={styles.siteWrapper}>

        {/* ── Navigation ─────────────────────────────────────────── */}
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <a href="/" className={styles.navBrand}><img src="/logo1-final.png" alt="OpenFinder" className="navLogo" /></a>
          </div>
          <div className={styles.navLinks}>
            <a href="/"            className={`${styles.navLink} ${styles.navLinkActive}`}>home</a>
            <a href="/tools"       className={styles.navLink}>tools</a>
            <a href="/categories"  className={styles.navLink}>categories</a>
            <a href="/guides"      className={styles.navLink}>guides</a>
            <a href="/contact"     className={styles.navLink}>contact</a>
            <a href="/about"       className={styles.navLink}>about</a>
          </div>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <h1 className={styles.heroHeading}>
            A clearer way to find<br />open-source tools.
          </h1>
          <div className={styles.heroBody}>
            <p>
              OpenFinder is a discovery hub for open-source tools and
              alternatives across every category. Curated for quality,
              organized for clarity — built to help anyone find the
              right tool.
            </p>
          </div>
          <div className={styles.heroCta}>
            <a href="/tools" className={styles.ctaBtn}>browse tools</a>
            <a href="/categories" className={styles.ctaLink}>view categories →</a>
          </div>
        </section>

        {/* ── Terminal stats ──────────────────────────────────────── */}
        <TerminalStats />

        {/* ── Quick Start ────────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.quickStartGrid}>
            {QUICK_START.map(card => (
              <a key={card.title} href={card.href} className={styles.quickStartCard}>
                <div className={styles.quickStartCardBar}>
                  <span className={styles.quickStartLabel}>quick start</span>
                </div>
                <div className={styles.quickStartCardBody}>
                  <p className={styles.quickStartCardTitle}>{card.title}</p>
                  <p className={styles.quickStartCardDesc}>{card.desc}</p>
                  <span className={styles.quickStartCardCta}>start →</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Featured Tools ─────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.toolPanel}>
            {/* Section title row */}
            <div className={styles.windowHeader}>
              <h2 className={styles.windowTitle}>featured tools</h2>
              <a href="/tools" className={styles.sectionLink}>see all tools →</a>
            </div>

            <div className={styles.tableScrollWrapper}>
              {/* Column label row */}
              <div className={styles.toolHeader}>
              <span className={styles.toolHeaderCell}>#</span>
              <span className={styles.toolHeaderCell}>name</span>
              <span className={styles.toolHeaderCell}>category</span>
              <span className={styles.toolHeaderCell}>subcategory</span>
              <span className={styles.toolHeaderCell}>license</span>
              <span className={styles.toolHeaderCell}>platforms</span>
              <span className={styles.toolHeaderCell}>tags</span>
              <span className={styles.toolHeaderCell}>year</span>
            </div>

            {/* Data rows */}
            {TOOLS.map((tool, i) => (
              <a key={tool.id} href={`/tools/${tool.id}`} className={styles.toolRow}>
                <span className={styles.toolIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.toolName}>{tool.name}</span>
                <span className={styles.toolCell}>{tool.category}</span>
                <span className={styles.toolCell}>
                  {tool.subcategory.split('|')[0].replace(/-/g, ' ')}
                </span>
                <span className={styles.toolCell}>{tool.license}</span>
                <span className={styles.toolCell}>
                  {tool.platforms.split('|').map(p => PLAT[p] ?? p).join(' · ')}
                </span>
                <span className={styles.toolCell}>
                  {tool.tags.split('|').slice(0, 3).join(' · ')}
                </span>
                <span className={styles.toolYear}>{tool.year}</span>
              </a>
            ))}
          </div>
          </div>
        </section>

        {/* ── Browse Categories ───────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.panel}>
            <div className={styles.windowHeader}>
              <h2 className={styles.windowTitle}>browse by category</h2>
              <a href="/categories" className={styles.sectionLink}>full taxonomy →</a>
            </div>
            <div className={styles.tableScrollWrapper}>
              {/* Column label row */}
              <div className={styles.catHeader}>
              <span className={styles.catHeaderCell}>#</span>
              <span className={styles.catHeaderCell}>category</span>
              <span className={styles.catHeaderCell}>subcategories</span>
              <span className={styles.catHeaderCell}>description</span>
              <span className={styles.catHeaderCell}>tools</span>
            </div>

            {/* Data rows */}
            {CATEGORIES.map((cat, i) => (
              <a
                key={cat.name}
                href={`/categories/${cat.name.toLowerCase()}`}
                className={styles.catRow}
              >
                <span className={styles.catIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.catName}>{cat.name}</span>
                <span className={styles.catSubs}>{cat.subs.join(' · ')}</span>
                <span className={styles.catDesc}>{cat.desc}</span>
                <span className={styles.catCount}>{cat.count}</span>
              </a>
            ))}
          </div>
          </div>
        </section>

        {/* ── Setup & Guides ─────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>setups &amp; guides</h2>
            <a href="/guides" className={styles.sectionLink}>all guides →</a>
          </div>
          <GuidesScroll guides={GUIDES} />
        </section>

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
