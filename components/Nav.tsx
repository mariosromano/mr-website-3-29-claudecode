'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const interiorApps = [
  { slug: 'elevator-lobbies', name: 'Elevator Lobbies' },
  { slug: 'feature-walls', name: 'Feature Walls' },
  { slug: 'reception', name: 'Reception' },
  { slug: 'grand-entry', name: 'Grand Entry' },
  { slug: 'ceilings', name: 'Ceilings' },
  { slug: 'hallway', name: 'Hallway' },
  { slug: 'branding', name: 'Branding' },
  { slug: 'meditation-rooms', name: 'Meditation Rooms' },
];

const exteriorApps = [
  { slug: 'facades', name: 'Facades' },
  { slug: 'water-features', name: 'Water Features' },
];

const sectors = [
  { href: '/healthcare', name: 'Healthcare' },
  { href: '/sector/casino-gaming', name: 'Casino & Gaming' },
  { href: '/sector/aviation', name: 'Aviation' },
];

const navItems = [
  { href: '/applications', label: 'Applications', key: 'applications', hasMega: true },
  { href: '/system', label: 'The System', key: 'system' },
  { href: '/projects', label: 'Projects', key: 'projects' },
  { href: '/designs', label: 'Design Library', key: 'designs' },
  { href: '/illuminated', label: '\u2726 Illuminated', key: 'illuminated' },
  { href: '/makereal', label: 'MakeReal', key: 'makereal' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  };

  const activeKey = pathname.split('/').filter(Boolean)[0] || 'home';

  return (
    <nav
      ref={navRef}
      className="nav"
      style={{ background: scrolled ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.85)' }}
    >
      <Link href="/" className="nav-logo">
        M<span>|</span>R WALLS
      </Link>
      <button
        className="nav-toggle"
        onClick={() => { setOpen(!open); setMegaOpen(false); }}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>
      <ul className={`nav-items${open ? ' open' : ''}`}>
        {navItems.map((item) => {
          if (item.hasMega) {
            return (
              <li
                key={item.key}
                className={`${activeKey === item.key ? 'active' : ''} nav-app-trigger`}
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <Link href={item.href}>{item.label}</Link>
                {/* Mobile: tap to expand */}
                <button
                  className="mega-mobile-btn"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMegaOpen(!megaOpen); }}
                  aria-label="Toggle applications menu"
                >
                  {megaOpen ? '\u2212' : '+'}
                </button>
              </li>
            );
          }
          return (
            <li key={item.key} className={activeKey === item.key ? 'active' : ''}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          );
        })}

        {/* Mobile mega accordion — inside nav-items so it shows when menu is open */}
        {megaOpen && (
          <li className="mega-accordion">
            <div className="mega-accordion-inner">
              <div className="mega-col-header">Interior</div>
              {interiorApps.map((app) => (
                <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">
                  {app.name}
                </Link>
              ))}
              <div className="mega-col-header" style={{ marginTop: 16 }}>Exterior</div>
              {exteriorApps.map((app) => (
                <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">
                  {app.name}
                </Link>
              ))}
              <div className="mega-col-header" style={{ marginTop: 16 }}>Sectors</div>
              {sectors.map((s) => (
                <Link key={s.href} href={s.href} className="mega-link">
                  {s.name}
                </Link>
              ))}
            </div>
          </li>
        )}
      </ul>

      {/* Desktop mega menu — positioned below entire nav bar */}
      {megaOpen && (
        <div
          className="mega-menu"
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="mega-columns">
            <div>
              <div className="mega-col-header">Interior</div>
              {interiorApps.map((app) => (
                <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">
                  {app.name}
                </Link>
              ))}
            </div>
            <div>
              <div className="mega-col-header">Exterior</div>
              {exteriorApps.map((app) => (
                <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">
                  {app.name}
                </Link>
              ))}
            </div>
            <div>
              <div className="mega-col-header">Sectors</div>
              {sectors.map((s) => (
                <Link key={s.href} href={s.href} className="mega-link">
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Link href="/contact" className="nav-cta">Contact</Link>
    </nav>
  );
}
