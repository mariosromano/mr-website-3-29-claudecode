import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageCTAs from '@/components/PageCTAs';

const AIRTABLE_PAT = process.env.AIRTABLE_PAT!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE!;

interface DesignProduct {
  id: string;
  pattern: string;
  title: string;
  sector: string;
  isBacklit: boolean;
  cloudinaryUrl: string;
  description: string;
  corianColor: string;
  application: string;
  specReady: boolean;
}

async function getAllProducts(): Promise<DesignProduct[]> {
  const allRecords: any[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PRODUCTS_TABLE}`
    );
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`Airtable error: ${res.status}`);
    const data = await res.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords
    .map((r: any) => {
      const f = r.fields;
      return {
        id: f.id || r.id,
        pattern: f.pattern || 'Custom',
        title: f.title || f.pattern || 'Untitled',
        sector: f.sector || 'General',
        isBacklit: f.isBacklit || false,
        cloudinaryUrl: f.cloudinaryUrl || '',
        description: f.description || '',
        corianColor: f.corianColor || 'Glacier White',
        application: f.application || '',
        specReady: f.specReady || false,
      };
    })
    .filter((p: DesignProduct) => p.cloudinaryUrl.includes('res.cloudinary.com'));
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getAllProducts();
  const design = products.find((p) => slugify(p.title) === slug || slugify(p.pattern) === slug);
  if (!design) return { title: 'Design Not Found — M|R Walls' };
  return {
    title: `${design.title} — M|R Walls Design Library`,
    description: design.description || `${design.title} — CNC-carved Corian design by M|R Walls.`,
  };
}

export default async function DesignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getAllProducts();
  const design = products.find((p) => slugify(p.title) === slug || slugify(p.pattern) === slug);

  if (!design) notFound();

  const related = products
    .filter((p) => p.id !== design.id && (p.sector === design.sector || p.isBacklit === design.isBacklit))
    .slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 48px 64px',
        paddingTop: 'calc(110px + 80px)',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src={design.cloudinaryUrl}
            alt={design.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
            priority
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.5) 100%)',
          }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-label">
            {design.isBacklit ? '\u2726 Illuminated' : 'Design Library'}
          </div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 42,
            fontWeight: 400,
            lineHeight: 1.2,
            maxWidth: 800,
          }}>
            {design.title}
          </h1>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' as const }}>
            <span style={{
              fontSize: 11,
              padding: '4px 12px',
              border: '1px solid rgba(200,184,154,0.3)',
              borderRadius: 20,
              color: '#c8b89a',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}>
              {design.sector}
            </span>
            {design.isBacklit && (
              <span style={{
                fontSize: 11,
                padding: '4px 12px',
                border: '1px solid rgba(200,184,154,0.3)',
                borderRadius: 20,
                color: '#c8b89a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}>
                {'\u2726'} Illuminated
              </span>
            )}
            {design.specReady && (
              <span style={{
                fontSize: 11,
                padding: '4px 12px',
                border: '1px solid rgba(200,184,154,0.3)',
                borderRadius: 20,
                color: '#c8b89a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}>
                Spec-Ready
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Design details */}
      <section className="content-section">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, marginBottom: 16 }}>
              About this design
            </h2>
            <p style={{ fontSize: 15, color: '#e8e4dc', lineHeight: 1.7, marginBottom: 24 }}>
              {design.description || `${design.title} is a CNC-carved Corian design available ${design.isBacklit ? 'as a backlit Illuminated panel in Glacier White' : 'in 100+ Corian colors'}. Part of the M|R Walls Design Library — spec-ready patterns engineered for the InterlockPanel system.`}
            </p>
            {design.application && (
              <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
                Application: {design.application}
              </p>
            )}

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginTop: 32 }}>
              <Link href="/makereal" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                letterSpacing: '0.08em',
                color: '#0a0a0a',
                background: '#f5f5f0',
                padding: '12px 28px',
                borderRadius: 4,
                fontWeight: 500,
              }}>
                Spec this design &rarr;
              </Link>
              <Link href="/contact" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                letterSpacing: '0.08em',
                color: '#c8b89a',
                border: '1px solid rgba(200,184,154,0.3)',
                padding: '12px 28px',
                borderRadius: 4,
              }}>
                Request a sample &rarr;
              </Link>
            </div>
          </div>

          <div style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            padding: 32,
            background: 'rgba(255,255,255,0.06)',
          }}>
            <div className="section-label">Specifications</div>
            {[
              ['Pattern', design.pattern],
              ['Corian Color', design.corianColor],
              ['Surface', design.isBacklit ? '\u2726 Illuminated' : 'Standard'],
              ['Sector', design.sector],
              ['Spec-Ready', design.specReady ? 'Yes' : 'Custom order'],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: 14,
              }}>
                <span style={{ color: '#888' }}>{label}</span>
                <span style={{ color: '#f5f5f0' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related designs */}
      {related.length > 0 && (
        <section className="content-section">
          <div className="section-label">Related designs</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, marginBottom: 40 }}>
            You might also like
          </h2>
          <div className="card-grid card-grid-4">
            {related.map((p) => (
              <Link key={p.id} className="image-card" href={`/designs/${slugify(p.title)}`}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <Image
                    src={p.cloudinaryUrl}
                    alt={p.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="image-card-content">
                  <div className="image-card-title">{p.title}</div>
                  <div className="image-card-desc">
                    {p.sector}{p.isBacklit ? ' · ✦ Illuminated' : ''}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/designs" className="section-link">
            Back to Design Library &rarr;
          </Link>
        </section>
      )}

      <PageCTAs />
    </>
  );
}
