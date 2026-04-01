import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact — M|R Walls',
  description: 'Contact M|R Walls. Santa Monica, California.',
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="section-label">Contact</div>
        <h1>Get in touch</h1>
        <p className="hero-desc">
          Whether you need a sample, a spec consultation, or want to discuss a
          custom project — we&apos;re here to help.
        </p>
      </section>

      {/* Form + Contact Info */}
      <section className="content-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: 64,
            alignItems: 'start',
          }}
        >
          {/* Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Info Sidebar */}
          <aside
            style={{
              padding: '40px 32px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#c8b89a',
                marginBottom: 32,
                fontWeight: 500,
                opacity: 0.7,
              }}
            >
              Contact Information
            </div>

            {/* Address */}
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#888',
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                Address
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#f5f5f0' }}>
                2314 Michigan Avenue<br />
                Santa Monica, CA 90404
              </p>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#888',
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                Phone
              </div>
              <a
                href="tel:+13102436967"
                style={{ fontSize: 14, color: '#f5f5f0', transition: 'color 0.2s' }}
              >
                (310) 243-6967
              </a>
            </div>

            {/* Email */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#888',
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                Email
              </div>
              <a
                href="mailto:orders@marioromano.com"
                style={{ fontSize: 14, color: '#c8b89a', transition: 'color 0.2s' }}
              >
                orders@marioromano.com
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
