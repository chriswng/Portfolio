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
  { name: 'R.M. Williams', aliases: ['rm williams', 'r.m. williams', 'rmwilliams'], parent: 'Tattarang', group: 'Tattarang (Andrew and Nicola Forrest)', segment: 'footwear', country: 'Australia', au: true, recognition: 'high', knownFor: 'Heritage leather boots', fti: null, reportUrl: null, notes: 'Certified B Corporation (2024). Australian-owned since Tattarang acquired it in 2020.' },
  { name: 'Zimmermann', aliases: ['zimmermann', 'zimmerman'], parent: 'Advent International', group: 'Advent International (majority, with the Zimmermann family)', segment: 'luxury', country: 'Australia', au: true, recognition: 'high', knownFor: 'Resort and occasion wear', fti: null, reportUrl: null, notes: 'Majority sold to private-equity firm Advent International in 2023.' },
  { name: 'Camilla', aliases: ['camilla', 'camilla franks'], parent: 'Camilla (private)', segment: 'luxury', country: 'Australia', au: true, recognition: 'medium', knownFor: 'Prints and resort wear', fti: null, reportUrl: null, notes: 'Certified B Corporation (2024).' },
  { name: 'Lorna Jane', aliases: ['lorna jane'], parent: 'Lorna Jane (private)', segment: 'sportswear', country: 'Australia', au: true, recognition: 'medium', knownFor: 'Womenswear activewear', fti: null, reportUrl: null },
  { name: 'Bonds', aliases: ['bonds'], parent: 'Hanesbrands', group: 'Hanesbrands (acquired by Gildan, 2025)', segment: 'basics', country: 'Australia', au: true, recognition: 'high', knownFor: 'Underwear and basics', fti: null, reportUrl: null },
];

// ---------------------------------------------------------------------------
// buildBrand — expands a raw entry into the full record the UI reads. Every
// disclosure field the raw data does not assert defaults to 'needs-research'
// so the page never claims a status it cannot back up.
// ---------------------------------------------------------------------------
function slug(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---------------------------------------------------------------------------
// Commitments and memberships. Real, verifiable industry facts, not our own
// judgement. These are membership signals, not performance: a company can sign
// a pact and still move slowly. We only mark what a source confirms.
//   The Fashion Pact: CEO-led coalition on climate, biodiversity and oceans.
//     Signatory list per thefashionpact.org and 2019 founding coverage.
//     LVMH is notably NOT a signatory. Hermès signed then left in 2023.
//   Certified B Corporation: independently verified social/environmental
//     performance standard (B Lab). In this set: Patagonia, and the Australian
//     labels R.M. Williams and Camilla.
// ---------------------------------------------------------------------------
const FASHION_PACT_IDS = new Set([
  'adidas', 'nike', 'puma', 'burberry', 'chanel', 'moncler', 'prada', 'miu-miu',
  'ralph-lauren', 'gucci', 'saint-laurent', 'balenciaga', 'bottega-veneta',
  'zara', 'pullandbear', 'bershka', 'handm', 'cos', 'gap', 'calvin-klein',
  'tommy-hilfiger', 'coach', 'kate-spade',
]);
const FASHION_PACT_FORMER = new Set(['herm-s']); // slug('Hermès') === 'herm-s'
const B_CORP_IDS = new Set(['patagonia', 'r-m-williams', 'camilla']);

// Science Based Targets initiative status, read from the SBTi "Companies
// Taking Action" export. Every id below has a near-term target with SBTi
// status "Targets set" (validated). Split by whether the validated entity is
// the brand's own company ('brand') or its corporate parent/group ('parent'),
// so the climate-target signal can be honest about the level. Parents not in
// the SBTi dataset (Wesfarmers, ABF, TJX, Ross, Cotton On, Boohoo, Tattarang,
// PDD) are absent and stay "Needs research".
const SBTI_BRAND = new Set([
  'nike', 'adidas', 'puma', 'asics', 'new-balance', 'under-armour', 'lululemon',
  'herm-s', 'chanel', 'burberry', 'moncler', 'ralph-lauren', 'levi-strauss', 'gap',
  'patagonia', 'asos', 'zalando', 'next', 'jd-sports', 'zimmermann', 'handm',
]);
const SBTI_PARENT = new Set([
  'louis-vuitton', 'dior', 'loewe', 'fendi', 'celine', 'gucci', 'saint-laurent',
  'balenciaga', 'bottega-veneta', 'zara', 'pullandbear', 'bershka', 'uniqlo', 'gu',
  'cos', 'calvin-klein', 'tommy-hilfiger', 'the-north-face', 'vans', 'timberland',
  'coach', 'kate-spade', 'prada', 'miu-miu', 'bonds', 'big-w', 'country-road',
  'the-iconic', 'shein',
]);
function sbtiLevelFor(id) {
  if (SBTI_BRAND.has(id)) return 'brand';
  if (SBTI_PARENT.has(id)) return 'parent';
  return null;
}

function commitmentsFor(id) {
  const fashionPact = FASHION_PACT_IDS.has(id) ? 'yes' : (FASHION_PACT_FORMER.has(id) ? 'former' : 'no');
  return { fashionPact, bCorp: B_CORP_IDS.has(id), sbti: sbtiLevelFor(id) };
}

// The date the structural facts (ownership, provenance, memberships) were last
// checked. Shown as a freshness stamp: the one thing no competitor exposes.
export const VERIFIED_AS_OF = 'July 2026';

// ---------------------------------------------------------------------------
// Ownership provenance. The white space in this whole category: every rival
// tool rates a brand as an island. Who actually owns it, who owned it before,
// and whether the owner is a listed company or a private-equity firm is often
// the most decision-relevant fact, and the hardest to find. Verifiable facts
// only; brands without a confirmed note simply do not show this line.
// ---------------------------------------------------------------------------
const PROVENANCE = {
  gucci: 'Italian house, part of French group Kering since 1999.',
  'saint-laurent': 'French house, part of Kering since 1999.',
  balenciaga: 'Spanish-founded house, acquired by Kering in 2001.',
  'bottega-veneta': 'Italian house, acquired by Kering in 2001.',
  'louis-vuitton': 'The founding house of French group LVMH.',
  dior: 'French house, brought under the LVMH umbrella; Christian Dior SE is the Arnault family holding.',
  loewe: 'Spanish house, owned by LVMH since 1996.',
  fendi: 'Italian house, LVMH-controlled since 2001.',
  celine: 'French house, owned by LVMH.',
  'miu-miu': 'Sister label to Prada within the Prada Group.',
  moncler: 'Italian brand; acquired Stone Island in 2021.',
  'the-north-face': 'Part of US group VF Corporation.',
  vans: 'Part of US group VF Corporation.',
  timberland: 'Part of US group VF Corporation.',
  'calvin-klein': 'Owned by US group PVH Corp.',
  'tommy-hilfiger': 'Owned by US group PVH Corp.',
  coach: 'Part of US group Tapestry.',
  'kate-spade': 'Acquired by Tapestry in 2017.',
  gap: 'US group; also owns Old Navy, Banana Republic and Athleta.',
  boohoo: 'UK group that also owns PrettyLittleThing, Nasty Gal and Debenhams.',
  shein: 'Founded in China in 2012; now headquartered in Singapore.',
  temu: 'Owned by PDD Holdings, the group behind China’s Pinduoduo.',
  'kmart-australia': 'Owned by ASX-listed Wesfarmers. A separate company from US Kmart.',
  'target-australia': 'Owned by ASX-listed Wesfarmers. A separate company from US Target.',
  'country-road': 'Owned by Country Road Group, part of South Africa’s Woolworths Holdings, unrelated to Australian Woolworths.',
  'the-iconic': 'Owned by Global Fashion Group, a Berlin-listed e-commerce group.',
  zimmermann: 'Founded 1991 in Sydney; private-equity firm Advent International took a majority stake in 2023.',
  bonds: 'Australian icon founded 1915; owned by US-based Hanesbrands, which Gildan agreed to acquire in 2025.',
  'r-m-williams': 'Founded 1932 in South Australia; passed through L Catterton before Tattarang, the Forrests’ private group, bought it in 2020.',
  patagonia: 'Founder Yvon Chouinard transferred ownership to the Holdfast Collective and a purpose trust in 2022.',
};

// ---------------------------------------------------------------------------
// Fashion Transparency Index 2023 scores, read directly from the published
// report's "Final Scores" table (Fashion Revolution, 2023 edition; 250 brands
// ranked by score out of 250, shown as a rounded-up percentage). These are the
// authoritative figures, keyed by our brand id. Brands Fashion Revolution did
// not score individually are absent here and stay "Needs research". A handful
// of raw entries carry the score inline already (with richer notes); those
// take precedence, so they are not repeated here.
// ---------------------------------------------------------------------------
const FTI_2023 = {
  nike: 50, adidas: 56, puma: 66, asics: 45, 'new-balance': 46, 'under-armour': 28,
  lululemon: 52, 'louis-vuitton': 29, dior: 29, fendi: 58, celine: 30,
  'saint-laurent': 51, balenciaga: 51, 'bottega-veneta': 51, 'herm-s': 28,
  chanel: 11, prada: 34, 'miu-miu': 34, burberry: 38, moncler: 27, 'ralph-lauren': 54,
  zara: 50, pullandbear: 50, bershka: 50, uniqlo: 51, gu: 51, shein: 7, primark: 40,
  boohoo: 14, asos: 50, zalando: 40, next: 36, 'levi-strauss': 60, gap: 48,
  'calvin-klein': 48, 'tommy-hilfiger': 50, patagonia: 40, coach: 42, 'kate-spade': 41,
  'jd-sports': 29, 'big-w': 39, 'cotton-on': 22, 'tk-maxx': 13, 'ross-stores': 6,
};
// Score-specific context where the FTI listing name differs from ours.
const FTI_2023_NOTE = {
  'tk-maxx': 'Fashion Transparency Index 2023. FTI listed the TJX banner as "TJ Maxx"; TK Maxx is the same company.',
  'ross-stores': 'Fashion Transparency Index 2023, scored under its "Ross Dress for Less" banner.',
};

function buildBrand(raw) {
  const id = slug(raw.name);
  const fti = raw.fti != null ? raw.fti : (FTI_2023[id] != null ? FTI_2023[id] : null);
  const band = ftiBand(fti);
  const ftiNote = raw.ftiNote || FTI_2023_NOTE[id]
    || (FTI_2023[id] != null ? 'Fashion Transparency Index 2023, published by Fashion Revolution.' : '');
  return {
    id,
    name: raw.name,
    aliases: raw.aliases || [],
    parent: raw.parent,
    group: raw.group || raw.parent,
    segment: raw.segment,
    segmentLabel: (SEGMENTS.find((s) => s.id === raw.segment) || {}).label || raw.segment,
    country: raw.country,
    au: !!raw.au,
    recognition: raw.recognition || 'medium',
    knownFor: raw.knownFor || '',
    fti,
    ftiBand: band,
    ftiNote,
    // 'scored' = a verified FTI number; 'outside' = confirmed not assessed by
    // FTI; 'research' = in scope but the exact figure is still unverified.
    ftiScope: raw.ftiScope || (fti != null ? 'scored' : 'research'),
    reportUrl: raw.reportUrl || null,
    // Per-field disclosure statuses. These are the research surface: filled in
    // over time from the CSV tracker, never invented here.
    signals: {
      // A validated SBTi near-term target is a public, dated emissions target.
      // Brand-level validation reads as disclosed; group-level as parent-only.
      climateTarget: raw.climateTarget
        || (sbtiLevelFor(id) === 'brand' ? STATUS.disclosed.id
          : sbtiLevelFor(id) === 'parent' ? STATUS.parent.id
            : STATUS.research.id),
      scope12: raw.scope12 || STATUS.research.id,
      scope3: raw.scope3 || STATUS.research.id,
      materials: raw.materials || STATUS.research.id,
      supplyChain: raw.supplyChain || STATUS.research.id,
      circularity: raw.circularity || STATUS.research.id,
    },
    commitments: commitmentsFor(id),
    provenance: PROVENANCE[id] || raw.provenance || '',
    notes: raw.notes || '',
    needsResearch: fti == null && raw.ftiScope !== 'outside',
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

// Display metadata for the commitment badges on a brand card.
export const COMMITMENT_INFO = {
  fashionPact: {
    label: 'The Fashion Pact', former: 'Left the Fashion Pact',
    help: 'Signed the CEO-led coalition on climate, biodiversity and oceans. A commitment, not a result.',
    url: 'https://www.thefashionpact.org/',
  },
  bCorp: {
    label: 'Certified B Corp',
    help: 'Independently verified social and environmental performance, certified by B Lab.',
    url: 'https://www.bcorporation.net/',
  },
  sbti: {
    label: 'SBTi near-term target',
    parentLabel: 'SBTi target · group',
    help: 'Has a near-term emissions target validated by the Science Based Targets initiative.',
    parentHelp: 'The corporate parent has an SBTi-validated near-term target; brand-level detail may differ.',
    url: 'https://sciencebasedtargets.org/target-dashboard',
  },
};

export function commitmentCounts() {
  return {
    fashionPact: BRANDS.filter((b) => b.commitments.fashionPact === 'yes').length,
    bCorp: BRANDS.filter((b) => b.commitments.bCorp).length,
    sbti: BRANDS.filter((b) => b.commitments.sbti).length,
  };
}

// ---------------------------------------------------------------------------
// Materials guide. Fibre-level context for the "before you buy" job. Plain,
// honest, and deliberately careful: single "sustainability" rankings of fibres
// (notably the Higg Materials Sustainability Index) are contested. The Higg MSI
// scored synthetics well partly because it left out microplastic and ocean
// pollution, and its consumer-facing use was paused in 2022 after challenges
// from regulators in Norway and the Netherlands. So this names the trade-offs
// rather than crowning a winner. Impact notes are directional, from published
// LCA literature, not a measurement of any one garment.
// ---------------------------------------------------------------------------
export const FIBRES = [
  { name: 'Conventional cotton', kind: 'Natural', good: 'Breathable, durable, biodegradable.', watch: 'Thirsty crop; heavy irrigation and pesticide use where rain-fed farming is not used.' },
  { name: 'Organic cotton', kind: 'Natural', good: 'Grown without synthetic pesticides; look for GOTS certification.', watch: 'Still water-intensive; certification covers the field, not the dye house.' },
  { name: 'Linen', kind: 'Natural', good: 'Flax needs little water or pesticide; long-lasting and biodegradable.', watch: 'Creases readily; some processing uses chemical retting.' },
  { name: 'Hemp', kind: 'Natural', good: 'Low water and input; improves soil and lasts for years.', watch: 'Coarser hand feel; softer blends can add synthetics.' },
  { name: 'Wool', kind: 'Natural', good: 'Warm, long-lived, biodegradable, needs fewer washes.', watch: 'Higher on-farm emissions (methane); mulesing and animal-welfare questions.' },
  { name: 'Polyester', kind: 'Synthetic', good: 'Cheap, strong, low water to make; recyclable in theory.', watch: 'Fossil-derived; sheds microplastics in the wash and effectively never breaks down.' },
  { name: 'Recycled polyester (rPET)', kind: 'Synthetic', good: 'Roughly half the carbon of virgin polyester; look for GRS certification.', watch: 'Still sheds microplastics; mostly made from bottles, not old clothes, and recycles once.' },
  { name: 'Nylon', kind: 'Synthetic', good: 'Strong and elastic; recycled versions (e.g. ECONYL) exist.', watch: 'Fossil-derived, energy-intensive, sheds microplastics.' },
  { name: 'Viscose / rayon', kind: 'Regenerated', good: 'Soft, breathable, plant-derived from wood pulp.', watch: 'Can drive deforestation and use harsh solvents unless responsibly sourced.' },
  { name: 'Lyocell (Tencel)', kind: 'Regenerated', good: 'Wood pulp spun in a closed-loop solvent system; look for FSC pulp.', watch: 'Genuinely lower-impact only when the pulp is responsibly sourced.' },
  { name: 'Leather', kind: 'Animal', good: 'Durable and repairable; ages well.', watch: 'Linked to land use and deforestation; tanning can be chemically intensive.' },
  { name: 'Elastane / spandex', kind: 'Synthetic', good: 'A little adds stretch and fit.', watch: 'Even small amounts blended in can make a garment unrecyclable.' },
];

// ---------------------------------------------------------------------------
// What certifications and indices actually verify. The other thing no rival
// tool does: decode the label. A certificate proves a specific, bounded thing.
// Knowing its edge is how you avoid reading it as a blanket "this is good".
// ---------------------------------------------------------------------------
export const CERTS = [
  { name: 'GOTS', verifies: 'Organic fibre content and processing standards for textiles, including some chemical and social criteria.', edge: 'Covers the certified product’s supply chain, not a whole brand.' },
  { name: 'GRS', verifies: 'Recycled content and chain of custody, plus some social and environmental criteria at certified facilities.', edge: 'Proves the recycled percentage, not that the garment is low-impact overall.' },
  { name: 'OEKO-TEX Standard 100', verifies: 'That the tested article is free of certain harmful substances above set limits.', edge: 'A chemical-safety test for the buyer, not a measure of environmental footprint.' },
  { name: 'B Corp', verifies: 'Independently assessed overall social and environmental performance and accountability of the company.', edge: 'A company-wide score, not a guarantee about any single product.' },
  { name: 'The Fashion Pact', verifies: 'That a CEO signed up to shared climate, biodiversity and ocean goals.', edge: 'A commitment to act, not evidence of results.' },
  { name: 'Fashion Transparency Index', verifies: 'How much a brand discloses publicly, scored 0 to 100.', edge: 'Measures disclosure, not performance. The signal this tool leans on, with that caveat.' },
];

// ---------------------------------------------------------------------------
// Regulation radar. Forward-looking, deliberately non-speculative about any
// one brand: these are the new rules that will change what brands must tell
// you. Sourced to their instruments; dates are the real phase-in dates.
// ---------------------------------------------------------------------------
export const REGULATION = [
  {
    name: 'EU Digital Product Passport',
    when: 'Textiles from ~2027 to 2028',
    what: 'A scannable passport per garment: fibre composition, recycled content, durability, repair and recycling instructions, and country of origin. The biggest structural change coming, though no per-garment passports exist yet.',
    tag: "What's coming",
  },
  {
    name: 'EU Empowering Consumers Directive',
    when: 'Applies 27 September 2026',
    what: 'Bans generic green claims like "eco-friendly" without proof, bans offset-based "carbon neutral" claims, and bans self-made sustainability labels across the EU. It sharpens the claim check above.',
    tag: 'In force',
  },
  {
    name: 'France · Coût Environnemental',
    when: 'Voluntary from Oct 2025',
    what: 'A single environmental-cost score per garment, using the open Ecobalyse method, with factors for microfibre release and fast-fashion overproduction. Third parties may publish a brand’s score from Oct 2026. The methodology is itself debated.',
    tag: 'Phasing in',
  },
];

// ---------------------------------------------------------------------------
// "Dig deeper" — reliable link-outs to richer per-brand data on other
// services. Openweave is a launchpad, not the last word: these send you to
// independent ratings and the primary sources so you can judge for yourself.
// We only LINK; we never restate another service's rating as our own.
// Good On You directory pages follow /brand/<slug>; a handful need an
// explicit slug where the obvious one would not resolve.
// ---------------------------------------------------------------------------
// Keys are Openweave brand ids (see slug()); values are the Good On You slug
// where it differs from ours. Best effort: a miss still lands on Good On You.
const GOODONYOU_SLUG = {
  handm: 'h-m', pullandbear: 'pull-bear', 'kmart-australia': 'kmart',
  'levi-strauss': 'levis',
};

function goodOnYouUrl(brand) {
  const slug = GOODONYOU_SLUG[brand.id] || brand.id;
  return `https://directory.goodonyou.eco/brand/${slug}`;
}

// Returns the ordered list of external references for a brand.
export function digLinks(brand) {
  const links = [];
  if (brand.reportUrl) {
    links.push({ label: 'Own sustainability report', url: brand.reportUrl, note: 'What the company says about itself' });
  }
  links.push({ label: 'Good On You rating', url: goodOnYouUrl(brand), note: 'Independent people, planet and animal score' });
  links.push({ label: 'Baptist World Aid (AU)', url: 'https://baptistworldaid.org.au/resources/ethical-fashion-guide/', note: 'Australian worker-rights and environment score out of 100' });
  links.push({ label: 'SBTi climate targets', url: 'https://sciencebasedtargets.org/target-dashboard', note: 'Check for a validated science-based emissions target' });
  links.push({ label: 'Fashion Transparency Index', url: 'https://www.fashionrevolution.org/about/transparency/', note: 'The source of the disclosure score above' });
  return links;
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

// ===========================================================================
// CLAIM CHECK — a small, honest greenwashing utility.
//
// Grounded in the ACCC's guidance "Making environmental claims: a guide for
// business" (the eight principles), with the same direction of travel as the
// EU Empowering Consumers Directive (in force, applies 27 Sept 2026, which
// bans generic claims like "eco-friendly", bans offset-based "carbon neutral"
// claims, and bans self-made sustainability labels), the UK CMA Green Claims
// Code and the US FTC Green Guides. (The separate EU Green Claims Directive
// was shelved in 2025, so it is not treated as law here.) It flags the vague
// and absolute terms regulators single out, and the qualifiers each one
// demands. It reads what YOU paste. It makes no claim about any real brand.
// ===========================================================================

// The eight ACCC principles, shown as the standard the checker applies.
export const ACCC_PRINCIPLES = [
  'Make accurate and truthful claims',
  'Have evidence to back up your claims',
  'Do not leave out or hide important information',
  'Explain any conditions or qualifications',
  'Avoid broad and unqualified claims',
  'Use clear and easy-to-understand language',
  'Visuals and imagery should not mislead',
  'Be transparent about your sustainability transition',
];

// Vague terms with no fixed meaning: regulators treat these as red flags
// unless the specific, measured impact is named alongside them.
export const VAGUE_TERMS = [
  { re: /\bsustainab(le|ly|ility)\b/gi, term: 'sustainable', ask: 'Sustaining what, measured how? Name the impact and the number.' },
  { re: /\beco[- ]?friendly\b/gi, term: 'eco-friendly', ask: 'Friendly compared with what? Every garment has a footprint.' },
  { re: /\bgreen\b/gi, term: 'green', ask: 'Green is a colour. Which impact fell, and by how much?' },
  { re: /\bconscious\b/gi, term: 'conscious', ask: 'Consciousness is not a supply-chain attribute. What changed in the product?' },
  { re: /\bnatural(ly)?\b/gi, term: 'natural', ask: 'Natural is not the same as low impact. Crude oil is natural.' },
  { re: /\bethical(ly)?\b/gi, term: 'ethical', ask: 'Whose code, audited by whom, and when was the last audit?' },
  { re: /\bresponsibl[ey]\b/gi, term: 'responsible', ask: 'Responsible to what standard? Point to it.' },
  { re: /\bclean\b/gi, term: 'clean', ask: 'Clean of what? Name the substance or drop the word.' },
  { re: /\bkind (to|on) the planet\b/gi, term: 'kind to the planet', ask: 'The planet has not been consulted. State the measured impact instead.' },
  { re: /\bplanet[- ](positive|friendly)\b/gi, term: 'planet positive', ask: 'A net-positive claim needs extraordinary evidence. Where is it?' },
  { re: /\bguilt[- ]free\b/gi, term: 'guilt-free', ask: 'Feelings are not a metric. State what the garment actually does.' },
  { re: /\bearth[- ]friendly\b/gi, term: 'earth-friendly', ask: 'Friendly how? Pick an impact, state the change.' },
];

// Absolute claims fail on the first exception: regulators expect these struck
// out unless every unit can be proven.
export const ABSOLUTE_TERMS = [
  { re: /\b100%\s*(sustainable|eco[- ]?friendly|green|recyclable|biodegradable|natural)\b/gi, term: 'the 100% absolute', ask: 'Absolute claims fail on the first exception. Strike it or prove every unit.' },
  { re: /\bzero\s*(impact|waste|emissions?|carbon)\b/gi, term: 'zero', ask: 'Nothing made at scale is zero anything. Show the boundary or strike it.' },
  { re: /\b(fully|completely|totally)\s+(sustainable|recyclable|biodegradable|circular)\b/gi, term: 'a totalising qualifier', ask: 'Fully, completely and totally are doing unpaid work here. Strike them.' },
  { re: /\bclimate[- ]positive\b/gi, term: 'climate positive', ask: 'Beyond neutral is a bold accounting position. Publish the ledger or strike it.' },
];

// Terms that can be legitimate but demand a specific qualifier.
export const QUALIFIER_TERMS = [
  { re: /\brecyclable\b/gi, term: 'recyclable', demand: 'In which stream, in which country, and what share is actually recycled today?' },
  { re: /\bbiodegradable\b/gi, term: 'biodegradable', demand: 'Under what conditions, and in how long? A landfill is not a compost heap.' },
  { re: /\bcompostable\b/gi, term: 'compostable', demand: 'Home or industrial composting? Name the standard.' },
  { re: /\brecycled\b/gi, term: 'recycled', demand: 'What percentage, of which component, certified by whom?' },
  { re: /\bcarbon[- ]neutral\b/gi, term: 'carbon neutral', demand: 'Reduced or offset? From 2026 the EU bans offset-based neutrality claims. Which scopes, whose offsets, what vintage?' },
  { re: /\borganic\b/gi, term: 'organic', demand: 'Certified to which scheme, and what share of the fibre?' },
  { re: /\brenewable\b/gi, term: 'renewable', demand: 'What share of energy, contracted how, over what period?' },
  { re: /\bplastic[- ]free\b/gi, term: 'plastic-free', demand: 'Product, packaging or both? Polyester is plastic.' },
  { re: /\bup to\b/gi, term: 'up to', demand: 'Up to includes zero. State the typical figure, not the ceiling.' },
  { re: /\bplant[- ]based\b/gi, term: 'plant-based', demand: 'What share is plant-derived, and what carries the rest?' },
  { re: /\bwe plant a tree\b/gi, term: 'tree planting', demand: 'Survival rate, land tenure, and is it additional to what would grow anyway?' },
];

// Signals that a claim actually carries evidence.
export const EVIDENCE_PATTERNS = [
  /\b\d+(\.\d+)?\s*(%|percent|kg|g|litres?|l\b|kwh|tonnes?)/i,
  /\b(gots|grs|oeko[- ]?tex|fsc|bluesign|fair\s?trade|b corp|iso\s?14|climate active)\b/i,
  /\b(audit(ed)?|verif(y|ied|ication)|certif(y|ied|ication)|third[- ]party|independent)/i,
  /\b(report|published|publish|methodology|footprint)\b/i,
  /\b(20\d\d)\b/,
  /\bcompared (with|to)\b/i,
  /\bscope\s?[123]\b/i,
];

// Specimen claims to try, from empty to sound.
export const SPECIMEN_CLAIMS = [
  'Made with 100% sustainable materials.',
  'Our most eco-friendly collection yet.',
  'Kind to the planet, kind to you.',
  'Carbon neutral since 2022.',
  'This tee is 60% recycled polyester, certified to GRS, and we publish the third-party audit.',
  'Cut from organic cotton certified to GOTS, 41% less irrigation than our 2020 baseline.',
];

export const CLAIM_VERDICTS = {
  sound: { id: 'sound', label: 'Reads as substantiated', line: 'Specific, evidenced and qualified. This is what a claim that survives scrutiny looks like.' },
  vague: { id: 'vague', label: 'Vague', line: 'Not necessarily false, just empty. Every flagged word needs a number or a name behind it.' },
  risk: { id: 'risk', label: 'High greenwashing risk', line: 'Overclaimed and unsubstantiated. In Australia this is the pattern the ACCC has been pursuing.' },
};

// The analysis. Pure function over a string; no brand data involved.
export function analyseClaim(text) {
  const t = (text || '').trim();
  if (!t) return null;
  const hit = (list, key) => list
    .map((d) => { const m = t.match(d.re); return m ? { term: d.term, word: m[0], note: d[key] } : null; })
    .filter(Boolean);
  const vague = hit(VAGUE_TERMS, 'ask');
  const absolute = hit(ABSOLUTE_TERMS, 'ask');
  const qualifier = hit(QUALIFIER_TERMS, 'demand');
  const evidence = EVIDENCE_PATTERNS.filter((re) => re.test(t)).length;
  const flags = vague.length + absolute.length;
  let verdict;
  if (absolute.length > 0 || (flags >= 2 && evidence === 0)) verdict = CLAIM_VERDICTS.risk;
  else if (flags > 0 && evidence === 0) verdict = CLAIM_VERDICTS.vague;
  else if (flags > 0 && evidence > 0) verdict = qualifier.length && evidence < 2 ? CLAIM_VERDICTS.vague : CLAIM_VERDICTS.sound;
  else verdict = evidence > 0 ? CLAIM_VERDICTS.sound : CLAIM_VERDICTS.vague;
  return { vague, absolute, qualifier, evidence, verdict };
}

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

  // At-a-glance stat band under the hero.
  stats: [
    { k: 'brands and companies', from: 'brands' },
    { k: 'corporate groups own them', from: 'groups' },
    { k: 'transparency scores verified', from: 'scored' },
    { k: 'segments, from luxury to value', from: 'segments' },
  ],

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
    digLabel: 'Dig deeper',
    digHint: 'Openweave is a launchpad. Cross-check this brand against independent ratings and the primary sources.',
    checklistLabel: 'Before you buy',
    checklistHint: 'A quick, practical read for this brand, built from what is on file.',
    commitmentsLabel: 'Commitments and memberships',
    commitmentsHint: 'Industry pledges this brand has signed. A commitment, not a result.',
    commitmentsNone: 'No memberships confirmed on file yet.',
    provenanceLabel: 'Ownership',
    freshnessTemplate: 'Ownership and memberships verified as of {d}. Transparency score: Fashion Transparency Index 2023.',
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
    pactOnly: 'Fashion Pact',
    bcorpOnly: 'B Corp',
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

  spotlight: {
    stat: 'Ten owners',
    line: 'hold most of the brands on this page. The name on the label is rarely the company making the calls on climate, suppliers or wages. If you want the real numbers, read the parent.',
    sub: 'Which is why Openweave shows you the owner first',
  },

  claim: {
    idx: '04',
    title: 'Claim check',
    sub: 'Paste a green claim, see what holds up',
    lede: 'Marketing is where a brand chooses its words. Paste any sustainability claim and this checks it against the way regulators read it: flagging vague and absolute terms, and the qualifiers each one demands. It reads what you paste. It makes no judgement about any real brand.',
    placeholder: 'Paste or type a marketing claim…',
    run: 'Check it',
    tryLabel: 'Or try one',
    principlesLabel: 'The standard it applies',
    principlesNote: 'The ACCC’s eight principles for environmental claims, the benchmark for Australian businesses.',
    flaggedVague: 'Vague terms flagged',
    flaggedAbsolute: 'Absolute terms flagged',
    flaggedQualifier: 'Terms that need a qualifier',
    evidenceLabel: 'Evidence signals found',
    emptyResult: 'Type a claim above to check it.',
    disclaimer: 'This is an educational aid, not legal advice. It reflects the direction of the ACCC guidance, and the EU, UK and US equivalents, not a specific ruling.',
  },

  materials: {
    idx: '05',
    title: 'Materials',
    sub: 'What the fabric is telling you',
    lede: 'Half of a garment’s story is the fibre it is cut from. This is a plain read of the common ones, and their trade-offs. It is not a ranking, on purpose.',
    kindLabel: 'Type',
    goodLabel: 'In its favour',
    watchLabel: 'What to watch',
    caveatTitle: 'Why there is no single winner',
    caveat: 'Be wary of anyone who tells you one fibre is simply "the sustainable one". The best-known attempt at a single score, the Higg Materials Sustainability Index, ranked synthetics well partly because it left out microplastic and ocean pollution, and regulators in Norway and the Netherlands paused its consumer use in 2022. The honest answer is trade-offs: the lowest-impact garment is usually the one you already own, worn for years and repaired.',
  },

  signals: {
    idx: '06',
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
    certTitle: 'What the certifications actually verify',
    certLede: 'A certificate proves one specific, bounded thing. Knowing its edge is how you avoid reading a single label as a blanket "this is good".',
    certVerifies: 'Verifies',
    certEdge: 'Its edge',
    regTitle: 'Regulation radar',
    regLede: 'The rules that will change what brands must tell you. Forward-looking, and deliberately not a claim about any one brand.',
  },

  backlog: {
    idx: '07',
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
    { label: 'Claim check', id: 'claim' },
    { label: 'Materials', id: 'materials' },
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
  { label: 'Good On You · Brand ratings directory', url: 'https://directory.goodonyou.eco/' },
  { label: 'Baptist World Aid · Ethical Fashion Guide (AU)', url: 'https://baptistworldaid.org.au/resources/ethical-fashion-guide/' },
  { label: 'The Fashion Pact · Signatories', url: 'https://www.thefashionpact.org/' },
  { label: 'B Lab · Certified B Corporation directory', url: 'https://www.bcorporation.net/' },
  { label: 'ACCC · Making environmental claims: a guide for business', url: 'https://www.accc.gov.au/business/environmental-claims' },
  { label: 'LVMH · Environment and social commitments', url: 'https://www.lvmh.com/en/our-commitments' },
  { label: 'Kering · Sustainability', url: 'https://www.kering.com/en/sustainability/' },
  { label: 'Inditex · Sustainability', url: 'https://www.inditex.com/itxcomweb/en/sustainability' },
  { label: 'H&M Group · Sustainability', url: 'https://hmgroup.com/sustainability/' },
  { label: 'Fast Retailing · Sustainability', url: 'https://www.fastretailing.com/eng/sustainability/' },
  { label: 'VF Corporation · Our Impact', url: 'https://www.vfc.com/our-impact' },
];
