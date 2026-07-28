import { motion } from 'framer-motion';
import { TOOLS, TOOLS_INTRO } from '../data/content';
import Icon from './Icons';
import SplitText from './SplitText';

// The one dark band on the home page. It sits between the scenario model and
// the track record on purpose: a hiring manager meets the evidence of built
// work immediately after the live model and immediately before the CV.
// Each card is a single anchor so the whole tile is one tab stop.
const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    // Stagger by column pair rather than by index, so a two-column row lands
    // together instead of stepping across the page.
    transition: { delay: (i % 2) * 0.07 + Math.floor(i / 2) * 0.05, duration: 0.55, ease: [0.25, 1, 0.5, 1] },
  }),
};

export default function Tools() {
  return (
    <section id="tools">
      <div className="canvas">
        <div className="sec-tag" data-idx={TOOLS_INTRO.idx}><Icon name="spark" size={30} />{TOOLS_INTRO.tag}</div>

        <div className="tools-head">
          <h2 className="display tools-headline">
            <SplitText text={TOOLS_INTRO.title[0]} />{' '}
            <SplitText text={TOOLS_INTRO.title[1]} accentIndex={1} />
          </h2>
          <div className="tools-lead">
            {TOOLS_INTRO.paras.map((p, i) => (
              <p className="tools-lead-p" key={i}>{p}</p>
            ))}
          </div>
        </div>

        <ul className="tools-rules">
          {TOOLS_INTRO.rules.map((r) => (
            <li className="tools-rule" key={r.head}>
              <div className="tools-rule-head"><Icon name={r.icon} size={28} className="fpi-lead" />{r.head}</div>
              <p className="tools-rule-body">{r.body}</p>
            </li>
          ))}
        </ul>

        <div className="tools-grid">
          {TOOLS.map((t, i) => (
            <motion.a
              className="tool-card" key={t.href} href={t.href}
              style={{ '--tc': t.color }}
              custom={i} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            >
              <span className="tool-rule" aria-hidden="true" />
              <div className="tool-top">
                <span className="tool-n">{t.n}</span>
                <Icon name={t.icon} size={34} className="tool-icon" />
                <span className="tool-arrow" aria-hidden="true">↗</span>
              </div>
              <h3 className="tool-name">{t.name}</h3>
              <p className="tool-what">{t.what}</p>
              <p className="tool-proves"><span className="tool-proves-lbl">Shows</span>{t.proves}</p>
              <ul className="tool-tags">
                {t.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <div className="tool-scope">{t.scope}</div>
            </motion.a>
          ))}
        </div>

        <p className="tools-note">{TOOLS_INTRO.note}</p>
      </div>
    </section>
  );
}
