import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SplitText from '../components/SplitText';
import { GOODS, HOTEL_COUNTRIES, HOTEL_FALLBACK } from './data/screening';
import { fullerPicture } from './lib/screening';
import { WIDER, fmtT } from './data/copy';
import { fill } from './data/storyCopy';
import Icon from './Icons';

const HOTEL_OPTS = [...HOTEL_COUNTRIES, HOTEL_FALLBACK];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
};

// A spend line: label, a hand-drawn glyph, and a dollars-a-year input. The
// per-category factor rationale rides on the title so it is discoverable
// without cluttering the row.
function SpendRow({ cat, value, onChange }) {
  return (
    <div className="fp-spend-row" title={cat.hint}>
      <span className="fp-spend-name"><Icon name={cat.icon} size={15} className="ob-label-i" />{cat.label}</span>
      <span className="fp-spend-input">
        <span aria-hidden="true">$</span>
        <input
          type="number" min={0} max={500000} step={50} inputMode="numeric"
          value={value || ''} placeholder="0"
          aria-label={cat.label + ', dollars a year'}
          onChange={(e) => onChange(Math.max(0, Math.round(Number(e.target.value) || 0)))}
        />
      </span>
    </div>
  );
}

function HotelEditor({ rows, onChange }) {
  const set = (i, next) => onChange(rows.map((h, j) => (j === i ? next : h)));
  const add = () => onChange([...rows, { country: 'AU', nights: 1 }]);
  const remove = (i) => onChange(rows.filter((_, j) => j !== i));
  return (
    <div className="fp-hotel-edit">
      {rows.length === 0 && <p className="fp-empty">{WIDER.hotelsNone}</p>}
      {rows.map((row, i) => (
        <div className="fp-hotel-row" key={i}>
          <label className="fp-field">
            <span>{WIDER.country}</span>
            <select value={row.country} onChange={(e) => set(i, { ...row, country: e.target.value })}>
              {HOTEL_OPTS.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </label>
          <label className="fp-field fp-field-nights">
            <span>{WIDER.nights}</span>
            <input
              type="number" min={0} max={365} step={1} inputMode="numeric"
              value={row.nights || ''} placeholder="0"
              onChange={(e) => set(i, { ...row, nights: Math.max(0, Math.round(Number(e.target.value) || 0)) })}
            />
          </label>
          <button type="button" className="fp-del" onClick={() => remove(i)} aria-label={WIDER.removeHotel + ' ' + (i + 1)}>×</button>
        </div>
      ))}
      <button type="button" className="fp-linkbtn fp-wider-add" onClick={add}>+ {WIDER.addHotel}</button>
    </div>
  );
}

// Read-only breakdowns for the worked example: what is in the basket, without
// the inputs (this is my basket, not yours to edit here). Goods and hotels
// render under their own headings, never mixed.
function GoodsReadout({ rows }) {
  if (!rows.length) return <p className="fp-empty">{WIDER.empty}</p>;
  return (
    <div className="fp-wider-readout">
      {rows.map((r) => (
        <div className="fp-wider-line" key={r.id}>
          <span className="fp-wider-line-n"><Icon name={(GOODS.find((g) => g.id === r.id) || {}).icon || 'bag'} size={14} className="ob-label-i" />{r.label}</span>
          <span className="fp-wider-line-a">${r.aud.toLocaleString()}</span>
          <span className="fp-wider-line-t">{fmtT(r.t, 2)} t</span>
        </div>
      ))}
    </div>
  );
}

function HotelReadout({ rows }) {
  if (!rows.length) return <p className="fp-empty">{WIDER.hotelsNone}</p>;
  return (
    <div className="fp-wider-readout">
      {rows.map((r) => (
        <div className="fp-wider-line" key={r.country}>
          <span className="fp-wider-line-n"><Icon name="bed" size={14} className="ob-label-i" />{r.label}</span>
          <span className="fp-wider-line-a">{r.nights} {r.nights === 1 ? 'night' : 'nights'}</span>
          <span className="fp-wider-line-t">{fmtT(r.t, 2)} t</span>
        </div>
      ))}
    </div>
  );
}

// A screening panel for the wider basket. Editable in an own audit (onChange
// persists); a read-only worked example otherwise. The audited total is never
// touched: this shows alongside it, clearly labelled screening.
export default function WiderPicture({ wider, estimate, coreTotal, coreBand, isExample, onChange, onStart }) {
  const goods = (wider && wider.goods) || {};
  const hotels = (wider && wider.hotels) || [];
  const editable = !isExample && typeof onChange === 'function';
  const fuller = useMemo(() => fullerPicture(coreTotal, coreBand, estimate), [coreTotal, coreBand, estimate]);

  const setGood = (id, v) => onChange({ goods: { ...goods, [id]: v }, hotels });
  const setHotels = (next) => onChange({ goods, hotels: next });

  return (
    <section id="fp-wider">
      <div className="canvas">
        <div className="sec-tag" data-idx="02 / "><Icon name="bag" size={16} />{WIDER.tag}</div>
        <h2 className="display fp-h2"><SplitText text={WIDER.title[0]} /> <SplitText text={WIDER.title[1]} accentIndex={1} /></h2>
        <p className="fp-sub">{WIDER.sub}</p>

        <div className="fp-wider-grid">
          <motion.div className="fp-card fp-wider-inputs" {...fadeUp}>
            <div className="fp-card-head"><Icon name="bag" size={14} className="ob-label-i" />{WIDER.goodsTitle}</div>
            <div className="fp-card-sub">{WIDER.goodsSub}</div>
            {editable ? (
              <div className="fp-spend-grid">
                {GOODS.map((cat) => (
                  <SpendRow key={cat.id} cat={cat} value={goods[cat.id]} onChange={(v) => setGood(cat.id, v)} />
                ))}
              </div>
            ) : (
              <GoodsReadout rows={estimate.goods.rows} />
            )}

            <div className="fp-card-head fp-wider-subhead"><Icon name="bed" size={14} className="ob-label-i" />{WIDER.hotelsTitle}</div>
            <div className="fp-card-sub">{WIDER.hotelsSub}</div>
            {editable ? (
              <HotelEditor rows={hotels} onChange={setHotels} />
            ) : (
              <HotelReadout rows={estimate.hotels.rows} />
            )}

            {!editable && (
              <div className="fp-wider-examplenote">
                <p>{WIDER.exampleNote}</p>
                {onStart && <button type="button" className="btn btn-secondary" onClick={onStart}>{WIDER.startCta} →</button>}
              </div>
            )}
          </motion.div>

          <motion.div className="fp-card fp-wider-result" {...fadeUp}>
            <div className="fp-card-head">{WIDER.resultTitle}</div>
            {estimate.hasAny ? (
              <>
                <div className="fp-wider-total">
                  <span className="fp-wider-total-v display">{fmtT(estimate.total, estimate.total < 10 ? 2 : 1)}<span> t</span></span>
                  <span className="fp-wider-total-tag">{WIDER.screeningTag}</span>
                </div>
                {estimate.band > 0.005 && (
                  <div className="fp-kpi-n">{fill(WIDER.range, { low: fmtT(estimate.low, 2), high: fmtT(estimate.high, 2) })}</div>
                )}
                <div className="fp-wider-split">
                  <div className="fp-wider-split-item">
                    <span className="fp-wider-split-l">{WIDER.goodsResult}</span>
                    <span className="fp-wider-split-v">{fmtT(estimate.goods.t, 2)} t <em>{WIDER.screeningTag.toLowerCase()}</em></span>
                  </div>
                  <div className="fp-wider-split-item">
                    <span className="fp-wider-split-l">{WIDER.hotelsResult}</span>
                    <span className="fp-wider-split-v">{fmtT(estimate.hotels.t, 2)} t <em>{estimate.hotels.nights} nights</em></span>
                  </div>
                </div>

                <div className="fp-wider-combined">
                  <div className="fp-card-head">{WIDER.combinedTitle}</div>
                  <p className="fp-takeaway">
                    {fill(WIDER.combinedLine, {
                      core: fmtT(coreTotal, 1),
                      wider: fmtT(estimate.total, estimate.total < 10 ? 2 : 1),
                      full: fmtT(fuller.total, 1),
                    })}
                  </p>
                  <p className="fp-note">{WIDER.combinedNote}</p>
                </div>
              </>
            ) : (
              <p className="fp-empty">{WIDER.empty}</p>
            )}
            <p className="fp-caveat fp-wider-caveat">{WIDER.caveat}</p>
            <p className="fp-note"><a href="method/#fp-wider-method">{WIDER.methodCta} →</a></p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
