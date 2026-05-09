'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './SystemOverview.module.css';

// Actual taxonomy — split into 3 balanced columns
const COL1 = [
  { name: 'Productivity', subs: ['note-taking', 'task-management', 'calendar', 'document-editing', 'spreadsheet-editing', 'presentation-editing', 'collaboration', 'bookmarking', 'knowledge-base'] },
  { name: 'Education',    subs: ['learning', 'language-learning', 'interactive-learning'] },
  { name: 'Development',  subs: ['code-editing', 'version-control', 'api-tools', 'testing', 'devops', 'package-management', 'website-builders'] },
];

const COL2 = [
  { name: 'Design',    subs: ['image-editing', 'vector-graphics', 'ui-ux', '3d-modeling', 'illustration'] },
  { name: 'Media',     subs: ['video-editing', 'audio-editing', 'music-production', 'screen-recording', 'streaming', 'media-players'] },
  { name: 'AI',        subs: ['llm-tools', 'local-ai', 'model-management', 'ai-automation', 'image-generation'] },
  { name: 'Security',  subs: ['password-managers', 'encryption', 'authentication', 'auditing', 'vulnerability-scanning'] },
];

const COL3 = [
  { name: 'Privacy',    subs: ['browsers', 'email', 'messaging', 'search-engines', 'vpn', 'file-storage'] },
  { name: 'Networking', subs: ['servers', 'dns', 'remote-access', 'proxies', 'network-communication'] },
  { name: 'Data',       subs: ['databases', 'data-visualization', 'analytics', 'data-processing'] },
  { name: 'Utilities',  subs: ['file-management', 'backup', 'system-tools', 'terminal', 'compression', 'accessibility'] },
];

const STATS = ['11 categories', '61 subcategories', '252 tools', 'high signal'];

type Cat = { name: string; subs: string[] };

function buildDelays(columns: Cat[][]): Map<string, number> {
  const map = new Map<string, number>();
  // Each column reveals in parallel, items stagger within their own column
  for (let c = 0; c < columns.length; c++) {
    // Slight left-to-right offset between columns so they don't all pop at once
    let delay = 500 + c * 120;
    for (const cat of columns[c]) {
      map.set(`cat-${cat.name}`, delay);
      delay += 130;
      cat.subs.forEach((sub, i) => {
        map.set(`sub-${cat.name}-${sub}-${i}`, delay);
        delay += 55;
      });
      delay += 80;
    }
  }
  return map;
}

const DELAYS = buildDelays([COL1, COL2, COL3]);

function TreeColumn({ cats }: { cats: Cat[] }) {
  return (
    <div className={styles.treeCol}>
      {cats.map((cat) => (
        <div key={cat.name} className={styles.catGroup}>
          <div
            className={styles.catLine}
            style={{ animationDelay: `${DELAYS.get(`cat-${cat.name}`)}ms` }}
          >
            {cat.name}
          </div>
          {cat.subs.map((sub, i) => (
            <div
              key={sub}
              className={styles.subLine}
              style={{ animationDelay: `${DELAYS.get(`sub-${cat.name}-${sub}-${i}`)}ms` }}
            >
              <span className={styles.branch}>{i === cat.subs.length - 1 ? '└' : '├'}</span>
              <span className={styles.dash}>─</span>
              <span className={styles.subName}>{sub}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function SystemOverview() {
  const [displayText, setDisplayText] = useState('');
  const [statIndex, setStatIndex] = useState(0);
  const phase = useRef<'typing' | 'pause' | 'deleting'>('typing');
  const charCount = useRef(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    const tick = () => {
      const target = STATS[statIndex];

      if (phase.current === 'typing') {
        if (charCount.current < target.length) {
          charCount.current++;
          setDisplayText(target.slice(0, charCount.current));
          t = setTimeout(tick, 60);
        } else {
          phase.current = 'pause';
          t = setTimeout(tick, 1900);
        }
      } else if (phase.current === 'pause') {
        phase.current = 'deleting';
        t = setTimeout(tick, 30);
      } else {
        if (charCount.current > 0) {
          charCount.current--;
          setDisplayText(target.slice(0, charCount.current));
          t = setTimeout(tick, 30);
        } else {
          phase.current = 'typing';
          setStatIndex((i) => (i + 1) % STATS.length);
        }
      }
    };

    t = setTimeout(tick, statIndex === 0 ? 3200 : 80);
    return () => clearTimeout(t);
  }, [statIndex]);

  return (
    <div className={styles.panel}>
      <div className={styles.label}>// system.index</div>
      <div className={styles.treeRow}>
        <TreeColumn cats={COL1} />
        <TreeColumn cats={COL2} />
        <TreeColumn cats={COL3} />
      </div>

      <div className={styles.statBlock}>
        <span className={styles.prompt}>{'>'}</span>
        <span className={styles.statText}>{displayText}</span>
        <span className={styles.cursor} />
      </div>
    </div>
  );
}
