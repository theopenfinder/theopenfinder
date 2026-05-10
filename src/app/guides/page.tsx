import type { Metadata } from 'next';
import AsciiBackground from '@/components/AsciiBackground';
import homeStyles from '../page.module.css';
import styles from './guides.module.css';

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Curated open-source guides, starter packs, and workflows for privacy, productivity, and self-hosting.',
  openGraph: {
    title:       'Guides — OpenFinder',
    description: 'Curated guides, starter packs, and workflows for open-source software.',
    url:         'https://theopenfinder.org/guides',
  },
};

const GUIDES = [
  {
    id: 'de-google',
    type: 'starter pack',
    title: 'De-Google Your Life',
    desc: 'Replace every Google product with a curated open-source alternative — step by step.',
    tools: ['Nextcloud', 'Brave', 'ProtonMail', 'Organic Maps'],
  },
  {
    id: 'self-host-stack',
    type: 'workflow',
    title: 'Self-Host Your Stack',
    desc: 'Infrastructure essentials for the privacy-conscious developer. Your data stays yours.',
    tools: ['Coolify', 'Traefik', 'Uptime Kuma', 'Vaultwarden'],
  },
  {
    id: 'open-design-suite',
    type: 'starter pack',
    title: 'Open Design Suite',
    desc: 'Professional-grade creative tools without a subscription — for designers who value freedom.',
    tools: ['Inkscape', 'Penpot', 'Blender', 'GIMP'],
  },
  {
    id: 'privacy-browsing',
    type: 'workflow',
    title: 'Privacy-First Browsing',
    desc: 'A layered browser + extension setup that keeps trackers, ads, and surveillance at bay.',
    tools: ['Firefox', 'uBlock Origin', 'LibreWolf', 'Mullvad'],
  },
  {
    id: 'ai-without-big-tech',
    type: 'guide',
    title: 'AI Without Big Tech',
    desc: 'Run powerful language models locally. No API keys, no data sent to the cloud.',
    tools: ['Ollama', 'LM Studio', 'Open WebUI', 'llama.cpp'],
  },
  {
    id: 'developer-essentials',
    type: 'starter pack',
    title: 'Developer Essentials',
    desc: 'Terminal, editor, version control, and productivity tools — a complete open-source workflow.',
    tools: ['Neovim', 'Zellij', 'Gitui', 'Fish Shell'],
  },
  {
    id: 'home-lab-starter',
    type: 'guide',
    title: 'Home Lab Starter',
    desc: 'Everything you need to run your first home server and start self-hosting in a weekend.',
    tools: ['Proxmox', 'Home Assistant', 'Pi-hole', 'Portainer'],
  },
  {
    id: 'open-media-stack',
    type: 'workflow',
    title: 'Open Media Stack',
    desc: 'Manage, stream, and enjoy your music, video, and photos without platform lock-in.',
    tools: ['Jellyfin', 'Navidrome', 'Immich', 'Kavita'],
  },
];

export default function GuidesPage() {
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
            <a href="/guides"     className={`${homeStyles.navLink} ${homeStyles.navLinkActive}`}>guides</a>
            <a href="/contact"    className={homeStyles.navLink}>contact</a>
            <a href="/about"      className={homeStyles.navLink}>about</a>
          </div>
        </nav>

        {/* ── Page header ──────────────────────────────────────── */}
        <section className={styles.pageHeader}>
          <h1 className={styles.pageHeading}>guides</h1>
        </section>

        {/* ── Guides listing ───────────────────────────────────── */}
        <div className={styles.guidesList}>
          {GUIDES.map((guide) => (
            <a key={guide.id} href={`/guides/${guide.id}`} className={styles.guidePane}>

              {/* Window header bar */}
              <div className={styles.paneHeader}>
                <span className={styles.paneType}>{guide.type}</span>
                <span className={styles.paneTitle}>{guide.title}</span>
                <span className={styles.readMore}>read more →</span>
              </div>

              {/* Content body */}
              <div className={styles.paneBody}>
                <p className={styles.paneDesc}>{guide.desc}</p>
                <span className={styles.paneTools}>
                  {guide.tools.join(' · ')}
                </span>
              </div>

            </a>
          ))}
        </div>

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
