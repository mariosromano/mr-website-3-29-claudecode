import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <div className="footer-logo">M<span>|</span>R WALLS</div>
        <div className="footer-location">2314 Michigan Ave, Santa Monica, CA 90404</div>
        <div className="footer-location" style={{ marginTop: 2 }}>
          <a href="tel:+13102436967" style={{ color: 'inherit' }}>(310) 243-6967</a>
          {' \u00B7 '}
          <a href="mailto:orders@marioromano.com" style={{ color: 'inherit' }}>orders@marioromano.com</a>
        </div>
      </div>
      <div className="footer-copy">
        &copy; 2026 MR Walls. DuPont&trade; and Corian&reg; are registered trademarks of DuPont.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
        <ul className="footer-links">
          <li><a href="https://www.instagram.com/mrwalls/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://www.linkedin.com/company/mario-romano/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="https://www.youtube.com/@maboroshi7" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          <li><a href="https://www.pinterest.com/maboroshi7/" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
        </ul>
        <ul className="footer-links">
          <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>
    </footer>
  );
}
