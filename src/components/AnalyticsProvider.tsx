'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

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
