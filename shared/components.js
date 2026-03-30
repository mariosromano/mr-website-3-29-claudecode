// ═══════════════════════════════════════════
// M|R WALLS — SHARED COMPONENTS (ES Module)
// ═══════════════════════════════════════════

export const CLOUDINARY = 'https://res.cloudinary.com/dtlodxxio/image/upload';

function getActivePage() {
  const path = window.location.pathname.replace(/\/index\.html$/, '');
  const seg = path.split('/').filter(Boolean)[0] || 'home';
  return seg;
}

// ─── NAV ───
export function injectNav() {
  const active = getActivePage();
  const items = [
    { href: '/applications', num: '01', label: 'Applications', key: 'applications' },
    { href: '/system',       num: '02', label: 'The System',   key: 'system' },
    { href: '/projects',     num: '03', label: 'Projects',     key: 'projects' },
    { href: '/designs',      num: '04', label: 'Design Library', key: 'designs' },
    { href: '/makereal',     num: '05', label: 'MakeReal',     key: 'makereal' },
    { href: '/studio',       num: '06', label: 'Studio',       key: 'studio' },
  ];
  const lis = items.map(i =>
    `<li class="${active === i.key ? 'active' : ''}"><a href="${i.href}"><span class="nav-number">${i.num}</span> ${i.label}</a></li>`
  ).join('');

  const html = `
    <nav class="nav" id="nav">
      <a href="/" class="nav-logo">M<span>|</span>R WALLS</a>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-items" id="navItems">${lis}</ul>
      <a href="/contact" class="nav-cta">Contact</a>
    </nav>`;
  document.body.insertAdjacentHTML('afterbegin', html);

  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navItems').classList.toggle('open');
  });
  document.querySelectorAll('#navItems a').forEach(link => {
    link.addEventListener('click', () => document.getElementById('navItems').classList.remove('open'));
  });
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    nav.style.background = window.scrollY > 80 ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.85)';
  }, { passive: true });
}

// ─── PAGE CTAs (inner pages only) ───
export function injectPageCTAs() {
  const html = `
    <section class="page-cta-section">
      <div class="section-label fade-up" style="text-align:center;margin-bottom:48px;">Ready to start?</div>
      <div class="page-cta-grid">
        <a class="page-cta-card fade-up" href="/makereal">
          <div class="page-cta-card-icon">\u25CE</div>
          <h3>Configure Your Spec</h3>
          <p>5-step configurator. Application, sector, design, color. Get CSI spec text in minutes.</p>
        </a>
        <a class="page-cta-card fade-up" href="/contact">
          <div class="page-cta-card-icon">\u25C7</div>
          <h3>Request a DFP</h3>
          <p>Design Fabrication Proposal. Send us your project details and we\u2019ll engineer a solution.</p>
        </a>
        <a class="page-cta-card fade-up" href="/contact">
          <div class="page-cta-card-icon">\u2726</div>
          <h3>Request a Sample</h3>
          <p>Feel the material. See the carving. We\u2019ll ship a physical sample to your office.</p>
        </a>
      </div>
    </section>`;
  const footer = document.querySelector('.site-footer');
  if (footer) {
    footer.insertAdjacentHTML('beforebegin', html);
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}

// ─── FOOTER ───
export function injectFooter() {
  const html = `
    <footer class="site-footer">
      <div class="footer-left">
        <div class="footer-logo">M<span>|</span>R WALLS</div>
        <div class="footer-location">Los Angeles, California</div>
      </div>
      <div class="footer-copy">\u00A9 2026 MR Walls. DuPont\u2122 and Corian\u00AE are registered trademarks of DuPont.</div>
      <ul class="footer-links">
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Terms</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </footer>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

// ─── ANIMATIONS ───
export function initAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('fade-up'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ─── LAZY IMAGES ───
export function initLazyImages() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.bg}')`;
        observer.unobserve(el);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('[data-bg]').forEach(el => observer.observe(el));
}

// ─── FILTERS ───
export function initFilters() {
  const chips = document.querySelectorAll('.filter-chip');
  if (!chips.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filterGroup = chip.dataset.filterGroup || 'sector';
      const value = chip.dataset.filter;

      // Toggle active
      if (chip.classList.contains('active')) {
        chip.classList.remove('active');
      } else {
        // Deselect siblings in same group
        document.querySelectorAll(`.filter-chip[data-filter-group="${filterGroup}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      }

      // Get all active filters
      const activeFilters = {};
      document.querySelectorAll('.filter-chip.active').forEach(c => {
        const group = c.dataset.filterGroup || 'sector';
        activeFilters[group] = c.dataset.filter;
      });

      // Show/hide cards
      document.querySelectorAll('.image-card[data-filterable]').forEach(card => {
        let show = true;
        for (const [group, val] of Object.entries(activeFilters)) {
          const cardVal = card.dataset[group] || '';
          if (!cardVal.split(',').map(s => s.trim()).includes(val)) {
            show = false;
            break;
          }
        }
        card.classList.toggle('hidden', !show);
      });
    });
  });
}

// ─── INIT ALL ───
export function initPage() {
  injectNav();
  injectPageCTAs();
  injectFooter();
  // Delay to let injected content render
  requestAnimationFrame(() => {
    initAnimations();
    initLazyImages();
    initFilters();
  });
}
