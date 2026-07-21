import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useVelocity, useSpring, useMotionValue, animate } from 'framer-motion';
import { HERO } from '../data/content';
import SplitText from './SplitText';
import ContourField from './ContourField';
import Aurora from './Aurora';
import Icon from './Icons';

// Live "years" from a start date, matching the original calc.
function yearsSince(startISO) {
  const start = new Date(startISO);
  return Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24 * 365.25));
}

function Counter({ target, suffix }) {
  const ref = useRef(null);
  const mv = useMotionValue(0);
  useEffect(() => {
    const controls = animate(mv, target, {
      duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; },
    });
    return controls.stop;
  }, [target, suffix, mv]);
  return <span ref={ref}>0{suffix}</span>;
}

function RoleCycle({ roles }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % roles.length), 3200);
    return () => clearInterval(id);
  }, [roles.length]);
  return (
    // The cycling text is decorative motion: announcing a new job title every
    // 3.2s would spam assistive tech, so the animated span is hidden from it
    // and a single static label carries the role list instead.
    <span className="role-cycle" style={{ overflow: 'hidden' }}>
      <span className="sr-only">{roles.join(', ')}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={idx}
          aria-hidden="true"
          initial={{ y: '60%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-60%', opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
          style={{ display: 'inline-block' }}
        >
          {roles[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  // Velocity-driven parallax: base depth from scroll position, nudged by speed.
  const scrollVelocity = useVelocity(scrollY);
  const smoothVel = useSpring(scrollVelocity, { stiffness: 200, damping: 40 });
  const baseY = useTransform(scrollY, [0, 600], [0, 80]);
  const velY = useTransform(smoothVel, [-1500, 0, 1500], [-24, 0, 24]);
  const lowerY = useTransform(scrollY, [0, 600], [0, 140]);

  return (
    <section id="about" ref={sectionRef}>
      <div className="bloom-wrap" aria-hidden="true">
        <div className="bloom bloom-a" /><div className="bloom bloom-b" /><div className="bloom bloom-c" />
      </div>
      <Aurora
        colorStops={['#635BFF', '#B5C42B', '#FF9500', '#FF3B60']}
        amplitude={0.9}
        blend={0.65}
        opacity={0.5}
      />
      <ContourField />

      <motion.div className="canvas matrix hero-grid" style={{ y: baseY }}>
        <motion.h1 className="hero-name display" style={{ y: velY }}>
          <SplitText text={HERO.name[0]} />{' '}
          <span className="hero-accent-word"><SplitText text={HERO.name[1]} accentIndex={0} /></span>
        </motion.h1>
        <div className="hero-side">
          <RoleCycle roles={HERO.roles} />
          <div className="hero-meta">
            <a href={HERO.linkedin} target="_blank" rel="noopener noreferrer">{HERO.linkedinLabel}</a>
            <span><Icon name="pin" size={13} className="fpi-lead" />{HERO.location}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="canvas matrix hero-lower"
        style={{ y: lowerY }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
      >
        <p className="hero-prop">{HERO.prop}</p>
        <div className="hero-cta">
          {HERO.ctas.map((c) => (
            <a key={c.href} className={'btn ' + (c.primary ? 'btn-primary' : 'btn-secondary')} href={c.href}>{c.label}</a>
          ))}
        </div>
        <div className="instr-stack">
          {HERO.instruments.map((it) => (
            <div className="instr" key={it.id}>
              <div className="instr-lbl">{it.label[0]}<br />{it.label[1]}</div>
              <div className="instr-val"><Counter target={yearsSince(it.start)} suffix={it.suffix} /></div>
            </div>
          ))}
        </div>
        <div className="scroll-hint" aria-hidden="true" style={{ gridColumn: '1 / -1' }}>
          <span className="scroll-hint-line" />Scroll to explore
        </div>
      </motion.div>
    </section>
  );
}
