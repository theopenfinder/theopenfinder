'use client';

import { useState } from 'react';
import Script from 'next/script';
import AsciiBackground from '@/components/AsciiBackground';
import homeStyles from '../page.module.css';
import styles from './contact.module.css';

/* ── Turnstile global type ──────────────────────────────────────── */

declare global {
  interface Window {
    turnstile?: {
      reset: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

/* ── SVG icons ─────────────────────────────────────────────────── */

function IconGithub() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconReddit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  { name: 'GitHub',  handle: '/openfinder',    href: '#', Icon: IconGithub },
  { name: 'Reddit',  handle: 'r/openfinder',   href: '#', Icon: IconReddit },
  { name: 'X',       handle: '@theopenfinder', href: '#', Icon: IconX },
];

type FormState = 'idle' | 'loading' | 'success' | 'error';

/* ── Page ───────────────────────────────────────────────────────── */
export default function ContactPage() {
  const [msgState, setMsgState]   = useState<FormState>('idle');
  const [msgError, setMsgError]   = useState('');
  const [toolState, setToolState] = useState<FormState>('idle');
  const [toolError, setToolError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setMsgState('loading');
    setMsgError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:           data.type || 'general',
          name:           data.name,
          email:          data.email,
          subject:        data.subject,
          message:        data.message,
          hp:             data.hp ?? '',
          turnstileToken: data['cf-turnstile-response'] ?? '',
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send');

      setMsgState('success');
      form.reset();
      window.turnstile?.reset();
      setTimeout(() => setMsgState('idle'), 3000);
    } catch (err) {
      setMsgState('error');
      setMsgError(err instanceof Error ? err.message : 'Failed to send');
      window.turnstile?.reset();
    }
  }

  async function handleToolSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setToolState('loading');
    setToolError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:           'tool_submission',
          tool:           data.tool,
          url:            data.url,
          category:       data.category,
          description:    data.description,
          hp:             data.hp ?? '',
          turnstileToken: data['cf-turnstile-response'] ?? '',
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit');

      setToolState('success');
      form.reset();
      window.turnstile?.reset();
      setTimeout(() => setToolState('idle'), 3000);
    } catch (err) {
      setToolState('error');
      setToolError(err instanceof Error ? err.message : 'Failed to submit');
      window.turnstile?.reset();
    }
  }

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      )}

      <AsciiBackground />

      <div className={homeStyles.siteWrapper}>

        {/* ── Navigation ───────────────────────────────────────── */}
        <nav className={homeStyles.nav}>
          <div className={homeStyles.navLeft}>
            <a href="/" className={homeStyles.navBrand}><img src="/logo1-final.png" alt="OpenFinder" className="navLogo" /></a>
          </div>
          <div className={homeStyles.navLinks}>
            <a href="/"           className={homeStyles.navLink}>home</a>
            <a href="/tools"      className={homeStyles.navLink}>tools</a>
            <a href="/categories" className={homeStyles.navLink}>categories</a>
            <a href="/guides"     className={homeStyles.navLink}>guides</a>
            <a href="/contact"    className={`${homeStyles.navLink} ${homeStyles.navLinkActive}`}>contact</a>
            <a href="/about"      className={homeStyles.navLink}>about</a>
          </div>
        </nav>

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className={styles.heroSection}>
          <h1 className={styles.heading}>contact</h1>
        </section>

        {/* ── Body ────────────────────────────────────────────── */}
        <div className={styles.bodyGrid}>

          {/* Forms column */}
          <div className={styles.formsColumn}>

            {/* Message form */}
            <form onSubmit={handleSubmit}>
              {/* Honeypot — must stay empty; bots that fill it are silently dropped */}
              <div aria-hidden="true" className={styles.honeypot}>
                <label htmlFor="cf-hp">Leave this blank</label>
                <input id="cf-hp" name="hp" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className={styles.formPanel}>
                <div className={styles.formPanelHeader}>
                  <span className={styles.formPanelTitle}>message</span>
                </div>
                <div className={styles.formBody}>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="cf-name">Name</label>
                      <input
                        className={styles.formInput}
                        id="cf-name"
                        name="name"
                        type="text"
                        placeholder="your name (optional)"
                        autoComplete="name"
                        maxLength={120}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="cf-email">Email</label>
                      <input
                        className={styles.formInput}
                        id="cf-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com (optional)"
                        autoComplete="email"
                        maxLength={254}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="cf-type">Type</label>
                    <select
                      className={styles.formSelect}
                      id="cf-type"
                      name="type"
                      defaultValue="general"
                    >
                      <option value="general">General inquiry</option>
                      <option value="security">Security report</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="cf-subject">Subject</label>
                    <input
                      className={styles.formInput}
                      id="cf-subject"
                      name="subject"
                      type="text"
                      placeholder="feature suggestion, feedback, bug report…"
                      required
                      maxLength={160}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="cf-message">Message</label>
                    <textarea
                      className={styles.formTextarea}
                      id="cf-message"
                      name="message"
                      placeholder="what's on your mind…"
                      required
                      maxLength={5000}
                    />
                  </div>

                  {TURNSTILE_SITE_KEY && (
                    <div className={styles.turnstileWrapper}>
                      <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
                    </div>
                  )}

                  {msgState === 'error' && msgError && (
                    <p className={styles.formError}>{msgError}</p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={msgState === 'loading'}
                  >
                    {msgState === 'loading' ? 'sending…' : msgState === 'success' ? 'sent ✓' : 'send →'}
                  </button>

                </div>
              </div>
            </form>

            {/* Tool submissions form */}
            <form onSubmit={handleToolSubmit}>
              {/* Honeypot */}
              <div aria-hidden="true" className={styles.honeypot}>
                <label htmlFor="ts-hp">Leave this blank</label>
                <input id="ts-hp" name="hp" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className={styles.formPanel}>
                <div className={styles.formPanelHeader}>
                  <span className={styles.formPanelTitle}>tool submissions</span>
                </div>
                <div className={styles.formBody}>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="ts-tool">Tool Name</label>
                      <input
                        className={styles.formInput}
                        id="ts-tool"
                        name="tool"
                        type="text"
                        placeholder="e.g. Jellyfin"
                        required
                        maxLength={160}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="ts-url">Repository / URL</label>
                      <input
                        className={styles.formInput}
                        id="ts-url"
                        name="url"
                        type="url"
                        placeholder="https://github.com/…"
                        maxLength={500}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="ts-category">Category</label>
                    <input
                      className={styles.formInput}
                      id="ts-category"
                      name="category"
                      type="text"
                      placeholder="e.g. Media, Dev Tools, Security…"
                      maxLength={120}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="ts-description">Why it belongs</label>
                    <textarea
                      className={styles.formTextarea}
                      id="ts-description"
                      name="description"
                      placeholder="what does it do, who is it for, and why should it be in the directory…"
                      required
                      maxLength={5000}
                    />
                  </div>

                  {TURNSTILE_SITE_KEY && (
                    <div className={styles.turnstileWrapper}>
                      <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
                    </div>
                  )}

                  {toolState === 'error' && toolError && (
                    <p className={styles.formError}>{toolError}</p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={toolState === 'loading'}
                  >
                    {toolState === 'loading' ? 'submitting…' : toolState === 'success' ? 'submitted ✓' : 'submit →'}
                  </button>

                </div>
              </div>
            </form>

          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>

            {/* Social links */}
            <div className={styles.socialPanel}>
              <div className={styles.socialPanelHeader}>
                <span className={styles.socialPanelTitle}>find us online</span>
              </div>

              {SOCIALS.map(({ name, handle, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  className={styles.socialRow}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`OpenFinder on ${name}`}
                >
                  <span className={styles.socialIcon}><Icon /></span>
                  <span className={styles.socialInfo}>
                    <span className={styles.socialName}>{name}</span>
                    <span className={styles.socialHandle}>{handle}</span>
                  </span>
                  <span className={styles.socialArrow}>→</span>
                </a>
              ))}
            </div>

            {/* Email card */}
            <div className={styles.emailPanel}>
              <div className={styles.socialPanelHeader}>
                <span className={styles.socialPanelTitle}>email</span>
              </div>
              <div className={styles.emailRow}>
                <span className={styles.emailLabel}>general</span>
                <a href="mailto:contact@theopenfinder.org" className={styles.emailAddress}>contact@theopenfinder.org</a>
              </div>
              <div className={styles.emailRow}>
                <span className={styles.emailLabel}>bulk submissions / corrections</span>
                <a href="mailto:submit@theopenfinder.org" className={styles.emailAddress}>submit@theopenfinder.org</a>
              </div>
              <div className={styles.emailRow}>
                <span className={styles.emailLabel}>security reports</span>
                <a href="mailto:security@theopenfinder.org" className={styles.emailAddress}>security@theopenfinder.org</a>
              </div>
            </div>

            {/* Info callout */}
            <div className={styles.infoCallout}>
              <p>
Have a tool to suggest? Send it through the form with notes on fit, category, and relevance.
              </p>
            </div>

          </aside>
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className={homeStyles.footer}>
          <div className={homeStyles.footerLeft}>
            <img src="/logo1-final.png" alt="OpenFinder" className="footerLogo" />
            <span className={homeStyles.footerTagline}>open source, easier to find.</span>
          </div>
          <div className={homeStyles.footerLinks}>
            <a href="/docs"              className={homeStyles.footerLink}>docs</a>
            <a href="https://github.com" className={homeStyles.footerLink}>github</a>
          </div>
        </footer>

      </div>
    </>
  );
}
