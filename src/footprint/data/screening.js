// Screening factor set for "A fuller picture": the wider basket the audited
// core deliberately leaves out (goods and services, and hotel nights). It is a
// SEPARATE epistemic class from the core inventory and is treated as such
// everywhere: spend-based screening estimates, kept outside the headline total,
// the reveal and the share cards. The method page renders these tables directly
// from this file, so the basis of preparation can never drift from the maths.
//
// Two lineages, both verified this session against multiple independent copies
// (docs/footprint-research/factor-sources.md):
//  - Goods and services: US EPA Supply Chain GHG Emission Factors v1.3.0, the
//    "with margins" (purchaser-price) column, kg CO2e per 2022 USD, AR5. Two
//    independent parses of hash-matched copies of the EPA file agreed to
//    0.001 kg, confirming the values are the genuine EPA figures.
//  - Hotel nights: UK Government (DESNZ / DEFRA) conversion factors, "Hotel
//    stay" set, kg CO2e per room-night by country. Confirmed across three
//    independent transcriptions of the DEFRA workbook (identical 2022 to 2024),
//    with Circular Ecology as a fourth witness for the UK anchor.
//
// Screening, not measurement. Spend-based factors carry the industry-average
// and price assumptions of an input-output model; applying US factors to
// Australian spend is itself an approximation. Read them as order of magnitude,
// which is exactly what a boundary-closing screen is for.

export const SCREENING_SET = {
  id: 'epa-scv1.3-defra2024',
  updated: 'July 2026',
  note: 'Goods and services use the US EPA Supply Chain GHG Emission Factors v1.3.0 (2022 USD, with margins). Hotel nights use the UK Government (DESNZ / DEFRA) hotel-stay factors, 2024 edition (identical back to 2022; the 2025 and 2026 editions were not reachable to verify). Both are screening-grade and sit outside the audited total.',
};

// ---------------------------------------------------------------------------
// Currency. The EPA factors are priced per 2022 US dollar; a person enters
// Australian dollars. One stated market rate converts AUD to USD. It is an
// indicative market average, not the emission factor and not an RBA or ATO
// published figure (both were unreachable), so it is labelled as such and the
// whole block is screening. The 2022-to-now change in the US dollar's own
// buying power is not adjusted for: a second-order effect on an
// order-of-magnitude screen, and stated here rather than hidden.
// ---------------------------------------------------------------------------
export const FX = {
  usdPerAud: 0.65,
  basis: 'Indicative market average, roughly 65 US cents to the Australian dollar (calendar 2025 average about 0.645). A market rate, not an emission factor and not the RBA or ATO published average; used only to convert spend for the screen.',
};

export const EPA_SOURCE = {
  name: 'US EPA Supply Chain GHG Emission Factors v1.3.0 (by NAICS-6, 2022 USD, with margins)',
  detail: 'Emission factors per 2022 US dollar of purchaser-price spend, all greenhouse gases on an AR5 100-year basis, "Supply Chain Emission Factors with Margins" column. Indexed by six-digit 2017 NAICS industry code. Retrieved from faithful, hash-matched copies of the EPA file (the EPA host was unreachable in this build) and confirmed by two independent parses agreeing to 0.001 kg CO2e per USD.',
  url: 'https://doi.org/10.23719/1531143',
};

// Consumer categories, each mapped to one named NAICS subsector rather than an
// average across a wide group (the subsector spread inside a group can be
// large, so a single group number would mislead). factor is kg CO2e per 2022
// USD, with margins. Food services, groceries, energy retail and transport are
// deliberately absent: they are already in the audited core (diet, electricity,
// gas, road, freight), and pricing them again from spend would double count.
export const GOODS = [
  { id: 'clothing', label: 'Clothing & footwear', icon: 'bag', naics: '315 apparel', factor: 0.12,
    hint: 'New clothes and shoes over the year. Footwear alone runs higher (0.28); apparel dominates the spend, so the apparel factor is used.' },
  { id: 'electronics', label: 'Electronics & gadgets', icon: 'phone', naics: '3343 audio & video', factor: 0.081,
    hint: 'Phones, laptops, headphones, TVs. Computers read a little lower and chips higher; the consumer-electronics factor sits between.' },
  { id: 'appliances', label: 'Household appliances', icon: 'bolt', naics: '3352 major appliances', factor: 0.172,
    hint: 'Fridge, washing machine, dishwasher, that sort of thing.' },
  { id: 'furniture', label: 'Furniture & homewares', icon: 'house', naics: '337 furniture', factor: 0.188,
    hint: 'Sofas, beds, tables, homewares.' },
  { id: 'personalCare', label: 'Personal care & cosmetics', icon: 'spark', naics: '325620 toilet preparations', factor: 0.194,
    hint: 'Cosmetics, skincare, shampoo, the bathroom shelf. Cleaning products run higher and are not counted here.' },
  { id: 'health', label: 'Health & medical', icon: 'leaf', naics: '621 health services', factor: 0.083,
    hint: 'Out-of-pocket GP, dentist, physio, allied health. Medicines read a little higher (0.099).' },
  { id: 'recreation', label: 'Recreation & entertainment', icon: 'target', naics: '71 arts & recreation', factor: 0.086,
    hint: 'Gym, streaming, events, hobbies, sport. A wide group; a mid value is used.' },
];

export const goodsById = (id) => GOODS.find((g) => g.id === id) || null;

// ---------------------------------------------------------------------------
// Hotel nights. UK Government (DESNZ / DEFRA) conversion factors, "Hotel stay"
// set: kg CO2e per room-night by country, radiative forcing not applicable
// (accommodation, not flight). One published value per country, no cabin or
// margin split. The 2024 edition is used and is identical back to 2022; the
// 2025 and 2026 workbooks were not reachable to confirm, and the label says so.
// ---------------------------------------------------------------------------
export const HOTEL_SOURCE = {
  name: 'UK Government (DESNZ / DEFRA) GHG conversion factors, hotel-stay set, 2024 edition',
  detail: 'kg CO2e per room-night by country, derived from the Cornell Hotel Sustainability Benchmarking Index via the Greenview Hotel Footprinting Tool. Confirmed across three independent transcriptions of the DEFRA workbook and identical across the 2022 to 2024 editions. The 2025 and 2026 editions were not reachable to verify, so 2024 is the stated vintage.',
  url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
};

// Countries verified this session. Ordered to lead with Australia, then the
// destinations that show up most in this page's own worked example.
export const HOTEL_COUNTRIES = [
  { code: 'AU', label: 'Australia', perNight: 35 },
  { code: 'JP', label: 'Japan', perNight: 39 },
  { code: 'KR', label: 'South Korea', perNight: 55.8 },
  { code: 'SG', label: 'Singapore', perNight: 24.5 },
  { code: 'PH', label: 'Philippines', perNight: 54.3 },
  { code: 'GB', label: 'United Kingdom', perNight: 10.4 },
];

// DEFRA publishes no "rest of world" hotel row. A person staying somewhere not
// listed needs a number, so this is an explicit tool choice, not a DEFRA
// figure: the mid of the verified set, labelled non-DEFRA wherever it shows.
export const HOTEL_FALLBACK = {
  code: 'other', label: 'Somewhere else', perNight: 40,
  note: 'Indicative only. DEFRA publishes no rest-of-world hotel figure, so this is a tool-chosen mid value, not a DEFRA number.',
};

export const hotelFactorFor = (code) =>
  (HOTEL_COUNTRIES.find((c) => c.code === code) || HOTEL_FALLBACK).perNight;

export const hotelCountryLabel = (code) =>
  (HOTEL_COUNTRIES.find((c) => c.code === code) || HOTEL_FALLBACK).label;

// Uncertainty half-widths for the wider basket, summed the same screening-grade
// way the core does (no correlation credit). Spend screening is genuinely wide;
// hotel nights, priced from an activity count times a published factor, are
// tighter. These size the displayed range only and never move a central figure.
export const SCREENING_BANDS = {
  goods: 0.5,   // +/- 50%: input-output screening on approximate annual spend
  hotels: 0.2,  // +/- 20%: room-nights times a country-average published factor
};
