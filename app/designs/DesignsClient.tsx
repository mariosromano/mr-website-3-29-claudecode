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

const SECTORS = [
  'All', 'Healthcare', 'Hospitality', 'Corporate', 'Multi-Family',
  'Aviation', 'Education', 'Retail', 'Residential', 'Sports',
] as const;

const APPLICATIONS = [
  'All', 'Feature Wall', 'Elevator Lobby', 'Facade', 'Ceiling', 'Water Feature',
] as const;

const SURFACES = ['All', 'Illuminated', 'Standard'] as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type CollectionTab = 'all' | 'spec-ready' | 'custom';

export default function DesignsClient({ products, clickCounts, familySlugMap }: DesignsClientProps) {
  const router = useRouter();

  // Filter state
  const [sector, setSector] = useState<string>('All');
  const [application, setApplication] = useState<string>('All');
  const [surface, setSurface] = useState<string>('All');
  const [collection, setCollection] = useState<CollectionTab>('all');
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
    const result = shuffled.filter((p) => {
      // Collection tab
      if (collection === 'spec-ready' && !familySlugMap[p.id]) return false;
      if (collection === 'custom' && familySlugMap[p.id]) return false;

      if (sector !== 'All' && p.sector !== sector) return false;
      if (application !== 'All' && !p.application.toLowerCase().includes(application.toLowerCase())) return false;
      if (surface === 'Illuminated' && !p.isBacklit) return false;
      if (surface === 'Standard' && p.isBacklit) return false;
      if (search) {
        const q = search.toLowerCase();
        const searchable = `${p.pattern} ${p.patternFamily} ${p.title} ${p.sector} ${p.keywords.join(' ')} ${p.description} ${p.application}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });

    return result;
  }, [shuffled, sector, application, surface, collection, search, familySlugMap]);

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

  const specReadyCount = products.filter(p => familySlugMap[p.id]).length;
  const customCount = products.filter(p => !familySlugMap[p.id]).length;

  return (
    <div className="designs-page">
      {/* COMPACT HEADER + SEARCH */}
      <header className="designs-header">
        <div className="designs-header-top">
          <h1 className="designs-header-title">Design Library</h1>
          <span className="designs-header-count">{filtered.length} designs</span>
        </div>

        <input
          type="text"
          placeholder={'Search designs...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="designs-search-input"
        />

        {/* Collection tabs */}
        <div className="designs-tabs">
          <button
            className={`designs-tab ${collection === 'all' ? 'active' : ''}`}
            onClick={() => setCollection('all')}
          >
            All ({products.length})
          </button>
          <button
            className={`designs-tab ${collection === 'spec-ready' ? 'active' : ''}`}
            onClick={() => setCollection('spec-ready')}
          >
            Spec-Ready ({specReadyCount})
          </button>
          <button
            className={`designs-tab ${collection === 'custom' ? 'active' : ''}`}
            onClick={() => setCollection('custom')}
          >
            Custom ({customCount})
          </button>
        </div>

        {/* Compact filters — single row */}
        <div className="designs-filters-row">
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
        </div>
      </header>

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
                {familySlugMap[p.id] && <span className="designs-badge spec-ready">Spec-Ready</span>}
                {!familySlugMap[p.id] && <span className="designs-badge studio">Studio</span>}
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
            onClick={() => { setSector('All'); setApplication('All'); setSurface('All'); setCollection('all'); setSearch(''); }}
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
