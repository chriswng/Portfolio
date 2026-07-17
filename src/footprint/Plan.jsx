import SplitText from '../components/SplitText';
import { categoryById } from './data/factors';
import { BUDGET_2030 } from './data/benchmarks';
import { PLAN, fmtT } from './data/copy';
import { MaccChart, PathwayChart } from './charts';

const money = (v) => (v < 0 ? '-$' + Math.abs(v).toLocaleString() : '$' + v.toLocaleString());

export default function Plan({ macc, pathway, plan, onToggle }) {
  const horizonYear = pathway.years[pathway.years.length - 1];
  const landing = pathway.plan[pathway.plan.length - 1];
  const bauLanding = pathway.bau[pathway.bau.length - 1];
  const y2030i = pathway.years.indexOf(2030) !== -1 ? pathway.years.indexOf(2030) : 4;
  const at2030 = pathway.plan[y2030i];
  const gap = at2030 - BUDGET_2030.tco2e;

  return (
    <section id="fp-plan">
      <div className="canvas">
        <div className="sec-tag" data-idx="03 / ">The plan</div>
        <h2 className="display fp-h2"><SplitText text={PLAN.title[0]} /> <SplitText text={PLAN.title[1]} accentIndex={1} /></h2>
        <p className="fp-sub">{PLAN.sub}</p>

        <div className="fp-card">
          <div className="fp-card-head">{PLAN.maccTitle}</div>
          <div className="fp-card-sub">{PLAN.maccSub}</div>
          <MaccChart rows={macc} />
          <p className="fp-note">{PLAN.maccNote}</p>
        </div>

        <div className="fp-plangrid">
          <div className="fp-card fp-actions">
            <div className="fp-card-head">{PLAN.tableTitle}</div>
            <div className="fp-card-sub">{PLAN.tableSub}</div>
            {macc.map((r) => {
              const on = plan.enabled.includes(r.id);
              return (
                <div className={'fp-action' + (r.applicable ? '' : ' na')} key={r.id} style={{ '--ac': categoryById(r.category).hex }}>
                  <div className="fp-action-top">
                    <span className="fp-action-dot" aria-hidden="true" />
                    <span className="fp-action-name">{r.action}</span>
                    <button
                      type="button"
                      className={'fp-toggle' + (on && r.applicable ? ' on' : '')}
                      aria-pressed={on && r.applicable}
                      disabled={!r.applicable}
                      onClick={() => onToggle(r.id)}
                    >
                      {r.applicable ? (on ? PLAN.toggleOn : PLAN.toggleOff) : PLAN.na}
                    </button>
                  </div>
                  <div className="fp-action-meta">
                    {r.applicable
                      ? <>{fmtT(r.reduction, 2)} t/yr · {r.costPerTonne != null ? money(r.costPerTonne) + '/t' : 'n/a'} · net {money(r.cost)}/yr · {r.effort} effort</>
                      : 'Not applicable to this audit.'}
                  </div>
                  <div className="fp-action-detail">{r.detail}</div>
                  <div className="fp-action-src">{r.source}</div>
                </div>
              );
            })}
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
            <p className="fp-takeaway" aria-live="polite">
              This plan lands FY{horizonYear} at <em>{fmtT(landing)} t</em>, against {fmtT(bauLanding)} t with frozen habits.
              At 2030 it reads {fmtT(at2030)} t, {gap > 0
                ? <>still <em>{fmtT(gap)} t over</em> the 1.5°C budget. The distance is not a rounding error; it is a decision.</>
                : <>which is <em>inside the 1.5°C budget</em>. Publish the method and take the bow.</>}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
