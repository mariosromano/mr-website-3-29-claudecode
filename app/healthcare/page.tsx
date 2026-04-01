import PageCTAs from '@/components/PageCTAs';
import HeroBleed from '@/components/HeroBleed';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import Link from 'next/link';

export const metadata = {
  title: 'Healthcare — M|R Walls',
  description:
    'Antimicrobial, zero-joint, backlit Corian wall surfaces certified for healthcare environments.',
};

export default function HealthcarePage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <HeroBleed
        imageKey="seattleV2"
        label="Healthcare"
        title="The only antimicrobial, zero-joint, backlit wall surface certified for healthcare"
      />

      {/* ── 2. Certifications ── */}
      <section className="content-section">
        <div className="section-label">Certifications</div>
        <h2>Built for the most demanding environments</h2>
        <p className="section-desc">
          Every M|R Walls healthcare installation meets the certifications
          required by infection-control teams, facilities directors, and
          evidence-based design consultants.
        </p>

        <div className="badge-grid">
          <div className="badge-card">
            <div className="badge-icon">{'\u2726'}</div>
            <h4>GREENGUARD Gold</h4>
            <p>
              Certified for indoor air quality in sensitive environments
              including hospitals and schools. Low-emitting material safe for
              immunocompromised patients.
            </p>
          </div>

          <div className="badge-card">
            <div className="badge-icon">{'\u25CE'}</div>
            <h4>NSF/FDA Compliant</h4>
            <p>
              Food contact safe. Approved for dietary kitchens, cafeterias, and
              any surface where food preparation or handling occurs.
            </p>
          </div>

          <div className="badge-card">
            <div className="badge-icon">{'\u25C7'}</div>
            <h4>Antimicrobial</h4>
            <p>
              Non-porous solid surface with zero bacteria traps. No grout, no
              seams, no joints where microorganisms can colonize.
            </p>
          </div>

          <div className="badge-card">
            <div className="badge-icon">{'\u2736'}</div>
            <h4>Bleach-Safe</h4>
            <p>
              Withstands hospital-grade cleaning protocols including bleach,
              quaternary ammonium, and hydrogen peroxide disinfectants without
              degradation.
            </p>
          </div>

          <div className="badge-card">
            <div className="badge-icon">{'\u2B21'}</div>
            <h4>Zero Joints</h4>
            <p>
              No grout lines where pathogens collect. InterlockPanel&apos;s
              patented connection system creates seamless surfaces across any
              span.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Why Corian for Healthcare ── */}
      <section className="content-section">
        <div className="section-label">Material Advantage</div>
        <h2>Why Corian for healthcare</h2>
        <p className="section-desc">
          Infection control starts at the surface. Corian is the only material
          that combines antimicrobial performance, seamless installation, and
          architectural beauty in a single system.
        </p>

        <div className="split-layout">
          <div>
            <h3>Engineered for infection control</h3>
            <p>
              Corian is inherently non-porous &mdash; bacteria, mold, and
              mildew cannot penetrate the surface. Unlike tile, stone, or
              painted drywall, there are no grout lines, seams, or micro-cracks
              where pathogens can hide from cleaning protocols.
            </p>
            <br />
            <p>
              The material is bleach-safe and withstands the most aggressive
              hospital-grade disinfectants without yellowing, cracking, or
              delamination. InterlockPanel&apos;s zero-joint system eliminates
              every crevice where bacteria traditionally collect.
            </p>
            <br />
            <p>
              When damage occurs, Corian is repairable in place. Scratches,
              chips, and impact marks can be sanded and restored to the original
              finish without removing panels &mdash; critical in 24/7 healthcare
              facilities where wall replacement means shutting down patient
              areas.
            </p>
          </div>
          <div className="split-visual">
            <img
              src={cloudinaryUrl('seattleV2', 800)}
              alt="Corian wall surface in healthcare environment"
            />
          </div>
        </div>
      </section>

      {/* ── 4. Healthcare Projects Gallery ── */}
      <section className="content-section">
        <div className="section-label">Projects</div>
        <h2>Healthcare projects</h2>
        <p className="section-desc">
          From 17,000 SF hospital corridors to intimate meditation rooms,
          M|R Walls delivers seamless Corian surfaces at every scale.
        </p>

        <div className="card-grid">
          <Link href="/projects/jefferson-health" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('laxAmericanAirlines', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">Jefferson Health</div>
              <div className="image-card-desc">
                17,000 SF &middot; Backlit Ripple &middot; Feature Walls
              </div>
              <div className="image-card-meta">Healthcare</div>
            </div>
          </Link>

          <Link href="/projects/mayo-clinic" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('billowBacklight', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">Mayo Clinic</div>
              <div className="image-card-desc">
                9,200 SF &middot; Backlit Billow &middot; Feature Walls
              </div>
              <div className="image-card-meta">Healthcare</div>
            </div>
          </Link>

          <Link href="/projects/seattle-childrens" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('seattleV2', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">Seattle Children&apos;s Hospital</div>
              <div className="image-card-desc">
                4,100 SF &middot; Backlit Bloom &middot; Feature Walls
              </div>
              <div className="image-card-meta">Healthcare</div>
            </div>
          </Link>

          <Link href="/projects/lake-nona-medical" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('lakeBacklight', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">Lake Nona Medical Center</div>
              <div className="image-card-desc">
                6,800 SF &middot; Backlit Lake &middot; Feature Walls
              </div>
              <div className="image-card-meta">Healthcare</div>
            </div>
          </Link>

          <Link href="/projects/va-hospital-facade" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('blueFacade', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">VA Hospital &mdash; Fins Facade</div>
              <div className="image-card-desc">
                5,600 SF &middot; Custom Fins &middot; Facades
              </div>
              <div className="image-card-meta">Healthcare</div>
            </div>
          </Link>

          <Link href="/projects/capital-one-arena" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('capitalOneArena', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">Capital One Arena</div>
              <div className="image-card-desc">
                7,800 SF &middot; Backlit Branded &middot; Branded Environments
              </div>
              <div className="image-card-meta">Sports &middot; Premium Suites</div>
            </div>
          </Link>
        </div>

        <Link href="/projects" className="section-link">
          View all projects {'\u2192'}
        </Link>
      </section>

      {/* ── 5. Healthcare Applications ── */}
      <section className="content-section">
        <div className="section-label">Applications</div>
        <h2>Healthcare applications</h2>
        <p className="section-desc">
          M|R Walls surfaces are specified across every area of the healthcare
          facility &mdash; from the lobby to the MRI suite.
        </p>

        <div className="card-grid card-grid-4">
          <Link href="/applications/feature-walls" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('billowBacklight', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Feature Walls</div>
              <div className="image-card-desc">Lobbies, atriums, corridors</div>
            </div>
          </Link>

          <Link href="/applications/meditation-rooms" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('bloomFree', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Meditation Rooms</div>
              <div className="image-card-desc">Backlit healing environments</div>
            </div>
          </Link>

          <Link href="/applications/reception-desks" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('flameHospitality', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Reception Desks</div>
              <div className="image-card-desc">First-touch branded surfaces</div>
            </div>
          </Link>

          <Link href="/applications/elevator-lobbies" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('fingerprint', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Elevator Lobbies</div>
              <div className="image-card-desc">High-traffic vertical circulation</div>
            </div>
          </Link>

          <Link href="/applications/nurse-stations" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('seattleV2', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Nurse Stations</div>
              <div className="image-card-desc">Antimicrobial work surfaces</div>
            </div>
          </Link>

          <Link href="/applications/mri-rooms" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('lakeBacklight', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">MRI Rooms</div>
              <div className="image-card-desc">Calming backlit environments</div>
            </div>
          </Link>
        </div>

        <Link href="/applications" className="section-link">
          View all applications {'\u2192'}
        </Link>
      </section>

      {/* ── 6. CTA to Configurator ── */}
      <section className="content-section" style={{ textAlign: 'center' }}>
        <div className="section-label">Specify for Healthcare</div>
        <h2>Configure your healthcare spec</h2>
        <p
          className="section-desc"
          style={{ margin: '0 auto 40px', textAlign: 'center' }}
        >
          Start with Healthcare pre-selected. Choose your application, design,
          color, and backlighting &mdash; get CSI-format spec text in minutes.
          Every configuration includes GREENGUARD Gold, antimicrobial, and
          bleach-safe certifications by default.
        </p>
        <Link href="/makereal" className="nav-cta" style={{ fontSize: 14, padding: '14px 36px' }}>
          Open Configurator
        </Link>
      </section>

      {/* ── 7. PageCTAs ── */}
      <PageCTAs />
    </>
  );
}
