// All editorial copy, preserved verbatim from the original site. Nothing here
// is summarised or omitted — only re-laid-out by the components that consume it.

export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#bio', label: 'Capabilities' },
  { href: '#principles', label: 'My Practice' },
  { href: '#experience', label: 'Experience' },
  { href: '#scenario', label: 'Decarb Model' },
  { href: '#tools', label: 'Tools' },
  { href: 'work/', label: 'Work Samples', external: true },
  { href: 'footprint/', label: 'Footprint', external: true },
  { href: 'fashion/', label: 'Cost Per Wear', external: true },
];

export const HERO = {
  name: ['Chris', 'Wang'],
  roles: ['Sustainability Advisor', 'Emissions Modeller', 'ESG Reporting Lead', 'Decarbonisation Strategist'],
  location: 'Melbourne, Australia',
  prop: 'I help large organisations turn emissions data into governed reporting infrastructure and credible decarbonisation pathways. The work is repeatable, auditable, and built to be owned by the team.',
  ctas: [
    { label: 'Get in touch', href: '#contact', primary: true, icon: 'linkedin' },
  ],
  // Animated counters: start date drives the live "years" figure.
  instruments: [
    { id: 'years-advisory', label: ['Years sustainability', 'advisory'], start: '2022-02-01', suffix: '+' },
    { id: 'years-built-env', label: ['Years built environment', '& infrastructure'], start: '2020-02-01', suffix: '+' },
  ],
};

export const BIO_PARAS = [
  'Looking for sustainability leadership in fashion, consumer goods, or technology, where supply chain transparency and decarbonisation are primary workstreams, not obligations.',
  'I build the data infrastructure that makes sustainability commitments defensible: GHG inventories with documented methodology, Scope 1-3 baselines that survive external assurance, decarbonisation models with traceable lever assumptions, and reporting systems that internal teams can operate after I leave the engagement.',
  'Four years in sustainability advisory across WSP and Downer EDI: GHG accounting, regulatory disclosure, decarbonisation modelling, supply chain emissions. Six years prior in built environment and infrastructure, including project delivery at the Department of Defence.',
];

export const OUTCOMES = [
  { color: 'var(--accent-ink)', num: '+35', small: '%', what: 'GRESB Infrastructure score uplift in year one', where: 'Major Australian energy distributor · full assessment cycle, then handed over · WSP' },
  { color: 'var(--indigo)', num: '−40', small: '%', what: 'GHG inventory preparation time, through automation', where: 'Excel + Python tooling, documented for internal operation · WSP' },
  { color: 'var(--amber-ink)', num: '3', small: ' BUs', what: 'Manual emissions data collection eliminated', where: 'Pre-configured templates with automated Envizi upload · Downer EDI' },
];

export const PIPELINE = [
  {
    step: 'raw', n: '01', label: 'Raw Data', icon: 'box', color: 'var(--step-raw)',
    desc: 'Design pre-configured data collection systems, automated upload pipelines, and systematic review frameworks that eliminate manual effort and embed audit trails at the data layer.',
    examples: [
      { title: 'Subcontractor Diesel Reporting Templates', body: 'Pre-configured Excel templates with embedded calculation logic and automated Envizi upload generation. Eliminated manual data collection across three Downer business units, replacing a recurring per-quarter effort.', outcome: 'Outcome: manual collection eliminated across 3 BUs, Downer EDI' },
      { title: 'Scope 3 Data Collection Pipeline Rebuild', body: 'Rebuilt the full subcontractor survey pipeline incorporating proxy rate calculations, prior-period response pooling, and CPI inflation adjustment. Structured so business unit contacts can operate each cycle without re-briefing.', outcome: 'Applied across Downer EDI supply chain emissions reporting' },
    ],
  },
  {
    step: 'calc', n: '02', label: 'Calculation', icon: 'spark', color: 'var(--step-calc)',
    desc: 'GHG inventory preparation and Scope 1-3 accounting aligned to GHG Protocol and NGER. Methodology documented for external assurance and reuse across reporting cycles.',
    examples: [
      { title: 'GHG Recalculation Module', body: 'Independent recalculation module with operational control boundary filtering, built to reconcile Group-level emissions calculations against Envizi outputs. Documented logic for ongoing internal verification without advisory dependency.', outcome: 'Outcome: delivered external assurance readiness for Group-level Scope 1 and 2, Downer EDI' },
      { title: 'GHG Inventory Automation: ~40% Time Reduction', body: 'Automated Excel and Python tools at WSP that replaced recurring manual workflows across active client accounts. All tools documented with logic notes for internal operation.', outcome: 'Outcome: ~40% reduction in GHG inventory preparation time, WSP in Australia' },
    ],
  },
  {
    step: 'report', n: '03', label: 'Reporting', icon: 'chart', color: 'var(--step-report)',
    desc: 'Regulatory disclosure for NGER, AASB S2/ISSB, GRESB, and CDP. Full submission management, methodology documentation, and external assurance preparation structured for internal handover.',
    examples: [
      { title: 'GRESB Infrastructure Assessment: 35% Improvement', body: 'Led the full assessment cycle for a major Australian energy distributor: gap analysis, data collection reform, targeted disclosure uplift across management, performance, and stakeholder engagement components. Methodology documented for handover and independently operable from year two.', outcome: 'Outcome: 35% score improvement in year one, handed back as an internally operable process' },
      { title: 'NSW Treasury Net Zero Government Operations Policy', body: 'Technical input on emissions boundary definition and agency-level reporting methodology: operational control vs. equity share treatment, data tier hierarchy for limited-data agencies, and NGER alignment.', outcome: 'Outcome: input incorporated into the whole-of-government policy framework across NSW agencies' },
      { title: 'NGER Statutory Compliance: Section 13E Response', body: 'Drafted and lodged a Section 13E statutory compliance response to DCCEEW under POFRA 2017 within a 30-day deadline. Included reconciliation of historical data and full methodology documentation.', outcome: 'Outcome: submitted on deadline, Downer EDI' },
    ],
  },
  {
    step: 'strategy', n: '04', label: 'Strategy', icon: 'target', color: 'var(--step-strategy)',
    desc: 'Scenario-driven decarbonisation models with traceable lever assumptions drawn from published sources, structured for non-specialist interrogation and owned internally, not dependent on the analyst who built them.',
    examples: [
      { title: 'Net Zero Pathway Model: Board Presentation', body: "Toggle-based net zero pathway model incorporating DCCEEW 2025 grid emission factor projections, NVES Act 2024 fleet trajectories, and BU-level pathway curves. Built for internal operation without ongoing advisory support. Presented to the board by senior leadership as part of the Group's climate strategy, and became the internal reference tool for tracking BU abatement progress.", outcome: 'Outcome: board-level presentation; ongoing internal reference tool, Downer EDI' },
      { title: 'Scope 1-3 Baselines and Decarbonisation Roadmaps', body: 'Delivered across infrastructure and built environment portfolios for government and private sector clients. Each roadmap includes lever-level abatement pathways, revenue-indexed gross emissions forecasting, and documented methodology for independent operation.', outcome: 'Applied across infrastructure, government, and commercial property portfolios, WSP in Australia' },
    ],
    cta: { href: '#scenario', label: '→ See the live scenario model below' },
  },
  {
    step: 'comms', n: '05', label: 'Communication', icon: 'people', color: 'var(--step-comms)',
    desc: 'Technical analysis translated into stakeholder-ready outputs: from board presentations and all-employee training to public disclosure frameworks that teams can operate independently.',
    examples: [
      { title: 'Climate Change eLearning Module: Company-wide Deployment', body: 'Co-developed with an external learning design provider across three role clusters and two delivery formats. Content designed from scratch through to company-wide launch, covering GHG accounting fundamentals, decarbonisation levers, and role-specific action pathways.', outcome: 'Outcome: deployed across all-employee cohort company-wide, Downer EDI' },
      { title: 'ESG Impact Report Workshop', body: 'Facilitated a cross-BU ESG Impact Report content workshop with a General Manager, coordinating four business unit disclosure reviews through Workiva for the annual ESG Impact Report.', outcome: 'Applied to the annual ESG Impact Report, Downer EDI' },
    ],
  },
];

export const PRINCIPLES = [
  { num: '01', icon: 'list', title: 'Data integrity precedes narrative.', body: 'Every net zero commitment is a claim. Its credibility depends on what sits behind it: a defensible, independently verifiable inventory documented before the narrative, not after.' },
  { num: '02', icon: 'spark', title: 'Reusable infrastructure compounds value.', body: "Advisory that lives in a consultant's head has a short shelf life. I build models and processes designed to be owned internally, so the team can run the next reporting cycle without calling back in." },
  { num: '03', icon: 'target', title: 'Ambition grounded in evidence, with gaps named.', body: 'The science sets the pace. Pathway models need lever assumptions grounded in published data, with uncertainty disclosed alongside figures. Carbon credits belong on residual hard-to-abate emissions, not as a substitute for near-term reduction.' },
];

// ---------------------------------------------------------------------------
// TOOLS — the standalone subpages, gathered on the home page as evidence.
//
// Framing note (deliberate, do not soften): this section exists to answer a
// hiring manager's question, "can this person actually do the work". So every
// card carries two lines, not one. `what` says what the tool does; `proves`
// names the capability a role would be buying. `scope` is a plain fact about
// the page's coverage, never a vanity metric, and each figure below is the
// real count in that tool's data file. Refresh it when the data grows.
//
// Order is by relevance to a senior sustainability role, not by build date.
// Accent colours are picked to clear contrast on the forest band the section
// sits on, which is why the indigo used elsewhere on the page is absent here.
// ---------------------------------------------------------------------------
export const TOOLS_INTRO = {
  tag: 'Tools',
  idx: '03 / ',
  title: ['Built,', 'not claimed'],
  paras: [
    'Eight tools, built in my own time and maintained since. Each one takes a question a sustainability team actually has to answer and answers it in public, with sourced numbers, a stated method, and the gaps named rather than smoothed over.',
    'They run on the same discipline I bring to a reporting cycle. If a figure cannot be traced to a citation and an access date, it does not go on the page. Where a number is an estimate, the page says so beside the number, not in a footnote at the bottom.',
  ],
  rules: [
    {
      icon: 'list', head: 'Sourced or it does not ship',
      body: 'Every figure carries its source and the date it was read. Estimates are labelled as estimates, at the number.',
    },
    {
      icon: 'book', head: 'Each tool states its basis',
      body: 'Method, boundary, exclusions and update cadence sit on the page, the way an assurance-ready inventory carries its basis of preparation.',
    },
    {
      icon: 'loop', head: 'Built to be handed over',
      body: 'Data, copy and methodology live in one place per tool, so refreshing a factor moves the whole page instead of one hard-coded number.',
    },
  ],
  note: 'The decarbonisation model above is the ninth, built the same way.',
};

export const TOOLS = [
  {
    n: '01', icon: 'target', color: 'var(--berry)',
    name: 'Target Tracker', href: 'targets/',
    what: 'Every ASX50 net zero claim drawn as the trajectory the company itself stated, from base year through interim targets, with its reported Scope 1 and 2 emissions plotted on top.',
    proves: 'Reading corporate disclosure at scale, then holding a claimed pathway against reported data with no adjective attached.',
    tags: ['Corporate disclosure', 'Trajectory maths', 'Verification status'],
    scope: '50 companies · each flagged sourced, partial or unverified',
  },
  {
    n: '02', icon: 'chart', color: 'var(--lime)',
    name: 'Work Samples', href: 'work/',
    what: 'Four client-side frameworks as live working examples: emissions baseline, decarbonisation roadmap, multi-criteria prioritisation, and lifecycle carbon. One case study runs through all four.',
    proves: 'The engagement arc I run end to end: boundary and data grading, quantified options, stakeholder-weighted screening, then a sequenced roadmap with CAPEX by year.',
    tags: ['Scope 1-3 baseline', 'MCA framework', 'A1-A5 lifecycle'],
    scope: '4 frameworks · one engagement, start to finish',
  },
  {
    n: '03', icon: 'shirt', color: 'var(--amber)',
    name: 'Cost Per Wear', href: 'fashion/',
    what: 'A transparency lookup across 258 fashion brands: who owns them, what they disclose, and what you still cannot find out. A garment studio sits alongside it for footprint, fabric and supply chain.',
    proves: 'Supply chain transparency work in the sector I am aiming at, built on a disclosure vocabulary that reports status and never grades a brand good or bad.',
    tags: ['Supply chain', 'Fashion Transparency Index', 'Ownership mapping'],
    scope: '258 brands · disclosure status, never a ranking',
  },
  {
    n: '04', icon: 'coins', color: 'var(--sage-2)',
    name: 'Super Fund Holdings', href: 'super/',
    what: 'What the big default super options actually hold and where the sector exposure sits, put next to what each fund says about sustainability in its own marketing.',
    proves: 'Turning a statutory disclosure obligation into something a member can read, with a confidence flag on every field and a last-verified date per fund.',
    tags: ['s1017BB holdings', 'Sector exposure', 'Confidence flags'],
    scope: '10 funds · MySuper default options · methodology on its own route',
  },
  {
    n: '05', icon: 'bolt', color: 'var(--lime-bright)',
    name: 'Grid Intensity', href: 'grid/',
    what: 'Reads the live National Electricity Market fuel mix and answers one question: run it now, or wait. Then explains the factor a business would actually report against.',
    proves: 'Scope 2 accounting taught properly, location-based against market-based, with GreenPower, PPAs and LGC surrender all in the toggle.',
    tags: ['Live AEMO data', 'Scope 2', 'Market vs location'],
    scope: '5 NEM regions live · WA and NT named as out of scope, not invented',
  },
  {
    n: '06', icon: 'house', color: 'var(--matcha)',
    name: 'Life Footprint', href: 'footprint/',
    what: 'A full personal emissions model across ten categories, with a guided audit, an abatement planner, a forecast pathway and a reveal at the end that makes the year legible.',
    proves: 'The whole inventory arc in miniature: boundary, cited factor set, calculation, abatement pathway, and a basis of preparation kept in sync with the engine.',
    tags: ['Cited factor set', 'Abatement planner', 'Basis of preparation'],
    scope: '10 categories · every factor cites its source',
  },
  {
    n: '07', icon: 'globe', color: 'var(--lime)',
    name: "Australia's Climate Progress", href: 'progress/',
    what: 'Six national numbers on the energy transition, each shown against where it was and where the target needs it to be. The gap gets stated plainly, in both directions.',
    proves: 'Keeping sourced, derived and estimated figures apart, and refusing to blend a live grid snapshot into an annual inventory because the two are different quantities.',
    tags: ['NGER and AEMO data', 'Live NEM feed', 'Target gap'],
    scope: '6 indicators · reviewed quarterly, date on the page',
  },
  {
    n: '08', icon: 'spark', color: 'var(--amber)',
    name: 'Sustainability Daily', href: 'daily/',
    what: 'Two daily puzzles: guess the footprint, and call the greenwash. Both rotate deterministically by date, and streaks stay in your browser.',
    proves: 'Making a factor set legible to a non-specialist, and applying the ACCC greenwashing principles consistently enough to survive being graded every day.',
    tags: ['ACCC principles', 'Shared factor set', 'No server'],
    scope: '33 footprint items · 30 claims · figures derived from the footprint model',
  },
];

export const EXPERIENCE = [
  {
    mark: 'DG', clr: 'downer',
    logo: 'Downer_Group_logo.svg.png', logoClass: 'logo-downer', logoAlt: 'Downer Group logo', logoW: 252, logoH: 90,
    org: 'Downer EDI', dept: 'Group Environment, Sustainability & Reporting',
    roles: [{ title: 'Senior Sustainability Advisor', date: 'Mar 2026 - Present' }],
    bullets: [
      { section: 'Facilitation & Stakeholder Influence' },
      { text: 'Facilitated a cross-BU ESG Impact Report content workshop with a General Manager, coordinating four business unit disclosure reviews through Workiva for the annual ESG Impact Report.' },
      { text: 'Co-developed an all-employee climate eLearning module with an external learning design provider across three role clusters and two delivery formats, from content design through company-wide launch.' },
      { section: 'Data Tools & Systems' },
      { text: 'Built a toggle-based net zero pathway model using government and research-sourced lever assumptions, structured for internal operation without ongoing advisory support.' },
      { text: 'Designed pre-configured subcontractor diesel reporting templates with embedded calculation logic and automated Envizi upload generation, eliminating manual collection across three business units.' },
      { text: 'Developed an independent GHG recalculation module with operational control boundary filtering to support external assurance.' },
      { text: 'Rebuilt the Scope 3 subcontractor data collection pipeline, incorporating proxy rate calculations, prior-period response pooling, and CPI inflation adjustment.' },
      { text: 'Redesigned FY emissions data review tools with cross-BU anomaly detection, site completeness tracking, and emission factor verification logic.' },
      { section: 'Portfolio & Governance' },
      { text: 'Drafted and lodged a Section 13E statutory compliance response to DCCEEW under POFRA 2017 within a 30-day deadline.' },
      { text: 'Managed 12+ concurrent workstreams from Month 1, spanning GHG reporting, disclosure preparation, emissions modelling, and eLearning development.' },
      { text: 'Built a cross-BU stakeholder cadence from scratch, establishing fortnightly check-ins with six business unit contacts within the first six weeks.' },
    ],
  },
  {
    mark: 'WSP', clr: 'wsp',
    logo: 'img-png-wsp-red.png', logoClass: 'logo-wsp', logoAlt: 'WSP logo', logoW: 126, logoH: 60,
    org: 'WSP in Australia', dept: 'Sustainability & Climate Change Advisory',
    roles: [
      { title: 'Project Consultant', date: 'Oct 2025 - Feb 2026' },
      { title: 'Design Consultant', date: 'Oct 2023 - Oct 2025' },
      { title: 'Sustainability Consultant', date: 'Feb 2022 - Oct 2023' },
    ],
    bullets: [
      { text: '35% GRESB score improvement in year one: led the full Infrastructure Assessment cycle for a major Australian energy distributor, from gap analysis and data collection reform through to final submission and internal handover.' },
      { text: 'GHG inventory preparation time reduced by approximately 40%: built automated Excel and Python tools that replaced recurring manual workflows across active client accounts, with documented logic for ongoing internal operation.' },
      { text: 'Technical input to NSW Treasury Net Zero Government Operations Policy: contributed emissions boundary definition and agency-level reporting methodology to the whole-of-government framework.' },
      { text: 'Lifecycle carbon assessments delivered for hospital and commercial fitout projects: A1-A5 boundary analysis with material hotspot quantification and low-carbon specification recommendations referenced against IStructE and GBCA benchmarks.' },
      { text: 'Scope 1-3 baselines and decarbonisation roadmaps delivered across infrastructure and built environment portfolios for government and private sector clients.' },
    ],
  },
  {
    mark: 'DoD', clr: 'defence',
    logo: 'Defence.png', logoClass: 'logo-defence', logoAlt: 'Australian Government Department of Defence crest', logoW: 168, logoH: 168,
    org: 'Department of Defence', dept: 'Capital Facilities & Infrastructure Branch',
    roles: [{ title: 'Assistant Project Officer', date: 'Feb 2020 - Jan 2022' }],
    bullets: [
      { text: 'Infrastructure upgrade project delivery across Defence sites as part of a $3.2 billion capital portfolio under the Capital Facilities & Infrastructure Branch, coordinating design, procurement, and delivery across multiple concurrent projects.' },
    ],
  },
];

// Rendered with the same entry layout as EXPERIENCE so education reads as a
// peer of the employment history, not an isolated card. org/dept/roles mirror
// the shape of an EXPERIENCE entry; bullets carry a bold lead-in label.
export const EDUCATION = {
  mark: 'UNSW', clr: 'unsw',
  org: 'University of New South Wales',
  dept: 'Bachelor of Engineering (Civil with Architecture)',
  roles: [{ title: 'Honours Class 1' }],
  bullets: [
    { lead: 'Honours', text: 'First Class, Dean’s Honours List.' },
    { lead: 'Thesis · 92/100', text: 'Vertical Greenery Systems and the Indoor Setting.' },
    { lead: 'Leadership', text: 'President, CEVSOC 2021 · Arc Club of the Year · executive team of 56, 2,000-member society.' },
    { lead: 'Capstone', text: 'Sustainable infrastructure masterplanning · Green Star, NABERS, Envision.' },
  ],
};

// The footer is the site's single closing statement. The old standalone
// Contact section folded in here: the availability line, the location, and one
// primary LinkedIn action. There is deliberately no second LinkedIn CTA.
export const FOOTER = {
  wordmark: 'Chris Wang',
  availability: 'Open to senior advisory and lead sustainability roles.',
  // Merged from the former Contact section.
  location: 'Melbourne, Australia · flexible on arrangement',
  ctaLabel: 'Connect on LinkedIn',
  ctaHref: 'https://linkedin.com/in/itschriswang',
  ctaHandle: 'linkedin.com/in/itschriswang',
  rights: 'All rights reserved © 2026 · Chris Wang',
  tagline: 'Sustainability advisor · Melbourne, Australia',
  // Link columns. hrefs beginning with '#' or a sub-path are prefixed with the
  // page base at render time so the footer works from the root and /work/.
  columns: [
    {
      head: 'Profile', icon: 'people',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Capabilities', href: '#bio' },
        { label: 'My Practice', href: '#principles' },
        { label: 'Experience', href: '#experience' },
      ],
    },
    {
      head: 'Work', icon: 'chart',
      links: [
        { label: 'Decarb Model', href: '#scenario' },
        { label: 'Work Samples', href: 'work/' },
        { label: 'Carbon Footprint', href: 'footprint/' },
        { label: 'Cost Per Wear', href: 'fashion/' },
      ],
    },
    {
      head: 'Tools', icon: 'spark',
      links: [
        { label: 'Grid Intensity', href: 'grid/' },
        { label: 'Sustainability Daily', href: 'daily/' },
        { label: 'Super Fund Holdings', href: 'super/' },
        { label: 'Climate Progress', href: 'progress/' },
        { label: 'Target Tracker', href: 'targets/' },
      ],
    },
  ],
};
