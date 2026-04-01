import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — M|R Walls',
};

export default function PrivacyPolicyPage() {
  const sectionHeadingStyle: React.CSSProperties = {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 24,
    fontWeight: 400,
    marginTop: 48,
    marginBottom: 12,
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#888',
    lineHeight: 1.8,
    marginBottom: 16,
    maxWidth: 720,
  };

  const listStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#888',
    lineHeight: 1.8,
    marginBottom: 16,
    paddingLeft: 24,
    maxWidth: 720,
  };

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="section-label">Legal</div>
        <h1>Privacy Policy</h1>
      </section>

      {/* Content */}
      <section className="content-section">
        <p style={{ ...paragraphStyle, color: '#666', fontSize: 12, letterSpacing: '0.04em' }}>
          Effective Date: January 1, 2025
        </p>

        <p style={paragraphStyle}>
          Mario Romano, Inc., doing business as M|R Walls (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;), respects your privacy. This Privacy
          Policy describes how we collect, use, and protect information when you
          visit our website, use our digital tools, or interact with our services.
        </p>

        {/* Information We Collect */}
        <h3 style={sectionHeadingStyle}>Information We Collect</h3>
        <p style={paragraphStyle}>
          We may collect the following types of information:
        </p>
        <ul style={listStyle}>
          <li>
            <strong>Contact information</strong> you voluntarily provide, such as
            your name, email address, phone number, company name, and project
            location when you submit a form or request a sample.
          </li>
          <li>
            <strong>Project details</strong> you share with us, including
            drawings, specifications, and design preferences.
          </li>
          <li>
            <strong>Usage data</strong> collected automatically, such as your IP
            address, browser type, pages visited, and time spent on our site.
          </li>
          <li>
            <strong>Device information</strong> including operating system, screen
            resolution, and referring URLs.
          </li>
        </ul>

        {/* How We Use Information */}
        <h3 style={sectionHeadingStyle}>How We Use Information</h3>
        <p style={paragraphStyle}>
          We use the information we collect to:
        </p>
        <ul style={listStyle}>
          <li>Respond to your inquiries, sample requests, and project consultations.</li>
          <li>Provide design fabrication proposals and specification documents.</li>
          <li>Improve our website, digital tools, and product offerings.</li>
          <li>Communicate with you about projects, products, and services.</li>
          <li>Analyze site usage to enhance the user experience.</li>
          <li>Comply with legal obligations and protect our rights.</li>
        </ul>
        <p style={paragraphStyle}>
          We do not sell, rent, or trade your personal information to third
          parties for marketing purposes.
        </p>

        {/* Cookies */}
        <h3 style={sectionHeadingStyle}>Cookies</h3>
        <p style={paragraphStyle}>
          Our website uses cookies and similar tracking technologies to analyze
          traffic, remember your preferences, and improve your experience.
          Cookies are small text files stored on your device by your browser.
        </p>
        <p style={paragraphStyle}>
          You can control cookie settings through your browser preferences. Note
          that disabling cookies may affect the functionality of certain features
          on our site, including the configurator and AI design tools.
        </p>

        {/* Third-Party Services */}
        <h3 style={sectionHeadingStyle}>Third-Party Services</h3>
        <p style={paragraphStyle}>
          We may use third-party services for analytics, hosting, and
          communication. These services may collect information as described in
          their own privacy policies. Third-party services we use may include:
        </p>
        <ul style={listStyle}>
          <li>Google Analytics for website traffic analysis.</li>
          <li>Vercel for website hosting and deployment.</li>
          <li>Cloudinary for image delivery and optimization.</li>
          <li>Airtable for data management.</li>
        </ul>
        <p style={paragraphStyle}>
          We are not responsible for the privacy practices of third-party
          services. We encourage you to review their privacy policies.
        </p>

        {/* Contact Us */}
        <h3 style={sectionHeadingStyle}>Contact Us</h3>
        <p style={paragraphStyle}>
          If you have questions about this Privacy Policy or wish to exercise
          your rights regarding your personal data, please contact us:
        </p>
        <div
          style={{
            padding: '24px 28px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.02)',
            maxWidth: 400,
            marginTop: 8,
          }}
        >
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#f5f5f0', margin: 0 }}>
            Mario Romano, Inc.<br />
            2314 Michigan Avenue<br />
            Santa Monica, CA 90404<br />
            <a
              href="mailto:orders@marioromano.com"
              style={{ color: '#c8b89a', transition: 'color 0.2s' }}
            >
              orders@marioromano.com
            </a>
          </p>
        </div>

        <p style={{ ...paragraphStyle, marginTop: 48, fontSize: 12, color: '#666' }}>
          This policy may be updated from time to time. Changes will be posted on
          this page with a revised effective date.
        </p>
      </section>
    </>
  );
}
