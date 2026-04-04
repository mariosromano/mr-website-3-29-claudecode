'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product } from '@/lib/airtable';

interface DesignsClientProps {
  products: Product[];
  clickCounts: Record<string, number>;
  familySlugMap: Record<string, string>;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = sessionStorage.getItem('mr-session-id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('mr-session-id', id);
  }
  return id;
}

const POPULAR_PILLS = [
  'organic', 'geometric', 'stone', '✦ glow', 'wave', 'linear',
  'Art Deco', 'biophilic', 'figurative', 'fluted', 'exterior',
];

const SECTORS = [
  'All', 'Healthcare', 'Hospitality', 'Corporate', 'Multi-Family',
  'Aviation', 'Education', 'Retail', 'Residential', 'Sports',
] as const;

const APPLICATIONS = [
  'All', 'Feature Wall', 'Elevator Lobby', 'Facade', 'Ceiling', 'Water Feature',
] as const;

const SURFACES = ['All', 'Illuminated', 'Standard'] as const;
const COLLECTIONS = ['Spec-Ready', 'All'] as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DesignsClient({ products, clickCounts, familySlugMap }: DesignsClientProps) {
  const router = useRouter();

  // Filter state
  const [sector, setSector] = useState<string>('All');
  const [application, setApplication] = useState<string>('All');
  const [surface, setSurface] = useState<string>('All');
  const [collection, setCollection] = useState<string>('Spec-Ready');
  const [search, setSearch] = useState('');

  // Modal state (for Custom / orphan products)
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalStep, setModalStep] = useState<'intent' | 'capture' | 'done'>('intent');
  const [intent, setIntent] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formFirm, setFormFirm] = useState('');

  // Sticky bar state
  const [showSticky, setShowSticky] = useState(false);
  const [stickyEmail, setStickyEmail] = useState('');
  const [stickyDismissed, setStickyDismissed] = useState(false);
  const stickyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sticky bar: show after 30s or 400px scroll
  useEffect(() => {
    if (stickyDismissed) return;
    stickyTimerRef.current = setTimeout(() => setShowSticky(true), 30000);
    const handleScroll = () => {
      if (window.scrollY > 400) setShowSticky(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (stickyTimerRef.current) clearTimeout(stickyTimerRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [stickyDismissed]);

  // Randomized order — stable per mount
  const shuffled = useMemo(() => shuffle(products), [products]);

  // Filter logic
  const filtered = useMemo(() => {
    return shuffled.filter((p) => {
      if (sector !== 'All' && p.sector !== sector) return false;
      if (application !== 'All' && !p.application.toLowerCase().includes(application.toLowerCase())) return false;
      if (surface === 'Illuminated' && !p.isBacklit) return false;
      if (surface === 'Standard' && p.isBacklit) return false;
      if (collection === 'Spec-Ready' && !p.specReady) return false;
      if (search) {
        const q = search.toLowerCase();
        const searchable = `${p.pattern} ${p.patternFamily} ${p.title} ${p.sector} ${p.keywords.join(' ')} ${p.description} ${p.application}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [shuffled, sector, application, surface, collection, search]);

  // Click tracking
  const trackClick = useCallback(
    (designName: string) => {
      const activeFilters = { sector, surface, collection, search };
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design_name: designName,
          active_filters: activeFilters,
          session_id: getSessionId(),
        }),
      }).catch(() => {});
    },
    [sector, surface, collection, search]
  );

  // Card click: family → navigate, orphan → modal
  const handleCardClick = (product: Product) => {
    trackClick(product.pattern);
    const familySlug = familySlugMap[product.id];
    if (familySlug) {
      router.push(`/designs/${familySlug}`);
    } else {
      openModal(product);
    }
  };

  const openModal = (product: Product) => {
    setModalProduct(product);
    setModalStep('intent');
    setIntent('');
    setFormName('');
    setFormEmail('');
    setFormFirm('');
  };

  const closeModal = () => setModalProduct(null);

  const handleCapture = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Capture]', {
      intent,
      name: formName,
      email: formEmail,
      firm: formFirm,
      design: modalProduct?.pattern,
    });
    setModalStep('done');
  };

  const handleStickySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Sticky Capture]', { email: stickyEmail });
    setStickyDismissed(true);
    setShowSticky(false);
  };

  const isCustomOrOrphan = (p: Product) => !familySlugMap[p.id];

  return (
    <div className="designs-page">
      {/* HERO */}
      <header className="designs-hero">
        <div className="section-label">Design Library</div>
        <h1 className="designs-hero-title">Find your design</h1>
        <p className="designs-hero-desc">
          30+ spec-ready patterns. Explore the family. Get the spec.
        </p>
      </header>

      {/* SEARCH + PILLS + FILTERS */}
      <section className="designs-filter-section">
        <input
          type="text"
          placeholder={'Search \u2014 "organic" "Art Deco" "stone" "healthcare lobby"'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="designs-search-input"
        />

        {/* Popular pills */}
        <div className="designs-pills-row">
          {POPULAR_PILLS.map((pill) => (
            <button
              key={pill}
              className="designs-pill"
              onClick={() => setSearch(pill.replace('✦ ', ''))}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Compact filter row */}
        <div className="designs-filters-compact">
          {/* Application */}
          <div className="designs-filter-group">
            <span className="designs-filter-label">Application</span>
            <div className="designs-chip-row">
              {APPLICATIONS.map((a) => (
                <button
                  key={a}
                  onClick={() => setApplication(a)}
                  className={`designs-chip ${application === a ? 'active' : ''}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Sector */}
          <div className="designs-filter-group">
            <span className="designs-filter-label">Sector</span>
            <div className="designs-chip-row">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`designs-chip ${sector === s ? 'active' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Surface */}
          <div className="designs-filter-group">
            <span className="designs-filter-label">Surface</span>
            <div className="designs-chip-row">
              {SURFACES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSurface(s)}
                  className={`designs-chip ${surface === s ? 'active' : ''}`}
                >
                  {s === 'Illuminated' ? '✦ Illuminated' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Collection */}
          <div className="designs-filter-group">
            <span className="designs-filter-label">Collection</span>
            <div className="designs-chip-row">
              {COLLECTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCollection(c)}
                  className={`designs-chip ${collection === c ? 'active' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="designs-result-count">{filtered.length} designs</div>
      </section>

      {/* MASONRY GRID */}
      <section className="designs-masonry">
        {filtered.map((p) => (
          <div key={p.id} className="designs-card" onClick={() => handleCardClick(p)}>
            <div className="designs-card-img-wrap">
              <Image
                src={p.cloudinaryUrl}
                alt={p.title}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="designs-card-badges">
                {p.specReady && <span className="designs-badge spec-ready">Spec-Ready</span>}
                {isCustomOrOrphan(p) && <span className="designs-badge studio">Studio</span>}
                {p.isBacklit && <span className="designs-badge illuminated">✦</span>}
              </div>
            </div>
            <div className="designs-card-info">
              <div className="designs-card-name">{p.pattern}</div>
              <div className="designs-card-meta">
                {p.patternFamily && p.patternFamily !== 'Custom' ? p.patternFamily : ''}
                {p.sector !== 'General' ? (p.patternFamily ? ` · ${p.sector}` : p.sector) : ''}
              </div>
            </div>
          </div>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="designs-empty">
          <p>No designs match your current filters.</p>
          <button
            onClick={() => { setSector('All'); setApplication('All'); setSurface('All'); setCollection('All'); setSearch(''); }}
            className="designs-chip active"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* MODAL (Custom/orphan products) */}
      {modalProduct && (
        <div className="designs-overlay" onClick={closeModal}>
          <div className="designs-modal" onClick={(e) => e.stopPropagation()}>
            <button className="designs-modal-close" onClick={closeModal}>&#10005;</button>
            <div className="designs-modal-image">
              <Image
                src={modalProduct.cloudinaryUrl}
                alt={modalProduct.title}
                fill
                sizes="600px"
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
            </div>
            <h2 className="designs-modal-title">{modalProduct.pattern}</h2>
            <p className="designs-modal-desc">{modalProduct.title}</p>

            {modalStep === 'intent' && (
              <div className="designs-intent-grid">
                {[
                  { label: 'Spec this design', value: 'spec' },
                  { label: 'Request a sample', value: 'sample' },
                  { label: 'Get pricing', value: 'pricing' },
                  { label: 'Just browsing', value: 'browsing' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className="designs-intent-btn"
                    onClick={() => {
                      setIntent(opt.value);
                      if (opt.value === 'browsing') {
                        setModalStep('done');
                      } else {
                        setModalStep('capture');
                      }
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {modalStep === 'capture' && (
              <form onSubmit={handleCapture} className="designs-capture-form">
                <input type="text" placeholder="Name" value={formName} onChange={(e) => setFormName(e.target.value)} required className="designs-input" />
                <input type="email" placeholder="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required className="designs-input" />
                <input type="text" placeholder="Firm (optional)" value={formFirm} onChange={(e) => setFormFirm(e.target.value)} className="designs-input" />
                <button type="submit" className="designs-submit-btn">Submit</button>
              </form>
            )}

            {modalStep === 'done' && (
              <div className="designs-done-msg">
                <p>Thank you! We&apos;ll be in touch.</p>
                <button onClick={closeModal} className="designs-submit-btn">Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STICKY BAR */}
      {showSticky && !stickyDismissed && (
        <div className="designs-sticky-bar">
          <form onSubmit={handleStickySubmit} className="designs-sticky-form">
            <span className="designs-sticky-text">Get new designs in your inbox</span>
            <input
              type="email"
              placeholder="Your email"
              value={stickyEmail}
              onChange={(e) => setStickyEmail(e.target.value)}
              required
              className="designs-sticky-input"
            />
            <button type="submit" className="designs-sticky-submit">Subscribe</button>
            <button
              type="button"
              onClick={() => { setStickyDismissed(true); setShowSticky(false); }}
              className="designs-sticky-close"
            >
              &#10005;
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
