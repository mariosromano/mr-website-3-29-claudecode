import PageCTAs from '@/components/PageCTAs';
import HeroBleed from '@/components/HeroBleed';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import Link from 'next/link';

export const metadata = {
  title: 'Casino & Gaming — M|R Walls',
  description:
    'Carved Corian surfaces for casinos, arenas, and entertainment venues. Illuminated, sculptural, one-of-a-kind.',
};

export default function CasinoGamingPage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <HeroBleed
        imageKey="morongoCasino"
        label="Casino & Gaming"
        title="The ceiling they look up at. The wall they photograph."
        description="Carved Corian surfaces for casinos, arenas, and entertainment venues. Illuminated, sculptural, one-of-a-kind."
      />

      {/* ── 2. Projects Gallery ── */}
      <section className="content-section">
        <div className="section-label">Projects</div>
        <h2>Casino &amp; entertainment projects</h2>
        <p className="section-desc">
          From 12,000 SF carved casino ceilings to illuminated feature walls in
          world-class arenas, M|R Walls delivers one-of-a-kind surfaces at every
          scale.
        </p>

        <div className="card-grid">
          <Link href="/projects/morongo-casino" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('morongoCasino', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">Morongo Casino</div>
              <div className="image-card-desc">
                12,000 SF &middot; Carved Ceiling &middot; Ceilings
              </div>
              <div className="image-card-meta">Casino &middot; Hospitality</div>
            </div>
          </Link>

          <Link href="/projects/crypto-com-arena" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('capitalOneArena', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">Crypto.com Arena</div>
              <div className="image-card-desc">
                8,200 SF &middot; Illuminated Feature Walls
              </div>
              <div className="image-card-meta">Entertainment &middot; Sports</div>
            </div>
          </Link>

          <Link href="/projects/blossom-event-venue" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('bloomFree', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">Blossom Event Venue</div>
              <div className="image-card-desc">
                1,100 SF &middot; Sculptural Surfaces
              </div>
              <div className="image-card-meta">Hospitality &middot; Events</div>
            </div>
          </Link>

          <Link href="/projects/christ-journey-church" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('billowBacklight', 600)}')`,
              }}
            />
            <div className="image-card-arrow">{'\u2197'}</div>
            <div className="image-card-content">
              <div className="image-card-title">Christ Journey Church</div>
              <div className="image-card-desc">
                5,500 SF &middot; Backlit Feature Wall
              </div>
              <div className="image-card-meta">Hospitality</div>
            </div>
          </Link>
        </div>

        <Link href="/projects" className="section-link">
          View all projects {'\u2192'}
        </Link>
      </section>

      {/* ── 3. Applications Grid ── */}
      <section className="content-section">
        <div className="section-label">Applications</div>
        <h2>Casino &amp; gaming applications</h2>
        <p className="section-desc">
          M|R Walls surfaces are specified across every area of the entertainment
          venue &mdash; from grand entries to branded VIP suites.
        </p>

        <div className="card-grid card-grid-4">
          <Link href="/applications/ceilings" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('morongoCasino', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Ceilings</div>
              <div className="image-card-desc">Sculptural overhead canopies</div>
            </div>
          </Link>

          <Link href="/applications/feature-walls" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('capitalOneArena', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Feature Walls</div>
              <div className="image-card-desc">Illuminated focal surfaces</div>
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
              <div className="image-card-desc">Carved brand expressions</div>
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
              <div className="image-card-desc">Backlit entrance statements</div>
            </div>
          </Link>

          <Link href="/applications/reception" className="image-card">
            <div
              className="image-card-bg"
              style={{
                backgroundImage: `url('${cloudinaryUrl('flameHospitality', 400)}')`,
              }}
            />
            <div className="image-card-content">
              <div className="image-card-title">Reception</div>
              <div className="image-card-desc">First-touch branded surfaces</div>
            </div>
          </Link>
        </div>

        <Link href="/applications" className="section-link">
          View all applications {'\u2192'}
        </Link>
      </section>

      {/* ── 4. Illuminated Callout ── */}
      <section className="content-section">
        <div className="section-label">Illuminated</div>
        <h2>RGB-capable. Madrix-integrated. Show-ready.</h2>
        <p className="section-desc">
          Casino and entertainment environments demand dynamic lighting.
          M|R Walls Illuminated panels integrate with Madrix and DMX controllers
          for full RGB color-changing capability &mdash; synchronized to events,
          branding, or time of day.
        </p>

        <div className="compare-card compare-card-accent" style={{ maxWidth: 700 }}>
          <div className="compare-tag">Illuminated</div>
          <h4>Dynamic backlighting for entertainment</h4>
          <ul>
            <li>Full RGB color spectrum via LED edge-lighting</li>
            <li>Madrix &amp; DMX512 compatible for show control</li>
            <li>Zone-addressable panels for dynamic scenes</li>
            <li>Morongo Casino &amp; Crypto.com Arena both feature RGB-capable installations</li>
          </ul>
        </div>

        <Link href="/illuminated" className="section-link" style={{ marginTop: 32 }}>
          Explore Illuminated {'\u2192'}
        </Link>
      </section>

      {/* ── 5. Studio Callout ── */}
      <section className="content-section">
        <div className="section-label">Studio</div>
        <h2>Every casino project starts in Studio</h2>
        <p className="section-desc">
          Morongo Casino and Crypto.com Arena both began as Studio explorations
          &mdash; where architects and designers collaborate with our team to
          develop custom patterns, test illumination, and refine the design before
          a single panel is fabricated.
        </p>

        <Link href="/studio" className="section-link">
          Explore Studio {'\u2192'}
        </Link>
      </section>

      {/* ── 6. PageCTAs ── */}
      <PageCTAs />
    </>
  );
}
