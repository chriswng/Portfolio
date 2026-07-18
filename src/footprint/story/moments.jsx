import { useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { canHover, prefersReducedMotion } from '../../utils/media';
import SplitText from '../../components/SplitText';
import CarbonField from './CarbonField';
import { CountUp, ScrubNumber } from './CountUp';
import { fmtT } from '../data/copy';
import ShareSheet from './ShareSheet';
import {
  CHROME, COVER, YEAR, GUESS, GUESS_VERDICTS, GUESS_RESULT, TOTAL, SCOPES, HOTSPOTS_ST,
  MONTHS_ST, BENCH_ST, NEEDLE, OUTRO, SHARE_ST, fill,
} from '../data/storyCopy';

// Standard whileInView reveal used by the calm moments.
const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] },
  }),
};
const inView = { once: true, margin: '-18% 0px' };

// ---------------------------------------------------------------------------
// Per-moment share affordance: opens the share sheet, which previews the card
// and offers Instagram story, post, or (for the character) LinkedIn. Pass
// `linkedIn` to add the LinkedIn banner as a format.
// ---------------------------------------------------------------------------
export function MomentShare({ kind, data, fy, linkedIn }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="st-share" onClick={() => setOpen(true)}>
        <span aria-hidden="true">↗</span> {SHARE_ST.button}
      </button>
      {open && (
        <ShareSheet kind={kind} data={{ ...data, fy }} linkedIn={linkedIn} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// 0 · Cover
// ---------------------------------------------------------------------------
export function Cover({ d, voice, onStart, onAssessor, reduced, chapterCount }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const ghostY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '34%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  // Cursor parallax: the ghost layer and the headline sit on different planes.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const ghostX = useSpring(useTransform(mx, [-1, 1], [26, -26]), { stiffness: 60, damping: 18 });
  const ghostYc = useSpring(useTransform(my, [-1, 1], [18, -18]), { stiffness: 60, damping: 18 });
  const innerX = useSpring(useTransform(mx, [-1, 1], [-7, 7]), { stiffness: 60, damping: 18 });
  const onMove = (e) => {
    if (reduced || !canHover()) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  // The cover is deliberately unlike the site's home hero: a dark title card
  // with the audited year already alive as a field of particles behind the
  // words, so a first-time visitor reads "this is a walk-through", not another
  // landing page. The swarm is a teaser, not a spoiler; the number stays for
  // the reveal three chapters down.
  return (
    <section className="st-moment st-cover" id="st-cover" ref={ref} aria-label="Opening" onPointerMove={onMove}>
      <CarbonField
        mode="swarm"
        total={d.total}
        categories={d.ranked.map((c) => ({ id: c.id, hex: c.hex, share: c.t }))}
        alpha={0.55}
        className="st-field st-cover-field"
      />
      <motion.div className="st-ghost st-ghost-cover" style={{ y: ghostY }} aria-hidden="true">
        <motion.span style={{ x: ghostX, y: ghostYc, display: 'inline-block' }}>CO₂</motion.span>
      </motion.div>
      <motion.div className="st-cover-inner" style={reduced ? undefined : { opacity: fade, x: innerX }}>
        <div className="st-cover-eyebrow">
          <span className="st-cover-eyebrow-dot" aria-hidden="true" />{COVER.eyebrow}
        </div>
        <div className="sec-tag" data-idx={d.fy + ' / '}>{COVER.tag}</div>
        <h1 className="st-h1 display">
          <SplitText text={COVER.h1a} /> <SplitText text={COVER.h1b} accentIndex={1} />
        </h1>
        <p className="st-cover-sub">{COVER.sub[voice]}</p>
        <p className="st-cover-meta">{fill(COVER.meta, { n: chapterCount })}</p>
        {voice === 'example' && (
          <div className="st-cover-cta">
            <button type="button" className="btn btn-primary fp-btn" onClick={onStart}>{COVER.start} →</button>
            <span className="st-cover-note">{COVER.startNote}</span>
          </div>
        )}
        {voice === 'example' && onAssessor && (
          <button type="button" className="st-assessor" onClick={onAssessor}>{COVER.assessor} ↓</button>
        )}
      </motion.div>
      <div className="st-cue" aria-hidden="true">
        <span>{COVER.scrollCue}</span>
        <span className="st-cue-line" />
      </div>
    </section>
  );
}

// A quiet, recurring "keep scrolling" mark for the pinned moments, where the
// animation only advances if you scroll. It fades out as the moment's scrub
// completes, and never shows under reduced motion (those moments are static).
export function ScrollHint({ progress, fadeEnd = 0.45, label = CHROME.keepScrolling, tone }) {
  const opacity = useTransform(progress, [0, fadeEnd * 0.35, fadeEnd], [0.9, 0.9, 0]);
  if (prefersReducedMotion()) return null;
  return (
    <motion.div className={'st-scrollhint' + (tone === 'dark' ? ' dark' : '')} style={{ opacity }} aria-hidden="true">
      <span>{label}</span>
      <span className="st-cue-line" />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 1 · The year: the log streams past.
// ---------------------------------------------------------------------------
export function YearTicker({ d, voice, reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rows = [[], [], []];
  d.tickerEntries.forEach((e, i) => rows[i % 3].push(e));
  const x0 = useTransform(scrollYProgress, [0, 1], ['4%', '-30%']);
  const x1 = useTransform(scrollYProgress, [0, 1], ['-30%', '4%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['2%', '-24%']);
  const xs = [x0, x1, x2];

  return (
    <section className="st-moment st-year" id="st-year" ref={ref} aria-label="The year in entries">
      <div className="st-sticky">
        <motion.div className="st-center" initial="hidden" whileInView="visible" viewport={inView}>
          <motion.div className="sec-tag" data-idx="" variants={rise}>{YEAR.tag}</motion.div>
          <motion.h2 className="st-h2 display" variants={rise} custom={1}>{YEAR.headline[voice]}</motion.h2>
          <motion.p className="st-line" variants={rise} custom={2}>
            <CountUp value={d.entryCount} decimals={0} duration={1.1} className="st-line-num" /> {YEAR.sub[voice]}
          </motion.p>
        </motion.div>
        <div className="st-ticker" role="img" aria-label={YEAR.tickerAria}>
          {rows.map((row, ri) => (
            <motion.div className="st-ticker-row" key={ri} style={reduced ? undefined : { x: xs[ri] }}>
              {row.map((e, i) => (
                <span className="st-tick-chip" key={i}>
                  <span className="fp-leg-dot" style={{ background: e.hex }} aria-hidden="true" />
                  {e.label} · <strong>{fmtT(e.t, 2)} t</strong>
                </span>
              ))}
            </motion.div>
          ))}
        </div>
        <ScrollHint progress={scrollYProgress} fadeEnd={0.5} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2 · The guess: the playable moment.
// ---------------------------------------------------------------------------
export function Guess({ d, voice, guess, setGuess, goTo }) {
  const slide = (v) => setGuess({ ...guess, value: v });
  const lock = () => {
    // Accepting the default without touching the slider still counts.
    setGuess({ value: guess.value ?? 10, locked: true });
    goTo('st-total');
  };
  const skip = () => {
    setGuess({ value: null, locked: false });
    goTo('st-total');
  };

  return (
    <section className="st-moment st-guess" id="st-guess" aria-label="Guess the total">
      <motion.div className="st-center" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{GUESS.tag}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{GUESS.headline[voice]}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{GUESS.sub[voice]}</motion.p>
        <motion.div className="st-guess-box" variants={rise} custom={3}>
          <div className="st-guess-num" aria-hidden="true">
            {(guess.value ?? 10).toFixed(1)}<span> {GUESS.unit}</span>
          </div>
          <input
            type="range" min="0.5" max="30" step="0.5"
            value={guess.value ?? 10}
            onChange={(e) => slide(Number(e.target.value))}
            aria-label={GUESS.sliderLabel}
            aria-valuetext={(guess.value ?? 10).toFixed(1) + ' tonnes'}
            className="st-slider"
          />
          <div className="st-guess-ctas">
            <button type="button" className="btn btn-primary fp-btn" onClick={lock}>{GUESS.lockIn} →</button>
            <button type="button" className="st-quiet" onClick={skip}>{GUESS.noIdea}</button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function guessVerdict(guessValue, total) {
  const diff = guessValue - total;
  const rel = Math.abs(diff) / Math.max(total, 0.001);
  const verdict = GUESS_VERDICTS.find((g) => rel <= g.within).text;
  const result = Math.abs(diff) < 0.05
    ? GUESS_RESULT.exact
    : fill(diff < 0 ? GUESS_RESULT.under : GUESS_RESULT.over, { d: fmtT(Math.abs(diff)) });
  return { verdict, result };
}

// ---------------------------------------------------------------------------
// 3 · The total: screen-filling number with parallax depth.
// ---------------------------------------------------------------------------
export function TotalReveal({ d, voice, guess, onGuessAgain, onCopyLink, reduced }) {
  const ref = useRef(null);
  // The carbon field behind the number: one particle per 10 kg. Hovering or
  // focusing a category chip gathers that category's particles.
  // Pinned (clicked) and hover/focus previews are separate states so a tap
  // pins, a second tap unpins, and mouse traversal only previews.
  const [pinnedCat, setPinnedCat] = useState(null);
  const [hoverCat, setHoverCat] = useState(null);
  const focusCat = pinnedCat ?? hoverCat;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, [0.02, 0.52], [0.42, 1]);
  const scale = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.6 });
  const countP = useTransform(scrollYProgress, [0.04, 0.48], [0, 1]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ['16%', '-16%']);
  const tailO = useTransform(scrollYProgress, [0.5, 0.66], [0, 1]);
  const tailY = useTransform(scrollYProgress, [0.5, 0.66], [26, 0]);
  const locked = guess.locked && guess.value != null;
  const v = locked ? guessVerdict(guess.value, d.total) : null;

  const body = (
    <>
      <div className="st-kicker">{TOTAL.kicker[voice]}</div>
      <motion.div className="st-total-num display" style={reduced ? undefined : { scale }}>
        <ScrubNumber progress={countP} value={d.total} decimals={1} />
        <span className="st-total-unit">{TOTAL.unit}</span>
      </motion.div>
      <motion.div className="st-total-tail" style={reduced ? undefined : { opacity: tailO, y: tailY }}>
        <p className="st-line">{TOTAL.line[voice]}</p>
        <div className="st-cat-chips" role="group" aria-label={TOTAL.chipsLabel}>
          {d.ranked.map((c) => (
            <button
              key={c.id}
              type="button"
              className={'st-cat-chip' + (focusCat === c.id ? ' on' : '')}
              aria-pressed={pinnedCat === c.id}
              onPointerEnter={() => { if (canHover()) setHoverCat(c.id); }}
              onPointerLeave={() => { if (canHover()) setHoverCat((f) => (f === c.id ? null : f)); }}
              onFocus={(e) => { if (e.target.matches(':focus-visible')) setHoverCat(c.id); }}
              onBlur={() => setHoverCat((f) => (f === c.id ? null : f))}
              onClick={() => setPinnedCat((f) => (f === c.id ? null : c.id))}
            >
              <span className="fp-leg-dot" style={{ background: c.hex }} aria-hidden="true" />
              {c.label} · {fmtT(c.t)} t
            </button>
          ))}
        </div>
        {locked && (
          <div className="st-verdict">
            <strong>{v.result}</strong> {v.verdict}
            <button type="button" className="st-quiet" onClick={onGuessAgain}>{GUESS_RESULT.playAgain}</button>
          </div>
        )}
        {/* Persistent live region: mounts with the moment, fills on reveal. */}
        <span className="sr-only" role="status">{locked ? v.result + ' ' + v.verdict : ''}</span>
        <div className="st-share-row">
          {locked ? (
            <MomentShare kind="guess" fy={d.fy} data={{
              title: SHARE_ST.cards.guess[voice],
              guess: fmtT(guess.value), actual: fmtT(d.total), verdict: v.verdict,
            }} />
          ) : (
            <MomentShare kind="total" fy={d.fy} data={{
              title: SHARE_ST.cards.total[voice],
              total: fmtT(d.total), cats: d.ranked.map((c) => ({ label: c.label, t: c.t })),
            }} />
          )}
          {onCopyLink && (
            <button type="button" className="st-quiet" onClick={onCopyLink}>{SHARE_ST.copyLink}</button>
          )}
        </div>
      </motion.div>
    </>
  );

  return (
    <section className={'st-moment st-total' + (reduced ? ' st-static' : '')} id="st-total" ref={ref} aria-label="The total">
      <div className="st-sticky">
        <motion.div className="st-ghost st-ghost-unit" style={reduced ? undefined : { y: ghostY }} aria-hidden="true">tCO₂e</motion.div>
        <CarbonField
          mode="swarm"
          total={d.total}
          categories={d.ranked.map((c) => ({ id: c.id, hex: c.hex, share: c.t }))}
          focus={focusCat}
          className="st-field"
        />
        <div className="st-center st-total-center">{body}</div>
        <ScrollHint progress={scrollYProgress} fadeEnd={0.5} tone="dark" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4 · Scopes
// ---------------------------------------------------------------------------
// Light-to-dark matcha steps for the stacked scope bar (light scene).
const SCOPE_STEPS = ['#DCE3A8', '#B5C42B', '#75821D'];

export function Scopes({ d, voice }) {
  const total = Math.max(d.total, 0.001);
  const s3pct = Math.round((d.byScope['3'] / total) * 100);
  return (
    <section className="st-moment st-scopes" id="st-scopes" aria-label="The three scopes">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{SCOPES.tag}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{SCOPES.headline}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={1.5}>{SCOPES.gloss[voice]}</motion.p>
        <div className="st-scope-rows">
          {SCOPES.items.map((s, i) => (
            <motion.div className="st-scope-row" key={s.n} variants={rise} custom={2 + i}>
              <span className="st-scope-n" aria-hidden="true">{s.n}</span>
              <div>
                <div className="st-scope-name">{s.name}</div>
                <div className="st-scope-plain">{s.plain[voice]}</div>
                <div className="st-scope-val">
                  <CountUp value={d.byScope[s.n] || 0} decimals={2} duration={1.2} delay={i * 0.15} /> t
                </div>
                <p className="st-scope-line">{s.line[voice]}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div className="st-scope-bar" variants={rise} custom={5} role="img"
          aria-label={`Scope 1 ${fmtT(d.byScope['1'], 2)} tonnes, scope 2 ${fmtT(d.byScope['2'], 2)} tonnes, scope 3 ${fmtT(d.byScope['3'], 2)} tonnes.`}>
          {['1', '2', '3'].map((n, i) => (
            <span key={n} style={{ width: `${Math.max(1, ((d.byScope[n] || 0) / total) * 100)}%`, background: SCOPE_STEPS[i] }} />
          ))}
        </motion.div>
        <motion.p className="st-punch" variants={rise} custom={6}>
          <CountUp value={s3pct} decimals={0} duration={1.3} className="st-punch-num" /><span className="st-punch-pct">%</span> {SCOPES.punch[voice]}
        </motion.p>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5 · Hotspots: title card, then the ranked bars build.
// ---------------------------------------------------------------------------
export function Hotspots({ d, voice, reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const top = d.ranked[0];
  const titleO = useTransform(scrollYProgress, [0, 0.08, 0.3, 0.4], [0, 1, 1, 0]);
  const titleS = useTransform(scrollYProgress, [0, 0.3], [0.92, 1.06]);
  const numP = useTransform(scrollYProgress, [0.34, 0.52], [0, 1]);
  const restO = useTransform(scrollYProgress, [0.34, 0.46], [0, 1]);
  const barsP = useTransform(scrollYProgress, [0.5, 0.85], [0, 1]);
  if (!top) return null;

  return (
    <section className={'st-moment st-hot' + (reduced ? ' st-static' : '')} id="st-hotspots" ref={ref} aria-label="Hotspots">
      <div className="st-sticky">
        <motion.div className="st-hot-title" style={reduced ? undefined : { opacity: titleO, scale: titleS }} aria-hidden="true">
          <div className="st-kicker">{HOTSPOTS_ST.rankWord} №1</div>
          <div className="st-hot-name display" style={{ color: top.hex }}>{top.label}</div>
          <p className="st-line">{top.quip}</p>
        </motion.div>
        <motion.div className="st-hot-detail" style={reduced ? undefined : { opacity: restO }}>
          <h2 className="st-h2 display">{HOTSPOTS_ST.headline[voice]}</h2>
          {/* The title card is visual-only (aria-hidden, removed under reduced
              motion), so the quip also lives here: visibly when the card is
              gone, sr-only otherwise. */}
          <p className={reduced ? 'st-line' : 'sr-only'}>{HOTSPOTS_ST.rankWord} 1: {top.label}. {top.quip}</p>
          <div className="st-hot-big">
            <span className="st-hot-num display" style={{ color: top.hex }}>
              <ScrubNumber progress={numP} value={top.t} decimals={1} />
            </span>
            <span className="st-hot-meta">t · {top.pct}% {HOTSPOTS_ST.ofYear}</span>
          </div>
          <div className="st-rank">
            {d.ranked.map((c, i) => (
              <StoryBar key={c.id} c={c} i={i} max={top.t} progress={barsP} reduced={reduced} />
            ))}
          </div>
          <p className="st-punch-sm">{HOTSPOTS_ST.punch[voice]}</p>
          <MomentShare kind="hotspot" fy={d.fy} data={{
            title: SHARE_ST.cards.hotspot[voice],
            rank: 1, label: top.label, t: fmtT(top.t), pct: top.pct, quip: top.quip,
          }} />
        </motion.div>
        <ScrollHint progress={scrollYProgress} fadeEnd={0.72} />
      </div>
    </section>
  );
}

function StoryBar({ c, i, max, progress, reduced }) {
  // Each bar grows over its own slice of the build phase.
  const lo = i * 0.09;
  const scaleX = useTransform(progress, [lo, lo + 0.35], [0, 1]);
  return (
    <div className="st-rank-row">
      <span className="st-rank-name"><span className="fp-leg-dot" style={{ background: c.hex }} aria-hidden="true" />{c.label}</span>
      <span className="st-rank-track" aria-hidden="true">
        <motion.span className="st-rank-fill" style={{ background: c.hex, scaleX: reduced ? 1 : scaleX, width: `${Math.max(2, (c.t / max) * 100)}%` }} />
      </span>
      <span className="st-rank-val">{fmtT(c.t)} t</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6 · Worst month
// ---------------------------------------------------------------------------
export function WorstMonth({ d, voice }) {
  if (!d.worst) return null;
  return (
    <section className="st-moment st-months" id="st-months" aria-label="The worst month">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{MONTHS_ST.tag}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{d.worst.name}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>
          <CountUp value={d.worst.total} decimals={1} className="st-line-num" /> t {MONTHS_ST.line[voice]}
        </motion.p>
        <motion.div className="st-months-chart" variants={rise} custom={3} role="img"
          aria-label={fill(MONTHS_ST.chartAria, { name: d.worst.name, t: fmtT(d.worst.total) })}>
          {d.monthly.map((m, i) => (
            <div className="st-month-col" key={m.key}>
              {m.worst && <span className="st-month-flag">{fmtT(m.total, 1)} t</span>}
              <motion.span
                className={'st-month-bar' + (m.worst ? ' worst' : '')}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={inView}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: [0.25, 1, 0.5, 1] }}
                style={{ height: `${Math.max(3, (m.total / d.worst.total) * 100)}%` }}
              />
              <span className="st-month-l" aria-hidden="true">{m.letter}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7 · Benchmarks
// ---------------------------------------------------------------------------
// A comparison as a big tile: under 100% reads as a percentage, over reads
// as a multiplier, so "57%" and "5.1×" both land at a glance.
const ratioLabel = (total, base) => {
  const r = total / base;
  return r < 1 ? Math.round(r * 100) + '%' : (Math.round(r * 10) / 10).toFixed(1) + '×';
};

export function Bench({ d, voice }) {
  const max = Math.max(...d.bench.map((b) => b.t));
  const tiles = [
    { key: 'aus', base: d.bench[1] },
    { key: 'global', base: d.bench[2] },
    { key: 'budget', base: d.bench[3] },
  ].filter((t) => t.base && t.base.t > 0);
  return (
    <section className="st-moment st-bench" id="st-bench" aria-label="Context and benchmarks">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{BENCH_ST.tag}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{BENCH_ST.headline[voice]}</motion.h2>
        <div className="st-bench-tiles">
          {tiles.map((t, i) => (
            <motion.div className="st-bench-tile" key={t.key} variants={rise} custom={1.5 + i * 0.5}>
              <span className="st-bench-tile-v display">{ratioLabel(d.total, t.base.t)}</span>
              <span className="st-bench-tile-l">
                {d.total / t.base.t < 1 ? BENCH_ST.tiles[t.key] : BENCH_ST.tiles[t.key].replace(/^of /, '')}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="st-bench-rows">
          {d.bench.map((b, i) => (
            <motion.div className="st-bench-row" key={b.label} variants={rise} custom={2 + i}>
              <span className="st-bench-name">{b.label}</span>
              <span className="st-bench-track" aria-hidden="true">
                <motion.span
                  className={'st-bench-fill' + (b.you ? ' you' : '')}
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: 0.7, delay: 0.25 + i * 0.12, ease: [0.25, 1, 0.5, 1] } },
                  }}
                  style={{ width: `${Math.max(1.5, (b.t / max) * 100)}%` }}
                />
              </span>
              <span className="st-bench-val"><CountUp value={b.t} decimals={1} delay={0.2 + i * 0.12} /> t</span>
            </motion.div>
          ))}
        </div>
        {d.overshoot && (
          <motion.div className="st-overshoot" variants={rise} custom={5.5}>
            <span className="st-overshoot-k">{BENCH_ST.overshoot.kicker}</span>
            <span className="st-overshoot-line">
              {d.overshoot.within
                ? BENCH_ST.overshoot.within
                : fill(BENCH_ST.overshoot.line[voice], { date: d.overshoot.date, day: d.overshoot.day })}
            </span>
          </motion.div>
        )}
        <motion.p className="st-punch-sm" variants={rise} custom={6}>{BENCH_ST.line[voice]}</motion.p>
        <motion.p className="st-caveat" variants={rise} custom={7}>{BENCH_ST.caveat}</motion.p>
        <motion.div variants={rise} custom={8}>
          <MomentShare kind="bench" fy={d.fy} data={{
            title: SHARE_ST.cards.bench[voice],
            rows: d.bench.map((b) => ({ label: b.label, t: b.t, dim: !b.you })),
          }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 8 · The needle
// ---------------------------------------------------------------------------
export function Needle({ d, voice, onPlan }) {
  if (!d.needle.length) return null;
  return (
    <section className="st-moment st-needle" id="st-needle" aria-label="What would move the needle">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{NEEDLE.tag}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{NEEDLE.headline}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{NEEDLE.sub[voice]}</motion.p>
        <div className="st-needle-cards">
          {d.needle.map((a, i) => (
            <motion.div className="st-needle-card" key={a.id} variants={rise} custom={3 + i} style={{ '--ac': a.hex }}>
              <div className="st-needle-t display">-<CountUp value={a.pct} decimals={0} delay={0.15 + i * 0.12} /><span className="st-needle-pct">%</span></div>
              <div className="st-needle-of">{NEEDLE.ofYear} · {fmtT(a.reduction)} {NEEDLE.perYear}</div>
              <div className="st-needle-name">{a.action}</div>
              <div className="st-needle-cost">
                {a.costPerTonne == null ? '' : a.costPerTonne <= 0
                  ? `${NEEDLE.saves} $${Math.abs(a.costPerTonne).toLocaleString()} ${NEEDLE.perTonne}`
                  : `${NEEDLE.costs} $${a.costPerTonne.toLocaleString()} ${NEEDLE.perTonne}`}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p className="st-punch" variants={rise} custom={7}>{NEEDLE.punch}</motion.p>
        <motion.div className="st-share-row" variants={rise} custom={8}>
          <button type="button" className="btn btn-secondary" onClick={onPlan}>{NEEDLE.cta} ↓</button>
          <MomentShare kind="needle" fy={d.fy} data={{
            title: SHARE_ST.cards.needle[voice],
            actions: d.needle.map((a) => ({
              action: a.action, pct: a.pct, t: fmtT(a.reduction),
              cost: a.costPerTonne == null ? '' : a.costPerTonne <= 0
                ? `${NEEDLE.saves} $${Math.abs(a.costPerTonne).toLocaleString()} / t`
                : `${NEEDLE.costs} $${a.costPerTonne.toLocaleString()} / t`,
            })),
          }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 9 · Outro. Deliberately short: the total was the show two moments ago and
// the working audit sits directly below, so the ending is an exit, not a
// recap.
// ---------------------------------------------------------------------------
export function Outro({ voice, onStart, onExplore, onReplay, endRef }) {
  return (
    <section className="st-moment st-outro" id="st-outro" aria-label="On to the audit">
      <div ref={endRef} className="st-end-sentinel" aria-hidden="true" />
      <motion.div className="st-center" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{OUTRO.tag}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{OUTRO.headline[voice]}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{OUTRO.sub[voice]}</motion.p>
        <motion.div className="st-share-row" variants={rise} custom={3}>
          <button type="button" className="btn btn-primary fp-btn" onClick={onExplore}>{OUTRO.explore} ↓</button>
          {voice === 'example' && (
            <button type="button" className="btn btn-secondary" onClick={onStart}>{OUTRO.start}</button>
          )}
          <button type="button" className="st-quiet" onClick={onReplay}>{OUTRO.again}</button>
        </motion.div>
      </motion.div>
    </section>
  );
}
