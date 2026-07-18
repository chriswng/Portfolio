// Assurance-style audit pack: one self-contained HTML document holding the
// basis of preparation, the factor tables in force, the uncertainty
// statement and the full activity log. Built entirely in the browser from
// the same data the page renders; no scripts inside, print-to-PDF friendly.

import {
  FACTOR_SET, ELECTRICITY, ELECTRICITY_SOURCE, GAS, GAS_SOURCE,
  ROAD_FUELS, ROAD_MODES, ROAD_SOURCE, FLIGHT_FACTORS, FLIGHT_SOURCE, FLIGHT_RF_MULTIPLIER,
  FREIGHT_MODES, FREIGHT_SOURCE, DIET_TYPES, DIET_SOURCE,
  QUALITY_TIERS, QUALITY_SOURCE, qualityOf, categoryById,
} from '../data/factors';
import { METHOD, PACK, fmtT } from '../data/copy';
import { fill } from '../data/storyCopy';

const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Local date, never toISOString: Australian timezones land on the wrong day.
const todayLocal = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

const table = (caption, head, rows, source) => `
  <figure>
    <figcaption>${esc(caption)}</figcaption>
    <table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    ${source ? `<p class="src">${esc(source.name)}. ${esc(source.detail || '')}</p>` : ''}
  </figure>`;

const paras = (arr) => arr.map((p) => `<p>${esc(p)}</p>`).join('');

function methodBlocks(agg) {
  const flightsT = agg.byCategory.flight || 0;
  const noRfFlights = flightsT / FLIGHT_RF_MULTIPLIER;
  const noRfTotal = agg.total - flightsT + noRfFlights;
  return `
    <h3>${esc(METHOD.boundary.title)}</h3>${paras(METHOD.boundary.paras)}
    <h3>${esc(METHOD.period.title)}</h3>${paras(METHOD.period.paras)}
    <h3>${esc(METHOD.marketBased.title)}</h3>${paras(METHOD.marketBased.paras)}
    <h3>${esc(METHOD.quality.title)}</h3>${paras(METHOD.quality.paras)}
    <h3>${esc(METHOD.uncertainty.title)}</h3>${paras(METHOD.uncertainty.paras)}
    <h3>${esc(METHOD.sensitivity.title)}</h3>
    <p>${esc(fill(METHOD.sensitivity.para, { flights: fmtT(noRfFlights), total: fmtT(noRfTotal) }))}</p>
    <h3>${esc(METHOD.plan.title)}</h3>${paras(METHOD.plan.paras)}
    <h3>${esc(METHOD.refresh.title)}</h3>${paras(METHOD.refresh.paras)}
    <h3>${esc(METHOD.exclusions.title)}</h3>
    <ul>${METHOD.exclusions.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
}

function factorTables() {
  return [
    table('Electricity, by grid region (kg CO2-e per kWh)', ['Region', 'Scope 2', 'Scope 3'],
      Object.values(ELECTRICITY).map((r) => [r.label, r.s2.toFixed(2), r.s3.toFixed(2)]), ELECTRICITY_SOURCE),
    table('Natural gas, metro residential (kg CO2-e per MJ)', ['Component', 'Factor'],
      [['Scope 1 combustion', GAS.s1_per_MJ.toFixed(5)],
        ...Object.entries(GAS.s3_per_MJ).map(([st, v]) => ['Scope 3 fuel-cycle, ' + st, v.toFixed(4)])], GAS_SOURCE),
    table('Road fuels and modes', ['Item', 'Scope 1', 'Scope 3'],
      [['Petrol (per L)', ROAD_FUELS.petrol.s1_per_L.toFixed(2), ROAD_FUELS.petrol.s3_per_L.toFixed(2)],
        ['Diesel (per L)', ROAD_FUELS.diesel.s1_per_L.toFixed(2), ROAD_FUELS.diesel.s3_per_L.toFixed(2)],
        ['Rideshare / taxi (per km)', 'n/a', ROAD_MODES.rideshare.perKm.toFixed(3)],
        ['Public transport (per km)', 'n/a', ROAD_MODES.pt.perKm.toFixed(3)]], ROAD_SOURCE),
    table('Flights (kg CO2-e per passenger-km, radiative forcing included at x' + FLIGHT_RF_MULTIPLIER + ')',
      ['Band', 'Economy', 'Premium', 'Business', 'First'],
      Object.values(FLIGHT_FACTORS).map((b) => [b.label, b.withRF.economy, b.withRF.premium, b.withRF.business, b.withRF.first]), FLIGHT_SOURCE),
    table('Freight (kg CO2-e)', ['Mode', 'Factor', 'Unit'],
      [[FREIGHT_MODES.road.label, FREIGHT_MODES.road.perTonneKm.toFixed(3), 'per t-km'],
        [FREIGHT_MODES.air.label, FREIGHT_MODES.air.perTonneKm.toFixed(2), 'per t-km'],
        [FREIGHT_MODES.sea.label, FREIGHT_MODES.sea.perTonneKm.toFixed(3), 'per t-km'],
        [FREIGHT_MODES.parcel.label, FREIGHT_MODES.parcel.perParcel.toFixed(2), 'per parcel']], FREIGHT_SOURCE),
    table('Diet (kg CO2-e per day, indicative)', ['Diet', 'Per day'],
      Object.values(DIET_TYPES).map((d) => [d.label, d.perDay.toFixed(2)]), DIET_SOURCE),
    table('Data quality tiers and uncertainty bands', ['Tier', 'Band', 'Covers'],
      Object.values(QUALITY_TIERS).map((t) => [t.label, '±' + Math.round(t.band * 100) + '%', t.plain]), QUALITY_SOURCE),
  ].join('');
}

function logTable(entries) {
  const rows = [...entries]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((e) => [
      e.date, e.label, categoryById(e.category).label,
      Number(e.activity_data).toLocaleString() + ' ' + e.unit,
      e.factor_used + ' kg/' + e.unit,
      e.factor_source, e.scope,
      QUALITY_TIERS[qualityOf(e)].label,
      fmtT(e.tco2e, 3),
      e.notes || '',
    ]);
  return table(PACK.logTitle, ['Date', 'Entry', 'Category', 'Activity', 'Factor', 'Source', 'Scope', PACK.qualityLabel, 'tCO2-e', 'Notes'], rows);
}

export function buildAuditPack(profile, agg) {
  const scopeRows = ['1', '2', '3'].map((s) => ['Scope ' + s, fmtT(agg.byScope[s] || 0, 2) + ' t']);
  const catRows = Object.entries(agg.byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([id, t]) => [categoryById(id).label, fmtT(t, 2) + ' t']);
  const past = (profile.pastYears || []).map((y) => {
    const t = y.entries.reduce((s, e) => s + (e.tco2e || 0), 0);
    return [y.label, y.start + ' to ' + y.end, y.entries.length + ' entries', fmtT(t, 2) + ' t', y.factorSetAtClose || ''];
  });

  const html = `<!DOCTYPE html>
<html lang="en-AU"><head><meta charset="utf-8">
<title>${esc(PACK.fileTitle)} · ${esc(profile.period.label)}</title>
<style>
  body{font:15px/1.55 Georgia,'Times New Roman',serif;color:#1d211a;max-width:52rem;margin:2rem auto;padding:0 1.25rem}
  h1{font-size:1.7rem;margin:0 0 .2rem}h2{font-size:1.15rem;margin:2.2rem 0 .6rem;border-bottom:2px solid #1d211a;padding-bottom:.25rem}
  h3{font-size:1rem;margin:1.4rem 0 .4rem}
  .meta{color:#5c6156;font-size:.85rem;margin-bottom:1.6rem}
  table{border-collapse:collapse;width:100%;font-size:.8rem;margin:.4rem 0}
  th,td{border:1px solid #c9ccc2;padding:.3rem .45rem;text-align:left;vertical-align:top}
  th{background:#f0f1ea}
  figure{margin:1.1rem 0}figcaption{font-weight:700;font-size:.85rem;margin-bottom:.2rem}
  .src{color:#5c6156;font-size:.75rem;margin:.25rem 0 0}
  .kpis td:first-child{font-weight:700;width:14rem}
  .disc{color:#5c6156;font-size:.8rem;border-top:1px solid #c9ccc2;margin-top:2.4rem;padding-top:.8rem}
  @media print{body{margin:.5cm auto}h2{break-after:avoid}figure{break-inside:avoid}}
</style></head><body>
<h1>${esc(PACK.fileTitle)}</h1>
<p class="meta">${esc(PACK.periodLabel)}: ${esc(profile.period.label)} (${esc(profile.period.start)} to ${esc(profile.period.end)})
 · ${esc(PACK.generated)}: ${todayLocal()}
 · ${esc(PACK.factorSetLabel)}: ${esc(FACTOR_SET.id)}, ${esc(FACTOR_SET.updated)}</p>

<h2>Summary</h2>
<table class="kpis">
  <tr><td>${esc(PACK.totalLabel)}</td><td>${fmtT(agg.total, 2)} tCO2-e</td></tr>
  <tr><td>${esc(PACK.rangeLabel)}</td><td>${fmtT(agg.uncertainty.low, 2)} to ${fmtT(agg.uncertainty.high, 2)} t</td></tr>
  ${scopeRows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}
</table>
${table(PACK.categoryLabel, ['Category', 'tCO2-e'], catRows)}

<h2>Basis of preparation</h2>
${methodBlocks(agg)}

<h2>Emission factors in force</h2>
${factorTables()}

<h2>${esc(PACK.logTitle)}</h2>
${logTable(profile.entries.filter((e) => e.date >= profile.period.start && e.date <= profile.period.end))}

${past.length ? `<h2>${esc(PACK.pastTitle)}</h2>${table(PACK.pastTitle, ['Year', 'Period', 'Entries', 'Total', 'Factor set at close'], past)}` : ''}

<p class="disc">${esc(PACK.packDisclaimer)}</p>
</body></html>`;

  return html;
}

export function downloadAuditPack(profile, agg) {
  const html = buildAuditPack(profile, agg);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'life-footprint-audit-pack-' + profile.period.label.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
