import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects } from '@/lib/data/projects';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import PageCTAs from '@/components/PageCTAs';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Not Found' };
  return {
    title: `${project.name} — M|R Walls`,
    description: project.story,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const related = projects.filter(
    (p) => p.slug !== slug && (p.application === project.application || p.sector === project.sector)
  ).slice(0, 4);

  return (
    <>
      {/* Hero image */}
      <section className="page-hero-bleed" style={{ minHeight: '50vh' }}>
        <div
          className="hero-bg"
          style={{ backgroundImage: `url('${cloudinaryUrl(project.imageKey, 1920)}')` }}
        />
        <div className="section-label">{project.sector}</div>
        <h1>{project.name}</h1>
        <p className="hero-desc">{project.application} &middot; {project.sqft} SF &middot; {project.year}</p>
      </section>

      {/* Project info */}
      <section className="content-section">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div className="section-label">The Project</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontWeight: 400, marginBottom: 20 }}>
              {project.name}
            </h2>
            <p style={{ fontSize: 16, color: '#e8e4dc', lineHeight: 1.7, marginBottom: 24 }}>
              {project.story}
            </p>
            <Link href="/makereal" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              letterSpacing: '0.08em',
              color: '#c8b89a',
              border: '1px solid rgba(200,184,154,0.3)',
              padding: '12px 28px',
              borderRadius: 4,
              marginTop: 16,
              transition: 'all 0.3s',
            }}>
              Start a similar project &rarr;
            </Link>
          </div>
          <div>
            <div style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              padding: 32,
              background: 'rgba(255,255,255,0.06)',
            }}>
              <div className="section-label">Details</div>
              {[
                ['Sector', project.sector],
                ['Application', project.application],
                ['Square Footage', `${project.sqft} SF`],
                ['Year', String(project.year)],
                ['Design', project.designName],
                ['Type', project.illuminated ? '\u2726 Illuminated' : 'Standard'],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 14,
                }}>
                  <span style={{ color: '#888' }}>{label}</span>
                  <span style={{ color: '#f5f5f0', fontWeight: 400 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="content-section">
          <div className="section-label">Related projects</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, marginBottom: 40 }}>
            Similar installations
          </h2>
          <div className="card-grid card-grid-4">
            {related.map((p) => (
              <Link key={p.slug} className="image-card" href={`/projects/${p.slug}`}>
                <div
                  className="image-card-bg"
                  style={{ backgroundImage: `url('${cloudinaryUrl(p.imageKey, 600)}')` }}
                />
                <div className="image-card-content">
                  <div className="image-card-meta">{p.sector} &middot; {p.sqft} SF</div>
                  <div className="image-card-title">{p.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <PageCTAs />
    </>
  );
}
