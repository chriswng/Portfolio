import { useEffect, useRef, useState } from 'react';
import {
  Chart, BarController, BarElement, LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip,
} from 'chart.js';
import { CATEGORIES, categoryById } from './data/factors';
import { prefersReducedMotion } from '../utils/media';

// Register only what these charts use; chart.js/auto doubles the bundle.
Chart.register(BarController, BarElement, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const MONO = "'JetBrains Mono',monospace";
const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(15,23,42,0.96)', titleColor: '#F8FAFC', bodyColor: 'rgba(248,250,252,0.85)',
  titleFont: { family: MONO, size: 11 }, bodyFont: { family: MONO, size: 11 },
  borderColor: 'rgba(181,196,43,0.5)', borderWidth: 1,
};
const AXIS_TICKS = { font: { family: MONO, size: 10 }, color: '#64748B' };
const GRID = { color: 'rgba(15,23,42,0.05)' };

const monthLabel = (key) => {
  const [y, m] = key.split('-');
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m) - 1] + ' ' + y.slice(2);
};

// ---------------------------------------------------------------------------
// Monthly stacked bars by category.
// ---------------------------------------------------------------------------
export function TrendChart({ agg }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;
    const ch = new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: prefersReducedMotion() ? false : { duration: 350 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_STYLE,
            callbacks: {
              label: (c) => ' ' + c.dataset.label + ': ' + (Math.round(c.raw * 100) / 100).toFixed(2) + ' t',
              footer: (items) => 'Month total: ' + (Math.round(items.reduce((s, i) => s + i.raw, 0) * 100) / 100).toFixed(2) + ' t',
            },
            footerFont: { family: MONO, size: 11 },
          },
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: AXIS_TICKS },
          y: { stacked: true, grid: GRID, ticks: AXIS_TICKS, title: { display: true, text: 'tCO₂-e / month', font: { size: 10 }, color: '#64748B' } },
        },
      },
    });
    chartRef.current = ch;
    return () => { ch.destroy(); chartRef.current = null; };
  }, []);

  useEffect(() => {
    const ch = chartRef.current;
    if (!ch) return;
    ch.data.labels = agg.months.map(monthLabel);
    ch.data.datasets = CATEGORIES
      .filter((cat) => agg.months.some((m) => (agg.byMonth[m][cat.id] || 0) > 0))
      .map((cat) => ({
        label: cat.label,
        data: agg.months.map((m) => agg.byMonth[m][cat.id] || 0),
        backgroundColor: cat.hex,
        // 2px surface gap between stacked segments and bars.
        borderColor: '#FFFFFF', borderWidth: 1,
        maxBarThickness: 44,
      }));
    ch.update(prefersReducedMotion() ? 'none' : undefined);
  }, [agg]);

  return (
    <div className="fp-chart-wrap" style={{ height: 260 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={'Stacked monthly bar chart of the footprint by category. Worst month ' + (agg.worstMonth ? monthLabel(agg.worstMonth.month) + ' at ' + agg.worstMonth.total.toFixed(2) + ' tonnes.' : 'not available.')}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pathway line chart: frozen habits vs plan vs the 2030 budget line.
// ---------------------------------------------------------------------------
export function PathwayChart({ pathway, budget, labels }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;
    const ch = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: { labels: [], datasets: [
        { label: labels.bau, data: [], borderColor: '#6E7469', borderWidth: 2, borderDash: [5, 4], pointRadius: 0, fill: false, tension: 0.15 },
        { label: labels.plan, data: [], borderColor: '#1F2A1E', borderWidth: 2.5, backgroundColor: 'rgba(117,130,29,0.14)', fill: 'origin', pointRadius: 0, tension: 0.15 },
        { label: labels.budget, data: [], borderColor: '#C7274A', borderWidth: 1.5, borderDash: [2, 3], pointRadius: 0, fill: false },
      ] },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: prefersReducedMotion() ? false : { duration: 350 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_STYLE,
            callbacks: { label: (c) => ' ' + c.dataset.label + ': ' + (Math.round(c.raw * 100) / 100).toFixed(2) + ' t' },
          },
        },
        scales: {
          x: { grid: GRID, ticks: AXIS_TICKS },
          y: { grid: GRID, beginAtZero: true, ticks: AXIS_TICKS, title: { display: true, text: 'tCO₂-e / year', font: { size: 10 }, color: '#64748B' } },
        },
      },
    });
    chartRef.current = ch;
    return () => { ch.destroy(); chartRef.current = null; };
  }, [labels.bau, labels.plan, labels.budget]);

  useEffect(() => {
    const ch = chartRef.current;
    if (!ch) return;
    ch.data.labels = pathway.years.map((y) => 'FY' + y);
    ch.data.datasets[0].data = pathway.bau;
    ch.data.datasets[1].data = pathway.plan;
    ch.data.datasets[2].data = pathway.years.map(() => budget);
    ch.update('none');
  }, [pathway, budget]);

  return (
    <div className="fp-chart-wrap" style={{ height: 280 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={'Line chart of the projected annual footprint. With the current plan the pathway reaches ' + pathway.plan[pathway.plan.length - 1].toFixed(1) + ' tonnes by FY' + pathway.years[pathway.years.length - 1] + ', against a 1.5 degree budget of ' + budget + ' tonnes.'}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Personal MACC: variable-width bars, cost per tonne (y) against cumulative
// abatement (x). Custom SVG because no charting library draws one honestly.
// ---------------------------------------------------------------------------
export function MaccChart({ rows }) {
  const [tip, setTip] = useState(null);
  const live = rows.filter((r) => r.applicable && r.reduction > 0.004 && r.costPerTonne != null)
    .sort((a, b) => a.costPerTonne - b.costPerTonne);
  if (!live.length) return <p className="fp-empty">Nothing applicable to plot yet. Add some entries first.</p>;

  const W = 720, H = 300, padL = 56, padR = 10, padT = 16, padB = 34;
  const totalRed = live.reduce((s, r) => s + r.reduction, 0);

  // MACC-standard axis capping: tiny-tonnage behavioural options can carry
  // enormous negative $/t and would squash every other bar. Bars beyond the
  // cap draw to the cap and are flagged; the exact figure stays in the label.
  const CAP_MIN = -1200, CAP_MAX = 2500;
  const disp = (c) => Math.max(CAP_MIN, Math.min(CAP_MAX, c));
  const clamped = live.some((r) => r.costPerTonne < CAP_MIN || r.costPerTonne > CAP_MAX);
  const minC = Math.min(-50, ...live.map((r) => disp(r.costPerTonne)));
  const maxC = Math.max(150, ...live.map((r) => disp(r.costPerTonne)));
  const xFor = (cum) => padL + (cum / totalRed) * (W - padL - padR);
  const yFor = (c) => padT + ((maxC - c) / (maxC - minC)) * (H - padT - padB);
  const y0 = yFor(0);

  const tickStep = (maxC - minC) > 1500 ? 500 : (maxC - minC) > 600 ? 250 : 100;
  const yTicks = [];
  for (let v = Math.ceil(minC / tickStep) * tickStep; v <= maxC; v += tickStep) yTicks.push(v);
  if (!yTicks.includes(0)) yTicks.push(0);

  let cum = 0;
  const bars = live.map((r) => {
    const x = xFor(cum) + 1;
    const w = Math.max(2, xFor(cum + r.reduction) - xFor(cum) - 2);
    cum += r.reduction;
    const yv = yFor(disp(r.costPerTonne));
    const offScale = r.costPerTonne < CAP_MIN || r.costPerTonne > CAP_MAX;
    return { ...r, x, w, y: Math.min(y0, yv), h: Math.max(2, Math.abs(y0 - yv)), below: r.costPerTonne < 0, offScale };
  });

  return (
    <div className="fp-macc">
      <svg viewBox={'0 0 ' + W + ' ' + H} role="img" style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-label={'Marginal abatement cost curve: ' + live.map((r) => r.action + ' abates ' + r.reduction.toFixed(2) + ' tonnes a year at ' + (r.costPerTonne < 0 ? 'a saving of $' + Math.abs(r.costPerTonne) : '$' + r.costPerTonne) + ' per tonne').join('; ') + '.'}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={yFor(v)} y2={yFor(v)} stroke="rgba(15,23,42,0.07)" strokeWidth="1" />
            <text x={padL - 6} y={yFor(v) + 3} textAnchor="end" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#64748B">{'$' + v.toLocaleString()}</text>
          </g>
        ))}
        <line x1={padL} x2={W - padR} y1={y0} y2={y0} stroke="#475569" strokeWidth="1.5" />
        {bars.map((b) => (
          <g key={b.id} tabIndex={0} className="fp-macc-bar" role="img"
            aria-label={b.action + ': ' + b.reduction.toFixed(2) + ' tonnes a year at ' + (b.costPerTonne < 0 ? 'a saving of $' + Math.abs(b.costPerTonne) : '$' + b.costPerTonne) + ' per tonne' + (b.offScale ? ', beyond the axis cap' : '')}
            onMouseEnter={() => setTip(b)} onMouseLeave={() => setTip(null)}
            onFocus={() => setTip(b)} onBlur={() => setTip(null)}>
            <title>{b.action + ': ' + b.reduction.toFixed(2) + ' t/yr at ' + (b.costPerTonne < 0 ? '-$' + Math.abs(b.costPerTonne) : '$' + b.costPerTonne) + '/t' + (b.offScale ? ' (beyond the axis cap)' : '')}</title>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={categoryById(b.category).hex} opacity="0.85" rx="2" />
            {b.offScale && (
              <text x={b.x + b.w / 2} y={b.below ? b.y + b.h - 4 : b.y + 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">⌄</text>
            )}
          </g>
        ))}
        <text x={W - padR} y={H - 8} textAnchor="end" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#64748B">
          {'cumulative abatement → ' + totalRed.toFixed(1) + ' t/yr'}
        </text>
        <text x={12} y={padT + 2} fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#64748B" transform={'rotate(-90 12 ' + (padT + 2) + ')'} textAnchor="end">$ / tCO₂-e</text>
      </svg>
      <div className="fp-macc-tip" aria-live="polite">
        {tip ? (
          <>
            <span className="fp-macc-tip-dot" style={{ background: categoryById(tip.category).hex }} />
            <strong>{tip.action}</strong>
            <span>{tip.reduction.toFixed(2)} t/yr · {tip.costPerTonne < 0 ? 'saves $' + Math.abs(tip.costPerTonne) : 'costs $' + tip.costPerTonne}/t · {tip.effort} effort</span>
          </>
        ) : (
          <span>
            Hover or tab across the bars. Width is tonnes; below the line pays you.
            {clamped ? ' Axis capped at -$' + Math.abs(CAP_MIN).toLocaleString() + '/t, MACC convention; marked bars run further and carry their true figure.' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
