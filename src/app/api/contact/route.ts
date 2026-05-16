import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

/* ── Constants ─────────────────────────────────────────────────── */

const resend = new Resend(process.env.RESEND_API_KEY);

const VALID_TYPES = ['general', 'tool_submission', 'security'] as const;
type SubmissionType = (typeof VALID_TYPES)[number];

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const MAX_LEN = {
  name: 120,
  email: 254,
  subject: 160,
  message: 5000,
  tool: 160,
  url: 500,
  category: 120,
  description: 5000,
};

/* ── Helpers ───────────────────────────────────────────────────── */

function t(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(s: string): string {
  return esc(s).replace(/\n/g, '<br>');
}

/* ── Turnstile ─────────────────────────────────────────────────── */

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[contact] Turnstile secret not set — skipping verification in development');
      return true;
    }
    console.error('[contact] Turnstile secret not configured in production');
    return false;
  }

  if (!token) {
    console.warn('[contact] Turnstile token missing from submission');
    return false;
  }

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json() as { success: boolean; 'error-codes'?: string[] };
    if (!data.success) {
      console.warn('[contact] Turnstile verification failed:', data['error-codes']);
    }
    return data.success === true;
  } catch (err) {
    console.error('[contact] Turnstile fetch error:', err instanceof Error ? err.message : String(err));
    return false;
  }
}

/* ── Rate limiting ─────────────────────────────────────────────── */

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function checkAndRecordRateLimit(ip: string): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Fail open — rate limiting unavailable without service role key
    console.warn('[contact] SUPABASE_SERVICE_ROLE_KEY not set — rate limiting disabled');
    return { ok: true };
  }

  const supabase = createAdminClient();
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

  const { count, error: countError } = await supabase
    .from('contact_rate_limit')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('submitted_at', windowStart);

  if (countError) {
    // Fail open — don't block legit users if DB is unavailable
    console.error('[contact] Rate limit check error:', countError.message);
    return { ok: true };
  }

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    console.warn(`[contact] Rate limit hit for IP: ${ip}`);
    return { ok: false, error: 'Too many submissions. Please wait a few minutes and try again.' };
  }

  const { error: insertError } = await supabase
    .from('contact_rate_limit')
    .insert({ ip });

  if (insertError) {
    console.error('[contact] Rate limit insert error:', insertError.message);
  }

  return { ok: true };
}

/* ── Route handler ─────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Honeypot — silently succeed so spam logic is not revealed
  if (t(body.hp)) {
    return NextResponse.json({ success: true });
  }

  // Turnstile
  const turnstileOk = await verifyTurnstile(t(body.turnstileToken), ip);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: 'Verification failed. Please refresh the page and try again.' },
      { status: 400 },
    );
  }

  // Rate limit (checked after Turnstile to avoid burning quota on bots)
  const rateLimit = await checkAndRecordRateLimit(ip);
  if (!rateLimit.ok) {
    return NextResponse.json({ error: rateLimit.error }, { status: 429 });
  }

  // Submission type
  const type = (t(body.type) || 'general') as SubmissionType;
  if (!(VALID_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ error: 'Invalid submission type' }, { status: 400 });
  }

  // Trim all fields
  const f = {
    name:        t(body.name),
    email:       t(body.email),
    subject:     t(body.subject),
    message:     t(body.message),
    tool:        t(body.tool),
    url:         t(body.url),
    category:    t(body.category),
    description: t(body.description),
  };

  // Email format
  if (f.email && !isValidEmail(f.email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // URL format
  if (f.url && !isValidUrl(f.url)) {
    return NextResponse.json({ error: 'Invalid URL — must start with http:// or https://' }, { status: 400 });
  }

  // Length limits
  const lengthChecks: [string, string, number][] = [
    ['Name', f.name, MAX_LEN.name],
    ['Email', f.email, MAX_LEN.email],
    ['Subject', f.subject, MAX_LEN.subject],
    ['Message', f.message, MAX_LEN.message],
    ['Tool name', f.tool, MAX_LEN.tool],
    ['URL', f.url, MAX_LEN.url],
    ['Category', f.category, MAX_LEN.category],
    ['Description', f.description, MAX_LEN.description],
  ];
  for (const [label, value, max] of lengthChecks) {
    if (value.length > max) {
      return NextResponse.json(
        { error: `${label} must be ${max} characters or fewer` },
        { status: 400 },
      );
    }
  }

  // Required fields
  if (type === 'general' || type === 'security') {
    if (!f.subject) return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    if (!f.message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }
  if (type === 'tool_submission') {
    if (!f.tool)        return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    if (!f.description) return NextResponse.json({ error: 'Description is required' }, { status: 400 });
  }

  // Email routing
  const toMap: Record<SubmissionType, string | undefined> = {
    general:         process.env.CONTACT_TO_EMAIL,
    tool_submission: process.env.CONTACT_SUBMIT_EMAIL,
    security:        process.env.CONTACT_SECURITY_EMAIL,
  };
  const to = toMap[type];
  if (!to) return NextResponse.json({ error: 'Email routing is not configured' }, { status: 500 });

  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from) return NextResponse.json({ error: 'Sender email is not configured' }, { status: 500 });

  // Build email content
  let subject: string;
  let html: string;

  if (type === 'tool_submission') {
    subject = `[OpenFinder] Tool Submission: ${f.tool}`;
    html = `
      <h2 style="font-family:sans-serif;font-size:1.1rem;margin-bottom:1rem">Tool Submission</h2>
      <table style="font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Tool:</strong></td><td>${esc(f.tool)}</td></tr>
        ${f.url         ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>URL:</strong></td><td><a href="${esc(f.url)}">${esc(f.url)}</a></td></tr>` : ''}
        ${f.category    ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Category:</strong></td><td>${esc(f.category)}</td></tr>` : ''}
        ${f.name        ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Submitted by:</strong></td><td>${esc(f.name)}</td></tr>` : ''}
      </table>
      <p style="font-family:sans-serif;font-size:0.9rem;margin-top:1rem"><strong>Why it belongs:</strong></p>
      <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.6">${nl2br(f.description)}</p>
    `.trim();
  } else {
    const prefix  = type === 'security' ? '[SECURITY] ' : '';
    const heading = type === 'security' ? 'Security Report' : 'Contact Message';
    subject = `[OpenFinder] ${prefix}${f.subject}`;
    html = `
      <h2 style="font-family:sans-serif;font-size:1.1rem;margin-bottom:1rem">${heading}</h2>
      <table style="font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
        ${f.name  ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>From:</strong></td><td>${esc(f.name)}</td></tr>` : ''}
        ${f.email ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Email:</strong></td><td>${esc(f.email)}</td></tr>` : ''}
        <tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Subject:</strong></td><td>${esc(f.subject)}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:0.9rem;margin-top:1rem"><strong>Message:</strong></p>
      <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.6">${nl2br(f.message)}</p>
    `.trim();
  }

  // Send
  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...(f.email ? { replyTo: f.email } : {}),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Resend send error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}
