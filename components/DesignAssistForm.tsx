'use client';

import { useState } from 'react';

interface DesignAssistFormProps {
  designName: string;
  hasIlluminated: boolean;
}

export default function DesignAssistForm({ designName, hasIlluminated }: DesignAssistFormProps) {
  const [formData, setFormData] = useState({
    design: designName,
    name: '',
    email: '',
    firm: '',
    projectName: '',
    location: '',
    application: '',
    dimensions: '',
    surfaceType: hasIlluminated ? 'illuminated' : 'standard',
    timeline: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/design-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="form-done">
        <p>Thank you! Our team will review your project and be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 24 }}>
        Send us your project details &mdash; wall dimensions, application, timeline.
        We&apos;ll send back a shop drawing with a matching 3D visualization to your
        dimensions and application, with preliminary pricing and a production timeline.
        Free, no obligation.
      </p>

      <form onSubmit={handleSubmit} className="assist-form">
        <div className="form-grid">
          <div className="form-field full">
            <label>Design</label>
            <input type="text" value={formData.design} readOnly className="form-input readonly" />
          </div>
          <div className="form-field">
            <label>Name *</label>
            <input type="text" value={formData.name} onChange={(e) => update('name', e.target.value)} required className="form-input" />
          </div>
          <div className="form-field">
            <label>Email *</label>
            <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} required className="form-input" />
          </div>
          <div className="form-field">
            <label>Firm</label>
            <input type="text" value={formData.firm} onChange={(e) => update('firm', e.target.value)} className="form-input" />
          </div>
          <div className="form-field">
            <label>Project Name</label>
            <input type="text" value={formData.projectName} onChange={(e) => update('projectName', e.target.value)} className="form-input" />
          </div>
          <div className="form-field">
            <label>Location</label>
            <input type="text" value={formData.location} onChange={(e) => update('location', e.target.value)} className="form-input" />
          </div>
          <div className="form-field">
            <label>Application Type</label>
            <select value={formData.application} onChange={(e) => update('application', e.target.value)} className="form-input">
              <option value="">Select...</option>
              <option value="Feature Wall">Feature Wall</option>
              <option value="Elevator Lobby">Elevator Lobby</option>
              <option value="Facade">Facade</option>
              <option value="Ceiling">Ceiling</option>
              <option value="Water Feature">Water Feature</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label>Approximate Dimensions</label>
            <input type="text" placeholder="e.g. 12' x 8'" value={formData.dimensions} onChange={(e) => update('dimensions', e.target.value)} className="form-input" />
          </div>
          <div className="form-field">
            <label>Standard or Illuminated</label>
            <select value={formData.surfaceType} onChange={(e) => update('surfaceType', e.target.value)} className="form-input">
              <option value="standard">Standard</option>
              <option value="illuminated">✦ Illuminated</option>
            </select>
          </div>
          <div className="form-field">
            <label>Timeline</label>
            <select value={formData.timeline} onChange={(e) => update('timeline', e.target.value)} className="form-input">
              <option value="">Select...</option>
              <option value="Immediately">Immediately</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
              <option value="Just exploring">Just exploring</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="spec-btn primary" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Submit Request'}
          </button>
        </div>

        {status === 'error' && (
          <p className="form-error">Something went wrong. Please try again or email us directly.</p>
        )}
      </form>

      <p className="form-alt" style={{ marginTop: 20 }}>
        Or{' '}
        <a
          href="https://calendly.com/mrwalls"
          target="_blank"
          rel="noopener noreferrer"
          className="form-alt-link"
        >
          book a meeting with an M|R designer &rarr;
        </a>
      </p>
    </div>
  );
}
