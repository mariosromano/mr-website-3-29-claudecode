'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/applications', label: 'Applications', key: 'applications' },
  { href: '/system', label: 'The System', key: 'system' },
  { href: '/projects', label: 'Projects', key: 'projects' },
  { href: '/designs', label: 'Design Library', key: 'designs' },
  { href: '/illuminated', label: '\u2726 Illuminated', key: 'illuminated' },
  { href: '/makereal', label: 'MakeReal', key: 'makereal' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const activeKey = pathname.split('/').filter(Boolean)[0] || 'home';

  return (
    <nav
      className="nav"
      style={{ background: scrolled ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.85)' }}
    >
      <Link href="/" className="nav-logo">
        M<span>|</span>R WALLS
      </Link>
      <button
        className="nav-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>
      <ul className={`nav-items${open ? ' open' : ''}`}>
        {navItems.map((item) => (
          <li key={item.key} className={activeKey === item.key ? 'active' : ''}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <Link href="/contact" className="nav-cta">Contact</Link>
    </nav>
  );
}
