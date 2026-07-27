// One copy control for the whole site.
//
// Four pages copy something to the clipboard (a share card, a permalink, a
// result) and each had invented its own confirmation: a text swap here, a toast
// there, a tick prefixed to the label somewhere else. This is the single
// answer. The button holds its own confirmed state for a moment, swapping the
// icon and the label in place, so the feedback lands on the control the visitor
// just pressed rather than somewhere else on the page.
//
// The motion is deliberately small: the mark springs in, the label crossfades.
// The reference interaction animated every letter of the label individually,
// which reads as a product demo rather than as confirmation, so it is not here.
// Under reduced motion the swap is instant and nothing moves.

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyText } from '../utils/clipboard';
import { prefersReducedMotion } from '../utils/media';
import Icon from './Icons';

const SPRING = { type: 'spring', stiffness: 420, damping: 28, mass: 0.7 };

export default function CopyButton({
  text,
  onCopy,
  label,
  doneLabel = 'Copied',
  className = '',
  iconSize = 18,
  children,
  ...rest
}) {
  const [done, setDone] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const run = async () => {
    // `onCopy` owns the whole action where a page needs to build the text,
    // record a result or show a toast as well; it reports failure by returning
    // false. Otherwise we just copy `text`.
    const ok = onCopy ? (await onCopy()) !== false : await copyText(text);
    if (!ok) return;
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1900);
  };

  const still = prefersReducedMotion();
  const key = done ? 'done' : 'idle';
  const shown = done ? doneLabel : label;

  return (
    <button
      type="button"
      // Pages pass the button class they already use, so the control matches
      // its neighbours; a bare use falls back to the shared skin.
      className={'copybtn' + (className ? ' ' + className : ' copybtn-skin') + (done ? ' is-done' : '')}
      onClick={run}
      {...rest}
    >
      <span className="copybtn-mark" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={key}
            initial={still ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={still ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            transition={still ? { duration: 0 } : SPRING}
            className="copybtn-mark-in"
          >
            <Icon name={done ? 'check' : 'copy'} size={iconSize} />
          </motion.span>
        </AnimatePresence>
      </span>

      {/* The label is swapped visually, but the accessible name has to stay
          stable or a screen reader loses the button mid-interaction. The
          confirmation is announced separately by the live region below. */}
      <span className="copybtn-label" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={key}
            initial={still ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={still ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={still ? { duration: 0 } : { duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
          >
            {shown}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{label}</span>
      <span className="sr-only" role="status">{done ? doneLabel : ''}</span>
      {children}
    </button>
  );
}
