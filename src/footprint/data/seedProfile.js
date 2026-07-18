// Chris's audit, FY2026 (July 2025 to June 2026): the worked example.
//
// Derived from real source data: retailer bills (electricity time-of-use
// invoice with actual meter reads, gas usage graph), a full year of bank
// transactions, and trip records. Quantities only: no merchants, amounts,
// addresses or references ship here. Where a figure is spend-converted or
// forecast rather than metered, the entry notes say so.
//
// Entries are priced through the same engine as user entries, so the example
// always reflects the current factor set.

import { priceEntry } from '../lib/engine';

export const SEED_SETTINGS = {
  name: 'Chris',
  state: 'NSW',
  householdSize: 2,
  dwelling: 'apartment',
  dietType: 'medMeat',
  fuelType: 'petrol',
  greenpowerPct: 0,
};

export const SEED_PERIOD = {
  label: 'FY2026',
  start: '2025-07-01',
  end: '2026-06-30',
};

const E = (draft) => priceEntry(draft, SEED_SETTINGS);

const hh = { wholeHousehold: true };

export function buildSeedProfile() {
  const entries = [
    // Electricity: two-adult apartment on the NSW grid, costs split evenly.
    // The flat averages 3.78 kWh a day on actual reads. Moved in late July.
    E({ id: 'seed-el1', quality: 'forecast', date: '2025-10-12', category: 'electricity', label: 'Power, Aug to Oct', period_months: 3, meta: { ...hh, kwh: 310 }, notes: 'Estimated from the metered daily average; we moved in late July, so July is a gap, not a virtue.' }),
    E({ id: 'seed-el2', quality: 'forecast', date: '2026-01-13', category: 'electricity', label: 'Power bill, Oct to Jan', period_months: 3, meta: { ...hh, kwh: 355 }, notes: 'Billed quarter; usage estimated from the following invoice’s daily average. Household total, my share is half.' }),
    E({ id: 'seed-el3', quality: 'metered', date: '2026-04-15', category: 'electricity', label: 'Power bill, Jan to Apr', period_months: 3, meta: { ...hh, kwh: 348 }, notes: 'Actual time-of-use reads: 3.78 kWh a day for the whole flat. The one bill in this audit I can defend to a meter.' }),
    E({ id: 'seed-el4', quality: 'forecast', date: '2026-06-30', category: 'electricity', label: 'Power, Apr to Jun (forecast)', period_months: 2, meta: { ...hh, kwh: 287 }, notes: 'Forecast at the metered daily average until the next actual read lands.' }),

    // Gas: hot water and cooktop only (no gas heating). Read off the
    // retailer's monthly usage graph; June anchored to the actual bill.
    E({ id: 'seed-ga1', quality: 'metered', date: '2025-09-30', category: 'gas', label: 'Gas, Aug to Sep (usage graph)', period_months: 2, meta: { ...hh, mj: 1905 }, notes: 'Daily averages from the retailer graph, times days. Hot water does the work here.' }),
    E({ id: 'seed-ga2', quality: 'metered', date: '2025-12-31', category: 'gas', label: 'Gas, Oct to Dec (usage graph)', period_months: 3, meta: { ...hh, mj: 3712 }, notes: 'Household total, my share is half.' }),
    E({ id: 'seed-ga3', quality: 'metered', date: '2026-03-31', category: 'gas', label: 'Gas, Jan to Mar (usage graph)', period_months: 3, meta: { ...hh, mj: 3408 }, notes: '' }),
    E({ id: 'seed-ga4', quality: 'metered', date: '2026-06-30', category: 'gas', label: 'Gas, Apr to Jun', period_months: 3, meta: { ...hh, mj: 3888 }, notes: 'June anchored to the actual bill (1,235 MJ over 28 days); April and May from the usage graph.' }),

    // Road: no car. Rideshare and taxis spend-converted; Opal fares
    // converted at an average fare per kilometre. Estimates, and labelled.
    E({ id: 'seed-rd1', quality: 'estimated', date: '2025-09-30', category: 'road', label: 'Rideshare, Jul to Sep', period_months: 3, meta: { mode: 'rideshare', km: 223 }, notes: 'Spend-converted at about $2.10 per km. Deadheading excluded, so this understates.' }),
    E({ id: 'seed-rd2', quality: 'estimated', date: '2025-12-31', category: 'road', label: 'Rideshare, Oct to Dec', period_months: 3, meta: { mode: 'rideshare', km: 164 }, notes: 'Spend-converted.' }),
    E({ id: 'seed-rd3', quality: 'estimated', date: '2026-03-31', category: 'road', label: 'Rideshare, Jan to Mar', period_months: 3, meta: { mode: 'rideshare', km: 106 }, notes: 'Spend-converted.' }),
    E({ id: 'seed-rd4', quality: 'estimated', date: '2026-06-30', category: 'road', label: 'Rideshare, Apr to Jun', period_months: 3, meta: { mode: 'rideshare', km: 175 }, notes: 'Spend-converted.' }),
    E({ id: 'seed-rd5', quality: 'estimated', date: '2026-02-28', category: 'road', label: 'Taxis abroad (Seoul, Tokyo, Cebu)', meta: { mode: 'taxi', km: 280 }, notes: 'Trip taxis, spend-converted at local rates. Coarse.' }),
    E({ id: 'seed-rd6', quality: 'estimated', date: '2025-12-31', category: 'road', label: 'Sydney trains and buses, Jul to Dec', period_months: 6, meta: { mode: 'pt', km: 2600 }, notes: 'Opal fares converted at about 25c per km. Indicative rail factor; the daily commute lives here.' }),
    E({ id: 'seed-rd7', quality: 'estimated', date: '2026-06-30', category: 'road', label: 'Sydney trains and buses, Jan to Jun', period_months: 6, meta: { mode: 'pt', km: 2600 }, notes: 'Opal fares converted at about 25c per km.' }),

    // Flights: the whole story. Every itinerary at DEFRA per-pax-km factors,
    // radiative forcing included, great-circle distance plus 8% uplift.
    E({ id: 'seed-fl1', quality: 'metered', date: '2025-07-06', category: 'flight', label: 'Sydney to Seoul return, July trip', meta: { km: 8317, return: true, band: 'longIntl', cabin: 'economy' }, notes: 'Economy. The year started as it meant to continue.' }),
    E({ id: 'seed-fl2', quality: 'metered', date: '2025-08-16', category: 'flight', label: 'Sydney to Uluru return', meta: { km: 2024, return: true, band: 'domestic', cabin: 'economy' }, notes: 'Domestic factor with RF. Worth it, still counted.' }),
    E({ id: 'seed-fl3', quality: 'metered', date: '2026-01-08', category: 'flight', label: 'Sydney to Tokyo return, January trip', meta: { km: 7823, return: true, band: 'longIntl', cabin: 'economy' }, notes: 'Economy.' }),
    E({ id: 'seed-fl4', quality: 'metered', date: '2026-02-13', category: 'flight', label: 'Sydney to Manila return, February trip', meta: { km: 6264, return: true, band: 'longIntl', cabin: 'economy' }, notes: 'Economy.' }),
    E({ id: 'seed-fl5', quality: 'metered', date: '2026-02-15', category: 'flight', label: 'Manila to Cebu return', meta: { km: 571, return: true, band: 'shortIntl', cabin: 'economy' }, notes: 'Short-haul band.' }),
    E({ id: 'seed-fl6', quality: 'metered', date: '2026-02-18', category: 'flight', label: 'Philippines domestic hops (two legs)', meta: { km: 1100, return: false, band: 'shortIntl', cabin: 'economy' }, notes: 'Two budget-carrier legs, combined distance.' }),
    E({ id: 'seed-fl7', quality: 'metered', date: '2026-04-05', category: 'flight', label: 'Sydney to Singapore, April trip', meta: { km: 6288, return: false, band: 'longIntl', cabin: 'economy' }, notes: 'One way; came home the long way.' }),
    E({ id: 'seed-fl8', quality: 'metered', date: '2026-04-11', category: 'flight', label: 'Singapore to Melbourne', meta: { km: 6050, return: false, band: 'longIntl', cabin: 'economy' }, notes: 'One way.' }),
    E({ id: 'seed-fl9', quality: 'metered', date: '2026-04-12', category: 'flight', label: 'Melbourne to Sydney', meta: { km: 706, return: false, band: 'domestic', cabin: 'economy' }, notes: 'The last leg home.' }),

    // Freight: the online shopping habit, counted honestly.
    E({ id: 'seed-fr1', quality: 'estimated', date: '2026-06-30', category: 'freight', label: 'International parcels, air express (est. 75 kg)', period_months: 12, meta: { mode: 'air', tonneKm: 600 }, notes: 'About 25 consolidated overseas orders at roughly 3 kg each, air freighted about 8,000 km. Sea consolidation would cut this by around 90 percent; that toggle is in the plan.' }),
    E({ id: 'seed-fr2', quality: 'estimated', date: '2026-06-30', category: 'freight', label: 'Domestic parcels (about 40 deliveries)', period_months: 12, meta: { parcels: 40 }, notes: 'Counted off order history at the indicative per-parcel factor.' }),

    // Diet: typical week scaled to the year. Coarse by design.
    E({ id: 'seed-di1', quality: 'estimated', date: '2026-06-30', category: 'diet', label: 'Medium-meat diet, typical week scaled to the year', period_months: 12, meta: { dietType: 'medMeat', days: 365 }, notes: 'A year of transactions says 268 restaurant meals and 192 takeaways. Medium meat is the honest label.' }),
  ];

  return {
    schema: 'cw-footprint/2',
    kind: 'example',
    settings: { ...SEED_SETTINGS },
    period: { ...SEED_PERIOD },
    entries,
    plan: {
      enabled: ['sea-not-air', 'diet-low', 'uber-to-pt'],
      note: 'The toggles I have actually committed to. The flight ones are still off, and the gap between my pathway and the budget line is exactly that decision.',
    },
  };
}
