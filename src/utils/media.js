// Shared media-query helpers. Guarded so callers don't repeat the
// `typeof window` / `matchMedia` boilerplate, and so a missing matchMedia
// (older or server environments) degrades to "no preference" rather than
// throwing.
const matches = (q) =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(q).matches;

// User has asked the OS to minimise non-essential motion.
export const prefersReducedMotion = () => matches('(prefers-reduced-motion:reduce)');

// A precise pointer that can hover — i.e. a mouse/trackpad, not touch.
// Interactions that only make sense with a cursor (magnetic pull, hover
// tooltips) gate on this.
export const canHover = () => matches('(hover:hover) and (pointer:fine)');
