// Everyday equivalences for the reveal: the audited total re-counted in
// things a person actually chooses. Display conversions only; nothing here
// is ever used in pricing, and the Basis of Preparation renders this table
// directly so the assumptions stay on the record.
//
// Where an equivalence depends on the grid or a fuel it derives live from
// the same factor tables the engine prices from (NSW grid and metro gas as
// the stated reference case), so a factor refresh moves these with it. The
// food items use Poore & Nemecek 2018 means, the same source as the per-kg
// reference table on the method page.

import {
  FLIGHT_FACTORS, FLIGHT_DISTANCE_UPLIFT,
  ROAD_FUELS, GAS, gasS3, ELECTRICITY,
} from './factors';

export const EQUIV_SOURCE = {
  name: 'Derived from the factor tables above (NSW grid and metro gas reference case) and Poore & Nemecek 2018 (Science) means via Our World in Data',
  detail: 'Display conversions only: the reveal divides the audited total by these per-item figures to re-count the year in everyday things. They never change any number. Assumptions are stated per row.',
  url: 'https://ourworldindata.org/environmental-impacts-of-food',
};

// Reference-case factors, kg CO2-e per unit, derived where possible.
const NSW_KWH = ELECTRICITY.NSW.s2 + ELECTRICITY.NSW.s3; // full fuel-cycle grid kg/kWh
const GAS_MJ = GAS.s1_per_MJ + gasS3('NSW'); // full fuel-cycle gas kg/MJ
const PETROL_KM = ((ROAD_FUELS.petrol.s1_per_L + ROAD_FUELS.petrol.s3_per_L) * ROAD_FUELS.petrol.defaultL100km) / 100;
// Sydney to Melbourne economy return: 706 km each way, DEFRA routing uplift,
// domestic factor with radiative forcing.
const SYD_MEL_RETURN = (706 * FLIGHT_DISTANCE_UPLIFT * 2 * FLIGHT_FACTORS.domestic.withRF.economy) / 1;
// An eight-minute shower: 9 L/min for 8 min = 72 L, heated 25°C
// (72 x 4.186 x 25 / 1000 = 7.5 MJ of heat) by gas storage at 85% efficiency.
const SHOWER = ((72 * 4.186 * 25) / 1000 / 0.85) * GAS_MJ;
// A 2.5 kWh vented tumble-dryer cycle on the reference grid.
const DRYER = 2.5 * NSW_KWH;
// A full phone charge: about 12 Wh from the wall.
const PHONE = 0.012 * NSW_KWH;

const round2 = (v) => Math.round(v * 100) / 100;

// Each entry: per-item kg CO2-e, the plain-words basis (shown in the moment
// and on the method table), and the cadence the "that is N a ..." line uses.
export const EQUIVALENCES = [
  {
    id: 'burger',
    label: 'Beef burgers',
    unit: ['beef burger', 'beef burgers'],
    kg: 3.8,
    cadence: 'week',
    basis: 'A quarter-pounder\'s 113 g of beef at the Poore & Nemecek dairy-herd beef mean (33.3 kg CO2-e per kg). The bun and salad are a rounding error beside the patty, and the dedicated-beef-herd factor would nearly triple it, so this reads conservative.',
  },
  {
    id: 'coffee',
    label: 'Flat whites',
    unit: ['flat white', 'flat whites'],
    kg: 0.4,
    cadence: 'week',
    basis: 'About 18 g of beans and 150 ml of dairy milk at the Poore & Nemecek means. The milk is most of it; the same cup black drops by well over half.',
  },
  {
    id: 'flight',
    label: 'Sydney to Melbourne returns',
    unit: ['Sydney to Melbourne economy return', 'Sydney to Melbourne economy returns'],
    kg: round2(SYD_MEL_RETURN),
    cadence: 'year',
    basis: 'A 706 km hop each way at the DEFRA domestic factor, with the 8% routing uplift and the high-altitude warming effect included, in economy.',
  },
  {
    id: 'drive',
    label: 'Kilometres of driving',
    unit: ['km in a petrol car', 'km in a petrol car'],
    kg: round2(PETROL_KM),
    cadence: 'week',
    basis: 'The default 7.0 L/100km petrol car at the NGA 2025 fuel factors, fuel cycle included.',
  },
  {
    id: 'shower',
    label: 'Hot showers',
    unit: ['hot shower', 'hot showers'],
    kg: round2(SHOWER),
    cadence: 'day',
    basis: 'An eight-minute shower: 72 litres heated 25°C by a gas storage system at 85% efficiency, on the NSW metro gas factors.',
  },
  {
    id: 'dryer',
    label: 'Dryer loads',
    unit: ['tumble-dryer load', 'tumble-dryer loads'],
    kg: round2(DRYER),
    cadence: 'week',
    basis: 'A 2.5 kWh vented tumble-dryer cycle at the NSW grid factor, fuel cycle included.',
  },
  {
    id: 'phone',
    label: 'Phone charges',
    unit: ['phone charge', 'phone charges'],
    kg: Math.round(PHONE * 1000) / 1000,
    cadence: 'day',
    basis: 'A full 12 Wh charge at the NSW grid factor: about eight grams. Included to show how small the everyday electric trickles are next to the big-ticket items.',
  },
];

export const equivalenceById = (id) => EQUIVALENCES.find((e) => e.id === id) || EQUIVALENCES[0];

// How many of an item the total buys, and a sensible dot-grid grain: dots are
// capped near 150, with the per-dot count snapped to 1 / 2 / 5 x 10^n so the
// legend reads like a human wrote it.
export function equivCount(totalT, eq) {
  const count = (totalT * 1000) / eq.kg;
  let per = 1;
  if (count > 150) {
    const raw = count / 150;
    const mag = 10 ** Math.floor(Math.log10(raw));
    for (const step of [1, 2, 5, 10]) {
      if (mag * step >= raw) { per = mag * step; break; }
    }
  }
  return { count, dots: Math.max(1, Math.round(count / per)), per };
}
