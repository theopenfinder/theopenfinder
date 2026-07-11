import type { Metadata } from 'next';
import AsciiBackground from '@/components/AsciiBackground';
import { guides } from '@/content/guides';
import homeStyles from '../page.module.css';
import styles from './guides.module.css';

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Practical guides, stacks, and workflows for privacy, productivity, and self-hosting.',
  openGraph: {
    title:       'Guides — OpenFinder',
    description: 'Practical guides, stacks, and workflows for open-source software.',
    url:         'https://theopenfinder.org/guides',
  },
};

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
          {guides.map((guide) => (
            <a key={guide.slug} href={`/guides/${guide.slug}`} className={styles.guidePane}>

              {/* Window header bar */}
              <div className={styles.paneHeader}>
                <span className={styles.paneType}>{guide.type}</span>
                <span className={styles.paneTitle}>{guide.title}</span>
                <span className={styles.readMore}>read more →</span>
              </div>

              {/* Content body */}
              <div className={styles.paneBody}>
                <p className={styles.paneDesc}>{guide.description}</p>
                {guide.tools && guide.tools.length > 0 && (
                  <span className={styles.paneTools}>
                    {guide.tools.join(' · ')}
                  </span>
                )}
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
