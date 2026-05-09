'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './about.module.css';

const NODES = [
  {
    type: "Layer 1",
    title: "Advanced catalog search",
    features: [
      "Taxonomy-aware ranking across tools, categories, tags, platforms, and descriptions.",
    ],
    infra: [
      "Next.js, Supabase, client-side TypeScript scoring.",
    ],
  },
  {
    type: "Layer 2",
    title: "Intent-aware search",
    features: [
      `Aliases and use-case metadata translate common phrases and "alternative to" searches into OpenFinder's taxonomy.`,
    ],
    infra: [
      "search aliases, use-case fields, alternative mappings.",
    ],
  },
  {
    type: "Layer 3",
    title: "Database-backed search",
    features: [
      "Postgres handles full-text search, fuzzy matching, indexing, ranking, and pagination as the catalog grows.",
    ],
    infra: [
      "Supabase FTS, pg_trgm, indexes, RPC search function.",
    ],
  },
  {
    type: "Layer 4",
    title: "Dedicated search engine",
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

      {/* Line row: grid-row 2, spans all 4 columns */}
      <div className={styles.stLineRow}>
        {NODES.map((node, i) => (
          <div
            key={node.type}
            className={styles.stDotCell}
            style={{ '--st-delay': `${i * 0.5}s` } as React.CSSProperties}
          >
            <div className={styles.stDot} />
          </div>
        ))}
      </div>

      {/* Per-node content: display:contents makes stCol transparent to the grid */}
      {NODES.map((node, i) => (
        <div key={node.type} className={styles.stCol}>

          {/* Top branch: feature callout — placed in grid row 1 */}
          <div
            className={styles.stTopBranch}
            style={{
              '--st-delay': `${i * 0.5}s`,
              gridColumn: i + 1,
              gridRow: 1,
            } as React.CSSProperties}
          >
            {i === 0 && <span className={styles.stSectionLabel}>SEARCH ROADMAP</span>}
            <ul className={styles.stItems}>
              {node.features.map((f) => (
                <li key={f} className={styles.stItem}>
                  <span className={styles.stItemDash}>—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom branch: type label + infra — placed in grid row 3 */}
          <div
            className={styles.stBottomBranch}
            style={{
              '--st-delay': `${i * 0.5}s`,
              gridColumn: i + 1,
              gridRow: 3,
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

        </div>
      ))}

    </div>
  );
}
