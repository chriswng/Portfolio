import { FOOTER } from '../data/content';
import Icon from './Icons';
import Mark from './Mark';

// LinkedIn wordmark, inlined so it inherits currentColor and needs no request.
function LinkedInIcon() {
  return (
    <svg className="li-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.44-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z"/>
    </svg>
  );
}

// Resolve a footer link against the page it renders on. Home-page anchors
// (#about) and sub-page paths (work/) are written relative to the site root;
// `base` ('' at root, '../' under /work/) rebases them so the same footer works
// from either page. Absolute and mailto links are left untouched.
function resolve(href, base) {
  if (/^(https?:|mailto:)/.test(href)) return href;
  return base + href;
}

export default function SiteFooter({ base = '' }) {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-card">
        <div className="footer-wordmark">{FOOTER.wordmark}</div>

        {/* The single primary call to action. Availability + location fold in
            from the former Contact section; one LinkedIn button, nothing else. */}
        <div className="footer-cta">
          <div className="footer-cta-copy">
            <span className="footer-cta-line">{FOOTER.availability}</span>
            <span className="footer-cta-loc">{FOOTER.location}</span>
          </div>
          <a className="footer-cta-btn" href={FOOTER.ctaHref} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon />{FOOTER.ctaLabel}<span aria-hidden="true">&nbsp;→</span>
          </a>
        </div>

        <nav className="footer-cols" aria-label="Footer">
          {FOOTER.columns.map((col) => (
            <div className="footer-col" key={col.head}>
              <div className="footer-col-head">{col.icon && <Icon name={col.icon} size={14} className="fpi-lead" />}{col.head}</div>
              <ul className="footer-col-list">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={resolve(l.href, base)}
                      {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="footer-baseline">
          <a href={base || '#about'} className="footer-mark" aria-label="Christopher Wang, home"><Mark /></a>
          <span className="footer-legal">{FOOTER.rights}</span>
        </div>
      </div>
    </footer>
  );
}
