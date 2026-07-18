import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grain, ScrollProgress, SkipLink } from '../components/Chrome';
import SplitText from '../components/SplitText';
import { NAV_LINKS } from '../data/content';
import {
  TABS, ROADMAP_INTRO, ROADMAP_STAGES, ROADMAP_LEVERS,
  MCA_INTRO, MCA_CRITERIA, MCA_ANALYSIS, LCA,
  CASE_INTRO,
} from './workData';
import Baseline from './Baseline';
import CaseStudy from './CaseStudy';
import SiteFooter from '../components/SiteFooter';

function WorkNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner canvas">
        <a href="../" className="nav-logo">./</a>
        <div className={`nav-links${menuOpen ? ' open' : ''}`} role="navigation">
          {NAV_LINKS.map((l) => {
            // Self-link stays './'; every other target (anchors on the main
            // page, sibling sub-pages) is reached via the parent directory.
            const active = l.href === 'work/';
            const href = active ? './' : '../' + l.href;
            return <a key={l.label} href={href} className={active ? 'active' : undefined} aria-current={active ? 'true' : undefined}>{l.label}</a>;
          })}
        </div>
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

function DataTable({ data }) {
  return (
    <div className="scroll-x">
      <table className="c-table">
        <thead><tr>{data.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {data.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function RoadmapPanel() {
  return (
    <div>
      <p className="panel-intro">{ROADMAP_INTRO}</p>
      <div className="stage-grid">
        {ROADMAP_STAGES.map((s) => (
          <div className="stage" key={s.n}>
            <div className="stage-n">{s.n}</div>
            <div className="stage-title">{s.title}</div>
            <div className="stage-obj">{s.obj}</div>
            <ul className="stage-pts">{s.pts.map((p, i) => <li key={i}>{p}</li>)}</ul>
            <div className="stage-note">{s.note}</div>
          </div>
        ))}
      </div>
      <div className="sec-sub">{ROADMAP_LEVERS.caption}</div>
      <DataTable data={ROADMAP_LEVERS} />
    </div>
  );
}

function McaPanel() {
  return (
    <div>
      <p className="panel-intro">{MCA_INTRO}</p>
      <div className="mca-grid">
        {MCA_CRITERIA.map((m) => (
          <div className="mca" key={m.crit}>
            <div className="mca-crit">{m.crit}</div>
            <div className="mca-metric">{m.metric}</div>
            <div className="mca-body">{m.body}</div>
          </div>
        ))}
      </div>
      <div className="sec-sub mt2">{MCA_ANALYSIS.caption}</div>
      <DataTable data={MCA_ANALYSIS} />
    </div>
  );
}

function LcaPanel() {
  return (
    <div>
      <div className="bl-banner">
        <div className="bl-claim">{LCA.claim}</div>
        <div className="bl-meta">{LCA.meta}</div>
      </div>
      <div className="lc-modwrap">
        <div className="lc-modwrap-head">{LCA.modulesHead}</div>
        <div className="lc-modules">
          {LCA.modules.map((m) => (
            <div className={'lcm ' + m.state} key={m.ref}>
              <span className="lcm-ref">{m.ref}</span><span className="lcm-label">{m.label}</span>
            </div>
          ))}
        </div>
        <div className="lcm-legend">
          {LCA.legend.map((l, i) => (
            <div className="lcm-leg-item" key={i}><div className={'lcm-leg-dot ' + l.cls} />{l.text}</div>
          ))}
        </div>
      </div>
      <div className="scope-grid" style={{ marginTop: '1px' }}>
        {LCA.systems.map((s, i) => (
          <div className="scope-cell" key={i}><div className="scope-tag">{s.tag}</div><div className="scope-pct">{s.pct}</div><div className="scope-body">{s.body}</div></div>
        ))}
      </div>
      <div className="sec-sub mt2">{LCA.hotspotsCaption}</div>
      <div className="s3-head"><span>Material / system</span><span>Share</span><span>Scale</span></div>
      {LCA.hotspots.map((h, i) => (
        <div className="s3-row" key={i}>
          <div className="s3-name">{h.name}<span className="s3-sub">{h.sub}</span></div>
          <div className="s3-pct">{h.pct}</div>
          <div className="s3-bar-wrap"><div className="s3-bar-fill" style={{ width: h.w + '%', background: h.bg }} /></div>
        </div>
      ))}
      <div className="bench-wrap mt2">
        <div className="bench-head">{LCA.benchHead}</div>
        <div className="bench-scale">
          <div className="bench-bar-bg" /><div className="bench-range" />
          <div className="bench-mark this-b"><div className="bench-mark-label">520: this building</div></div>
          <div className="bench-mark target-b"><div className="bench-mark-label">&lt;400 target</div></div>
        </div>
        <div className="bench-ticks">{LCA.benchTicks.map((t, i) => <span className="bench-tick" key={i}>{t}</span>)}</div>
        <div className="bench-legend">
          {LCA.benchLegend.map((l, i) => (
            <div className="bench-leg-item" key={i}><div className="bench-leg-line" style={{ background: l.color }} />{l.text}</div>
          ))}
        </div>
        <div className="bench-note">{LCA.benchNote}</div>
      </div>
      <div className="sec-sub">{LCA.levers.caption}</div>
      <DataTable data={LCA.levers} />
      <div className="impl-grid mt2">
        {LCA.tiles.map((t, i) => (
          <div className="impl" key={i}><div className="impl-head">{t.h}</div><div className="impl-body">{t.b}</div></div>
        ))}
      </div>
    </div>
  );
}

const PANELS = { baseline: Baseline, roadmap: RoadmapPanel, mca: McaPanel, lca: LcaPanel };

export default function WorkApp() {
  const [tab, setTab] = useState('baseline');
  const Panel = PANELS[tab];

  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <WorkNav />

      <main id="main-content" className="page-work">
      <section id="work-intro">
        <div className="bloom-wrap" aria-hidden="true"><div className="bloom bloom-a" /><div className="bloom bloom-b" /><div className="bloom bloom-c" /></div>
        <div className="canvas" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sec-tag" data-idx="01 / ">Work Samples</div>
          <h1 className="wi-title display"><SplitText text="Frameworks" /> <SplitText text="in practice." accentIndex={1} /></h1>
          <p className="wi-sub">Four analytical frameworks, each shown as a live working example drawn from production engagements across infrastructure, built environment, and government. Select a tab to explore the methodology.</p>
          <a href="../" className="wi-back"><span>←</span>&nbsp;Back to profile</a>
        </div>
      </section>

      <section id="work-samples">
        <div className="canvas">
          <div className="tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={'tab' + (tab === t.id ? ' on' : '')}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                <span className="tab-lt">{t.letter}&nbsp;</span>{t.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            >
              <Panel />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section id="casestudy">
        <div className="canvas">
          <div className="sec-tag" data-idx="02 / ">Case Study · Baseline to Boardroom</div>
          <h2 className="display" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', marginTop: '1.2rem', marginBottom: '1rem' }}>
            <SplitText text="Baseline to boardroom" accentIndex={2} />
          </h2>
          <p className="panel-intro" style={{ marginBottom: 0 }}>{CASE_INTRO}</p>
          <CaseStudy />
        </div>
      </section>
      </main>

      <SiteFooter base="../" />
    </>
  );
}
