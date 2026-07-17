import SplitText from '../components/SplitText';
import { CATEGORIES, categoryById } from './data/factors';
import { BENCHMARKS, AUS_AVG, BUDGET_2030, BENCHMARK_CAVEAT } from './data/benchmarks';
import { DASH, HOTSPOTS, fmtT } from './data/copy';
import { TrendChart } from './charts';

const monthName = (key) => {
  const [y, m] = key.split('-');
  return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Number(m) - 1] + ' ' + y;
};

export default function Dashboard({ agg, period }) {
  const total = agg.total;
  const cats = CATEGORIES
    .map((c) => ({ ...c, t: agg.byCategory[c.id] || 0 }))
    .filter((c) => c.t > 0);
  const ranked = [...cats].sort((a, b) => b.t - a.t);
  const maxCat = ranked.length ? ranked[0].t : 1;
  const flightsDominate = ranked.length && ranked[0].id === 'flight' && ranked[0].t / (total || 1) > 0.4;

  return (
    <section id="fp-dash">
      <div className="canvas">
        <div className="sec-tag" data-idx="01 / ">The audit · {period.label}</div>
        <h2 className="display fp-h2"><SplitText text={DASH.title[0]} /> <SplitText text={DASH.title[1]} accentIndex={0} /></h2>
        <p className="fp-sub">{DASH.sub}</p>

        <div className="fp-kpis">
          <div className="fp-kpi live">
            <div className="fp-kpi-l">{period.label} {DASH.kpis.total}</div>
            <div className="fp-kpi-v">{fmtT(total)}<span> tCO₂-e</span></div>
          </div>
          <div className="fp-kpi">
            <div className="fp-kpi-l">{DASH.kpis.aus}</div>
            <div className="fp-kpi-v">{Math.round((total / AUS_AVG.tco2e) * 100)}<span>%</span></div>
          </div>
          <div className="fp-kpi">
            <div className="fp-kpi-l">{DASH.kpis.budget}</div>
            <div className="fp-kpi-v">{(total / BUDGET_2030.tco2e).toFixed(1)}<span>×</span></div>
          </div>
          <div className="fp-kpi">
            <div className="fp-kpi-l">{DASH.kpis.largest}</div>
            <div className="fp-kpi-v">{agg.largest ? fmtT(agg.largest.tco2e) : '0'}<span> t</span></div>
            {agg.largest && <div className="fp-kpi-n">{agg.largest.label}</div>}
          </div>
        </div>
        <p className="fp-caveat">{BENCHMARK_CAVEAT}</p>

        <div className="fp-scopes">
          {DASH.scopes.map((s) => {
            const t = agg.byScope[s.n] || 0;
            return (
              <div className="fp-scope" key={s.n}>
                <div className="fp-scope-tag">{s.title}</div>
                <div className="fp-scope-v">{fmtT(t, 2)}<span> t</span><em>{total > 0 ? ' · ' + Math.round((t / total) * 100) + '%' : ''}</em></div>
                <div className="fp-scope-b">{s.body}</div>
              </div>
            );
          })}
        </div>

        <div className="fp-card">
          <div className="fp-card-head">{DASH.trendTitle}</div>
          <div className="fp-card-sub">{DASH.trendSub}</div>
          <TrendChart agg={agg} />
          <div className="fp-legend" aria-hidden="true">
            {cats.map((c) => (
              <span className="fp-leg-item" key={c.id}><span className="fp-leg-dot" style={{ background: c.hex }} />{c.label}</span>
            ))}
          </div>
          {agg.worstMonth && agg.worstMonth.total > 0 && (
            <div className="fp-worst">
              <span className="fp-worst-tag">{DASH.worstLabel}</span>
              {monthName(agg.worstMonth.month)} · {fmtT(agg.worstMonth.total, 2)} t
              {total > 0 ? ' · ' + Math.round((agg.worstMonth.total / total) * 100) + '% of the year in one month' : ''}
            </div>
          )}
        </div>

        <div className="fp-card">
          <div className="fp-card-head">{DASH.catTitle}</div>
          <div className="fp-card-sub">{DASH.catSub}</div>
          <div className="fp-cats">
            {ranked.map((c) => (
              <div className="fp-cat-row" key={c.id}>
                <div className="fp-cat-name"><span className="fp-leg-dot" style={{ background: c.hex }} />{c.label}</div>
                <div className="fp-cat-bar"><div style={{ width: (c.t / maxCat) * 100 + '%', background: c.hex }} /></div>
                <div className="fp-cat-val">{fmtT(c.t, 2)} t</div>
                <div className="fp-cat-pct">{total > 0 ? Math.round((c.t / total) * 100) + '%' : ''}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="fp-hotspot-block" id="fp-hotspots">
          <div className="sec-tag" data-idx="02 / ">Hotspots</div>
          <h2 className="display fp-h2"><SplitText text={HOTSPOTS.title[0]} /> <SplitText text={HOTSPOTS.title[1]} accentIndex={1} /></h2>
          <p className="fp-sub">{HOTSPOTS.sub}</p>
          <div className="fp-hotcards">
            {ranked.slice(0, 3).map((c, i) => (
              <div className="fp-hotcard" key={c.id} style={{ '--hc': c.hex }}>
                <div className="fp-hot-rank">{'0' + (i + 1)}</div>
                <div className="fp-hot-name">{c.label}</div>
                <div className="fp-hot-v">{fmtT(c.t)}<span> t</span></div>
                <div className="fp-hot-pct">{total > 0 ? Math.round((c.t / total) * 100) + '% of the year' : ''}</div>
              </div>
            ))}
          </div>
          <p className="fp-callout">{flightsDominate ? HOTSPOTS.flightCallout : HOTSPOTS.genericCallout}</p>
        </div>

        <details className="fp-bench-detail">
          <summary>How the benchmarks are set</summary>
          <ul>
            {BENCHMARKS.map((b) => (
              <li key={b.id}><strong>{b.label}: {b.tco2e} t.</strong> {b.basis}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
