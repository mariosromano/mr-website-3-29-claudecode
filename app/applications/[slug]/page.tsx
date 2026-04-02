import { notFound } from 'next/navigation';
import Link from 'next/link';
import { applications, getApplicationBySlug, getInteriorApplications, getExteriorApplications } from '@/lib/data/applications';
import { projects } from '@/lib/data/projects';
import { cloudinaryUrl, ImageKey, images } from '@/lib/data/cloudinary';
import PageCTAs from '@/components/PageCTAs';
import HeroBleed from '@/components/HeroBleed';
import AppCrossNav from '@/components/AppCrossNav';

export function generateStaticParams() {
  return applications
    .filter((app) => app.slug !== 'facades')
    .map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApplicationBySlug(slug);
  if (!app) return { title: 'Not Found' };
  return {
    title: `${app.name} — M|R Walls`,
    description: app.description.slice(0, 160),
  };
}

const certIcons: Record<string, string> = {
  'GREENGUARD Gold': '\u2713',
  'NSF/FDA': '\u25C8',
  'Antimicrobial': '\u25C7',
  'Bleach-Safe': '\u2726',
  'Exterior-Rated': '\u25CE',
  'UV-Stable': '\u25CB',
  'NFPA': '\u25A3',
};

/* Map design names (from relatedDesigns) to the best available Cloudinary imageKey */
const designImageMap: Record<string, { imageKey: ImageKey; label: string }> = {
  flame:       { imageKey: 'flameHospitality', label: 'Flame' },
  ripple:      { imageKey: 'laxAmericanAirlines', label: 'Ripple' },
  wave:        { imageKey: 'morongoCasino', label: 'Wave' },
  billow:      { imageKey: 'billowBacklight', label: 'Billow' },
  lake:        { imageKey: 'lakeBacklight', label: 'Lake' },
  bloom:       { imageKey: 'bloomFree', label: 'Bloom' },
  fingerprint: { imageKey: 'fingerprint', label: 'Fingerprint' },
  brick:       { imageKey: 'brickWaterfeature', label: 'Brick' },
  stone:       { imageKey: 'brickWaterfeature', label: 'Stone' },
};

export default async function ApplicationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApplicationBySlug(slug);
  if (!app) notFound();

  const trackApps = app.track === 'interior' ? getInteriorApplications() : getExteriorApplications();

  /* Gather related projects — first from relatedProjects, then fill from same-sector projects */
  const directProjects = projects.filter((p) => app.relatedProjects.includes(p.slug));
  const sectorProjects = projects.filter((p) =>
    !app.relatedProjects.includes(p.slug) &&
    app.sectors.some((s) => p.sector === s)
  );
  const allRelatedProjects = [...directProjects, ...sectorProjects].slice(0, 6);

  /* Gather related designs with real images */
  const relatedDesigns = app.relatedDesigns
    .map((d) => designImageMap[d])
    .filter(Boolean);

  return (
    <>
      <AppCrossNav apps={trackApps} currentSlug={slug} />

      <HeroBleed
        imageKey={app.imageKey}
        label="Application"
        title={app.name}
        description={app.description}
      />

      {/* Why Corian for this application */}
      <section className="content-section">
        <div className="section-label">Why Corian</div>
        <h2>Why Corian works for {app.name.toLowerCase()}</h2>
        <p className="section-desc">{app.description}</p>

        {app.track === 'interior' ? (
          <div className="compare-grid" style={{ marginTop: 48 }}>
            <div className="compare-card">
              <div className="compare-tag">Standard</div>
              <h4>Any color. Any design.</h4>
              <ul>
                <li>100+ Corian colors available</li>
                <li>Any design from the library or custom</li>
                <li>No electrical required</li>
                <li>Minimum 1.5&quot; wall cavity</li>
              </ul>
            </div>
            <div className="compare-card compare-card-accent">
              <div className="compare-tag">{'\u2726'} Illuminated</div>
              <h4>The glow.</h4>
              <ul>
                <li>Glacier White Corian only</li>
                <li>LED backlighting built into wall cavity</li>
                <li>Minimum 3&quot; wall cavity depth</li>
                <li>Warm translucent glow through carved surfaces</li>
              </ul>
              <Link href="/illuminated" className="section-link" style={{ marginTop: 24 }}>
                Learn more about Illuminated &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap' as const, gap: 12 }}>
            {['UV-stable', 'Hurricane-tested', 'Non-porous', 'No delamination', '-40\u00b0F to 140\u00b0F'].map((prop) => (
              <span key={prop} className="mega-badge" style={{ fontSize: 11, padding: '6px 14px' }}>
                {prop}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Related Projects Gallery */}
      {allRelatedProjects.length > 0 && (
        <section className="content-section">
          <div className="section-label">Projects</div>
          <h2>{app.name} projects</h2>
          <p className="section-desc">Real installations using this application type.</p>
          <div className="card-grid" style={{ marginTop: 40 }}>
            {allRelatedProjects.map((p) => (
              <Link key={p.slug} className="image-card" href={`/projects/${p.slug}`}>
                <div
                  className="image-card-bg"
                  style={{ backgroundImage: `url('${cloudinaryUrl(p.imageKey, 600)}')` }}
                />
                <div className="image-card-content">
                  <div className="image-card-meta">
                    {p.sector} &middot; {p.sqft} SF
                  </div>
                  <div className="image-card-title">{p.name}</div>
                  <div className="image-card-desc">{p.designName}{p.illuminated ? ' \u00b7 \u2726 Illuminated' : ''}</div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/projects" className="section-link">
            See all projects &rarr;
          </Link>
        </section>
      )}

      {/* Related Designs */}
      {relatedDesigns.length > 0 && (
        <section className="content-section">
          <div className="section-label">Designs</div>
          <h2>Designs for {app.name.toLowerCase()}</h2>
          <p className="section-desc">
            CNC-carved patterns from the M|R Walls design library, each available for {app.name.toLowerCase()} applications.
          </p>
          <div className="card-grid card-grid-4" style={{ marginTop: 40 }}>
            {relatedDesigns.map((d) => (
              <Link key={d.label} className="image-card" href="/designs">
                <div
                  className="image-card-bg"
                  style={{ backgroundImage: `url('${cloudinaryUrl(d.imageKey, 400)}')` }}
                />
                <div className="image-card-content">
                  <div className="image-card-title">{d.label}</div>
                  <div className="image-card-desc">Design Library</div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/designs" className="section-link">
            Browse full Design Library &rarr;
          </Link>
        </section>
      )}

      {/* Certifications */}
      <section className="content-section">
        <div className="section-label">Certifications</div>
        <h2>Tested. Certified. Trusted.</h2>
        <p className="section-desc">
          Certifications relevant to {app.name.toLowerCase()} applications.
        </p>
        <div className="badge-grid" style={{ marginTop: 40 }}>
          {app.certifications.map((cert) => (
            <div key={cert} className="badge-card">
              <div className="badge-icon">{certIcons[cert] || '\u2713'}</div>
              <h4>{cert}</h4>
              <p>Certified for {app.name.toLowerCase()} applications in {app.track} environments.</p>
            </div>
          ))}
        </div>
      </section>

      <PageCTAs />
    </>
  );
}
