import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import './Footer.css';

export const Footer: React.FC = () => {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Footer Top Directory Links */}
        <div className="footer-directory-grid">
          <div className="directory-col">
            <h3 className="directory-heading">Support</h3>
            <ul className="directory-list">
              <li><Link to="/host">Help Center</Link></li>
              <li><Link to="/host">AirCover</Link></li>
              <li><Link to="/host">Anti-discrimination</Link></li>
              <li><Link to="/host">Disability support</Link></li>
              <li><Link to="/host">Cancellation options</Link></li>
              <li><Link to="/host">Report neighborhood concern</Link></li>
            </ul>
          </div>

          <div className="directory-col">
            <h3 className="directory-heading">Hosting</h3>
            <ul className="directory-list">
              <li><Link to="/host">Airbnb your home</Link></li>
              <li><Link to="/host">AirCover for Hosts</Link></li>
              <li><Link to="/host">Hosting resources</Link></li>
              <li><Link to="/host">Community forum</Link></li>
              <li><Link to="/host">Hosting responsibly</Link></li>
              <li><Link to="/host">Airbnb-friendly apartments</Link></li>
            </ul>
          </div>

          <div className="directory-col">
            <h3 className="directory-heading">Airbnb</h3>
            <ul className="directory-list">
              <li><Link to="/">Newsroom</Link></li>
              <li><Link to="/">New features</Link></li>
              <li><Link to="/host">Careers</Link></li>
              <li><Link to="/host">Investors</Link></li>
              <li><Link to="/wishlists">Gift cards</Link></li>
              <li><Link to="/">Airbnb.org emergency stays</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider" />

        {/* Footer Bottom Legal & Options */}
        <div className="footer-bottom-bar">
          <div className="legal-links-group">
            <span>© 2026 Airbnb Clone, Inc.</span>
            <span className="dot">·</span>
            <a href="#privacy" onClick={scrollToTop}>Privacy</a>
            <span className="dot">·</span>
            <a href="#terms" onClick={scrollToTop}>Terms</a>
            <span className="dot">·</span>
            <a href="#sitemap" onClick={scrollToTop}>Sitemap</a>
            <span className="dot">·</span>
            <a href="#company" onClick={scrollToTop}>Company details</a>
          </div>

          <div className="footer-settings-group">
            <button className="setting-btn" onClick={scrollToTop}>
              <Globe size={16} />
              <span>English (IN)</span>
            </button>
            <button className="setting-btn" onClick={scrollToTop}>
              <span>₹ INR</span>
            </button>
            <div className="social-icons-group">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
