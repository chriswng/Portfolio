import { useState } from 'react';
import { motion } from 'framer-motion';
import CarbonField, { EmblemDots } from './CarbonField';
import { MomentShare } from './moments';
import { fmtT } from '../data/copy';
import { CHARACTER_ST, SHARE_ST, fill } from '../data/storyCopy';
import {
  CHARACTERS, BADGE, WEIGHT_ROWS, TEMPERAMENT_COLS,
  GLOBAL_T, HEAVY_T, SPECIALIST_SHARE, SPIKE_MULTIPLE,
} from '../data/characters';
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

// The three meters cap their tracks so the fill always reads: weight tops
// out at 24 t, rhythm at a 4x spike. Both caps are display-only.
const WEIGHT_CAP = 24;
const SPIKE_CAP = 4;

// One measured axis: label and gloss, a track that fills to the reading
// with the thresholds ticked on it, and the level the reading landed on.
function AxisMeter({ axisKey, level, frac, reading, ticks, accent, i }) {
  const axis = CHARACTER_ST.axes[axisKey];
  return (
    <motion.div className="st-axis" variants={rise} custom={i}>
      <div className="st-axis-head">
        <span className="st-axis-label">{axis.label}</span>
        <span className="st-axis-gloss">{axis.gloss}</span>
      </div>
      <div className="st-axis-track" aria-hidden="true">
        {ticks.map((t) => (
          <span className="st-axis-tick" key={t.at} style={{ left: `${t.at * 100}%` }}>
            <i /><em>{t.label}</em>
          </span>
        ))}
        {/* Width carries the measurement; scaleX carries the animation. */}
        <motion.span
          className="st-axis-fill"
          variants={{
            hidden: { scaleX: 0 },
            visible: {
              scaleX: 1,
              transition: { duration: 0.9, delay: 0.35 + i * 0.14, ease: [0.25, 1, 0.5, 1] },
            },
          }}
          style={{ background: accent, width: `${Math.max(2.5, frac * 100)}%`, transformOrigin: 'left' }}
        />
      </div>
      <div className="st-axis-out">
        <span className="st-axis-level" style={{ color: accent }}>{axis.levels[level]}</span>
        <span className="st-axis-reading">{reading}</span>
      </div>
    </motion.div>
  );
}

function LinkedInShare({ d, voice, character, verdict }) {
  const [state, setState] = useState('idle');
  const click = async () => {
    if (state === 'busy') return;
    setState('busy');
    try {
      const ok = await shareLinkedIn({
        title: SHARE_ST.cards.character[voice],
        fy: d.fy,
        name: character.name,
        tagline: character.tagline,
        stencil: character.stencil,
        hex: lighten(character.hex, 0.2),
        total: fmtT(d.total),
        mix: verdict,
        badge: character.badge,
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

// The character reveal, Wrapped-style: the three meters that decide the
// classification fill first, then the audit's particles pull into the emblem
// of the cell they landed on. The full 3 x 4 taxonomy sits below with the
// visitor's cell lit, because a grid you can locate yourself in is half
// the fun.
export default function CharacterMoment({ d, voice, character }) {
  const accent = lighten(character.hex, 0.25);
  const ax = character.axes;

  const meters = [
    {
      axisKey: 'weight', level: ax.weight.level,
      frac: Math.min(1, ax.weight.total / WEIGHT_CAP),
      reading: fill(CHARACTER_ST.axes.weight.reading, { t: fmtT(ax.weight.total) }),
      ticks: [
        { at: GLOBAL_T / WEIGHT_CAP, label: CHARACTER_ST.axes.weight.ticks[0].label },
        { at: HEAVY_T / WEIGHT_CAP, label: CHARACTER_ST.axes.weight.ticks[1].label },
      ],
    },
    {
      axisKey: 'shape', level: ax.shape.level,
      frac: Math.min(1, ax.shape.topShare),
      reading: fill(CHARACTER_ST.axes.shape.reading, { share: Math.round(ax.shape.topShare * 100) }),
      ticks: [{ at: SPECIALIST_SHARE, label: CHARACTER_ST.axes.shape.tickLabel }],
    },
    {
      axisKey: 'rhythm', level: ax.rhythm.level,
      frac: Math.min(1, ax.rhythm.spikeX / SPIKE_CAP),
      reading: fill(CHARACTER_ST.axes.rhythm.reading, { x: ax.rhythm.spikeX.toFixed(1) }),
      ticks: [{ at: SPIKE_MULTIPLE / SPIKE_CAP, label: CHARACTER_ST.axes.rhythm.tickLabel }],
    },
  ];
  const verdict = meters.map((m) => CHARACTER_ST.axes[m.axisKey].levels[m.level]).join(' · ');
  const metersAria = fill(CHARACTER_ST.metersAria, {
    weight: CHARACTER_ST.axes.weight.levels[ax.weight.level],
    shape: CHARACTER_ST.axes.shape.levels[ax.shape.level],
    rhythm: CHARACTER_ST.axes.rhythm.levels[ax.rhythm.level],
  });

  return (
    <section className="st-moment st-character" id="st-character" aria-label="Your carbon character">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{CHARACTER_ST.tag}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{CHARACTER_ST.headline}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{CHARACTER_ST.sub[voice]}</motion.p>

        <div className="st-axes" role="img" aria-label={metersAria}>
          {meters.map((m, i) => (
            <AxisMeter key={m.axisKey} {...m} accent={accent} i={3 + i} />
          ))}
        </div>

        <motion.div className="st-char-stage" variants={rise} custom={6}>
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
            <div className="st-char-verdict" style={{ color: accent }}>{verdict}</div>
            <p className="st-char-line">{character.line} {character.flavour}</p>
            {d.largest && (
              <p className="st-char-stat">
                {fill(CHARACTER_ST.topEntry, { label: d.largest.label, t: fmtT(d.largest.t) })} · {d.fy}
              </p>
            )}
            <p className="st-char-hint">{character.hint}</p>
            {character.badge && (
              <div className="st-char-badge">
                <EmblemDots stencil={BADGE.stencil} hex={lighten(BADGE.hex, 0.3)} size={34} />
                <span>
                  <em>{CHARACTER_ST.badge.kicker}</em> <strong>{BADGE.name}.</strong> {CHARACTER_ST.badge.note}
                </span>
              </div>
            )}
            <div className="st-share-row">
              <LinkedInShare d={d} voice={voice} character={character} verdict={verdict} />
              <MomentShare kind="character" fy={d.fy} data={{
                title: SHARE_ST.cards.character[voice],
                name: character.name,
                tagline: character.tagline,
                stencil: character.stencil,
                hex: lighten(character.hex, 0.2),
                total: fmtT(d.total),
                badge: character.badge,
                axes: meters.map((m) => ({
                  label: CHARACTER_ST.axes[m.axisKey].label,
                  level: CHARACTER_ST.axes[m.axisKey].levels[m.level],
                  frac: m.frac,
                })),
              }} />
            </div>
          </div>
        </motion.div>

        <motion.div className="st-char-others" variants={rise} custom={7}>
          <div className="st-kicker">{CHARACTER_ST.matrixTitle}</div>
          <div className="st-matrix-scroll">
            <div
              className="st-matrix"
              role="group"
              aria-label={fill(CHARACTER_ST.matrixAria, { name: character.name })}
            >
              <span className="st-matrix-corner" aria-hidden="true" />
              {CHARACTER_ST.matrixCols.map((col, i) => (
                <span className="st-matrix-col" key={i}>
                  {col[0]}<br />{col[1]}
                </span>
              ))}
              {WEIGHT_ROWS.map((w) => [
                <span className="st-matrix-rowlab" key={w}>{CHARACTER_ST.matrixRows[w]}</span>,
                ...TEMPERAMENT_COLS.map((t) => {
                  const c = CHARACTERS.find(
                    (x) => x.weight === w && x.shape === t.shape && x.rhythm === t.rhythm,
                  );
                  const you = c.id === character.id;
                  return (
                    <span className={'st-char-cell' + (you ? ' you' : '')} key={c.id}>
                      <EmblemDots stencil={c.stencil} hex={you ? accent : lighten(c.hex, 0.2)} size={40} />
                      <span className="st-char-cell-name">{c.name}</span>
                      {you && <span className="st-char-you">{CHARACTER_ST.yoursFlag}</span>}
                    </span>
                  );
                }),
              ])}
            </div>
          </div>
          <p className="st-caveat">{CHARACTER_ST.othersNote}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
