import { useCallback, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { Grain, ScrollProgress, SkipLink } from '../components/Chrome';
import SplitText from '../components/SplitText';
import { NAV_LINKS } from '../data/content';
import { buildSeedProfile } from './data/seedProfile';
import { INTRO, MODE, SHARE, FOOTER, LOG, TOASTS, YEARS, fmtT } from './data/copy';
import { DASH_EXTRA, fill } from './data/storyCopy';
import { categoryById } from './data/factors';
import { aggregate, priceEntry, projectPathway, maccData, newId, rolloverProfile } from './lib/engine';
import {
  loadOwnProfile, saveOwnProfile, clearOwnProfile, exportProfile,
  encodeSnapshot, decodeSnapshot, storySeen, markStorySeen,
} from './lib/store';
import { downloadAuditPack } from './lib/auditPack';
import { audio } from './lib/audio';
import { prefersReducedMotion } from '../utils/media';
import Story from './story/Story';
import Skim from './Skim';
import Dashboard from './Dashboard';
import Plan from './Plan';
import Log from './Log';
import Onboarding from './Onboarding';
import { Method, Market } from './MethodMarket';

// Local date, never toISOString: UTC lands on yesterday in Australian zones.
const todayIso = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

const monthsOld = (iso) => {
  const t = todayIso();
  return (Number(t.slice(0, 4)) - Number(iso.slice(0, 4))) * 12 + (Number(t.slice(5, 7)) - Number(iso.slice(5, 7)));
};

function FootprintNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner canvas">
        <a href="../" className="nav-logo">./</a>
        <div className={`nav-links${menuOpen ? ' open' : ''}`}>
          {NAV_LINKS.map((l) => {
            const self = l.href === 'footprint/';
            const href = self ? './' : '../' + l.href;
            return (
              <a key={l.label} href={href} className={self ? 'active' : undefined} aria-current={self ? 'true' : undefined}>
                {l.label}
              </a>
            );
          })}
        </div>
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

export default function FootprintApp() {
  const seed = useMemo(() => buildSeedProfile(), []);
  const [own, setOwn] = useState(() => loadOwnProfile());
  const [mode, setMode] = useState(own ? 'mine' : 'example');
  const [seedPlanEnabled, setSeedPlanEnabled] = useState(seed.plan.enabled);
  const [onboarding, setOnboarding] = useState(false);
  const [toast, setToast] = useState('');
  const [snapshot, setSnapshot] = useState(() => decodeSnapshot());
  // The reveal story opens for first-time visitors; shared-snapshot links and
  // returning visitors land straight on the dashboard.
  const [storyOpen, setStoryOpen] = useState(() => !decodeSnapshot() && !storySeen());
  const [soundOn, setSoundOn] = useState(false);
  // Which closed year is on screen; null means the open year.
  const [pastIdx, setPastIdx] = useState(null);

  const isExample = !(mode === 'mine' && own);
  const pastYear = !isExample && pastIdx != null ? (own.pastYears || [])[pastIdx] : null;
  const archived = !!pastYear;
  const profile = isExample
    ? { ...seed, plan: { ...seed.plan, enabled: seedPlanEnabled } }
    : archived
      ? {
        ...own,
        settings: pastYear.settingsAtClose || own.settings,
        period: { label: pastYear.label, start: pastYear.start, end: pastYear.end },
        entries: pastYear.entries,
        plan: pastYear.plan || { enabled: [] },
      }
      : own;
  const voice = isExample ? 'example' : 'own';
  // The open year is due to close once today passes its end date.
  const rolloverDue = !isExample && !archived && todayIso() > own.period.end;
  const newestEntry = !isExample && !archived && own.entries.length
    ? own.entries.reduce((a, e) => (e.date > a ? e.date : a), own.entries[0].date)
    : null;
  const staleMonths = newestEntry && !rolloverDue ? monthsOld(newestEntry) : 0;

  const agg = useMemo(() => aggregate(profile), [profile]);
  const macc = useMemo(() => maccData(profile, agg), [profile, agg]);
  const pathway = useMemo(() => projectPathway(profile, agg), [profile, agg]);
  // The audit not currently on screen, aggregated for the comparison overlay.
  // A closed year compares against the open one (year over year); the open
  // year compares against the worked example, and vice versa.
  const compareAgg = useMemo(() => {
    if (archived) return aggregate(own);
    return own ? aggregate(isExample ? own : seed) : null;
  }, [own, isExample, seed, archived]);
  const comparePeriod = archived ? own.period : (own ? (isExample ? own.period : seed.period) : null);

  const updateOwn = (fn) => {
    setOwn((p) => {
      const next = fn(p);
      saveOwnProfile(next);
      return next;
    });
  };

  const flash = (msg) => { setToast(msg); window.setTimeout(() => setToast(''), 3500); };

  const onToggle = (id) => {
    if (isExample) {
      setSeedPlanEnabled((en) => (en.includes(id) ? en.filter((x) => x !== id) : [...en, id]));
    } else {
      updateOwn((p) => ({
        ...p,
        plan: { ...p.plan, enabled: p.plan.enabled.includes(id) ? p.plan.enabled.filter((x) => x !== id) : [...p.plan.enabled, id] },
      }));
    }
  };

  const onAdd = (draft) => {
    updateOwn((p) => ({ ...p, entries: [...p.entries, priceEntry({ ...draft, id: newId() }, p.settings)] }));
    flash(TOASTS.entryAdded);
  };
  const onAddEntries = (entries) => {
    if (!entries.length) { flash(TOASTS.nothingSelected); return; }
    updateOwn((p) => ({ ...p, entries: [...p.entries, ...entries] }));
    flash(fill(TOASTS.csvAdded, { n: entries.length, s: entries.length > 1 ? 's' : '' }));
  };
  const onDelete = (id) => updateOwn((p) => ({ ...p, entries: p.entries.filter((e) => e.id !== id) }));

  const onExport = () => { exportProfile(own); };
  const onImportFile = (imported) => {
    saveOwnProfile(imported);
    setOwn(imported);
    setMode('mine');
    // The imported file may hold a different set of closed years than the
    // one on screen; never leave the view pointing at a stale index.
    setPastIdx(null);
  };
  const onShare = async () => {
    const cats = Object.entries(agg.byCategory)
      .sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([id, t]) => [categoryById(id).label, Math.round(t * 100) / 100]);
    const url = encodeSnapshot({
      v: 1, label: profile.period.label,
      total: Math.round(agg.total * 100) / 100,
      cats,
      plan: pathway.enabled.length,
      at2030: Math.round((pathway.plan[Math.max(0, pathway.years.indexOf(2030))] || 0) * 100) / 100,
    });
    try {
      await navigator.clipboard.writeText(url);
      flash(TOASTS.shareCopied);
    } catch {
      window.prompt(TOASTS.sharePrompt, url);
    }
  };
  const onReset = () => {
    if (!window.confirm(LOG.controls.resetConfirm)) return;
    clearOwnProfile();
    setOwn(null);
    setMode('example');
    setPastIdx(null);
    flash(TOASTS.auditDeleted);
  };
  const onStart = () => setOnboarding(true);
  const onRollover = () => {
    const next = rolloverProfile(own, todayIso());
    saveOwnProfile(next);
    setOwn(next);
    setPastIdx(null);
    flash(fill(YEARS.rolledToast, { label: own.period.label, next: next.period.label }));
  };
  const onPack = () => downloadAuditPack(profile, agg);
  // The audit persists the moment it is built (the done pane says so), not
  // only when a closing button is pressed; Escape can no longer discard it.
  // Rebuilding on top of an existing audit keeps the closed years: starting
  // over is allowed, deleting history by accident is not.
  const onOnboardBuilt = useCallback((built) => {
    setOwn((prev) => {
      const merged = { ...built, pastYears: prev && prev.pastYears ? prev.pastYears : [] };
      saveOwnProfile(merged);
      return merged;
    });
    setMode('mine');
    setPastIdx(null);
  }, []);
  const onOnboardDone = (built, { watch } = {}) => {
    onOnboardBuilt(built);
    setOnboarding(false);
    if (watch) {
      setStoryOpen(true);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      flash(TOASTS.auditLive);
      markStorySeen();
      setStoryOpen(false);
      window.setTimeout(() => document.getElementById('fp-dash')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }), 60);
    }
  };

  const toggleSound = () => setSoundOn(audio.toggle());
  const muteAudio = useCallback(() => {
    if (audio.on) audio.disable();
    setSoundOn(false);
  }, []);
  const landOnDashboard = () => {
    window.setTimeout(() => document.getElementById('fp-dash')?.scrollIntoView({ behavior: 'auto' }), 50);
  };
  const onStorySkip = () => {
    markStorySeen();
    setStoryOpen(false);
    muteAudio();
    landOnDashboard();
  };
  // The assessor's exit: straight from the story cover to the 45-second
  // lane. Focus moves with the scroll so a keyboard user's next Tab
  // continues from the lane instead of the top of the page.
  const onAssessor = () => {
    markStorySeen();
    setStoryOpen(false);
    muteAudio();
    window.setTimeout(() => {
      const el = document.getElementById('fp-skim');
      if (!el) return;
      el.scrollIntoView({ behavior: 'auto' });
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }, 50);
  };
  // "Explore the full audit" from the outro: the show ends, the house lights
  // come up on the dashboard itself.
  const onStoryFinish = () => {
    markStorySeen();
    setStoryOpen(false);
    muteAudio();
    landOnDashboard();
  };
  const onStoryEnd = useCallback(() => { markStorySeen(); }, []);
  const onReplay = () => {
    setStoryOpen(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const dismissSnapshot = () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setSnapshot(null);
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* While the guided audit is open, the whole page behind it is inert:
          declaratively, so a story remount mid-flow is covered too. */}
      <div inert={onboarding ? '' : undefined}>
      <SkipLink />
      <Grain />
      <ScrollProgress />

      {storyOpen && (
        <Story
          key={voice}
          profile={profile}
          agg={agg}
          macc={macc}
          voice={voice}
          onStart={onStart}
          onSkip={onStorySkip}
          onAssessor={onAssessor}
          onEnd={onStoryEnd}
          onFinish={onStoryFinish}
          onCopyLink={onShare}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          onAutoMute={muteAudio}
        />
      )}

      <FootprintNav />

      <main id="main-content">
        {snapshot && (
          <section className="fp-snapshot" aria-label="Shared snapshot">
            <div className="canvas">
              <div className="fp-snap-card">
                <div className="fp-card-head">{SHARE.bannerTitle}</div>
                <p className="fp-card-sub">{SHARE.bannerBody}</p>
                <div className="fp-snap-kpis">
                  <div className="fp-kpi live"><div className="fp-kpi-l">{snapshot.label} total</div><div className="fp-kpi-v">{fmtT(snapshot.total)}<span> t</span></div></div>
                  {snapshot.cats.map(([label, t]) => (
                    <div className="fp-kpi" key={label}><div className="fp-kpi-l">{label}</div><div className="fp-kpi-v">{fmtT(t)}<span> t</span></div></div>
                  ))}
                </div>
                <p className="fp-note">{SHARE.provenance} <a href="#fp-method">{SHARE.provenanceCta}</a></p>
                <div className="fp-ctrl-row">
                  <button type="button" className="btn btn-primary fp-btn" onClick={() => { dismissSnapshot(); setOnboarding(true); }}>{SHARE.cta} →</button>
                  <button type="button" className="fp-linkbtn" onClick={dismissSnapshot}>{SHARE.dismiss}</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {!storyOpen && (
          <section id="fp-intro">
            <div className="bloom-wrap" aria-hidden="true"><div className="bloom bloom-a" /><div className="bloom bloom-b" /><div className="bloom bloom-c" /></div>
            <div className="canvas" style={{ position: 'relative', zIndex: 1 }}>
              <div className="sec-tag" data-idx="00 / ">{INTRO.tag}</div>
              <h1 className="fp-h1 display">
                <SplitText text={INTRO.h1a} /> <SplitText text={INTRO.h1b} accentIndex={1} />
              </h1>
              {INTRO.paras.map((p, i) => <p className="fp-intro-p" key={i}>{p}</p>)}
              <div className="fp-chips" role="list">
                {INTRO.chips.map((c) => <span className="fp-chip" role="listitem" key={c}>{c}</span>)}
              </div>
              <div className="fp-ctas">
                <button type="button" className="btn btn-primary fp-btn" onClick={onStart}>{INTRO.ctaStart} →</button>
                <a className="btn btn-secondary" href="#fp-dash">{INTRO.ctaExample}</a>
                <button type="button" className="fp-replay" onClick={onReplay}>▶ {DASH_EXTRA.replayChip}</button>
              </div>
              <span className="fp-disc">{INTRO.disc}</span>
            </div>
          </section>
        )}

        <div className="fp-modebar">
          <div className="canvas fp-modebar-inner">
            <span role="status">
              {isExample ? MODE.example : archived ? MODE.archived : MODE.mine}
              {!isExample && !archived && own.period.note && (
                <span className="fp-fresh"> {fill(YEARS.gapNote, { note: own.period.note })}</span>
              )}
              {!isExample && !archived && staleMonths >= 3 && (
                <span className="fp-fresh"> {fill(MODE.freshness, { months: staleMonths })}</span>
              )}
            </span>
            <span className="fp-modebar-btns">
              {/* The switcher earns its place only once there are two audits
                  to switch between; a control that does nothing serves nobody. */}
              {own && (
                <>
                  <button type="button" className={'fp-mode-btn' + (!isExample ? ' on' : '')} onClick={() => setMode('mine')}>{MODE.switchToMine}</button>
                  <button type="button" className={'fp-mode-btn' + (isExample ? ' on' : '')} onClick={() => { setMode('example'); setPastIdx(null); }}>{MODE.switchToExample}</button>
                </>
              )}
              {own && !isExample && (own.pastYears || []).length > 0 && (
                <label className="fp-yearpick">
                  <span className="sr-only">{YEARS.switcherAria}</span>
                  <select
                    value={pastIdx == null ? 'current' : String(pastIdx)}
                    onChange={(e) => setPastIdx(e.target.value === 'current' ? null : Number(e.target.value))}
                  >
                    <option value="current">{own.period.label}</option>
                    {own.pastYears.map((y, i) => (
                      <option key={y.label + i} value={i}>{y.label}</option>
                    ))}
                  </select>
                </label>
              )}
              {!own && <button type="button" className="fp-mode-btn cta" onClick={onStart}>{MODE.startCta}</button>}
            </span>
          </div>
        </div>

        {rolloverDue && (
          <section className="fp-rollover" aria-label="Close the year">
            <div className="canvas">
              <div className="fp-roll-card">
                <div className="fp-card-head">{fill(YEARS.rollTitle, { label: own.period.label })}</div>
                <p className="fp-card-sub">{fill(YEARS.rollBody, { end: own.period.end })}</p>
                <button type="button" className="btn btn-primary fp-btn" onClick={onRollover}>
                  {fill(YEARS.rollCta, { label: own.period.label })} →
                </button>
              </div>
            </div>
          </section>
        )}
        {archived && (
          <div className="fp-archivebar">
            <div className="canvas">
              <span>{fill(YEARS.archiveNote, { closedAt: pastYear.closedAt || '', factorSet: pastYear.factorSetAtClose || '' })}</span>
              {profile.period.note && <span> {fill(YEARS.gapNote, { note: profile.period.note })}</span>}
            </div>
          </div>
        )}

        {isExample && <Skim agg={agg} macc={macc} />}

        <Dashboard agg={agg} period={profile.period} compareAgg={compareAgg} comparePeriod={comparePeriod} isExample={isExample} />
        {!archived && <Plan macc={macc} pathway={pathway} plan={profile.plan} onToggle={onToggle} />}
        <Log
          profile={profile} isExample={isExample} archived={archived}
          onAdd={onAdd} onAddEntries={onAddEntries} onDelete={onDelete}
          onExport={onExport} onImportFile={onImportFile} onShare={onShare} onReset={onReset} onStart={onStart}
          onPack={onPack}
        />
        <Method agg={agg} />
        <Market />
      </main>

      <footer className="fp-footer">
        <div className="canvas fp-footer-inner">
          <a href="../" className="fp-footer-home">./</a>
          <span className="fp-footer-name">{FOOTER.name}</span>
          <a href="../" className="fp-footer-back">← {FOOTER.back}</a>
        </div>
      </footer>
      </div>

      {onboarding && <Onboarding onDone={onOnboardDone} onBuilt={onOnboardBuilt} onCancel={() => setOnboarding(false)} />}
      {/* Mounted permanently so assistive tech announces text arriving in it. */}
      <div className={'fp-toast' + (toast ? ' show' : '')} role="status">{toast}</div>
    </MotionConfig>
  );
}
