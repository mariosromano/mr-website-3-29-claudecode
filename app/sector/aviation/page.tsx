import PageCTAs from '@/components/PageCTAs';
import HeroBleed from '@/components/HeroBleed';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import Link from 'next/link';

export const metadata = {
  title: 'Aviation — M|R Walls',
  description:
    'The wall system that keeps pace with aviation schedules. Installed at LAX without shutting down terminal operations.',
};

export default function AviationPage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <HeroBleed
        imageKey="laxAmericanAirlines"
        label="Aviation"
        title="5,000 square feet. 16 days. Zero joints."
        description="The wall system that keeps pace with aviation schedules. Installed at LAX without shutting down terminal operations."
      />

      {/* ── 2. Key Selling Points ── */}
      <section className="content-section">
        <div className="section-label">Why M|R Walls for Aviation</div>
        <h2>Built for the pace of terminal construction</h2>
        <p className="section-desc">
          Aviation projects demand speed, compliance, and zero disruption.
          InterlockPanel delivers on all three.
        </p>

        <div className="badge-grid">
          <div className="badge-card">
            <div className="badge-icon">{'\u26A1'}</div>
            <h4>Speed of Installation</h4>
            <p>
              300 SF per day with pre-numbered panels. InterlockPanel&apos;s
              patented connection system eliminates field cutting and reduces
              installation time by 60% versus traditional cladding.
            </p>
          </div>

          <div className="badge-card">
            <div className="badge-icon">{'\u2726'}</div>
            <h4>GREENGUARD Gold</h4>
            <p>
              Certified for indoor air quality in enclosed terminal environments.
              Low-emitting material safe for high-occupancy public spaces.
            </p>
          </div>

          <div className="badge-card">
            <div className="badge-icon">{'\u25CE'}</div>
            <h4>Antimicrobial</h4>
            <p>
              Non-porous solid surface with zero bacteria traps. Ideal for
              high-traffic public spaces where thousands of passengers pass
              through daily.
            </p>
          </div>

          <div className="badge-card">
            <div className="badge-icon">{'\u25C7'}</div>
            <h4>Sole-Source Specifiable</h4>
            <p>
              No substitution risk in procurement. InterlockPanel is a patented
              system &mdash; specify it directly and eliminate the risk of
              value-engineered alternatives.
            </p>
          </div>

          <div className="badge-card">
            <div className="badge-icon">{'\u2B21'}</div>
            <h4>Phased Installation</h4>
            <p>
              InterlockPanel works in phases without disrupting terminal
              operations. Install one zone while the adjacent zone remains open
              to passengers.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Projects Gallery ── */}
      <section className="content-section">
        <div className="section-label">Projects</div>
        <h2>Aviation projects</h2>
        <p className="section-desc">
          From LAX to regional terminals, M|R Walls delivers seamless Corian
          surfaces that meet the demanding schedules of aviation construction.
        </p>

        <div className="card-grid">
          <Link href="/projects/lax-american-airlines" className="image-card image-card-lg">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('laxAmericanAirlines', 800)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">LAX American Airlines</div>
              <div className="image-card-desc">
                6,400 SF &middot; Backlit Flame &middot; Column Wraps
              </div>
              <div className="image-card-meta">Aviation</div>
            </div>
          </Link>
        </div>

        <Link href="/projects" className="section-link">
          View all projects {'\u2192'}
        </Link>
      </section>

      {/* ── 4. Applications Grid ── */}
      <section className="content-section">
        <div className="section-label">Applications</div>
        <h2>Aviation applications</h2>
        <p className="section-desc">
          M|R Walls surfaces are specified across every area of the terminal
          &mdash; from the grand entry to elevator lobbies.
        </p>

        <div className="card-grid card-grid-4">
          <Link href="/applications/feature-walls" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('laxAmericanAirlines', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Feature Walls</div>
              <div className="image-card-desc">Terminal focal surfaces</div>
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

          <Link href="/applications/grand-entry" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('lakeBacklight', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Grand Entry</div>
              <div className="image-card-desc">Terminal entrance statements</div>
            </div>
          </Link>

          <Link href="/applications/branding" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('capitalOneArena', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Branding</div>
              <div className="image-card-desc">Airline brand expressions</div>
            </div>
          </Link>

          <Link href="/applications/ceilings" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('morongoCasino', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Ceilings</div>
              <div className="image-card-desc">Terminal overhead surfaces</div>
            </div>
          </Link>
        </div>

        <Link href="/applications" className="section-link">
          View all applications {'\u2192'}
        </Link>
      </section>

      {/* ── 5. PageCTAs ── */}
      <PageCTAs />
    </>
  );
}
