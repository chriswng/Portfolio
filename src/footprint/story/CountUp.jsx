import { useEffect, useRef } from 'react';
import { animate, useInView, useMotionValueEvent } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/media';
import { audio } from '../lib/audio';

const fmt = (v, decimals) =>
  v.toLocaleString('en-AU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// A number that counts up when it enters the viewport, and morphs in place on
// later value changes (mode switches) instead of restarting from zero. Writes
// straight to textContent (no re-render per frame), rises through the
// pentatonic ticks when sound is on, and renders the final value immediately
// under reduced motion. Assistive tech reads a visually-hidden copy of the
// finished value; the animated digits are hidden from it.
export function CountUp({ value, decimals = 1, duration = 0.9, delay = 0, className, ticks = true }) {
  const ref = useRef(null);
  const shown = useRef(0);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!inView) { el.textContent = fmt(shown.current, decimals); return undefined; }
    if (prefersReducedMotion()) {
      shown.current = value;
      el.textContent = fmt(value, decimals);
      return undefined;
    }
    const from = shown.current;
    const controls = animate(from, value, {
      duration: from === 0 ? duration : 0.45,
      delay: from === 0 ? delay : 0,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        shown.current = v;
        el.textContent = fmt(v, decimals);
        if (ticks && value > 0) audio.tick(v / value);
      },
      onComplete: () => { shown.current = value; el.textContent = fmt(value, decimals); },
    });
    return () => controls.stop();
  }, [inView, value, decimals, duration, delay, ticks]);

  return (
    <span className={className}>
      <span className="sr-only">{fmt(value, decimals)}</span>
      <span ref={ref} aria-hidden="true">{fmt(prefersReducedMotion() ? value : 0, decimals)}</span>
    </span>
  );
}

// A number driven by a scroll-progress MotionValue (0..1): the total reveal
// scrubs with the visitor's own momentum rather than a timer.
export function ScrubNumber({ progress, value, decimals = 1, className }) {
  const ref = useRef(null);
  const reduced = prefersReducedMotion();

  useMotionValueEvent(progress, 'change', (p) => {
    const el = ref.current;
    if (!el || reduced) return;
    const clamped = Math.min(1, Math.max(0, p));
    el.textContent = fmt(clamped * value, decimals);
    if (clamped > 0 && clamped < 1) audio.tick(clamped);
  });

  return (
    <span className={className}>
      <span className="sr-only">{fmt(value, decimals)}</span>
      <span ref={ref} aria-hidden="true">{fmt(reduced ? value : 0, decimals)}</span>
    </span>
  );
}
