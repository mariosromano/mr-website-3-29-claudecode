'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on navigation
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  // Desktop hover: single wrapper handles enter/leave
  const handleEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  // Mobile tap toggle
  const handleMobileMegaToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMegaOpen((prev) => !prev);
  }, []);

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
        onClick={() => { setMobileOpen(!mobileOpen); setMegaOpen(false); }}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>

      <ul className={`nav-items${mobileOpen ? ' open' : ''}`}>
        {navItems.map((item) => {
          if (item.hasMega) {
            return (
              <li key={item.key} className={activeKey === item.key ? 'active' : ''}>
                {/* Single wrapper for desktop hover — contains trigger + panel */}
                <div
                  className="mega-wrapper"
                  onMouseEnter={handleEnter}
                  onMouseLeave={handleLeave}
                >
                  <Link href={item.href} className="mega-trigger-link">
                    {item.label}
                  </Link>
                  <button
                    className="mega-mobile-btn"
                    onClick={handleMobileMegaToggle}
                    aria-label="Toggle applications menu"
                  >
                    {megaOpen ? '\u2212' : '+'}
                  </button>

                  {/* Desktop dropdown panel — inside the wrapper */}
                  {megaOpen && (
                    <div className="mega-panel">
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
                </div>
              </li>
            );
          }
          return (
            <li key={item.key} className={activeKey === item.key ? 'active' : ''}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          );
        })}

        {/* Mobile accordion — only visible in mobile nav */}
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

      <Link href="/contact" className="nav-cta">Contact</Link>
    </nav>
  );
}
