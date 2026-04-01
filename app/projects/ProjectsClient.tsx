'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import { ProjectWithImage } from '@/lib/data/projects';

const applicationFilters = [
  'Feature Walls', 'Facades', 'Ceilings', 'Column Wraps',
  'Water Features', 'Branded Environments', 'Reception Desks',
];

const sectorFilters = [
  'Healthcare', 'Hospitality', 'Corporate', 'Sports',
  'Aviation', 'Education', 'Multi-Family', 'Residential',
];

interface Props {
  projects: ProjectWithImage[];
}

export default function ProjectsClient({ projects }: Props) {
  const [appFilter, setAppFilter] = useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [illumFilter, setIllumFilter] = useState<boolean | null>(null);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (appFilter && p.application !== appFilter) return false;
      if (sectorFilter && p.sector !== sectorFilter) return false;
      if (illumFilter !== null && p.illuminated !== illumFilter) return false;
      return true;
    });
  }, [projects, appFilter, sectorFilter, illumFilter]);

  useEffect(() => {
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
    document.querySelectorAll('[data-bg]').forEach((el) => bgObserver.observe(el));
    return () => bgObserver.disconnect();
  }, [filtered]);

  return (
    <section className="content-section">
      {/* Application filter */}
      <div className="section-label">Filter by application</div>
      <div className="filter-bar" style={{ marginBottom: 16 }}>
        {applicationFilters.map((a) => (
          <button
            key={a}
            className={`filter-chip${appFilter === a ? ' active' : ''}`}
            onClick={() => setAppFilter(appFilter === a ? null : a)}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Sector filter */}
      <div className="section-label" style={{ marginTop: 24 }}>Filter by sector</div>
      <div className="filter-bar" style={{ marginBottom: 16 }}>
        {sectorFilters.map((s) => (
          <button
            key={s}
            className={`filter-chip${sectorFilter === s ? ' active' : ''}`}
            onClick={() => setSectorFilter(sectorFilter === s ? null : s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Illuminated toggle */}
      <div className="filter-bar" style={{ marginBottom: 40 }}>
        <button
          className={`filter-chip${illumFilter === true ? ' active' : ''}`}
          onClick={() => setIllumFilter(illumFilter === true ? null : true)}
        >
          {'\u2726'} Illuminated Only
        </button>
        <button
          className={`filter-chip${illumFilter === false ? ' active' : ''}`}
          onClick={() => setIllumFilter(illumFilter === false ? null : false)}
        >
          Standard Only
        </button>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 13, color: '#888', marginBottom: 32, letterSpacing: '0.04em' }}>
        Showing {filtered.length} of {projects.length} featured projects
      </p>

      {/* Project grid */}
      <div className="card-grid">
        {filtered.map((p) => (
          <Link key={p.slug} className="image-card" href={`/projects/${p.slug}`}>
            <div className="image-card-bg" data-bg={cloudinaryUrl(p.imageKey, 600)} />
            <div className="image-card-content">
              <div className="image-card-meta">
                {p.sector} &middot; {p.sqft} SF {p.illuminated ? ' · ✦' : ''}
              </div>
              <div className="image-card-title">{p.name}</div>
              <div className="image-card-desc">{p.application} &middot; {p.year}</div>
            </div>
            <div className="image-card-arrow">&rarr;</div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No projects match this filter combination.</p>
          <button
            style={{
              background: 'none',
              border: '1px solid rgba(200,184,154,0.3)',
              color: '#c8b89a',
              padding: '8px 20px',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 13,
              letterSpacing: '0.06em',
            }}
            onClick={() => { setAppFilter(null); setSectorFilter(null); setIllumFilter(null); }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}
