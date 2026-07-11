'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './about.module.css';

const LINES = [
  { text: 'i need a tool',              type: 'query'  },
  { text: '',                            type: 'spacer' },
  { text: '↓',                           type: 'arrow'  },
  { text: '',                            type: 'spacer' },
  { text: 'openfinder:',                 type: 'brand'  },
  { text: 'search, context, guides',     type: 'sub'    },
  { text: '',                            type: 'spacer' },
  { text: '↓',                           type: 'arrow'  },
  { text: '',                            type: 'spacer' },
  { text: 'github, docker, f-droid',     type: 'dest'   },
  { text: 'website, homebrew, linux...', type: 'dest'   },
];

const TYPE_MS  = 50;
const PAUSE_MS = 500;

export default function HowItsDifferentCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || done) return;
    const line = LINES[lineIdx];
    let t: ReturnType<typeof setTimeout>;
    if (charIdx < line.text.length) {
      t = setTimeout(() => setCharIdx(c => c + 1), TYPE_MS);
    } else if (lineIdx < LINES.length - 1) {
      const delay = line.type === 'spacer' ? 0 : PAUSE_MS;
      t = setTimeout(() => { setLineIdx(i => i + 1); setCharIdx(0); }, delay);
    } else {
      setDone(true);
    }
    return () => clearTimeout(t);
  }, [active, done, lineIdx, charIdx]);

  const lastContentIdx = LINES.length - 1;

  const rows = done
    ? LINES.map((line, i) => ({ ...line, display: line.text, cursor: i === lastContentIdx }))
    : LINES.slice(0, lineIdx + 1).map((line, i) => ({
        ...line,
        display: i === lineIdx ? line.text.slice(0, charIdx) : line.text,
        cursor: i === lineIdx && line.type !== 'spacer',
      }));

  return (
    <div ref={ref} className={styles.diffContainer}>
      <div className={styles.diffCardBody}>
        {rows.map((row, i) => (
          <div key={i} className={`${styles.diffLine} ${styles['diffLine_' + row.type]}`}>
            <span>{row.display}</span>
            {row.cursor && <span className={styles.diffCursor} />}
          </div>
        ))}
      </div>
    </div>
  );
}
