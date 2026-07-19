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
  id: 'epa-scv1.3-defra2025',
  updated: 'July 2026',
  note: 'Goods and services (including finance, education and home improvements) use the US EPA Supply Chain GHG Emission Factors v1.3.0 (2022 USD, with margins), converted at the RBA calendar-2025 average exchange rate. Hotel nights and household waste to landfill use the UK Government (DESNZ / DEFRA) conversion factors, 2025 edition, verified against the source workbook. All are screening-grade and sit outside the audited total.',
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
  usdPerAud: 0.6449,
  basis: 'Reserve Bank of Australia, statistical table F11.1, daily AUD/USD exchange rate averaged over calendar 2025 (mean 0.6449 across 251 trading days, low 0.598, high 0.672). A market rate, not an emission factor; used only to convert Australian-dollar spend for the screen. Sourced from the RBA workbook in docs/footprint-research, replacing the earlier third-party indicative figure.',
  url: 'https://www.rba.gov.au/statistics/historical-data.html',
};

export const EPA_SOURCE = {
  name: 'US EPA Supply Chain GHG Emission Factors v1.3.0 (by NAICS-6, 2022 USD, with margins)',
  detail: 'Emission factors per 2022 US dollar of purchaser-price spend, all greenhouse gases on an AR5 100-year basis, "Supply Chain Emission Factors with Margins" column. Indexed by six-digit 2017 NAICS industry code. Each factor is read directly from the EPA CSV held in docs/footprint-research. A US model on Australian spend is a screening approximation; an Australian input-output equivalent (the University of Sydney / IELab spend-based factors used by Climate Active) is the preferred future replacement and is queued in the research trail.',
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
  { id: 'finance', label: 'Banking & insurance', icon: 'coins', naics: '522110 commercial banking', factor: 0.059,
    hint: 'Bank and loan fees, and home, car and health insurance premiums. Insurance carriers alone read lower (0.033); the banking factor is used as the higher, conservative choice.' },
  { id: 'education', label: 'Education & courses', icon: 'book', naics: '611310 colleges & universities', factor: 0.14,
    hint: 'Tuition, short courses, kids’ school fees. Primary and secondary schooling reads a little higher (0.186).' },
  { id: 'homeImprove', label: 'Home improvements', icon: 'building', naics: '236118 residential remodelers', factor: 0.211,
    hint: 'Renovations, extensions and trade work on your home. Priced from spend, so it captures the materials and labour together. New appliances and furniture belong in their own lines above.' },
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
  name: 'UK Government (DESNZ / DEFRA) GHG conversion factors, hotel-stay set, 2025 edition',
  detail: 'kg CO2e per room-night by country, derived from the Cornell Hotel Sustainability Benchmarking Index via the Greenview Hotel Footprinting Tool. Read directly from the 2025 full-set workbook held in docs/footprint-research; the values are unchanged from the 2022 to 2024 editions where those overlap.',
  url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025',
};

// Every value is read from the DEFRA 2025 workbook. Ordered to lead with
// Australia and the destinations this page's own flight picker offers, so a
// person pricing a real trip finds their country without scrolling far.
export const HOTEL_COUNTRIES = [
  { code: 'AU', label: 'Australia', perNight: 35 },
  { code: 'JP', label: 'Japan', perNight: 39 },
  { code: 'KR', label: 'South Korea', perNight: 55.8 },
  { code: 'SG', label: 'Singapore', perNight: 24.5 },
  { code: 'PH', label: 'Philippines', perNight: 54.3 },
  { code: 'ID', label: 'Indonesia', perNight: 62.7 },
  { code: 'TH', label: 'Thailand', perNight: 43.4 },
  { code: 'VN', label: 'Vietnam', perNight: 38.5 },
  { code: 'MY', label: 'Malaysia', perNight: 61.5 },
  { code: 'CN', label: 'China', perNight: 53.5 },
  { code: 'HK', label: 'Hong Kong', perNight: 51.5 },
  { code: 'IN', label: 'India', perNight: 58.9 },
  { code: 'US', label: 'United States', perNight: 16.1 },
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

// ---------------------------------------------------------------------------
// Household waste to landfill. UK Government (DESNZ / DEFRA) waste-disposal set,
// "Refuse: household residual waste", landfill column, kg CO2e per tonne. Read
// from the 2025 workbook in docs/footprint-research and used per kilogram. This
// is a proxy: the Australian DCCEEW National Greenhouse Accounts waste tables
// are the preferred source (they carry Australian landfill-gas-capture
// assumptions) but were not reachable to verify, so DEFRA stands in and is
// labelled as such, the same way flights and hotels use DEFRA here. Only what
// actually goes to landfill counts: kerbside recycling and organics (FOGO) are
// not landfill, so they do not carry this factor.
// ---------------------------------------------------------------------------
export const WASTE_SOURCE = {
  name: 'UK Government (DESNZ / DEFRA) GHG conversion factors, waste disposal, 2025 edition',
  detail: 'Household residual waste to landfill, 497 kg CO2e per tonne (0.497 kg per kg), read from the 2025 full-set workbook. A proxy for Australian kerbside residual waste pending the DCCEEW National Greenhouse Accounts waste factors, which carry Australian landfill-gas-capture assumptions and are queued for a future refresh. For context, the National Waste Report puts Australian municipal waste around 512 kg per person a year generated, roughly a third of it landfilled.',
  url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025',
};

// kg CO2e per kilogram of household residual waste sent to landfill.
export const WASTE = {
  perKg: 0.497,
  // A gentle Australian anchor for the survey input, not a shipped factor.
  typicalKgPerWeek: 4,
};

// Uncertainty half-widths for the wider basket, summed the same screening-grade
// way the core does (no correlation credit). Spend screening is genuinely wide;
// hotel nights and waste, priced from an activity times a published factor, are
// tighter. These size the displayed range only and never move a central figure.
export const SCREENING_BANDS = {
  goods: 0.5,   // +/- 50%: input-output screening on approximate annual spend
  hotels: 0.2,  // +/- 20%: room-nights times a country-average published factor
  waste: 0.3,   // +/- 30%: a published factor on a self-estimated weekly weight
};
