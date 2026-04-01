import PageCTAs from '@/components/PageCTAs';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import SystemVideo from './SystemVideo';

export const metadata = {
  title: 'The System — M|R Walls',
  description:
    'InterlockPanel — the only patented interlocking Corian wall system in North America. CNC-carved panels, less than 1/32" joints, three US patents through 2044.',
};

const INSTALL_VIDEO =
  'https://res.cloudinary.com/dtlodxxio/video/upload/q_auto,w_720/v1765772971/install_MR-LAX_720_-_puzzle_video_-_720_x_1280_m2ewcs.mp4';

export default function SystemPage() {
  const partnerImage = cloudinaryUrl('billowBacklight', 800);

  return (
    <>
      {/* Page-specific stylesheet */}
      <link rel="stylesheet" href="/shared/system.css" />

      {/* ─── HERO ─── */}
      <section className="page-hero">
        <div className="section-label">The System</div>
        <h1>
          The only patented interlocking Corian wall system in North America
        </h1>
        <p className="hero-desc">
          InterlockPanel&trade; &mdash; CNC-carved panels connect with less than 1/32&quot;
          joints. No grout. No field cutting. No approved equals.
        </p>
        <SystemVideo src={INSTALL_VIDEO} />
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="content-section">
        <div className="section-label">How It Works</div>
        <h2>From raw sheet to finished wall</h2>
        <p className="section-desc">
          Every M|R panel is CNC-machined from DuPont&trade; Corian&reg; solid surface.
          Four steps. Zero field modification.
        </p>
        <div className="process-flow">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Raw Corian Sheet</h4>
            <p>
              Half-inch DuPont&trade; Corian&reg; solid surface. Non-porous,
              homogeneous, and available in 100+ colors.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h4>CNC Carving</h4>
            <p>
              5-axis CNC routers carve the sculptural pattern and precision
              interlock geometry into each panel.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h4>Finished Panel</h4>
            <p>
              Panels are sanded, inspected, and keyed for position. Each
              one is unique to its location on the wall.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">04</div>
            <h4>Installed Wall</h4>
            <p>
              Panels interlock on-site in sequence. Less than 1/32&quot;
              joints. No grout, no sealant, no field cutting.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PATENT PROTECTION ─── */}
      <section className="content-section">
        <div className="section-label">Patent Protection</div>
        <h2>Three US utility patents</h2>
        <p className="section-desc">
          InterlockPanel&trade; is protected by three issued United States utility
          patents covering the interlocking geometry, manufacturing process, and
          installation method.
        </p>
        <div className="patent-grid">
          <div className="patent-card">
            <div className="patent-number">10,732,596</div>
            <div className="patent-expiry">Protected through 2037</div>
          </div>
          <div className="patent-card">
            <div className="patent-number">11,625,509</div>
            <div className="patent-expiry">Protected through 2041</div>
          </div>
          <div className="patent-card">
            <div className="patent-number">11,899,418</div>
            <div className="patent-expiry">Protected through 2044</div>
          </div>
        </div>
        <div className="sole-source-callout">
          <h4>Sole-Source Justification</h4>
          <p>
            No approved equals exist. M|R Walls is the only licensed manufacturer
            of InterlockPanel&trade; in North America. Patent protection enables
            sole-source procurement under FAR 6.302-1 and state equivalents.
          </p>
        </div>
      </section>

      {/* ─── DUPONT PARTNERSHIP ─── */}
      <section className="content-section">
        <div className="split-layout">
          <div>
            <div className="section-label">DuPont Partnership</div>
            <h3>Built on DuPont&trade; Corian&reg; solid surface</h3>
            <p>
              M|R Walls is a DuPont&trade; Corian&reg; Industrial Partner.
              Every panel is fabricated from genuine Corian&reg; solid surface &mdash;
              the same material trusted in hospitals, airports, and laboratories
              worldwide for over 50 years.
            </p>
            <div className="material-props">
              <span className="material-prop">Non-Porous</span>
              <span className="material-prop">Thermoformable</span>
              <span className="material-prop">Renewable Surface</span>
              <span className="material-prop">Seamless Joints</span>
              <span className="material-prop">100+ Colors</span>
              <span className="material-prop">1/2&quot; Solid Sheet</span>
            </div>
          </div>
          <div className="split-visual">
            <img
              src={partnerImage}
              alt="Backlit Corian panel detail showing light transmission through carved surface"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ─── CERTIFICATIONS ─── */}
      <section className="content-section">
        <div className="section-label">Certifications</div>
        <h2>Tested. Certified. Specified.</h2>
        <p className="section-desc">
          Corian&reg; solid surface carries the industry&rsquo;s most demanding
          certifications for indoor air quality, food safety, hygiene, and fire
          performance.
        </p>
        <div className="badge-grid">
          <div className="badge-card">
            <div className="badge-icon">{'\u2606'}</div>
            <h4>GREENGUARD Gold</h4>
            <p>
              Certified for low chemical emissions. Meets strict standards for
              schools, healthcare, and offices (UL 2818).
            </p>
          </div>
          <div className="badge-card">
            <div className="badge-icon">{'\u2713'}</div>
            <h4>NSF / FDA Compliant</h4>
            <p>
              Approved for food-contact surfaces. Safe for commercial kitchens,
              cafeterias, and food-service environments.
            </p>
          </div>
          <div className="badge-card">
            <div className="badge-icon">{'\u2660'}</div>
            <h4>Antimicrobial</h4>
            <p>
              Non-porous surface resists bacterial growth without chemical
              additives. Cleanable with standard disinfectants.
            </p>
          </div>
          <div className="badge-card">
            <div className="badge-icon">{'\u25C8'}</div>
            <h4>Bleach-Safe</h4>
            <p>
              Withstands hospital-grade cleaning protocols including 10%
              bleach solutions without surface degradation.
            </p>
          </div>
          <div className="badge-card">
            <div className="badge-icon">{'\u2600'}</div>
            <h4>Exterior-Rated</h4>
            <p>
              UV-stable Corian&reg; formulations available for exterior
              cladding, facades, and covered outdoor applications.
            </p>
          </div>
          <div className="badge-card">
            <div className="badge-icon">{'\u2302'}</div>
            <h4>NFPA Class A</h4>
            <p>
              Class A fire rating per ASTM E84. Flame spread index &le; 25.
              Meets requirements for Type I and Type II construction.
            </p>
          </div>
        </div>
      </section>

      {/* ─── STANDARD VS ILLUMINATED ─── */}
      <section className="content-section">
        <div className="section-label">Product Lines</div>
        <h2>Standard vs Illuminated</h2>
        <p className="section-desc">
          Every M|R design is available in two configurations. Same interlock
          system. Same installation method. Choose your effect.
        </p>
        <div className="compare-grid">
          <div className="compare-card">
            <div className="compare-tag">Standard</div>
            <h4>Surface Sculpt</h4>
            <ul>
              <li>CNC-carved surface texture with shadow play</li>
              <li>Wall-wash or ambient lighting compatible</li>
              <li>Standard 1/2&quot; Corian sheet</li>
              <li>Direct-mount to substrate</li>
              <li>Lower cost per square foot</li>
            </ul>
          </div>
          <div className="compare-card compare-card-accent">
            <div className="compare-tag">Illuminated</div>
            <h4>Backlit Sculpt</h4>
            <ul>
              <li>CNC-carved for controlled light transmission</li>
              <li>Integrated LED light-box system</li>
              <li>Translucent Corian colors only</li>
              <li>Reveals pattern depth through backlight</li>
              <li>Premium specification &mdash; signature effect</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── DOWNLOADABLE RESOURCES ─── */}
      <section className="content-section">
        <div className="section-label">Resources</div>
        <h2>Downloadable resources</h2>
        <p className="section-desc">
          Technical data, installation guides, and specification documents for
          your project binder.
        </p>
        <div className="resource-list">
          <a className="resource-link" href="#" target="_blank" rel="noopener noreferrer">
            <span className="resource-icon">{'\u25A0'}</span>
            InterlockPanel System Overview
            <span className="resource-type">PDF</span>
          </a>
          <a className="resource-link" href="#" target="_blank" rel="noopener noreferrer">
            <span className="resource-icon">{'\u25A0'}</span>
            Installation Guide &amp; Details
            <span className="resource-type">PDF</span>
          </a>
          <a className="resource-link" href="#" target="_blank" rel="noopener noreferrer">
            <span className="resource-icon">{'\u25A0'}</span>
            CSI 3-Part Specification (09 77 00)
            <span className="resource-type">DOCX</span>
          </a>
          <a className="resource-link" href="#" target="_blank" rel="noopener noreferrer">
            <span className="resource-icon">{'\u25A0'}</span>
            DuPont Corian Technical Data Sheet
            <span className="resource-type">PDF</span>
          </a>
          <a className="resource-link" href="#" target="_blank" rel="noopener noreferrer">
            <span className="resource-icon">{'\u25A0'}</span>
            LEED &amp; Sustainability Brief
            <span className="resource-type">PDF</span>
          </a>
        </div>
        <a className="section-link" href="/contact">
          Request full project binder &rarr;
        </a>
      </section>

      {/* ─── PAGE CTAs ─── */}
      <PageCTAs />
    </>
  );
}
