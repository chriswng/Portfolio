import { useState } from 'react';
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
  const [email, setEmail] = useState('');

  // No backend on GitHub Pages: the signup composes a pre-addressed message in
  // the visitor's own mail client rather than pretending to store anything.
  const onSubmit = (e) => {
    e.preventDefault();
    const to = FOOTER.email;
    const subject = encodeURIComponent('Keep me in the loop');
    const body = encodeURIComponent(
      `Hi Chris,\n\nPlease add me to your updates${email ? ` (${email})` : ''}.\n`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <footer className="site-footer">
      <div className="footer-card">
        <div className="footer-wordmark">{FOOTER.wordmark}</div>

        <form className="footer-signup" onSubmit={onSubmit}>
          <span className="footer-signup-lbl">{FOOTER.signupLabel}</span>
          <div className="footer-field">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input
              id="footer-email"
              className="footer-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={FOOTER.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="footer-subscribe">
              {FOOTER.subscribe}<span aria-hidden="true">&nbsp;→</span>
            </button>
          </div>
          <span className="footer-signup-note">{FOOTER.signupNote}</span>
        </form>

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
