import Link from 'next/link';

export default function PageCTAs() {
  return (
    <section className="page-cta-section">
      <div className="section-label" style={{ textAlign: 'center', marginBottom: 48 }}>Ready to start?</div>
      <div className="page-cta-grid">
        <Link className="page-cta-card" href="/contact">
          <div className="page-cta-card-icon">{'\u25CE'}</div>
          <h3>Design Assist</h3>
          <p>Send us your project details. Dimensions, application, timeline. We&apos;ll engineer a solution.</p>
        </Link>
        <Link className="page-cta-card" href="/designs">
          <div className="page-cta-card-icon">{'\u25C7'}</div>
          <h3>Get the Spec</h3>
          <p>Find your design in the Design Library. Explore the family. Download CSI spec text in minutes.</p>
        </Link>
        <Link className="page-cta-card" href="/contact">
          <div className="page-cta-card-icon">{'\u2726'}</div>
          <h3>Request a Sample</h3>
          <p>Feel the material. See the carving. We&apos;ll ship a physical sample to your office.</p>
        </Link>
      </div>
    </section>
  );
}
