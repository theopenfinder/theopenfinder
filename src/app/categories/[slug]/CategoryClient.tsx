'use client';

import { useState, useMemo } from 'react';
import styles from './category.module.css';

const PLAT_LABELS: Record<string, string> = {
  linux: 'linux', macos: 'macos', windows: 'win',
  android: 'android', ios: 'ios', web: 'web',
};

export interface SubcategoryRow {
  id: number;
  name: string;
  slug: string;
}

export interface ToolCard {
  id: string;
  name: string;
  description: string | null;
  license: string | null;
  platforms: string[] | null;
  difficulty: string | null;
  self_hosted: boolean | null;
  year_started: number | null;
  tagNames: string[];
  subcategoryIds: number[];
}

interface Props {
  subcategories: SubcategoryRow[];
  tools: ToolCard[];
}

function Card({ tool }: { tool: ToolCard }) {
  return (
    <a href={`/tools/${tool.id}`} className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardName}>{tool.name}</span>
        {tool.year_started && (
          <span className={styles.cardYear}>{tool.year_started}</span>
        )}
      </div>

      {tool.description && (
        <p className={styles.cardDesc}>{tool.description}</p>
      )}

      {tool.platforms && tool.platforms.length > 0 && (
        <div className={styles.cardPlatforms}>
          {tool.platforms.map(p => (
            <span key={p} className={styles.cardPlatform}>
              {PLAT_LABELS[p] ?? p}
            </span>
          ))}
        </div>
      )}

      <div className={styles.cardMeta}>
        {tool.license    && <span className={styles.cardLicense}>{tool.license}</span>}
        {tool.difficulty && <span className={styles.cardDifficulty}>{tool.difficulty}</span>}
        {tool.self_hosted && <span className={styles.cardSelfHosted}>self-hosted</span>}
        <span className={styles.cardArrow}>→</span>
      </div>
    </a>
  );
}

export default function CategoryClient({ subcategories, tools }: Props) {
  const [activeSubcat, setActiveSubcat] = useState<number | null>(null);
  const [query,        setQuery]        = useState('');
  const [view,         setView]         = useState<'grouped' | 'flat'>('grouped');

  const isFiltered = query.length > 0 || activeSubcat !== null;

  function clearAll() {
    setQuery('');
    setActiveSubcat(null);
  }

  // Tool count per subcategory (unfiltered, for chips)
  const subcatCounts = useMemo(() => {
    const map: Record<number, number> = {};
    for (const sub of subcategories) {
      map[sub.id] = tools.filter(t => t.subcategoryIds.includes(sub.id)).length;
    }
    return map;
  }, [tools, subcategories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools
      .filter(tool => {
        if (activeSubcat !== null && !tool.subcategoryIds.includes(activeSubcat)) return false;
        if (q) {
          const hay = [tool.name, tool.description ?? '', ...tool.tagNames].join(' ').toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tools, activeSubcat, query]);

  // Groups: only in grouped view when no subcategory is active
  const groups = useMemo(() => {
    if (view === 'flat' || activeSubcat !== null) return null;
    return subcategories
      .map(sub => ({
        sub,
        tools: filtered.filter(t => t.subcategoryIds.includes(sub.id)),
      }))
      .filter(g => g.tools.length > 0);
  }, [view, activeSubcat, filtered, subcategories]);

  // Tools with no subcategory in this category (uncategorized within category)
  const ungrouped = useMemo(() => {
    if (groups === null) return [];
    const assignedIds = new Set(groups.flatMap(g => g.tools.map(t => t.id)));
    return filtered.filter(t => !assignedIds.has(t.id));
  }, [groups, filtered]);

  return (
    <>
      {/* ── Subcategory chips ─────────────────────────────────────── */}
      {subcategories.length > 0 && (
        <div className={styles.subcatNav}>
          <button
            className={`${styles.subcatChip} ${activeSubcat === null ? styles.subcatChipActive : ''}`}
            onClick={() => setActiveSubcat(null)}
          >
            all
            <span className={styles.subcatChipCount}>{tools.length}</span>
          </button>
          {subcategories.map(sub => (
            <button
              key={sub.id}
              className={`${styles.subcatChip} ${activeSubcat === sub.id ? styles.subcatChipActive : ''}`}
              onClick={() => setActiveSubcat(prev => prev === sub.id ? null : sub.id)}
            >
              {sub.name.replace(/-/g, '‑')}
              <span className={styles.subcatChipCount}>{subcatCounts[sub.id] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Controls ─────────────────────────────────────────────── */}
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="text"
          placeholder="search within this category…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />

        <span className={styles.controlsSep} />

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${view === 'grouped' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('grouped')}
          >
            grouped
          </button>
          <button
            className={`${styles.viewBtn} ${view === 'flat' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('flat')}
          >
            flat
          </button>
        </div>

        <span className={styles.resultCount}>{filtered.length} tools</span>

        {isFiltered && (
          <button className={styles.clearBtn} onClick={clearAll}>clear ×</button>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            {query ? `no tools found for “${query}”.` : 'no tools in this category yet.'}
          </p>
          <div className={styles.emptyActions}>
            {isFiltered && (
              <button className={styles.clearBtn} onClick={clearAll}>clear filters</button>
            )}
            <a href="/tools"   className={styles.emptyActionLink}>browse all tools →</a>
            <a href="/contact" className={styles.emptyActionLink}>submit a tool →</a>
          </div>
        </div>
      ) : groups !== null ? (
        // Grouped view
        <>
          {groups.map(({ sub, tools: groupTools }) => (
            <div key={sub.id} className={styles.group}>
              <div className={styles.groupHeader}>
                <span className={styles.groupName}>{sub.name.replace(/-/g, ' ')}</span>
                <span className={styles.groupLine} />
                <span className={styles.groupCount}>{groupTools.length}</span>
              </div>
              <div className={styles.grid}>
                {groupTools.map(tool => <Card key={tool.id} tool={tool} />)}
              </div>
            </div>
          ))}
          {ungrouped.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupHeader}>
                <span className={styles.groupName}>other</span>
                <span className={styles.groupLine} />
                <span className={styles.groupCount}>{ungrouped.length}</span>
              </div>
              <div className={styles.grid}>
                {ungrouped.map(tool => <Card key={tool.id} tool={tool} />)}
              </div>
            </div>
          )}
        </>
      ) : (
        // Flat view
        <div className={styles.grid}>
          {filtered.map(tool => <Card key={tool.id} tool={tool} />)}
        </div>
      )}
    </>
  );
}
