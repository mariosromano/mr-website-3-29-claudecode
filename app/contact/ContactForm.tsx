'use client';

import { useState, FormEvent } from 'react';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

const INQUIRY_TYPES = [
  'General',
  'Sample Request',
  'DFP Request',
  'Spec Consultation',
  'Studio Project',
  'Other',
];

const REFERRAL_SOURCES = [
  'Google',
  'Referral',
  'Trade Show',
  'Publication',
  'Social Media',
  'Other',
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 4,
  color: '#f5f5f0',
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 300,
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: '#888',
  marginBottom: 8,
  fontWeight: 500,
};

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // In production, wire this to an API route or form service
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: '64px 32px',
          textAlign: 'center',
          border: '1px solid rgba(200,184,154,0.2)',
          borderRadius: 6,
          background: 'rgba(200,184,154,0.04)',
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c8b89a',
            marginBottom: 12,
            fontWeight: 500,
            opacity: 0.7,
          }}
        >
          Received
        </div>
        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 32,
            fontWeight: 400,
            marginBottom: 12,
          }}
        >
          Thank you
        </h2>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>
          We&apos;ll be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* Name */}
        <div>
          <label style={labelStyle} htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle} htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={inputStyle}
          />
        </div>

        {/* Company */}
        <div>
          <label style={labelStyle} htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            style={inputStyle}
          />
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle} htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            style={inputStyle}
          />
        </div>

        {/* Project Location */}
        <div>
          <label style={labelStyle} htmlFor="location">
            Project Location
          </label>
          <select id="location" name="location" style={inputStyle}>
            <option value="">Select state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Inquiry Type */}
        <div>
          <label style={labelStyle} htmlFor="inquiry">
            Inquiry Type
          </label>
          <select id="inquiry" name="inquiry" style={inputStyle}>
            <option value="">Select type</option>
            {INQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* How Did You Hear */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle} htmlFor="referral">
          How Did You Hear About Us
        </label>
        <select id="referral" name="referral" style={inputStyle}>
          <option value="">Select source</option>
          {REFERRAL_SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div style={{ marginBottom: 32 }}>
        <label style={labelStyle} htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          style={{
            ...inputStyle,
            resize: 'vertical',
          }}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        style={{
          padding: '14px 40px',
          background: '#c8b89a',
          color: '#0a0a0a',
          border: 'none',
          borderRadius: 4,
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.08em',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'opacity 0.2s',
        }}
      >
        Send Message
      </button>
    </form>
  );
}
