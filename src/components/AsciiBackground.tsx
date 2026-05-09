'use client';

import { useRef, useEffect } from 'react';

// ─── Character pool ────────────────────────────────────────────────────────────
const CHARS_LIGHT = '·...::;;·...::·...';
const CHARS_HEAVY = '|/\\-+=*#@%~<>[]{}!?';
const CHARS_GEO   = '◆';
const CHAR_POOL   = CHARS_LIGHT + CHARS_HEAVY + CHARS_GEO;

// Blob-only chars — pulled from heavy + geo so blobs feel distinct
const BLOB_CHAR_POOL = CHARS_HEAVY + CHARS_GEO;

// ─── ASCII field ───────────────────────────────────────────────────────────────
const GRAY_MIN = 8;
const GRAY_MAX = 46;

// ─── Worm ──────────────────────────────────────────────────────────────────────
const RESPAWN_DELAY  = 5000;   // ms before cleared chars start coming back
const RESPAWN_FADE   = 1200;   // ms for the fade-in
const WORM_COLOR_CTR  = [210, 190, 155] as const;  // sandy beige — spine
const WORM_COLOR_SIDE = [155, 138, 105] as const;  // dark sand   — outer rows

// ─── Blobs ─────────────────────────────────────────────────────────────────────
const BLOB_IDLE            = 5000;   // ms a blob holds before dissolving
const BLOB_DISSOLVE_SPREAD = 2000;   // ms over which cells dissolve one by one

interface BlobCell {
  char:      string;
  spawnedAt: number;
  dissolveAt: number; // Infinity = still idle; set to a future ts when dissolving
}

interface Cell {
  char:  string;
  phase: number;
  speed: number;
  age:   number;
  ttl:   number;
}

interface WormState {
  active:      boolean;
  headX:       number;    // float, in cell units
  centerRow:   number;
  dir:         1 | -1;    // +1 right, -1 left
  clearR:      number;    // rows cleared above/below center
  bodyLen:     number;
  speed:       number;    // cells per second
  prevTs:      number;
  nextSpawnAt: number;
}

export default function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    // ── Env ────────────────────────────────────────────────────────────────────
    // Note: we intentionally do NOT gate on prefers-reduced-motion.
    // Privacy-first browsers (LibreWolf, Brave) spoof that media query to
    // always report "reduce", which would silently kill the worm and animation.
    // Both are pure canvas effects that cause no layout shift or scrolljacking.
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    const CELL_PX  = isMobile ? 26 : 18;
    const FPS_CAP  = isMobile ? 15 : 24;
    const FRAME_MS = 1000 / FPS_CAP;
    const FONT     = `${CELL_PX - 3}px "Courier New", Courier, monospace`;

    // ── State ──────────────────────────────────────────────────────────────────
    let cols   = 0;
    let rows   = 0;
    let cells: Cell[]         = [];
    // deadCells: cellIndex → timestamp when it was last stamped by the worm body
    const deadCells           = new Map<number, number>();
    // blobCells: cellIndex → blob cell state
    const blobCells           = new Map<number, BlobCell>();
    let nextBlobAt            = 2000 + Math.random() * 4000; // first blob 2–6 s in
    let animId: number | null = null;
    let lastTs                = 0;

    const worm: WormState = {
      active:      false,
      headX:       0,
      centerRow:   0,
      dir:         1,
      clearR:      1,
      bodyLen:     0,
      speed:       0,
      prevTs:      0,
      // First worm after 1–3 s so it feels responsive
      nextSpawnAt: 1000 + Math.random() * 2000,
    };

    // ── Grid setup ─────────────────────────────────────────────────────────────
    function setup() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols  = Math.ceil(canvas.width  / CELL_PX) + 1;
      rows  = Math.ceil(canvas.height / CELL_PX) + 1;
      cells = Array.from({ length: cols * rows }, () => ({
        char:  CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.75,
        age:   Math.floor(Math.random() * 80),
        ttl:   40 + Math.floor(Math.random() * 120),
      }));
      deadCells.clear();
      blobCells.clear();
      worm.active = false;
    }

    // ── Blobs ──────────────────────────────────────────────────────────────────

    function spawnBlob(ts: number) {
      // Pick a random char for this whole blob
      const bChar = BLOB_CHAR_POOL[Math.floor(Math.random() * BLOB_CHAR_POOL.length)];

      // Random blob dimensions — width 4–10, height 3–6
      const bw = 4 + Math.floor(Math.random() * 7);
      const bh = 3 + Math.floor(Math.random() * 4);

      // Random center, keeping blobs off the very edge
      const cx = bw + Math.floor(Math.random() * (cols - bw * 2));
      const cy = bh + Math.floor(Math.random() * (rows - bh * 2));

      for (let dr = -Math.floor(bh / 2); dr <= Math.ceil(bh / 2); dr++) {
        for (let dc = -Math.floor(bw / 2); dc <= Math.ceil(bw / 2); dc++) {
          // Organic edge: normalised ellipse distance with per-cell jitter
          const nx   = dc / (bw / 2);
          const ny   = dr / (bh / 2);
          const dist = Math.sqrt(nx * nx + ny * ny);
          if (dist > 0.80 + Math.random() * 0.35) continue;

          const r = cy + dr;
          const c = cx + dc;
          if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
          const idx = r * cols + c;
          blobCells.set(idx, { char: bChar, spawnedAt: ts, dissolveAt: Infinity });
        }
      }

      // Next blob in 4–10 s
      nextBlobAt = ts + 4000 + Math.random() * 6000;
    }

    function advanceBlobs(ts: number) {
      if (ts >= nextBlobAt) spawnBlob(ts);

      for (const [idx, bc] of blobCells) {
        // Once the idle period is up, assign a staggered dissolve time
        if (bc.dissolveAt === Infinity && ts - bc.spawnedAt >= BLOB_IDLE) {
          bc.dissolveAt = ts + Math.random() * BLOB_DISSOLVE_SPREAD;
        }
        // Evict dissolved cells
        if (bc.dissolveAt !== Infinity && ts >= bc.dissolveAt) {
          blobCells.delete(idx);
        }
      }
    }

    // ── Worm ───────────────────────────────────────────────────────────────────

    /**
     * Stamp every cell currently under the worm body with `ts`.
     * Calling this every frame means:
     *   - Cells under the body never reach the 5 s respawn delay (timestamp
     *     keeps being refreshed to "now").
     *   - Once the body moves away, the stamp stops refreshing → 5 s later the
     *     cell starts to fade back in.
     * This works correctly for both dir=+1 and dir=-1 with no special-casing.
     */
    function markBodyDead(ts: number) {
      const headCol =
        worm.dir === 1 ? Math.floor(worm.headX) : Math.ceil(worm.headX);

      for (let seg = 0; seg < worm.bodyLen; seg++) {
        // Body extends *behind* the head regardless of direction:
        //   dir= 1 → col decreases from head (body to the left)
        //   dir=-1 → col increases from head (body to the right)
        const col = headCol - worm.dir * seg;
        if (col < 0 || col >= cols) continue;

        for (let dr = -worm.clearR; dr <= worm.clearR; dr++) {
          const r = worm.centerRow + dr;
          if (r < 0 || r >= rows) continue;
          const idx = r * cols + col;
          if (idx >= 0 && idx < cells.length) {
            deadCells.set(idx, ts);
          }
        }
      }
    }

    function spawnWorm(ts: number) {
      const dir  = Math.random() > 0.5 ? 1 : -1;
      const bLen = 44 + Math.floor(Math.random() * 20); // 44–64 cells

      worm.active    = true;
      worm.dir       = dir as 1 | -1;
      worm.clearR    = 2;
      worm.bodyLen   = bLen;
      worm.speed     = 10 + Math.random() * 7;           // 10–17 cells/s
      // Avoid top 15 % and bottom 15 % of screen
      worm.centerRow = Math.floor(rows * 0.15 + Math.random() * rows * 0.70);
      // Start just off-screen so the body enters smoothly
      worm.headX     = dir === 1 ? -1 : cols;
      worm.prevTs    = ts;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[AsciiBackground] worm spawned dir=${dir} row=${worm.centerRow} len=${bLen}`);
      }
    }

    function advanceWorm(ts: number) {
      if (!worm.active) {
        if (ts >= worm.nextSpawnAt) spawnWorm(ts);
        return;
      }

      const dt    = Math.min((ts - worm.prevTs) / 1000, 0.1); // cap at 100 ms
      worm.headX += worm.dir * worm.speed * dt;
      worm.prevTs = ts;

      // Refresh dead-cell stamps for every cell currently under the body
      markBodyDead(ts);

      // Deactivate when the TAIL has fully exited the screen.
      // Tail position:
      //   dir= 1 → tail is bodyLen cells to the LEFT  of head
      //   dir=-1 → tail is bodyLen cells to the RIGHT of head
      const tailX =
        worm.dir === 1
          ? worm.headX - worm.bodyLen
          : worm.headX + worm.bodyLen;

      const offScreen =
        worm.dir === 1 ? tailX > cols : tailX < 0;

      if (offScreen) {
        worm.active      = false;
        worm.nextSpawnAt = ts + 6000 + Math.random() * 10000; // 6–16 s gap
      }
    }

    function drawWorm() {
      if (!worm.active) return;

      const headCol =
        worm.dir === 1 ? Math.floor(worm.headX) : Math.ceil(worm.headX);

      ctx.font      = FONT;
      ctx.textAlign = 'left';

      for (let seg = 0; seg < worm.bodyLen; seg++) {
        const col = headCol - worm.dir * seg;
        if (col < 0 || col >= cols) continue;

        const x = col * CELL_PX;

        // Last 4 segments fade to black so the tail dissolves cleanly
        const tailAlpha =
          seg > worm.bodyLen - 5 ? (worm.bodyLen - seg) / 4 : 1;

        for (let dr = -worm.clearR; dr <= worm.clearR; dr++) {
          const r = worm.centerRow + dr;
          if (r < 0 || r >= rows) continue;

          const y = (r + 1) * CELL_PX;

          // ── Glyph selection ──────────────────────────────────────────────
          let char: string;
          if (seg === 0) {
            // Head
            if (dr === 0)    char = '0';
            else if (dr < 0) char = worm.dir === 1 ? '/' : '\\';
            else             char = worm.dir === 1 ? '\\' : '/';
          } else {
            // Body — alternate spine/outer characters for a segmented look
            char = dr === 0
              ? (seg % 2 === 0 ? '=' : '-')
              : (seg % 3 === 0 ? '~' : '-');
          }

          // ── Color ────────────────────────────────────────────────────────
          const [br, bg, bb] = dr === 0 ? WORM_COLOR_CTR : WORM_COLOR_SIDE;
          const rv = (br * tailAlpha) | 0;
          const gv = (bg * tailAlpha) | 0;
          const bv = (bb * tailAlpha) | 0;
          ctx.fillStyle = `rgb(${rv},${gv},${bv})`;
          ctx.fillText(char, x, y);
        }
      }
    }

    // ── Main render ────────────────────────────────────────────────────────────
    function render(ts: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font      = FONT;
      ctx.textAlign = 'left';

      const t = ts * 0.001; // seconds

      advanceWorm(ts);
      advanceBlobs(ts);

      // ── ASCII field ──────────────────────────────────────────────────────
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        // Slowly rotate characters
        cell.age++;
        if (cell.age >= cell.ttl) {
          cell.char = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
          cell.ttl  = 40 + Math.floor(Math.random() * 120);
          cell.age  = 0;
        }

        const row = (i / cols) | 0;
        const col = i - row * cols;
        const x   = col * CELL_PX;
        const y   = (row + 1) * CELL_PX;

        // ── Worm trail (blank) ───────────────────────────────────────────
        const deadTs = deadCells.get(i);

        if (deadTs !== undefined) {
          const elapsed = ts - deadTs;

          if (elapsed < RESPAWN_DELAY) {
            continue; // blank — worm trail
          }

          if (elapsed < RESPAWN_DELAY + RESPAWN_FADE) {
            // Fading back in
            const progress = (elapsed - RESPAWN_DELAY) / RESPAWN_FADE;
            const osc = 0.5 + 0.5 * Math.sin(t * cell.speed + cell.phase);
            const g   = (GRAY_MIN + osc * (GRAY_MAX - GRAY_MIN) * progress) | 0;
            ctx.fillStyle = `rgb(${g},${g},${g})`;
            ctx.fillText(cell.char, x, y);
            continue;
          }

          // Fully respawned — evict from map, fall through to normal render
          deadCells.delete(i);
        }

        // ── Blob cell (same char, dissolves stochastically) ──────────────
        const bc = blobCells.get(i);
        if (bc) {
          // Dissolving: fade between blob char and the cell's own char
          if (bc.dissolveAt !== Infinity) {
            const progress = Math.min(1, (ts - bc.dissolveAt + BLOB_DISSOLVE_SPREAD * 0.1) / (BLOB_DISSOLVE_SPREAD * 0.5));
            const osc = 0.5 + 0.5 * Math.sin(t * cell.speed + cell.phase);
            const g   = (GRAY_MIN + osc * (GRAY_MAX - GRAY_MIN)) | 0;
            ctx.fillStyle = `rgb(${g},${g},${g})`;
            // Snap to cell's own char as dissolve completes
            ctx.fillText(progress > 0.5 ? cell.char : bc.char, x, y);
          } else {
            // Idle — show blob char at normal brightness
            const osc = 0.5 + 0.5 * Math.sin(t * cell.speed + cell.phase);
            const g   = (GRAY_MIN + osc * (GRAY_MAX - GRAY_MIN)) | 0;
            ctx.fillStyle = `rgb(${g},${g},${g})`;
            ctx.fillText(bc.char, x, y);
          }
          continue;
        }

        // ── Normal oscillating render ────────────────────────────────────
        const osc = 0.5 + 0.5 * Math.sin(t * cell.speed + cell.phase);
        const g   = (GRAY_MIN + osc * (GRAY_MAX - GRAY_MIN)) | 0;
        ctx.fillStyle = `rgb(${g},${g},${g})`;
        ctx.fillText(cell.char, x, y);
      }

      // ── Worm on top of ASCII field ────────────────────────────────────────
      drawWorm();
    }

    // ── RAF loop ───────────────────────────────────────────────────────────────
    // Use performance.now() directly — never trust the RAF-provided timestamp,
    // which some Chrome builds pass as 0 on hidden/background tabs or during
    // paint throttling, causing the FPS gate to permanently block render().
    function tick() {
      const ts = performance.now();
      if (ts - lastTs < FRAME_MS) {
        animId = requestAnimationFrame(tick);
        return;
      }
      lastTs = ts;
      render(ts);
      animId = requestAnimationFrame(tick);
    }

    function start() {
      animId = requestAnimationFrame(tick);
    }

    function stop() {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    // ── Visibility pause ───────────────────────────────────────────────────────
    function onVisibility() {
      if (document.hidden) {
        stop();
      } else {
        lastTs = 0; // reset throttle so first resumed frame always renders
        animId = requestAnimationFrame(tick);
      }
    }

    // ── Debounced resize ───────────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        stop();
        setup();
        start();
      }, 150);
    }

    // ── Boot ───────────────────────────────────────────────────────────────────
    setup();
    start();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
