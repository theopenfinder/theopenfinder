import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AsciiBackground from '@/components/AsciiBackground';
import { getGuideBySlug, getAllGuideSlugs } from '@/content/guides';
import type { ContentBlock } from '@/content/guides/types';
import homeStyles from '../../page.module.css';
import styles from './guide-page.module.css';

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: 'Guide Not Found' };

  const desc = guide.description.slice(0, 155);
  return {
    title: `${guide.title} — OpenFinder`,
    description: desc,
    openGraph: {
      title: `${guide.title} — OpenFinder`,
      description: desc,
      url: `https://theopenfinder.org/guides/${slug}`,
    },
  };
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function linkifyText(
  text: string,
  toolLinks: Record<string, string | null> | undefined
): ReactNode {
  if (!toolLinks) return text;
  const names = Object.keys(toolLinks);
  if (names.length === 0) return text;

  const sorted = [...names].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`);

  return text.split(pattern).map((part, i) => {
    if (Object.prototype.hasOwnProperty.call(toolLinks, part)) {
      const id = toolLinks[part];
      if (id !== null) {
        return (
          <a key={i} href={`/tools/${id}`} className={styles.toolLink}>
            {part}
          </a>
        );
      }
      return (
        <span key={i}>
          {part}
          <span className={styles.notInCatalog}>NOT IN CATALOG</span>
        </span>
      );
    }
    return part;
  });
}

function renderBlock(
  block: ContentBlock,
  i: number,
  toolLinks?: Record<string, string | null>
): ReactNode {
  switch (block.type) {
    case 'heading':
      if (block.level === 2) {
        return (
          <h2 key={i} className={styles.bodyH2}>
            {block.text}
          </h2>
        );
      }
      return (
        <h3 key={i} className={styles.bodyH3}>
          {block.text}
        </h3>
      );

    case 'paragraph':
      return (
        <p key={i} className={styles.bodyP}>
          {linkifyText(block.text, toolLinks)}
        </p>
      );

    case 'list':
      return block.ordered ? (
        <ol key={i} className={styles.bodyOl}>
          {block.items.map((item, j) => (
            <li key={j} className={styles.bodyLi}>
              {linkifyText(item, toolLinks)}
            </li>
          ))}
        </ol>
      ) : (
        <ul key={i} className={styles.bodyUl}>
          {block.items.map((item, j) => (
            <li key={j} className={styles.bodyLi}>
              {linkifyText(item, toolLinks)}
            </li>
          ))}
        </ul>
      );

    case 'callout':
      return (
        <div key={i} className={styles.bodyCallout}>
          {linkifyText(block.text, toolLinks)}
        </div>
      );

    case 'divider':
      return <hr key={i} className={styles.bodyDivider} />;

    case 'image':
      return (
        <figure key={i} className={styles.bodyFigure}>
          <Image
            src={block.src}
            alt={block.alt}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 800px"
            style={{ width: '100%', height: 'auto' }}
            className={styles.bodyImage}
          />
          {block.caption && (
            <figcaption className={styles.bodyCaption}>{block.caption}</figcaption>
          )}
        </figure>
      );

    case 'video': {
      let embedSrc: string | null = null;
      if (block.provider === 'youtube' && block.videoId) {
        embedSrc = `https://www.youtube-nocookie.com/embed/${block.videoId}`;
      } else if (block.provider === 'vimeo' && block.videoId) {
        embedSrc = `https://player.vimeo.com/video/${block.videoId}`;
      } else if (block.provider === 'peertube' && block.url) {
        embedSrc = block.url;
      }
      if (!embedSrc) return null;
      return (
        <figure key={i} className={styles.bodyFigure}>
          <div className={styles.bodyVideoWrapper}>
            <iframe
              src={embedSrc}
              title={block.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.bodyVideoFrame}
            />
          </div>
          {block.caption && (
            <figcaption className={styles.bodyCaption}>{block.caption}</figcaption>
          )}
        </figure>
      );
    }

    default:
      return null;
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  return (
    <>
      <AsciiBackground />

      <div className={homeStyles.siteWrapper}>

        {/* ── Navigation ─────────────────────────────────────────── */}
        <nav className={homeStyles.nav}>
          <div className={homeStyles.navLeft}>
            <a href="/" className={homeStyles.navBrand}>
              <img src="/logo1-final.png" alt="OpenFinder" className="navLogo" />
            </a>
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

        {/* ── Breadcrumb where type eyebrow was ──────────────────── */}
        <div className={styles.breadcrumb}>
          <a href="/guides" className={styles.breadcrumbLink}>guides</a>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{guide.title}</span>
        </div>

        {/* ── Two-column layout: sidebar starts same row as title ── */}
        <div className={styles.layout}>

          <div className={styles.mainCol}>

            {/* ── Guide header ───────────────────────────────────── */}
            <header className={styles.guideHeader}>
              <h1 className={styles.guideTitle}>{guide.title}</h1>
              {guide.updatedDate && (
                <span className={styles.guideDate}>
                  updated {formatDate(guide.updatedDate)}
                </span>
              )}
            </header>

            {/* ── Body ───────────────────────────────────────────── */}
            <article className={styles.body}>
              {guide.body.map((block, i) => renderBlock(block, i, guide.toolLinks))}
            </article>

          </div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside className={styles.sidebar}>

            {/* Meta panel */}
            <div className={styles.sidebarPanel}>
              <div className={styles.sidebarHeader}>
                <span className={styles.sidebarLabel}>guide info</span>
              </div>
              <div className={styles.sidebarBody}>

                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>type</span>
                  <span className={styles.metaVal}>{guide.type}</span>
                </div>

                {guide.updatedDate && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaKey}>updated</span>
                    <span className={styles.metaVal}>{formatDate(guide.updatedDate)}</span>
                  </div>
                )}

                {guide.tools && guide.tools.length > 0 && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaKey}>tools</span>
                    <div className={styles.metaTagList}>
                      {guide.tools.map((t) => (
                        <span key={t} className={styles.metaTag}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {guide.relatedTags && guide.relatedTags.length > 0 && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaKey}>tags</span>
                    <div className={styles.metaTagList}>
                      {guide.relatedTags.map((tag) => (
                        <span key={tag} className={styles.metaTag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Back link */}
            <a href="/guides" className={styles.backLink}>← all guides</a>

          </aside>

        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
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
