import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with OpenFinder — submit a tool, share feedback, or just say hello.',
  openGraph: {
    title: 'Contact — OpenFinder',
    description: 'Get in touch — submit a tool or share feedback.',
    url: 'https://theopenfinder.org/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
