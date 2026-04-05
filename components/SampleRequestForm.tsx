'use client';

import { useState } from 'react';

interface SampleRequestFormProps {
  designName: string;
}

export default function SampleRequestForm({ designName }: SampleRequestFormProps) {
  const [formData, setFormData] = useState({
    design: designName,
    name: '',
    email: '',
    firm: '',
    shippingAddress: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/sample-request', {
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
        <p>Sample request received! We&apos;ll ship a Glacier White textured swatch to your office within 5-7 business days.</p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 24 }}>
        Feel the material. We&apos;ll send a Glacier White textured swatch to your office.
      </p>

      <form onSubmit={handleSubmit} className="assist-form">
        <div className="form-grid">
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
          <div className="form-field full">
            <label>Shipping Address *</label>
            <textarea
              value={formData.shippingAddress}
              onChange={(e) => update('shippingAddress', e.target.value)}
              required
              className="form-input form-textarea"
              rows={3}
              placeholder="Street, City, State, ZIP"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="spec-btn primary" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Request Sample'}
          </button>
        </div>

        {status === 'error' && (
          <p className="form-error">Something went wrong. Please try again or email us directly.</p>
        )}
      </form>
    </div>
  );
}
