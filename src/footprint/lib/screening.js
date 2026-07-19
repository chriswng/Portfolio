// Pricing for "A fuller picture": the wider basket that sits OUTSIDE the
// audited core. Pure functions, no DOM. Kept in its own module so the core
// engine (engine.js) and its aggregate never mix epistemic classes: the core
// is activity times a factor; this is spend-based screening plus hotel nights.
//
// Inputs live on profile.wider (optional, migrated in on read):
//   { goods: { [categoryId]: annualAud }, hotels: [{ country, nights }] }
//
// Output is tonnes CO2-e, with a deliberately wide screening band, ready for
// the dashboard panel that shows "audited core X, wider basket about Y".

import {
  GOODS, goodsById, FX, HOTEL_COUNTRIES, HOTEL_FALLBACK,
  hotelFactorFor, hotelCountryLabel, SCREENING_BANDS, WASTE,
} from '../data/screening';

const round = (v, dp = 4) => Math.round(v * 10 ** dp) / 10 ** dp;

// Goods: annual AUD spend, converted to USD at the stated rate, times the
// EPA per-USD factor, to tonnes. Only positive entries count.
function priceGoods(goods) {
  const rows = [];
  for (const cat of GOODS) {
    const aud = Math.max(0, Number(goods && goods[cat.id]) || 0);
    if (aud <= 0) continue;
    const kg = aud * FX.usdPerAud * cat.factor;
    rows.push({ id: cat.id, label: cat.label, icon: cat.icon, aud, kg, t: round(kg / 1000) });
  }
  const t = rows.reduce((s, r) => s + r.t, 0);
  return { rows, t: round(t) };
}

// Hotels: room-nights times the country per-night factor, to tonnes. Rows are
// merged by country so two trips to the same place read as one line.
function priceHotels(hotels) {
  const byCountry = {};
  for (const h of hotels || []) {
    const nights = Math.max(0, Math.round(Number(h && h.nights) || 0));
    if (nights <= 0) continue;
    const code = h.country || HOTEL_FALLBACK.code;
    byCountry[code] = (byCountry[code] || 0) + nights;
  }
  const rows = Object.entries(byCountry).map(([code, nights]) => {
    const perNight = hotelFactorFor(code);
    const kg = nights * perNight;
    return { country: code, label: hotelCountryLabel(code), nights, perNight, kg, t: round(kg / 1000) };
  }).sort((a, b) => b.t - a.t);
  const t = rows.reduce((s, r) => s + r.t, 0);
  const nights = rows.reduce((s, r) => s + r.nights, 0);
  return { rows, t: round(t), nights };
}

// Waste: a self-estimated weekly weight of household rubbish to landfill, times
// the published per-kilogram factor, to tonnes a year. A single number, not a
// list, so it is priced inline here.
function priceWaste(kgPerWeek) {
  const kg = Math.max(0, Number(kgPerWeek) || 0);
  const t = round((kg * 52 * WASTE.perKg) / 1000);
  return { kgPerWeek: kg, t, hasAny: kg > 0 };
}

// The whole wider estimate for a profile. `hasAny` gates the panel's result
// state so an untouched panel invites input rather than asserting a zero.
export function widerEstimate(profile) {
  const w = (profile && profile.wider) || {};
  const goods = priceGoods(w.goods);
  const hotels = priceHotels(w.hotels);
  const waste = priceWaste(w.waste);
  const total = round(goods.t + hotels.t + waste.t);
  // Screening-grade band: each part's half-width summed with no correlation
  // credit, matching how the core sizes its own uncertainty.
  const band = round(
    goods.t * SCREENING_BANDS.goods
    + hotels.t * SCREENING_BANDS.hotels
    + waste.t * SCREENING_BANDS.waste,
  );
  return {
    goods,
    hotels,
    waste,
    total,
    band,
    low: round(Math.max(0, total - band)),
    high: round(total + band),
    hasAny: goods.rows.length > 0 || hotels.rows.length > 0 || waste.hasAny,
  };
}

// Convenience for the "fuller picture" headline: the audited core plus the
// wider basket, as one combined figure with a combined range. coreBand is the
// core aggregate's own uncertainty half-width (agg.uncertainty.band).
export function fullerPicture(coreTotal, coreBand, wider) {
  const total = round(coreTotal + wider.total);
  const band = round((coreBand || 0) + wider.band);
  return { total, band, low: round(Math.max(0, total - band)), high: round(total + band) };
}

export { GOODS, HOTEL_COUNTRIES, HOTEL_FALLBACK };
