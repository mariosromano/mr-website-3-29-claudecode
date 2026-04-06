'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { DesignFamily } from '@/lib/airtable';
import SpecConfigurator from '@/components/SpecConfigurator';
import DesignAssistForm from '@/components/DesignAssistForm';
import MakeRealVisualizer from '@/components/MakeRealVisualizer';

interface FamilyClientProps {
  family: DesignFamily;
  relatedFamilies: DesignFamily[];
}

type ActivePanel = null | 'assist' | 'spec' | 'makereal';

// Known descriptions — fallback when Airtable description is empty
const KNOWN_DESCRIPTIONS: Record<string, string> = {
  Billow: 'Soft, sweeping lines flow like leaves of a thriving plant. Billow brings calm and movement to any space.',
};

// Clean stock textures for MakeReal AI generation (better results than Airtable hero images)
const MAKEREAL_STOCK_IMAGES: Record<string, string> = {
  Billow: 'https://res.cloudinary.com/dtlodxxio/image/upload/v1775404766/makereal/billow/billow-white-12x12-stock.png',
};

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
            <span className="family-badge">Spec-Ready</span>
            {family.hasIlluminated && (
              <span className="family-badge">✦ Illuminated</span>
            )}
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
                sizes="200px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* DESCRIPTION */}
      <section className="content-section">
        <p style={{ fontSize: 15, color: '#e8e4dc', lineHeight: 1.7, maxWidth: 700, marginBottom: 32 }}>
          {KNOWN_DESCRIPTIONS[family.name] || family.description || `${family.name} is a CNC-carved Corian design family${family.hasIlluminated ? ' available as a backlit Illuminated panel in Glacier White and' : ''} in 100+ Corian colors. Part of the M\u007CR Walls Design Library \u2014 spec-ready patterns engineered for the InterlockPanel\u2122 system.`}
        </p>

        {/* ACTION BUTTONS */}
        <div className="section-label">What would you like to do with this design?</div>
        <div className="family-actions">
          <button
            data-panel="assist"
            className={`family-action-btn ${activePanel === 'assist' ? 'active' : ''}`}
            onClick={() => togglePanel('assist')}
          >
            <span className="family-action-icon">&#9678;</span>
            Design Assist
          </button>
          <button
            data-panel="spec"
            className={`family-action-btn ${activePanel === 'spec' ? 'active' : ''}`}
            onClick={() => togglePanel('spec')}
          >
            <span className="family-action-icon">&#9671;</span>
            Get the Spec
          </button>
          <button
            data-panel="makereal"
            className={`family-action-btn ${activePanel === 'makereal' ? 'active' : ''}`}
            onClick={() => togglePanel('makereal')}
          >
            <span className="family-action-icon">&#10022;</span>
            See {family.name} with MakeReal
          </button>
        </div>

        {/* Sample link — moved below buttons */}
        <p style={{ fontSize: 13, color: '#888', marginTop: 16 }}>
          Need a physical material sample?{' '}
          <Link href="/contact" style={{ color: '#c8b89a', fontWeight: 500 }}>
            Request one here &rarr;
          </Link>
        </p>

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
        {activePanel === 'makereal' && (
          <div className="family-panel">
            <MakeRealVisualizer
              designName={family.name}
              referenceImageUrl={MAKEREAL_STOCK_IMAGES[family.name] || family.heroImage}
            />
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
