'use client';

import { useState, useMemo } from 'react';
import type { DesignFamily } from '@/lib/airtable';

interface SpecConfiguratorProps {
  family: DesignFamily;
}

type SurfaceType = 'standard' | 'illuminated';

const COLORS = [
  { id: 'glacier-white', name: 'Glacier White', hex: '#e8e4dc', standardOnly: false, note: 'Required for ✦' },
  { id: 'designer-white', name: 'Designer White', hex: '#f5f0e8', standardOnly: true, note: 'Standard only' },
  { id: 'deep-nocturne', name: 'Deep Nocturne', hex: '#1a1a18', standardOnly: true, note: 'Standard only' },
  { id: 'other', name: 'Other Color', hex: '#888', standardOnly: true, note: 'Ask us' },
];

export default function SpecConfigurator({ family }: SpecConfiguratorProps) {
  const [surfaceType, setSurfaceType] = useState<SurfaceType>(
    family.hasIlluminated ? 'illuminated' : 'standard'
  );
  const [colorId, setColorId] = useState('glacier-white');
  const [copied, setCopied] = useState(false);

  // Auto-select Glacier White when illuminated
  const handleSurfaceChange = (type: SurfaceType) => {
    setSurfaceType(type);
    if (type === 'illuminated') {
      setColorId('glacier-white');
    }
  };

  const selectedColor = COLORS.find((c) => c.id === colorId)!;

  const specText = useMemo(() => {
    const typeName = surfaceType === 'illuminated' ? 'Illuminated' : 'Standard';
    return `SECTION 09 77 00 — SPECIAL WALL SURFACING
MANUFACTURER: Mario Romano Walls / M|R Walls, Romano Studio LLC, Los Angeles, CA
PRODUCT: Design: ${family.name}, Type: ${typeName}, Color: ${selectedColor.name}, System: InterlockPanel\u2122
CERTIFICATIONS: GREENGUARD Gold, NSF/ANSI 51, Antimicrobial, Bleach-Safe, Zero Joints
MATERIAL: DuPont\u2122 Corian\u00AE Solid Surface, 1/2" (12mm) nominal thickness
FABRICATION: CNC-machined, factory-finished panels with interlocking tongue-and-groove edges
INSTALLATION: Concealed mechanical fastening per manufacturer\u2019s written instructions`;
  }, [family.name, surfaceType, selectedColor.name]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([specText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${family.name.replace(/\s+/g, '-')}-spec.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="spec-configurator">
      {/* Choice 1 — Does it glow? */}
      <div className="spec-section">
        <div className="spec-section-label">Does it glow?</div>
        <div className="spec-choice-row">
          <button
            className={`spec-choice-card ${surfaceType === 'standard' ? 'active' : ''}`}
            onClick={() => handleSurfaceChange('standard')}
          >
            <div className="spec-choice-title">Standard</div>
            <div className="spec-choice-desc">No lighting &middot; Any color</div>
          </button>
          <button
            className={`spec-choice-card illuminated-card ${surfaceType === 'illuminated' ? 'active' : ''} ${!family.hasIlluminated ? 'dimmed' : ''}`}
            onClick={() => family.hasIlluminated && handleSurfaceChange('illuminated')}
          >
            <div className="spec-choice-title">✦ Illuminated</div>
            <div className="spec-choice-desc">LED glow &middot; Glacier White</div>
          </button>
        </div>
      </div>

      {/* Choice 2 — Corian Color */}
      <div className="spec-section">
        <div className="spec-section-label">Corian Color</div>
        <div className="spec-swatch-row">
          {COLORS.map((color) => {
            const dimmed = surfaceType === 'illuminated' && color.standardOnly;
            return (
              <button
                key={color.id}
                className={`spec-swatch ${colorId === color.id ? 'active' : ''} ${dimmed ? 'dimmed' : ''}`}
                onClick={() => !dimmed && setColorId(color.id)}
                title={color.name}
              >
                <div
                  className="spec-swatch-circle"
                  style={{ background: color.hex }}
                />
                <div className="spec-swatch-name">{color.name}</div>
                <div className="spec-swatch-note">{color.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spec output */}
      <div className="spec-output">
        <pre className="spec-output-code">{specText}</pre>
      </div>

      {/* Buttons */}
      <div className="spec-buttons">
        <button className="spec-btn primary" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy Spec'}
        </button>
        <button className="spec-btn secondary" onClick={handleDownload}>
          Download .txt
        </button>
      </div>
    </div>
  );
}
