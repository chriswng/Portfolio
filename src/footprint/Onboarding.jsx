import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ELECTRICITY, ROAD_FUELS, DIET_TYPES, GOODS, CLOTHING_ITEMS,
  AIRPORTS, airportByCode, greatCircleKm, flightBandForKm, HOME_AIRPORT, PT_FARE_CAPS, PT_FARE_CAPS_ASOF,
} from './data/factors';
import { CONVERSIONS } from './data/vendorMap';
import { ONBOARD, ENERGY_PRESETS } from './data/copy';
import { OB, fill } from './data/storyCopy';
import { priceEntry } from './lib/engine';
import Icon from './Icons';
import { prefersReducedMotion } from '../utils/media';

// Local-date formatter. toISOString converts to UTC, which in Australian
// timezones lands on the previous calendar day and stretched the reporting
// window to thirteen months; format from local components instead.
const localIso = (d) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

// Last 12 complete months, ending last day of the previous month.
function lastTwelveMonths() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  const start = new Date(end.getFullYear() - 1, end.getMonth() + 1, 1);
  return { label: 'Last 12 months', start: localIso(start), end: localIso(end) };
}

const shiftMonths = (isoDate, delta, day) => {
  const d = new Date(isoDate + 'T00:00:00');
  return localIso(new Date(d.getFullYear(), d.getMonth() + delta, day));
};

// The home airport a fresh flight card opens from, given the visitor's state.
const homeAirportFor = (state) => HOME_AIRPORT[state] || 'SYD';

// Public-transport spend actually counted: capped at the state's weekly fare
// cap unless the visitor overrides it, because spend past the cap buys no
// extra travel and annualising it would overstate the kilometres.
export function effectivePtWeek(a) {
  const cap = PT_FARE_CAPS[a.state];
  return cap && !a.ptCapOverride ? Math.min(a.ptWeek, cap.weekly) : a.ptWeek;
}

// A flight card turned into priced flight meta, or null when it is not a real
// trip yet (no destination, or the same city both ends). Distance is the
// great-circle between the two airports; the engine adds the DEFRA uplift.
export function flightMeta(fl) {
  const from = airportByCode(fl.from);
  const to = airportByCode(fl.to);
  if (!from || !to || from.code === to.code) return null;
  const km = greatCircleKm(from, to);
  const international = !(from.country === 'AU' && to.country === 'AU');
  return {
    km,
    band: flightBandForKm(km, international),
    international,
    cabin: fl.cabin,
    return: fl.ret,
    passengers: Math.max(1, Math.round(fl.pax || 1)),
    from: from.code,
    to: to.code,
  };
}

const flightLabel = (fl) => {
  const from = airportByCode(fl.from);
  const to = airportByCode(fl.to);
  if (!from || !to) return 'Flight';
  return from.city + ' to ' + to.city + (fl.ret ? ' return' : '');
};

export function buildProfileFromOnboarding(a) {
  const period = lastTwelveMonths();
  const settings = {
    name: '', state: a.state, householdSize: a.householdSize, dwelling: a.dwelling,
    dietType: a.dietType, fuelType: a.fuelType, greenpowerPct: a.greenpowerPct,
    carOccupancy: a.carOccupancy,
  };
  // Guided-audit answers are survey answers, so every entry lands in the
  // 'estimated' quality tier until a real bill or itinerary replaces it.
  // meta.synthetic marks an invented-or-absent date; a draft that carries a
  // real user-given date overrides it to false.
  const E = (draft) => priceEntry({ quality: 'estimated', ...draft, meta: { synthetic: true, ...draft.meta } }, settings);
  const entries = [];
  const qEnds = [-9, -6, -3, 0].map((d) => shiftMonths(period.end, d, 28));

  if (a.kwhQuarter > 0) {
    qEnds.forEach((date, i) => entries.push(E({
      category: 'electricity', date, period_months: 3, label: 'Electricity, quarter ' + (i + 1) + ' (onboarding)',
      meta: { kwh: a.kwhQuarter, wholeHousehold: true },
      notes: 'From the guided audit: a typical quarterly household bill, counted as your share. Replace with real bills as they arrive.',
    })));
  }
  if (a.mjQuarter > 0) {
    qEnds.forEach((date, i) => entries.push(E({
      category: 'gas', date, period_months: 3, label: 'Gas, quarter ' + (i + 1) + ' (onboarding)',
      meta: { mj: a.mjQuarter, wholeHousehold: true },
      notes: 'From the guided audit: a typical quarterly household bill, counted as your share.',
    })));
  }
  if (a.carKmWeek > 0) {
    entries.push(E({
      category: 'road', date: period.end, period_months: 12, label: 'Driving, typical year (onboarding)',
      meta: { mode: 'car', fuel: a.fuelType, km: Math.round(a.carKmWeek * 52), occupants: a.carOccupancy },
      notes: 'From the guided audit: ' + a.carKmWeek + ' km a week, annualised'
        + (a.carOccupancy > 1 ? ', split across ' + a.carOccupancy + ' occupants on average.' : '.'),
    }));
  }
  if (a.rideshareWeek > 0) {
    entries.push(E({
      category: 'road', date: period.end, period_months: 12, label: 'Rideshare, typical year (onboarding)',
      meta: { mode: 'rideshare', km: Math.round((a.rideshareWeek * 52) / CONVERSIONS.ridesharePerKm.value) },
      notes: 'Spend-converted at about $' + CONVERSIONS.ridesharePerKm.value.toFixed(2) + ' per km.',
    }));
  }
  const ptWeekEff = effectivePtWeek(a);
  if (ptWeekEff > 0) {
    const cap = PT_FARE_CAPS[a.state];
    const capped = cap && !a.ptCapOverride && a.ptWeek > cap.weekly;
    entries.push(E({
      category: 'road', date: period.end, period_months: 12, label: 'Public transport, typical year (onboarding)',
      meta: { mode: 'pt', km: Math.round((ptWeekEff * 52) / CONVERSIONS.ptPerKm.value) },
      notes: 'Fares converted at about ' + Math.round(CONVERSIONS.ptPerKm.value * 100) + 'c per km. Indicative rail factor.'
        + (capped ? ' Weekly spend capped at the ' + a.state + (cap.approx ? ' effective fare ceiling of about $' : ' weekly fare cap of $') + cap.weekly + '.' : ''),
    }));
  }
  // A flight given a month lands in that month as a real point event; one
  // left open carries no invented date and spreads evenly across the year
  // (like the other typical-year entries) until a dated trip replaces it.
  // Hotel nights ride with their trip: priced at the destination country's
  // per-room-night factor and dated to the same month, so the trip's stay
  // uses the trip's own data instead of a generic home-country count.
  a.flights.forEach((fl) => {
    const meta = flightMeta(fl);
    if (!meta) return;
    const dated = !!fl.month;
    entries.push(E({
      category: 'flight',
      date: dated ? fl.month : period.end,
      ...(dated ? {} : { period_months: 12 }),
      label: flightLabel(fl),
      meta: { ...meta, ...(dated ? { synthetic: false } : {}) },
      notes: dated
        ? 'From the guided audit, dated to the month you gave. Swap in the exact itinerary when you have it.'
        : 'From the guided audit: a typical-year itinerary, spread across the year. Log the real trip with its date to replace it.',
    }));
    if (fl.nights > 0) {
      const to = airportByCode(fl.to);
      entries.push(E({
        category: 'hotel',
        date: dated ? fl.month : period.end,
        ...(dated ? {} : { period_months: 12 }),
        label: 'Hotel nights, ' + to.city + ' (onboarding)',
        meta: { nights: Math.round(fl.nights), country: to.country, ...(dated ? { synthetic: false } : {}) },
        notes: 'From the guided audit: ' + Math.round(fl.nights) + ' night' + (fl.nights > 1 ? 's' : '')
          + ' on the ' + to.city + ' trip, priced at the ' + to.country + ' per-room-night factor.',
      }));
    }
  });
  if (a.hotelNightsOther > 0) {
    entries.push(E({
      category: 'hotel', date: period.end, period_months: 12, label: 'Hotel nights, no flight (onboarding)',
      meta: { nights: Math.round(a.hotelNightsOther), country: 'AU' },
      notes: 'From the guided audit: nights with no flight attached, priced at the Australian per-room-night factor.',
    }));
  }
  if (a.parcelsMonth > 0) {
    entries.push(E({
      category: 'freight', date: period.end, period_months: 12, label: 'Parcels, typical year (onboarding)',
      meta: { parcels: Math.round(a.parcelsMonth * 12) },
      notes: 'Indicative per-parcel factor.',
    }));
  }
  if (a.intlOrdersMonth > 0) {
    entries.push(E({
      category: 'freight', date: period.end, period_months: 12, label: 'Overseas orders, air express (onboarding)',
      meta: { mode: 'air', tonneKm: Math.round(a.intlOrdersMonth * 12 * 0.003 * 8000) },
      notes: 'Assumes 3 kg per consolidated order air freighted about 8,000 km.',
    }));
  }
  entries.push(E({
    category: 'diet', date: period.end, period_months: 12, label: DIET_TYPES[a.dietType].label,
    meta: { dietType: a.dietType, days: 365 },
    notes: 'From the guided audit: typical week, scaled to the year. Coarse by design.',
  }));

  // Optional detail. Clothing counted by item prices each bucket at the
  // ADEME per-garment factor; spend stays available as the fallback. Either
  // way, an untouched or skipped step adds nothing here.
  if (a.clothingMode === 'items') {
    const items = Object.fromEntries(
      Object.entries(a.clothingItems).filter(([, n]) => n > 0).map(([k, n]) => [k, Math.round(n)]),
    );
    if (Object.keys(items).length) {
      entries.push(E({
        category: 'goods', date: period.end, period_months: 12, label: 'Clothing and footwear, by item (onboarding)',
        meta: { kind: 'clothingItems', items },
        notes: 'From the optional detail: items bought new in the last 12 months, each priced on the ADEME per-garment life-cycle factor.',
      }));
    }
  }
  [
    ['clothing', a.clothingMode === 'items' ? 0 : a.clothingMonth],
    ['electronics', a.electronicsMonth],
    ['entertainment', a.entertainmentMonth],
    ['health', a.healthMonth],
    ['other', a.otherGoodsMonth],
  ].forEach(([kind, monthly]) => {
    if (!(monthly > 0)) return;
    entries.push(E({
      category: 'goods', date: period.end, period_months: 12, label: GOODS[kind].label + ' (onboarding)',
      meta: { kind, spendAud: Math.round(monthly * 12) },
      notes: 'From the optional detail: about $' + monthly + ' a month, a spend-based screening estimate.',
    }));
  });
  return {
    schema: 'cw-footprint/2',
    kind: 'own',
    settings, period, entries,
    plan: { enabled: [] },
    pastYears: [],
  };
}

// The optional "More detail" step. Every field defaults to zero, so skipping
// it (or finishing without touching it) adds exactly nothing to the audit:
// no average-person spending is ever substituted in.
const ADVANCED_DEFAULTS = {
  clothingMode: 'items',
  clothingItems: { tops: 0, jumpers: 0, trousers: 0, dresses: 0, coats: 0, shoes: 0 },
  clothingMonth: 0, electronicsMonth: 0, entertainmentMonth: 0, healthMonth: 0, otherGoodsMonth: 0,
};

const DEFAULTS = {
  state: 'NSW', householdSize: 2, dwelling: 'apartment', dietType: 'medMeat', fuelType: 'petrol',
  // gpChoice is the picked chip; greenpowerPct is what the engine prices from.
  // 'no' and 'unsure' are distinct choices that both price at 0% renewable.
  gpChoice: 'no', greenpowerPct: 0, energyPreset: null, kwhQuarter: 1000, mjQuarter: 3000, carKmWeek: 0, carOccupancy: 1,
  rideshareWeek: 0, ptWeek: 0, ptCapOverride: false,
  parcelsMonth: 2, intlOrdersMonth: 0, flights: [], hotelNightsOther: 0,
  ...ADVANCED_DEFAULTS,
};

// Airports grouped by region for the From/To dropdowns, order preserved.
const AIRPORT_GROUPS = (() => {
  const out = [];
  for (const p of AIRPORTS) {
    let g = out.find((x) => x.region === p.region);
    if (!g) { g = { region: p.region, items: [] }; out.push(g); }
    g.items.push(p);
  }
  return out;
})();

// ---- Input primitives ------------------------------------------------------

function Chips({ label, options, value, onChange, note, icon }) {
  return (
    <div className="ob-field" role="group" aria-label={label}>
      <span className="ob-label">{icon && <Icon name={icon} size={15} className="ob-label-i" />}{label}</span>
      <div className="ob-chips">
        {options.map((o) => (
          <button
            key={String(o.value)} type="button"
            className={'ob-chip' + (value === o.value ? ' on' : '')}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
            {o.note && <em>{o.note}</em>}
          </button>
        ))}
      </div>
      {note && <span className="ob-note">{note}</span>}
    </div>
  );
}

function Stepper({ label, value, onChange, min = 0, max = 99, step = 1, icon, compact }) {
  const clamp = (v) => Math.min(max, Math.max(min, v));
  return (
    <div className={compact ? 'ob-field ob-field-compact' : 'ob-field'}>
      <span className="ob-label">{icon && <Icon name={icon} size={15} className="ob-label-i" />}{label}</span>
      <div className="ob-stepper">
        <button type="button" aria-label={'Decrease ' + label} onClick={() => onChange(clamp(value - step))}>−</button>
        <input
          type="number" min={min} max={max} step={step} value={value}
          aria-label={label}
          onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
        />
        <button type="button" aria-label={'Increase ' + label} onClick={() => onChange(clamp(value + step))}>+</button>
        {/* The +/- buttons keep focus, so echo the new value politely. */}
        <span className="sr-only" role="status">{value}</span>
      </div>
    </div>
  );
}

// Slide it, or type it. The number beside the label is a real input, so a
// visitor who knows their exact bill can enter it instead of hunting for the
// right slider position. The two stay in sync; typing clamps to the range.
function SliderField({ label, value, onChange, min, max, step, unit, icon, note }) {
  const [text, setText] = useState(String(value));
  // Reflect slider drags (and any external change) back into the input.
  useEffect(() => { setText(String(value)); }, [value]);
  const clamp = (n) => Math.min(max, Math.max(min, n));
  const onType = (raw) => {
    setText(raw);
    if (raw === '' || raw === '-') return;
    const n = Number(raw);
    if (!isNaN(n)) onChange(clamp(n));
  };
  const onBlurInput = () => {
    const n = Number(text);
    setText(String(text === '' || isNaN(n) ? value : clamp(n)));
  };
  return (
    <div className="ob-field">
      <div className="ob-slider-head">
        <span className="ob-label">{icon && <Icon name={icon} size={15} className="ob-label-i" />}{label}</span>
        <span className="ob-value">
          <input
            type="number" className="ob-value-input" inputMode="decimal"
            min={min} max={max} step={step} value={text}
            aria-label={label + ', type an exact figure'}
            onChange={(e) => onType(e.target.value)}
            onBlur={onBlurInput}
          />
          <em> {unit}</em>
        </span>
      </div>
      <input
        type="range" className="ob-range"
        min={min} max={max} step={step} value={value}
        aria-label={label}
        aria-valuetext={value.toLocaleString() + ' ' + unit}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {note && <span className="ob-note">{note}</span>}
    </div>
  );
}

// An airport dropdown, grouped by region. Any From can pair with any To.
function AirportSelect({ label, value, placeholder, onChange }) {
  return (
    <label className="ob-fl-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {AIRPORT_GROUPS.map((g) => (
          <optgroup key={g.region} label={g.region}>
            {g.items.map((p) => <option key={p.code} value={p.code}>{p.city}</option>)}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

// One flight, as its own editable card: From, To, return or one way, cabin,
// month, and the seats you paid for. Editable at any time; removable. No
// carbon shown here on purpose, so the reveal keeps its punch; the distance is
// shown because it makes the estimate feel honest, not because it spoils it.
function FlightCard({ fl, index, monthOptions, onChange, onRemove }) {
  const set = (k, v) => onChange({ ...fl, [k]: v });
  const meta = flightMeta(fl);
  let distText = ONBOARD.flights.pickTo;
  if (fl.to && fl.from && fl.from === fl.to) distText = ONBOARD.flights.sameCities;
  else if (meta) distText = fill(ONBOARD.flights.dist, { km: meta.km.toLocaleString() });
  return (
    <div className="ob-fcard">
      <div className="ob-fcard-head">
        <span className="ob-fcard-n"><Icon name="plane" size={15} className="ob-flight-i" /> {fill(ONBOARD.flights.tripLabel, { n: index + 1 })}</span>
        <button type="button" className="ob-remove" onClick={onRemove}>{ONBOARD.flights.remove} ×</button>
      </div>
      <div className="ob-fcard-route">
        <AirportSelect label={ONBOARD.flights.from} value={fl.from} placeholder={ONBOARD.flights.pickFrom} onChange={(v) => set('from', v)} />
        <span className="ob-fcard-arrow" aria-hidden="true">→</span>
        <AirportSelect label={ONBOARD.flights.to} value={fl.to} placeholder={ONBOARD.flights.pickTo} onChange={(v) => set('to', v)} />
      </div>
      <div className="ob-fcard-opts">
        <div className="ob-seg2" role="group" aria-label={ONBOARD.flights.trip}>
          <button type="button" className={'ob-seg2-btn' + (fl.ret ? ' on' : '')} aria-pressed={fl.ret} onClick={() => set('ret', true)}>{ONBOARD.flights.roundTrip}</button>
          <button type="button" className={'ob-seg2-btn' + (!fl.ret ? ' on' : '')} aria-pressed={!fl.ret} onClick={() => set('ret', false)}>{ONBOARD.flights.oneWay}</button>
        </div>
        <label className="ob-fl-field">
          <span>{ONBOARD.flights.cabin}</span>
          <select value={fl.cabin} onChange={(e) => set('cabin', e.target.value)}>
            {Object.entries(ONBOARD.flights.cabins).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="ob-fl-field">
          <span>{ONBOARD.flights.when}</span>
          <select value={fl.month} onChange={(e) => set('month', e.target.value)}>
            <option value="">{ONBOARD.flights.whenAny}</option>
            {monthOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
        <Stepper compact icon="people" label={ONBOARD.flights.passengers} value={fl.pax} min={1} max={9} onChange={(v) => set('pax', v)} />
        {/* Nights belong to the trip: the destination country prices them. */}
        <Stepper compact icon="building" label={ONBOARD.flights.nights} value={fl.nights || 0} min={0} max={90} onChange={(v) => set('nights', v)} />
      </div>
      <p className="ob-fcard-dist">{distText}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The guided audit, staged full-screen. The visitor answers five short steps;
// the profile is built the moment the last step lands. Deliberately spoiler-
// free: no running total, no per-line tonnes, no ranking. The number, its
// shape and its context all belong to the reveal that follows.
// ---------------------------------------------------------------------------
export default function Onboarding({ onDone, onBuilt, onCancel }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState(DEFAULTS);
  // The audit window's twelve months, oldest first, for the optional
  // when-was-it picker. Value is a mid-month date inside the window.
  const monthOptions = useMemo(() => {
    const { end } = lastTwelveMonths();
    return Array.from({ length: 12 }, (_, i) => {
      const iso = shiftMonths(end, -(11 - i), 15);
      const d = new Date(iso + 'T00:00:00');
      return { value: iso, label: d.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }) };
    });
  }, []);
  const headRef = useRef(null);
  const set = (k, v) => setA((s) => ({ ...s, [k]: v }));

  // Changing the number of adults rescales a chosen "typical home" preset, so
  // the whole-home estimate grows with the household instead of being split
  // ever thinner. A hand-typed bill (no preset selected) is left untouched.
  const setHousehold = (v) => setA((s) => {
    const next = { ...s, householdSize: v };
    const pr = s.energyPreset && ENERGY_PRESETS.find((x) => x.id === s.energyPreset);
    if (pr) { next.kwhQuarter = pr.kwhPerAdult * v; next.mjQuarter = pr.mjPerAdult * v; }
    return next;
  });

  // Step 5 is the optional detail; step 6 is the done pane where the profile is
  // built and saved.
  const doneProfile = useMemo(() => (step === 6 ? buildProfileFromOnboarding(a) : null), [step, a]);

  // Skipping the optional step clears anything typed into it, so "Skip" always
  // means "add nothing", then jumps to the done pane.
  const skipAdvanced = () => setA((s) => ({ ...s, ...ADVANCED_DEFAULTS }));

  // The done pane says the audit is saved, so save it as the pane appears;
  // closing with Escape or the cross after that point loses nothing.
  useEffect(() => { if (doneProfile) onBuilt(doneProfile); }, [doneProfile, onBuilt]);

  // Focus the incoming step's heading after the pane transition settles.
  useEffect(() => {
    const id = window.setTimeout(() => headRef.current?.focus(), prefersReducedMotion() ? 0 : 320);
    return () => window.clearTimeout(id);
  }, [step]);

  useEffect(() => {
    // Modality itself (inert on everything behind) is applied declaratively
    // by FootprintApp, so it survives story remounts mid-flow. This effect
    // handles the rest: Escape, scroll lock, and returning focus to the
    // control that opened the dialog when it closes.
    const opener = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    };
  }, [onCancel]);

  const addFlight = () => {
    setA((s) => ({
      ...s,
      flights: [...s.flights, { from: homeAirportFor(s.state), to: '', ret: true, cabin: 'economy', month: '', pax: 1, nights: 0 }],
    }));
  };
  const updateFlight = (i, next) => setA((s) => ({ ...s, flights: s.flights.map((f, j) => (j === i ? next : f)) }));
  const removeFlight = (i) => setA((s) => ({ ...s, flights: s.flights.filter((_, j) => j !== i) }));

  const dietOptions = Object.entries(DIET_TYPES).map(([k, v]) => ({
    value: k,
    label: v.label.split(' (')[0],
    note: ONBOARD.food.dietHints[k] || '',
  }));

  const ptCap = PT_FARE_CAPS[a.state];
  const ptCapActive = ptCap && !a.ptCapOverride && a.ptWeek > ptCap.weekly;
  const flightsReady = a.flights.filter((f) => flightMeta(f)).length;

  // Household split reminder for the energy step, in plain words, no carbon.
  const splitNote = a.householdSize > 1
    ? fill(ONBOARD.energy.splitNote, { n: a.householdSize, s: a.householdSize > 1 ? 's' : '' })
    : ONBOARD.energy.splitNoteSolo;

  const steps = [
    <div key="you">
      <div className="ob-stephead">
        <span className="ob-stephead-i" aria-hidden="true"><Icon name="house" size={26} /></span>
        <h3 ref={headRef} tabIndex={-1}>{ONBOARD.you.title}</h3>
      </div>
      <p>{ONBOARD.you.sub}</p>
      <Chips
        icon="pin"
        label={ONBOARD.you.state}
        options={Object.entries(ELECTRICITY).map(([k, v]) => ({ value: k, label: v.label }))}
        value={a.state} onChange={(v) => set('state', v)}
      />
      <Stepper icon="people" label={ONBOARD.you.household} value={a.householdSize} min={1} max={10} onChange={setHousehold} />
      <p className="ob-note">{ONBOARD.you.householdNote}</p>
      <Chips
        icon="building"
        label={ONBOARD.you.dwelling}
        options={[
          { value: 'house', label: ONBOARD.you.dwellingHouse },
          { value: 'apartment', label: ONBOARD.you.dwellingApartment },
        ]}
        value={a.dwelling} onChange={(v) => set('dwelling', v)}
      />
    </div>,
    <div key="energy">
      <div className="ob-stephead">
        <span className="ob-stephead-i" aria-hidden="true"><Icon name="bolt" size={26} /></span>
        <h3 ref={headRef} tabIndex={-1}>{ONBOARD.energy.title}</h3>
      </div>
      <p>{ONBOARD.energy.sub}</p>
      <Chips
        icon="house"
        label={ONBOARD.energy.presetLabel}
        options={ENERGY_PRESETS.map((pr) => ({ value: pr.id, label: pr.label }))}
        value={a.energyPreset}
        onChange={(id) => {
          const pr = ENERGY_PRESETS.find((x) => x.id === id);
          if (pr) setA((s) => ({ ...s, energyPreset: id, kwhQuarter: pr.kwhPerAdult * s.householdSize, mjQuarter: pr.mjPerAdult * s.householdSize }));
        }}
        note={ONBOARD.energy.presetNote}
      />
      {/* Dragging or typing a real bill is whole-home too, so it clears the
          preset (household size no longer rescales it) and the engine still
          splits it per adult. */}
      <SliderField icon="bolt" label={ONBOARD.energy.kwh} value={a.kwhQuarter} min={0} max={8000} step={10} unit="kWh"
        onChange={(v) => setA((s) => ({ ...s, kwhQuarter: v, energyPreset: null }))} />
      <SliderField icon="flame" label={ONBOARD.energy.mj} value={a.mjQuarter} min={0} max={40000} step={50} unit="MJ"
        onChange={(v) => setA((s) => ({ ...s, mjQuarter: v, energyPreset: null }))} />
      <p className="ob-splitnote"><Icon name="people" size={14} className="ob-label-i" />{splitNote}</p>
      <Chips
        icon="leaf"
        label={ONBOARD.energy.greenpower}
        options={[
          { value: 'no', label: ONBOARD.energy.gpNo },
          { value: 'unsure', label: ONBOARD.energy.gpUnsure },
          { value: 'half', label: ONBOARD.energy.gpHalf },
          { value: 'full', label: ONBOARD.energy.gpFull },
        ]}
        value={a.gpChoice}
        onChange={(v) => setA((s) => ({ ...s, gpChoice: v, greenpowerPct: v === 'half' ? 50 : v === 'full' ? 100 : 0 }))}
        note={ONBOARD.energy.greenpowerNote}
      />
    </div>,
    <div key="travel">
      <div className="ob-stephead">
        <span className="ob-stephead-i" aria-hidden="true"><Icon name="car" size={26} /></span>
        <h3 ref={headRef} tabIndex={-1}>{ONBOARD.travel.title}</h3>
      </div>
      <p>{ONBOARD.travel.sub}</p>
      <SliderField icon="car" label={ONBOARD.travel.car} value={a.carKmWeek} min={0} max={1000} step={5} unit="km / wk"
        onChange={(v) => set('carKmWeek', v)} />
      {a.carKmWeek > 0 && (
        <>
          <Chips
            icon="fuel"
            label={ONBOARD.travel.fuelType}
            options={Object.entries(ROAD_FUELS).map(([k, v]) => ({ value: k, label: v.label }))}
            value={a.fuelType} onChange={(v) => set('fuelType', v)}
          />
          <Stepper icon="people" label={ONBOARD.travel.occupancy} value={a.carOccupancy} min={1} max={7}
            onChange={(v) => set('carOccupancy', v)} />
          <p className="ob-note">{ONBOARD.travel.occupancyNote}</p>
        </>
      )}
      <SliderField icon="phone" label={ONBOARD.travel.rideshare} value={a.rideshareWeek} min={0} max={400} step={5} unit="$ / wk"
        onChange={(v) => set('rideshareWeek', v)} />
      <SliderField icon="bus" label={ONBOARD.travel.pt} value={a.ptWeek} min={0} max={250} step={5} unit="$ / wk"
        onChange={(v) => set('ptWeek', v)} />
      {ptCap && (
        <div className="ob-ptcap">
          <p className="ob-note ob-ptcap-note">
            <Icon name="leaf" size={14} className="ob-label-i" />
            {ptCap.approx
              ? fill(ONBOARD.travel.ptCapNoteApprox, { state: a.state, label: ptCap.label, cap: ptCap.weekly, asOf: PT_FARE_CAPS_ASOF })
              : fill(ONBOARD.travel.ptCapNoteExact, { state: a.state, label: ptCap.label, cap: ptCap.weekly })}
          </p>
          {a.ptWeek > ptCap.weekly && (
            <div className="ob-ptcap-row">
              <button
                type="button"
                className={'ob-chip' + (a.ptCapOverride ? ' on' : '')}
                aria-pressed={a.ptCapOverride}
                onClick={() => set('ptCapOverride', !a.ptCapOverride)}
              >
                {ONBOARD.travel.ptOverride}
              </button>
              {!a.ptCapOverride && (
                <span className="ob-ptcap-applied">
                  {fill(ptCap.approx ? ONBOARD.travel.ptCapAppliedApprox : ONBOARD.travel.ptCapApplied, { cap: ptCap.weekly })}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>,
    <div key="flights">
      <div className="ob-stephead">
        <span className="ob-stephead-i" aria-hidden="true"><Icon name="plane" size={26} /></span>
        <h3 ref={headRef} tabIndex={-1}>{ONBOARD.flights.title}</h3>
      </div>
      <p>{ONBOARD.flights.sub}</p>

      <div className="ob-flight-list">
        <span className="ob-label">{ONBOARD.flights.listTitle} ({a.flights.length})</span>
        {!a.flights.length && <p className="ob-none">{ONBOARD.flights.none}</p>}
        {a.flights.map((fl, i) => (
          <FlightCard
            key={i}
            fl={fl}
            index={i}
            monthOptions={monthOptions}
            onChange={(next) => updateFlight(i, next)}
            onRemove={() => removeFlight(i)}
          />
        ))}
      </div>

      <button type="button" className="btn btn-secondary ob-addflight" onClick={addFlight}>
        + {a.flights.length ? ONBOARD.flights.addAnother : ONBOARD.flights.add}
      </button>

      <Stepper icon="building" label={ONBOARD.flights.otherNights} value={a.hotelNightsOther} min={0} max={365}
        onChange={(v) => set('hotelNightsOther', v)} />
      <p className="ob-note">{ONBOARD.flights.otherNightsNote}</p>

      <details className="ob-disclose">
        <summary>{ONBOARD.flights.sourceSummary}</summary>
        <p>{ONBOARD.flights.sourceBody}</p>
      </details>
    </div>,
    <div key="food">
      <div className="ob-stephead">
        <span className="ob-stephead-i" aria-hidden="true"><Icon name="bowl" size={26} /></span>
        <h3 ref={headRef} tabIndex={-1}>{ONBOARD.food.title}</h3>
      </div>
      <p>{ONBOARD.food.sub}</p>
      <Chips icon="fork" label={ONBOARD.food.diet} options={dietOptions} value={a.dietType} onChange={(v) => set('dietType', v)} />
      <Stepper icon="box" label={ONBOARD.food.parcels} value={a.parcelsMonth} min={0} max={200}
        onChange={(v) => set('parcelsMonth', v)} />
      <Stepper icon="globe" label={ONBOARD.food.intlOrders} value={a.intlOrdersMonth} min={0} max={100}
        onChange={(v) => set('intlOrdersMonth', v)} />
    </div>,
    <div key="advanced">
      <div className="ob-stephead">
        <span className="ob-stephead-i" aria-hidden="true"><Icon name="box" size={26} /></span>
        <h3 ref={headRef} tabIndex={-1}>{ONBOARD.advanced.title}</h3>
      </div>
      <p>{ONBOARD.advanced.sub}</p>
      <p className="ob-optnote"><Icon name="spark" size={14} className="ob-label-i" />{ONBOARD.advanced.optional}</p>
      <Chips
        icon="box"
        label={ONBOARD.advanced.clothingHow}
        options={[
          { value: 'items', label: ONBOARD.advanced.clothingByItems, note: ONBOARD.advanced.clothingByItemsNote },
          { value: 'spend', label: ONBOARD.advanced.clothingBySpend },
        ]}
        value={a.clothingMode} onChange={(v) => set('clothingMode', v)}
      />
      {a.clothingMode === 'items' ? (
        <div className="ob-field">
          <span className="ob-label">{ONBOARD.advanced.clothingItemsLabel}</span>
          <div className="ob-items-grid">
            {Object.entries(CLOTHING_ITEMS).map(([k, item]) => (
              <Stepper
                compact key={k} label={item.label} value={a.clothingItems[k]} min={0} max={200}
                onChange={(v) => setA((s) => ({ ...s, clothingItems: { ...s.clothingItems, [k]: v } }))}
              />
            ))}
          </div>
          <span className="ob-note">{ONBOARD.advanced.clothingItemsNote}</span>
        </div>
      ) : (
        <SliderField icon="box" label={ONBOARD.advanced.clothing} value={a.clothingMonth} min={0} max={800} step={10} unit="$ / mo"
          note={ONBOARD.advanced.clothingNote} onChange={(v) => set('clothingMonth', v)} />
      )}
      <SliderField icon="phone" label={ONBOARD.advanced.electronics} value={a.electronicsMonth} min={0} max={800} step={10} unit="$ / mo"
        note={ONBOARD.advanced.electronicsNote} onChange={(v) => set('electronicsMonth', v)} />
      <SliderField icon="book" label={ONBOARD.advanced.entertainment} value={a.entertainmentMonth} min={0} max={800} step={10} unit="$ / mo"
        note={ONBOARD.advanced.entertainmentNote} onChange={(v) => set('entertainmentMonth', v)} />
      <SliderField icon="leaf" label={ONBOARD.advanced.health} value={a.healthMonth} min={0} max={800} step={10} unit="$ / mo"
        note={ONBOARD.advanced.healthNote} onChange={(v) => set('healthMonth', v)} />
      <SliderField icon="globe" label={ONBOARD.advanced.other} value={a.otherGoodsMonth} min={0} max={1500} step={10} unit="$ / mo"
        note={ONBOARD.advanced.otherNote} onChange={(v) => set('otherGoodsMonth', v)} />
      <details className="ob-disclose">
        <summary>{ONBOARD.advanced.sourceSummary}</summary>
        <p>{ONBOARD.advanced.sourceBody}</p>
      </details>
    </div>,
    <div key="done" className="ob-done">
      {/* Deliberately spoiler-free: no number here. The total, its shape and
          its context all belong to the reveal below. */}
      <div className="ob-stephead">
        <span className="ob-stephead-i" aria-hidden="true"><Icon name="spark" size={26} /></span>
        <h3 ref={headRef} tabIndex={-1}>{OB.done.title}</h3>
      </div>
      <p className="ob-done-ready"><Icon name="spark" size={16} className="ob-label-i" />{OB.done.ready}</p>
      <p>{OB.done.sub}</p>
      <div className="ob-done-ctas">
        <button type="button" className="btn btn-primary fp-btn" onClick={() => onDone(doneProfile, { watch: true })}>{OB.done.watch} →</button>
        <button type="button" className="fp-linkbtn" onClick={() => onDone(doneProfile, { watch: false })}>{OB.done.skip}</button>
      </div>
    </div>,
  ];

  // Neutral, spoiler-free progress line for the footer: what this step
  // captured, never a tonnes total.
  const stepStatus = [
    OB.progress.you,
    OB.progress.energy,
    OB.progress.travel,
    flightsReady ? fill(OB.progress.flights.some, { n: flightsReady, s: flightsReady > 1 ? 's' : '' }) : OB.progress.flights.none,
    OB.progress.food,
    OB.progress.advanced,
  ][step];

  const stepMotion = prefersReducedMotion()
    ? {}
    : {
      initial: { opacity: 0, x: 26 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -26 },
      transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
    };

  return (
    <div className="ob-scrim" role="dialog" aria-modal="true" aria-label={OB.title}>
      <div className="ob-head canvas">
        <div className="ob-head-left">
          <span className="ob-title">{OB.title}</span>
          <span className="ob-progress" aria-hidden="true">
            {OB.stepLabels.map((s, i) => (
              <span key={s} className={'ob-seg' + (i === step ? ' on' : i < step ? ' done' : '')} title={s} />
            ))}
          </span>
          <span className="sr-only" role="status">
            {step === 6 ? OB.done.title : fill(OB.stepOf, { n: step + 1, total: OB.stepLabels.length }) + ': ' + OB.stepLabels[step]}
          </span>
        </div>
        <button type="button" className="ob-close" aria-label="Close" onClick={onCancel}>×</button>
      </div>

      <div className="ob-body canvas">
        {step === 0 && <p className="ob-intro">{OB.intro}</p>}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} {...stepMotion} className="ob-pane">
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 6 && (
        <div className="ob-foot">
          <div className="canvas ob-foot-inner">
            <div className="ob-foot-status">
              <span className="ob-foot-tick" aria-hidden="true"><Icon name="spark" size={14} /></span>
              <span className="ob-foot-status-t">{stepStatus}</span>
              <span className="ob-foot-note">{OB.keepForReveal}</span>
            </div>
            <div className="ob-foot-btns">
              <button type="button" className="fp-linkbtn" onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}>
                {step === 0 ? ONBOARD.cancel : ONBOARD.back}
              </button>
              {step === 5 ? (
                // The optional step: a prominent Skip that adds nothing, and a
                // primary that carries any detail entered into the reveal.
                <>
                  <button type="button" className="btn btn-secondary ob-skip" onClick={() => { skipAdvanced(); setStep(6); }}>
                    {ONBOARD.advanced.skip}
                  </button>
                  <button type="button" className="btn btn-primary fp-btn" onClick={() => setStep(6)}>
                    {ONBOARD.finish} →
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-primary fp-btn" onClick={() => setStep(step + 1)}>
                  {ONBOARD.next} →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
