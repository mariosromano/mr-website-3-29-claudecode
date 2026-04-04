'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { DesignFamily } from '@/lib/airtable';
import SpecConfigurator from '@/components/SpecConfigurator';
import DesignAssistForm from '@/components/DesignAssistForm';
import SampleRequestForm from '@/components/SampleRequestForm';

interface FamilyClientProps {
  family: DesignFamily;
  relatedFamilies: DesignFamily[];
}

type ActivePanel = null | 'assist' | 'spec' | 'sample';

export default function FamilyClient({ family, relatedFamilies }: FamilyClientProps) {
  const [heroImage, setHeroImage] = useState(family.heroImage);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <>
      {/* HERO — full-bleed image */}
      <section className="family-hero">
        <div className="family-hero-bg">
          <Image
            src={heroImage}
            alt={family.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
            priority
          />
          <div className="family-hero-gradient" />
        </div>
        <div className="family-hero-content">
          <div className="section-label">Design Library</div>
          <h1 className="family-hero-title">{family.name}</h1>
          <div className="family-hero-badges">
            {family.specReady && (
              <span className="family-badge">Spec-Ready</span>
            )}
            {family.hasIlluminated && (
              <span className="family-badge">✦ Illuminated</span>
            )}
            {family.hasStandard && (
              <span className="family-badge">Standard</span>
            )}
            {family.sectors.map((s) => (
              <span key={s} className="family-badge">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* THUMBNAIL STRIP */}
      {family.products.length > 1 && (
        <div className="family-thumbstrip">
          {family.products.map((p) => (
            <button
              key={p.id}
              className={`family-thumb ${p.cloudinaryUrl === heroImage ? 'active' : ''}`}
              onClick={() => setHeroImage(p.cloudinaryUrl)}
            >
              <Image
                src={p.cloudinaryUrl}
                alt={p.title}
                fill
                sizes="120px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* DESCRIPTION */}
      <section className="content-section">
        {family.description && (
          <p style={{ fontSize: 15, color: '#e8e4dc', lineHeight: 1.7, maxWidth: 700, marginBottom: 32 }}>
            {family.description}
          </p>
        )}
        {!family.description && (
          <p style={{ fontSize: 15, color: '#e8e4dc', lineHeight: 1.7, maxWidth: 700, marginBottom: 32 }}>
            {family.name} is a CNC-carved Corian design family{family.hasIlluminated ? ' available as a backlit Illuminated panel in Glacier White and' : ''} in 100+ Corian colors. Part of the M|R Walls Design Library — spec-ready patterns engineered for the InterlockPanel&#8482; system.
          </p>
        )}

        {/* ACTION BUTTONS */}
        <div className="section-label">What would you like to do with this design?</div>
        <div className="family-actions">
          <button
            className={`family-action-btn ${activePanel === 'assist' ? 'active' : ''}`}
            onClick={() => togglePanel('assist')}
          >
            <span className="family-action-icon">&#9678;</span>
            Design Assist
          </button>
          <button
            className={`family-action-btn ${activePanel === 'spec' ? 'active' : ''}`}
            onClick={() => togglePanel('spec')}
          >
            <span className="family-action-icon">&#9671;</span>
            Get the Spec
          </button>
          <button
            className={`family-action-btn ${activePanel === 'sample' ? 'active' : ''}`}
            onClick={() => togglePanel('sample')}
          >
            <span className="family-action-icon">&#10022;</span>
            Request a Sample
          </button>
        </div>

        {/* INLINE PANELS */}
        {activePanel === 'assist' && (
          <div className="family-panel">
            <DesignAssistForm designName={family.name} hasIlluminated={family.hasIlluminated} />
          </div>
        )}
        {activePanel === 'spec' && (
          <div className="family-panel">
            <SpecConfigurator family={family} />
          </div>
        )}
        {activePanel === 'sample' && (
          <div className="family-panel">
            <SampleRequestForm designName={family.name} />
          </div>
        )}
      </section>

      {/* RELATED DESIGNS */}
      {relatedFamilies.length > 0 && (
        <section className="content-section">
          <div className="section-label">Related designs</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, marginBottom: 40 }}>
            You might also like
          </h2>
          <div className="card-grid card-grid-4">
            {relatedFamilies.map((f) => (
              <Link key={f.slug} className="image-card" href={`/designs/${f.slug}`}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <Image
                    src={f.heroImage}
                    alt={f.name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="image-card-content">
                  <div className="image-card-title">{f.name}</div>
                  <div className="image-card-desc">
                    {f.sectors.slice(0, 2).join(' · ')}
                    {f.hasIlluminated ? ' · ✦ Illuminated' : ''}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/designs" className="section-link">
            Back to Design Library &rarr;
          </Link>
        </section>
      )}
    </>
  );
}
