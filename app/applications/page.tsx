import Link from 'next/link';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import { getInteriorApplications, getExteriorApplications } from '@/lib/data/applications';
import { getApplicationImages } from '@/lib/airtable';
import PageCTAs from '@/components/PageCTAs';

export const metadata = {
  title: 'Applications — M|R Walls',
  description: 'Explore M|R Walls applications: elevator lobbies, feature walls, facades, ceilings, water features, and more.',
};

async function getHeroForApp(appName: string): Promise<string | undefined> {
  try {
    const images = await getApplicationImages(appName);
    const hero = images.find((p) => p.applicationHero) || images[0];
    return hero?.cloudinaryUrl;
  } catch {
    return undefined;
  }
}

export default async function ApplicationsPage() {
  const interior = getInteriorApplications();
  const exterior = getExteriorApplications();

  // Fetch all hero images from Airtable in parallel
  const allApps = [...interior, ...exterior];
  const heroImages = await Promise.all(allApps.map((app) => getHeroForApp(app.name)));
  const heroMap: Record<string, string | undefined> = {};
  allApps.forEach((app, i) => { heroMap[app.slug] = heroImages[i]; });

  return (
    <>
      {/* Hero */}
      <section className="page-hero" style={{ paddingBottom: '48px' }}>
        <div className="section-label">Applications</div>
        <h1>What are you building?</h1>
        <p className="hero-desc">
          Every M|R Walls project starts with an application type. Each is engineered for its specific demands — traffic, moisture, wind, light.
        </p>
      </section>

      {/* Healthcare Banner */}
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

      {/* Interior */}
      <section className="content-section">
        <div className="track-heading">
          Interior
          <span className="track-badge">{interior.length} applications</span>
        </div>
        <div className="card-grid card-grid-2">
          {interior.map((app) => {
            const img = heroMap[app.slug];
            return (
              <Link key={app.slug} className="image-card app-card-tall" href={`/applications/${app.slug}`}>
                {img ? (
                  <div className="image-card-bg" style={{ backgroundImage: `url('${img}')` }} />
                ) : (
                  <div className="image-card-bg" style={{ background: '#111' }} />
                )}
                <div className="image-card-content">
                  <div className="image-card-title">{app.name}</div>
                  <div className="image-card-desc">{app.description.slice(0, 80)}...</div>
                </div>
                <div className="image-card-arrow">&rarr;</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Exterior */}
      <section className="content-section">
        <div className="track-heading">
          Exterior
          <span className="track-badge">{exterior.length} applications</span>
        </div>
        <div className="card-grid card-grid-2">
          {exterior.map((app) => {
            const img = heroMap[app.slug];
            return (
              <Link key={app.slug} className="image-card app-card-tall" href={`/applications/${app.slug}`}>
                {img ? (
                  <div className="image-card-bg" style={{ backgroundImage: `url('${img}')` }} />
                ) : (
                  <div className="image-card-bg" style={{ background: '#111' }} />
                )}
                <div className="image-card-content">
                  <div className="image-card-title">{app.name}</div>
                  <div className="image-card-desc">{app.description.slice(0, 80)}...</div>
                </div>
                <div className="image-card-arrow">&rarr;</div>
              </Link>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32 }}>
          {['UV-Stable', 'Hurricane-Tested', '-40°F to 140°F', 'Zero Delamination', 'NFPA'].map((cert) => (
            <span key={cert} className="mega-badge">{cert}</span>
          ))}
        </div>
      </section>

      {/* By Sector */}
      <section className="content-section">
        <div className="section-label">By Sector</div>
        <h2>Targeted solutions by industry</h2>
        <p className="section-desc">
          Explore M|R Walls applications tailored to the unique demands of each
          industry &mdash; from infection control in healthcare to rapid
          installation in aviation terminals.
        </p>

        <div className="card-grid">
          <Link href="/healthcare" className="image-card">
            <div
              className="image-card-bg"
              style={{ backgroundImage: `url('${cloudinaryUrl('seattleV2', 600)}')` }}
            />
            <div className="image-card-arrow">&rarr;</div>
            <div className="image-card-content">
              <div className="image-card-title">Healthcare</div>
              <div className="image-card-desc">
                Antimicrobial &middot; Zero-joint &middot; GREENGUARD
              </div>
            </div>
          </Link>

          <Link href="/sector/casino-gaming" className="image-card">
            <div
              className="image-card-bg"
              style={{ backgroundImage: `url('${cloudinaryUrl('morongoCasino', 600)}')` }}
            />
            <div className="image-card-arrow">&rarr;</div>
            <div className="image-card-content">
              <div className="image-card-title">Casino &amp; Gaming</div>
              <div className="image-card-desc">
                Illuminated ceilings &middot; Branded environments
              </div>
            </div>
          </Link>

          <Link href="/sector/aviation" className="image-card">
            <div
              className="image-card-bg"
              style={{ backgroundImage: `url('${cloudinaryUrl('laxAmericanAirlines', 600)}')` }}
            />
            <div className="image-card-arrow">&rarr;</div>
            <div className="image-card-content">
              <div className="image-card-title">Aviation</div>
              <div className="image-card-desc">
                5,000 SF at LAX &middot; 16-day install
              </div>
            </div>
          </Link>
        </div>
      </section>

      <PageCTAs />
    </>
  );
}
