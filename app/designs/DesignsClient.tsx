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
const SYSTEMS = ['All', 'Ribs', 'Fins', 'Slice', 'Screen'] as const;
const SORT_OPTIONS = ['Random', 'Most Popular'] as const;

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
  const [system, setSystem] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Random');
  const [search, setSearch] = useState('');

  // Modal state (for Custom / orphan products — simple inquiry form)
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formFirm, setFormFirm] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

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
    let result = shuffled.filter((p) => {
      if (sector !== 'All' && p.sector !== sector) return false;
      if (application !== 'All' && !p.application.toLowerCase().includes(application.toLowerCase())) return false;
      if (surface === 'Illuminated' && !p.isBacklit) return false;
      if (surface === 'Standard' && p.isBacklit) return false;
      if (system !== 'All') {
        const searchable = `${p.pattern} ${p.keywords.join(' ')} ${p.description}`.toLowerCase();
        if (!searchable.includes(system.toLowerCase())) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const searchable = `${p.pattern} ${p.patternFamily} ${p.title} ${p.sector} ${p.keywords.join(' ')} ${p.description} ${p.application}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });

    // Sort
    if (sortBy === 'Most Popular') {
      result = [...result].sort((a, b) => {
        const countA = clickCounts[a.pattern] || 0;
        const countB = clickCounts[b.pattern] || 0;
        return countB - countA;
      });
    }

    return result;
  }, [shuffled, sector, application, surface, system, search, sortBy, clickCounts]);

  // Click tracking
  const trackClick = useCallback(
    (designName: string) => {
      const activeFilters = { sector, surface, system, search };
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
    [sector, surface, system, search]
  );

  // Card click: family → navigate, orphan → inquiry modal
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
    setFormName('');
    setFormEmail('');
    setFormFirm('');
    setFormMessage('');
    setFormSubmitted(false);
  };

  const closeModal = () => setModalProduct(null);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/design-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design: modalProduct?.pattern,
          name: formName,
          email: formEmail,
          firm: formFirm,
          projectName: formMessage,
        }),
      });
    } catch { /* fire and forget */ }
    setFormSubmitted(true);
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

          {/* System */}
          <div className="designs-filter-group">
            <span className="designs-filter-label">System</span>
            <div className="designs-chip-row">
              {SYSTEMS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSystem(s)}
                  className={`designs-chip ${system === s ? 'active' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="designs-filter-group">
            <span className="designs-filter-label">Sort</span>
            <div className="designs-chip-row">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`designs-chip ${sortBy === s ? 'active' : ''}`}
                >
                  {s}
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
              {/* Gradient overlay with name */}
              <div className="designs-card-overlay">
                <div className="designs-card-name">{p.pattern}</div>
              </div>
              {/* Badges */}
              <div className="designs-card-badges">
                {p.specReady && <span className="designs-badge spec-ready">Spec-Ready</span>}
                {isCustomOrOrphan(p) && <span className="designs-badge studio">Studio</span>}
                {p.isBacklit && <span className="designs-badge illuminated">✦</span>}
              </div>
            </div>
          </div>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="designs-empty">
          <p>No designs match your current filters.</p>
          <button
            onClick={() => { setSector('All'); setApplication('All'); setSurface('All'); setSystem('All'); setSearch(''); setSortBy('Random'); }}
            className="designs-chip active"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* INQUIRY MODAL (Custom/orphan products — simple form, no intent grid) */}
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
            <p className="designs-modal-desc">
              This is a custom/studio design. Tell us about your project and we&apos;ll follow up.
            </p>

            {!formSubmitted ? (
              <form onSubmit={handleInquiry} className="designs-capture-form">
                <input type="text" placeholder="Name *" value={formName} onChange={(e) => setFormName(e.target.value)} required className="designs-input" />
                <input type="email" placeholder="Email *" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required className="designs-input" />
                <input type="text" placeholder="Firm" value={formFirm} onChange={(e) => setFormFirm(e.target.value)} className="designs-input" />
                <textarea placeholder="Tell us about your project..." value={formMessage} onChange={(e) => setFormMessage(e.target.value)} className="designs-input designs-textarea" rows={3} />
                <button type="submit" className="designs-submit-btn">Send Inquiry</button>
              </form>
            ) : (
              <div className="designs-done-msg">
                <p>Thank you! We&apos;ll be in touch within 24 hours.</p>
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
