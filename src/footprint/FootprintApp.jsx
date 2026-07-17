import { useMemo, useState } from 'react';
import { Grain, ScrollProgress, SkipLink } from '../components/Chrome';
import SplitText from '../components/SplitText';
import { NAV_LINKS } from '../data/content';
import { buildSeedProfile } from './data/seedProfile';
import { INTRO, MODE, SHARE, FOOTER, fmtT } from './data/copy';
import { DASH_EXTRA } from './data/storyCopy';
import { categoryById } from './data/factors';
import { aggregate, priceEntry, projectPathway, maccData, newId } from './lib/engine';
import {
  loadOwnProfile, saveOwnProfile, clearOwnProfile, exportProfile,
  encodeSnapshot, decodeSnapshot, storySeen, markStorySeen,
} from './lib/store';
import { audio } from './lib/audio';
import { prefersReducedMotion } from '../utils/media';
import Story from './story/Story';
import Dashboard from './Dashboard';
import Plan from './Plan';
import Log from './Log';
import Onboarding from './Onboarding';
import { Method, Market } from './MethodMarket';

function FootprintNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner canvas">
        <a href="../" className="nav-logo">./</a>
        <div className={`nav-links${menuOpen ? ' open' : ''}`} role="navigation">
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

  const isExample = !(mode === 'mine' && own);
  const profile = isExample ? { ...seed, plan: { ...seed.plan, enabled: seedPlanEnabled } } : own;
  const voice = isExample ? 'example' : 'own';

  const agg = useMemo(() => aggregate(profile), [profile]);
  const macc = useMemo(() => maccData(profile, agg), [profile, agg]);
  const pathway = useMemo(() => projectPathway(profile, agg), [profile, agg]);
  // The audit not currently on screen, aggregated for the comparison overlay.
  const compareAgg = useMemo(() => (own ? aggregate(isExample ? own : seed) : null), [own, isExample, seed]);
  const comparePeriod = own ? (isExample ? own.period : seed.period) : null;

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
    flash('Entry added and priced.');
  };
  const onAddEntries = (entries) => {
    if (!entries.length) { flash('Nothing selected to add.'); return; }
    updateOwn((p) => ({ ...p, entries: [...p.entries, ...entries] }));
    flash(entries.length + ' estimate' + (entries.length > 1 ? 's' : '') + ' added from the CSV.');
  };
  const onDelete = (id) => updateOwn((p) => ({ ...p, entries: p.entries.filter((e) => e.id !== id) }));

  const onExport = () => { exportProfile(own); };
  const onImportFile = (imported) => {
    saveOwnProfile(imported);
    setOwn(imported);
    setMode('mine');
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
      flash('Share link copied. Summary only; the log stays here.');
    } catch {
      window.prompt('Copy your share link:', url);
    }
  };
  const onReset = () => {
    if (!window.confirm('Delete your audit from this browser? Export a backup first if you want to keep it.')) return;
    clearOwnProfile();
    setOwn(null);
    setMode('example');
    flash('Audit deleted from this browser.');
  };
  const onStart = () => setOnboarding(true);
  const onOnboardDone = (built, { watch } = {}) => {
    saveOwnProfile(built);
    setOwn(built);
    setMode('mine');
    setOnboarding(false);
    if (watch) {
      setStoryOpen(true);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      flash('Your audit is live. It saves to this browser as you edit.');
      markStorySeen();
      setStoryOpen(false);
      window.setTimeout(() => document.getElementById('fp-dash')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }), 60);
    }
  };

  const toggleSound = () => setSoundOn(audio.toggle());
  const onStorySkip = () => {
    markStorySeen();
    setStoryOpen(false);
    if (soundOn) { audio.disable(); setSoundOn(false); }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const onStoryEnd = () => { markStorySeen(); };
  const onReplay = () => {
    setStoryOpen(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const dismissSnapshot = () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setSnapshot(null);
  };

  return (
    <>
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
          onEnd={onStoryEnd}
          onCopyLink={onShare}
          soundOn={soundOn}
          onToggleSound={toggleSound}
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
                  {typeof snapshot.at2030 === 'number' && snapshot.at2030 > 0 && (
                    <div className="fp-kpi"><div className="fp-kpi-l">planned 2030</div><div className="fp-kpi-v">{fmtT(snapshot.at2030)}<span> t</span></div></div>
                  )}
                </div>
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

        <div className="fp-modebar" role="status">
          <div className="canvas fp-modebar-inner">
            <span>{isExample ? MODE.example : MODE.mine}</span>
            <span className="fp-modebar-btns">
              {own && (
                <button type="button" className={'fp-mode-btn' + (!isExample ? ' on' : '')} onClick={() => setMode('mine')}>{MODE.switchToMine}</button>
              )}
              <button type="button" className={'fp-mode-btn' + (isExample ? ' on' : '')} onClick={() => setMode('example')}>{MODE.switchToExample}</button>
              {!own && <button type="button" className="fp-mode-btn cta" onClick={onStart}>{MODE.startCta}</button>}
            </span>
          </div>
        </div>

        <Dashboard agg={agg} period={profile.period} compareAgg={compareAgg} comparePeriod={comparePeriod} isExample={isExample} />
        <Plan macc={macc} pathway={pathway} plan={profile.plan} onToggle={onToggle} />
        <Log
          profile={profile} isExample={isExample}
          onAdd={onAdd} onAddEntries={onAddEntries} onDelete={onDelete}
          onExport={onExport} onImportFile={onImportFile} onShare={onShare} onReset={onReset} onStart={onStart}
        />
        <Method />
        <Market />
      </main>

      {onboarding && <Onboarding onDone={onOnboardDone} onCancel={() => setOnboarding(false)} />}
      {toast && <div className="fp-toast" role="status">{toast}</div>}

      <footer className="fp-footer">
        <div className="canvas fp-footer-inner">
          <a href="../" className="fp-footer-home">./</a>
          <span className="fp-footer-name">{FOOTER.name}</span>
          <a href="../" className="fp-footer-back">← {FOOTER.back}</a>
        </div>
      </footer>
    </>
  );
}
