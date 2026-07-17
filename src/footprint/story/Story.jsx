import { useEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../utils/media';
import { CATEGORIES, categoryById } from '../data/factors';
import { BENCHMARKS } from '../data/benchmarks';
import { CHROME, CHAPTERS, CATEGORY_QUIPS, BENCH_ST } from '../data/storyCopy';
import {
  Cover, YearTicker, Guess, TotalReveal, Scopes, Hotspots, WorstMonth, Bench, Needle, Outro,
} from './moments';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Distils the audit into the handful of numbers the story tells.
function buildStoryData(profile, agg, macc, voice) {
  const ranked = CATEGORIES
    .map((c) => ({ ...c, t: agg.byCategory[c.id] || 0 }))
    .filter((c) => c.t > 0.005)
    .sort((a, b) => b.t - a.t)
    .map((c) => ({
      ...c,
      pct: agg.total > 0 ? Math.round((c.t / agg.total) * 100) : 0,
      quip: (CATEGORY_QUIPS[c.id] || CATEGORY_QUIPS.other)[voice],
    }));

  const tickerEntries = [...profile.entries]
    .filter((e) => e.tco2e > 0.001)
    .sort((a, b) => b.tco2e - a.tco2e)
    .slice(0, 24)
    .map((e) => ({ label: e.label, t: e.tco2e, hex: categoryById(e.category).hex }));

  const monthly = agg.months.map((key) => {
    const total = Object.values(agg.byMonth[key] || {}).reduce((s, v) => s + v, 0);
    return {
      key,
      total,
      letter: MONTH_NAMES[Number(key.split('-')[1]) - 1][0],
      worst: agg.worstMonth && key === agg.worstMonth.month && total > 0,
    };
  });
  const worst = agg.worstMonth && agg.worstMonth.total > 0
    ? {
      name: MONTH_NAMES[Number(agg.worstMonth.month.split('-')[1]) - 1] + ' ' + agg.worstMonth.month.split('-')[0],
      total: agg.worstMonth.total,
    }
    : null;

  const bench = [
    { label: BENCH_ST.rows.you[voice], t: agg.total, you: true },
    { label: BENCH_ST.rows.aus, t: BENCHMARKS.find((b) => b.id === 'aus').tco2e },
    { label: BENCH_ST.rows.global, t: BENCHMARKS.find((b) => b.id === 'global').tco2e },
    { label: BENCH_ST.rows.budget, t: BENCHMARKS.find((b) => b.id === 'budget2030').tco2e },
  ];

  const needle = macc
    .filter((r) => r.applicable && r.reduction > 0.05)
    .sort((a, b) => b.reduction - a.reduction)
    .slice(0, 3)
    .map((r) => ({ ...r, hex: categoryById(r.category).hex }));

  return {
    fy: profile.period.label,
    total: agg.total,
    entryCount: agg.count,
    byScope: agg.byScope,
    ranked,
    tickerEntries,
    monthly,
    worst,
    bench,
    needle,
  };
}

function ChapterRail({ active }) {
  return (
    <nav className="st-rail" aria-label={CHROME.progressLabel}>
      {CHAPTERS.map((c) => (
        <button
          key={c.id}
          type="button"
          className={'st-rail-dot' + (active === c.id ? ' on' : '')}
          aria-label={c.label}
          aria-current={active === c.id ? 'step' : undefined}
          onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
        >
          <span className="st-rail-label">{c.label}</span>
        </button>
      ))}
    </nav>
  );
}

// Act I: the reveal. A continuous scroll of full-screen moments above the
// working dashboard. Purely presentational: it reads the same aggregates the
// dashboard reads and never touches the store.
export default function Story({ profile, agg, macc, voice, onStart, onSkip, onEnd, onCopyLink, soundOn, onToggleSound }) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const d = useMemo(() => buildStoryData(profile, agg, macc, voice), [profile, agg, macc, voice]);
  const [guess, setGuess] = useState({ value: null, locked: false });
  const [active, setActive] = useState('st-cover');
  const rootRef = useRef(null);
  const endRef = useRef(null);

  // Track the active chapter for the rail.
  useEffect(() => {
    const sections = rootRef.current?.querySelectorAll('.st-moment');
    if (!sections || !('IntersectionObserver' in window)) return undefined;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Reaching the outro marks the story as seen for future visits.
  useEffect(() => {
    const el = endRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { onEnd(); obs.disconnect(); }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onEnd]);

  const onGuessAgain = () => {
    setGuess((g) => ({ ...g, locked: false }));
    document.getElementById('st-guess')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const onReplay = () => {
    setGuess({ value: null, locked: false });
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const onExplore = () => {
    onEnd();
    document.getElementById('fp-dash')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <div className="st-root" ref={rootRef}>
      <div className="st-chrome">
        <a href="../" className="st-home" aria-label="Back to the profile">{CHROME.home}</a>
        <div className="st-chrome-right">
          <button
            type="button"
            className={'st-sound' + (soundOn ? ' on' : '')}
            aria-pressed={soundOn}
            aria-label={CHROME.sound.label}
            onClick={onToggleSound}
          >
            <span className="st-sound-bars" aria-hidden="true"><i /><i /><i /></span>
            {soundOn ? CHROME.sound.on : CHROME.sound.off}
          </button>
          <button type="button" className="st-skip" onClick={onSkip}>{CHROME.skip} ↓</button>
        </div>
      </div>
      <ChapterRail active={active} />

      <Cover d={d} voice={voice} onStart={onStart} reduced={reduced} />
      <YearTicker d={d} voice={voice} reduced={reduced} />
      <Guess d={d} voice={voice} guess={guess} setGuess={setGuess} />
      <TotalReveal d={d} voice={voice} guess={guess} onGuessAgain={onGuessAgain} onCopyLink={onCopyLink} reduced={reduced} />
      <Scopes d={d} voice={voice} />
      <Hotspots d={d} voice={voice} reduced={reduced} />
      <WorstMonth d={d} voice={voice} />
      <Bench d={d} voice={voice} />
      <Needle d={d} voice={voice} />
      <Outro d={d} voice={voice} onStart={onStart} onExplore={onExplore} onReplay={onReplay} endRef={endRef} />
    </div>
  );
}
