// All /work content, preserved verbatim, plus the Sankey SVG generator ported
// from the original page.

export const TABS = [
  { id: 'baseline', letter: 'A', label: 'Emissions Baseline' },
  { id: 'roadmap', letter: 'B', label: 'Decarb Roadmap' },
  { id: 'mca', letter: 'C', label: 'MCA Framework' },
  { id: 'lca', letter: 'D', label: 'Lifecycle Carbon' },
];

export const BASELINE_SECTORS = {
  infrastructure: {
    label: 'Infrastructure',
    claim: 'Value chain emissions dominate the footprint, shaping where Net Zero action must focus.',
    meta: 'FY25 Baseline · Scope 1-3 · Illustrative: representative infrastructure portfolio. Not client data.',
    s1: '11.5%', s2: '5.8%', s3: '82.7%',
    s1b: 'Stationary combustion, fleet, and process emissions. Highest direct control. Largest lever is fleet electrification.',
    s2b: 'Driven by grid emission factor trajectory and on-site renewable procurement (PPA / GreenPower).',
    s3b: 'Embodied carbon (Cat 1), transport and distribution (Cat 4), and downstream leased assets (Cat 13). Reduction requires design choices and supplier collaboration.',
    sk: [11.5, 5.8, 82.7, 42.5, 20.4, 19.9],
    tiles: [
      { h: '83% of emissions sit outside direct control', b: 'Reduction requires design choices and supplier collaboration: not operations management alone. The playbook is different.' },
      { h: 'Embodied carbon is the dominant driver', b: 'Category 1 is primarily construction materials. Concrete and steel represent roughly 26% of the total footprint. Highest leverage occurs before construction begins.' },
      { h: 'Use-phase performance affects long-term value', b: '~20% of emissions occur during building operation. Strong influence via all-electric design, NABERS ratings, and green lease structures.' },
    ],
  },
  property: {
    label: 'Commercial Office',
    claim: 'Grid electricity and leased building operations drive the footprint. All-electric design and energy procurement are the primary reduction levers.',
    meta: 'FY25 Baseline · Scope 1-3 · Illustrative: representative commercial office portfolio. Not client data.',
    s1: '8.2%', s2: '22.4%', s3: '69.4%',
    s1b: 'On-site plant and minor combustion sources. Lower direct emissions than infrastructure-heavy portfolios.',
    s2b: 'Dominant category. Building electricity drives most Scope 2 exposure. Grid decarbonisation and renewable procurement (PPA) are the primary levers.',
    s3b: 'Purchased goods and services (Cat 1), supplier transport (Cat 4), and downstream leased assets (Cat 13: tenant electricity) dominate.',
    sk: [8.2, 22.4, 69.4, 22.0, 12.6, 34.8],
    tiles: [
      { h: '69% of emissions sit outside direct operational control', b: 'Tenant electricity (Cat 13) and supply chain (Cat 1) dominate. Green leases and procurement policy are the primary reduction mechanisms.' },
      { h: 'Grid decarbonisation is the largest near-term lever', b: 'Scope 2 represents 22% of the portfolio footprint. PPA procurement and grid decarbonisation trajectory drive the most immediate pathway to net-zero Scope 2.' },
      { h: 'All-electric design locks in long-term performance', b: 'Asset use-phase emissions track the grid. All-electric fitout paired with a renewable PPA eliminates Scope 2 at the portfolio level over time.' },
    ],
  },
  government: {
    label: 'Government',
    claim: 'Scope 2 and light vehicle fleet are the primary decarbonisation targets; supply chain engagement is needed for material Scope 3 reduction.',
    meta: 'FY25 Baseline · Scope 1-3 · Illustrative: representative government operations portfolio. Not client data.',
    s1: '12.1%', s2: '31.8%', s3: '56.1%',
    s1b: 'Primarily light vehicle fleet. Fleet electrification aligned to NVES trajectory is the primary Scope 1 lever.',
    s2b: 'Office buildings and facilities. Grid decarbonisation and GreenPower procurement provide the most immediate pathway to net-zero Scope 2.',
    s3b: 'Purchased goods and services (Cat 1), supplier logistics (Cat 4), and leased property (Cat 13). Supply chain engagement and procurement policy drive reduction.',
    sk: [12.1, 31.8, 56.1, 25.4, 18.2, 12.5],
    tiles: [
      { h: '56% of emissions are in the supply chain', b: 'Purchased goods and services (Cat 1) and leased property (Cat 13) dominate. Procurement policy and lease provisions are the primary reduction levers.' },
      { h: 'Fleet electrification is the primary Scope 1 lever', b: 'Light vehicle fleet aligned to NVES trajectories accounts for most direct emissions. Electrification pace is the key variable for Scope 1 reduction.' },
      { h: 'GreenPower procurement addresses Scope 2 immediately', b: 'Office electricity drives 32% of the footprint. 100% GreenPower procurement eliminates location-based Scope 2 and demonstrates leadership.' },
    ],
  },
};

// Ported verbatim from the original drawSankey(): returns an SVG markup string.
export function buildSankey(s1p, s2p, s3p, cat1p, cat4p, cat13p) {
  const TH = 140, yS = 40, yE = 180;
  const s1h = Math.max(7, (s1p / 100) * TH);
  const s2h = Math.max(5, (s2p / 100) * TH);
  const s3h = TH - s1h - s2h;
  const s1y = yS, s2y = s1y + s1h, s3y = s2y + s2h;
  const totalCat = cat1p + cat4p + cat13p || 1;
  let c1h = Math.max(12, (cat1p / totalCat) * s3h);
  const c4h = Math.max(10, (cat4p / totalCat) * s3h);
  let c13h = s3h - c1h - c4h;
  if (c13h < 8) { c13h = 8; c1h = s3h - c4h - c13h; }
  const c1y = s3y, c4y = c1y + c1h, c13y = c4y + c4h;
  const acc = '#75821D', accM = 'rgba(117,130,29,0.55)';
  let s = '<svg viewBox="0 0 720 220" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;min-height:280px;max-width:100%" role="img" aria-label="Emissions flow diagram">';
  s += '<path d="M36,' + s1y + ' C130,' + s1y + ' 130,' + s1y + ' 220,' + s1y + ' L220,' + (s1y + s1h) + ' C130,' + (s1y + s1h) + ' 130,' + (s1y + s1h) + ' 36,' + (s1y + s1h) + ' Z" fill="rgba(117,130,29,0.35)"/>';
  s += '<path d="M36,' + s2y + ' C130,' + s2y + ' 130,' + s3y + ' 220,' + s2y + ' L220,' + (s2y + s2h) + ' C130,' + (s2y + s2h) + ' 130,' + s3y + ' 36,' + (s2y + s2h) + ' Z" fill="rgba(117,130,29,0.18)"/>';
  s += '<path d="M36,' + s3y + ' C130,' + s3y + ' 130,' + s3y + ' 220,' + s3y + ' L220,' + yE + ' C130,' + yE + ' 130,' + yE + ' 36,' + yE + ' Z" fill="rgba(15,23,42,0.07)"/>';
  s += '<path d="M236,' + s3y + ' C358,' + s3y + ' 358,' + s3y + ' 480,' + s3y + ' L480,' + (c1y + c1h) + ' C358,' + (c1y + c1h) + ' 358,' + (c1y + c1h) + ' 236,' + (c1y + c1h) + ' Z" fill="rgba(15,23,42,0.11)"/>';
  s += '<path d="M236,' + (c1y + c1h) + ' C358,' + (c1y + c1h) + ' 358,' + (c1y + c1h) + ' 480,' + (c1y + c1h) + ' L480,' + (c4y + c4h) + ' C358,' + (c4y + c4h) + ' 358,' + (c4y + c4h) + ' 236,' + (c4y + c4h) + ' Z" fill="rgba(15,23,42,0.07)"/>';
  s += '<path d="M236,' + (c4y + c4h) + ' C358,' + (c4y + c4h) + ' 358,' + (c4y + c4h) + ' 480,' + (c4y + c4h) + ' L480,' + yE + ' C358,' + yE + ' 358,' + yE + ' 236,' + yE + ' Z" fill="rgba(15,23,42,0.05)"/>';
  s += '<rect x="20" y="' + yS + '" width="16" height="' + TH + '" fill="rgba(15,23,42,0.28)"/>';
  s += '<rect x="220" y="' + s1y + '" width="16" height="' + s1h + '" fill="' + acc + '"/>';
  s += '<rect x="220" y="' + s2y + '" width="16" height="' + s2h + '" fill="' + accM + '"/>';
  s += '<rect x="220" y="' + s3y + '" width="16" height="' + s3h + '" fill="rgba(15,23,42,0.38)"/>';
  s += '<rect x="480" y="' + c1y + '" width="16" height="' + c1h + '" fill="rgba(15,23,42,0.34)"/>';
  s += '<rect x="480" y="' + c4y + '" width="16" height="' + c4h + '" fill="rgba(15,23,42,0.26)"/>';
  s += '<rect x="480" y="' + c13y + '" width="16" height="' + c13h + '" fill="rgba(15,23,42,0.18)"/>';
  const s1cy = (s1y + s1h / 2 + 3).toFixed(0), s2cy = (s2y + s2h / 2 + 3).toFixed(0), s3ty = (s3y + 13).toFixed(0), s3py = (s3y + 33).toFixed(0), s3sy = (s3y + 49).toFixed(0);
  s += '<text x="240" y="' + s1cy + '" font-family="JetBrains Mono,monospace" font-size="9" fill="' + acc + '" letter-spacing="0.08em">SCOPE 1</text>';
  s += '<text x="315" y="' + s1cy + '" font-family="JetBrains Mono,monospace" font-size="9" fill="' + acc + '" text-anchor="end">' + s1p.toFixed(1) + '%</text>';
  s += '<text x="240" y="' + s2cy + '" font-family="JetBrains Mono,monospace" font-size="9" fill="#75821D">SCOPE 2</text>';
  s += '<text x="315" y="' + s2cy + '" font-family="JetBrains Mono,monospace" font-size="9" fill="#75821D" text-anchor="end">' + s2p.toFixed(1) + '%</text>';
  if (s3h > 30) {
    s += '<text x="240" y="' + s3ty + '" font-family="JetBrains Mono,monospace" font-size="9" fill="#64748B">SCOPE 3</text>';
    s += '<text x="240" y="' + s3py + '" font-family="JetBrains Mono,monospace" font-size="20" font-weight="bold" fill="#0F172A">' + s3p.toFixed(1) + '%</text>';
    if (s3h > 50) s += '<text x="240" y="' + s3sy + '" font-family="JetBrains Mono,monospace" font-size="8" fill="#64748B">of total footprint</text>';
  }
  const catLabel = (label, desc, pct, cy, ch) => {
    if (ch < 14) return;
    const ly = (cy + 11).toFixed(0), dy = (cy + 21).toFixed(0), py = (cy + 34).toFixed(0);
    s += '<text x="500" y="' + ly + '" font-family="JetBrains Mono,monospace" font-size="8" fill="#64748B" letter-spacing="0.05em">' + label + '</text>';
    if (ch > 44) {
      s += '<text x="500" y="' + dy + '" font-family="JetBrains Mono,monospace" font-size="7" fill="#64748B">' + desc + '</text>';
      s += '<text x="500" y="' + py + '" font-family="JetBrains Mono,monospace" font-size="11" font-weight="bold" fill="#0F172A">' + pct.toFixed(1) + '%</text>';
    } else {
      s += '<text x="700" y="' + ly + '" font-family="JetBrains Mono,monospace" font-size="10" font-weight="bold" fill="#0F172A" text-anchor="end">' + pct.toFixed(1) + '%</text>';
      if (ch > 26) s += '<text x="500" y="' + dy + '" font-family="JetBrains Mono,monospace" font-size="7" fill="#64748B">' + desc + '</text>';
    }
  };
  catLabel('CAT 1', 'Purchased goods &amp; services', cat1p, c1y, c1h);
  catLabel('CAT 4', 'Transport &amp; distribution', cat4p, c4y, c4h);
  catLabel('CAT 13', 'Downstream leased assets', cat13p, c13y, c13h);
  s += '</svg>';
  return s;
}

export const ROADMAP_INTRO = 'A structured three-stage methodology for moving from emissions data to a sequenced decarbonisation roadmap with CAPEX implications. Applied across infrastructure, property, and government sector engagements.';

export const ROADMAP_STAGES = [
  {
    n: 'Stage 01', title: 'Establish Baseline & Constraints', obj: 'Objective: Understand starting point and limits',
    pts: ['Confirm Scope 1-3 boundaries, data confidence, and material gaps', 'Identify constraints: regulatory, commercial, operational', 'Map key stakeholders: portfolio managers, facility managers, procurement', 'Understand existing decarbonisation efforts and commitments'],
    note: 'Potential data gaps at this stage: capital goods, business travel, waste in operations: flagged for proxy methodology or exclusion with rationale.',
  },
  {
    n: 'Stage 02', title: 'Identify & Quantify Mitigation Options', obj: 'Objective: Generate and evaluate options',
    pts: ['Develop long-list of initiatives across Scope 1-3', 'Quantify abatement, cost, and timing for each option', 'Identify initiatives to avoid, reduce, and replace emissions', 'Cover operations, design, supply chain, and asset use-phase'],
    note: 'Acknowledge ongoing decarbonisation scenarios: national grid trajectory, material and technology changes, policy pipeline.',
  },
  {
    n: 'Stage 03', title: 'Screen & Build the Roadmap', obj: 'Objective: Narrow options into a sequenced plan',
    pts: ['Short-list options with stakeholders using MCA (see next tab)', 'Build sequenced roadmap with CAPEX implications by year', 'Set interim targets aligned to SBTi or AASB S2 scenarios', 'Define governance, ownership, and monitoring cadence'],
    note: 'Output: a pathway model where scenario toggles show how lever choices affect the trajectory: gross vs. net, by scope and business unit.',
  },
];

export const ROADMAP_LEVERS = {
  caption: 'Example mitigation levers by scope',
  head: ['Lever', 'Scope', 'Timing', 'Notes'],
  rows: [
    ['Renewable electricity (PPA / GreenPower)', 'Scope 2', 'Near-term', 'Highest leverage early. Addresses purchased electricity entirely with credible instruments.'],
    ['LV fleet transition (EV)', 'Scope 1', 'Near-to-mid', 'NVES trajectory sets baseline expectation. Faster procurement cycles accelerate.'],
    ['HV fleet transition', 'Scope 1', 'Mid-term', 'CSIRO pathway. Technology readiness constrains pace: most impact post-FY2029.'],
    ['Low-carbon materials procurement', 'Scope 3 Cat 1', 'Mid-term', 'Specification and supplier engagement. Locks in embodied carbon reductions at design stage.'],
    ['Supplier engagement programme', 'Scope 3 Cat 1/4', 'Ongoing', 'CDP supply chain, contractual requirements, capacity building for key suppliers.'],
    ['Asset performance upgrades', 'Scope 3 Cat 13', 'Long-term', 'NABERS ratings, all-electric design, green lease provisions. Aligned to capital planning cycles.'],
    ['Offsetting programmes', 'Residual', 'Long-term', 'Applied to residual hard-to-abate emissions only. Not a substitute for reduction.'],
  ],
};

export const MCA_INTRO = 'A multi-criteria analysis framework for prioritising decarbonisation initiatives. Applied to move from a long-list of options to a sequenced roadmap with CAPEX implications. Weighting factors are agreed with stakeholders following engagement: the framework structures the decision, it does not make it.';

export const MCA_CRITERIA = [
  { crit: 'Impact (Carbon)', metric: 'Metric: total tCO₂-e reduction to 2050', body: 'Will the option deliver significant carbon reductions toward net zero targets? Primary quantitative screen.' },
  { crit: 'Cost Effectiveness', metric: 'Metric: Net Present Cost / tCO₂-e avoided', body: 'Is the initiative cost-effective in achieving carbon reductions? Levelised cost of abatement used to identify the efficiency frontier before CAPEX commitments.' },
  { crit: 'Readiness', metric: 'Metric: technology and commercial maturity', body: 'Is the option technically and commercially ready to deploy at scale? What time horizon does it become feasible? Informs sequencing.' },
  { crit: 'Ability to Influence', metric: 'Metric: organisational control vs. external dependency', body: 'Does the organisation have direct ability to act, or is collaboration and third-party decisions required? Determines ownership model.' },
  { crit: 'Risks & Constraints', metric: 'Metric: safety, regulatory, reputational exposure', body: 'Significant safety, licensing, regulatory, or community risks? Go/no-go screen for initiatives with material downside exposure.' },
  { crit: 'Co-benefits', metric: 'Metric: value beyond carbon savings', body: 'Associated environmental, community, or strategic value beyond carbon savings. Includes resilience, regulatory positioning, and commercial differentiation.' },
];

export const MCA_ANALYSIS = {
  caption: 'Further analysis to support prioritisation',
  head: ['Analysis', 'Purpose', 'Key data sources'],
  rows: [
    ['Embodied Carbon Assessments', 'Quantify upfront emissions by building typology; identify material hotspots and assess impact of material and construction alternatives', 'LCA databases, supplier EPDs, BIM models, QS schedules'],
    ['Marginal Abatement Cost Curve', 'Prioritise initiatives by cost-effectiveness and scale of emissions reduction', 'Supplier quotes, CAPEX estimates, financial models, market benchmarks'],
    ['Use-Phase Performance Modelling', 'Project operational emissions over 30 years; validate NABERS and Green Star targets', 'NatHERS, FirstRate5, NABERS forecasting, utility benchmarks'],
    ['Capital Planning Alignment', 'Align decarbonisation measures with existing asset lifecycles and CAPEX planning', 'CAPEX plans, maintenance schedules, climate risk assessments'],
  ],
};

export const LCA = {
  claim: 'Upfront embodied carbon is front-loaded in the construction phase. The window to reduce it closes at design stage.',
  meta: 'Illustrative · representative commercial office typology · not client data',
  modulesHead: 'System boundary: lifecycle modules in scope',
  modules: [
    { ref: 'A1-A3', label: 'Product stage', state: 'active' },
    { ref: 'A4', label: 'Transport to site', state: 'active' },
    { ref: 'A5', label: 'Construction', state: 'active' },
    { ref: 'B1-B7', label: 'Use stage', state: 'out' },
    { ref: 'C1-C4', label: 'End of life', state: 'out' },
    { ref: 'D', label: 'Beyond boundary', state: 'noted' },
  ],
  legend: [
    { cls: 'act', text: 'In scope (A1-A5)' },
    { cls: 'not', text: 'Module D: noted, not included in total' },
    { cls: 'oot', text: 'Out of scope for this assessment' },
  ],
  systems: [
    { tag: 'Structural frame', pct: '65%', body: 'Concrete (in-situ and precast) and reinforcing steel. Primary hotspot. Reduction via structural efficiency, low-carbon concrete specification, and supplier EPD procurement.' },
    { tag: 'Envelope & MEP', pct: '27%', body: 'Building envelope (cladding, glazing, roofing) plus mechanical, electrical, and hydraulic services. Reduction via specification choices and system right-sizing.' },
    { tag: 'Internal fit-out', pct: '8%', body: 'Partitions, finishes, and fitments. Smallest upfront contribution. Circular economy and demountable design reduce end-of-life impact.' },
  ],
  hotspotsCaption: 'Material hotspot breakdown: upfront embodied carbon (A1-A5)',
  hotspots: [
    { name: 'In-situ concrete & precast', sub: 'Post-tensioned slabs, cores, columns', pct: '42%', w: 100, bg: 'var(--matcha)' },
    { name: 'Reinforcing and structural steel', sub: 'Rebar, fabricated sections', pct: '23%', w: 55, bg: 'rgba(62,110,52,0.8)' },
    { name: 'Building envelope', sub: 'Curtain wall, cladding, roofing', pct: '16%', w: 38, bg: 'rgba(62,110,52,0.6)' },
    { name: 'MEP systems', sub: 'Mechanical, electrical, hydraulic', pct: '11%', w: 26, bg: 'rgba(62,110,52,0.4)' },
    { name: 'Internal fit-out & other', sub: 'Partitions, finishes, landscaping', pct: '8%', w: 19, bg: 'rgba(62,110,52,0.25)' },
  ],
  benchHead: 'Benchmark comparison: upfront embodied carbon intensity (kgCO₂-e/m² GFA)',
  benchTicks: ['0', '200', '400', '600', '800'],
  benchLegend: [
    { color: '#CBBFB4', text: 'GBCA / IStructE reference range (400-700 kgCO₂-e/m²)' },
    { color: 'var(--matcha)', text: 'Illustrative building (520 kgCO₂-e/m²)' },
    { color: 'rgba(62,110,52,0.45)', text: 'Best practice target (<400 kgCO₂-e/m²)' },
  ],
  benchNote: 'Reference ranges sourced from GBCA Carbon Positive Roadmap and IStructE How to Calculate Embodied Carbon (2nd ed.). Commercial office, GFA basis, A1-A5 boundary.',
  levers: {
    caption: 'Reduction levers',
    head: ['Lever', 'Module', 'Reduction potential', 'Notes'],
    rows: [
      ['Structural efficiency (design-led)', 'A1-A3', '10-15%', 'Optimised structural form, reduced over-design, post-tensioning to reduce concrete volume. Requires early engagement with structural engineer.'],
      ['Low-carbon concrete specification', 'A1-A3', '15-30%', 'Supplementary cementitious materials (fly ash, GGBFS) to reduce clinker ratio. EPD-backed specification. Feasible now on most projects.'],
      ['EPD-informed procurement', 'A1-A3', '5-20%', 'Require supplier Environmental Product Declarations. Compare across steel grades, concrete mixes, and envelope systems. Drives market signal.'],
      ['Whole-life carbon assessment', 'A1-C4', 'Varies', 'Extends boundary to include operational and end-of-life emissions. Informs all-electric design decisions and material durability trade-offs.'],
    ],
  },
  tiles: [
    { h: 'Embodied carbon is front-loaded', b: '65% of the lifecycle carbon footprint is locked in before practical completion. Procurement and specification decisions, not operational management, determine the outcome.' },
    { h: 'Operational carbon is addressable', b: 'All-electric design paired with a grid decarbonisation trajectory can drive use-phase Scope 2 emissions to near-zero by the mid-2030s. This is the primary lever for buildings with long asset lives.' },
    { h: 'Module D credits are real, but not a substitute', b: 'Beyond-boundary credits from reuse, recycling, and energy recovery (Module D) are valid in whole-life assessments. They should not be used to offset A1-A5 hotspots.' },
  ],
};

export const CASE_INTRO = 'How one engagement moves from raw fuel invoices to a board-presented pathway. Scroll through the four phases: the figure tracks where the work happens.';

export const CASE_STEPS = [
  { num: '01', title: 'Establish the baseline.', body: 'Scope 1-3 boundaries confirmed, data confidence graded, gaps named rather than hidden. The first finding is usually the same: the overwhelming majority of emissions sit in the value chain, outside direct operational control. That single number decides the whole playbook.', src: 'GHG Protocol · NGER · documented for external assurance' },
  { num: '02', title: 'Build the roadmap.', body: 'Before any pathway can be modelled, the options have to exist. A long-list of initiatives is developed across Scope 1-3, each quantified for abatement, cost, and timing, then screened with stakeholders through multi-criteria analysis and sequenced into a roadmap with CAPEX implications by year.', src: 'MCA framework · marginal abatement cost · capital planning alignment' },
  { num: '03', title: 'Model the pathway.', body: "A toggle-based scenario model where every lever assumption traces to a published source: grid trajectory, fleet transition, plant electrification. Built so a non-specialist can interrogate it, and presented to the board by senior leadership as the Group's climate reference tool.", src: 'DCCEEW 2025 · NVES Act 2024 · CSIRO Net Zero Pathways' },
  { num: '04', title: 'Hand it over.', body: 'The engagement ends; the infrastructure stays. Automated tooling cut inventory preparation time by roughly 40%, and every model ships with documented logic so the internal team runs the next reporting cycle without calling the consultant back in.', src: 'Excel · Python · Envizi · operable without advisory dependency' },
];
