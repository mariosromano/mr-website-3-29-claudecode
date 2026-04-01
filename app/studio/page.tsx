import type { Metadata } from 'next';
import Link from 'next/link';
import HeroBleed from '@/components/HeroBleed';
import PageCTAs from '@/components/PageCTAs';
import { cloudinaryUrl } from '@/lib/data/cloudinary';

export const metadata: Metadata = {
  title: 'Studio — M|R Walls',
  description: 'Sculptural ceilings, fin facades, one-of-one solutions.',
};

const PROVEN_SOLUTIONS = [
  { title: 'Ribs', desc: 'Hospitality & retail', imageKey: 'flameHospitality' as const },
  { title: 'Fins', desc: 'Exterior facades', imageKey: 'finsExterior' as const },
  { title: 'Slice', desc: 'Sculptural surfaces', imageKey: 'fingerprint' as const },
  { title: 'Screen', desc: 'Partition & screening', imageKey: 'seattleV2' as const },
];

const TROPHY_PROJECTS = [
  {
    name: 'TikTok Nashville',
    desc: 'Custom sculptural wall for TikTok\'s Nashville headquarters. Parametric design, 40ft span.',
    imageKey: 'lakeBacklight' as const,
  },
  {
    name: 'Christ Journey Church',
    desc: 'Backlit feature wall with organic wave pattern. Corian illuminated from behind.',
    imageKey: 'billowBacklight' as const,
  },
  {
    name: 'Morongo Casino',
    desc: 'Grand gaming floor ceiling system. Thousands of CNC-carved panels in custom pattern.',
    imageKey: 'morongoCasino' as const,
  },
  {
    name: 'VA Hospital Fins',
    desc: 'Exterior vertical fin facade for the Veterans Affairs Medical Center. Durable, cleanable.',
    imageKey: 'blueFacade' as const,
  },
  {
    name: 'Hallandale Beach',
    desc: 'Large-scale sculptural wall installation. Curved compound surfaces with integrated lighting.',
    imageKey: 'bloomFree' as const,
  },
  {
    name: 'SmithGroup DC',
    desc: 'Feature wall for SmithGroup\'s Washington DC lobby. Precision-carved continuous surface.',
    imageKey: 'capitalOneArena' as const,
  },
];

export default function StudioPage() {
  return (
    <>
      {/* Hero */}
      <HeroBleed
        imageKey="fingerprint"
        label="Studio"
        title="Send us the challenge"
        description="Sculptural ceilings, fin facades, and one-of-one solutions. Studio handles the projects that go beyond configurators and catalogs."
      />

      {/* What Studio Does */}
      <section className="content-section">
        <div className="section-label">What we do</div>
        <h2>One-of-one architectural surfaces</h2>
        <div
          style={{
            maxWidth: 720,
            fontSize: 15,
            color: '#888',
            lineHeight: 1.8,
            marginTop: 24,
          }}
        >
          <p style={{ marginBottom: 16 }}>
            Studio is our custom engineering arm. When the project can&apos;t be solved
            with a standard panel system — when geometry is compound, spans are
            massive, or the vision is truly singular — Studio takes over.
          </p>
          <p>
            We combine CNC fabrication, parametric modeling, and material science
            to deliver architectural surfaces that have never been built before.
            Every project starts with your challenge and ends with installed panels.
          </p>
        </div>
      </section>

      {/* Proven Solutions */}
      <section className="content-section">
        <div className="section-label">Capabilities</div>
        <h2>Proven solutions</h2>
        <p className="section-desc">
          Typologies we&apos;ve engineered, tested, and installed at scale.
        </p>
        <div className="card-grid card-grid-4">
          {PROVEN_SOLUTIONS.map((item) => (
            <div key={item.title} className="image-card">
              <div
                className="image-card-bg"
                style={{
                  backgroundImage: `url('${cloudinaryUrl(item.imageKey, 600)}')`,
                }}
              />
              <div className="image-card-content">
                <div className="image-card-title">{item.title}</div>
                <div className="image-card-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trophy Projects */}
      <section className="content-section">
        <div className="section-label">Selected work</div>
        <h2>Trophy projects</h2>
        <p className="section-desc">
          Landmark installations across the United States.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
            marginTop: 8,
          }}
        >
          {TROPHY_PROJECTS.map((project) => (
            <div
              key={project.name}
              style={{
                position: 'relative',
                borderRadius: 6,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                aspectRatio: '16/10',
                cursor: 'pointer',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url('${cloudinaryUrl(project.imageKey, 800)}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.6s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 28,
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                    marginBottom: 6,
                  }}
                >
                  {project.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#888',
                    lineHeight: 1.5,
                    maxWidth: 360,
                  }}
                >
                  {project.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How Studio Works */}
      <section className="content-section">
        <div className="section-label">Process</div>
        <h2>How Studio works</h2>
        <p className="section-desc">
          From first conversation to installed panels.
        </p>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Send the Challenge</h4>
            <p>
              Share your drawings, renderings, or napkin sketches. Tell us the
              constraints. We&apos;ll tell you what&apos;s possible.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h4>We Design &amp; Engineer</h4>
            <p>
              Our team develops parametric models, prototypes toolpaths, and
              engineers the connection system for your specific geometry.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h4>We Build &amp; Deliver</h4>
            <p>
              CNC fabrication in our Santa Monica shop. Every panel numbered,
              nested, and shipped with installation guides.
            </p>
          </div>
        </div>
      </section>

      {/* Bridge CTA */}
      <section
        className="content-section"
        style={{ textAlign: 'center' }}
      >
        <div className="section-label" style={{ textAlign: 'center' }}>
          Standard projects
        </div>
        <h2 style={{ margin: '0 auto 16px', maxWidth: 600 }}>
          Looking for something simpler?
        </h2>
        <p
          className="section-desc"
          style={{ margin: '0 auto 32px', textAlign: 'center' }}
        >
          Our MakeReal digital tools let you configure, generate, and spec
          standard wall panels in minutes — no engineering consultation required.
        </p>
        <Link href="/makereal" className="section-link" style={{ justifyContent: 'center' }}>
          Explore MakeReal <span>&rarr;</span>
        </Link>
      </section>

      {/* Page CTAs */}
      <PageCTAs />
    </>
  );
}
