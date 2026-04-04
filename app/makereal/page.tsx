import type { Metadata } from 'next';
import Link from 'next/link';
import PageCTAs from '@/components/PageCTAs';
import { cloudinaryUrl } from '@/lib/data/cloudinary';

export const metadata: Metadata = {
  title: 'MakeReal — M|R Walls',
  description: 'AI-assisted design tools for architects. Generate custom designs and explore creative possibilities.',
};

export default function MakeRealPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="section-label">MakeReal</div>
        <h1>Design something new</h1>
        <p className="hero-desc">
          AI-assisted design tools for architects and designers. Generate custom
          patterns, explore new aesthetics, and push the limits of CNC-carved surfaces.
        </p>
      </section>

      {/* What MakeReal Can Do */}
      <section className="content-section">
        <div className="section-label">Capabilities</div>
        <h2>What MakeReal can do</h2>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Generate</h4>
            <p>
              Describe the feeling you want. Mara AI generates sculptural surface
              designs constrained to our CNC toolpaths and material limits.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h4>Iterate</h4>
            <p>
              Adjust pattern, depth, color, and lighting in real time. Every
              output is fabrication-ready — no guesswork.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h4>Explore</h4>
            <p>
              Go beyond the Design Library. Create something that doesn&apos;t
              exist yet — organic, geometric, or something entirely new.
            </p>
          </div>
        </div>
      </section>

      {/* AI Design Generator */}
      <section className="content-section">
        <div className="section-label">AI Design</div>
        <h2>Mara AI Design Generator</h2>
        <div style={{
          display: 'flex',
          gap: 48,
          alignItems: 'flex-start',
          flexWrap: 'wrap' as const,
        }}>
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <p style={{
              fontSize: 15,
              color: '#888',
              lineHeight: 1.8,
              maxWidth: 480,
              marginBottom: 32,
            }}>
              Describe the feeling you want. Mara generates sculptural surface designs
              that are fabrication-ready — constrained to our CNC toolpaths and
              material limits so every output is buildable.
            </p>
            <a
              href="https://mara-v15.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="section-link"
            >
              Launch Mara AI <span>&rarr;</span>
            </a>
          </div>
          <div style={{
            flex: '1 1 400px',
            minWidth: 320,
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#c8b89a',
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: 13,
                color: '#888',
                fontStyle: 'italic',
              }}>
                &ldquo;Generate a backlit wave pattern for a healthcare elevator lobby&rdquo;
              </span>
            </div>
            <div style={{ position: 'relative', aspectRatio: '16/10' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${cloudinaryUrl('billowBacklight', 1200)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
            </div>
            <div style={{
              padding: '10px 20px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: 'rgba(200,184,154,0.5)',
            }}>
              Mara output
            </div>
          </div>
        </div>
      </section>

      {/* Bridge links */}
      <section className="content-section">
        <div className="section-label">Explore more</div>
        <h2>Other ways to work with us</h2>
        <div className="compare-grid">
          <Link href="/designs" className="compare-card" style={{ textDecoration: 'none' }}>
            <div className="compare-tag">Design Library</div>
            <h4>Find a design. Get the spec.</h4>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>
              30+ named, spec-ready patterns. Browse by application, sector, or
              surface type. Select your design and download the spec immediately.
            </p>
          </Link>
          <Link href="/studio" className="compare-card" style={{ textDecoration: 'none' }}>
            <div className="compare-tag">Studio</div>
            <h4>Too complex for digital?</h4>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>
              Sculptural ceilings, fin facades, and one-of-one solutions require
              hands-on engineering. Send us the challenge.
            </p>
          </Link>
        </div>
      </section>

      {/* Page CTAs */}
      <PageCTAs />
    </>
  );
}
