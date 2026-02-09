import type { Metadata } from 'next';
import { IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Commitboy — Your changelog shouldn’t be a chore',
  description:
    'Commitboy turns messy commits into professional changelogs automatically. Watch chaos become clarity as you scroll.',
  openGraph: {
    title: 'Commitboy',
    description: 'Messy commits in. Professional changelog out.',
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
      <body className={`${plexSans.variable} ${spaceGrotesk.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
