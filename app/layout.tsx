import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import FooterGate from '@/components/FooterGate';

export const metadata: Metadata = {
  title: 'M|R Walls — Sculptural Corian Surfaces',
  description: 'CNC-carved DuPont\u2122 Corian\u00AE architectural surfaces. Patented interlocking system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/shared/styles.css" />
        <link rel="stylesheet" href="/shared/homepage.css" />
      </head>
      <body>
        <Nav />
        {children}
        <FooterGate />
      </body>
    </html>
  );
}
