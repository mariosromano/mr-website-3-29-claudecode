'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { cloudinaryUrl, installVideo } from '@/lib/data/cloudinary';

const proofNames = [
  'LAX', 'Mayo Clinic', 'Crypto.com Arena', 'Jefferson Health',
  'TikTok Nashville', 'Christ Journey Church', 'University of Wisconsin',
];

export default function HomeClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero parallax
    const heroEl = heroRef.current;
    if (!heroEl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroEl.style.transform = `translateY(${y * 0.35}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Lazy video
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = document.createElement('video');
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.innerHTML = `<source src="${installVideo}" type="video/mp4">`;
            el.appendChild(video);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '400px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Fade-up animations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.fade-up').forEach((el) => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = Array.from(entry.target.parentElement?.children || []).filter((el) =>
              el.classList.contains('fade-up')
            );
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('visible'), idx * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lazy background images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            if (el.dataset.bg) {
              el.style.backgroundImage = `url('${el.dataset.bg}')`;
            }
            observer.unobserve(el);
          }
        });
      },
      { rootMargin: '200px' }
    );
    document.querySelectorAll('[data-bg]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const routerTiles = [
    { name: 'Elevator Lobbies', desc: 'Seamless surfaces for high-traffic circulation', href: '/applications/elevator-lobbies', imageKey: 'flameHospitality' as const },
    { name: 'Feature Walls', desc: 'Sculptural statement surfaces', href: '/applications/feature-walls', imageKey: 'billowBacklight' as const },
    { name: 'Facades & Exteriors', desc: 'Rain screens \u00B7 Canopies \u00B7 Building envelopes', href: '/applications/facades', imageKey: 'blueFacade' as const },
    { name: 'Ceilings', desc: 'Carved canopies and overhead sculpture', href: '/applications/ceilings', imageKey: 'morongoCasino' as const },
    { name: 'Healthcare', desc: 'Antimicrobial \u00B7 Zero-joint \u00B7 GREENGUARD certified', href: '/healthcare', imageKey: 'seattleV2' as const, healthcare: true },
    { name: 'Water Features', desc: 'Non-porous carved surfaces with integrated flow', href: '/applications/water-features', imageKey: 'brickWaterfeature' as const },
  ];

  const featuredProjects = [
    { meta: 'Healthcare \u00B7 17,000 SF', title: 'Jefferson Health', desc: 'Largest InterlockPanel\u2122 installation in a healthcare facility', imageKey: 'laxAmericanAirlines' as const, href: '/projects/jefferson-health' },
    { meta: 'Backlit Interior \u00B7 Sports', title: 'Crypto.com Arena', desc: 'Dramatic backlit Corian feature walls in premium hospitality suites', imageKey: 'capitalOneArena' as const, href: '/projects/crypto-com-arena' },
    { meta: 'Exterior Facade \u00B7 180 mph wind-rated', title: 'Hallandale Beach Fins', desc: 'Hurricane-rated dimensional fin facade in South Florida', imageKey: 'finsExterior' as const, href: '/projects/hallandale-beach-fins' },
    { meta: 'Custom Ceiling \u00B7 Studio', title: 'TikTok Nashville', desc: 'One-of-one sculptural ceiling \u2014 a Studio project from concept to installation', imageKey: 'morongoCasino' as const, href: '/projects/tiktok-nashville' },
  ];

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="section-hero" id="hero">
        <div
          ref={heroRef}
          className="hero-image"
          style={{
            backgroundImage: `url('${cloudinaryUrl('lakeBacklight', 1920)}')`,
          }}
        />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-label">M|R Walls</div>
          <h1 className="hero-tagline">
            Sculptural surfaces. Carved from Corian.
            <br />
            <em>Some of them glow.</em>
          </h1>
          <p className="hero-sub">
            CNC-carved DuPont&trade; Corian&reg; architectural surfaces &middot; Patented interlocking system &middot; No joints
          </p>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          Scroll
        </div>
      </section>

      {/* ═══ ROUTER TILES ═══ */}
      <section className="section-router" id="applications">
        <div className="section-router-header fade-up">
          <h2>What are you building?</h2>
          <p>Select your application &rarr;</p>
        </div>
        <div className="router-grid">
          {routerTiles.map((tile) => (
            <Link
              key={tile.name}
              className={`router-tile fade-up${tile.healthcare ? ' healthcare-tile' : ''}`}
              href={tile.href}
            >
              <div
                className="router-tile-img"
                data-bg={cloudinaryUrl(tile.imageKey, 600)}
              />
              <div className="router-tile-glow" />
              <div className="router-tile-content">
                <div className="router-tile-name">{tile.name}</div>
                <div className="router-tile-desc">{tile.desc}</div>
              </div>
              <div className="router-tile-arrow">&rarr;</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ PROOF STRIP ═══ */}
      <section className="section-proof" id="projects">
        <div className="proof-label">Installed at</div>
        <div className="proof-track-wrapper">
          <div className="proof-track">
            {[...proofNames, ...proofNames].map((name, i) => (
              <span key={i}>
                <span className="proof-name">{name}</span>
                {i < proofNames.length * 2 - 1 && <span className="proof-divider" style={{ display: 'inline-block', width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', margin: '0 24px', verticalAlign: 'middle' }} />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE SYSTEM ═══ */}
      <section className="section-system" id="system">
        <div className="system-layout">
          <div className="system-visual fade-up" ref={videoRef} />
          <div className="system-text">
            <div className="section-label fade-up">The System</div>
            <h3 className="fade-up">
              CNC-carved. Interlocking.
              <br />
              No joints. No grout.
              <br />
              No field cutting.
            </h3>
            <ul className="system-features">
              <li className="fade-up">
                <div className="feature-icon">{'\u25C7'}</div>
                <div className="feature-text">
                  <strong>DuPont&trade; Corian&reg; Exclusive</strong>
                  <span>Only North American partner for architectural wall surfaces</span>
                </div>
              </li>
              <li className="fade-up">
                <div className="feature-icon">{'\u25C8'}</div>
                <div className="feature-text">
                  <strong>3 US Patents &middot; Sole-Source</strong>
                  <span>No approved equals. Protected through 2044.</span>
                </div>
              </li>
              <li className="fade-up">
                <div className="feature-icon">{'\u2726'}</div>
                <div className="feature-text">
                  <strong>
                    <Link href="/illuminated">Standard or ✦ Illuminated</Link>
                  </strong>
                  <span>Glacier White Corian backlights with a warm translucent glow</span>
                </div>
              </li>
            </ul>
            <div className="system-badge fade-up">
              <div className="system-badge-dot" />
              GREENGUARD &middot; NSF/FDA &middot; Antimicrobial &middot; Exterior-Rated
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="section-featured">
        <div className="featured-header fade-up">
          <div>
            <div className="section-label">Proof</div>
            <h2>The work speaks</h2>
          </div>
          <Link href="/projects" className="section-link">
            See all 731 projects &rarr;
          </Link>
        </div>
        <div className="card-grid card-grid-2">
          {featuredProjects.map((p) => (
            <Link key={p.title} className="image-card image-card-lg fade-up" href={p.href}>
              <div
                className="image-card-bg"
                data-bg={cloudinaryUrl(p.imageKey, 800)}
              />
              <div className="image-card-content">
                <div className="image-card-meta">{p.meta}</div>
                <div className="image-card-title">{p.title}</div>
                <div className="image-card-desc">{p.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ THREE PATHS ═══ */}
      <section className="section-paths" id="paths">
        <div className="paths-header fade-up">
          <div className="section-label">Ready?</div>
          <h2>Three ways to start</h2>
          <p>Every project begins here.</p>
        </div>
        <div className="paths-grid">
          <Link className="path-card fade-up" href="/designs">
            <div
              className="path-card-bg"
              data-bg={cloudinaryUrl('billowBacklight', 400)}
            />
            <div className="path-card-icon">{'\u25CE'}</div>
            <h3>Design Library</h3>
            <p>Find a design. Explore the family. Get the spec. 30+ named patterns ready for your construction documents.</p>
            <div className="path-card-cta">Browse Designs &rarr;</div>
          </Link>
          <Link className="path-card fade-up" href="/makereal">
            <div
              className="path-card-bg"
              data-bg={cloudinaryUrl('bloomFree', 400)}
            />
            <div className="path-card-icon">{'\u2726'}</div>
            <h3>MakeReal</h3>
            <p>Design something new. AI-assisted tools to generate custom patterns and push creative boundaries.</p>
            <div className="path-card-cta">Create a Design &rarr;</div>
          </Link>
          <Link className="path-card fade-up" href="/studio">
            <div
              className="path-card-bg"
              data-bg={cloudinaryUrl('fingerprint', 400)}
            />
            <div className="path-card-icon">{'\u25C6'}</div>
            <h3>Studio</h3>
            <p>Too complex for digital. Send us the challenge — sculptural ceilings, fin facades, one-of-one solutions.</p>
            <div className="path-card-cta">Send Us the Challenge &rarr;</div>
          </Link>
        </div>
      </section>
    </>
  );
}
