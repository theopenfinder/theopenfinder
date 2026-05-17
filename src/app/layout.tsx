import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default:  'OpenFinder — Open Source Discovery',
    template: '%s — OpenFinder',
  },
  description:
    'A discovery hub for open-source tools and alternatives across every category.',
  openGraph: {
    siteName:    'OpenFinder',
    type:        'website',
    locale:      'en_US',
    title:       'OpenFinder — Open Source Discovery',
    description: 'A discovery hub for open-source tools and alternatives across every category.',
    url:         'https://theopenfinder.org',
  },
};

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const CF_WA_TOKEN      = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
        {CF_WA_TOKEN && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token":"${CF_WA_TOKEN}"}`}
            strategy="afterInteractive"
          />
        )}
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
