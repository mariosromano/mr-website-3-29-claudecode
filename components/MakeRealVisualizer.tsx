'use client';

import { useState, useEffect, useRef } from 'react';

interface MakeRealVisualizerProps {
  designName: string;
  referenceImageUrl: string;
}

const SPACES = [
  { value: 'hospital-nursing', label: 'Hospital Nursing Station' },
  { value: 'healthcare-lobby', label: 'Healthcare Lobby' },
  { value: 'hotel-lobby', label: 'Hotel Lobby' },
  { value: 'elevator-lobby', label: 'Elevator Lobby' },
  { value: 'reception', label: 'Reception Desk' },
  { value: 'corporate-office', label: 'Corporate Office' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'residential', label: 'Residential Living Room' },
] as const;

const PROMPT_MAP: Record<string, string> = {
  'hospital-nursing': 'take this exact design of a 3d carved wall and place it inside a hospital behind a nursing station.',
  'healthcare-lobby': 'take this exact design of a 3d carved wall and place it inside a modern healthcare lobby with clean bright calming lighting.',
  'hotel-lobby': 'take this exact design of a 3d carved wall and place it inside a luxury hotel lobby with dramatic lighting and high ceilings.',
  'elevator-lobby': 'take this exact design of a 3d carved wall and place it inside a modern elevator lobby.',
  'reception': 'take this exact design of a 3d carved wall and place it behind a reception desk in a polished corporate space.',
  'corporate-office': 'take this exact design of a 3d carved wall and place it inside a corporate office lobby.',
  'restaurant': 'take this exact design of a 3d carved wall and place it inside a high-end restaurant with warm ambient lighting.',
  'residential': 'take this exact design of a 3d carved wall and place it inside a luxury residence living room with contemporary furnishings.',
};

const ESTIMATED_TIME = 25; // seconds — typical fal.ai generation time

export default function MakeRealVisualizer({ designName, referenceImageUrl }: MakeRealVisualizerProps) {
  const [space, setSpace] = useState('hospital-nursing');
  const [illuminated, setIlluminated] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [resultUrl, setResultUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Progress bar timer
  useEffect(() => {
    if (status === 'loading') {
      setProgress(0);
      setElapsed(0);
      const start = Date.now();
      timerRef.current = setInterval(() => {
        const secs = (Date.now() - start) / 1000;
        setElapsed(Math.floor(secs));
        // Ease toward 90% over estimated time, never hit 100% until done
        const pct = Math.min(90, (secs / ESTIMATED_TIME) * 85);
        setProgress(pct);
      }, 200);
    } else {
      if (status === 'done') setProgress(100);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const handleGenerate = async () => {
    setStatus('loading');
    setResultUrl('');

    const basePrompt = PROMPT_MAP[space] || PROMPT_MAP['healthcare-lobby'];
    const suffix = illuminated
      ? ' Make the wall backlit with a warm amber LED glow through translucent white corian.'
      : '';
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

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${designName}-${SPACES.find((s) => s.value === space)?.label || space}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, '_blank');
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

      {/* Progress bar */}
      {status === 'loading' && (
        <div className="makereal-progress">
          <div className="makereal-progress-bar">
            <div
              className="makereal-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="makereal-progress-info">
            <span>Rendering {designName}...</span>
            <span>{elapsed}s / ~{ESTIMATED_TIME}s</span>
          </div>
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
            <div className="makereal-viz-cta-links">
              <button className="spec-btn" onClick={handleDownload}>
                Download Image
              </button>
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
