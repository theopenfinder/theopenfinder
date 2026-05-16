/**
 * Shared client-side event tracking.
 * Buffers to window.__OF_TELEMETRY and forwards to Plausible when loaded.
 * Never sends personal data or user identifiers.
 */
export function track(eventName: string, props?: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.__OF_TELEMETRY = w.__OF_TELEMETRY ?? [];
  w.__OF_TELEMETRY.push({ type: eventName, ...props, ts: Date.now() });
  if (w.__OF_TELEMETRY.length > 50) w.__OF_TELEMETRY.shift();
  w.plausible?.(eventName, { props });
}
