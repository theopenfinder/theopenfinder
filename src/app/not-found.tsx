import AsciiBackground from '@/components/AsciiBackground';
import homeStyles from './page.module.css';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <AsciiBackground />

      <div className={homeStyles.siteWrapper}>

        {/* ── Navigation ───────────────────────────────────────── */}
        <nav className={homeStyles.nav}>
          <div className={homeStyles.navLeft}>
            <a href="/" className={homeStyles.navBrand}>OpenFinder</a>
          </div>
          <div className={homeStyles.navLinks}>
            <a href="/"           className={homeStyles.navLink}>home</a>
            <a href="/tools"      className={homeStyles.navLink}>tools</a>
            <a href="/categories" className={homeStyles.navLink}>categories</a>
            <a href="/guides"     className={homeStyles.navLink}>guides</a>
            <a href="/contact"    className={homeStyles.navLink}>contact</a>
            <a href="/about"      className={homeStyles.navLink}>about</a>
          </div>
        </nav>

        {/* ── 404 content ─────────────────────────────────────── */}
        <div className={styles.body}>
          <p className={styles.code}>404</p>
          <h1 className={styles.heading}>Nothing found.</h1>
          <p className={styles.text}>
            This page may have moved, or the tool you&apos;re looking for is not listed yet.
          </p>
          <div className={styles.actions}>
            <a href="/"           className={styles.actionLink}>home →</a>
            <a href="/tools"      className={styles.actionLink}>browse tools →</a>
            <a href="/categories" className={styles.actionLink}>categories →</a>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className={homeStyles.footer}>
          <div className={homeStyles.footerLeft}>
            <span className={homeStyles.footerBrand}>OpenFinder</span>
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
