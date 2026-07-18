// All editorial copy, preserved verbatim from the original site. Nothing here
// is summarised or omitted — only re-laid-out by the components that consume it.

export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#bio', label: 'Capabilities' },
  { href: '#principles', label: 'My Practice' },
  { href: '#scenario', label: 'Decarb Model' },
  { href: 'work/', label: 'Work Samples', external: true },
  { href: 'footprint/', label: 'Footprint', external: true },
  { href: 'fashion/', label: 'Sevenfold', external: true },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export const HERO = {
  name: ['Christopher', 'Wang'],
  roles: ['Sustainability Advisor', 'Emissions Modeller', 'ESG Reporting Lead', 'Decarbonisation Strategist'],
  linkedin: 'https://linkedin.com/in/itschriswang',
  linkedinLabel: 'linkedin.com/in/itschriswang',
  location: 'Melbourne, Australia',
  prop: 'I help large organisations turn emissions data into governed reporting infrastructure and credible decarbonisation pathways. The work is repeatable, auditable, and built to be owned by the team.',
  // Animated counters: start date drives the live "years" figure.
  instruments: [
    { id: 'years-advisory', label: ['Years sustainability', 'advisory'], start: '2022-02-01', suffix: '+' },
    { id: 'years-built-env', label: ['Years built environment', '& infrastructure'], start: '2020-02-01', suffix: '+' },
  ],
};

export const BIO_PARAS = [
  'I build the data infrastructure that makes sustainability commitments defensible: GHG inventories with documented methodology, Scope 1-3 baselines that survive external assurance, decarbonisation models with traceable lever assumptions, and reporting systems that internal teams can operate after I leave the engagement.',
  'Four years in sustainability advisory across WSP and Downer EDI: GHG accounting, regulatory disclosure, decarbonisation modelling, supply chain emissions. Six years prior in built environment and infrastructure, including project delivery at the Department of Defence.',
  'Looking for sustainability leadership in fashion, consumer goods, or technology, where supply chain transparency and decarbonisation are primary workstreams, not obligations.',
];

export const OUTCOMES = [
  { color: 'var(--matcha)', num: '+35', small: '%', what: 'GRESB Infrastructure score uplift in year one', where: 'Major Australian energy distributor · full assessment cycle, then handed over · WSP' },
  { color: 'var(--indigo)', num: '−40', small: '%', what: 'GHG inventory preparation time, through automation', where: 'Excel + Python tooling, documented for internal operation · WSP' },
  { color: 'var(--amber)', num: '3', small: ' BUs', what: 'Manual emissions data collection eliminated', where: 'Pre-configured templates with automated Envizi upload · Downer EDI' },
];

export const PIPELINE = [
  {
    step: 'raw', n: '01', label: 'Raw Data', color: 'var(--step-raw)',
    desc: 'Design pre-configured data collection systems, automated upload pipelines, and systematic review frameworks that eliminate manual effort and embed audit trails at the data layer.',
    examples: [
      { title: 'Subcontractor Diesel Reporting Templates', body: 'Pre-configured Excel templates with embedded calculation logic and automated Envizi upload generation. Eliminated manual data collection across three Downer business units, replacing a recurring per-quarter effort.', outcome: 'Outcome: manual collection eliminated across 3 BUs, Downer EDI' },
      { title: 'Scope 3 Data Collection Pipeline Rebuild', body: 'Rebuilt the full subcontractor survey pipeline incorporating proxy rate calculations, prior-period response pooling, and CPI inflation adjustment. Structured so business unit contacts can operate each cycle without re-briefing.', outcome: 'Applied across Downer EDI supply chain emissions reporting' },
    ],
  },
  {
    step: 'calc', n: '02', label: 'Calculation', color: 'var(--step-calc)',
    desc: 'GHG inventory preparation and Scope 1-3 accounting aligned to GHG Protocol and NGER. Methodology documented for external assurance and reuse across reporting cycles.',
    examples: [
      { title: 'GHG Recalculation Module', body: 'Independent recalculation module with operational control boundary filtering, built to reconcile Group-level emissions calculations against Envizi outputs. Documented logic for ongoing internal verification without advisory dependency.', outcome: 'Outcome: delivered external assurance readiness for Group-level Scope 1 and 2, Downer EDI' },
      { title: 'GHG Inventory Automation: ~40% Time Reduction', body: 'Automated Excel and Python tools at WSP that replaced recurring manual workflows across active client accounts. All tools documented with logic notes for internal operation.', outcome: 'Outcome: ~40% reduction in GHG inventory preparation time, WSP in Australia' },
    ],
  },
  {
    step: 'report', n: '03', label: 'Reporting', color: 'var(--step-report)',
    desc: 'Regulatory disclosure for NGER, AASB S2/ISSB, GRESB, and CDP. Full submission management, methodology documentation, and external assurance preparation structured for internal handover.',
    examples: [
      { title: 'GRESB Infrastructure Assessment: 35% Improvement', body: 'Led the full assessment cycle for a major Australian energy distributor: gap analysis, data collection reform, targeted disclosure uplift across management, performance, and stakeholder engagement components. Methodology documented for handover and independently operable from year two.', outcome: 'Outcome: 35% score improvement in year one, handed back as an internally operable process' },
      { title: 'NSW Treasury Net Zero Government Operations Policy', body: 'Technical input on emissions boundary definition and agency-level reporting methodology: operational control vs. equity share treatment, data tier hierarchy for limited-data agencies, and NGER alignment.', outcome: 'Outcome: input incorporated into the whole-of-government policy framework across NSW agencies' },
      { title: 'NGER Statutory Compliance: Section 13E Response', body: 'Drafted and lodged a Section 13E statutory compliance response to DCCEEW under POFRA 2017 within a 30-day deadline. Included reconciliation of historical data and full methodology documentation.', outcome: 'Outcome: submitted on deadline, Downer EDI' },
    ],
  },
  {
    step: 'strategy', n: '04', label: 'Strategy', color: 'var(--step-strategy)',
    desc: 'Scenario-driven decarbonisation models with traceable lever assumptions drawn from published sources, structured for non-specialist interrogation and owned internally, not dependent on the analyst who built them.',
    examples: [
      { title: 'Net Zero Pathway Model: Board Presentation', body: "Toggle-based net zero pathway model incorporating DCCEEW 2025 grid emission factor projections, NVES Act 2024 fleet trajectories, and BU-level pathway curves. Built for internal operation without ongoing advisory support. Presented to the board by senior leadership as part of the Group's climate strategy, and became the internal reference tool for tracking BU abatement progress.", outcome: 'Outcome: board-level presentation; ongoing internal reference tool, Downer EDI' },
      { title: 'Scope 1-3 Baselines and Decarbonisation Roadmaps', body: 'Delivered across infrastructure and built environment portfolios for government and private sector clients. Each roadmap includes lever-level abatement pathways, revenue-indexed gross emissions forecasting, and documented methodology for independent operation.', outcome: 'Applied across infrastructure, government, and commercial property portfolios, WSP in Australia' },
    ],
    cta: { href: '#scenario', label: '→ See the live scenario model below' },
  },
  {
    step: 'comms', n: '05', label: 'Communication', color: 'var(--step-comms)',
    desc: 'Technical analysis translated into stakeholder-ready outputs: from board presentations and all-employee training to public disclosure frameworks that teams can operate independently.',
    examples: [
      { title: 'Climate Change eLearning Module: Company-wide Deployment', body: 'Co-developed with an external learning design provider across three role clusters and two delivery formats. Content designed from scratch through to company-wide launch, covering GHG accounting fundamentals, decarbonisation levers, and role-specific action pathways.', outcome: 'Outcome: deployed across all-employee cohort company-wide, Downer EDI' },
      { title: 'ESG Impact Report Workshop', body: 'Facilitated a cross-BU ESG Impact Report content workshop with a General Manager, coordinating four business unit disclosure reviews through Workiva for the annual ESG Impact Report.', outcome: 'Applied to the annual ESG Impact Report, Downer EDI' },
    ],
  },
];

export const PRINCIPLES = [
  { num: '01', title: 'Data integrity precedes narrative.', body: 'Every net zero commitment is a claim. Its credibility depends on what sits behind it: a defensible, independently verifiable inventory documented before the narrative, not after.' },
  { num: '02', title: 'Reusable infrastructure compounds value.', body: "Advisory that lives in a consultant's head has a short shelf life. I build models and processes designed to be owned internally, so the team can run the next reporting cycle without calling back in." },
  { num: '03', title: 'Ambition grounded in evidence, with gaps named.', body: 'The science sets the pace. Pathway models need lever assumptions grounded in published data, with uncertainty disclosed alongside figures. Carbon credits belong on residual hard-to-abate emissions, not as a substitute for near-term reduction.' },
];

export const TICKER_TERMS = [
  { term: 'GHG Protocol', tip: 'Corporate value chain accounting standard: defines Scope 1, 2, and 3 emission boundaries and reporting methodology.' },
  { term: 'NGER Act', tip: 'National Greenhouse and Energy Reporting Act: mandatory Australian corporate emissions reporting to DCCEEW.' },
  { term: 'AASB S2 / ISSB', tip: 'Australian mandatory climate disclosure standard aligned to ISSB S2, effective for large entities from FY2025.' },
  { term: 'CDP Supply Chain', tip: 'Annual supplier emissions disclosure programme managed on behalf of large buyer organisations via the CDP platform.' },
  { term: 'GRESB Infrastructure', tip: 'Real assets ESG benchmark used by infrastructure fund managers and institutional investors for annual performance comparison.' },
  { term: 'TCFD', tip: 'Task Force on Climate-related Financial Disclosures: scenario analysis framework for transition and physical risk disclosure.' },
  { term: 'SBTi', tip: 'Science Based Targets initiative: validates near-term and long-term emission reduction targets against 1.5°C pathways.' },
  { term: 'DCCEEW NGA Factors', tip: 'DCCEEW National Greenhouse Accounts emission factors, used for NGER fuel combustion and grid electricity calculations.' },
  { term: 'Externally Assured', tip: 'External limited assurance over Group-level Scope 1 and 2 emissions for statutory and market reporting.' },
  { term: 'Envizi', tip: 'IBM Envizi ESG Suite: platform for emissions data ingestion, normalisation, audit trail, and regulatory output.' },
  { term: 'Workiva', tip: 'Cloud-based platform for connected ESG and financial reporting with linked data, narrative, and disclosure workflow.' },
  { term: 'Net Zero FY2050', tip: 'Net-zero Scope 1 and 2 emissions target by FY2050, with interim milestones and lever-tracked abatement pathways.' },
  { term: 'Revenue-Indexed Forecasting', tip: 'Gross emissions scaled proportionally to revenue growth, isolates abatement impact from business volume changes.' },
  { term: 'Market-Based Scope 2', tip: 'Scope 2 accounting using supplier-specific emission rates or energy attribute certificates rather than grid averages.' },
];

export const EXPERIENCE = [
  {
    mark: 'DG', clr: 'downer',
    logo: 'Downer_Group_logo.svg.png', logoClass: 'logo-downer', logoAlt: 'Downer Group logo', logoW: 252, logoH: 90,
    org: 'Downer EDI', dept: 'Group Environment, Sustainability & Reporting',
    roles: [{ title: 'Senior Sustainability Advisor', date: 'Mar 2026 - Mar 2027' }],
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

export const EDUCATION = {
  mark: 'UNSW', clr: 'unsw',
  inst: 'University of New South Wales',
  deg: 'Bachelor of Engineering (Civil Engineering with Architecture), Honours Class 1',
  cells: [
    { l: 'Honours', b: ['First Class', ' · Dean’s Honours List'] },
    { l: 'Thesis · graded 92/100', b: ['Vertical Greenery Systems and the Indoor Setting', ''] },
    { l: 'Leadership', b: ['President, CEVSOC 2021', ' · Arc Club of the Year · executive team of 56, 2,000-member society'] },
    { l: 'Capstone', b: ['Sustainable infrastructure masterplanning', ' · Green Star, NABERS, Envision'] },
  ],
};

export const CONTACT = {
  line: 'open to senior advisory and lead sustainability roles.',
  loc: 'Melbourne, Victoria · Flexible on arrangement',
  linkedin: 'https://linkedin.com/in/itschriswang',
};

export const FOOTER = {
  wordmark: 'Christopher Wang',
  // A real, useful call to action — not an invented newsletter. Chris is open
  // to roles, so the prominent footer block points at getting in touch.
  availability: 'Open to senior advisory and lead sustainability roles.',
  ctaLabel: 'Get in touch',
  ctaHref: 'https://linkedin.com/in/itschriswang',
  rights: 'All rights reserved © 2026 · Christopher Wang',
  tagline: 'Sustainability advisor · Melbourne, Australia',
  // Link columns. hrefs beginning with '#' or a sub-path are prefixed with the
  // page base at render time so the footer works from the root and /work/.
  columns: [
    {
      head: 'Profile',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Capabilities', href: '#bio' },
        { label: 'My Practice', href: '#principles' },
        { label: 'Experience', href: '#experience' },
      ],
    },
    {
      head: 'Work',
      links: [
        { label: 'Decarb Model', href: '#scenario' },
        { label: 'Work Samples', href: 'work/' },
        { label: 'Life Footprint', href: 'footprint/' },
        { label: 'Sevenfold', href: 'fashion/' },
      ],
    },
    {
      head: 'Connect',
      links: [
        { label: 'LinkedIn', href: 'https://linkedin.com/in/itschriswang', external: true },
        { label: 'Contact', href: '#contact' },
      ],
    },
  ],
};
