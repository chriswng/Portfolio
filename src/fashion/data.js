// ============================================================================
// OPENWEAVE — data layer for the fashion brand transparency lookup.
//
// WHAT THIS IS
//   A practical tool for looking up what major fashion brands actually
//   disclose about their supply chains and climate impact. Not a moral
//   ranking. Every company below is a real, publicly listed or privately
//   held business, grouped under its real corporate parent.
//
// HONESTY RULES, load-bearing
//   - We never invent a metric. A value is either sourced or marked
//     'needs-research'. There are no placeholder numbers on this page.
//   - The one quantified signal we carry is the Fashion Transparency Index
//     (FTI) score, published by Fashion Revolution. It measures how much a
//     brand DISCLOSES across policy, governance, supply-chain traceability,
//     and impact. It is NOT a measure of environmental performance. A brand
//     can score high on disclosure and still have a large footprint.
//   - Parent company, segment and headquarters are stable public facts.
//   - Everything a human still needs to verify is tracked in
//     public/data/fashion-brands.csv so it can be filled in over time.
//
// SOURCES
//   Fashion Revolution, Fashion Transparency Index 2023 (250 brands scored
//   on public disclosure). Company ownership from corporate filings and
//   official brand ownership pages. See SOURCES export at the foot of file.
// ============================================================================

// --- Disclosure status vocabulary. Deliberately plain. No "good"/"bad". ---
export const STATUS = {
  disclosed: { id: 'disclosed', label: 'Disclosed' },
  partial: { id: 'partial', label: 'Partly disclosed' },
  parent: { id: 'parent', label: 'Parent-level only' },
  notFound: { id: 'notFound', label: 'Not found' },
  research: { id: 'research', label: 'Needs research' },
};

// --- Market segments, used for the directory filter chips. ---
export const SEGMENTS = [
  { id: 'sportswear', label: 'Sportswear' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'fastfashion', label: 'Fast fashion' },
  { id: 'department', label: 'Department & value' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'denim', label: 'Denim' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'online', label: 'Online retail' },
  { id: 'basics', label: 'Basics & mass market' },
];

// FTI score bands. Fashion Revolution groups results into 0-10% ... 81-100%
// brackets. We collapse to four plain-English bands for the signal chip.
export const FTI_BANDS = [
  { min: 60, id: 'high', label: 'High disclosure', note: 'Publishes a lot of supply-chain and policy detail.' },
  { min: 35, id: 'mid', label: 'Moderate disclosure', note: 'Discloses the basics; gaps remain in the detail.' },
  { min: 15, id: 'low', label: 'Low disclosure', note: 'Publishes little that can be independently checked.' },
  { min: 0, id: 'minimal', label: 'Minimal disclosure', note: 'Almost nothing public to work from.' },
];

export function ftiBand(score) {
  if (score == null) return null;
  return FTI_BANDS.find((b) => score >= b.min) || FTI_BANDS[FTI_BANDS.length - 1];
}

// ---------------------------------------------------------------------------
// BRAND MONOGRAMS — the "woven care-label" logo system.
//
// We do not ship third-party logo artwork. Instead every brand carries a
// self-derived monogram rendered as a fabric-label tile, in the page's own
// visual language. This means the mark is honest (nothing borrowed), fully
// self-contained (no external assets), and, most usefully, AUTOMATIC: any
// brand added to RAW_BRANDS below gets a mark with no extra work.
//
// A short override map is kept only for houses whose established lettermark is
// not what the plain derivation would produce (Gucci's double-G, YSL, and so
// on). Everything else falls through to deriveMonogram().
// ---------------------------------------------------------------------------
export const MONO_OVERRIDES = {
  Gucci: 'GG',
  'Saint Laurent': 'YSL',
  Dior: 'CD',
  Chanel: 'CC',
  Fendi: 'FF',
  'The North Face': 'TNF',
};

// Words we skip when taking initials, so "The North Face" reads NF not TN.
const MONO_STOPWORDS = new Set(['the', 'a', 'an', 'of', 'and', 'for']);

export function deriveMonogram(name) {
  if (!name) return '—';
  if (MONO_OVERRIDES[name]) return MONO_OVERRIDES[name];
  const words = name
    .replace(/&/g, ' ')
    .split(/[\s\-–—/]+/)
    .filter(Boolean)
    .filter((w) => !MONO_STOPWORDS.has(w.toLowerCase()));
  if (words.length === 0) return name.slice(0, 2).toUpperCase();
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  const w = words[0];
  if (w.length <= 3) return w.toUpperCase();
  return w.slice(0, 2).toUpperCase();
}

// Per-segment identity: which typeface the monogram is set in, and the colour
// of the label's stitch line. Drawn only from the existing palette tokens so
// the marks stay inside the calico/indigo/madder world of the page. This is
// also a quiet legend: once you learn the colours, the directory reads as a
// segment map. type is 'serif' (couture), 'sans' (athletic) or 'mono' (retail).
export const SEGMENT_STYLE = {
  sportswear:  { type: 'sans',  accent: 'var(--ink)' },
  luxury:      { type: 'serif', accent: 'var(--indigo)' },
  fastfashion: { type: 'mono',  accent: 'var(--madder)' },
  department:  { type: 'mono',  accent: 'var(--faint)' },
  outdoor:     { type: 'sans',  accent: 'var(--sage)' },
  denim:       { type: 'sans',  accent: 'var(--indigo-deep)' },
  footwear:    { type: 'sans',  accent: 'var(--ink-soft)' },
  online:      { type: 'mono',  accent: 'var(--weld)' },
  basics:      { type: 'mono',  accent: 'var(--ink-soft)' },
};

export function segmentStyle(id) {
  return SEGMENT_STYLE[id] || { type: 'sans', accent: 'var(--ink)' };
}

// ---------------------------------------------------------------------------
// THE BRAND UNIVERSE.
//
// Each entry carries only facts we can stand behind:
//   name       the brand as people know it
//   aliases    alternate spellings / search shortcuts
//   parent     the corporate parent (a real company)
//   group      the reporting group whose disclosures cover this brand,
//              when different from the parent trading name
//   segment    market segment id (see SEGMENTS)
//   country    headquarters country
//   au         true if it is an Australian brand or has a major AU presence
//   recognition 'high' | 'medium' — rough familiarity to a general audience
//   knownFor   one honest descriptor
//   fti        Fashion Transparency Index 2023 score (0-100) or null.
//              null renders as "Needs research", never as a guess.
//   ftiNote    context on the score (e.g. "scored under parent")
//   reportUrl  a real sustainability/ESG landing page, or null
//
// The heavier per-field disclosure statuses (scope 1/2, scope 3, materials,
// supply chain, circularity) are intentionally left to the research tracker
// rather than asserted here without a source. buildBrand() defaults them to
// 'needs-research' so the page never overclaims.
// ---------------------------------------------------------------------------
const RAW_BRANDS = [
  // ---- Sportswear -------------------------------------------------------
  { name: 'Nike', aliases: ['nike'], parent: 'Nike, Inc.', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Footwear and athletic apparel', fti: null, reportUrl: 'https://about.nike.com/en/impact' },
  { name: 'Adidas', aliases: ['adidas'], parent: 'Adidas AG', segment: 'sportswear', country: 'Germany', recognition: 'high', knownFor: 'Sportswear and footwear', fti: null, reportUrl: 'https://www.adidas-group.com/en/sustainability/' },
  { name: 'Puma', aliases: ['puma'], parent: 'Puma SE', group: 'Puma SE (Artémis / Pinault-controlled)', segment: 'sportswear', country: 'Germany', recognition: 'high', knownFor: 'Sportswear and football boots', fti: null, reportUrl: 'https://about.puma.com/en/sustainability' },
  { name: 'ASICS', aliases: ['asics'], parent: 'ASICS Corporation', segment: 'sportswear', country: 'Japan', recognition: 'medium', knownFor: 'Running shoes', fti: null, reportUrl: 'https://corp.asics.com/en/csr' },
  { name: 'New Balance', aliases: ['new balance', 'nb'], parent: 'New Balance Athletics, Inc.', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Running and lifestyle footwear', fti: null, reportUrl: 'https://www.newbalance.com/responsible-leadership/' },
  { name: 'Under Armour', aliases: ['under armour', 'underarmour', 'ua'], parent: 'Under Armour, Inc.', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Performance sportswear', fti: null, reportUrl: 'https://about.underarmour.com/en/sustainability' },
  { name: 'lululemon', aliases: ['lululemon', 'lulu'], parent: 'lululemon athletica inc.', segment: 'sportswear', country: 'Canada', recognition: 'high', knownFor: 'Yoga and athleisure', fti: null, reportUrl: 'https://corporate.lululemon.com/our-impact' },

  // ---- Luxury (LVMH) ----------------------------------------------------
  { name: 'Louis Vuitton', aliases: ['louis vuitton', 'lv', 'vuitton'], parent: 'LVMH', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Leather goods and fashion', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },
  { name: 'Dior', aliases: ['dior', 'christian dior'], parent: 'LVMH', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Couture and ready-to-wear', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },
  { name: 'Loewe', aliases: ['loewe'], parent: 'LVMH', segment: 'luxury', country: 'Spain', recognition: 'medium', knownFor: 'Leather goods', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },
  { name: 'Fendi', aliases: ['fendi'], parent: 'LVMH', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Fur, leather and ready-to-wear', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },
  { name: 'Celine', aliases: ['celine', 'céline'], parent: 'LVMH', segment: 'luxury', country: 'France', recognition: 'medium', knownFor: 'Ready-to-wear and leather goods', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },

  // ---- Luxury (Kering) --------------------------------------------------
  { name: 'Gucci', aliases: ['gucci'], parent: 'Kering', segment: 'luxury', country: 'Italy', recognition: 'high', knownFor: 'Ready-to-wear, leather goods', fti: 80, ftiNote: 'Ranked 2nd of 250 in FTI 2023, up 21 points year on year and the first luxury house in the top tier.', reportUrl: 'https://www.kering.com/en/sustainability/' },
  { name: 'Saint Laurent', aliases: ['saint laurent', 'ysl', 'yves saint laurent'], parent: 'Kering', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Ready-to-wear and leather', fti: null, reportUrl: 'https://www.kering.com/en/sustainability/' },
  { name: 'Balenciaga', aliases: ['balenciaga'], parent: 'Kering', segment: 'luxury', country: 'Spain', recognition: 'high', knownFor: 'Ready-to-wear and sneakers', fti: null, reportUrl: 'https://www.kering.com/en/sustainability/' },
  { name: 'Bottega Veneta', aliases: ['bottega veneta', 'bottega'], parent: 'Kering', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Woven leather goods', fti: null, reportUrl: 'https://www.kering.com/en/sustainability/' },

  // ---- Luxury (independent / other groups) ------------------------------
  { name: 'Hermès', aliases: ['hermes', 'hermès'], parent: 'Hermès International', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Leather goods and silk', fti: null, reportUrl: 'https://finance.hermes.com/en/sustainable-development/' },
  { name: 'Chanel', aliases: ['chanel'], parent: 'Chanel Limited (private)', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Couture, fragrance, leather', fti: null, reportUrl: 'https://www.chanelmission1o5.com/' },
  { name: 'Prada', aliases: ['prada'], parent: 'Prada Group', segment: 'luxury', country: 'Italy', recognition: 'high', knownFor: 'Ready-to-wear and leather', fti: null, reportUrl: 'https://www.pradagroup.com/en/sustainability.html' },
  { name: 'Miu Miu', aliases: ['miu miu', 'miumiu'], parent: 'Prada Group', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Ready-to-wear', fti: null, reportUrl: 'https://www.pradagroup.com/en/sustainability.html' },
  { name: 'Burberry', aliases: ['burberry'], parent: 'Burberry Group plc', segment: 'luxury', country: 'United Kingdom', recognition: 'high', knownFor: 'Trench coats and check', fti: null, reportUrl: 'https://www.burberryplc.com/en/responsibility.html' },
  { name: 'Moncler', aliases: ['moncler'], parent: 'Moncler Group', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Down outerwear', fti: null, reportUrl: 'https://www.monclergroup.com/en/sustainability' },
  { name: 'Ralph Lauren', aliases: ['ralph lauren', 'polo', 'polo ralph lauren'], parent: 'Ralph Lauren Corporation', segment: 'luxury', country: 'United States', recognition: 'high', knownFor: 'Preppy ready-to-wear', fti: null, reportUrl: 'https://corporate.ralphlauren.com/citizenship-sustainability' },

  // ---- Fast fashion (Inditex) -------------------------------------------
  { name: 'Zara', aliases: ['zara'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'high', knownFor: 'Fast fashion apparel', fti: null, reportUrl: 'https://www.inditex.com/itxcomweb/en/sustainability' },
  { name: 'Pull&Bear', aliases: ['pull&bear', 'pull and bear', 'pullandbear', 'pull bear'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'medium', knownFor: 'Youth fast fashion', fti: null, reportUrl: 'https://www.inditex.com/itxcomweb/en/sustainability' },
  { name: 'Bershka', aliases: ['bershka'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'medium', knownFor: 'Youth fast fashion', fti: null, reportUrl: 'https://www.inditex.com/itxcomweb/en/sustainability' },

  // ---- Fast fashion (H&M Group) -----------------------------------------
  { name: 'H&M', aliases: ['h&m', 'hm', 'h and m', 'hennes'], parent: 'H&M Group', segment: 'fastfashion', country: 'Sweden', recognition: 'high', knownFor: 'High-street fast fashion', fti: 71, ftiNote: 'Among the top-scoring brands in FTI 2023, one of the highest for a high-volume producer.', reportUrl: 'https://hmgroup.com/sustainability/' },
  { name: 'COS', aliases: ['cos'], parent: 'H&M Group', segment: 'fastfashion', country: 'Sweden', recognition: 'medium', knownFor: 'Minimal contemporary basics', fti: null, reportUrl: 'https://hmgroup.com/sustainability/' },

  // ---- Fast fashion / basics (Fast Retailing) ---------------------------
  { name: 'Uniqlo', aliases: ['uniqlo'], parent: 'Fast Retailing', segment: 'basics', country: 'Japan', recognition: 'high', knownFor: 'Everyday basics', fti: null, reportUrl: 'https://www.fastretailing.com/eng/sustainability/' },
  { name: 'GU', aliases: ['gu'], parent: 'Fast Retailing', segment: 'basics', country: 'Japan', recognition: 'medium', knownFor: 'Value basics', fti: null, reportUrl: 'https://www.fastretailing.com/eng/sustainability/' },

  // ---- Ultra-fast / marketplace -----------------------------------------
  { name: 'Shein', aliases: ['shein'], parent: 'Roadget Business / Shein Group', segment: 'fastfashion', country: 'Singapore / China', recognition: 'high', knownFor: 'Ultra-fast online fashion', fti: null, reportUrl: 'https://www.sheingroup.com/sustainability/' },
  { name: 'Temu', aliases: ['temu'], parent: 'PDD Holdings', segment: 'online', country: 'China', recognition: 'high', knownFor: 'Ultra-discount marketplace', fti: null, ftiScope: 'outside', ftiNote: 'Not assessed by the Fashion Transparency Index. The marketplace launched in 2022, outside the 2023 brand set.', reportUrl: null },

  // ---- Fast fashion / value (Europe) ------------------------------------
  { name: 'Primark', aliases: ['primark'], parent: 'Associated British Foods', segment: 'fastfashion', country: 'Ireland', recognition: 'high', knownFor: 'Ultra-low-price high street', fti: null, reportUrl: 'https://www.primark.com/en-gb/sustainability' },
  { name: 'Boohoo', aliases: ['boohoo'], parent: 'Boohoo Group plc', segment: 'online', country: 'United Kingdom', recognition: 'medium', knownFor: 'Online fast fashion', fti: null, reportUrl: 'https://www.boohooplc.com/sustainability' },
  { name: 'ASOS', aliases: ['asos'], parent: 'ASOS plc', segment: 'online', country: 'United Kingdom', recognition: 'high', knownFor: 'Online fashion retailer', fti: null, reportUrl: 'https://www.asosplc.com/fashion-with-integrity/' },
  { name: 'Zalando', aliases: ['zalando'], parent: 'Zalando SE', segment: 'online', country: 'Germany', recognition: 'medium', knownFor: 'Online fashion platform', fti: null, reportUrl: 'https://corporate.zalando.com/en/sustainability' },
  { name: 'Next', aliases: ['next'], parent: 'Next plc', segment: 'department', country: 'United Kingdom', recognition: 'medium', knownFor: 'High-street and online retail', fti: null, reportUrl: 'https://www.nextplc.co.uk/corporate-responsibility' },

  // ---- Denim & Americana ------------------------------------------------
  { name: 'Levi Strauss', aliases: ['levi', 'levis', "levi's", 'levi strauss'], parent: 'Levi Strauss & Co.', segment: 'denim', country: 'United States', recognition: 'high', knownFor: 'Denim jeans', fti: null, reportUrl: 'https://www.levistrauss.com/sustainability/' },
  { name: 'Gap', aliases: ['gap'], parent: 'Gap Inc.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Casual basics and denim', fti: null, reportUrl: 'https://www.gapinc.com/en-us/values/sustainability' },

  // ---- PVH --------------------------------------------------------------
  { name: 'Calvin Klein', aliases: ['calvin klein', 'ck'], parent: 'PVH Corp.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Underwear, denim, ready-to-wear', fti: null, reportUrl: 'https://www.pvh.com/responsibility' },
  { name: 'Tommy Hilfiger', aliases: ['tommy hilfiger', 'tommy'], parent: 'PVH Corp.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Preppy casualwear', fti: null, reportUrl: 'https://www.pvh.com/responsibility' },

  // ---- VF Corporation ---------------------------------------------------
  { name: 'The North Face', aliases: ['the north face', 'north face', 'tnf'], parent: 'VF Corporation', segment: 'outdoor', country: 'United States', recognition: 'high', knownFor: 'Outdoor and technical wear', fti: 66, ftiNote: 'Among the top scorers in FTI 2023; disclosures run through parent VF Corporation.', reportUrl: 'https://www.vfc.com/our-impact' },
  { name: 'Vans', aliases: ['vans'], parent: 'VF Corporation', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Skate and lifestyle footwear', fti: 65, ftiNote: 'Among the top scorers in FTI 2023; disclosures run through parent VF Corporation.', reportUrl: 'https://www.vfc.com/our-impact' },
  { name: 'Timberland', aliases: ['timberland'], parent: 'VF Corporation', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Boots and outdoor footwear', fti: 66, ftiNote: 'Among the top scorers in FTI 2023; disclosures run through parent VF Corporation.', reportUrl: 'https://www.vfc.com/our-impact' },

  // ---- Outdoor (independent) --------------------------------------------
  { name: 'Patagonia', aliases: ['patagonia'], parent: 'Patagonia, Inc. (Holdfast Collective)', segment: 'outdoor', country: 'United States', recognition: 'high', knownFor: 'Outdoor apparel and activism', fti: null, reportUrl: 'https://www.patagonia.com/our-footprint/' },

  // ---- Tapestry ---------------------------------------------------------
  { name: 'Coach', aliases: ['coach'], parent: 'Tapestry, Inc.', segment: 'luxury', country: 'United States', recognition: 'high', knownFor: 'Leather goods', fti: null, reportUrl: 'https://www.tapestry.com/responsibility/' },
  { name: 'Kate Spade', aliases: ['kate spade', 'katespade'], parent: 'Tapestry, Inc.', segment: 'luxury', country: 'United States', recognition: 'medium', knownFor: 'Accessories and ready-to-wear', fti: null, reportUrl: 'https://www.tapestry.com/responsibility/' },

  // ---- Off-price / department -------------------------------------------
  { name: 'TK Maxx', aliases: ['tk maxx', 'tkmaxx', 'tj maxx', 'tjmaxx', 'tjx'], parent: 'TJX Companies', segment: 'department', country: 'United States', recognition: 'high', knownFor: 'Off-price apparel retail', fti: null, reportUrl: 'https://www.tjx.com/responsibility' },
  { name: 'Ross Stores', aliases: ['ross', 'ross stores', 'ross dress for less'], parent: 'Ross Stores, Inc.', segment: 'department', country: 'United States', recognition: 'medium', knownFor: 'Off-price apparel retail', fti: null, reportUrl: 'https://corp.rossstores.com/corporate-responsibility/' },
  { name: 'JD Sports', aliases: ['jd sports', 'jd'], parent: 'JD Sports Fashion plc', segment: 'sportswear', country: 'United Kingdom', recognition: 'medium', knownFor: 'Sportswear retail', fti: null, reportUrl: 'https://www.jdplc.com/sustainability' },

  // ---- Australian-relevant ----------------------------------------------
  { name: 'Kmart Australia', aliases: ['kmart', 'kmart australia'], parent: 'Wesfarmers', group: 'Wesfarmers (Kmart Group)', segment: 'department', country: 'Australia', au: true, recognition: 'high', knownFor: 'Value apparel and homewares', fti: 76, ftiNote: 'Tied 3rd of 250 brands in FTI 2023. A separate company from US Kmart.', reportUrl: 'https://www.wesfarmers.com.au/sustainability' },
  { name: 'Target Australia', aliases: ['target', 'target australia'], parent: 'Wesfarmers', group: 'Wesfarmers (Kmart Group)', segment: 'department', country: 'Australia', au: true, recognition: 'high', knownFor: 'Value apparel and homewares', fti: 76, ftiNote: 'Tied 3rd of 250 brands in FTI 2023. A separate company from US Target.', reportUrl: 'https://www.wesfarmers.com.au/sustainability' },
  { name: 'Big W', aliases: ['big w', 'bigw'], parent: 'Woolworths Group', segment: 'department', country: 'Australia', au: true, recognition: 'high', knownFor: 'Value apparel and general merchandise', fti: null, reportUrl: 'https://www.woolworthsgroup.com.au/au/en/sustainability.html' },
  { name: 'Cotton On', aliases: ['cotton on', 'cottonon'], parent: 'Cotton On Group', segment: 'fastfashion', country: 'Australia', au: true, recognition: 'high', knownFor: 'Value fashion basics', fti: null, reportUrl: 'https://cottonon.com/AU/good-business/' },
  { name: 'Country Road', aliases: ['country road'], parent: 'Country Road Group', group: 'Country Road Group (Woolworths Holdings, South Africa)', segment: 'department', country: 'Australia', au: true, recognition: 'high', knownFor: 'Mid-market apparel and lifestyle', fti: null, reportUrl: 'https://www.countryroad.com.au/sustainability' },
  { name: 'The Iconic', aliases: ['the iconic', 'iconic'], parent: 'Global Fashion Group', segment: 'online', country: 'Australia', au: true, recognition: 'high', knownFor: 'Online fashion retailer', fti: null, ftiScope: 'outside', ftiNote: 'Not assessed by the Fashion Transparency Index. It is a multi-brand marketplace, not a single label.', reportUrl: 'https://www.theiconic.com.au/considered/' },
];

// ---------------------------------------------------------------------------
// buildBrand — expands a raw entry into the full record the UI reads. Every
// disclosure field the raw data does not assert defaults to 'needs-research'
// so the page never claims a status it cannot back up.
// ---------------------------------------------------------------------------
function slug(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildBrand(raw) {
  const band = ftiBand(raw.fti);
  return {
    id: slug(raw.name),
    name: raw.name,
    mono: deriveMonogram(raw.name),
    aliases: raw.aliases || [],
    parent: raw.parent,
    group: raw.group || raw.parent,
    segment: raw.segment,
    segmentLabel: (SEGMENTS.find((s) => s.id === raw.segment) || {}).label || raw.segment,
    country: raw.country,
    au: !!raw.au,
    recognition: raw.recognition || 'medium',
    knownFor: raw.knownFor || '',
    fti: raw.fti ?? null,
    ftiBand: band,
    ftiNote: raw.ftiNote || '',
    // 'scored' = a verified FTI number; 'outside' = confirmed not assessed by
    // FTI; 'research' = in scope but the exact figure is still unverified.
    ftiScope: raw.ftiScope || (raw.fti != null ? 'scored' : 'research'),
    reportUrl: raw.reportUrl || null,
    // Per-field disclosure statuses. These are the research surface: filled in
    // over time from the CSV tracker, never invented here.
    signals: {
      climateTarget: raw.climateTarget || STATUS.research.id,
      scope12: raw.scope12 || STATUS.research.id,
      scope3: raw.scope3 || STATUS.research.id,
      materials: raw.materials || STATUS.research.id,
      supplyChain: raw.supplyChain || STATUS.research.id,
      circularity: raw.circularity || STATUS.research.id,
    },
    notes: raw.notes || '',
    needsResearch: raw.fti == null && raw.ftiScope !== 'outside',
  };
}

export const BRANDS = RAW_BRANDS.map(buildBrand).sort((a, b) => a.name.localeCompare(b.name));

// Quick index helpers ------------------------------------------------------
export const BRAND_BY_ID = Object.fromEntries(BRANDS.map((b) => [b.id, b]));

// Corporate groups: how many recognisable brands each parent quietly owns.
// Real, and one of the most useful things a shopper does not know.
export function groupFamily(parentName) {
  return BRANDS.filter((b) => b.parent === parentName || b.group === parentName);
}

// Every parent, with the brands it owns on file. The group lens is built on
// this: ownership concentration is one of the least-understood facts in
// fashion, and the whole "read the parent, not the brand" thesis lives here.
export const GROUPS = (() => {
  const map = new Map();
  for (const b of BRANDS) {
    if (!map.has(b.parent)) map.set(b.parent, []);
    map.get(b.parent).push(b);
  }
  return [...map.entries()]
    .map(([parent, brands]) => {
      const scored = brands.filter((b) => b.fti != null);
      const avg = scored.length
        ? Math.round(scored.reduce((n, b) => n + b.fti, 0) / scored.length)
        : null;
      return { parent, brands, count: brands.length, scored, avg };
    })
    .sort((a, b) => b.count - a.count || a.parent.localeCompare(b.parent));
})();

// Parents that own more than one brand on file, for the directory group view.
export const MULTI_GROUPS = GROUPS.filter((g) => g.count > 1);

export function segmentCount(id) {
  return BRANDS.filter((b) => b.segment === id).length;
}

// The signal fields shown, in display order, with their human labels.
export const SIGNAL_FIELDS = [
  { id: 'transparency', label: 'Transparency Index', help: 'Fashion Revolution FTI 2023 disclosure score.' },
  { id: 'climateTarget', label: 'Climate target', help: 'A public, dated emissions-reduction target.' },
  { id: 'scope12', label: 'Scope 1 & 2', help: 'Own-operations and purchased-energy emissions.' },
  { id: 'scope3', label: 'Scope 3', help: 'Supply-chain emissions, usually the bulk of the total.' },
  { id: 'materials', label: 'Materials', help: 'What fibres and materials the brand reports using.' },
  { id: 'supplyChain', label: 'Supplier list', help: 'A published list of manufacturing facilities.' },
  { id: 'circularity', label: 'Circularity', help: 'Repair, resale, take-back or recycling programmes.' },
];

// ---------------------------------------------------------------------------
// Editorial copy. Australian English, plain, active. No em dashes.
// ---------------------------------------------------------------------------
export const COPY = {
  brand: 'OPENWEAVE',
  strap: 'Fashion brand transparency, in plain English',
  byline: 'A working tool by Christopher Wang',
  backLabel: 'itschriswang.com',
  backHref: 'https://itschriswang.com/',

  hero: {
    kicker: 'Fashion brand transparency',
    headA: 'Look up the brands',
    headB: 'you actually wear',
    stand: 'Before you buy, see what a fashion brand is willing to tell you. Search any major label to find who really owns it, how much it discloses, and what still needs checking. Openweave tracks transparency, not virtue. A brand can disclose a lot and still weigh heavily on the world.',
    searchLabel: 'Search a fashion brand',
    searchPlaceholder: 'Try Nike, Zara, Gucci, Kmart, Uniqlo…',
    examplesLabel: 'Popular lookups',
    examples: ['Nike', 'Zara', 'Uniqlo', 'Gucci', 'The North Face', 'Kmart Australia'],
    countTemplate: '{n} brands and companies tracked',
    kbdHint: 'Press / to search from anywhere',
    recentLabel: 'Recently viewed',
  },

  lookup: {
    idx: '01',
    title: 'Brand lookup',
    sub: 'Search a label, read its tag',
    lede: 'Type a brand you recognise. You get its corporate parent, its market segment, and a plain reading of what it discloses. Where a figure has not been verified yet, it says so.',
    emptyTitle: 'Search or pick a brand',
    emptyBody: 'Start typing above, or choose one of the popular lookups. Every result shows what is known and what still needs research.',
    notFoundTitle: 'Not in the tracker yet',
    notFoundBody: 'We could not match that to a brand on file. It may be spelled differently, sold under a parent company, or simply not added yet. Add it to the research backlog below.',
    parentLabel: 'Parent company',
    segmentLabel: 'Segment',
    hqLabel: 'Headquarters',
    familyLabel: 'Sister brands in this group',
    familyHint: 'The same owner reports for all of these. Tap to switch.',
    reportLabel: 'Sustainability report',
    reportMissing: 'No public report page on file',
    compareAdd: 'Add to compare',
    compareRemove: 'In compare',
    shareLabel: 'Copy link',
    shareDone: 'Link copied',
    researchTag: 'Needs research',
  },

  compare: {
    idx: '02',
    title: 'Compare',
    sub: 'Two or three, signal by signal',
    lede: 'Line brands up in one table to see exactly where their disclosure differs. Add up to three from any lookup or from the directory.',
    empty: 'Add brands from the lookup above, or from the directory, to compare them here.',
    clear: 'Clear all',
    brandCol: 'Signal',
  },

  directory: {
    idx: '03',
    title: 'The directory',
    sub: 'Every brand, and every owner',
    lede: 'The full universe of tracked companies. Filter by segment, narrow by hand, sort by what matters, then tap any tag to pull it into the lookup. Switch to Groups to see who owns whom.',
    filterAll: 'All segments',
    auOnly: 'Australian',
    filterPlaceholder: 'Filter by name…',
    viewBrands: 'Brands',
    viewGroups: 'Groups',
    scored: 'Scored only',
    sort: {
      name: 'A to Z',
      fti: 'Transparency score',
      recognition: 'Best known',
      segment: 'By segment',
    },
    sortLabel: 'Sort',
    resultTemplate: '{n} shown',
    groupsLede: 'Ten owners hold most of the brands on this page. This is the fact the label never tells you. Tap a brand to open it.',
    groupBrandsTemplate: '{n} brands on file',
    groupAvgLabel: 'Mean FTI of scored brands',
  },

  signals: {
    idx: '04',
    title: 'What the signals mean',
    sub: 'Disclosure is not the same as doing well',
    lede: 'Openweave measures what a brand tells the public, not whether the brand is good. Read these before you draw a conclusion.',
    cards: [
      {
        h: 'Transparency is not performance',
        b: 'A high Fashion Transparency Index score means a brand publishes a lot: policies, supplier lists, audit results. It does not mean the brand has a small footprint. Some of the most transparent brands are also some of the largest producers. Disclosure is the price of being checkable, not proof of being clean.',
      },
      {
        h: 'The parent company matters',
        b: 'The label on the garment is rarely the company making the decisions. Gucci reports through Kering. Uniqlo reports through Fast Retailing. The North Face, Vans and Timberland all sit inside VF Corporation. If you want the real climate targets and supplier data, you often have to read the parent, not the brand.',
      },
      {
        h: 'Scope 3 is where the weight sits',
        b: 'For almost every fashion company, the large majority of emissions are Scope 3: the farms, mills, dye houses and factories in the supply chain, not the head office. A brand that reports Scope 1 and 2 but stays quiet on Scope 3 is disclosing the small part and leaving out the big one.',
      },
      {
        h: 'We label, we do not rank',
        b: 'You will see Disclosed, Not found, Parent-level only, and Needs research. You will not see "good", "bad", "ethical" or "sustainable" attached to a brand, because those words hide the working. This tool tracks what can be found publicly, and hands you the sources to judge for yourself.',
      },
    ],
    disclaimer: 'Transparency is not the same as performance. A brand can disclose a lot and still have significant impacts. This tool tracks what can be found publicly, not a moral ranking.',
  },

  backlog: {
    idx: '05',
    title: 'Research backlog',
    sub: 'What still needs a human',
    lede: 'This tool is honest about its gaps. Structural facts, parent, segment, headquarters, are verified. Quantified disclosure fields are being filled in over time. Anything marked "Needs research" below is waiting for a checked source.',
    fileNote: 'The editable tracker lives in the repository at',
    filePath: 'public/data/fashion-brands.csv',
    fileHref: 'https://github.com/itschriswang/portfolio/blob/main/public/data/fashion-brands.csv',
    howTo: 'Fill a cell with a sourced value and note the source in the notes column. The page reads its dataset from src/fashion/data.js, so mirror confirmed values there to make them live.',
    countTemplate: '{n} brands still need a verified transparency score',
    fieldCountTemplate: '{n} disclosure fields awaiting a source',
  },

  footer: {
    method: 'Method: brand ownership from corporate filings and official brand pages. The transparency score is the Fashion Transparency Index 2023 from Fashion Revolution, which rates public disclosure only. Per-field disclosure statuses are tracked in the repository and marked "Needs research" until a source is confirmed. Nothing here is assured reporting, a product footprint, or advice about a real brand.',
    sourcesLabel: 'Sources',
    made: 'Built by Christopher Wang in Melbourne.',
    top: 'Back to the top',
  },

  // Section rail: label + target id, in scroll order.
  rail: [
    { label: 'Lookup', id: 'lookup' },
    { label: 'Compare', id: 'compare' },
    { label: 'Directory', id: 'directory' },
    { label: 'Signals', id: 'signals' },
    { label: 'Backlog', id: 'backlog' },
  ],
};

// ---------------------------------------------------------------------------
// Sources actually used to assemble the dataset. Shown in the footer.
// ---------------------------------------------------------------------------
export const SOURCES = [
  { label: 'Fashion Revolution · Fashion Transparency Index 2023', url: 'https://www.fashionrevolution.org/about/transparency/' },
  { label: 'Fashion Revolution · What Fuels Fashion 2024', url: 'https://www.fashionrevolution.org/what-fuels-fashion/' },
  { label: 'LVMH · Environment and social commitments', url: 'https://www.lvmh.com/en/our-commitments' },
  { label: 'Kering · Sustainability', url: 'https://www.kering.com/en/sustainability/' },
  { label: 'Inditex · Sustainability', url: 'https://www.inditex.com/itxcomweb/en/sustainability' },
  { label: 'H&M Group · Sustainability', url: 'https://hmgroup.com/sustainability/' },
  { label: 'Fast Retailing · Sustainability', url: 'https://www.fastretailing.com/eng/sustainability/' },
  { label: 'VF Corporation · Our Impact', url: 'https://www.vfc.com/our-impact' },
];
