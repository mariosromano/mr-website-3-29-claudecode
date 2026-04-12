import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { applications, getApplicationBySlug, getInteriorApplications, getExteriorApplications } from '@/lib/data/applications';
import { getApplicationImages } from '@/lib/airtable';
import PageCTAs from '@/components/PageCTAs';
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

export default async function ApplicationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApplicationBySlug(slug);
  if (!app) notFound();

  const trackApps = app.track === 'interior' ? getInteriorApplications() : getExteriorApplications();

  // Fetch images from Airtable
  let products: any[] = [];
  try {
    const all = await getApplicationImages(app.name);
    const exact = all.filter(
      (p) => p.application.trim().toLowerCase() === app.name.toLowerCase()
    );
    products = exact.length >= 2 ? exact : all;
  } catch (_) {}

  const heroImg =
    (products.find(
      (p) => p.applicationHero && p.application.toLowerCase() === app.name.toLowerCase()
    ) ||
      products.find((p) => p.applicationHero) ||
      products.find((p) => p.is_hero) ||
      products[0]
    )?.cloudinaryUrl;

  const gallery = products.slice(0, 12);

  return (
    <>
      <AppCrossNav apps={trackApps} currentSlug={slug} />

      {/* Hero — full-bleed Airtable image */}
      <section className="page-hero-bleed">
        {heroImg && (
          <Image
            src={heroImg}
            alt={app.name}
            fill
            className="hero-bg-img"
            sizes="100vw"
            priority
          />
        )}
        <div className="hero-bg" style={{ backgroundImage: 'none' }} />
        <div className="section-label">Application</div>
        <h1>{app.name}</h1>
        <p className="hero-desc">{app.description}</p>
      </section>

      {/* Gallery grid — Airtable images */}
      <section className="app-gallery">
        {gallery.length > 0 ? (
          <div className="app-gallery-grid">
            {gallery.map((p, i) => (
              <div key={i} className="app-gallery-item">
                <Image
                  src={p.cloudinaryUrl}
                  alt={p.title || app.name}
                  fill
                  className="app-gallery-img"
                  sizes="(max-width:768px) 50vw, 33vw"
                />
                {p.isBacklit && (
                  <span className="app-gallery-badge">✦</span>
                )}
                {p.title && (
                  <div className="app-gallery-overlay">
                    <span>{p.title}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="app-gallery-empty">
            <p>No images tagged for {app.name} yet.</p>
            <p style={{ fontSize: 12, marginTop: 8, opacity: 0.5 }}>
              Tag images in admin: application = &quot;{app.name}&quot;
            </p>
          </div>
        )}
      </section>

      {/* Info — tags + certifications */}
      <section className="content-section">
        <div className="section-label">Specifications</div>
        <div className="app-info-grid">
          <p className="app-info-desc">{app.description}</p>
          <div className="app-info-certs">
            <div className="app-info-cert-label">Certified</div>
            <div className="app-info-cert-list">
              {app.certifications.map((cert) => (
                <span key={cert} className="mega-badge">{cert}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PageCTAs />
    </>
  );
}
