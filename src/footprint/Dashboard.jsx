import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SplitText from '../components/SplitText';
import { CATEGORIES, categoryById } from './data/factors';
import { classifyCharacter } from './data/characters';
import { EmblemDots } from './story/CarbonField';
import { BENCHMARKS, AUS_AVG, BUDGET_2030, BENCHMARK_CAVEAT } from './data/benchmarks';
import { DASH, HOTSPOTS, DASH_UI, fmtT } from './data/copy';
import { DASH_EXTRA, fill } from './data/storyCopy';
import { CountUp } from './story/CountUp';
import { TrendChart } from './charts';

const monthName = (key) => {
  const [y, m] = key.split('-');
  return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Number(m) - 1] + ' ' + y;
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
};

export default function Dashboard({ agg, period, compareAgg, comparePeriod, isExample }) {
  const [compareOn, setCompareOn] = useState(false);
  const character = useMemo(() => classifyCharacter(agg), [agg]);
  const total = agg.total;
  const cats = CATEGORIES
    .map((c) => ({ ...c, t: agg.byCategory[c.id] || 0 }))
    .filter((c) => c.t > 0);
  const ranked = [...cats].sort((a, b) => b.t - a.t);
  const flightsDominate = ranked.length && ranked[0].id === 'flight' && ranked[0].t / (total || 1) > 0.4;

  const compare = compareOn && compareAgg ? compareAgg : null;
  // With the overlay on, include categories only the other audit has, and
  // share one scale so the two audits read honestly.
  const rows = compare
    ? [
      ...ranked,
      ...CATEGORIES.filter((c) => !(agg.byCategory[c.id] > 0) && (compare.byCategory[c.id] || 0) > 0)
        .map((c) => ({ ...c, t: 0 })),
    ]
    : ranked;
  const maxCat = Math.max(
    ranked.length ? ranked[0].t : 1,
    compare ? Math.max(...Object.values(compare.byCategory), 0) : 0,
  ) || 1;
  const compareLabel = isExample ? DASH_EXTRA.compare.vsOwn : DASH_EXTRA.compare.vsExample;

  return (
    <section id="fp-dash">
      <div className="canvas">
        <div className="sec-tag" data-idx="01 / ">The audit · {period.label}</div>
        <h2 className="display fp-h2"><SplitText text={DASH.title[0]} /> <SplitText text={DASH.title[1]} accentIndex={0} /></h2>
        <p className="fp-sub">{DASH.sub}</p>

        <motion.div className="fp-kpis" {...fadeUp}>
          <div className="fp-kpi live">
            <div className="fp-kpi-l">{period.label} {DASH.kpis.total}</div>
            <div className="fp-kpi-v"><CountUp value={total} decimals={1} duration={0.9} ticks={false} /><span> tCO₂-e</span></div>
            {agg.uncertainty && agg.uncertainty.band > 0.005 && (
              <div className="fp-kpi-n">{fill(DASH.kpis.range, { low: fmtT(agg.uncertainty.low), high: fmtT(agg.uncertainty.high) })}</div>
            )}
          </div>
          <div className="fp-kpi">
            <div className="fp-kpi-l">{DASH.kpis.aus}</div>
            <div className="fp-kpi-v"><CountUp value={Math.round((total / AUS_AVG.tco2e) * 100)} decimals={0} duration={0.9} ticks={false} /><span>%</span></div>
          </div>
          <div className="fp-kpi">
            <div className="fp-kpi-l">{DASH.kpis.budget}</div>
            <div className="fp-kpi-v"><CountUp value={total / BUDGET_2030.tco2e} decimals={1} duration={0.9} ticks={false} /><span>×</span></div>
          </div>
          <div className="fp-kpi">
            <div className="fp-kpi-l">{DASH.kpis.largest}</div>
            <div className="fp-kpi-v">{agg.largest ? fmtT(agg.largest.tco2e) : '0'}<span> t</span></div>
            {agg.largest && <div className="fp-kpi-n">{agg.largest.label}</div>}
          </div>
        </motion.div>
        {total > 0 && (
        <motion.div className="fp-char-strip" {...fadeUp}>
          <EmblemDots stencil={character.stencil} hex={character.hex} size={40} />
          <span>
            <strong>{DASH_EXTRA.characterLabel}: {character.name}.</strong> {character.tagline}
          </span>
        </motion.div>
        )}
        <p className="fp-caveat">{BENCHMARK_CAVEAT}</p>

        <div className="fp-scopes">
          {DASH.scopes.map((s, i) => {
            const t = agg.byScope[s.n] || 0;
            return (
              <motion.div className="fp-scope" key={s.n} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
                <div className="fp-scope-tag">{s.title}</div>
                <div className="fp-scope-v">{fmtT(t, 2)}<span> t</span><em>{total > 0 ? ' · ' + Math.round((t / total) * 100) + '%' : ''}</em></div>
                <div className="fp-scope-b">{s.body}</div>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="fp-card" {...fadeUp}>
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
              {total > 0 ? ' · ' + Math.round((agg.worstMonth.total / total) * 100) + DASH_UI.worstSuffix : ''}
            </div>
          )}
        </motion.div>

        <motion.div className="fp-card" {...fadeUp}>
          <div className="fp-card-toprow">
            <div>
              <div className="fp-card-head">{DASH.catTitle}</div>
              <div className="fp-card-sub">{DASH.catSub}</div>
            </div>
            {compareAgg && (
              <button
                type="button"
                className={'fp-compare' + (compareOn ? ' on' : '')}
                aria-pressed={compareOn}
                onClick={() => setCompareOn((v) => !v)}
              >
                {compareLabel}
              </button>
            )}
          </div>
          <div className="fp-cats">
            {rows.map((c, i) => {
              const other = compare ? compare.byCategory[c.id] || 0 : null;
              return (
                <div className="fp-cat-row" key={c.id}>
                  <div className="fp-cat-name"><span className="fp-leg-dot" style={{ background: c.hex }} />{c.label}</div>
                  <div className="fp-cat-bar">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: '-8% 0px' }}
                      transition={{ duration: 0.35, delay: i * 0.05, ease: [0.25, 1, 0.5, 1] }}
                      style={{ width: (c.t / maxCat) * 100 + '%', background: c.hex, transformOrigin: 'left' }}
                    />
                    {other != null && (
                      <span
                        className="fp-cat-diamond"
                        style={{ left: `max(0px, calc(${Math.min(100, (other / maxCat) * 100)}% - 5px))`, borderColor: c.hex }}
                        title={(comparePeriod ? comparePeriod.label + ': ' : '') + fmtT(other, 2) + ' t'}
                        aria-label={(comparePeriod ? comparePeriod.label + ': ' : '') + fmtT(other, 2) + ' t'}
                        role="img"
                      />
                    )}
                  </div>
                  <div className="fp-cat-val">{fmtT(c.t, 2)} t</div>
                  <div className="fp-cat-pct">{total > 0 ? Math.round((c.t / total) * 100) + '%' : ''}</div>
                </div>
              );
            })}
          </div>
          {compare && (
            <p className="fp-note">
              {DASH_EXTRA.compare.note}{' '}
              {comparePeriod ? fill(DASH_EXTRA.compare.overlaid, { label: comparePeriod.label, t: fmtT(compare.total) }) : ''}
            </p>
          )}
        </motion.div>

        <div className="fp-hotspot-block" id="fp-hotspots">
          <div className="sec-tag" data-idx="02 / ">Hotspots</div>
          <h2 className="display fp-h2"><SplitText text={HOTSPOTS.title[0]} /> <SplitText text={HOTSPOTS.title[1]} accentIndex={1} /></h2>
          <p className="fp-sub">{HOTSPOTS.sub}</p>
          <div className="fp-hotcards">
            {ranked.slice(0, 3).map((c, i) => (
              <motion.div className="fp-hotcard" key={c.id} style={{ '--hc': c.hex }} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
                <div className="fp-hot-rank">{'0' + (i + 1)}</div>
                <div className="fp-hot-name">{c.label}</div>
                <div className="fp-hot-v"><CountUp value={c.t} decimals={1} duration={1} delay={i * 0.08} ticks={false} /><span> t</span></div>
                <div className="fp-hot-pct">{total > 0 ? Math.round((c.t / total) * 100) + DASH_UI.hotPct : ''}</div>
              </motion.div>
            ))}
          </div>
          <p className="fp-callout">{flightsDominate ? HOTSPOTS.flightCallout : HOTSPOTS.genericCallout}</p>
        </div>

        <details className="fp-bench-detail">
          <summary>{DASH_UI.benchSummary}</summary>
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
