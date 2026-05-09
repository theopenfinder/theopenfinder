'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './GuidesScroll.module.css';

interface Guide {
  type: string;
  title: string;
  desc: string;
  tools: string[];
  href: string;
}

interface GuidesScrollProps {
  guides: Guide[];
}

export default function GuidesScroll({ guides }: GuidesScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Both undefined until mounted — avoids SSR/client disabled-attribute mismatch
  const [canScrollLeft,  setCanScrollLeft]  = useState<boolean | undefined>(undefined);
  const [canScrollRight, setCanScrollRight] = useState<boolean | undefined>(undefined);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    return () => el.removeEventListener('scroll', updateArrows);
  }, []);

  function scrollBy(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 822, behavior: 'smooth' });
  }

  // Before mount: disabled is undefined → attribute omitted on both server and client
  const leftDisabled  = canScrollLeft  === undefined ? undefined : !canScrollLeft;
  const rightDisabled = canScrollRight === undefined ? undefined : !canScrollRight;

  return (
    <div className={styles.wrapper}>
      {/* Scroll track */}
      <div className={styles.track} ref={scrollRef}>
        {guides.map((guide) => (
          <a key={guide.title} href={guide.href} className={styles.card}>
            <h3 className={styles.title}>{guide.title}</h3>
            <p className={styles.desc}>{guide.desc}</p>
            <div className={styles.tools}>
              {guide.tools.map((t) => (
                <span key={t} className={styles.tool}>{t}</span>
              ))}
            </div>
            <span className={styles.arrow}>→</span>
          </a>
        ))}
      </div>

      {/* Left arrow */}
      <button
        className={`${styles.navBtn} ${styles.navBtnLeft} ${canScrollLeft === false || canScrollLeft === undefined ? styles.navBtnHidden : ''}`}
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
      >
        ←
      </button>

      {/* Right arrow */}
      <button
        className={`${styles.navBtn} ${styles.navBtnRight} ${canScrollRight === false ? styles.navBtnHidden : ''}`}
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
      >
        →
      </button>
    </div>
  );
}
