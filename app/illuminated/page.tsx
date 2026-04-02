import PageCTAs from '@/components/PageCTAs';
import HeroBleed from '@/components/HeroBleed';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import Link from 'next/link';

export const metadata = {
  title: '\u2726 Illuminated — M|R Walls',
  description:
    'Backlit Corian wall surfaces. Glacier White translucent panels with LED backlighting. RGB programmable via Madrix. Exterior-rated for facade applications.',
};

const stats = [
  { value: 'Madrix', label: 'programmable' },
  { value: 'Exterior', label: 'rated' },
  { value: 'RGB', label: 'available' },
  { value: '3"', label: 'wall depth required' },
];

const steps = [
  {
    num: '01',
    title: 'Translucent Corian',
    desc: 'Glacier White is the only translucent color in the DuPont\u2122 Corian\u00AE palette. Light passes through the material, revealing the carved pattern from within.',
  },
  {
    num: '02',
    title: 'Integrated LED Array',
    desc: 'A purpose-built LED array is mounted inside the wall cavity behind the panels. Warm white is standard; RGB color-changing is available on request.',
  },
  {
    num: '03',
    title: 'Orientation Options',
    desc: 'Panels can be installed carved-face-out for maximum texture, or smooth-face-out for healthcare applications where wipeable surfaces are required. Both orientations backlight beautifully.',
  },
];

const galleryCards = [
  { imageKey: 'lakeBacklight' as const, title: 'Lake Backlight', desc: 'Translucent feature wall', href: '/designs' },
  { imageKey: 'billowBacklight' as const, title: 'Billow Backlight', desc: 'Illuminated wave pattern', href: '/designs' },
  { imageKey: 'capitalOneArena' as const, title: 'Capital One Arena', desc: 'Large-scale sports venue', href: '/designs' },
  { imageKey: 'morongoCasino' as const, title: 'Morongo Casino', desc: 'Hospitality feature wall', href: '/designs' },
  { imageKey: 'bloomFree' as const, title: 'Bloom', desc: 'Organic floral pattern', href: '/designs' },
  { imageKey: 'brickWaterfeature' as const, title: 'Brick Waterfeature', desc: 'Textured water wall', href: '/designs' },
];

export default function IlluminatedPage() {
  return (
    <>
      {/* ── Hero ── */}
      <HeroBleed
        imageKey="lakeBacklight"
        label={'\u2726 Illuminated'}
        title="Some of them glow."
        description="Glacier White Corian is the only translucent color in the DuPont\u2122 palette. Pair it with an integrated LED array behind the panels and the carved pattern lights up from within."
      />

      {/* ── Gallery ── */}
      <section className="content-section">
        <div className="section-label">{'\u2726'} Gallery</div>
        <h2>Illuminated projects.</h2>
        <p className="section-desc">
          Backlit installations across hospitality, corporate, healthcare, and public venues.
        </p>
        <div className="card-grid card-grid-2">
          {galleryCards.map((card) => (
            <Link className="image-card" href={card.href} key={card.imageKey} style={{ aspectRatio: '3/2' }}>
              <div
                className="image-card-bg"
                style={{ backgroundImage: `url('${cloudinaryUrl(card.imageKey, 1200)}')` }}
              />
              <div className="image-card-content">
                <div className="image-card-title">{card.title}</div>
                <div className="image-card-desc">{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>
        <Link className="section-link" href="/designs">
          View full design library &rarr;
        </Link>
      </section>

      {/* ── Stats Strip ── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: '48px 32px',
              textAlign: 'center',
              borderRight: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 42,
                fontWeight: 400,
                color: '#c8b89a',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: '#888',
                fontWeight: 500,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── How It Works ── */}
      <section className="content-section">
        <div className="section-label">{'\u2726'} How It Works</div>
        <h2>Three layers, one luminous surface.</h2>
        <p className="section-desc">
          Every illuminated wall starts with Glacier White Corian, the only translucent color
          in the palette. Panels can be installed carved-face-out for maximum texture, or smooth-face-out for healthcare applications where wipeable surfaces are required. Both orientations backlight.
        </p>
        <div className="steps-row">
          {steps.map((step) => (
            <div className="step-card" key={step.num}>
              <div className="step-number">{step.num}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Spec Callout ── */}
      <section className="content-section">
        <p style={{
          fontSize: 15,
          color: '#888',
          lineHeight: 1.8,
          maxWidth: 720,
          borderLeft: '2px solid rgba(200,184,154,0.3)',
          paddingLeft: 24,
        }}>
          3″ wall cavity minimum · RGB programmable via Madrix · Exterior-rated for facade applications.
        </p>
      </section>

      {/* ── Turnkey RGB System ── */}
      <section className="content-section">
        <div className="section-label">{'\u2726'} RGB System</div>
        <h2>Turnkey RGB system.</h2>
        <p style={{
          fontSize: 15,
          color: '#888',
          lineHeight: 1.8,
          maxWidth: 600,
        }}>
          Madrix programmable controllers. Scene presets, color animation, and dynamic sequencing included. One vendor. One spec.
        </p>
      </section>

      {/* ── Exterior Rated ── */}
      <section className="content-section">
        <div className="section-label">{'\u2726'} Exterior</div>
        <h2>Exterior-rated.</h2>
        <p style={{
          fontSize: 15,
          color: '#888',
          lineHeight: 1.8,
          maxWidth: 600,
        }}>
          Illuminated facades, canopies, and outdoor feature walls — same glow, engineered for weather.
        </p>
      </section>

      {/* ── CTAs ── */}
      <PageCTAs />
    </>
  );
}
