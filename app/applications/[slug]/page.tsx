import { notFound } from 'next/navigation';
import Link from 'next/link';
import { applications, getApplicationBySlug, getInteriorApplications, getExteriorApplications } from '@/lib/data/applications';
import { projects } from '@/lib/data/projects';
import { cloudinaryUrl, ImageKey } from '@/lib/data/cloudinary';
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

export default async function ApplicationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApplicationBySlug(slug);
  if (!app) notFound();

  const trackApps = app.track === 'interior' ? getInteriorApplications() : getExteriorApplications();

  const relatedProjects = projects.filter((p) =>
    app.relatedProjects.includes(p.slug)
  ).slice(0, 6);

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
          <div style={{ marginTop: 48 }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap' as const,
              gap: 12,
            }}>
              {['UV-stable', 'Hurricane-tested', 'Non-porous', 'No delamination', '-40°F to 140°F'].map((prop) => (
                <span key={prop} style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  color: '#e8e4dc',
                  letterSpacing: '0.04em',
                }}>
                  {prop}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="content-section">
          <div className="section-label">Projects</div>
          <h2>{app.name} projects</h2>
          <p className="section-desc">Real installations using this application type.</p>
          <div className="card-grid" style={{ marginTop: 40 }}>
            {relatedProjects.map((p) => (
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
                  <div className="image-card-desc">{p.designName}{p.illuminated ? ' · ✦ Illuminated' : ''}</div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/projects" className="section-link">
            See all 731 projects &rarr;
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

      {/* Design Library link */}
      <section className="content-section" style={{ textAlign: 'center' as const }}>
        <div className="section-label">Designs</div>
        <h2>Browse designs for {app.name.toLowerCase()}</h2>
        <p className="section-desc" style={{ margin: '16px auto 32px' }}>
          30+ spec-ready designs. Filter by application to find patterns that work for {app.name.toLowerCase()}.
        </p>
        <Link href="/designs" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          letterSpacing: '0.08em',
          color: '#c8b89a',
          border: '1px solid rgba(200,184,154,0.3)',
          padding: '12px 28px',
          borderRadius: 4,
          transition: 'all 0.3s',
        }}>
          Browse Design Library &rarr;
        </Link>
      </section>

      <PageCTAs />
    </>
  );
}
