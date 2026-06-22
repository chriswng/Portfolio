import { useEffect, useRef, useState } from 'react';
import { TICKER_TERMS } from '../data/content';

function Run({ onTermClick, onTermEnter, onTermLeave }) {
  return (
    <span className="ticker-run">
      {TICKER_TERMS.map((t, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span
            className="t-term"
            data-tip={t.tip}
            onClick={(e) => { e.stopPropagation(); onTermClick(e.currentTarget, t.tip); }}
            onMouseEnter={(e) => onTermEnter(e.currentTarget, t.tip)}
            onMouseLeave={onTermLeave}
          >
            {t.term}
          </span>
          <span className="t-sep">&nbsp;·&nbsp;</span>
        </span>
      ))}
    </span>
  );
}

export default function Ticker() {
  const trackRef = useRef(null);
  const tipRef = useRef(null);
  const [tip, setTip] = useState({ visible: false, text: '', x: 0, y: 0 });
  const activeRef = useRef(null);
  const hoverable = typeof window !== 'undefined' && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  const pause = (p) => { if (trackRef.current) trackRef.current.classList.toggle('paused', p); };

  const place = (el) => {
    const tw = tipRef.current ? tipRef.current.offsetWidth : 260;
    const th = tipRef.current ? tipRef.current.offsetHeight : 80;
    const r = el.getBoundingClientRect();
    let x = r.left, y = r.bottom + 8;
    if (y + th + 8 > window.innerHeight) y = r.top - th - 8;
    x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
    y = Math.max(56, Math.min(y, window.innerHeight - th - 8));
    return { x, y };
  };

  const show = (el, text) => {
    if (activeRef.current) activeRef.current.classList.remove('t-active');
    activeRef.current = el; el.classList.add('t-active');
    pause(true);
    setTip({ visible: true, text, ...place(el) });
  };
  const hide = () => {
    pause(false);
    if (activeRef.current) { activeRef.current.classList.remove('t-active'); activeRef.current = null; }
    setTip((t) => ({ ...t, visible: false }));
  };

  const onTermClick = (el, text) => {
    if (activeRef.current === el) { hide(); return; }
    show(el, text);
  };

  useEffect(() => {
    const onDocClick = () => { if (tip.visible) hide(); };
    const onEsc = (e) => { if (e.key === 'Escape') hide(); };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('click', onDocClick); document.removeEventListener('keydown', onEsc); };
  }, [tip.visible]);

  return (
    <div className="ticker-band" aria-hidden="true">
      <div
        ref={tipRef}
        className="ticker-tip"
        style={{ left: tip.x, top: tip.y, opacity: tip.visible ? 1 : 0, pointerEvents: tip.visible ? 'auto' : 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="ticker-tip-close" aria-label="Close" onClick={(e) => { e.stopPropagation(); hide(); }}>×</button>
        <span className="ticker-tip-body">{tip.text}</span>
      </div>
      <div className="ticker-track" ref={trackRef}>
        <Run
          onTermClick={onTermClick}
          onTermEnter={hoverable ? show : () => {}}
          onTermLeave={hoverable ? hide : () => {}}
        />
        <Run
          onTermClick={onTermClick}
          onTermEnter={hoverable ? show : () => {}}
          onTermLeave={hoverable ? hide : () => {}}
        />
      </div>
    </div>
  );
}
