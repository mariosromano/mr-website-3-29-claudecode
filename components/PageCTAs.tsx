import Link from 'next/link';

export default function PageCTAs() {
  return (
    <section className="page-cta-section">
      <div className="section-label" style={{ textAlign: 'center', marginBottom: 48 }}>Ready to start?</div>
      <div className="page-cta-grid">
        <Link className="page-cta-card" href="/makereal">
          <div className="page-cta-card-icon">{'\u25CE'}</div>
          <h3>Configure Your Spec</h3>
          <p>5-step configurator. Application, sector, design, color. Get CSI spec text in minutes.</p>
        </Link>
        <Link className="page-cta-card" href="/contact">
          <div className="page-cta-card-icon">{'\u25C7'}</div>
          <h3>Request a DFP</h3>
          <p>Design Fabrication Proposal. Send us your project details and we&apos;ll engineer a solution.</p>
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
