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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const handleMegaEnter = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  };

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
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
              >
                <Link href={item.href}>{item.label}</Link>

                {/* Mobile accordion toggle */}
                <button
                  className="mega-mobile-toggle"
                  onClick={(e) => { e.stopPropagation(); setMegaOpen(!megaOpen); }}
                  aria-label="Toggle applications menu"
                  style={{
                    display: 'none',
                    background: 'none',
                    border: 'none',
                    color: 'var(--mid)',
                    fontSize: 10,
                    marginLeft: 6,
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                />
              </li>
            );
          }
          return (
            <li key={item.key} className={activeKey === item.key ? 'active' : ''}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          );
        })}

        {/* Mega menu — renders inside nav-items on mobile, overlays on desktop */}
        {megaOpen && (
          <div
            className="mega-menu"
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
          >
            <div>
              <div className="mega-col-header">Interior Surfaces</div>
              {interiorApps.map((app) => (
                <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">
                  {app.name}
                </Link>
              ))}
            </div>
            <div>
              <div className="mega-col-header">Exterior Surfaces</div>
              {exteriorApps.map((app) => (
                <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">
                  {app.name}
                </Link>
              ))}
            </div>
            <div className="mega-col-featured">
              <Link href="/healthcare" className="mega-healthcare-card">
                <h4>Healthcare</h4>
                <p>Antimicrobial, zero-joint, backlit surfaces certified for clinical environments.</p>
                <div>
                  <span className="mega-badge">GREENGUARD Gold</span>
                  <span className="mega-badge">Antimicrobial</span>
                  <span className="mega-badge">Bleach-Safe</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </ul>
      <Link href="/contact" className="nav-cta">Contact</Link>
    </nav>
  );
}
