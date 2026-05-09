'use client';

import { useEffect } from 'react';

function track(eventName: string, props: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  const w = window as any;
  w.__OF_TELEMETRY = w.__OF_TELEMETRY ?? [];
  w.__OF_TELEMETRY.push({ type: eventName, ...props, ts: Date.now() });
  if (w.__OF_TELEMETRY.length > 50) w.__OF_TELEMETRY.shift();
  // Forward to Plausible or Umami when loaded
  w.plausible?.(eventName, { props });
  w.umami?.track(eventName, props);
}

export default function AnalyticsProvider() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as Element).closest('a');
      if (!link) return;

      const href = link.getAttribute('href') ?? '';
      if (!href.startsWith('http')) return;

      const toolId = link.closest('[data-tool-id]')?.getAttribute('data-tool-id') ?? '';
      const isGitHub = href.includes('github.com');

      track(isGitHub ? 'github_click' : 'external_click', { href, toolId });
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
