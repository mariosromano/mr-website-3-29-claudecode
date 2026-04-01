'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import { AppTypeWithImage } from '@/lib/data/applications';

const sectors = [
  'Healthcare', 'Hospitality', 'Corporate', 'Multi-Family',
  'Aviation', 'Education', 'Retail', 'Residential', 'Sports',
];

interface Props {
  interior: AppTypeWithImage[];
  exterior: AppTypeWithImage[];
}

export default function ApplicationsClient({ interior, exterior }: Props) {
  const [activeSector, setActiveSector] = useState<string | null>(null);

  useEffect(() => {
    // Fade-up + lazy images
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const bgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            if (el.dataset.bg) el.style.backgroundImage = `url('${el.dataset.bg}')`;
            bgObserver.unobserve(el);
          }
        });
      },
      { rootMargin: '200px' }
    );
    document.querySelectorAll('.fade-up').forEach((el) => fadeObserver.observe(el));
    document.querySelectorAll('[data-bg]').forEach((el) => bgObserver.observe(el));
    return () => { fadeObserver.disconnect(); bgObserver.disconnect(); };
  }, [activeSector]);

  const isVisible = (app: AppTypeWithImage) => {
    if (!activeSector) return true;
    return app.sectors.includes(activeSector);
  };

  return (
    <>
      <section className="content-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div className="section-label">Filter by sector</div>
        <div className="filter-bar">
          {sectors.map((s) => (
            <button
              key={s}
              className={`filter-chip${activeSector === s ? ' active' : ''}`}
              onClick={() => setActiveSector(activeSector === s ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div style={{ marginBottom: 80 }}>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 28,
            fontWeight: 400,
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            Interior
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: '#c8b89a',
              border: '1px solid rgba(200,184,154,0.2)',
              padding: '4px 12px',
              borderRadius: 20,
              fontWeight: 500,
            }}>
              {interior.filter(isVisible).length} applications
            </span>
          </div>
          <div className="card-grid">
            {interior.filter(isVisible).map((app) => (
              <Link key={app.slug} className="image-card fade-up" href={`/applications/${app.slug}`}>
                <div className="image-card-bg" data-bg={cloudinaryUrl(app.imageKey, 600)} />
                <div className="image-card-content">
                  <div className="image-card-title">{app.name}</div>
                  <div className="image-card-desc">{app.description.slice(0, 60)}...</div>
                </div>
                <div className="image-card-arrow">&rarr;</div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 28,
            fontWeight: 400,
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            Exterior
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: '#c8b89a',
              border: '1px solid rgba(200,184,154,0.2)',
              padding: '4px 12px',
              borderRadius: 20,
              fontWeight: 500,
            }}>
              {exterior.filter(isVisible).length} applications
            </span>
          </div>
          <div className="card-grid card-grid-4">
            {exterior.filter(isVisible).map((app) => (
              <Link key={app.slug} className="image-card fade-up" href={`/applications/${app.slug}`}>
                <div className="image-card-bg" data-bg={cloudinaryUrl(app.imageKey, 600)} />
                <div className="image-card-content">
                  <div className="image-card-title">{app.name}</div>
                  <div className="image-card-desc">{app.description.slice(0, 60)}...</div>
                </div>
                <div className="image-card-arrow">&rarr;</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
