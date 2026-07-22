// Shared OpenNEM/OpenElectricity client for the grid tools (/grid/ and
// /progress/). One integration point, used by both pages, so the source,
// the parsing and the failure behaviour stay identical everywhere.
//
// Data source: OpenNEM (openelectricity.org.au, formerly opennem.org.au)
// publishes the AEMO NEM dispatch data it aggregates as public static JSON,
// one file per region, updated every few minutes. We read the 7-day power
// file and derive a generation-weighted emissions intensity from the fuel
// technology mix.
//
// Honesty notes, which the UI must carry:
// - The per-fuel emission factors below are indicative technology averages
//   (see FUELTECH_FACTORS), not per-generator measurements, so the derived
//   gCO2e/kWh is an estimate of generation intensity, not a settlement-grade
//   figure. It is a different quantity from the annual NGA Scope 2 factor
//   (consumption-based, losses included) shown on the explorer view.
// - Every fetch can fail (offline, API moved, ad blocker). Callers always
//   receive either { live: true, ... } or { live: false } and must show the
//   bundled typical-pattern fallback AS an estimate, never as live data.

// Regions of the NEM. WA (SWIS) and NT are not in the NEM, so a live number
// is not available from this source; the UI says so rather than pretending.
export const NEM_REGIONS = {
  NSW1: { state: 'NSW', label: 'New South Wales' },
  QLD1: { state: 'QLD', label: 'Queensland' },
  SA1: { state: 'SA', label: 'South Australia' },
  TAS1: { state: 'TAS', label: 'Tasmania' },
  VIC1: { state: 'VIC', label: 'Victoria' },
};

// Indicative sent-out emissions intensity by fuel technology, t CO2e per MWh.
// Anchored on the technology averages OpenNEM itself uses for its emissions
// view and on DCCEEW/AEMO published generator averages: black coal ~0.9,
// brown coal ~1.2, CCGT ~0.4, OCGT/steam gas ~0.55-0.65, liquids ~0.75.
// Bioenergy is counted at zero combustion CO2e here (biogenic), which
// understates its full life-cycle figure; it is a rounding-level share of NEM
// generation. Everything renewable, storage and hydro is zero at the point of
// generation.
export const FUELTECH_FACTORS = {
  coal_black: 0.9,
  coal_brown: 1.17,
  gas_ccgt: 0.42,
  gas_ocgt: 0.62,
  gas_steam: 0.66,
  gas_recip: 0.62,
  gas_wcmg: 0.55,
  gas_lfg: 0,
  distillate: 0.75,
  bioenergy_biogas: 0,
  bioenergy_biomass: 0,
  hydro: 0,
  wind: 0,
  solar_utility: 0,
  solar_rooftop: 0,
  battery_discharging: 0,
};

// Series that are loads, not generation: excluded from the mix entirely.
const NON_GENERATION = new Set(['battery_charging', 'pumps', 'exports', 'imports']);

const RENEWABLE = new Set([
  'hydro', 'wind', 'solar_utility', 'solar_rooftop',
  'bioenergy_biogas', 'bioenergy_biomass',
]);

// Mirrors, tried in order. Both serve the same static v3 JSON.
const HOSTS = [
  'https://data.openelectricity.org.au',
  'https://data.opennem.org.au',
];

const FETCH_TIMEOUT_MS = 9000;

function fetchWithTimeout(url) {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS) : null;
  return fetch(url, { signal: ctrl ? ctrl.signal : undefined, mode: 'cors' })
    .finally(() => { if (timer) clearTimeout(timer); });
}

async function fetchRegionJson(region) {
  let lastErr;
  for (const host of HOSTS) {
    try {
      const res = await fetchWithTimeout(`${host}/v3/stats/au/NEM/${region}/power/7d.json`);
      if (res.ok) return await res.json();
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('unreachable');
}

// Pull the fuel-tech power series out of the v3 payload, tolerantly: we match
// on the id suffix rather than trusting any one field so a minor schema shift
// degrades to "not live" instead of a wrong number.
function extractPowerSeries(json) {
  const rows = Array.isArray(json && json.data) ? json.data : [];
  const series = [];
  for (const row of rows) {
    if (!row || row.type !== 'power' || !row.history) continue;
    const id = String(row.id || '');
    const ft = row.fuel_tech || (id.includes('fuel_tech.') ? id.split('fuel_tech.')[1].split('.')[0] : null);
    if (!ft) continue;
    const h = row.history;
    if (!Array.isArray(h.data) || !h.data.length) continue;
    series.push({
      fueltech: ft,
      intervalMinutes: parseIntervalMinutes(h.interval),
      lastISO: h.last,
      data: h.data,
    });
  }
  return series;
}

function parseIntervalMinutes(interval) {
  const m = /^(\d+)m$/.exec(String(interval || ''));
  return m ? Number(m[1]) : 30;
}

// Snapshot of one point in time across the series: MW per fueltech at the
// given index counted back from the end of each series.
function mixAt(series, backIndex) {
  const mix = {};
  let any = false;
  for (const s of series) {
    if (NON_GENERATION.has(s.fueltech)) continue;
    const v = s.data[s.data.length - 1 - backIndex];
    if (typeof v === 'number' && isFinite(v) && v > 0) {
      mix[s.fueltech] = (mix[s.fueltech] || 0) + v;
      any = true;
    }
  }
  return any ? mix : null;
}

function intensityOfMix(mix) {
  let genMW = 0;
  let emitTph = 0; // t CO2e per hour
  let renewMW = 0;
  let coalMW = 0;
  for (const [ft, mw] of Object.entries(mix)) {
    genMW += mw;
    emitTph += mw * (FUELTECH_FACTORS[ft] ?? 0);
    if (RENEWABLE.has(ft)) renewMW += mw;
    if (ft === 'coal_black' || ft === 'coal_brown') coalMW += mw;
  }
  if (genMW <= 0) return null;
  return {
    gPerKWh: Math.round((emitTph / genMW) * 1000),
    renewableShare: renewMW / genMW,
    coalShare: coalMW / genMW,
    generationMW: Math.round(genMW),
  };
}

// The latest reading for a region, plus a trailing ~24h intensity curve for
// the sparkline. Resolves to { live: false, error } on ANY failure; it never
// throws and never fabricates a number.
export async function fetchLiveIntensity(region) {
  if (!NEM_REGIONS[region]) return { live: false, error: 'unknown-region' };
  try {
    const json = await fetchRegionJson(region);
    const series = extractPowerSeries(json);
    if (!series.length) return { live: false, error: 'no-series' };

    // Walk back a few steps if the very latest interval is still empty.
    let now = null;
    let backIndex = 0;
    for (; backIndex < 6 && !now; backIndex++) {
      const mix = mixAt(series, backIndex);
      if (mix) now = intensityOfMix(mix);
    }
    if (!now) return { live: false, error: 'no-recent-data' };

    const stepMin = series[0].intervalMinutes || 30;
    const steps = Math.min(Math.ceil((24 * 60) / stepMin), Math.max(...series.map((s) => s.data.length)));
    const curve = [];
    for (let i = steps - 1; i >= 0; i--) {
      const mix = mixAt(series, i + backIndex - 1);
      const pt = mix ? intensityOfMix(mix) : null;
      curve.push(pt ? pt.gPerKWh : null);
    }

    const lastISO = series.map((s) => s.lastISO).filter(Boolean).sort().pop() || null;
    return {
      live: true,
      region,
      ...now,
      curve,           // gCO2e/kWh, oldest first, ~24h, nulls where no data
      curveStepMinutes: stepMin,
      asOfISO: lastISO,
      fetchedAtISO: new Date().toISOString(),
    };
  } catch (e) {
    return { live: false, error: (e && e.name === 'AbortError') ? 'timeout' : 'fetch-failed' };
  }
}

// Convenience for /progress/: the NEM-wide picture right now, aggregated
// across the five regions. Any region failing fails the whole call, because
// a partial NEM total would silently misstate the shares.
export async function fetchNemSnapshot() {
  const regions = Object.keys(NEM_REGIONS);
  const results = await Promise.all(regions.map((r) => fetchLiveIntensity(r)));
  if (results.some((r) => !r.live)) return { live: false, error: 'partial' };
  let genMW = 0; let coalMW = 0; let renewMW = 0; let emit = 0;
  for (const r of results) {
    genMW += r.generationMW;
    coalMW += r.coalShare * r.generationMW;
    renewMW += r.renewableShare * r.generationMW;
    emit += (r.gPerKWh / 1000) * r.generationMW;
  }
  if (genMW <= 0) return { live: false, error: 'no-data' };
  return {
    live: true,
    generationMW: Math.round(genMW),
    coalShare: coalMW / genMW,
    renewableShare: renewMW / genMW,
    gPerKWh: Math.round((emit / genMW) * 1000),
    asOfISO: results.map((r) => r.asOfISO).filter(Boolean).sort().pop() || null,
  };
}

export const OPENNEM_SOURCE = {
  name: 'OpenNEM (OpenElectricity)',
  detail: 'Public regional power JSON derived from AEMO NEM dispatch data, updated every few minutes. Intensity is derived here from the fuel technology mix using indicative technology-average factors, so treat it as an estimate.',
  url: 'https://explore.openelectricity.org.au/',
};
