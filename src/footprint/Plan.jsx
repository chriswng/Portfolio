import { useRef } from 'react';
import SplitText from '../components/SplitText';
import { categoryById } from './data/factors';
import { BUDGET_2030 } from './data/benchmarks';
import { PLAN, fmtT } from './data/copy';
import { fill } from './data/storyCopy';
import { prefersReducedMotion } from '../utils/media';
import { PathwayChart } from './charts';
import Icon from './Icons';

const EFFORT = { low: 'Easy', med: 'Moderate', high: 'Harder' };

// A cut as a share of the year: whole percentages, small-but-real shown as "<1".
const pctOf = (reduction, baseline) => {
  if (!(baseline > 0) || !(reduction > 0)) return '0';
  const p = (reduction / baseline) * 100;
  return p < 1 ? '<1' : String(Math.round(p));
};

function OptionCard({ r, on, baseline, onToggle }) {
  return (
    <li className={'fp-opt' + (r.applicable ? '' : ' na') + (on ? ' on' : '')} style={{ '--ac': categoryById(r.category).hex }}>
      <div className="fp-opt-name"><span className="fp-action-dot" aria-hidden="true" />{r.action}</div>
      {r.applicable ? (
        <>
          <div className="fp-opt-pct display">-{pctOf(r.reduction, baseline)}<span>%</span></div>
          <div className="fp-opt-meta">
            {fmtT(r.reduction, 2)} t {PLAN.reductionLabel} · {PLAN.effortLabel}: {EFFORT[r.effort] || 'Moderate'}
          </div>
        </>
      ) : (
        <div className="fp-opt-meta na">{PLAN.na}</div>
      )}
      <div className="fp-opt-detail"><span className="fp-opt-why">{PLAN.whyLabel}. </span>{r.detail}</div>
      <button
        type="button"
        className={'fp-toggle fp-opt-toggle' + (on && r.applicable ? ' on' : '')}
        aria-pressed={on && r.applicable}
        disabled={!r.applicable}
        onClick={() => onToggle(r.id)}
      >
        {r.applicable ? (on ? PLAN.toggleOn + ' ✓' : PLAN.toggleOff + ' +') : PLAN.na}
      </button>
    </li>
  );
}

export default function Plan({ macc, pathway, plan, onToggle }) {
  const trackRef = useRef(null);
  const horizonYear = pathway.years[pathway.years.length - 1];
  const landing = pathway.plan[pathway.plan.length - 1];
  const bauLanding = pathway.bau[pathway.bau.length - 1];
  const y2030i = pathway.years.indexOf(2030) !== -1 ? pathway.years.indexOf(2030) : 4;
  const at2030 = pathway.plan[y2030i];
  const bau2030 = pathway.bau[y2030i];
  const gap = at2030 - BUDGET_2030.tco2e;
  const baseline = pathway.bau[0] || 0;
  const enabledCount = pathway.enabled.length;
  const cut2030 = bau2030 > 0 ? Math.max(0, Math.round((1 - at2030 / bau2030) * 100)) : 0;

  // Biggest, doable options first; the not-relevant cards sit at the end.
  const options = [
    ...macc.filter((r) => r.applicable).sort((a, b) => b.reduction - a.reduction),
    ...macc.filter((r) => !r.applicable),
  ];

  const nudge = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.fp-opt');
    const step = card ? card.getBoundingClientRect().width + 14 : 300;
    el.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section id="fp-plan">
      <div className="canvas">
        <div className="sec-tag" data-idx="02 / "><Icon name="target" size={16} />Cut it down</div>
        <h2 className="display fp-h2"><SplitText text={PLAN.title[0]} /> <SplitText text={PLAN.title[1]} accentIndex={1} /></h2>
        <p className="fp-sub">{PLAN.sub}</p>

        {/* Options as a carousel with the chart alongside, so a choice changes
            the chart in view. A bottom-stuck readout keeps the effect visible. */}
        <div className="fp-planner">
          <div className="fp-card fp-planner-cards">
            <div className="fp-card-head">{PLAN.tableTitle}</div>
            <div className="fp-card-sub">{PLAN.tableSub}</div>
            <div className="fp-carousel">
              <button type="button" className="fp-car-btn prev" aria-label={PLAN.prev} onClick={() => nudge(-1)}>‹</button>
              <ul className="fp-car-track" ref={trackRef} aria-label={PLAN.carouselLabel}>
                {options.map((r) => (
                  <OptionCard key={r.id} r={r} on={plan.enabled.includes(r.id)} baseline={baseline} onToggle={onToggle} />
                ))}
              </ul>
              <button type="button" className="fp-car-btn next" aria-label={PLAN.next} onClick={() => nudge(1)}>›</button>
            </div>
          </div>

          <div className="fp-card fp-scenario">
            <div className="fp-card-head">{PLAN.scenarioTitle}</div>
            <div className="fp-card-sub">{PLAN.scenarioSub}</div>
            <PathwayChart
              pathway={pathway}
              budget={BUDGET_2030.tco2e}
              labels={{ bau: PLAN.bauLabel, plan: PLAN.planLabel, budget: PLAN.budgetLabel }}
            />
            <div className="fp-legend" aria-hidden="true">
              <span className="fp-leg-item"><span className="fp-leg-line dash" style={{ color: '#6E7469' }} />{PLAN.bauLabel}</span>
              <span className="fp-leg-item"><span className="fp-leg-line" style={{ color: '#1F2A1E' }} />{PLAN.planLabel}</span>
              <span className="fp-leg-item"><span className="fp-leg-line dash" style={{ color: '#C7274A' }} />{PLAN.budgetLabel}</span>
            </div>
            <p className="fp-takeaway">
              By FY{horizonYear} your choices land you at <em>{fmtT(landing)} t</em>, next to {fmtT(bauLanding)} t if nothing changes.
              At 2030 that reads {fmtT(at2030)} t, {gap > 0
                ? <>still <em>{fmtT(gap)} t over</em> the 2.5 t benchmark.</>
                : <>which is <em>inside the 2.5 t benchmark</em>.</>}
            </p>
          </div>

          <div className="fp-impact" role="status">
            <span className="fp-impact-l">{PLAN.impact.label}</span>
            {enabledCount === 0 ? (
              <span className="fp-impact-line">{PLAN.impact.none}</span>
            ) : (
              <span className="fp-impact-line">
                {fill(PLAN.impact.line, {
                  n: enabledCount, s: enabledCount > 1 ? 's' : '',
                  at2030: fmtT(at2030), bau2030: fmtT(bau2030), pct: cut2030,
                })}{' · '}
                <em className={gap > 0 ? 'over' : 'within'}>
                  {gap > 0 ? fill(PLAN.impact.over, { gap: fmtT(gap) }) : PLAN.impact.within}
                </em>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
