import { useEffect, useRef } from 'react';
import { STRIPES_START, STRIPES_T, STRIPES_MARKS } from '../data/stripes';

export default function StripesFooter() {
  const footerRef = useRef(null);
  const canvasRef = useRef(null);
  const hairRef = useRef(null);
  const readoutRef = useRef(null);
  const markRefs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = footerRef.current;
    const readout = readoutRef.current;
    const hair = hairRef.current;
    if (!canvas || !footer || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const T = STRIPES_T, START = STRIPES_START, N = T.length;

    // ColorBrewer RdBu anchors; colour keyed to the series midpoint baseline.
    const BASE = 0.36, LIM = 0.75;
    const NEG = [[209, 229, 240], [146, 197, 222], [67, 147, 195], [33, 102, 172], [8, 48, 107]];
    const POS = [[253, 219, 199], [244, 165, 130], [214, 96, 77], [178, 24, 43], [103, 0, 31]];
    const ramp = (stops, tt) => {
      tt = Math.max(0, Math.min(1, tt)) * (stops.length - 1);
      const i = Math.min(Math.floor(tt), stops.length - 2), f = tt - i;
      const a = stops[i], b = stops[i + 1];
      return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * f) + ',' + Math.round(a[1] + (b[1] - a[1]) * f) + ',' + Math.round(a[2] + (b[2] - a[2]) * f) + ')';
    };
    const cols = T.map((a) => { const c = a - BASE; return c < 0 ? ramp(NEG, -c / LIM) : ramp(POS, c / LIM); });

    let prog = reduced ? 1 : 0, drawn = false;
    function size() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = footer.clientWidth * dpr;
      canvas.height = footer.clientHeight * dpr;
    }
    function draw() {
      const w = canvas.width, h = canvas.height, sw = w / N;
      ctx.clearRect(0, 0, w, h);
      const count = Math.ceil(N * prog);
      for (let i = 0; i < count; i++) { ctx.fillStyle = cols[i]; ctx.fillRect(Math.floor(i * sw), 0, Math.ceil(sw) + 1, h); }
    }
    const fmt = (a) => (a >= 0 ? '+' : '−') + Math.abs(a).toFixed(2) + '°C';
    const setReadout = (i) => { if (readout) readout.textContent = (START + i) + ' · ' + fmt(T[i]) + ' vs 1850–1900'; };
    function reveal() {
      if (drawn) return; drawn = true;
      if (reduced) { prog = 1; draw(); return; }
      const t0 = performance.now(), DUR = 1600;
      (function tick(now) { const p = Math.min((now - t0) / DUR, 1); prog = 1 - Math.pow(1 - p, 3); draw(); if (p < 1) requestAnimationFrame(tick); })(t0);
    }
    size(); draw();

    markRefs.current.forEach((m, idx) => {
      if (!m) return;
      const yv = STRIPES_MARKS[idx].year;
      m.style.left = (((yv - START) + 0.5) / N * 100) + '%';
    });

    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((es, o) => { es.forEach((e) => { if (e.isIntersecting) { reveal(); o.disconnect(); } }); }, { threshold: 0.15 });
      io.observe(footer);
    } else reveal();

    const onMove = (e) => {
      const r = footer.getBoundingClientRect();
      const x = Math.max(0, Math.min(r.width - 1, e.clientX - r.left));
      const i = Math.max(0, Math.min(N - 1, Math.floor(x / r.width * N)));
      setReadout(i);
      if (hair) { hair.style.left = x + 'px'; hair.style.opacity = '1'; }
    };
    const onLeave = () => { if (hair) hair.style.opacity = '0'; setReadout(N - 1); };
    footer.addEventListener('pointermove', onMove);
    footer.addEventListener('pointerleave', onLeave);
    let rT;
    const onResize = () => { clearTimeout(rT); rT = setTimeout(() => { size(); draw(); }, 150); };
    window.addEventListener('resize', onResize);

    return () => {
      if (io) io.disconnect();
      footer.removeEventListener('pointermove', onMove);
      footer.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <footer id="stripes-footer" ref={footerRef}>
      <canvas
        id="stripes-canvas" ref={canvasRef} role="img"
        aria-label="Warming stripes: global mean temperature anomaly for each year from 1850 to 2025, shading from blue (cooler than the 1850 to 1900 average) to deep red (warmer)"
      />
      <div className="stripes-scrim" aria-hidden="true" />
      <div className="stripes-hair" ref={hairRef} aria-hidden="true" />
      <div className="stripes-marks" aria-hidden="true">
        {STRIPES_MARKS.map((m, i) => (
          <div
            key={i}
            className={'stripe-mark' + (m.flip ? ' flip' : '') + (m.mine ? ' mine' : '')}
            ref={(el) => (markRefs.current[i] = el)}
          >
            <span style={{ top: m.top }}>{m.label}</span>
          </div>
        ))}
      </div>
      <div className="stripes-content canvas">
        <div className="stripes-meta">
          <span className="stripes-cap">The context for all of this work: every year since 1850, coloured by its distance from the pre-industrial average</span>
          <span className="stripes-readout" ref={readoutRef}>2025 · +1.46°C vs 1850–1900</span>
        </div>
        <div className="footer-inner">
          <a href="#about" className="footer-home">./</a>
          <span className="stripes-credit">Data: HadCRUT5, Met Office · after Ed Hawkins / #ShowYourStripes</span>
          <span className="footer-name">Christopher Wang · 2026</span>
        </div>
      </div>
    </footer>
  );
}
