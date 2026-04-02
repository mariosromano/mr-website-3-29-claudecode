import Link from 'next/link';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import { getInteriorApplications, getExteriorApplications } from '@/lib/data/applications';
import PageCTAs from '@/components/PageCTAs';

export const metadata = {
  title: 'Applications — M|R Walls',
  description: 'Explore M|R Walls applications: elevator lobbies, feature walls, facades, ceilings, water features, and more.',
};

export default function ApplicationsPage() {
  const interior = getInteriorApplications();
  const exterior = getExteriorApplications();

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-hero" style={{ paddingBottom: '48px' }}>
        <div className="section-label">Applications</div>
        <h1>What are you building?</h1>
        <p className="hero-desc">
          Every M|R Walls project starts with an application type. Each is engineered for its specific demands — traffic, moisture, wind, light.
        </p>
      </section>

      {/* ── Healthcare Banner ── */}
      <section className="content-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <Link href="/healthcare" className="healthcare-banner">
          <div
            className="healthcare-banner-bg"
            style={{ backgroundImage: `url('${cloudinaryUrl('billowBacklight', 1200)}')` }}
          />
          <div className="healthcare-banner-content">
            <div className="section-label">Healthcare</div>
            <h3>The only antimicrobial, zero-joint, backlit wall surface certified for healthcare</h3>
            <div className="healthcare-banner-badges">
              <span className="mega-badge">GREENGUARD Gold</span>
              <span className="mega-badge">Antimicrobial</span>
              <span className="mega-badge">Bleach-Safe</span>
              <span className="mega-badge">Zero Joints</span>
              <span className="mega-badge">NSF/FDA</span>
            </div>
            <span className="healthcare-banner-link">
              Explore Healthcare &rarr;
            </span>
          </div>
        </Link>
      </section>

      {/* ── Interior ── */}
      <section className="content-section">
        <div className="track-heading">
          Interior
          <span className="track-badge">{interior.length} applications</span>
        </div>
        <div className="card-grid card-grid-2">
          {interior.map((app) => (
            <Link key={app.slug} className="image-card app-card-tall" href={`/applications/${app.slug}`}>
              <div
                className="image-card-bg"
                style={{ backgroundImage: `url('${cloudinaryUrl(app.imageKey, 800)}')` }}
              />
              <div className="image-card-content">
                <div className="image-card-title">{app.name}</div>
                <div className="image-card-desc">{app.description.slice(0, 80)}...</div>
              </div>
              <div className="image-card-arrow">&rarr;</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Exterior ── */}
      <section className="content-section">
        <div className="track-heading">
          Exterior
          <span className="track-badge">{exterior.length} applications</span>
        </div>
        <div className="card-grid card-grid-2">
          {exterior.map((app) => (
            <Link key={app.slug} className="image-card app-card-tall" href={`/applications/${app.slug}`}>
              <div
                className="image-card-bg"
                style={{ backgroundImage: `url('${cloudinaryUrl(app.imageKey, 800)}')` }}
              />
              <div className="image-card-content">
                <div className="image-card-title">{app.name}</div>
                <div className="image-card-desc">{app.description.slice(0, 80)}...</div>
              </div>
              <div className="image-card-arrow">&rarr;</div>
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32 }}>
          {['UV-Stable', 'Hurricane-Tested', '-40°F to 140°F', 'Zero Delamination', 'NFPA'].map((cert) => (
            <span key={cert} className="mega-badge">{cert}</span>
          ))}
        </div>
      </section>

      <PageCTAs />
    </>
  );
}
