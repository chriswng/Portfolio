import { FOOTER } from '../data/content';

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
    <footer className="site-footer">
      <div className="footer-card">
        <div className="footer-wordmark">{FOOTER.wordmark}</div>

        <div className="footer-cta">
          <span className="footer-cta-line">{FOOTER.availability}</span>
          <a className="footer-cta-btn" href={FOOTER.ctaHref} target="_blank" rel="noopener noreferrer">
            {FOOTER.ctaLabel}<span aria-hidden="true">&nbsp;→</span>
          </a>
        </div>

        <div className="footer-legal">{FOOTER.rights}</div>

        <nav className="footer-cols" aria-label="Footer">
          {FOOTER.columns.map((col) => (
            <div className="footer-col" key={col.head}>
              <div className="footer-col-head">{col.head}</div>
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
          <a href={base || '#about'} className="footer-mark">./</a>
          <span className="footer-tagline">{FOOTER.tagline}</span>
          <span className="footer-pill">itschriswang</span>
        </div>
      </div>
    </footer>
  );
}
