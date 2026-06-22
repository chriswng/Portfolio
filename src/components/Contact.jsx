import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CONTACT } from '../data/content';
import { useMagnetic } from '../hooks/useMagnetic';

// Terminal contact line that types itself on first view.
function TermLine({ full }) {
  const [text, setText] = useState(full);
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    let started = false;
    const node = ref.current;
    const io = new IntersectionObserver((es, o) => {
      es.forEach((e) => {
        if (!e.isIntersecting || started) return;
        started = true; o.disconnect();
        setText('');
        let i = 0;
        const type = () => { i += 1; setText(full.slice(0, i)); if (i < full.length) setTimeout(type, 28); };
        type();
      });
    }, { threshold: 0.6 });
    if (node) io.observe(node);
    return () => io.disconnect();
  }, [full]);
  return (
    <div className="contact-avail term-line" ref={ref}>
      <span className="term-prompt">&gt;&nbsp;</span>
      <span className="term-text">{text}</span>
      <span className="term-caret" aria-hidden="true" />
    </div>
  );
}

function MagneticButton({ href, children }) {
  const { ref, x, y } = useMagnetic({ threshold: 50, strength: 0.4 });
  return (
    <motion.a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ x, y }}>
      {children}
    </motion.a>
  );
}

export default function Contact() {
  return (
    <section id="contact">
      <div className="canvas">
        <div className="contact-bgword" aria-hidden="true">CONTACT</div>
        <div className="sec-tag" data-idx="04 / " style={{ marginBottom: '1.5rem' }}>Contact</div>
        <TermLine full={CONTACT.line} />
        <div className="contact-loc">{CONTACT.loc}</div>
        <div className="btns">
          <MagneticButton href={CONTACT.linkedin}>LinkedIn</MagneticButton>
        </div>
      </div>
    </section>
  );
}
