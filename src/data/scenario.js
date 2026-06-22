// Decarbonisation scenario model — ported verbatim from the original site so
// every figure the chart and KPIs produce is byte-for-byte identical.

export const SECTOR_PROFILES = {
  infrastructure: {
    label: 'Infrastructure', FY20: 347000, FY25: 277000, FY26: 271000,
    SH: { s2: 0.112, lv: 0.224, hv: 0.273, plant: 0.391 },
    desc: 'Infrastructure: heavy plant, diesel fleet, and mechanical processes drive the Scope 1 footprint. Grid decarbonisation delivers Scope 2 reduction.',
  },
  property: {
    label: 'Commercial Property', FY20: 210000, FY25: 168000, FY26: 157000,
    SH: { s2: 0.580, lv: 0.150, hv: 0.010, plant: 0.260 },
    desc: 'Commercial property: grid electricity dominates Scope 2. Building systems and plant electrification are the primary reduction levers.',
  },
  government: {
    label: 'Government Operations', FY20: 185000, FY25: 148000, FY26: 142000,
    SH: { s2: 0.420, lv: 0.340, hv: 0.080, plant: 0.160 },
    desc: 'Government: office electricity (Scope 2) and light vehicle fleet (Scope 1) are primary sources. Procurement emissions drive Scope 3.',
  },
};

export const HIST_BASE = [347000, 359000, 361000, 337000, 299000, 277000];

export const F = {
  grid: {
    base: [0.891, 0.813, 0.672, 0.453, 0.266, 0.250, 0.234, 0.219, 0.188, 0.188, 0.188, 0.172, 0.172, 0.172, 0.172, 0.163, 0.155, 0.147, 0.140, 0.133, 0.126, 0.120, 0.114, 0.108, 0.103],
    faster: [0.623, 0.447, 0.269, 0.136, 0.053, 0.038, 0.023, 0.022, 0.019, 0.019, 0.019, 0.017, 0.017, 0.017, 0.017, 0.016, 0.016, 0.015, 0.014, 0.013, 0.013, 0.012, 0.011, 0.011, 0.010],
    slower: [0.980, 0.894, 0.739, 0.498, 0.292, 0.275, 0.258, 0.241, 0.206, 0.206, 0.206, 0.189, 0.189, 0.189, 0.189, 0.180, 0.171, 0.162, 0.154, 0.146, 0.139, 0.132, 0.125, 0.119, 0.113],
    off: Array(25).fill(1.0),
  },
  lv: {
    base: [1.000, 0.940, 0.780, 0.613, 0.453, 0.387, 0.348, 0.313, 0.282, 0.254, 0.228, 0.205, 0.185, 0.166, 0.150, 0.135, 0.121, 0.109, 0.098, 0.088, 0.080, 0.072, 0.064, 0.058, 0.052],
    faster: [0.940, 0.780, 0.613, 0.453, 0.387, 0.348, 0.313, 0.282, 0.254, 0.228, 0.205, 0.185, 0.166, 0.150, 0.135, 0.121, 0.109, 0.098, 0.088, 0.080, 0.072, 0.064, 0.058, 0.052, 0.047],
    slower: [1.000, 1.000, 0.940, 0.780, 0.613, 0.453, 0.387, 0.348, 0.313, 0.282, 0.254, 0.228, 0.205, 0.185, 0.166, 0.150, 0.135, 0.121, 0.109, 0.098, 0.088, 0.080, 0.072, 0.064, 0.058],
  },
  hv: {
    base: [1.000, 0.968, 0.937, 0.905, 0.874, 0.842, 0.789, 0.737, 0.684, 0.632, 0.579, 0.526, 0.474, 0.421, 0.368, 0.316, 0.263, 0.211, 0.158, 0.105, 0.053, 0.000, 0.000, 0.000, 0.000],
    faster: [0.968, 0.937, 0.905, 0.874, 0.842, 0.789, 0.737, 0.684, 0.632, 0.579, 0.526, 0.474, 0.421, 0.368, 0.316, 0.263, 0.211, 0.158, 0.105, 0.053, 0.000, 0.000, 0.000, 0.000, 0.000],
    slower: [1.000, 1.000, 0.968, 0.937, 0.905, 0.874, 0.842, 0.789, 0.737, 0.684, 0.632, 0.579, 0.526, 0.474, 0.421, 0.368, 0.316, 0.263, 0.211, 0.158, 0.105, 0.053, 0.000, 0.000, 0.000],
  },
  plant: {
    base: [0.938, 0.875, 0.812, 0.750, 0.687, 0.625, 0.563, 0.530, 0.498, 0.466, 0.434, 0.402, 0.369, 0.337, 0.305, 0.273, 0.241, 0.208, 0.176, 0.144, 0.112, 0.080, 0.047, 0.015, 0.000],
    faster: [0.703, 0.656, 0.609, 0.563, 0.516, 0.469, 0.422, 0.398, 0.374, 0.349, 0.325, 0.301, 0.277, 0.253, 0.229, 0.205, 0.180, 0.156, 0.132, 0.108, 0.084, 0.060, 0.036, 0.011, 0.000],
    slower: [1.000, 1.000, 1.000, 0.938, 0.859, 0.781, 0.703, 0.663, 0.623, 0.582, 0.542, 0.502, 0.462, 0.421, 0.381, 0.341, 0.301, 0.260, 0.220, 0.180, 0.140, 0.100, 0.059, 0.019, 0.000],
    off: Array(25).fill(1.0),
  },
};

export const REV = { flat: 1.000, moderate: 1.015, high: 1.030 };

// Textile-specific lever curves (illustrative). Distinct decay shapes so the
// boutique-textile scenario produces a visibly different pathway.
export const F_TEXTILE = (() => {
  const build = (fn) => {
    const a = [];
    for (let i = 0; i < 25; i++) a.push(+Math.max(0, Math.min(1, fn(i))).toFixed(3));
    return a;
  };
  const faster = (a) => { const b = a.slice(1); b.push(a[a.length - 1]); return b; };
  const slower = (a) => { const b = a.slice(0, -1); b.unshift(a[0]); return b; };
  const off = () => Array(25).fill(1.0);
  const renew = build((i) => Math.max(0.02, Math.exp(-i / 2.5)));
  const dye = build((i) => Math.max(0.40, 1 - i * 0.025));
  const freight = build((i) => 1 / (1 + Math.exp((i - 8) / 2)));
  const bio = build((i) => 1 / (1 + Math.exp((i - 14) / 2.5)));
  return {
    grid: { base: renew, faster: faster(renew), slower: slower(renew), off: off() },
    lv: { base: dye, faster: faster(dye), slower: slower(dye) },
    hv: { base: freight, faster: faster(freight), slower: slower(freight) },
    plant: { base: bio, faster: faster(bio), slower: slower(bio), off: off() },
  };
})();

export const TEXTILE_PROFILE = {
  FY20: 42000, FY25: 35000, FY26: 35000,
  SH: { s2: 0.08, lv: 0.18, hv: 0.42, plant: 0.32 },
  desc: 'Boutique textile retail: air freight logistics and raw material sourcing (virgin polyester vs bio-synthetics) dominate the Scope 3 footprint. Renewable energy procurement addresses Scope 2.',
};

export const LEVER_LABELS = {
  industrial: {
    grid: { name: 'Grid Decarbonisation', src: 'DCCEEW 2025 Table 42 NEM trajectory' },
    lv: { name: 'LV Fleet Transition', src: 'NVES Act 2024 · 1-yr adoption lag' },
    hv: { name: 'HV Fleet Transition', src: 'CSIRO Net Zero Pathways 2023 · 1-yr lag' },
    plant: { name: 'Plant Electrification', src: 'Industry plant electrification analysis' },
    cbar: { grid: 'Grid (Scope 2)', lv: 'LV Fleet', hv: 'HV Fleet', plant: 'Plant Electrification' },
    sub: 'Adjust the controls below to explore how different abatement strategies shift a Scope 1 and 2 emissions trajectory. Lever assumptions are drawn from DCCEEW 2025 grid emission factor tables, the NVES Act 2024 (LV fleet), CSIRO Net Zero Pathways (HV fleet), and published plant electrification analysis, the same sources used in production pathway models.',
  },
  textile: {
    grid: { name: 'Renewable Energy Procurement', src: 'RE100 trajectory · market-based instrument adoption' },
    lv: { name: 'Enzyme Dyeing Process Adoption', src: 'Textile Exchange · low-impact wet processing pathway' },
    hv: { name: 'Air-to-Ocean Freight Modal Shift', src: 'Clean Cargo WG · container shipping decarbonisation' },
    plant: { name: 'Biosynthetics Material Substitution', src: 'Textile Exchange Preferred Fiber Report · closed-loop pathway' },
    cbar: { grid: 'Renewable Energy', lv: 'Enzyme Dyeing', hv: 'Freight Modal Shift', plant: 'Biosynthetics' },
    sub: 'Explore how a boutique apparel brand can reduce Scope 3 emissions through freight mode shift (air → ocean), material substitution (virgin polyester → closed-loop bio-synthetics), low-impact dyeing processes, and renewable energy procurement. Multipliers scaled to illustrative boutique retail footprint.',
  },
};

export const SECTOR_OPTIONS = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'property', label: 'Commercial Property' },
  { value: 'government', label: 'Government' },
  { value: 'textile', label: 'Textile Retail' },
];

export const chartLabels = (() => {
  const a = [];
  for (let y = 2020; y <= 2050; y++) a.push('FY' + y);
  return a;
})();

// Resolve the active sector profile (FY20/FY25/SH/HIST) and display mode.
export function resolveSector(sectorKey) {
  if (sectorKey === 'textile') {
    const scale = TEXTILE_PROFILE.FY25 / 277000;
    return {
      mode: 'textile',
      FY20: TEXTILE_PROFILE.FY20, FY25: TEXTILE_PROFILE.FY25, FY26: TEXTILE_PROFILE.FY26,
      SH: TEXTILE_PROFILE.SH,
      HIST: HIST_BASE.map((h) => Math.round(h * scale)),
      desc: TEXTILE_PROFILE.desc,
    };
  }
  const prof = SECTOR_PROFILES[sectorKey];
  const scale = prof.FY25 / 277000;
  return {
    mode: 'industrial',
    FY20: prof.FY20, FY25: prof.FY25, FY26: prof.FY26,
    SH: prof.SH,
    HIST: HIST_BASE.map((h) => Math.round(h * scale)),
    desc: prof.desc,
  };
}

// Core model. Returns everything the UI needs to render: series for the chart,
// KPI values, the dynamic takeaway, and per-lever FY30 contribution bars.
export function runModel(scn) {
  const { grid: gk, lv: lk, hv: hk, plant: pk, rev: rk } = scn;
  const { mode, FY20, FY25, SH, HIST } = resolveSector(scn.sector);
  const FT = mode === 'textile' ? F_TEXTILE : F;
  const currentYear = new Date().getFullYear();

  const net = [], gridLayer = [], lvLayer = [], hvLayer = [], plantLayer = [], bau = [], actuals = [];
  let net30 = 0, bau30 = 0;

  for (let y = 2020; y <= 2050; y++) {
    if (y <= 2025) {
      const h = HIST[y - 2020];
      net.push(h);
      gridLayer.push(h); lvLayer.push(h); hvLayer.push(h); plantLayer.push(h);
      bau.push(h);
      actuals.push(y <= currentYear ? h : null);
    } else {
      const n = y - 2025, fi = y - 2026;
      const gf = Math.pow(REV[rk], n);
      const g = Math.round(FY25 * gf);
      bau.push(g);
      const gFac = fi < 25 ? FT.grid[gk][fi] : 0.10;
      const lvFac = fi < 25 ? FT.lv[lk][fi] : 0.01;
      const hvFac = fi < 25 ? FT.hv[hk][fi] : 0.00;
      const pFac = fi < 25 ? FT.plant[pk][fi] : 0.00;
      const s2gross = FY25 * SH.s2 * gf;
      const lvGross = FY25 * SH.lv * gf;
      const hvGross = FY25 * SH.hv * gf;
      const plGross = FY25 * SH.plant * gf;
      const s2net = s2gross * gFac;
      const lvNet = lvGross * lvFac;
      const hvNet = hvGross * hvFac;
      const plNet = plGross * pFac;
      const netVal = Math.max(0, s2net + lvNet + hvNet + plNet);
      const gridAbat = s2gross - s2net;
      const lvAbat = lvGross - lvNet;
      const hvAbat = hvGross - hvNet;
      const plAbat = plGross - plNet;
      net.push(netVal);
      gridLayer.push(netVal + gridAbat);
      lvLayer.push(netVal + gridAbat + lvAbat);
      hvLayer.push(netVal + gridAbat + lvAbat + hvAbat);
      plantLayer.push(netVal + gridAbat + lvAbat + hvAbat + plAbat);
      actuals.push(y <= currentYear ? netVal : null);
      if (y === 2030) { net30 = netVal; bau30 = g; }
    }
  }

  const kpiNet = Math.round(net30 / 1000) + 'k t';
  const kpiPct = ((FY20 - net30) / FY20 * 100).toFixed(1) + '% ↓';

  // Dynamic takeaway — the headline a board slide would carry.
  const pct = (FY20 - net30) / FY20 * 100;
  const avoided = Math.max(0, Math.round((bau30 - net30) / 1000));
  const rel = pct >= 0
    ? Math.round(pct) + '% below the FY20 baseline'
    : Math.abs(Math.round(pct)) + '% above the FY20 baseline';
  const verdict = pct >= 50
    ? 'ahead of a 1.5°C-aligned interim cut of ~50%.'
    : 'short of a 1.5°C-aligned interim cut of ~50% — the gap is the conversation.';
  const takeaway = {
    head: 'These levers land FY30 at ',
    value: Math.round(net30 / 1000) + 'k tCO₂-e',
    tail: ' — ' + rel + ', avoiding ' + avoided + 'k t against business-as-usual, ' + verdict,
    note: 'Headline recalculates from your lever settings · FY30 interim target year · illustrative figures',
  };

  // Contribution bars at FY30 (the interim target year).
  const fi30 = 4, gf30 = Math.pow(REV[rk], 5);
  const sv_g = FY25 * SH.s2 * gf30 * (1 - FT.grid[gk][fi30]);
  const sv_lv = FY25 * SH.lv * gf30 * (1 - FT.lv[lk][fi30]);
  const sv_hv = FY25 * SH.hv * gf30 * (1 - FT.hv[hk][fi30]);
  const sv_pl = FY25 * SH.plant * gf30 * (1 - FT.plant[pk][fi30]);
  const maxSv = Math.max(sv_g, sv_lv, sv_hv, sv_pl, 1);
  const bar = (s) => ({ width: Math.max(0, s / maxSv * 100), label: s > 0 ? Math.round(s / 1000) + 'k t' : '0' });

  return {
    mode,
    series: { net, gridLayer, lvLayer, hvLayer, plantLayer, bau, actuals },
    kpiNet, kpiPct,
    kpiBase: Math.round(FY20 / 1000) + 'k t',
    kpiFy26: Math.round(resolveSector(scn.sector).FY26 / 1000) + 'k t',
    takeaway,
    contrib: { grid: bar(sv_g), lv: bar(sv_lv), hv: bar(sv_hv), plant: bar(sv_pl) },
    chartTitle: mode === 'textile' ? 'Value chain footprint pathway to FY50' : 'Scope 1 & 2 emissions pathway to FY50',
  };
}
