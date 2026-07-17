// Calculation engine for the Life Footprint Dashboard.
// Pure functions, no DOM: prices activity entries from the factor tables,
// aggregates them for the dashboard, and projects the abatement pathway.

import {
  ELECTRICITY, ELECTRICITY_SOURCE, GRID_DECLINE,
  GAS, GAS_SOURCE, gasS3,
  ROAD_FUELS, ROAD_MODES, ROAD_SOURCE,
  FLIGHT_FACTORS, FLIGHT_SOURCE, FLIGHT_DISTANCE_UPLIFT, flightBandForKm,
  FREIGHT_MODES, FREIGHT_SOURCE,
  DIET_TYPES, DIET_SOURCE,
  OTHER_FUELS, OTHER_SOURCE,
} from '../data/factors';
import { ABATEMENT_OPTIONS, APPLY_ORDER } from '../data/abatement';

let idCounter = 0;
export const newId = (prefix = 'e') =>
  prefix + '-' + Date.now().toString(36) + '-' + (idCounter++).toString(36) + Math.random().toString(36).slice(2, 6);

const round = (v, dp = 4) => Math.round(v * 10 ** dp) / 10 ** dp;

// ---------------------------------------------------------------------------
// Entry pricing. Takes a draft { category, date, label, notes, period_months,
// meta } plus profile settings, returns a complete schema-shaped entry:
// activity_data, unit, factor_used (effective per-unit), factor_source,
// scope (dominant), tco2e, and per-scope components for scope reporting.
// The factor is snapshotted onto the entry at pricing time.
// ---------------------------------------------------------------------------
export function priceEntry(draft, settings) {
  const meta = draft.meta || {};
  const share = meta.wholeHousehold ? 1 / Math.max(1, settings.householdSize || 1) : 1;
  let activity = 0, unit = '', components = [], scope = '3', source = '';

  switch (draft.category) {
    case 'electricity': {
      const f = ELECTRICITY[settings.state] || ELECTRICITY.NSW;
      const gp = Math.min(1, Math.max(0, (settings.greenpowerPct || 0) / 100));
      activity = meta.kwh; unit = 'kWh';
      // Market-based scope 2 nets off GreenPower; scope 3 retained in full
      // (conservative treatment of losses and fuel cycle).
      components = [
        { scope: '2', tco2e: activity * f.s2 * (1 - gp) * share / 1000 },
        { scope: '3', tco2e: activity * f.s3 * share / 1000 },
      ];
      scope = '2'; source = ELECTRICITY_SOURCE.name + ' (' + f.label + (gp > 0 ? ', ' + Math.round(gp * 100) + '% GreenPower market-based' : '') + ')';
      break;
    }
    case 'gas': {
      activity = meta.mj; unit = 'MJ';
      components = [
        { scope: '1', tco2e: activity * GAS.s1_per_MJ * share / 1000 },
        { scope: '3', tco2e: activity * gasS3(settings.state) * share / 1000 },
      ];
      scope = '1'; source = GAS_SOURCE.name + ' (metro, ' + (settings.state || 'NSW') + ')';
      break;
    }
    case 'road': {
      const mode = meta.mode || 'car';
      if (mode === 'rideshare' || mode === 'taxi') {
        activity = meta.km; unit = 'km';
        components = [{ scope: '3', tco2e: meta.km * ROAD_MODES.rideshare.perKm / 1000 }];
        scope = '3'; source = ROAD_MODES.rideshare.source.split('.')[0] + '.';
      } else if (mode === 'pt') {
        activity = meta.km; unit = 'km';
        components = [{ scope: '3', tco2e: meta.km * ROAD_MODES.pt.perKm / 1000 }];
        scope = '3'; source = ROAD_MODES.pt.source.split('.')[0] + '.';
      } else if (meta.fuel === 'ev') {
        const f = ELECTRICITY[settings.state] || ELECTRICITY.NSW;
        const kwh = meta.km * ROAD_FUELS.ev.kWhPerKm;
        activity = meta.km; unit = 'km';
        components = [
          { scope: '2', tco2e: kwh * f.s2 / 1000 },
          { scope: '3', tco2e: kwh * f.s3 / 1000 },
        ];
        scope = '2'; source = ELECTRICITY_SOURCE.name + ' (EV at ' + ROAD_FUELS.ev.kWhPerKm + ' kWh/km, ' + f.label + ')';
      } else {
        const fuel = ROAD_FUELS[meta.fuel] || ROAD_FUELS.petrol;
        const litres = meta.litres != null ? meta.litres : (meta.km * (meta.l100km || fuel.defaultL100km)) / 100;
        activity = meta.litres != null ? litres : meta.km;
        unit = meta.litres != null ? 'L' : 'km';
        components = [
          { scope: '1', tco2e: litres * fuel.s1_per_L / 1000 },
          { scope: '3', tco2e: litres * fuel.s3_per_L / 1000 },
        ];
        scope = '1'; source = ROAD_SOURCE.name + ' (' + fuel.label.toLowerCase() + ')';
      }
      break;
    }
    case 'flight': {
      const band = meta.band || flightBandForKm(meta.km, meta.international);
      const cabin = meta.cabin || 'economy';
      const legs = meta.return ? 2 : 1;
      const paxkm = meta.km * FLIGHT_DISTANCE_UPLIFT * legs * (meta.passengers || 1);
      const perKm = FLIGHT_FACTORS[band].withRF[cabin] || FLIGHT_FACTORS[band].withRF.economy;
      activity = Math.round(paxkm); unit = 'pax-km';
      components = [{ scope: '3', tco2e: paxkm * perKm / 1000 }];
      scope = '3';
      source = FLIGHT_SOURCE.name + ' (' + FLIGHT_FACTORS[band].label.toLowerCase() + ', ' + cabin + ', with RF)';
      break;
    }
    case 'freight': {
      if (meta.parcels != null) {
        activity = meta.parcels; unit = 'parcels';
        components = [{ scope: '3', tco2e: meta.parcels * FREIGHT_MODES.parcel.perParcel / 1000 }];
      } else {
        const mode = FREIGHT_MODES[meta.mode] || FREIGHT_MODES.road;
        activity = meta.tonneKm; unit = 't-km';
        components = [{ scope: '3', tco2e: meta.tonneKm * mode.perTonneKm / 1000 }];
      }
      scope = '3'; source = FREIGHT_SOURCE.name;
      break;
    }
    case 'diet': {
      const dt = DIET_TYPES[meta.dietType] || DIET_TYPES.medMeat;
      activity = meta.days; unit = 'days';
      components = [{ scope: '3', tco2e: meta.days * dt.perDay / 1000 }];
      scope = '3'; source = DIET_SOURCE.name + ' (' + dt.label.toLowerCase() + ')';
      break;
    }
    case 'other': {
      const f = OTHER_FUELS[meta.fuel] || OTHER_FUELS.lpg;
      activity = meta.amount; unit = f.unit;
      components = [
        { scope: '1', tco2e: activity * f.s1 * share / 1000 },
        { scope: '3', tco2e: activity * f.s3 * share / 1000 },
      ];
      scope = '1'; source = OTHER_SOURCE.name;
      break;
    }
    default:
      throw new Error('Unknown category: ' + draft.category);
  }

  const tco2e = components.reduce((s, c) => s + c.tco2e, 0);
  return {
    id: draft.id || newId(),
    date: draft.date,
    category: draft.category,
    label: draft.label || '',
    activity_data: round(activity, 1),
    unit,
    factor_used: activity > 0 ? round((tco2e * 1000) / activity, 4) : 0,
    factor_source: source,
    scope,
    tco2e: round(tco2e),
    notes: draft.notes || '',
    period_months: draft.period_months || 0,
    meta,
    components: components.map((c) => ({ scope: c.scope, tco2e: round(c.tco2e) })),
  };
}

// ---------------------------------------------------------------------------
// Aggregation.
// ---------------------------------------------------------------------------
const monthKey = (d) => d.slice(0, 7);

function addMonths(key, delta) {
  const [y, m] = key.split('-').map(Number);
  const t = y * 12 + (m - 1) + delta;
  const yy = Math.floor(t / 12), mm = (t % 12) + 1;
  return yy + '-' + String(mm).padStart(2, '0');
}

export function monthsBetween(startKey, endKey) {
  const out = [];
  let k = startKey;
  while (k <= endKey && out.length < 60) { out.push(k); k = addMonths(k, 1); }
  return out;
}

export function aggregate(profile) {
  const { entries, period } = profile;
  const months = monthsBetween(monthKey(period.start), monthKey(period.end));
  const inWindow = entries.filter((e) => e.date >= period.start && e.date <= period.end);

  const byCategory = {}, byScope = { 1: 0, 2: 0, 3: 0 };
  const byMonth = Object.fromEntries(months.map((m) => [m, {}]));
  let total = 0, largest = null;

  for (const e of inWindow) {
    total += e.tco2e;
    byCategory[e.category] = (byCategory[e.category] || 0) + e.tco2e;
    for (const c of e.components || [{ scope: e.scope, tco2e: e.tco2e }]) byScope[c.scope] += c.tco2e;
    if (!largest || e.tco2e > largest.tco2e) largest = e;
    // Spread bills across the months they cover (date = period end).
    const span = Math.max(1, e.period_months || 1);
    const endK = monthKey(e.date);
    for (let i = 0; i < span; i++) {
      const k = addMonths(endK, -i);
      if (byMonth[k]) byMonth[k][e.category] = (byMonth[k][e.category] || 0) + e.tco2e / span;
    }
  }

  let worstMonth = null;
  for (const m of months) {
    const t = Object.values(byMonth[m]).reduce((s, v) => s + v, 0);
    if (!worstMonth || t > worstMonth.total) worstMonth = { month: m, total: t, cats: byMonth[m] };
  }

  return { months, byMonth, byCategory, byScope, total, largest, worstMonth, count: inWindow.length };
}

// ---------------------------------------------------------------------------
// Baseline activity state for the pathway model, derived from the audited
// year. BAU assumption, stated in the method: the audited year repeats.
// ---------------------------------------------------------------------------
export function baselineState(profile, agg) {
  const s = profile.settings;
  const share = 1 / Math.max(1, s.householdSize || 1);
  let kwh = 0, mj = 0, kmCar = 0, litres = 0, kmRide = 0, kmPt = 0;
  let dietDays = 0, freightAirT = 0, freightOtherT = 0, otherT = 0;
  const flights = [];
  for (const e of profile.entries) {
    if (e.date < profile.period.start || e.date > profile.period.end) continue;
    const m = e.meta || {};
    if (e.category === 'electricity') kwh += (m.kwh || 0) * (m.wholeHousehold ? share : 1);
    else if (e.category === 'gas') mj += (m.mj || 0) * (m.wholeHousehold ? share : 1);
    else if (e.category === 'road') {
      const mode = m.mode || 'car';
      if (mode === 'rideshare' || mode === 'taxi') kmRide += m.km || 0;
      else if (mode === 'pt') kmPt += m.km || 0;
      else if (m.litres != null) { litres += m.litres; kmCar += (m.litres * 100) / (m.l100km || 7); }
      else { kmCar += m.km || 0; litres += ((m.km || 0) * (m.l100km || 7)) / 100; }
    } else if (e.category === 'flight') flights.push(e);
    else if (e.category === 'diet') dietDays += m.days || 0;
    else if (e.category === 'freight') {
      if (m.mode === 'air') freightAirT += e.tco2e; else freightOtherT += e.tco2e;
    } else if (e.category === 'other') otherT += e.tco2e;
  }
  const dietType = s.dietType || 'medMeat';
  return {
    state: s.state || 'NSW',
    dwelling: s.dwelling || 'house',
    greenpowerPct: (s.greenpowerPct || 0) / 100,
    kwh, mj,
    kmCar, kmRide, kmPt,
    l100km: kmCar > 0 ? (litres / kmCar) * 100 : (ROAD_FUELS[s.fuelType || 'petrol'].defaultL100km || 7),
    fuelType: s.fuelType || 'petrol',
    evShare: 0, solarReduction: 0, seaShift: 0,
    flights,
    flightT: flights.reduce((t, f) => t + f.tco2e, 0),
    droppedFlightT: 0,
    dietPerDay: DIET_TYPES[dietType].perDay,
    dietDays: dietDays || 365,
    freightAirT, freightOtherT, otherT,
    agg,
  };
}

// Emissions (tCO2e/yr) for an activity state in projection year offset i.
export function stateEmissions(st, yearOffset) {
  const f = ELECTRICITY[st.state] || ELECTRICITY.NSW;
  const s2f = Math.max(GRID_DECLINE.floor, f.s2 * Math.pow(GRID_DECLINE.ratePerYear, Math.max(0, yearOffset)));
  const fuel = ROAD_FUELS[st.fuelType] || ROAD_FUELS.petrol;

  const evKwh = st.kmCar * st.evShare * ROAD_FUELS.ev.kWhPerKm;
  const gridKwh = (st.kwh + st.addedKwh0 + evKwh) * (1 - st.solarReduction);
  const elec = (gridKwh * s2f * (1 - st.greenpowerPct) + gridKwh * f.s3) / 1000;

  const gas = (st.mj * (GAS.s1_per_MJ + gasS3(st.state))) / 1000;
  const litres = (st.kmCar * (1 - st.evShare) * st.l100km) / 100;
  const road = (litres * (fuel.s1_per_L + fuel.s3_per_L)
    + st.kmRide * ROAD_MODES.rideshare.perKm
    + st.kmPt * ROAD_MODES.pt.perKm) / 1000;
  const flight = Math.max(0, st.flightT - st.droppedFlightT);
  const diet = (st.dietPerDay * st.dietDays) / 1000;
  const freight = st.freightAirT * (1 - (st.seaShift || 0) * (1 - 0.016 / 1.13)) + st.freightOtherT;

  return {
    total: elec + gas + road + flight + diet + freight + st.otherT,
    byCategory: { electricity: elec, gas, road, flight, diet, freight, other: st.otherT },
  };
}

const cloneState = (st) => ({ ...st, addedKwh0: 0 });

// Phase-in multiplier by effort: low lands next year, high takes three.
function phase(effort, yearsIn) {
  if (yearsIn <= 0) return 0;
  const ramp = effort === 'low' ? 1 : effort === 'med' ? 2 : 3;
  return Math.min(1, yearsIn / ramp);
}

// ---------------------------------------------------------------------------
// Pathway projection. Applies enabled actions in APPLY_ORDER (behaviour, then
// electrification, then supply measures) so interactions resolve rather than
// double count: an EV's charging load exists before solar and GreenPower act
// on it. Grid decarbonisation runs in the background in both BAU and plan.
// ---------------------------------------------------------------------------
export function projectPathway(profile, agg, horizonYears = 10) {
  const base = baselineState(profile, agg);
  const y0 = Number(profile.period.end.slice(0, 4));
  const enabled = ABATEMENT_OPTIONS.filter((o) => profile.plan.enabled.includes(o.id) && o.applicable(base));
  const years = [], bau = [], plan = [];

  for (let i = 0; i <= horizonYears; i++) {
    years.push(y0 + i);
    bau.push(stateEmissions(cloneState(base), i).total);
    const st = cloneState(base);
    for (const orderId of APPLY_ORDER) {
      const opt = enabled.find((o) => o.id === orderId);
      if (opt) opt.apply(st, phase(opt.effort, i));
    }
    plan.push(stateEmissions(st, i).total);
  }
  return { years, bau, plan, y0, enabled: enabled.map((o) => o.id) };
}

// ---------------------------------------------------------------------------
// MACC: each applicable action alone, at current-year factors. The scenario
// line resolves interactions; these bars are deliberately standalone and the
// method says so.
// ---------------------------------------------------------------------------
export function maccData(profile, agg) {
  const base = baselineState(profile, agg);
  const before = stateEmissions(cloneState(base), 0).total;
  const rows = [];
  for (const opt of ABATEMENT_OPTIONS) {
    const applicable = opt.applicable(base);
    const st = cloneState(base);
    opt.apply(st, 1);
    const reduction = Math.max(0, before - stateEmissions(st, 0).total);
    const cost = opt.cost(base);
    rows.push({
      id: opt.id, category: opt.category, action: opt.action, effort: opt.effort,
      source: opt.source, detail: opt.detail, applicable,
      reduction: round(reduction, 3),
      cost: Math.round(cost),
      costPerTonne: reduction > 0.005 ? Math.round(cost / reduction) : null,
    });
  }
  return rows;
}

export { ABATEMENT_OPTIONS };
