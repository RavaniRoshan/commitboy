import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Changelog Automator - Stop Writing CHANGELOG.md Manually',
  description: 'Auto-generate changelogs from your commits. Push to main → changelog updates. No manual work.',
  openGraph: {
    title: 'Changelog Automator',
    description: 'Auto-generate changelogs from your commits',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}