import { useState } from 'react';
import { motion } from 'framer-motion';
import CarbonField, { EmblemDots } from './CarbonField';
import { MomentShare } from './moments';
import { fmtT } from '../data/copy';
import { CHARACTER_ST, SHARE_ST, fill } from '../data/storyCopy';
import { CHARACTERS } from '../data/characters';
import { shareLinkedIn } from '../lib/shareCard';
import { lighten } from '../lib/emblem';

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] },
  }),
};
const inView = { once: true, margin: '-18% 0px' };

function LinkedInShare({ d, voice, character }) {
  const [state, setState] = useState('idle');
  const click = async () => {
    if (state === 'busy') return;
    setState('busy');
    const mix = d.ranked.slice(0, 3).map((c) => c.pct + '% ' + c.label.toLowerCase()).join(' · ');
    try {
      const ok = await shareLinkedIn({
        title: SHARE_ST.cards.character[voice],
        fy: d.fy,
        name: character.name,
        tagline: character.tagline,
        stencil: character.stencil,
        hex: lighten(character.hex, 0.2),
        total: fmtT(d.total),
        mix,
      }, 'life-footprint-linkedin-' + character.id + '.png');
      setState(ok ? 'done' : 'idle');
    } catch { setState('idle'); return; }
    window.setTimeout(() => setState('idle'), 2600);
  };
  return (
    <>
      <button type="button" className="st-share" onClick={click}>
        <span aria-hidden="true">⤓</span> {state === 'done' ? SHARE_ST.copied : SHARE_ST.linkedin}
      </button>
      <span className="sr-only" role="status">{state === 'done' ? SHARE_ST.copied : ''}</span>
    </>
  );
}

// The character reveal: the audit's particles pull into the emblem of the
// profile the classification rules assign. The other eleven line up below,
// because a taxonomy you can see yourself inside is half the fun.
export default function CharacterMoment({ d, voice, character }) {
  const accent = lighten(character.hex, 0.25);

  return (
    <section className="st-moment st-character" id="st-character" aria-label="Your carbon character">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{CHARACTER_ST.tag}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{CHARACTER_ST.headline}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{CHARACTER_ST.sub[voice]}</motion.p>

        <motion.div className="st-char-stage" variants={rise} custom={3}>
          <div className="st-char-field">
            <CarbonField
              mode="emblem"
              total={d.total}
              stencil={character.stencil}
              hex={character.hex}
              className="st-field"
              fallback={<EmblemDots stencil={character.stencil} hex={accent} size={230} className="st-char-static" />}
            />
          </div>
          <div className="st-char-copy">
            <div className="st-kicker">{CHARACTER_ST.kicker[voice]}</div>
            <div className="st-char-name display" style={{ color: accent }}>{character.name}</div>
            <div className="st-char-tagline">{character.tagline}</div>
            <p className="st-char-line">{character.line}</p>
            <p className="st-char-stat">
              {fill(CHARACTER_ST.topLine, { share: character.topShare })} · {fmtT(d.total)} t · {d.fy}
            </p>
            <p className="st-char-hint">{character.hint}</p>
            <div className="st-share-row">
              <LinkedInShare d={d} voice={voice} character={character} />
              <MomentShare kind="character" fy={d.fy} data={{
                title: SHARE_ST.cards.character[voice],
                name: character.name,
                tagline: character.tagline,
                stencil: character.stencil,
                hex: lighten(character.hex, 0.2),
                total: fmtT(d.total),
                line: character.line,
              }} />
            </div>
          </div>
        </motion.div>

        <motion.div className="st-char-others" variants={rise} custom={4}>
          <div className="st-kicker">{CHARACTER_ST.othersTitle}</div>
          <ul className="st-char-grid">
            {CHARACTERS.map((c) => (
              <li key={c.id} className={'st-char-cell' + (c.id === character.id ? ' you' : '')}>
                <EmblemDots stencil={c.stencil} hex={c.id === character.id ? accent : lighten(c.hex, 0.2)} size={44} />
                <span className="st-char-cell-name">{c.name}</span>
                {c.id === character.id && <span className="st-char-you">{CHARACTER_ST.yoursFlag}</span>}
              </li>
            ))}
          </ul>
          <p className="st-caveat">{CHARACTER_ST.othersNote}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
