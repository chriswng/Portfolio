// Bank CSV import: parse in the browser, classify by vendor rules, convert
// to activity entries where honest. Nothing here touches the network; the
// file is read locally and discarded.

import { VENDOR_RULES, CONVERSIONS } from '../data/vendorMap';
import { priceEntry } from './engine';

// Minimal RFC-4180-ish parser: quoted fields, embedded commas and newlines.
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== '')) rows.push(row);
  return rows;
}

const findCol = (headers, patterns) => {
  for (const p of patterns) {
    const i = headers.findIndex((h) => p.test(h));
    if (i !== -1) return i;
  }
  return -1;
};

// Detect the common export shapes: Up (Time / Payee / Description / Subtotal),
// CommBank and most others (Date / Amount / Description), and debit-credit
// split columns.
export function analyseCsv(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error('That file has no data rows.');
  const headers = rows[0].map((h) => h.trim());
  const hasHeader = headers.some((h) => /date|time|amount|description|payee|debit|narrative/i.test(h));
  const body = hasHeader ? rows.slice(1) : rows;

  const dateI = hasHeader ? findCol(headers, [/^time$/i, /settled date/i, /date/i]) : 0;
  const descI = hasHeader ? findCol(headers, [/payee/i, /description/i, /narrative/i, /details/i, /merchant/i]) : 2;
  const desc2I = hasHeader ? findCol(headers, [/^description$/i]) : -1;
  const amtI = hasHeader ? findCol(headers, [/subtotal \(aud\)/i, /^amount/i, /total \(aud\)/i, /^value/i, /debit/i]) : 1;
  const creditI = hasHeader ? findCol(headers, [/credit/i]) : -1;
  if (dateI === -1 || descI === -1 || amtI === -1) {
    throw new Error('Could not find date, description and amount columns. The template has headers: Date, Description, Amount.');
  }

  const parseDate = (v) => {
    const s = String(v).trim();
    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[1] + '-' + m[2] + '-' + m[3];
    m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/); // dd/mm/yyyy (Australian exports)
    if (m) return m[3] + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
    return null;
  };

  const txns = [];
  for (const r of body) {
    const date = parseDate(r[dateI]);
    if (!date) continue;
    let amt = parseFloat(String(r[amtI]).replace(/[$,\s]/g, ''));
    if ((isNaN(amt) || amt === 0) && creditI !== -1) {
      const cr = parseFloat(String(r[creditI]).replace(/[$,\s]/g, ''));
      if (!isNaN(cr) && cr !== 0) amt = cr;
    }
    if (isNaN(amt)) continue;
    const desc = [r[descI], desc2I !== -1 && desc2I !== descI ? r[desc2I] : '']
      .filter(Boolean).join(' ').trim();
    txns.push({ date, desc, amt });
  }
  if (!txns.length) throw new Error('No transactions could be read from that file.');

  const spend = txns.filter((t) => t.amt < 0);
  const groups = {};
  for (const rule of VENDOR_RULES) groups[rule.group] = { rule, total: 0, count: 0, intlCount: 0, txns: [] };

  for (const t of spend) {
    for (const rule of VENDOR_RULES) {
      if (rule.pattern.test(t.desc)) {
        const g = groups[rule.group];
        g.total += -t.amt; g.count += 1;
        if (rule.intlPattern && rule.intlPattern.test(t.desc)) g.intlCount += 1;
        if (g.txns.length < 60) g.txns.push(t);
        break; // first matching rule wins
      }
    }
  }

  const dates = txns.map((t) => t.date).sort();
  return {
    rowCount: txns.length,
    spendCount: spend.length,
    from: dates[0],
    to: dates[dates.length - 1],
    groups,
  };
}

// Build priced entries from the analysis for the groups the user included.
// Everything is labelled an estimate and carries its conversion basis.
export function buildEntriesFromImport(analysis, include, settings) {
  const entries = [];
  const endDate = analysis.to;
  const c = CONVERSIONS;

  if (include.fuel && analysis.groups.fuel.count > 0) {
    const litres = analysis.groups.fuel.total / c.petrolPerLitre.value;
    entries.push(priceEntry({
      category: 'road', date: endDate, period_months: 12,
      label: 'Petrol (from bank import, ' + analysis.groups.fuel.count + ' fills)',
      meta: { fuel: settings.fuelType || 'petrol', litres: Math.round(litres) },
      notes: 'Estimated from bank CSV: $' + Math.round(analysis.groups.fuel.total) + ' at $' + c.petrolPerLitre.value.toFixed(2) + '/L. Replace with odometer or receipts for a tighter number.',
    }, settings));
  }
  if (include.rideshare && analysis.groups.rideshare.count > 0) {
    const km = analysis.groups.rideshare.total / c.ridesharePerKm.value;
    entries.push(priceEntry({
      category: 'road', date: endDate, period_months: 12,
      label: 'Rideshare and taxis (from bank import, ' + analysis.groups.rideshare.count + ' trips)',
      meta: { mode: 'rideshare', km: Math.round(km) },
      notes: 'Estimated from bank CSV: $' + Math.round(analysis.groups.rideshare.total) + ' at about $' + c.ridesharePerKm.value.toFixed(2) + '/km.',
    }, settings));
  }
  if (include.pt && analysis.groups.pt.count > 0) {
    const km = analysis.groups.pt.total / c.ptPerKm.value;
    entries.push(priceEntry({
      category: 'road', date: endDate, period_months: 12,
      label: 'Public transport (from bank import)',
      meta: { mode: 'pt', km: Math.round(km) },
      notes: 'Estimated from bank CSV: $' + Math.round(analysis.groups.pt.total) + ' in fares at about ' + Math.round(c.ptPerKm.value * 100) + 'c/km. Indicative rail factor.',
    }, settings));
  }
  if (include.parcels && analysis.groups.parcels.count > 0) {
    const domestic = analysis.groups.parcels.count - analysis.groups.parcels.intlCount;
    if (domestic > 0) {
      entries.push(priceEntry({
        category: 'freight', date: endDate, period_months: 12,
        label: 'Parcels (from bank import, ' + domestic + ' orders)',
        meta: { parcels: domestic },
        notes: 'One parcel per order at the indicative per-parcel factor. Multi-parcel orders make this an undercount; consolidate anyway.',
      }, settings));
    }
    if (analysis.groups.parcels.intlCount > 0) {
      const tonneKm = analysis.groups.parcels.intlCount * 0.003 * 8000;
      entries.push(priceEntry({
        category: 'freight', date: endDate, period_months: 12,
        label: 'Overseas orders, air express (from bank import, ' + analysis.groups.parcels.intlCount + ' orders)',
        meta: { mode: 'air', tonneKm: Math.round(tonneKm) },
        notes: 'Assumes 3 kg per consolidated order air freighted about 8,000 km. If your forwarder ships sea, edit this down by 90 percent and feel smug.',
      }, settings));
    }
  }
  return entries;
}

// The template we hand people. Three columns any bank export can be munged
// into; Up and CommBank exports also parse directly.
export function templateCsv() {
  return [
    'Date,Description,Amount',
    '2026-07-05,AMPOL FOODARY MASCOT,-72.50',
    '2026-07-08,UBER *TRIP SYDNEY,-24.10',
    '2026-07-12,TRANSPORT FOR NSW OPAL,-50.00',
    '2026-07-15,QANTAS AIRWAYS 081 SYDNEY,-389.00',
    '2026-07-18,AMAZON AU MARKETPLACE,-64.99',
    '2026-07-21,RED ENERGY PTY LTD,-180.20',
    '2026-07-28,WOOLWORTHS 1234 SYDNEY,-98.35',
  ].join('\n');
}
