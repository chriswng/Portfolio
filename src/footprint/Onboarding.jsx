import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, AnimatePresence, motion } from 'framer-motion';
import { ELECTRICITY, FLIGHT_ROUTES, ROAD_FUELS, DIET_TYPES } from './data/factors';
import { CONVERSIONS } from './data/vendorMap';
import { ONBOARD, fmtT } from './data/copy';
import { OB, fill } from './data/storyCopy';
import { priceEntry, aggregate } from './lib/engine';
import { audio } from './lib/audio';
import { prefersReducedMotion } from '../utils/media';

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

// ---------------------------------------------------------------------------
// Live pricing: each input shows its own annual tonnes as you drag, priced by
// the same engine that prices the audit itself. Nothing here is a second
// model; it is priceEntry with the visitor's current settings.
// ---------------------------------------------------------------------------
const settingsOf = (a) => ({
  name: '', state: a.state, householdSize: a.householdSize, dwelling: a.dwelling,
  dietType: a.dietType, fuelType: a.fuelType, greenpowerPct: a.greenpowerPct,
});

function liveT(a, draft) {
  try {
    return priceEntry({ date: '2026-01-01', label: '', ...draft }, settingsOf(a)).tco2e;
  } catch { return 0; }
}

const LIVE = {
  electricity: (a) => liveT(a, { category: 'electricity', meta: { kwh: a.kwhQuarter * 4, wholeHousehold: true } }),
  gas: (a) => liveT(a, { category: 'gas', meta: { mj: a.mjQuarter * 4, wholeHousehold: true } }),
  car: (a) => liveT(a, { category: 'road', meta: { mode: 'car', fuel: a.fuelType, km: Math.round(a.carKmWeek * 52) } }),
  rideshare: (a) => liveT(a, { category: 'road', meta: { mode: 'rideshare', km: Math.round((a.rideshareWeek * 52) / CONVERSIONS.ridesharePerKm.value) } }),
  pt: (a) => liveT(a, { category: 'road', meta: { mode: 'pt', km: Math.round((a.ptWeek * 52) / CONVERSIONS.ptPerKm.value) } }),
  flight: (a, fl) => {
    const route = FLIGHT_ROUTES.find((r) => r.id === fl.route);
    return liveT(a, {
      category: 'flight',
      meta: { km: route ? route.km : fl.km, band: route ? route.band : undefined, international: route ? undefined : fl.km > 1500, cabin: fl.cabin, return: fl.ret },
    });
  },
  parcels: (a) => liveT(a, { category: 'freight', meta: { parcels: Math.round(a.parcelsMonth * 12) } }),
  intl: (a) => liveT(a, { category: 'freight', meta: { mode: 'air', tonneKm: Math.round(a.intlOrdersMonth * 12 * 0.003 * 8000) } }),
  diet: (a, dietType) => liveT(a, { category: 'diet', meta: { dietType, days: 365 } }),
};

// Small but non-zero inputs read "< 0.1" rather than a dismissive "0.0".
const approx = (t) => fill(OB.approx, { t: t > 0 && t < 0.05 ? '< 0.1' : fmtT(t) });

// A number that eases to its new value instead of snapping.
function LiveNumber({ value, decimals = 1 }) {
  const ref = useRef(null);
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) { el.textContent = value.toFixed(decimals); prev.current = value; return undefined; }
    const controls = animate(prev.current, value, {
      duration: 0.45, ease: [0.25, 1, 0.5, 1],
      onUpdate: (v) => { el.textContent = v.toFixed(decimals); },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, decimals]);
  return <span ref={ref} aria-hidden="true">{value.toFixed(decimals)}</span>;
}

// ---- Input primitives ------------------------------------------------------

function Chips({ label, options, value, onChange, note }) {
  return (
    <div className="ob-field" role="group" aria-label={label}>
      <span className="ob-label">{label}</span>
      <div className="ob-chips">
        {options.map((o) => (
          <button
            key={o.value} type="button"
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

function Stepper({ label, value, onChange, min = 0, max = 99, step = 1, live }) {
  const clamp = (v) => Math.min(max, Math.max(min, v));
  return (
    <div className="ob-field">
      <span className="ob-label">{label}</span>
      <div className="ob-stepper">
        <button type="button" aria-label={'Decrease ' + label} onClick={() => onChange(clamp(value - step))}>−</button>
        <input
          type="number" min={min} max={max} step={step} value={value}
          aria-label={label}
          onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
        />
        <button type="button" aria-label={'Increase ' + label} onClick={() => onChange(clamp(value + step))}>+</button>
        {live != null && <span className="ob-live">{live}</span>}
      </div>
    </div>
  );
}

function SliderField({ label, value, onChange, min, max, step, unit, live }) {
  return (
    <div className="ob-field">
      <div className="ob-slider-head">
        <span className="ob-label">{label}</span>
        <span className="ob-value">{value.toLocaleString()}<em> {unit}</em></span>
      </div>
      <input
        type="range" className="ob-range"
        min={min} max={max} step={step} value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {live != null && <span className="ob-live">{live}</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The guided audit, staged full-screen. Same five questions and the same
// profile builder as before; the difference is that every answer prices
// itself the moment it lands, and the running total recalculates in view.
// ---------------------------------------------------------------------------
export default function Onboarding({ onDone, onBuilt, onCancel }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState(DEFAULTS);
  const [fl, setFl] = useState({ route: 'SYD-MEL', km: 700, cabin: 'economy', ret: true });
  const [reaction, setReaction] = useState('');
  const headRef = useRef(null);
  const set = (k, v) => setA((s) => ({ ...s, [k]: v }));
  const num = (v) => (v === '' || isNaN(Number(v)) ? 0 : Number(v));

  const runningTotal = useMemo(() => aggregate(buildProfileFromOnboarding(a)).total, [a]);
  const doneProfile = useMemo(() => (step === 5 ? buildProfileFromOnboarding(a) : null), [step, a]);

  // The done pane says the audit is saved, so save it as the pane appears;
  // closing with Escape or the cross after that point loses nothing.
  useEffect(() => { if (doneProfile) onBuilt(doneProfile); }, [doneProfile, onBuilt]);

  // Focus the incoming step's heading after the pane transition settles.
  useEffect(() => {
    const id = window.setTimeout(() => headRef.current?.focus(), prefersReducedMotion() ? 0 : 320);
    return () => window.clearTimeout(id);
  }, [step]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // The overlay is modal: everything behind it goes inert so keyboard and
    // screen-reader focus cannot wander into the covered page.
    const behind = document.querySelectorAll('nav.nav, #main-content, footer.fp-footer, .st-root');
    behind.forEach((el) => el.setAttribute('inert', ''));
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      behind.forEach((el) => el.removeAttribute('inert'));
    };
  }, [onCancel]);

  useEffect(() => { if (step === 5) audio.chime(); }, [step]);

  // Debounced copy of the running total for the polite live region, so
  // dragging a slider announces one settled value, not sixty per second.
  const [announcedTotal, setAnnouncedTotal] = useState(() => fmtT(runningTotal));
  useEffect(() => {
    const id = window.setTimeout(() => setAnnouncedTotal(fmtT(runningTotal)), 600);
    return () => window.clearTimeout(id);
  }, [runningTotal]);

  const addFlight = () => {
    const route = FLIGHT_ROUTES.find((r) => r.id === fl.route);
    const entry = { ...fl, km: route ? route.km : num(fl.km) };
    const t = LIVE.flight(a, entry);
    const next = { ...a, flights: [...a.flights, entry] };
    setA(next);
    // Micro-reaction: rank this flight among every line logged so far.
    const entries = buildProfileFromOnboarding(next).entries.sort((x, y) => y.tco2e - x.tco2e);
    const rank = entries.findIndex((e) => Math.abs(e.tco2e - t) < 0.0005) + 1;
    audio.tick(0.8);
    setReaction(rank === 1
      ? fill(OB.flightTop, { t: fmtT(t) })
      : fill(OB.flightAdded[Math.min(next.flights.length - 1, OB.flightAdded.length - 1)], { t: fmtT(t), rank: Math.max(rank, 2) }));
  };

  const dietOptions = Object.entries(DIET_TYPES).map(([k, v]) => ({
    value: k, label: v.label.split(' (')[0], note: fill(OB.approx, { t: fmtT(LIVE.diet(a, k)) }),
  }));

  const steps = [
    <div key="you">
      <h3 ref={headRef} tabIndex={-1}>{ONBOARD.you.title}</h3>
      <p>{ONBOARD.you.sub}</p>
      <Chips
        label={ONBOARD.you.state}
        options={Object.entries(ELECTRICITY).map(([k, v]) => ({ value: k, label: v.label }))}
        value={a.state} onChange={(v) => set('state', v)}
      />
      <Stepper label={ONBOARD.you.household} value={a.householdSize} min={1} max={10} onChange={(v) => set('householdSize', v)} />
      <p className="ob-note">{ONBOARD.you.householdNote}</p>
      <Chips
        label={ONBOARD.you.dwelling}
        options={[
          { value: 'house', label: ONBOARD.you.dwellingHouse },
          { value: 'apartment', label: ONBOARD.you.dwellingApartment },
        ]}
        value={a.dwelling} onChange={(v) => set('dwelling', v)}
      />
    </div>,
    <div key="energy">
      <h3 ref={headRef} tabIndex={-1}>{ONBOARD.energy.title}</h3>
      <p>{ONBOARD.energy.sub}</p>
      <SliderField label={ONBOARD.energy.kwh} value={a.kwhQuarter} min={0} max={6000} step={10} unit="kWh"
        onChange={(v) => set('kwhQuarter', v)} live={approx(LIVE.electricity(a))} />
      <SliderField label={ONBOARD.energy.mj} value={a.mjQuarter} min={0} max={30000} step={50} unit="MJ"
        onChange={(v) => set('mjQuarter', v)} live={approx(LIVE.gas(a))} />
      <SliderField label={ONBOARD.energy.greenpower} value={a.greenpowerPct} min={0} max={100} step={5} unit="%"
        onChange={(v) => set('greenpowerPct', v)} />
    </div>,
    <div key="travel">
      <h3 ref={headRef} tabIndex={-1}>{ONBOARD.travel.title}</h3>
      <p>{ONBOARD.travel.sub}</p>
      <SliderField label={ONBOARD.travel.car} value={a.carKmWeek} min={0} max={1000} step={5} unit="km / wk"
        onChange={(v) => set('carKmWeek', v)} live={a.carKmWeek > 0 ? approx(LIVE.car(a)) : null} />
      {a.carKmWeek > 0 && (
        <Chips
          label={ONBOARD.travel.fuelType}
          options={Object.entries(ROAD_FUELS).map(([k, v]) => ({ value: k, label: v.label }))}
          value={a.fuelType} onChange={(v) => set('fuelType', v)}
        />
      )}
      <SliderField label={ONBOARD.travel.rideshare} value={a.rideshareWeek} min={0} max={400} step={5} unit="$ / wk"
        onChange={(v) => set('rideshareWeek', v)} live={a.rideshareWeek > 0 ? approx(LIVE.rideshare(a)) : null} />
      <SliderField label={ONBOARD.travel.pt} value={a.ptWeek} min={0} max={250} step={5} unit="$ / wk"
        onChange={(v) => set('ptWeek', v)} live={a.ptWeek > 0 ? approx(LIVE.pt(a)) : null} />
    </div>,
    <div key="flights">
      <h3 ref={headRef} tabIndex={-1}>{ONBOARD.flights.title}</h3>
      <p>{ONBOARD.flights.sub}</p>
      <div className="ob-flight-form">
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
        <Chips
          label={ONBOARD.flights.cabin}
          options={[
            { value: 'economy', label: 'Economy' }, { value: 'premium', label: 'Premium' },
            { value: 'business', label: 'Business' }, { value: 'first', label: 'First' },
          ]}
          value={fl.cabin} onChange={(v) => setFl((s) => ({ ...s, cabin: v }))}
        />
        <Chips
          label={ONBOARD.flights.return}
          options={[{ value: true, label: 'Return' }, { value: false, label: 'One way' }]}
          value={fl.ret} onChange={(v) => setFl((s) => ({ ...s, ret: v }))}
        />
        <button type="button" className="btn btn-primary fp-btn" onClick={addFlight}>
          {ONBOARD.flights.add} · {approx(LIVE.flight(a, { ...fl, km: fl.route === 'custom' ? num(fl.km) : fl.km }))}
        </button>
      </div>
      <p className="ob-reaction" role="status">{reaction}</p>
      <ul className="fp-ob-flights">
        {a.flights.map((f, i) => {
          const routeLabel = (FLIGHT_ROUTES.find((r) => r.id === f.route) || { label: f.km + ' km' }).label;
          return (
            <li key={i}>
              {routeLabel}{f.ret ? ' return' : ''} · {f.cabin} · <strong>{fmtT(LIVE.flight(a, f), 2)} t</strong>
              <button type="button" aria-label={'Remove ' + routeLabel} onClick={() => setA((s) => ({ ...s, flights: s.flights.filter((_, j) => j !== i) }))}>×</button>
            </li>
          );
        })}
        {!a.flights.length && <li className="ob-none">{ONBOARD.flights.none}</li>}
      </ul>
    </div>,
    <div key="food">
      <h3 ref={headRef} tabIndex={-1}>{ONBOARD.food.title}</h3>
      <p>{ONBOARD.food.sub}</p>
      <Chips label={ONBOARD.food.diet} options={dietOptions} value={a.dietType} onChange={(v) => set('dietType', v)} />
      <Stepper label={ONBOARD.food.parcels} value={a.parcelsMonth} min={0} max={200}
        onChange={(v) => set('parcelsMonth', v)} live={a.parcelsMonth > 0 ? approx(LIVE.parcels(a)) : null} />
      <Stepper label={ONBOARD.food.intlOrders} value={a.intlOrdersMonth} min={0} max={100}
        onChange={(v) => set('intlOrdersMonth', v)} live={a.intlOrdersMonth > 0 ? approx(LIVE.intl(a)) : null} />
    </div>,
    <div key="done" className="ob-done">
      <h3 ref={headRef} tabIndex={-1}>{OB.done.title}</h3>
      <div className="ob-done-num display">
        <span className="sr-only">{fmtT(runningTotal) + ' tonnes per year'}</span>
        <LiveNumber value={runningTotal} /> <span className="ob-done-unit" aria-hidden="true">t / yr</span>
      </div>
      <p>{OB.done.sub}</p>
      <div className="ob-done-ctas">
        <button type="button" className="btn btn-primary fp-btn" onClick={() => onDone(doneProfile, { watch: true })}>{OB.done.watch} →</button>
        <button type="button" className="fp-linkbtn" onClick={() => onDone(doneProfile, { watch: false })}>{OB.done.skip}</button>
      </div>
    </div>,
  ];

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
            {step === 5 ? OB.done.title : fill(OB.stepOf, { n: step + 1, total: OB.stepLabels.length }) + ': ' + OB.stepLabels[step]}
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

      {step < 5 && (
        <div className="ob-foot">
          <div className="canvas ob-foot-inner">
            <div className="ob-total">
              <span className="ob-total-l">{OB.soFar}</span>
              <span className="ob-total-v" aria-hidden="true">
                <LiveNumber value={runningTotal} /><em> {OB.perYear}</em>
              </span>
              <span className="sr-only" aria-live="polite">{fill(OB.soFarSr, { t: announcedTotal })}</span>
              <span className="ob-total-note">{OB.liveNote}</span>
            </div>
            <div className="ob-foot-btns">
              <button type="button" className="fp-linkbtn" onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}>
                {step === 0 ? ONBOARD.cancel : ONBOARD.back}
              </button>
              <button type="button" className="btn btn-primary fp-btn" onClick={() => setStep(step + 1)}>
                {step === 4 ? ONBOARD.finish : ONBOARD.next} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
