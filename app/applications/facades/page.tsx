import Link from 'next/link';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import { getExteriorApplications } from '@/lib/data/applications';
import { projects } from '@/lib/data/projects';
import PageCTAs from '@/components/PageCTAs';
import HeroBleed from '@/components/HeroBleed';
import AppCrossNav from '@/components/AppCrossNav';

export const metadata = {
  title: 'Facades — M|R Walls',
  description: 'UV-stable carved Corian panels for building facades, rain screens, canopies, and building envelopes.',
};

const facadeSections = [
  {
    title: 'Facades',
    desc: 'UV-stable carved panels for building exteriors. Exterior-rated Corian withstands -40\u00b0F to 140\u00b0F, hurricane-force winds, and decades of UV exposure without delamination or color shift. InterlockPanel connections create seamless exterior surfaces at any scale.',
    imageKey: 'blueFacade' as const,
  },
  {
    title: 'Rain Screens',
    desc: 'Ventilated cladding systems for moisture management. Corian rain screen panels mount on open-joint systems with full drainage and ventilation. Non-porous \u2014 water runs off, never absorbs. Dimensional carved patterns add depth and shadow to building exteriors.',
    imageKey: 'finsExterior' as const,
  },
  {
    title: 'Canopies',
    desc: 'Overhead exterior carved surfaces and sun shading. Corian canopy panels are lightweight, UV-stable, and CNC-carved with patterns that control light and create dramatic shadow effects throughout the day.',
    imageKey: 'morongoCasino' as const,
  },
  {
    title: 'Building Envelopes',
    desc: 'Complete exterior wall systems integrating structure and surface. When the entire building skin needs to be a carved, sculptural surface \u2014 not just a panel here and there \u2014 InterlockPanel scales to full building envelopes.',
    imageKey: 'blueFacade' as const,
  },
];

export default function FacadesPage() {
  const exteriorApps = getExteriorApplications();
  const exteriorProjects = projects.filter((p) =>
    ['hallandale-beach-fins', 'va-hospital-facade', 'morongo-casino', 'tiktok-nashville'].includes(p.slug)
  );

  return (
    <>
      <AppCrossNav apps={exteriorApps} currentSlug="facades" />

      <HeroBleed
        imageKey="blueFacade"
        label="Exterior Application"
        title="Facades"
        description="UV-stable carved panels for building exteriors. Exterior-rated Corian withstands hurricane-force winds and decades of UV exposure without delamination or color shift."
      />

      {/* Certifications */}
      <section className="content-section">
        <div className="section-label">Performance</div>
        <h2>Engineered for extremes</h2>
        <p className="section-desc">Every exterior panel is tested and certified for the harshest conditions.</p>
        <div className="badge-grid" style={{ marginTop: 40 }}>
          {[
            { icon: '\u25CE', title: '180 mph Wind-Rated', desc: 'Tested to withstand hurricane-force winds. Panels resist uplift, shear, and cyclic fatigue.' },
            { icon: '\u25CB', title: '-40\u00b0F to 140\u00b0F', desc: 'Thermal stability across extreme temperature ranges with no warping, cracking, or delamination.' },
            { icon: '\u2726', title: 'UV Stable', desc: 'Decades of direct sun exposure with no color shift, chalking, or surface degradation.' },
            { icon: '\u25C7', title: 'Zero Delamination', desc: 'Solid surface material \u2014 no layers to separate. Panel integrity maintained through freeze-thaw cycles.' },
            { icon: '\u25A3', title: 'NFPA Compliant', desc: 'Fire-rated for exterior cladding applications. Meets code requirements for non-combustible assemblies.' },
          ].map((cert) => (
            <div key={cert.title} className="badge-card">
              <div className="badge-icon">{cert.icon}</div>
              <h4>{cert.title}</h4>
              <p>{cert.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sub-sections */}
      {facadeSections.map((section, i) => (
        <section key={section.title} className="content-section">
          <div className="section-label">Exterior</div>
          <h2>{section.title}</h2>
          <div className="split-layout" style={{ marginTop: 40 }}>
            {i % 2 === 0 ? (
              <>
                <div>
                  <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.7 }}>{section.desc}</p>
                </div>
                <div className="split-visual">
                  <img
                    src={cloudinaryUrl(section.imageKey, 800)}
                    alt={section.title}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="split-visual">
                  <img
                    src={cloudinaryUrl(section.imageKey, 800)}
                    alt={section.title}
                  />
                </div>
                <div>
                  <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.7 }}>{section.desc}</p>
                </div>
              </>
            )}
          </div>
        </section>
      ))}

      {/* Exterior Projects Gallery */}
      {exteriorProjects.length > 0 && (
        <section className="content-section">
          <div className="section-label">Projects</div>
          <h2>Exterior projects</h2>
          <p className="section-desc">Real installations using exterior Corian panels.</p>
          <div className="card-grid" style={{ marginTop: 40 }}>
            {exteriorProjects.map((p) => (
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

      {/* Designs */}
      <section className="content-section">
        <div className="section-label">Designs</div>
        <h2>Exterior designs</h2>
        <p className="section-desc">CNC-carved patterns engineered for exterior environments.</p>
        <div className="card-grid card-grid-4" style={{ marginTop: 40 }}>
          {[
            { imageKey: 'flameHospitality' as const, label: 'Flame' },
            { imageKey: 'morongoCasino' as const, label: 'Wave' },
            { imageKey: 'finsExterior' as const, label: 'Custom Fins' },
          ].map((d) => (
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

      <PageCTAs />
    </>
  );
}
