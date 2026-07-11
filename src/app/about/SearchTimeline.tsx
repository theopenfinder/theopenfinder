'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './about.module.css';

const NODES = [
  {
    type: "layer_1:",
    title: "advanced catalog search",
    features: [
      "Taxonomy-aware ranking across tools, categories, tags, platforms, and descriptions.",
    ],
    infra: [
      "Next.js, Supabase, client-side TypeScript scoring.",
    ],
  },
  {
    type: "layer_2:",
    title: "intent-aware search",
    features: [
      `Aliases and use-case metadata translate common phrases and "alternative to" searches into OpenFinder's taxonomy.`,
    ],
    infra: [
      "search aliases, use-case fields, alternative mappings.",
    ],
  },
  {
    type: "layer_3:",
    title: "database-backed search",
    features: [
      "Postgres handles full-text search, fuzzy matching, indexing, ranking, and pagination as the catalog grows.",
    ],
    infra: [
      "Supabase FTS, pg_trgm, indexes, RPC search function.",
    ],
  },
  {
    type: "layer_4:",
    title: "dedicated search engine",
    features: [
      "A specialized search layer adds instant search, stronger typo tolerance, facets, synonyms, ranking controls, and analytics.",
    ],
    infra: [
      "Meilisearch or Typesense, Supabase sync, scheduled indexing.",
    ],
  },
];

export default function SearchTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.stRoot} ${active ? styles.stActive : ''}`}>

      {/* Label row: grid-row 1, spans all 4 columns, centered */}
      <div className={styles.stLabelRow}>
        <span className={styles.stSectionLabel}>search roadmap</span>
      </div>

      {/* Line row: grid-row 3, spans all 4 columns */}
      <div className={styles.stLineRow}>
        {NODES.map((node, i) => (
          <div
            key={node.type}
            className={styles.stDotCell}
            style={{ '--st-delay': `${i * 0.9}s` } as React.CSSProperties}
          >
            <span className={styles.stDot}>×</span>
          </div>
        ))}
      </div>

      {/* Per-node content: display:contents makes stCol transparent to the grid */}
      {NODES.map((node, i) => (
        <div key={node.type} className={styles.stCol}>

          {/* Top branch: feature callout — placed in grid row 2 (desktop only) */}
          <div
            className={styles.stTopBranch}
            style={{
              '--st-delay': `${i * 0.9}s`,
              gridColumn: i + 1,
              gridRow: 2,
            } as React.CSSProperties}
          >
            <ul className={styles.stItems}>
              {node.features.map((f) => (
                <li key={f} className={styles.stItem}>
                  <span className={styles.stItemDash}>—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom branch: type label + infra — placed in grid row 4 (desktop only) */}
          <div
            className={styles.stBottomBranch}
            style={{
              '--st-delay': `${i * 0.9}s`,
              gridColumn: i + 1,
              gridRow: 4,
            } as React.CSSProperties}
          >
            <div className={styles.stNodeId}>
              <span className={styles.stTypeTag}>{node.type}</span>
              <span className={styles.stNodeTitle}>{node.title}</span>
            </div>
            <ul className={styles.stItems}>
              {node.infra.map((f) => (
                <li key={f} className={styles.stItem}>
                  <span className={styles.stItemDash}>—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile card: type+title on same line, then feature, then infra */}
          <div className={styles.stMobileCard}>
            {i === 0 && <span className={styles.stSectionLabel}>search roadmap</span>}
            <div className={styles.stMobileHeader}>
              <span className={styles.stTypeTag}>{node.type}</span>
              <span className={styles.stNodeTitle}>{node.title}</span>
            </div>
            <ul className={styles.stItems}>
              {node.features.map((f) => (
                <li key={f} className={styles.stItem}>
                  <span className={styles.stItemDash}>—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <ul className={styles.stItems}>
              {node.infra.map((f) => (
                <li key={f} className={styles.stItem}>
                  <span className={styles.stItemDash}>—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      ))}

    </div>
  );
}
