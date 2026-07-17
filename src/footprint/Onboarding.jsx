import { useEffect, useRef, useState } from 'react';
import { ELECTRICITY, FLIGHT_ROUTES, ROAD_FUELS, DIET_TYPES } from './data/factors';
import { CONVERSIONS } from './data/vendorMap';
import { ONBOARD } from './data/copy';
import { priceEntry } from './lib/engine';

// Last 12 complete months, ending last day of the previous month.
function lastTwelveMonths() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  const start = new Date(end.getFullYear() - 1, end.getMonth() + 1, 1);
  const iso = (d) => d.toISOString().slice(0, 10);
  return { label: 'Last 12 months', start: iso(start), end: iso(end) };
}

const shiftMonths = (isoDate, delta, day) => {
  const d = new Date(isoDate + 'T00:00:00');
  const t = new Date(d.getFullYear(), d.getMonth() + delta, day);
  return t.toISOString().slice(0, 10);
};

export function buildProfileFromOnboarding(a) {
  const period = lastTwelveMonths();
  const settings = {
    name: '', state: a.state, householdSize: a.householdSize, dwelling: a.dwelling,
    dietType: a.dietType, fuelType: a.fuelType, greenpowerPct: a.greenpowerPct,
  };
  const E = (draft) => priceEntry(draft, settings);
  const entries = [];
  const qEnds = [-9, -6, -3, 0].map((d) => shiftMonths(period.end, d, 28));

  if (a.kwhQuarter > 0) {
    qEnds.forEach((date, i) => entries.push(E({
      category: 'electricity', date, period_months: 3, label: 'Electricity, quarter ' + (i + 1) + ' (onboarding)',
      meta: { kwh: a.kwhQuarter, wholeHousehold: true },
      notes: 'From the guided audit: a typical quarterly household bill. Replace with real bills as they arrive.',
    })));
  }
  if (a.mjQuarter > 0) {
    qEnds.forEach((date, i) => entries.push(E({
      category: 'gas', date, period_months: 3, label: 'Gas, quarter ' + (i + 1) + ' (onboarding)',
      meta: { mj: a.mjQuarter, wholeHousehold: true },
      notes: 'From the guided audit: a typical quarterly household bill.',
    })));
  }
  if (a.carKmWeek > 0) {
    entries.push(E({
      category: 'road', date: period.end, period_months: 12, label: 'Driving, typical year (onboarding)',
      meta: { mode: 'car', fuel: a.fuelType, km: Math.round(a.carKmWeek * 52) },
      notes: 'From the guided audit: ' + a.carKmWeek + ' km a week, annualised.',
    }));
  }
  if (a.rideshareWeek > 0) {
    entries.push(E({
      category: 'road', date: period.end, period_months: 12, label: 'Rideshare, typical year (onboarding)',
      meta: { mode: 'rideshare', km: Math.round((a.rideshareWeek * 52) / CONVERSIONS.ridesharePerKm.value) },
      notes: 'Spend-converted at about $' + CONVERSIONS.ridesharePerKm.value.toFixed(2) + ' per km.',
    }));
  }
  if (a.ptWeek > 0) {
    entries.push(E({
      category: 'road', date: period.end, period_months: 12, label: 'Public transport, typical year (onboarding)',
      meta: { mode: 'pt', km: Math.round((a.ptWeek * 52) / CONVERSIONS.ptPerKm.value) },
      notes: 'Fares converted at about ' + Math.round(CONVERSIONS.ptPerKm.value * 100) + 'c per km. Indicative rail factor.',
    }));
  }
  a.flights.forEach((fl, i) => {
    const route = FLIGHT_ROUTES.find((r) => r.id === fl.route);
    entries.push(E({
      category: 'flight', date: shiftMonths(period.end, -((i * 3) % 12) - 1, 15),
      label: (route ? route.label : Math.round(fl.km) + ' km flight') + (fl.ret ? ' return' : ''),
      meta: { km: route ? route.km : fl.km, band: route ? route.band : undefined, international: route ? undefined : fl.km > 1500, cabin: fl.cabin, return: fl.ret },
      notes: 'From the guided audit: a typical-year itinerary.',
    }));
  });
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

  return {
    schema: 'cw-footprint/1',
    kind: 'own',
    settings, period, entries,
    plan: { enabled: [] },
  };
}

const DEFAULTS = {
  state: 'NSW', householdSize: 2, dwelling: 'apartment', dietType: 'medMeat', fuelType: 'petrol',
  greenpowerPct: 0, kwhQuarter: 1000, mjQuarter: 3000, carKmWeek: 0, rideshareWeek: 0, ptWeek: 0,
  parcelsMonth: 2, intlOrdersMonth: 0, flights: [],
};

export default function Onboarding({ onDone, onCancel }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState(DEFAULTS);
  const [fl, setFl] = useState({ route: 'SYD-MEL', km: 700, cabin: 'economy', ret: true });
  const dialogRef = useRef(null);
  const set = (k, v) => setA((s) => ({ ...s, [k]: v }));
  const num = (v) => (v === '' || isNaN(Number(v)) ? 0 : Number(v));

  useEffect(() => {
    const el = dialogRef.current;
    if (el) el.querySelector('select, input, button').focus();
  }, [step]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onCancel]);

  const addFlight = () => {
    const route = FLIGHT_ROUTES.find((r) => r.id === fl.route);
    setA((s) => ({ ...s, flights: [...s.flights, { ...fl, km: route ? route.km : num(fl.km) }] }));
  };

  const steps = [
    <div key="you">
      <h3>{ONBOARD.you.title}</h3>
      <p>{ONBOARD.you.sub}</p>
      <label className="fp-field"><span>{ONBOARD.you.state}</span>
        <select value={a.state} onChange={(e) => set('state', e.target.value)}>
          {Object.entries(ELECTRICITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </label>
      <label className="fp-field"><span>{ONBOARD.you.household}</span>
        <input type="number" min="1" max="10" value={a.householdSize} onChange={(e) => set('householdSize', Math.max(1, num(e.target.value)))} />
      </label>
      <p className="fp-note">{ONBOARD.you.householdNote}</p>
      <label className="fp-field"><span>{ONBOARD.you.dwelling}</span>
        <select value={a.dwelling} onChange={(e) => set('dwelling', e.target.value)}>
          <option value="house">{ONBOARD.you.dwellingHouse}</option>
          <option value="apartment">{ONBOARD.you.dwellingApartment}</option>
        </select>
      </label>
    </div>,
    <div key="energy">
      <h3>{ONBOARD.energy.title}</h3>
      <p>{ONBOARD.energy.sub}</p>
      <label className="fp-field"><span>{ONBOARD.energy.kwh}</span>
        <input type="number" min="0" value={a.kwhQuarter} onChange={(e) => set('kwhQuarter', num(e.target.value))} />
      </label>
      <label className="fp-field"><span>{ONBOARD.energy.mj}</span>
        <input type="number" min="0" value={a.mjQuarter} onChange={(e) => set('mjQuarter', num(e.target.value))} />
      </label>
      <label className="fp-field"><span>{ONBOARD.energy.greenpower}</span>
        <input type="number" min="0" max="100" value={a.greenpowerPct} onChange={(e) => set('greenpowerPct', Math.min(100, num(e.target.value)))} />
      </label>
    </div>,
    <div key="travel">
      <h3>{ONBOARD.travel.title}</h3>
      <p>{ONBOARD.travel.sub}</p>
      <label className="fp-field"><span>{ONBOARD.travel.car}</span>
        <input type="number" min="0" value={a.carKmWeek} onChange={(e) => set('carKmWeek', num(e.target.value))} />
      </label>
      {a.carKmWeek > 0 && (
        <label className="fp-field"><span>{ONBOARD.travel.fuelType}</span>
          <select value={a.fuelType} onChange={(e) => set('fuelType', e.target.value)}>
            {Object.entries(ROAD_FUELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
      )}
      <label className="fp-field"><span>{ONBOARD.travel.rideshare}</span>
        <input type="number" min="0" value={a.rideshareWeek} onChange={(e) => set('rideshareWeek', num(e.target.value))} />
      </label>
      <label className="fp-field"><span>{ONBOARD.travel.pt}</span>
        <input type="number" min="0" value={a.ptWeek} onChange={(e) => set('ptWeek', num(e.target.value))} />
      </label>
    </div>,
    <div key="flights">
      <h3>{ONBOARD.flights.title}</h3>
      <p>{ONBOARD.flights.sub}</p>
      <div className="fp-form-row">
        <label className="fp-field"><span>{ONBOARD.flights.route}</span>
          <select value={fl.route} onChange={(e) => setFl((s) => ({ ...s, route: e.target.value }))}>
            {FLIGHT_ROUTES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            <option value="custom">Custom distance…</option>
          </select>
        </label>
        {fl.route === 'custom' && (
          <label className="fp-field"><span>{ONBOARD.flights.custom}</span>
            <input type="number" min="50" value={fl.km} onChange={(e) => setFl((s) => ({ ...s, km: num(e.target.value) }))} />
          </label>
        )}
        <label className="fp-field"><span>{ONBOARD.flights.cabin}</span>
          <select value={fl.cabin} onChange={(e) => setFl((s) => ({ ...s, cabin: e.target.value }))}>
            <option value="economy">Economy</option><option value="premium">Premium</option>
            <option value="business">Business</option><option value="first">First</option>
          </select>
        </label>
        <label className="fp-field"><span>{ONBOARD.flights.return}</span>
          <input type="checkbox" checked={fl.ret} onChange={(e) => setFl((s) => ({ ...s, ret: e.target.checked }))} />
        </label>
      </div>
      <button type="button" className="fp-linkbtn" onClick={addFlight}>{ONBOARD.flights.add} +</button>
      <ul className="fp-ob-flights">
        {a.flights.map((f, i) => (
          <li key={i}>
            {(FLIGHT_ROUTES.find((r) => r.id === f.route) || { label: f.km + ' km' }).label}{f.ret ? ' return' : ''} · {f.cabin}
            <button type="button" aria-label="Remove flight" onClick={() => setA((s) => ({ ...s, flights: s.flights.filter((_, j) => j !== i) }))}>×</button>
          </li>
        ))}
        {!a.flights.length && <li className="fp-ob-none">{ONBOARD.flights.none}</li>}
      </ul>
    </div>,
    <div key="food">
      <h3>{ONBOARD.food.title}</h3>
      <p>{ONBOARD.food.sub}</p>
      <label className="fp-field"><span>{ONBOARD.food.diet}</span>
        <select value={a.dietType} onChange={(e) => set('dietType', e.target.value)}>
          {Object.entries(DIET_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </label>
      <label className="fp-field"><span>{ONBOARD.food.parcels}</span>
        <input type="number" min="0" value={a.parcelsMonth} onChange={(e) => set('parcelsMonth', num(e.target.value))} />
      </label>
      <label className="fp-field"><span>{ONBOARD.food.intlOrders}</span>
        <input type="number" min="0" value={a.intlOrdersMonth} onChange={(e) => set('intlOrdersMonth', num(e.target.value))} />
      </label>
    </div>,
  ];

  return (
    <div className="fp-modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="fp-modal" role="dialog" aria-modal="true" aria-label={ONBOARD.title} ref={dialogRef}>
        <div className="fp-modal-head">
          <div>
            <div className="fp-modal-title">{ONBOARD.title}</div>
            <div className="fp-modal-steps">
              {ONBOARD.steps.map((s, i) => (
                <span key={s} className={'fp-modal-step' + (i === step ? ' on' : i < step ? ' done' : '')}>{s}</span>
              ))}
            </div>
          </div>
          <button type="button" className="fp-del" aria-label="Close" onClick={onCancel}>×</button>
        </div>
        <p className="fp-modal-intro">{ONBOARD.intro}</p>
        <div className="fp-modal-body">{steps[step]}</div>
        <div className="fp-modal-foot">
          <button type="button" className="fp-linkbtn" onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}>
            {step === 0 ? ONBOARD.cancel : ONBOARD.back}
          </button>
          <button
            type="button" className="btn btn-primary fp-btn"
            onClick={() => (step === steps.length - 1 ? onDone(buildProfileFromOnboarding(a)) : setStep(step + 1))}
          >
            {step === steps.length - 1 ? ONBOARD.finish : ONBOARD.next} →
          </button>
        </div>
      </div>
    </div>
  );
}
