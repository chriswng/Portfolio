import { useRef, useState } from 'react';
import SplitText from '../components/SplitText';
import { CATEGORIES, categoryById, FLIGHT_ROUTES, ROAD_FUELS, DIET_TYPES } from './data/factors';
import { LOG, fmtT } from './data/copy';
import { analyseCsv, buildEntriesFromImport, templateCsv } from './lib/importCsv';
import { exportProfile, parseImported } from './lib/store';

const todayIso = () => new Date().toISOString().slice(0, 10);

function Field({ label, children }) {
  return (
    <label className="fp-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Manual entry form: minimal fields per category, priced on submit.
// ---------------------------------------------------------------------------
function EntryForm({ onAdd }) {
  const [cat, setCat] = useState('flight');
  const [f, setF] = useState({ date: todayIso(), route: 'SYD-MEL', cabin: 'economy', ret: true, km: '', amount: '', household: true, months: 3, mode: 'car', fuel: 'petrol', occupants: 1, freightKind: 'parcels', dietType: 'medMeat', days: 365, label: '' });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const num = (v) => (v === '' || isNaN(Number(v)) ? 0 : Number(v));

  const submit = (e) => {
    e.preventDefault();
    let draft = null;
    const base = { date: f.date, label: f.label, notes: '' };
    if (cat === 'flight') {
      const route = FLIGHT_ROUTES.find((r) => r.id === f.route);
      const km = f.route === 'custom' ? num(f.km) : route.km;
      const band = f.route === 'custom' ? undefined : route.band;
      if (!km) return;
      draft = { ...base, category: 'flight', label: f.label || (route ? route.label + (f.ret ? ' return' : '') : 'Flight'), meta: { km, band, international: f.route === 'custom' ? num(f.km) > 1500 : undefined, cabin: f.cabin, return: f.ret } };
    } else if (cat === 'electricity') {
      if (!num(f.amount)) return;
      draft = { ...base, category: 'electricity', label: f.label || 'Power bill', period_months: num(f.months), meta: { kwh: num(f.amount), wholeHousehold: f.household } };
    } else if (cat === 'gas') {
      if (!num(f.amount)) return;
      draft = { ...base, category: 'gas', label: f.label || 'Gas bill', period_months: num(f.months), meta: { mj: num(f.amount), wholeHousehold: f.household } };
    } else if (cat === 'road') {
      if (!num(f.km)) return;
      const label = f.label || (f.mode === 'pt' ? 'Public transport' : f.mode === 'car' ? 'Driving' : 'Rideshare');
      draft = { ...base, category: 'road', label, period_months: num(f.months), meta: f.mode === 'car' ? { mode: 'car', fuel: f.fuel, km: num(f.km), occupants: Math.max(1, num(f.occupants) || 1) } : { mode: f.mode, km: num(f.km) } };
    } else if (cat === 'freight') {
      if (!num(f.amount)) return;
      draft = f.freightKind === 'parcels'
        ? { ...base, category: 'freight', label: f.label || 'Parcels', period_months: num(f.months), meta: { parcels: num(f.amount) } }
        : { ...base, category: 'freight', label: f.label || 'Freight (' + f.freightKind + ')', period_months: num(f.months), meta: { mode: f.freightKind, tonneKm: num(f.amount) } };
    } else if (cat === 'diet') {
      if (!num(f.days)) return;
      draft = { ...base, category: 'diet', label: f.label || DIET_TYPES[f.dietType].label, period_months: 12, meta: { dietType: f.dietType, days: num(f.days) } };
    }
    if (draft) { onAdd(draft); set('label', ''); set('amount', ''); set('km', ''); }
  };

  return (
    <form className="fp-entryform" onSubmit={submit}>
      <div className="fp-form-row">
        <Field label="Category">
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATEGORIES.filter((c) => c.id !== 'other').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Date"><input type="date" value={f.date} onChange={(e) => set('date', e.target.value)} required /></Field>
        <Field label="Label (optional)"><input type="text" value={f.label} onChange={(e) => set('label', e.target.value)} placeholder="e.g. Winter power bill" /></Field>
      </div>

      {cat === 'flight' && (
        <div className="fp-form-row">
          <Field label="Route">
            <select value={f.route} onChange={(e) => set('route', e.target.value)}>
              {FLIGHT_ROUTES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              <option value="custom">Custom distance…</option>
            </select>
          </Field>
          {f.route === 'custom' && <Field label="km, one way"><input type="number" min="50" value={f.km} onChange={(e) => set('km', e.target.value)} /></Field>}
          <Field label="Cabin">
            <select value={f.cabin} onChange={(e) => set('cabin', e.target.value)}>
              <option value="economy">Economy</option><option value="premium">Premium</option>
              <option value="business">Business</option><option value="first">First</option>
            </select>
          </Field>
          <Field label="Return">
            <input type="checkbox" checked={f.ret} onChange={(e) => set('ret', e.target.checked)} />
          </Field>
        </div>
      )}

      {(cat === 'electricity' || cat === 'gas') && (
        <div className="fp-form-row">
          <Field label={cat === 'electricity' ? 'kWh on the bill' : 'MJ on the bill'}>
            <input type="number" min="0" value={f.amount} onChange={(e) => set('amount', e.target.value)} />
          </Field>
          <Field label="Months covered"><input type="number" min="1" max="12" value={f.months} onChange={(e) => set('months', e.target.value)} /></Field>
          <Field label="Whole household (split per adult)">
            <input type="checkbox" checked={f.household} onChange={(e) => set('household', e.target.checked)} />
          </Field>
        </div>
      )}

      {cat === 'road' && (
        <div className="fp-form-row">
          <Field label="Mode">
            <select value={f.mode} onChange={(e) => set('mode', e.target.value)}>
              <option value="car">My car</option><option value="rideshare">Rideshare / taxi</option><option value="pt">Public transport</option>
            </select>
          </Field>
          {f.mode === 'car' && (
            <>
              <Field label="Fuel">
                <select value={f.fuel} onChange={(e) => set('fuel', e.target.value)}>
                  {Object.entries(ROAD_FUELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </Field>
              <Field label="People in the car (avg)">
                <input type="number" min="1" max="7" value={f.occupants} onChange={(e) => set('occupants', e.target.value)} />
              </Field>
            </>
          )}
          <Field label="km"><input type="number" min="0" value={f.km} onChange={(e) => set('km', e.target.value)} /></Field>
          <Field label="Months covered"><input type="number" min="1" max="12" value={f.months} onChange={(e) => set('months', e.target.value)} /></Field>
        </div>
      )}

      {cat === 'freight' && (
        <div className="fp-form-row">
          <Field label="Kind">
            <select value={f.freightKind} onChange={(e) => set('freightKind', e.target.value)}>
              <option value="parcels">Parcels (count)</option><option value="road">Road t-km</option>
              <option value="air">Air t-km</option><option value="sea">Sea t-km</option>
            </select>
          </Field>
          <Field label={f.freightKind === 'parcels' ? 'Parcels' : 'Tonne-km'}>
            <input type="number" min="0" value={f.amount} onChange={(e) => set('amount', e.target.value)} />
          </Field>
          <Field label="Months covered"><input type="number" min="1" max="12" value={f.months} onChange={(e) => set('months', e.target.value)} /></Field>
        </div>
      )}

      {cat === 'diet' && (
        <div className="fp-form-row">
          <Field label="Diet">
            <select value={f.dietType} onChange={(e) => set('dietType', e.target.value)}>
              {Object.entries(DIET_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
          <Field label="Days"><input type="number" min="1" max="366" value={f.days} onChange={(e) => set('days', e.target.value)} /></Field>
        </div>
      )}

      <button type="submit" className="btn btn-primary fp-btn">Add entry →</button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Bank CSV import with review step.
// ---------------------------------------------------------------------------
function CsvImport({ settings, onAddEntries }) {
  const [analysis, setAnalysis] = useState(null);
  const [include, setInclude] = useState({ fuel: true, rideshare: true, pt: true, parcels: true });
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = (file) => {
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      try { setAnalysis(analyseCsv(String(reader.result))); }
      catch (err) { setAnalysis(null); setError(err.message); }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const blob = new Blob([templateCsv()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'footprint-transactions-template.csv';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const confirm = () => {
    const entries = buildEntriesFromImport(analysis, include, settings);
    onAddEntries(entries);
    setAnalysis(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const g = analysis ? analysis.groups : null;
  const convRow = (key, label, detail) => g && g[key].count > 0 && (
    <label className="fp-imp-row" key={key}>
      <input type="checkbox" checked={include[key]} onChange={(e) => setInclude((s) => ({ ...s, [key]: e.target.checked }))} />
      <span className="fp-imp-name">{label}</span>
      <span className="fp-imp-detail">{detail}</span>
    </label>
  );

  return (
    <div className="fp-import">
      <div className="fp-card-head">{LOG.importTitle}</div>
      <p className="fp-card-sub">{LOG.importSub}</p>
      <div className="fp-imp-actions">
        <input
          ref={fileRef} type="file" accept=".csv,text/csv" aria-label="Upload bank CSV"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
        <button type="button" className="fp-linkbtn" onClick={downloadTemplate}>{LOG.templateCta}</button>
      </div>
      {error && <p className="fp-error" role="alert">{error}</p>}
      {analysis && (
        <div className="fp-imp-review">
          <p className="fp-imp-sum">
            {analysis.rowCount.toLocaleString()} transactions read, {analysis.from} to {analysis.to}. Converting only what is honest:
          </p>
          {convRow('fuel', 'Petrol', '$' + Math.round(g.fuel.total).toLocaleString() + ' across ' + g.fuel.count + ' fills → litres at the average pump price')}
          {convRow('rideshare', 'Rideshare and taxis', '$' + Math.round(g.rideshare.total).toLocaleString() + ' across ' + g.rideshare.count + ' trips → km at an average fare')}
          {convRow('pt', 'Public transport', '$' + Math.round(g.pt.total).toLocaleString() + ' in fares → km at an average fare')}
          {convRow('parcels', 'Online orders', g.parcels.count + ' orders (' + g.parcels.intlCount + ' overseas) → parcels and air-express freight')}
          {g.fuel.count + g.rideshare.count + g.pt.count + g.parcels.count === 0 && (
            <p className="fp-imp-none">No convertible vendors found. The template shows the merchant styles the rules recognise.</p>
          )}
          {g.airline.count > 0 && (
            <div className="fp-imp-checklist">
              <div className="fp-imp-check-head">Flights spotted: add the actual routes above, not the dollars</div>
              <ul>
                {g.airline.txns.slice(0, 12).map((t, i) => (
                  <li key={i}>{t.date} · {t.desc.slice(0, 44)} · ${Math.abs(t.amt).toFixed(0)}</li>
                ))}
              </ul>
            </div>
          )}
          {g.energy.count > 0 && (
            <div className="fp-imp-checklist">
              <div className="fp-imp-check-head">Energy retailer payments spotted: log the kWh and MJ off the bills instead</div>
              <ul>{g.energy.txns.slice(0, 6).map((t, i) => <li key={i}>{t.date} · {t.desc.slice(0, 44)} · ${Math.abs(t.amt).toFixed(0)}</li>)}</ul>
            </div>
          )}
          {g.dining.count > 0 && (
            <p className="fp-imp-diet">Diet sanity check: {g.dining.count} grocery and dining transactions this year. Not converted; make sure the diet entry above matches reality.</p>
          )}
          <button type="button" className="btn btn-primary fp-btn" onClick={confirm}>Add the ticked estimates →</button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The log section.
// ---------------------------------------------------------------------------
export default function Log({ profile, isExample, onAdd, onAddEntries, onDelete, onExport, onImportFile, onShare, onReset, onStart }) {
  const [importMsg, setImportMsg] = useState('');
  const entries = [...profile.entries].sort((a, b) => (a.date < b.date ? 1 : -1));

  const handleImportBackup = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try { onImportFile(parseImported(String(reader.result))); setImportMsg('Backup imported.'); }
      catch (err) { setImportMsg(err.message); }
    };
    reader.readAsText(file);
  };

  return (
    <section id="fp-log">
      <div className="canvas">
        <div className="sec-tag" data-idx="04 / ">The log</div>
        <h2 className="display fp-h2"><SplitText text={LOG.title[0]} /> <SplitText text={LOG.title[1]} accentIndex={1} /></h2>
        <p className="fp-sub">{LOG.sub}</p>

        <div className="fp-scroll-x">
          <table className="fp-table">
            <thead>
              <tr><th>Date</th><th>Entry</th><th>Category</th><th>Activity</th><th>Factor</th><th>Scope</th><th>tCO₂-e</th>{!isExample && <th aria-label="Actions" />}</tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="mono">{e.date}</td>
                  <td>
                    <span className="fp-e-label">{e.label}</span>
                    {e.notes && <span className="fp-e-notes">{e.notes}</span>}
                  </td>
                  <td><span className="fp-leg-dot" style={{ background: categoryById(e.category).hex }} /> {categoryById(e.category).label}</td>
                  <td className="mono">{Number(e.activity_data).toLocaleString()} {e.unit}</td>
                  <td className="fp-e-factor">{e.factor_used} kg/{e.unit}<span className="fp-e-src">{e.factor_source}</span></td>
                  <td className="mono">{e.scope}</td>
                  <td className="mono strong">{fmtT(e.tco2e, 3)}</td>
                  {!isExample && (
                    <td><button type="button" className="fp-del" aria-label={'Delete ' + e.label} onClick={() => onDelete(e.id)}>×</button></td>
                  )}
                </tr>
              ))}
              {!entries.length && <tr><td colSpan={8}>No entries yet. Add one below or run the guided audit.</td></tr>}
            </tbody>
          </table>
        </div>

        {isExample ? (
          <div className="fp-example-note">
            <p>This log is the worked example, so it is read-only. Your own log is editable, private to your browser, and starts with one click.</p>
            <button type="button" className="btn btn-primary fp-btn" onClick={onStart}>Start your own audit →</button>
          </div>
        ) : (
          <>
            <div className="fp-card">
              <div className="fp-card-head">{LOG.addTitle}</div>
              <EntryForm onAdd={onAdd} />
            </div>

            <div className="fp-card">
              <CsvImport settings={profile.settings} onAddEntries={onAddEntries} />
            </div>

            <div className="fp-card fp-controls">
              <div className="fp-card-head">{LOG.controls.title}</div>
              <p className="fp-card-sub">{LOG.controls.body}</p>
              <div className="fp-ctrl-row">
                <button type="button" className="fp-linkbtn" onClick={onExport}>{LOG.controls.export}</button>
                <label className="fp-linkbtn fp-filebtn">
                  {LOG.controls.import}
                  <input type="file" accept=".json,application/json" onChange={(e) => e.target.files[0] && handleImportBackup(e.target.files[0])} />
                </label>
                <button type="button" className="fp-linkbtn" onClick={onShare}>{LOG.controls.share}</button>
                <button type="button" className="fp-linkbtn danger" onClick={onReset}>{LOG.controls.reset}</button>
              </div>
              <p className="fp-note">{LOG.controls.shareNote}</p>
              {importMsg && <p className="fp-note" role="status">{importMsg}</p>}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
