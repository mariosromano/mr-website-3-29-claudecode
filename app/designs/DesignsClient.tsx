'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import type { Product } from './page';

interface DesignsClientProps {
  products: Product[];
  clickCounts: Record<string, number>;
}

// Generate anonymous session ID (persists per browser session)
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
  'All',
  'Healthcare',
  'Hospitality',
  'Corporate',
  'Multi-Family',
  'Aviation',
  'Education',
  'Retail',
  'Residential',
  'Sports',
] as const;

const SURFACES = ['All', 'Illuminated', 'Standard'] as const;
const COLLECTIONS = ['Spec-Ready', 'All'] as const;
const SORT_OPTIONS = ['Default', 'Most Popular'] as const;

export default function DesignsClient({ products, clickCounts }: DesignsClientProps) {
  // ─── Filter state ───
  const [sector, setSector] = useState<string>('All');
  const [surface, setSurface] = useState<string>('All');
  const [collection, setCollection] = useState<string>('Spec-Ready');
  const [sortBy, setSortBy] = useState<string>('Default');
  const [search, setSearch] = useState('');

  // ─── Modal state ───
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalStep, setModalStep] = useState<'intent' | 'capture' | 'done'>('intent');
  const [intent, setIntent] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formFirm, setFormFirm] = useState('');

  // ─── Sticky bar state ───
  const [showSticky, setShowSticky] = useState(false);
  const [stickyEmail, setStickyEmail] = useState('');
  const [stickyDismissed, setStickyDismissed] = useState(false);
  const stickyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Sticky bar: show after 30s or 400px scroll ───
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

  // ─── Filter logic (pure JS, all in memory) ───
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      // Sector filter
      if (sector !== 'All' && p.sector !== sector) return false;
      // Surface filter
      if (surface === 'Illuminated' && !p.isBacklit) return false;
      if (surface === 'Standard' && p.isBacklit) return false;
      // Collection filter (NEW)
      if (collection === 'Spec-Ready' && !p.specReady) return false;
      // Search
      if (search) {
        const q = search.toLowerCase();
        const searchable = `${p.pattern} ${p.title} ${p.sector} ${p.keywords.join(' ')} ${p.description}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });

    // Sort (NEW — Most Popular)
    if (sortBy === 'Most Popular') {
      result = [...result].sort((a, b) => {
        const countA = clickCounts[a.pattern] || 0;
        const countB = clickCounts[b.pattern] || 0;
        return countB - countA;
      });
    }

    return result;
  }, [products, sector, surface, collection, search, sortBy, clickCounts]);

  // ─── Click tracking (NEW — fire-and-forget) ───
  const trackClick = useCallback(
    (designName: string) => {
      const activeFilters = { sector, surface, collection, sortBy, search };
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design_name: designName,
          active_filters: activeFilters,
          session_id: getSessionId(),
        }),
      }).catch(() => {}); // Fire and forget
    },
    [sector, surface, collection, sortBy, search]
  );

  // ─── Modal open handler ───
  const openModal = (product: Product) => {
    setModalProduct(product);
    setModalStep('intent');
    setIntent('');
    setFormName('');
    setFormEmail('');
    setFormFirm('');
    // Track click (NEW)
    trackClick(product.pattern);
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

  return (
    <div style={styles.page}>
      {/* ═══ NAV ═══ */}
      <nav style={styles.nav}>
        <a href="/" style={styles.navLogo}>
          M<span style={{ color: '#888' }}>|</span>R WALLS
        </a>
        <div style={styles.navLinks}>
          <a href="/applications" style={styles.navLink}>Applications</a>
          <a href="/system" style={styles.navLink}>The System</a>
          <a href="/projects" style={styles.navLink}>Projects</a>
          <a href="/designs" style={{ ...styles.navLink, color: '#f5f5f0', borderBottom: '1px solid #c8b89a' }}>Design Library</a>
          <a href="/makereal" style={styles.navLink}>MakeReal</a>
          <a href="/studio" style={styles.navLink}>Studio</a>
        </div>
        <a href="/contact" style={styles.navCta}>Contact</a>
      </nav>

      {/* ═══ HERO ═══ */}
      <header style={styles.hero}>
        <div style={styles.sectionLabel}>Design Library</div>
        <h1 style={styles.heroTitle}>30+ spec-ready designs</h1>
        <p style={styles.heroDesc}>
          CNC-cut to your exact dimensions. Filter by application, sector, or product type.
        </p>
      </header>

      {/* ═══ FILTER BAR ═══ */}
      <section style={styles.filterSection}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search designs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        {/* Row 1: Sector */}
        <div style={styles.filterRow}>
          <span style={styles.filterLabel}>Sector</span>
          <div style={styles.chipRow}>
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                style={sector === s ? styles.chipActive : styles.chip}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Surface */}
        <div style={styles.filterRow}>
          <span style={styles.filterLabel}>Surface</span>
          <div style={styles.chipRow}>
            {SURFACES.map((s) => (
              <button
                key={s}
                onClick={() => setSurface(s)}
                style={surface === s ? styles.chipActive : styles.chip}
              >
                {s === 'Illuminated' ? '✦ Illuminated' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Collection (NEW) */}
        <div style={styles.filterRow}>
          <span style={styles.filterLabel}>Collection</span>
          <div style={styles.chipRow}>
            {COLLECTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCollection(c)}
                style={collection === c ? styles.chipActive : styles.chip}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Sort (NEW) */}
        <div style={styles.filterRow}>
          <span style={styles.filterLabel}>Sort</span>
          <div style={styles.chipRow}>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                style={sortBy === s ? styles.chipActive : styles.chip}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.resultCount}>{filtered.length} designs</div>
      </section>

      {/* ═══ IMAGE GRID ═══ */}
      <section style={styles.grid}>
        {filtered.map((p) => (
          <div key={p.id} style={styles.card} onClick={() => openModal(p)}>
            <div style={styles.cardImageWrap}>
              <Image
                src={p.cloudinaryUrl}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
              {p.isBacklit && <span style={styles.backlitBadge}>✦ Illuminated</span>}
              {clickCounts[p.pattern] && sortBy === 'Most Popular' ? (
                <span style={styles.clickCount}>{clickCounts[p.pattern]} views</span>
              ) : null}
            </div>
            <div style={styles.cardInfo}>
              <div style={styles.cardPattern}>{p.pattern}</div>
              <div style={styles.cardMeta}>{p.sector !== 'General' ? p.sector : ''}</div>
            </div>
            <button style={styles.cardCta}>View + Inquire</button>
          </div>
        ))}
      </section>

      {filtered.length === 0 && (
        <div style={styles.emptyState}>
          <p>No designs match your current filters.</p>
          <button onClick={() => { setSector('All'); setSurface('All'); setCollection('All'); setSearch(''); }} style={styles.chipActive}>
            Clear all filters
          </button>
        </div>
      )}

      {/* ═══ MODAL ═══ */}
      {modalProduct && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={closeModal}>✕</button>
            <div style={styles.modalImage}>
              <Image
                src={modalProduct.cloudinaryUrl}
                alt={modalProduct.title}
                fill
                sizes="600px"
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
            </div>
            <h2 style={styles.modalTitle}>{modalProduct.pattern}</h2>
            <p style={styles.modalDesc}>{modalProduct.title}</p>

            {modalStep === 'intent' && (
              <div style={styles.intentGrid}>
                {[
                  { label: 'Spec this design', value: 'spec' },
                  { label: 'Request a sample', value: 'sample' },
                  { label: 'Get pricing', value: 'pricing' },
                  { label: 'Just browsing', value: 'browsing' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    style={styles.intentBtn}
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
              <form onSubmit={handleCapture} style={styles.captureForm}>
                <input
                  type="text"
                  placeholder="Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  style={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Firm (optional)"
                  value={formFirm}
                  onChange={(e) => setFormFirm(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.submitBtn}>Submit</button>
              </form>
            )}

            {modalStep === 'done' && (
              <div style={styles.doneMsg}>
                <p>Thank you! We&apos;ll be in touch.</p>
                <button onClick={closeModal} style={styles.submitBtn}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ STICKY BAR ═══ */}
      {showSticky && !stickyDismissed && (
        <div style={styles.stickyBar}>
          <form onSubmit={handleStickySubmit} style={styles.stickyForm}>
            <span style={styles.stickyText}>Get new designs in your inbox</span>
            <input
              type="email"
              placeholder="Your email"
              value={stickyEmail}
              onChange={(e) => setStickyEmail(e.target.value)}
              required
              style={styles.stickyInput}
            />
            <button type="submit" style={styles.stickySubmit}>Subscribe</button>
            <button
              type="button"
              onClick={() => { setStickyDismissed(true); setShowSticky(false); }}
              style={styles.stickyClose}
            >
              ✕
            </button>
          </form>
        </div>
      )}

      {/* ═══ PAGE CTAs ═══ */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaLabel}>Ready to start?</div>
        <div style={styles.ctaGrid}>
          <a href="/makereal" style={styles.ctaCard}>
            <div style={styles.ctaIcon}>◎</div>
            <h3 style={styles.ctaTitle}>Configure Your Spec</h3>
            <p style={styles.ctaDesc}>5-step configurator. Application, sector, design, color. Get CSI spec text in minutes.</p>
          </a>
          <a href="/contact" style={styles.ctaCard}>
            <div style={styles.ctaIcon}>◇</div>
            <h3 style={styles.ctaTitle}>Request a DFP</h3>
            <p style={styles.ctaDesc}>Design Fabrication Proposal. Send us your project details and we&apos;ll engineer a solution.</p>
          </a>
          <a href="/contact" style={styles.ctaCard}>
            <div style={styles.ctaIcon}>✦</div>
            <h3 style={styles.ctaTitle}>Request a Sample</h3>
            <p style={styles.ctaDesc}>Feel the material. See the carving. We&apos;ll ship a physical sample to your office.</p>
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={styles.footer}>
        <div>
          <div style={styles.footerLogo}>M<span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>R WALLS</div>
          <div style={styles.footerLocation}>Los Angeles, California</div>
        </div>
        <div style={styles.footerCopy}>© 2026 MR Walls. DuPont™ and Corian® are registered trademarks of DuPont.</div>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacy</a>
          <a href="#" style={styles.footerLink}>Terms</a>
          <a href="/contact" style={styles.footerLink}>Contact</a>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════
// INLINE STYLES — matches shared design system
// ═══════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: '#0a0a0a',
    color: '#f5f5f0',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 300,
    lineHeight: 1.5,
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased',
  },

  // Nav
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 48px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: 'rgba(10,10,10,0.92)',
    backdropFilter: 'blur(20px)',
  },
  navLogo: {
    fontWeight: 600,
    fontSize: 18,
    letterSpacing: '0.08em',
    color: '#f5f5f0',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: 36,
  },
  navLink: {
    fontSize: 13,
    letterSpacing: '0.1em',
    color: '#888',
    textDecoration: 'none',
    transition: 'color 0.2s',
    paddingBottom: 4,
  },
  navCta: {
    fontSize: 12,
    letterSpacing: '0.08em',
    color: '#0a0a0a',
    background: '#f5f5f0',
    padding: '8px 20px',
    borderRadius: 3,
    fontWeight: 500,
    textDecoration: 'none',
  },

  // Hero
  hero: {
    padding: '190px 48px 80px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: '#c8b89a',
    marginBottom: 12,
    fontWeight: 500,
    opacity: 0.7,
  },
  heroTitle: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 42,
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    margin: 0,
  },
  heroDesc: {
    fontSize: 15,
    color: '#888',
    marginTop: 16,
    maxWidth: 600,
    lineHeight: 1.6,
  },

  // Filters
  filterSection: {
    padding: '40px 48px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  searchInput: {
    width: '100%',
    maxWidth: 400,
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 4,
    color: '#f5f5f0',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 24,
    outline: 'none',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap' as const,
  },
  filterLabel: {
    fontSize: 11,
    letterSpacing: '0.1em',
    color: '#888',
    textTransform: 'uppercase' as const,
    minWidth: 70,
    fontWeight: 500,
  },
  chipRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  chip: {
    fontSize: 12,
    letterSpacing: '0.06em',
    color: '#888',
    padding: '6px 14px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    cursor: 'pointer',
    background: 'none',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    transition: 'all 0.2s',
  },
  chipActive: {
    fontSize: 12,
    letterSpacing: '0.06em',
    color: '#c8b89a',
    padding: '6px 14px',
    border: '1px solid #c8b89a',
    borderRadius: 20,
    cursor: 'pointer',
    background: 'rgba(200,184,154,0.08)',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
  },
  resultCount: {
    fontSize: 12,
    color: '#888',
    marginTop: 16,
    letterSpacing: '0.04em',
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
    padding: '48px',
  },
  card: {
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s',
    background: 'rgba(255,255,255,0.02)',
  },
  cardImageWrap: {
    position: 'relative' as const,
    aspectRatio: '4/3',
    overflow: 'hidden',
  },
  backlitBadge: {
    position: 'absolute' as const,
    top: 8,
    left: 8,
    fontSize: 10,
    letterSpacing: '0.08em',
    color: '#c8b89a',
    background: 'rgba(10,10,10,0.75)',
    padding: '4px 10px',
    borderRadius: 12,
    zIndex: 2,
  },
  clickCount: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    fontSize: 10,
    letterSpacing: '0.06em',
    color: '#888',
    background: 'rgba(10,10,10,0.75)',
    padding: '3px 8px',
    borderRadius: 10,
    zIndex: 2,
  },
  cardInfo: {
    padding: '12px 16px 4px',
  },
  cardPattern: {
    fontSize: 15,
    fontWeight: 400,
    letterSpacing: '0.02em',
  },
  cardMeta: {
    fontSize: 11,
    color: '#888',
    letterSpacing: '0.04em',
    marginTop: 2,
  },
  cardCta: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: 'none',
    color: '#c8b89a',
    fontSize: 12,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    textAlign: 'left' as const,
  },

  // Empty state
  emptyState: {
    textAlign: 'center' as const,
    padding: '80px 48px',
    color: '#888',
    fontSize: 14,
  },

  // Modal
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    background: '#151515',
    borderRadius: 8,
    maxWidth: 500,
    width: '100%',
    padding: 32,
    position: 'relative' as const,
    border: '1px solid rgba(255,255,255,0.08)',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  modalClose: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: 18,
    cursor: 'pointer',
    zIndex: 3,
  },
  modalImage: {
    position: 'relative' as const,
    aspectRatio: '16/9',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 28,
    fontWeight: 400,
    margin: '0 0 6px',
  },
  modalDesc: {
    fontSize: 13,
    color: '#888',
    marginBottom: 24,
  },
  intentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  intentBtn: {
    padding: '14px 16px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 4,
    background: 'rgba(255,255,255,0.03)',
    color: '#f5f5f0',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
  },
  captureForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  input: {
    padding: '12px 16px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 4,
    background: 'rgba(255,255,255,0.06)',
    color: '#f5f5f0',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
  },
  submitBtn: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: 4,
    background: '#c8b89a',
    color: '#0a0a0a',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.06em',
  },
  doneMsg: {
    textAlign: 'center' as const,
    padding: '20px 0',
  },

  // Sticky bar
  stickyBar: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(10,10,10,0.95)',
    borderTop: '1px solid rgba(200,184,154,0.15)',
    padding: '14px 48px',
    zIndex: 150,
    backdropFilter: 'blur(20px)',
  },
  stickyForm: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    maxWidth: 700,
    margin: '0 auto',
  },
  stickyText: {
    fontSize: 13,
    color: '#f5f5f0',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
  },
  stickyInput: {
    flex: 1,
    padding: '8px 14px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4,
    background: 'rgba(255,255,255,0.06)',
    color: '#f5f5f0',
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
  },
  stickySubmit: {
    padding: '8px 20px',
    border: 'none',
    borderRadius: 4,
    background: '#c8b89a',
    color: '#0a0a0a',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap' as const,
  },
  stickyClose: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: 16,
    cursor: 'pointer',
    padding: 4,
  },

  // Page CTAs
  ctaSection: {
    padding: '110px 48px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  ctaLabel: {
    fontSize: 10,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: '#c8b89a',
    textAlign: 'center' as const,
    marginBottom: 48,
    fontWeight: 500,
    opacity: 0.7,
  },
  ctaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    maxWidth: 1100,
    margin: '0 auto',
  },
  ctaCard: {
    padding: '40px 32px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    background: 'rgba(255,255,255,0.06)',
    textAlign: 'center' as const,
    textDecoration: 'none',
    color: '#f5f5f0',
    transition: 'all 0.35s',
  },
  ctaIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.08)',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: '#c8b89a',
  },
  ctaTitle: {
    fontSize: 17,
    fontWeight: 400,
    marginBottom: 8,
    margin: '0 0 8px',
  },
  ctaDesc: {
    fontSize: 12,
    color: '#888',
    lineHeight: 1.5,
    margin: 0,
  },

  // Footer
  footer: {
    padding: 48,
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLogo: {
    fontWeight: 600,
    fontSize: 16,
    letterSpacing: '0.08em',
    color: '#888',
  },
  footerLocation: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: '0.06em',
    marginTop: 6,
  },
  footerCopy: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: '0.04em',
    textAlign: 'center' as const,
  },
  footerLinks: {
    display: 'flex',
    gap: 24,
  },
  footerLink: {
    fontSize: 12,
    color: '#888',
    textDecoration: 'none',
    letterSpacing: '0.04em',
  },
};
