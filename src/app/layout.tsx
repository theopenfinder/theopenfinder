import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
