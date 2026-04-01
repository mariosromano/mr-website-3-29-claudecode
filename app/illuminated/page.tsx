import PageCTAs from '@/components/PageCTAs';
import HeroBleed from '@/components/HeroBleed';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import Link from 'next/link';

export const metadata = {
  title: '\u2726 Illuminated \u2014 M|R Walls',
  description:
    'Backlit Corian wall surfaces. Glacier White translucent panels with LED backlighting. 40% of all M|R Walls projects.',
};

const stats = [
  { value: '40%', label: 'of projects' },
  { value: '7\u00D7', label: 'margin uplift' },
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
    title: 'Smooth Side Out',
    desc: 'The CNC-carved face is oriented inward toward the light source. The smooth, translucent face faces outward \u2014 creating a soft, luminous glow.',
  },
];

const specs = [
  { label: 'Wall cavity depth', value: 'Minimum 3\u2033' },
  { label: 'Corian color', value: 'Glacier White only' },
  { label: 'LED type', value: 'Integrated LED array' },
  { label: 'Electrical', value: 'Required (dedicated circuit)' },
  { label: 'Dimming', value: 'Optional (0\u201310V)' },
  { label: 'RGB', value: 'Available on request' },
];

const galleryCards = [
  { imageKey: 'lakeBacklight' as const, title: 'Lake Backlight', desc: 'Translucent feature wall', href: '/designs' },
  { imageKey: 'billowBacklight' as const, title: 'Billow Backlight', desc: 'Illuminated wave pattern', href: '/designs' },
  { imageKey: 'seattleV2' as const, title: 'Seattle V2', desc: 'Geometric tile system', href: '/designs' },
  { imageKey: 'capitalOneArena' as const, title: 'Capital One Arena', desc: 'Large-scale sports venue', href: '/designs' },
  { imageKey: 'morongoCasino' as const, title: 'Morongo Casino', desc: 'Hospitality feature wall', href: '/designs' },
  { imageKey: 'bloomFree' as const, title: 'Bloom', desc: 'Organic floral pattern', href: '/designs' },
  { imageKey: 'flameHospitality' as const, title: 'Flame Hospitality', desc: 'Dynamic carved surface', href: '/designs' },
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
        description="Glacier White Corian is the only translucent color in the DuPont\u2122 palette. Pair it with an integrated LED array behind the panels and the carved pattern lights up from within. 40% of all M|R Walls projects are illuminated."
      />

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
          in the palette. The CNC-carved face is oriented inward; the smooth face glows outward.
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

      {/* ── Spec Requirements ── */}
      <section className="content-section">
        <div className="section-label">{'\u2726'} Spec Requirements</div>
        <h2>What the wall needs.</h2>
        <p className="section-desc">
          Illuminated installations require a minimum wall cavity depth and a dedicated electrical circuit.
          All other parameters are flexible.
        </p>
        <div
          style={{
            maxWidth: 640,
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderBottom:
                  i < specs.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                fontSize: 14,
              }}
            >
              <span style={{ color: '#888' }}>{spec.label}</span>
              <span style={{ color: '#f5f5f0', fontWeight: 400 }}>{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Standard vs Illuminated ── */}
      <section className="content-section">
        <div className="section-label">{'\u2726'} Comparison</div>
        <h2>Standard vs Illuminated.</h2>
        <p className="section-desc">
          Both use the same CNC-carved Corian panels and patented interlocking system.
          The difference is light.
        </p>
        <div className="compare-grid">
          <div className="compare-card">
            <div className="compare-tag">Standard</div>
            <h4>Any Color, Any Design</h4>
            <ul>
              <li>Any Corian color</li>
              <li>Any design pattern</li>
              <li>No electrical required</li>
              <li>Min 1.5&quot; wall cavity</li>
              <li>CNC-carved interlocking panels</li>
            </ul>
          </div>
          <div className="compare-card compare-card-accent">
            <div className="compare-tag">{'\u2726'} Illuminated</div>
            <h4>Glacier White Only</h4>
            <ul>
              <li>Glacier White only</li>
              <li>LED backlighting</li>
              <li>Min 3&quot; wall cavity</li>
              <li>Warm translucent glow</li>
              <li>40% of projects</li>
              <li>Highest design impact</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="content-section">
        <div className="section-label">{'\u2726'} Gallery</div>
        <h2>Illuminated projects.</h2>
        <p className="section-desc">
          Backlit installations across hospitality, corporate, healthcare, and public venues.
        </p>
        <div className="card-grid">
          {galleryCards.map((card) => (
            <Link className="image-card" href={card.href} key={card.imageKey}>
              <div
                className="image-card-bg"
                style={{ backgroundImage: `url('${cloudinaryUrl(card.imageKey, 800)}')` }}
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

      {/* ── CTAs ── */}
      <PageCTAs />
    </>
  );
}
