import { useEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../utils/media';
import { CATEGORIES, categoryById } from '../data/factors';
import { BENCHMARKS } from '../data/benchmarks';
import { CHROME, CHAPTERS, CATEGORY_QUIPS, BENCH_ST } from '../data/storyCopy';
import { classifyCharacter } from '../data/characters';
import {
  Cover, YearTicker, ReferencePoints, TotalReveal, Scopes, Hotspots, WorstMonth, Bench, Needle, Outro,
} from './moments';
import CharacterMoment from './CharacterMoment';

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
  // A "worst month" is only a story when the months are real and uneven.
  // Guided-audit entries sit on synthetic dates (structural meta.synthetic
  // tag, with a text fallback for older saves), so the moment is skipped
  // unless the worst month contains at least one genuinely dated entry and
  // clearly spikes above the mean.
  const synthetic = (e) => (e.meta && e.meta.synthetic)
    || (e.notes || '').includes('guided audit') || (e.label || '').includes('(onboarding)');
  const worstKey = agg.worstMonth ? agg.worstMonth.month : null;
  const worstMonthReal = worstKey && profile.entries.some(
    (e) => !synthetic(e) && e.date.slice(0, 7) === worstKey,
  );
  const meanMonth = agg.total / Math.max(1, agg.months.length);
  const monthsWorthTelling = worstMonthReal && agg.worstMonth.total > meanMonth * 1.35;
  const worst = monthsWorthTelling
    ? {
      name: MONTH_NAMES[Number(agg.worstMonth.month.split('-')[1]) - 1] + ' ' + agg.worstMonth.month.split('-')[0],
      total: agg.worstMonth.total,
    }
    : null;

  const bench = [
    { id: 'you', label: BENCH_ST.rows.you[voice], t: agg.total, you: true },
    { id: 'aus', label: BENCH_ST.rows.aus, t: BENCHMARKS.find((b) => b.id === 'aus').tco2e },
    { id: 'global', label: BENCH_ST.rows.global, t: BENCHMARKS.find((b) => b.id === 'global').tco2e },
    { id: 'budget', label: BENCH_ST.rows.budget, t: BENCHMARKS.find((b) => b.id === 'budget2030').tco2e },
  ];

  // Personal overshoot day: at this year's pace, the date the 2.5 t budget
  // ran out, counted from the start of the audit window.
  const budgetT = BENCHMARKS.find((b) => b.id === 'budget2030').tco2e;
  let overshoot = null;
  if (agg.total > budgetT) {
    const day = Math.max(1, Math.round(365 * (budgetT / agg.total)));
    const dt = new Date(profile.period.start + 'T00:00:00');
    dt.setDate(dt.getDate() + day - 1);
    overshoot = { day, date: dt.getDate() + ' ' + MONTH_NAMES[dt.getMonth()] + ' ' + dt.getFullYear() };
  } else if (agg.total > 0.005) {
    overshoot = { within: true };
  }

  const effortLabel = { low: 'Easy', med: 'Moderate', high: 'Harder' };
  const needle = macc
    .filter((r) => r.applicable && r.reduction > 0.05)
    .sort((a, b) => b.reduction - a.reduction)
    .slice(0, 3)
    .map((r) => ({
      ...r,
      hex: categoryById(r.category).hex,
      effortLabel: effortLabel[r.effort] || 'Moderate',
      // Lead figure: the cut as a share of this year, capped so rounding can
      // never claim more than the whole.
      pct: agg.total > 0 ? Math.min(100, Math.round((r.reduction / agg.total) * 100)) : 0,
    }));

  return {
    fy: profile.period.label,
    name: (profile.settings && profile.settings.name || '').trim(),
    total: agg.total,
    entryCount: agg.count,
    byScope: agg.byScope,
    ranked,
    tickerEntries,
    monthly,
    worst,
    bench,
    overshoot,
    largest: agg.largest ? { label: agg.largest.label, t: agg.largest.tco2e } : null,
    needle,
  };
}

// Scroll to a moment AND move focus there, so a keyboard user's next Tab
// continues from the destination instead of yanking the page back.
export function goToMoment(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

function ChapterRail({ active, chapters }) {
  return (
    <nav className="st-rail" aria-label={CHROME.progressLabel}>
      {chapters.map((c) => (
        <button
          key={c.id}
          type="button"
          className={'st-rail-dot' + (active === c.id ? ' on' : '')}
          aria-label={c.label}
          aria-current={active === c.id ? 'step' : undefined}
          onClick={() => goToMoment(c.id)}
        >
          <span className="st-rail-label">{c.label}</span>
        </button>
      ))}
    </nav>
  );
}

// A persistent, obvious way forward: one tap scrolls to the next moment.
// The scroll cue on the cover starts the journey; this keeps it going.
function NextChapter({ active, chapters }) {
  const ids = chapters.map((c) => c.id);
  const i = ids.indexOf(active);
  const next = i >= 0 && i < ids.length - 1 ? chapters[i + 1] : null;
  if (!next) return null;
  return (
    <button
      type="button"
      className="st-next"
      onClick={() => goToMoment(next.id)}
    >
      {CHROME.next} <strong>{next.label}</strong> <span aria-hidden="true">↓</span>
    </button>
  );
}

// Act I: the reveal. A continuous scroll of full-screen moments above the
// working dashboard. Purely presentational: it reads the same aggregates the
// dashboard reads and never touches the store.
export default function Story({ profile, agg, macc, voice, onStart, onSkip, onEnd, onFinish, onPlan, onCopyLink }) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const d = useMemo(() => buildStoryData(profile, agg, macc, voice), [profile, agg, macc, voice]);
  const character = useMemo(() => classifyCharacter(agg), [agg]);
  const [active, setActive] = useState('st-cover');
  const [chromeOn, setChromeOn] = useState(true);
  const rootRef = useRef(null);
  const endRef = useRef(null);

  // Chapters whose moments actually render for this audit.
  const chapters = useMemo(() => CHAPTERS.filter((c) => {
    if (c.id === 'st-months') return !!d.worst;
    if (c.id === 'st-needle') return d.needle.length > 0;
    if (c.id === 'st-hotspots') return d.ranked.length > 0;
    return true;
  }), [d]);

  // Track the active chapter for the rail. Re-registered whenever the
  // chapter set changes, so moments that appear or vanish after a log edit
  // stay observed and `active` never points at an unmounted section.
  useEffect(() => {
    const sections = rootRef.current?.querySelectorAll('.st-moment');
    if (!sections || !('IntersectionObserver' in window)) return undefined;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [chapters]);

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

  // The story chrome belongs to the story: once the visitor scrolls past it
  // into the dashboard, the skip button and rail step aside.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { setChromeOn(e.isIntersecting); });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const onReplay = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const onExplore = () => { onFinish(); };

  return (
    <div className="st-root" ref={rootRef}>
      {chromeOn && (
        <div className="st-chrome">
          <a href="../" className="st-home" aria-label="Back to the profile">{CHROME.home}</a>
          <div className="st-chrome-right">
            <button type="button" className="st-skip" onClick={onSkip}>{CHROME.skip} ↓</button>
          </div>
        </div>
      )}
      {chromeOn && <ChapterRail active={active} chapters={chapters} />}
      {chromeOn && <NextChapter active={active} chapters={chapters} />}

      <Cover d={d} voice={voice} onStart={onStart} reduced={reduced} chapterCount={chapters.length} />
      <YearTicker d={d} voice={voice} reduced={reduced} />
      <ReferencePoints d={d} voice={voice} goTo={goToMoment} />
      <TotalReveal d={d} voice={voice} onCopyLink={onCopyLink} reduced={reduced} />
      <Scopes d={d} voice={voice} />
      <Hotspots d={d} voice={voice} reduced={reduced} />
      <WorstMonth d={d} voice={voice} />
      <Bench d={d} voice={voice} />
      <CharacterMoment d={d} voice={voice} character={character} />
      <Needle d={d} voice={voice} onPlan={onPlan} />
      <Outro d={d} voice={voice} character={character} onStart={onStart} onExplore={onExplore} onReplay={onReplay} onCopyLink={onCopyLink} endRef={endRef} />
    </div>
  );
}
