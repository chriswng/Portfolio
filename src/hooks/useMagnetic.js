import { useRef, useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { canHover } from '../utils/media';

// Magnetic interaction: when the cursor enters a threshold around the element,
// the element is pulled toward the cursor with spring physics. Returns a ref to
// attach and the x/y motion values to bind to `style`.
export function useMagnetic({ threshold = 50, strength = 0.4 } = {}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fine-pointer only — magnetic pull is meaningless on touch.
    if (!canHover()) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) / 2 + threshold;
      if (dist < reach) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const reset = () => { x.set(0); y.set(0); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', reset);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', reset);
    };
  }, [threshold, strength, x, y]);

  return { ref, x: sx, y: sy };
}
