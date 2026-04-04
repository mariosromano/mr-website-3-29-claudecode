'use client';

import { useState, useEffect } from 'react';
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

const exteriorCerts = ['180 mph', '-40°F to 140°F', 'UV Stable'];

const sectors = [
  { href: '/healthcare', name: 'Healthcare', sub: 'Antimicrobial \u00b7 Zero-joint \u00b7 GREENGUARD', accent: true },
  { href: '/sector/casino-gaming', name: 'Casino & Gaming', sub: 'Illuminated ceilings \u00b7 RGB \u00b7 Branded', accent: false },
  { href: '/sector/aviation', name: 'Aviation', sub: '5,000 SF at LAX \u00b7 16-day install', accent: false },
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
  const [mobileAccordion, setMobileAccordion] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileAccordion(false);
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
        onClick={() => { setMobileOpen(!mobileOpen); setMobileAccordion(false); }}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>

      <ul className={`nav-items${mobileOpen ? ' open' : ''}`}>
        {navItems.map((item) => {
          if (item.hasMega) {
            return (
              <li key={item.key} className={`mega-wrapper ${activeKey === item.key ? 'active' : ''}`}>
                <Link href={item.href}>{item.label}</Link>
                <button
                  className="mega-mobile-btn"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileAccordion(!mobileAccordion); }}
                  aria-label="Toggle applications menu"
                >
                  {mobileAccordion ? '\u2212' : '+'}
                </button>

                {/* Panel always in DOM — CSS hover shows it on desktop */}
                <div className="mega-panel">
                  <div className="mega-columns">
                    <div className="mega-col">
                      <div className="mega-col-header">Interior Surfaces</div>
                      {interiorApps.map((app) => (
                        <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">{app.name}</Link>
                      ))}
                    </div>
                    <div className="mega-col">
                      <div className="mega-col-header">Exterior Surfaces</div>
                      {exteriorApps.map((app) => (
                        <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">{app.name}</Link>
                      ))}
                      <div className="mega-cert-divider" />
                      <div className="mega-cert-row">
                        {exteriorCerts.map((c) => (
                          <span key={c} className="mega-cert-pill">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mega-col">
                      <div className="mega-col-header">Sectors</div>
                      {sectors.map((s) => (
                        <Link key={s.href} href={s.href} className={`mega-sector-card${s.accent ? ' mega-sector-accent' : ''}`}>
                          <div className="mega-sector-name">{s.name}</div>
                          <div className="mega-sector-sub">
                            <span className="mega-sector-diamond">{'\u25C7'}</span>{s.sub}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
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

        {/* Mobile accordion */}
        {mobileAccordion && (
          <li className="mega-accordion">
            <div className="mega-accordion-inner">
              <div className="mega-col-header">Interior Surfaces</div>
              {interiorApps.map((app) => (
                <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">{app.name}</Link>
              ))}
              <div className="mega-col-header" style={{ marginTop: 16 }}>Exterior Surfaces</div>
              {exteriorApps.map((app) => (
                <Link key={app.slug} href={`/applications/${app.slug}`} className="mega-link">{app.name}</Link>
              ))}
              <div className="mega-col-header" style={{ marginTop: 16 }}>Sectors</div>
              {sectors.map((s) => (
                <Link key={s.href} href={s.href} className="mega-link">
                  {s.name}
                  <span style={{ display: 'block', fontSize: 11, color: 'rgba(200,184,154,0.5)', marginTop: 2 }}>{s.sub}</span>
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
