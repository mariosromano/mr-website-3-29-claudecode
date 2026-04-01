import type { Metadata } from 'next';
import Link from 'next/link';
import PageCTAs from '@/components/PageCTAs';

export const metadata: Metadata = {
  title: 'MakeReal — M|R Walls',
  description: 'Configure, generate, spec. Digital tools for architects.',
};

export default function MakeRealPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="section-label">MakeReal</div>
        <h1>Configure, generate, spec</h1>
        <p className="hero-desc">
          Digital tools for architects and designers. Configure your wall system,
          generate AI-driven designs, and download spec-ready documents — all
          without picking up the phone.
        </p>
      </section>

      {/* Embedded Configurator */}
      <section className="content-section">
        <div className="section-label">Configurator</div>
        <h2>Build your spec in minutes</h2>
        <p className="section-desc">
          Select your application, sector, dimensions, and design. The
          configurator outputs CSI-format specification text and shop-drawing-ready
          data.
        </p>
        <div
          style={{
            borderRadius: 6,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <iframe
            src="https://g268pt.csb.app/"
            title="M|R Walls Configurator"
            style={{
              width: '100%',
              height: 600,
              border: 'none',
              display: 'block',
              background: '#111',
            }}
            allow="clipboard-write"
          />
        </div>
      </section>

      {/* Three-step visual */}
      <section className="content-section">
        <div className="section-label">How it works</div>
        <h2>Three steps to a spec</h2>
        <p className="section-desc">
          From concept to construction document in one sitting.
        </p>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Configure</h4>
            <p>
              Choose your dimensions, application, and sector. The system narrows
              your options to what actually works.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h4>Generate</h4>
            <p>
              AI creates your design based on your parameters. Adjust pattern,
              depth, color, and lighting in real time.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h4>Spec</h4>
            <p>
              Get CSI-format spec text and shop drawings. Ready for your
              construction documents and submittals.
            </p>
          </div>
        </div>
      </section>

      {/* AI Design Generator */}
      <section className="content-section">
        <div className="section-label">AI Design</div>
        <h2>Mara AI Design Generator</h2>
        <p className="section-desc">
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
      </section>

      {/* Bridge to Studio */}
      <section
        className="content-section"
        style={{ textAlign: 'center' }}
      >
        <div className="section-label" style={{ textAlign: 'center' }}>
          Need more?
        </div>
        <h2 style={{ margin: '0 auto 16px', maxWidth: 600 }}>
          Too complex for digital?
        </h2>
        <p
          className="section-desc"
          style={{ margin: '0 auto 32px', textAlign: 'center' }}
        >
          Sculptural ceilings, fin facades, and one-of-one solutions require
          hands-on engineering. Our Studio team handles the projects that can&apos;t
          be configured.
        </p>
        <Link href="/studio" className="section-link" style={{ justifyContent: 'center' }}>
          Explore Studio <span>&rarr;</span>
        </Link>
      </section>

      {/* Page CTAs */}
      <PageCTAs />
    </>
  );
}
