import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const VALID_TYPES = ['general', 'tool_submission', 'security'] as const;
type SubmissionType = (typeof VALID_TYPES)[number];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const type = (body.type ?? 'general') as SubmissionType;
  if (!(VALID_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ error: 'Invalid submission type' }, { status: 400 });
  }

  const email = (body.email ?? '').trim();
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  if (type === 'general' || type === 'security') {
    if (!body.subject?.trim()) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }
    if (!body.message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
  }

  if (type === 'tool_submission') {
    if (!body.tool?.trim()) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }
    if (!body.description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }
  }

  const toMap: Record<SubmissionType, string | undefined> = {
    general: process.env.CONTACT_TO_EMAIL,
    tool_submission: process.env.CONTACT_SUBMIT_EMAIL,
    security: process.env.CONTACT_SECURITY_EMAIL,
  };

  const to = toMap[type];
  if (!to) {
    return NextResponse.json({ error: 'Email routing is not configured' }, { status: 500 });
  }

  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from) {
    return NextResponse.json({ error: 'Sender email is not configured' }, { status: 500 });
  }

  const name = body.name?.trim() ?? '';

  let subject: string;
  let html: string;

  if (type === 'tool_submission') {
    const tool = esc(body.tool.trim());
    const url = body.url?.trim();
    const category = body.category?.trim();
    const description = nl2br(body.description.trim());

    subject = `[OpenFinder] Tool Submission: ${body.tool.trim()}`;
    html = `
      <h2 style="font-family:sans-serif;font-size:1.1rem;margin-bottom:1rem">Tool Submission</h2>
      <table style="font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Tool:</strong></td><td>${tool}</td></tr>
        ${url ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>URL:</strong></td><td><a href="${esc(url)}">${esc(url)}</a></td></tr>` : ''}
        ${category ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Category:</strong></td><td>${esc(category)}</td></tr>` : ''}
        ${name ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Submitted by:</strong></td><td>${esc(name)}</td></tr>` : ''}
      </table>
      <p style="font-family:sans-serif;font-size:0.9rem;margin-top:1rem"><strong>Why it belongs:</strong></p>
      <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.6">${description}</p>
    `.trim();
  } else {
    const prefix = type === 'security' ? '[SECURITY] ' : '';
    const heading = type === 'security' ? 'Security Report' : 'Contact Message';
    subject = `[OpenFinder] ${prefix}${body.subject.trim()}`;
    html = `
      <h2 style="font-family:sans-serif;font-size:1.1rem;margin-bottom:1rem">${heading}</h2>
      <table style="font-family:sans-serif;font-size:0.9rem;border-collapse:collapse">
        ${name ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>From:</strong></td><td>${esc(name)}</td></tr>` : ''}
        ${email ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Email:</strong></td><td>${esc(email)}</td></tr>` : ''}
        <tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Subject:</strong></td><td>${esc(body.subject.trim())}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:0.9rem;margin-top:1rem"><strong>Message:</strong></p>
      <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.6">${nl2br(body.message.trim())}</p>
    `.trim();
  }

  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...(email ? { replyTo: email } : {}),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact API]', err);
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}
