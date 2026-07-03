import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { NAV_LINKS } from '../data/content';

export function Grain() {
  return <div className="grain-overlay" aria-hidden="true" />;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return <motion.div id="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export function Nav() {
  const [active, setActive] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [menuOpen]);

  const onClick = (e, href) => {
    if (!href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    setMenuOpen(false);
    const offset = navRef.current ? navRef.current.offsetHeight : 52;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav className="nav" aria-label="Primary" ref={navRef}>
      <div className="nav-inner canvas">
        <a href="#about" className="nav-logo" onClick={(e) => onClick(e, '#about')}>./</a>
        <div className={`nav-links${menuOpen ? ' open' : ''}`} role="navigation">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={!l.external && active === l.href.slice(1) ? 'active' : undefined}
              onClick={(e) => onClick(e, l.href)}
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
