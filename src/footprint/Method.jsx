// The basis of preparation, on its own page (/footprint/method/). Rendered
// from the live factor set the calculator prices from, so the tables can
// never drift from the maths. Any change to the engine, factors, abatement
// options or pathway model must land here in the same change (see CLAUDE.md).

import SplitText from '../components/SplitText';
import {
  FACTOR_SET, ELECTRICITY, ELECTRICITY_SOURCE, GAS, GAS_SOURCE,
  ROAD_FUELS, ROAD_MODES, ROAD_SOURCE, FLIGHT_FACTORS, FLIGHT_SOURCE, FLIGHT_RF_MULTIPLIER,
  FREIGHT_MODES, FREIGHT_SOURCE, DIET_TYPES, DIET_SOURCE, FOOD_PER_KG, GRID_DECLINE,
  QUALITY_TIERS, QUALITY_SOURCE,
} from './data/factors';
import { METHOD, fmtT } from './data/copy';
import { fill } from './data/storyCopy';

function FTable({ caption, head, rows, source }) {
  return (
    <div className="fp-ftable">
      <div className="fp-ftable-cap">{caption}</div>
      <div className="fp-scroll-x">
        <table className="fp-table">
          <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {source && <div className="fp-ftable-src">{source.name}. {source.detail}{' '}
        {source.url && <a href={source.url} target="_blank" rel="noopener noreferrer">Source ↗</a>}
      </div>}
    </div>
  );
}

const n3 = (v) => Number(v).toFixed(v < 0.01 ? 4 : 3);

export default function Method({ agg, periodLabel }) {
  // Radiative forcing sensitivity, computed from the audit the visitor left
  // behind on the dashboard: both bases are published; the page states what
  // the other one would say.
  const flightsT = agg ? agg.byCategory.flight || 0 : 0;
  const noRfFlights = flightsT / FLIGHT_RF_MULTIPLIER;
  const noRfTotal = agg ? agg.total - flightsT + noRfFlights : 0;
  return (
    <section id="fp-method">
      <div className="canvas">
        <div className="sec-tag" data-idx="./ ">{METHOD.tag}</div>
        <h1 className="display fp-h2"><SplitText text={METHOD.title[0]} /> <SplitText text={METHOD.title[1]} accentIndex={1} /></h1>
        <p className="fp-sub">{METHOD.sub}</p>
        <p className="fp-note">← <a href="../">{METHOD.backToDash}</a></p>

        <div className="fp-method-grid">
          <div className="fp-method-block">
            <h3>{METHOD.boundary.title}</h3>
            {METHOD.boundary.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3>{METHOD.period.title}</h3>
            {METHOD.period.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3>{METHOD.marketBased.title}</h3>
            {METHOD.marketBased.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3>{METHOD.quality.title}</h3>
            {METHOD.quality.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3>{METHOD.uncertainty.title}</h3>
            {METHOD.uncertainty.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3>{METHOD.sensitivity.title}</h3>
            <p>{agg ? fill(METHOD.sensitivity.para, { flights: fmtT(noRfFlights), total: fmtT(noRfTotal) }) : METHOD.sensitivity.para}</p>
            {periodLabel && <p className="fp-note">{fill(METHOD.sensitivityBasis, { label: periodLabel })}</p>}
          </div>
          <div className="fp-method-block fp-method-wide">
            <h3>{METHOD.plan.title}</h3>
            {METHOD.plan.paras.map((p, i) => <p key={i}>{p}</p>)}
            <p className="fp-note">Grid trajectory in the pathway: scope 2 factor declining {Math.round((1 - GRID_DECLINE.ratePerYear) * 100)}% a year to a floor, {GRID_DECLINE.source}</p>
          </div>
          <div className="fp-method-block fp-method-wide">
            <h3>{METHOD.character.title}</h3>
            {METHOD.character.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="fp-method-block fp-method-wide">
          <h3>{METHOD.factorsTitle}</h3>
          <p>{METHOD.factorsSub}</p>

          <FTable
            caption="Electricity, by state and grid region · kg CO₂-e per kWh"
            head={['State / region', 'Scope 2', 'Scope 3']}
            rows={Object.values(ELECTRICITY).map((r) => [r.label + (r.grid ? ' · ' + r.grid : ''), r.s2.toFixed(2), r.s3.toFixed(2)])}
            source={ELECTRICITY_SOURCE}
          />
          <FTable
            caption="Natural gas (metro residential) · kg CO₂-e per MJ"
            head={['Component', 'Factor']}
            rows={[
              ['Scope 1 combustion', GAS.s1_per_MJ.toFixed(5)],
              ...Object.entries(GAS.s3_per_MJ).map(([st, v]) => ['Scope 3 fuel-cycle, ' + st, v.toFixed(4)]),
            ]}
            source={GAS_SOURCE}
          />
          <FTable
            caption="Road · fuels per litre, modes per passenger-km"
            head={['Item', 'Scope 1', 'Scope 3', 'Basis']}
            rows={[
              ['Petrol (per L)', ROAD_FUELS.petrol.s1_per_L.toFixed(2), ROAD_FUELS.petrol.s3_per_L.toFixed(2), 'NGA 2025 Table 9'],
              ['Hybrid (per L)', ROAD_FUELS.hybrid.s1_per_L.toFixed(2), ROAD_FUELS.hybrid.s3_per_L.toFixed(2), 'Petrol factors at ' + ROAD_FUELS.hybrid.defaultL100km + ' L/100km default consumption'],
              ['Diesel (per L)', ROAD_FUELS.diesel.s1_per_L.toFixed(2), ROAD_FUELS.diesel.s3_per_L.toFixed(2), 'NGA 2025 Table 9'],
              ['EV (per km)', '0', 'grid factors', ROAD_FUELS.ev.kWhPerKm + ' kWh/km at the state electricity factors'],
              ['Rideshare / taxi (per km)', 'n/a', ROAD_MODES.rideshare.perKm.toFixed(3), ROAD_MODES.rideshare.source],
              ['Public transport (per km)', 'n/a', ROAD_MODES.pt.perKm.toFixed(3), ROAD_MODES.pt.source],
            ]}
            source={ROAD_SOURCE}
          />
          <FTable
            caption={'Flights · kg CO₂-e per passenger-km, radiative forcing included (×' + FLIGHT_RF_MULTIPLIER + '); divide by ' + FLIGHT_RF_MULTIPLIER + ' for the without-RF view'}
            head={['Band', 'Economy', 'Premium', 'Business', 'First']}
            rows={Object.values(FLIGHT_FACTORS).map((b) => [
              b.label + (b.noCabinSplit ? ' (average passenger, no cabin split)' : ''),
              n3(b.withRF.economy), n3(b.withRF.premium), n3(b.withRF.business), n3(b.withRF.first),
            ])}
            source={FLIGHT_SOURCE}
          />
          <FTable
            caption="Freight · kg CO₂-e"
            head={['Mode', 'Factor', 'Unit']}
            rows={[
              [FREIGHT_MODES.road.label, FREIGHT_MODES.road.perTonneKm.toFixed(3), 'per t-km'],
              [FREIGHT_MODES.air.label, FREIGHT_MODES.air.perTonneKm.toFixed(2), 'per t-km'],
              [FREIGHT_MODES.sea.label, FREIGHT_MODES.sea.perTonneKm.toFixed(3), 'per t-km'],
              [FREIGHT_MODES.parcel.label, FREIGHT_MODES.parcel.perParcel.toFixed(2), 'per parcel'],
            ]}
            source={FREIGHT_SOURCE}
          />
          <FTable
            caption="Diet · kg CO₂-e per day, by diet type (indicative)"
            head={['Diet', 'Per day', 'Per year (t)']}
            rows={Object.values(DIET_TYPES).map((d) => [d.label, d.perDay.toFixed(2), ((d.perDay * 365) / 1000).toFixed(2)])}
            source={DIET_SOURCE}
          />
          <FTable
            caption="Reference: per-kg food factors (context for the diet bands, not used in pricing)"
            head={['Food', 'kg CO₂-e per kg']}
            rows={FOOD_PER_KG.rows.map(([f, v]) => [f, v.toFixed(1)])}
            source={{ name: FOOD_PER_KG.source, detail: '' }}
          />
          <FTable
            caption="Data quality tiers · uncertainty band applied per entry"
            head={['Tier', 'Band', 'What it covers']}
            rows={Object.values(QUALITY_TIERS).map((t) => [t.label, '±' + Math.round(t.band * 100) + '%', t.plain])}
            source={QUALITY_SOURCE}
          />
        </div>

        <div className="fp-method-block fp-method-wide">
          <h3>{METHOD.refresh.title}</h3>
          {METHOD.refresh.paras.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="fp-method-block fp-method-wide">
          <h3>{METHOD.exclusions.title}</h3>
          <ul className="fp-exclusions">
            {METHOD.exclusions.items.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
          <p className="fp-note">{METHOD.versionTitle}: {FACTOR_SET.id} · updated {FACTOR_SET.updated} · {FACTOR_SET.note}</p>
        </div>
      </div>
    </section>
  );
}
