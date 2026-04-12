'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

// Routes where the global footer should be hidden (e.g. full-screen tool pages).
const HIDDEN_ON = new Set<string>(['/makereal', '/admin']);

export default function FooterGate() {
  const pathname = usePathname();
  if (pathname && HIDDEN_ON.has(pathname)) return null;
  return <Footer />;
}
