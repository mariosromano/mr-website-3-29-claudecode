'use client';

import { useState } from 'react';

interface MakeRealVisualizerProps {
  designName: string;
  referenceImageUrl: string;
}

const SPACES = [
  { value: 'healthcare-lobby', label: 'Healthcare Lobby' },
  { value: 'hotel-lobby', label: 'Hotel Lobby' },
  { value: 'elevator-lobby', label: 'Elevator Lobby' },
  { value: 'reception', label: 'Reception' },
  { value: 'corporate-office', label: 'Corporate Office' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'residential', label: 'Residential' },
] as const;

const PROMPT_MAP: Record<string, string> = {
  'healthcare-lobby': '3d carved feature wall in white corian billow design inside a modern healthcare lobby, clean bright calming, architectural photography',
  'hotel-lobby': '3d carved feature wall in white corian billow design inside a luxury hotel lobby, dramatic lighting, high ceiling, architectural photography',
  'elevator-lobby': '3d carved feature wall in white corian billow design inside an elevator lobby, seamless modern, architectural photography',
  'reception': '3d carved feature wall in white corian billow design behind a reception desk, corporate polished, architectural photography',
  'corporate-office': '3d carved feature wall in white corian billow design inside a corporate office lobby, professional modern, architectural photography',
  'restaurant': '3d carved feature wall in white corian billow design inside a high-end restaurant, warm ambient lighting, architectural photography',
  'residential': '3d carved feature wall in white corian billow design inside a luxury residence living room, contemporary, architectural photography',
};

export default function MakeRealVisualizer({ designName, referenceImageUrl }: MakeRealVisualizerProps) {
  const [space, setSpace] = useState('healthcare-lobby');
  const [illuminated, setIlluminated] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [resultUrl, setResultUrl] = useState('');

  const handleGenerate = async () => {
    setStatus('loading');
    setResultUrl('');

    const basePrompt = PROMPT_MAP[space] || PROMPT_MAP['healthcare-lobby'];
    const suffix = illuminated
      ? ', backlit with warm amber LED glow, translucent corian'
      : ', natural lighting, no backlighting';
    const prompt = basePrompt + suffix;

    try {
      const res = await fetch('/api/generate-render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: referenceImageUrl,
          prompt,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();

      // fal.ai returns { images: [{ url }] }
      const imageUrl = data.images?.[0]?.url;
      if (!imageUrl) throw new Error('No image returned');

      setResultUrl(imageUrl);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const scrollToPanel = (panel: string) => {
    const btn = document.querySelector(`[data-panel="${panel}"]`) as HTMLButtonElement;
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      btn.click();
    }
  };

  return (
    <div className="makereal-viz">
      <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>
        See {designName} in your space
      </h3>

      <div className="makereal-viz-controls">
        {/* Space dropdown */}
        <div className="form-field">
          <label>Application</label>
          <select
            value={space}
            onChange={(e) => setSpace(e.target.value)}
            className="form-input"
          >
            {SPACES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Illuminated toggle */}
        <div className="form-field">
          <label>Surface</label>
          <div className="makereal-viz-toggle">
            <button
              className={`makereal-viz-toggle-btn ${!illuminated ? 'active' : ''}`}
              onClick={() => setIlluminated(false)}
            >
              Standard
            </button>
            <button
              className={`makereal-viz-toggle-btn ${illuminated ? 'active' : ''}`}
              onClick={() => setIlluminated(true)}
            >
              ✦ Illuminated
            </button>
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        className="spec-btn primary"
        onClick={handleGenerate}
        disabled={status === 'loading'}
        style={{ marginTop: 16 }}
      >
        {status === 'loading' ? 'Generating...' : 'Generate \u2192'}
      </button>

      {/* Loading state */}
      {status === 'loading' && (
        <div className="makereal-viz-loading">
          <div className="makereal-viz-pulse" />
          <p>Rendering {designName} in your space...</p>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <p className="form-error" style={{ marginTop: 16 }}>
          Generation failed. Please try again.
        </p>
      )}

      {/* Result */}
      {status === 'done' && resultUrl && (
        <div className="makereal-viz-result">
          <img
            src={resultUrl}
            alt={`${designName} in ${SPACES.find((s) => s.value === space)?.label}`}
            className="makereal-viz-image"
          />
          <div className="makereal-viz-cta">
            <p>Like what you see?</p>
            <div className="makereal-viz-cta-links">
              <button className="section-link" onClick={() => scrollToPanel('assist')}>
                Start Design Assist &rarr;
              </button>
              <button className="section-link" onClick={() => scrollToPanel('spec')}>
                Get the Spec &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
