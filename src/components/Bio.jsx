import { motion } from 'framer-motion';
import { BIO_PARAS, OUTCOMES } from '../data/content';
import SplitText from './SplitText';
import Pipeline from './Pipeline';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.55, ease: [0.25, 1, 0.5, 1] } }),
};

export default function Bio() {
  return (
    <section id="bio">
      <div className="canvas matrix bio-matrix">
        <div className="bio-head">
          <div className="sec-tag" data-idx="00 / ">Profile</div>
        </div>
        <div className="bio-body">
          {BIO_PARAS.map((p, i) => (
            <p className="bio-text" key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="canvas">
        <div className="outcomes" aria-label="Selected outcomes">
          <div className="outcomes-head">Selected outcomes</div>
          <div className="outcomes-grid">
            {OUTCOMES.map((o, i) => (
              <motion.div
                className="outcome" key={i} style={{ '--oc': o.color }}
                custom={i} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              >
                <div className="outcome-num">{o.num}<small>{o.small}</small></div>
                <div className="outcome-what">{o.what}</div>
                <div className="outcome-where">{o.where}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pipe-head">
          <h2 className="pipe-title"><SplitText text="How the work fits together" /></h2>
          <p className="pipe-sub">Five stages, end-to-end: raw data to board narrative. <strong>Click each stage to see delivered examples.</strong></p>
        </div>
        <Pipeline />
      </div>
    </section>
  );
}
