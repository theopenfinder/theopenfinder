'use client';

import { useEffect, useState } from 'react';
import styles from './TerminalStats.module.css';

const STATS = [
  '200+ curated tools',
  '10 categories',
  '50+ subcategories',
];

const TYPE_MS   = 65;
const DELETE_MS = 28;
const PAUSE_FULL  = 2000;
const PAUSE_EMPTY = 450;

export default function TerminalStats() {
  const [display,    setDisplay]    = useState('');
  const [statIndex,  setStatIndex]  = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const target = STATS[statIndex];
    let t: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (display.length === 0) {
        t = setTimeout(() => {
          setIsDeleting(false);
          setStatIndex(i => (i + 1) % STATS.length);
        }, PAUSE_EMPTY);
      } else {
        t = setTimeout(() => setDisplay(d => d.slice(0, -1)), DELETE_MS);
      }
    } else {
      if (display.length === target.length) {
        t = setTimeout(() => setIsDeleting(true), PAUSE_FULL);
      } else {
        t = setTimeout(() => setDisplay(target.slice(0, display.length + 1)), TYPE_MS);
      }
    }

    return () => clearTimeout(t);
  }, [display, isDeleting, statIndex]);

  return (
    <div className={styles.terminal}>
      <div className={styles.bar}>
        <div className={styles.dots}>
          <span className={styles.dotRed}    />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen}  />
        </div>
      </div>
      <div className={styles.body}>
        <span className={styles.prompt}>openfinder@v1 ~ % </span>
        <span className={styles.text}>{display}</span>
        <span className={styles.cursor} />
      </div>
    </div>
  );
}
