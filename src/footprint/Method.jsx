// The "how it works" page, on its own route (/footprint/method/). Rendered
// from the live factor set the calculator prices from, so the tables can
// never drift from the maths. Any change to the engine, factors, reduction
// options or pathway model must land here in the same change (see CLAUDE.md).

import SplitText from '../components/SplitText';
import {
  ELECTRICITY, ELECTRICITY_SOURCE, GAS, GAS_SOURCE,
  ROAD_FUELS, ROAD_MODES, ROAD_SOURCE, FLIGHT_FACTORS, FLIGHT_SOURCE, FLIGHT_RF_MULTIPLIER,
  FREIGHT_MODES, FREIGHT_SOURCE, DIET_TYPES, DIET_SOURCE, FOOD_PER_KG, GRID_DECLINE,
  GOODS, GOODS_SOURCE, GOODS_FX, goodsPerAud,
  CLOTHING_ITEMS, CLOTHING_ITEMS_SOURCE,
  HOTEL, HOTEL_SOURCE,
} from './data/factors';
import { METHOD } from './data/copy';
import Icon from './Icons';

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

export default function Method() {
  return (
    <section id="fp-method">
      <div className="canvas">
        <div className="sec-tag" data-idx="./ "><Icon name="book" size={16} />{METHOD.tag}</div>
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
            <h3>{METHOD.sources.title}</h3>
            {METHOD.sources.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3>{METHOD.quality.title}</h3>
            {METHOD.quality.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3>{METHOD.interpret.title}</h3>
            {METHOD.interpret.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3>{METHOD.plan.title}</h3>
            {METHOD.plan.paras.map((p, i) => <p key={i}>{p}</p>)}
            <p className="fp-note">Grid trajectory used in the chart: the electricity factor declines about {Math.round((1 - GRID_DECLINE.ratePerYear) * 100)}% a year toward a floor, {GRID_DECLINE.source}</p>
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
            caption="Diet · kg CO₂-e per day, by diet type (estimate)"
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
            caption="Goods & services (optional detail) · spend-based screening estimate"
            head={['Category', 'kg CO₂-e / 2022 USD', 'kg CO₂-e / A$ spent', 'Representative EPA commodities (with margins)']}
            rows={Object.entries(GOODS).map(([k, g]) => [g.label, g.usPerUsd.toFixed(3), goodsPerAud(k).toFixed(4), g.basis])}
            source={GOODS_SOURCE}
          />
          <p className="fp-note">
            Currency and inflation bridge: each per-2022-USD factor is multiplied by {GOODS_FX.audUsd} (USD per A$) and divided by {GOODS_FX.inflation} (US CPI-U, 2022 to reporting year) to price spend in current Australian dollars. {GOODS_FX.audUsdNote} {GOODS_FX.inflationNote} This block is a screening estimate for a US consumption basket applied to Australian spend; treat it as coarse and lower-confidence than the metered lines above.
          </p>
          <FTable
            caption="Clothing by item (optional detail) · kg CO₂-e per item, cradle-to-grave"
            head={['Bucket', 'kg CO₂-e / item', 'Product rows behind the mean (ADEME 2018, per item)']}
            rows={Object.values(CLOTHING_ITEMS).map((c) => [c.label, c.perItem.toFixed(1), c.basis])}
            source={CLOTHING_ITEMS_SOURCE}
          />
          <FTable
            caption="Hotel nights (optional detail) · kg CO₂-e per occupied room-night, by country"
            head={['Country', 'kg CO₂-e / room-night']}
            rows={Object.values(HOTEL.countries).map((h) => [h.label, h.perNight.toFixed(1)])}
            source={HOTEL_SOURCE}
          />
        </div>

        <div className="fp-method-block fp-method-wide">
          <h3>{METHOD.exclusions.title}</h3>
          {METHOD.exclusions.groups.map((g, gi) => (
            <div key={gi} className="fp-excl-group">
              <div className="fp-card-head">{g.head}</div>
              <ul className="fp-exclusions">
                {g.items.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
