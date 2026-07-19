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

  // ---- Expansion: recognisable brands scored in FTI 2023 ------------------
  // Sportswear & footwear
  { name: 'Converse', aliases: ['converse'], parent: 'Nike, Inc.', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Sneakers', reportUrl: null },
  { name: 'Jordan', aliases: ['jordan', 'air jordan'], parent: 'Nike, Inc.', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Basketball footwear and apparel', reportUrl: null },
  { name: 'Champion', aliases: ['champion'], parent: 'Hanesbrands', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Athletic and casual wear', reportUrl: null },
  { name: 'Reebok', aliases: ['reebok'], parent: 'Authentic Brands Group', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Sportswear and footwear', reportUrl: null },
  { name: 'Fila', aliases: ['fila'], parent: 'Fila Holdings', segment: 'sportswear', country: 'South Korea', recognition: 'medium', knownFor: 'Sportswear and footwear', reportUrl: null },
  { name: 'Skechers', aliases: ['skechers'], parent: 'Skechers U.S.A., Inc.', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Comfort footwear', reportUrl: null },
  { name: 'Speedo', aliases: ['speedo'], parent: 'Pentland Brands', segment: 'sportswear', country: 'United Kingdom', recognition: 'high', knownFor: 'Swimwear', reportUrl: null },
  { name: 'Gymshark', aliases: ['gymshark'], parent: 'Gymshark Ltd', segment: 'sportswear', country: 'United Kingdom', recognition: 'medium', knownFor: 'Gym and fitness apparel', reportUrl: null },
  { name: 'Lacoste', aliases: ['lacoste'], parent: 'Maus Frères', segment: 'sportswear', country: 'France', recognition: 'high', knownFor: 'Polo shirts and tennis wear', reportUrl: null },
  { name: 'Decathlon', aliases: ['decathlon'], parent: 'Decathlon', segment: 'sportswear', country: 'France', recognition: 'high', knownFor: 'Value sporting goods', reportUrl: null },

  // Footwear & outdoor
  { name: 'UGG', aliases: ['ugg', 'uggs'], parent: 'Deckers Brands', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Sheepskin boots', reportUrl: null },
  { name: 'Dr. Martens', aliases: ['dr martens', 'dr. martens', 'doc martens', 'docs'], parent: 'Dr. Martens plc', segment: 'footwear', country: 'United Kingdom', recognition: 'high', knownFor: 'Leather boots', reportUrl: null },
  { name: 'Columbia Sportswear', aliases: ['columbia', 'columbia sportswear'], parent: 'Columbia Sportswear Company', segment: 'outdoor', country: 'United States', recognition: 'high', knownFor: 'Outdoor apparel', reportUrl: null },
  { name: 'Kathmandu', aliases: ['kathmandu'], parent: 'KMD Brands', group: 'KMD Brands (also Rip Curl, Oboz)', segment: 'outdoor', country: 'New Zealand', au: true, recognition: 'high', knownFor: 'Outdoor and travel gear', reportUrl: null },

  // Denim
  { name: 'Guess', aliases: ['guess'], parent: 'Guess?, Inc.', segment: 'denim', country: 'United States', recognition: 'high', knownFor: 'Denim and fashion', reportUrl: null },
  { name: 'G-Star RAW', aliases: ['g-star', 'g star', 'gstar', 'g-star raw'], parent: 'G-Star', segment: 'denim', country: 'Netherlands', recognition: 'medium', knownFor: 'Denim', reportUrl: null },
  { name: 'Diesel', aliases: ['diesel'], parent: 'OTB Group', segment: 'denim', country: 'Italy', recognition: 'high', knownFor: 'Denim and fashion', reportUrl: null },
  { name: 'Wrangler', aliases: ['wrangler'], parent: 'Kontoor Brands', segment: 'denim', country: 'United States', recognition: 'high', knownFor: 'Denim workwear', reportUrl: null },

  // Fast fashion & high street
  { name: 'C&A', aliases: ['c&a', 'c and a', 'c a'], parent: 'Cofra Holding', segment: 'fastfashion', country: 'Belgium', recognition: 'medium', knownFor: 'Value high-street fashion', reportUrl: null },
  { name: 'United Colors of Benetton', aliases: ['benetton', 'united colors of benetton'], parent: 'Benetton Group', segment: 'fastfashion', country: 'Italy', recognition: 'medium', knownFor: 'Colourful knitwear and basics', reportUrl: null },
  { name: 'Mango', aliases: ['mango'], parent: 'Punto Fa (Mango)', segment: 'fastfashion', country: 'Spain', recognition: 'high', knownFor: 'High-street fashion', reportUrl: null },
  { name: 'Massimo Dutti', aliases: ['massimo dutti'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'medium', knownFor: 'Smart-casual fashion', reportUrl: null },
  { name: 'Stradivarius', aliases: ['stradivarius'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'medium', knownFor: 'Youth fast fashion', reportUrl: null },
  { name: 'Superdry', aliases: ['superdry'], parent: 'Superdry plc', segment: 'fastfashion', country: 'United Kingdom', recognition: 'high', knownFor: 'Graphic casualwear', reportUrl: null },
  { name: 'River Island', aliases: ['river island'], parent: 'River Island', segment: 'fastfashion', country: 'United Kingdom', recognition: 'medium', knownFor: 'High-street fashion', reportUrl: null },
  { name: 'Abercrombie & Fitch', aliases: ['abercrombie', 'abercrombie & fitch', 'a&f'], parent: 'Abercrombie & Fitch Co.', segment: 'fastfashion', country: 'United States', recognition: 'high', knownFor: 'Casual American apparel', reportUrl: null },
  { name: 'OVS', aliases: ['ovs'], parent: 'OVS S.p.A.', segment: 'fastfashion', country: 'Italy', recognition: 'medium', knownFor: 'Value family fashion', reportUrl: null },
  { name: 'PrettyLittleThing', aliases: ['prettylittlething', 'plt', 'pretty little thing'], parent: 'Boohoo Group', segment: 'online', country: 'United Kingdom', recognition: 'high', knownFor: 'Online fast fashion', reportUrl: null },

  // Department, basics & value
  { name: 'Marks & Spencer', aliases: ['marks and spencer', 'marks & spencer', 'm&s'], parent: 'Marks & Spencer Group', segment: 'department', country: 'United Kingdom', recognition: 'high', knownFor: 'Clothing, food and home', reportUrl: null },
  { name: 'Old Navy', aliases: ['old navy'], parent: 'Gap Inc.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Value family basics', reportUrl: null },
  { name: 'Victoria’s Secret', aliases: ['victorias secret', 'victoria secret', 'victoria’s secret'], parent: 'Victoria’s Secret & Co.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Lingerie and beauty', reportUrl: null },

  // Luxury & premium
  { name: 'Hugo Boss', aliases: ['hugo boss', 'boss'], parent: 'Hugo Boss AG', segment: 'luxury', country: 'Germany', recognition: 'high', knownFor: 'Tailoring and ready-to-wear', reportUrl: null },
  { name: 'Armani', aliases: ['armani', 'giorgio armani', 'emporio armani'], parent: 'Giorgio Armani S.p.A.', segment: 'luxury', country: 'Italy', recognition: 'high', knownFor: 'Tailoring and ready-to-wear', reportUrl: null },
  { name: 'Michael Kors', aliases: ['michael kors', 'mk'], parent: 'Capri Holdings', segment: 'luxury', country: 'United States', recognition: 'high', knownFor: 'Accessories and ready-to-wear', reportUrl: null },
  { name: 'Versace', aliases: ['versace'], parent: 'Capri Holdings', segment: 'luxury', country: 'Italy', recognition: 'high', knownFor: 'Ready-to-wear and accessories', reportUrl: null },
  { name: 'Salvatore Ferragamo', aliases: ['ferragamo', 'salvatore ferragamo'], parent: 'Salvatore Ferragamo Group', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Footwear and leather goods', reportUrl: null },

  // ---- Full FTI 2023 coverage: the remaining ranked brands and retailers ----
  { name: "Aeropostale", aliases: ["aeropostale"], parent: "Authentic Brands Group LLC", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Teen casualwear", reportUrl: null },
  { name: "AJIO", aliases: ["ajio"], parent: "Reliance Retail", segment: "online", country: "India", recognition: "low", knownFor: "Online fashion retailer", reportUrl: null },
  { name: "ALDI Nord", aliases: ["aldi nord"], parent: "ALDI Nord", segment: "department", country: "Germany", recognition: "high", knownFor: "Discount supermarket apparel", reportUrl: null },
  { name: "ALDI SOUTH", aliases: ["aldi south"], parent: "ALDI S\u00dcD", segment: "department", country: "Germany", recognition: "high", knownFor: "Discount supermarket apparel", reportUrl: null },
  { name: "ALDO", aliases: ["aldo"], parent: "The Aldo Group", segment: "footwear", country: "Canada", recognition: "medium", knownFor: "Footwear and accessories", reportUrl: null },
  { name: "Amazon", aliases: ["amazon"], parent: "Amazon.com, Inc.", segment: "online", country: "United States", recognition: "high", knownFor: "Online marketplace and own labels", reportUrl: null },
  { name: "American Eagle", aliases: ["american eagle"], parent: "American Eagle Outfitters", segment: "fastfashion", country: "United States", recognition: "high", knownFor: "Casual and denim", reportUrl: null },
  { name: "ANTA", aliases: ["anta"], parent: "ANTA Sports", segment: "sportswear", country: "China", recognition: "medium", knownFor: "Chinese sportswear group", reportUrl: null },
  { name: "Anthropologie", aliases: ["anthropologie"], parent: "URBN", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Bohemian women\u2019s fashion", reportUrl: null },
  { name: "Aritzia", aliases: ["aritzia"], parent: "Aritzia", segment: "fastfashion", country: "Canada", recognition: "medium", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Asda", aliases: ["asda"], parent: "Asda (TDR Capital)", segment: "department", country: "United Kingdom", recognition: "medium", knownFor: "Supermarket apparel (George)", reportUrl: null },
  { name: "Bally", aliases: ["bally"], parent: "JAB Holding Company", segment: "luxury", country: "Switzerland", recognition: "medium", knownFor: "Luxury footwear and leather", reportUrl: null },
  { name: "Banana Republic", aliases: ["banana republic"], parent: "Gap Inc.", segment: "basics", country: "United States", recognition: "high", knownFor: "Smart-casual apparel", reportUrl: null },
  { name: "BCBGMAXAZRIA", aliases: ["bcbgmaxazria"], parent: "Marquee Brands", segment: "fastfashion", country: "United States", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Beanpole", aliases: ["beanpole"], parent: "Samsung C&T", segment: "fastfashion", country: "South Korea", recognition: "low", knownFor: "Korean casualwear", reportUrl: null },
  { name: "Belle", aliases: ["belle"], parent: "Belle International", segment: "footwear", country: "China", recognition: "low", knownFor: "Chinese footwear", reportUrl: null },
  { name: "Big Bazaar \u2013 ffb", aliases: ["big bazaar \u2013 ffb"], parent: "Future Group", segment: "department", country: "India", recognition: "low", knownFor: "Indian hypermarket", reportUrl: null },
  { name: "Billabong", aliases: ["billabong"], parent: "Boardriders", segment: "outdoor", country: "Australia", au: true, recognition: "high", knownFor: "Surfwear", reportUrl: null },
  { name: "Bloomingdale's", aliases: ["bloomingdale's"], parent: "Macy\u2019s, Inc.", segment: "department", country: "United States", recognition: "medium", knownFor: "Department store", reportUrl: null },
  { name: "Bonprix", aliases: ["bonprix"], parent: "Otto Group", segment: "online", country: "Germany", recognition: "low", knownFor: "Online value fashion", reportUrl: null },
  { name: "Bosideng", aliases: ["bosideng"], parent: "Bosideng", segment: "outdoor", country: "China", recognition: "low", knownFor: "Chinese down jackets", reportUrl: null },
  { name: "Brooks Sports", aliases: ["brooks sports"], parent: "Berkshire Hathaway", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Running shoes", reportUrl: null },
  { name: "Brunello Cucinelli", aliases: ["brunello cucinelli"], parent: "Brunello Cucinelli", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Luxury knitwear", reportUrl: null },
  { name: "Buckle", aliases: ["buckle"], parent: "The Buckle, Inc.", segment: "fastfashion", country: "United States", recognition: "low", knownFor: "Denim and casual retailer", reportUrl: null },
  { name: "Burlington", aliases: ["burlington"], parent: "Burlington Stores", segment: "department", country: "United States", recognition: "medium", knownFor: "Off-price retailer", reportUrl: null },
  { name: "Calzedonia", aliases: ["calzedonia"], parent: "Calzedonia Group", segment: "basics", country: "Italy", recognition: "medium", knownFor: "Hosiery and swimwear", reportUrl: null },
  { name: "Canada Goose", aliases: ["canada goose"], parent: "Canada Goose", segment: "outdoor", country: "Canada", recognition: "high", knownFor: "Luxury outerwear", reportUrl: null },
  { name: "Carhartt", aliases: ["carhartt"], parent: "Carhartt", segment: "outdoor", country: "United States", recognition: "high", knownFor: "Workwear", reportUrl: null },
  { name: "Carolina Herrera", aliases: ["carolina herrera"], parent: "Puig", segment: "luxury", country: "United States", recognition: "medium", knownFor: "Luxury fashion", reportUrl: null },
  { name: "CAROLL", aliases: ["caroll"], parent: "CAROLL", segment: "fastfashion", country: "France", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Carrefour", aliases: ["carrefour"], parent: "Carrefour", segment: "department", country: "France", recognition: "high", knownFor: "Hypermarket apparel (Tex)", reportUrl: null },
  { name: "Carter's", aliases: ["carter's"], parent: "Carter\u2019s, Inc.", segment: "basics", country: "United States", recognition: "medium", knownFor: "Children\u2019s clothing", reportUrl: null },
  { name: "celio", aliases: ["celio"], parent: "celio", segment: "fastfashion", country: "France", recognition: "low", knownFor: "Menswear", reportUrl: null },
  { name: "Chico's", aliases: ["chico's"], parent: "Chico\u2019s FAS", segment: "fastfashion", country: "United States", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Chlo\u00e9", aliases: ["chlo\u00e9"], parent: "Richemont", segment: "luxury", country: "France", recognition: "high", knownFor: "Luxury ready-to-wear", reportUrl: null },
  { name: "Clarks", aliases: ["clarks"], parent: "Clarks", segment: "footwear", country: "United Kingdom", recognition: "high", knownFor: "Footwear", reportUrl: null },
  { name: "Cortefiel", aliases: ["cortefiel"], parent: "Tendam", segment: "fastfashion", country: "Spain", recognition: "low", knownFor: "Spanish fashion", reportUrl: null },
  { name: "Costco", aliases: ["costco"], parent: "Costco", segment: "department", country: "United States", recognition: "high", knownFor: "Warehouse retailer (Kirkland)", reportUrl: null },
  { name: "Deichmann", aliases: ["deichmann"], parent: "Deichmann", segment: "footwear", country: "Germany", recognition: "medium", knownFor: "Value footwear", reportUrl: null },
  { name: "Desigual", aliases: ["desigual"], parent: "Desigual", segment: "fastfashion", country: "Spain", recognition: "medium", knownFor: "Colourful fashion", reportUrl: null },
  { name: "Dick's Sporting Goods", aliases: ["dick's sporting goods"], parent: "Dick\u2019s Sporting Goods", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Sporting goods retailer", reportUrl: null },
  { name: "Dillard's", aliases: ["dillard's"], parent: "Dillard\u2019s", segment: "department", country: "United States", recognition: "low", knownFor: "Department store", reportUrl: null },
  { name: "Disney", aliases: ["disney"], parent: "The Walt Disney Company", segment: "department", country: "United States", recognition: "high", knownFor: "Licensed character apparel", reportUrl: null },
  { name: "DKNY", aliases: ["dkny"], parent: "G-III Apparel Group", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Donna Karan New York", reportUrl: null },
  { name: "Dolce & Gabbana", aliases: ["dolce & gabbana"], parent: "Dolce & Gabbana", segment: "luxury", country: "Italy", recognition: "high", knownFor: "Luxury fashion", reportUrl: null },
  { name: "Dressmann", aliases: ["dressmann"], parent: "Varner", segment: "basics", country: "Norway", recognition: "low", knownFor: "Menswear", reportUrl: null },
  { name: "DSW", aliases: ["dsw"], parent: "Designer Brands", segment: "footwear", country: "United States", recognition: "low", knownFor: "Footwear retailer", reportUrl: null },
  { name: "Eddie Bauer", aliases: ["eddie bauer"], parent: "Authentic Brands Group", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Outdoor apparel", reportUrl: null },
  { name: "El Corte Ingl\u00e9s", aliases: ["el corte ingl\u00e9s"], parent: "El Corte Ingl\u00e9s", segment: "department", country: "Spain", recognition: "medium", knownFor: "Department store", reportUrl: null },
  { name: "Ermenegildo Zegna", aliases: ["ermenegildo zegna"], parent: "Ermenegildo Zegna Group", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Luxury menswear", reportUrl: null },
  { name: "Esprit", aliases: ["esprit"], parent: "Esprit", segment: "fastfashion", country: "Germany", recognition: "medium", knownFor: "Casual fashion", reportUrl: null },
  { name: "Express", aliases: ["express"], parent: "Express, Inc.", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Workwear-casual fashion", reportUrl: null },
  { name: "Fabletics", aliases: ["fabletics"], parent: "TechStyle Fashion Group", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Activewear", reportUrl: null },
  { name: "Falabella", aliases: ["falabella"], parent: "Falabella", segment: "department", country: "Chile", recognition: "low", knownFor: "Latin American department store", reportUrl: null },
  { name: "Famous Footwear", aliases: ["famous footwear"], parent: "Caleres", segment: "footwear", country: "United States", recognition: "low", knownFor: "Footwear retailer", reportUrl: null },
  { name: "Fanatics", aliases: ["fanatics"], parent: "Fanatics", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Licensed sports merchandise", reportUrl: null },
  { name: "Fashion Nova", aliases: ["fashion nova"], parent: "Fashion Nova", segment: "online", country: "United States", recognition: "high", knownFor: "Online ultra-fast fashion", reportUrl: null },
  { name: "Fj\u00e4llr\u00e4ven", aliases: ["fj\u00e4llr\u00e4ven"], parent: "Fenix Outdoor", segment: "outdoor", country: "Sweden", recognition: "medium", knownFor: "Outdoor gear", reportUrl: null },
  { name: "Foot Locker", aliases: ["foot locker"], parent: "Foot Locker, Inc.", segment: "footwear", country: "United States", recognition: "high", knownFor: "Sneaker retailer", reportUrl: null },
  { name: "Foschini", aliases: ["foschini"], parent: "TFG", segment: "department", country: "South Africa", recognition: "low", knownFor: "Fashion retailer", reportUrl: null },
  { name: "Fossil", aliases: ["fossil"], parent: "Fossil Group, Inc.", segment: "basics", country: "United States", recognition: "medium", knownFor: "Watches and accessories", reportUrl: null },
  { name: "Free People", aliases: ["free people"], parent: "URBN", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Bohemian women\u2019s fashion", reportUrl: null },
  { name: "Fruit of the Loom", aliases: ["fruit of the loom"], parent: "Berkshire Hathaway", segment: "basics", country: "United States", recognition: "high", knownFor: "Basics and underwear", reportUrl: null },
  { name: "Furla", aliases: ["furla"], parent: "Furla", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Leather goods", reportUrl: null },
  { name: "Gerry Weber", aliases: ["gerry weber"], parent: "Gerry Weber", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Gildan", aliases: ["gildan"], parent: "Gildan Activewear", segment: "basics", country: "Canada", recognition: "medium", knownFor: "Blank basics and underwear", reportUrl: null },
  { name: "Hanes", aliases: ["hanes"], parent: "Hanesbrands", segment: "basics", country: "United States", recognition: "high", knownFor: "Underwear and basics", reportUrl: null },
  { name: "Heilan Home", aliases: ["heilan home"], parent: "Heilan Home", segment: "basics", country: "China", recognition: "low", knownFor: "Chinese menswear", reportUrl: null },
  { name: "Helly Hansen", aliases: ["helly hansen"], parent: "Canadian Tire", segment: "outdoor", country: "Norway", recognition: "medium", knownFor: "Outdoor and sailing gear", reportUrl: null },
  { name: "HEMA", aliases: ["hema"], parent: "HEMA", segment: "department", country: "Netherlands", recognition: "medium", knownFor: "Value general retailer", reportUrl: null },
  { name: "Hollister Co.", aliases: ["hollister co."], parent: "Abercrombie & Fitch Co.", segment: "fastfashion", country: "United States", recognition: "high", knownFor: "Teen casualwear", reportUrl: null },
  { name: "Hudson's Bay", aliases: ["hudson's bay"], parent: "Hudson\u2019s Bay Company", segment: "department", country: "Canada", recognition: "low", knownFor: "Department store", reportUrl: null },
  { name: "Intimissimi", aliases: ["intimissimi"], parent: "Calzedonia Group", segment: "basics", country: "Italy", recognition: "medium", knownFor: "Lingerie", reportUrl: null },
  { name: "Ito-Yokado", aliases: ["ito-yokado"], parent: "Seven & i Holdings", segment: "department", country: "Japan", recognition: "low", knownFor: "Japanese superstore", reportUrl: null },
  { name: "Jack & Jones", aliases: ["jack & jones"], parent: "Bestseller", segment: "fastfashion", country: "Denmark", recognition: "medium", knownFor: "Menswear", reportUrl: null },
  { name: "Jack Wolfskin", aliases: ["jack wolfskin"], parent: "Topgolf Callaway", segment: "outdoor", country: "Germany", recognition: "medium", knownFor: "Outdoor apparel", reportUrl: null },
  { name: "Jil Sander", aliases: ["jil sander"], parent: "OTB Group", segment: "luxury", country: "Germany", recognition: "medium", knownFor: "Minimal luxury", reportUrl: null },
  { name: "Jockey", aliases: ["jockey"], parent: "Jockey International", segment: "basics", country: "United States", recognition: "medium", knownFor: "Underwear", reportUrl: null },
  { name: "Joe Fresh", aliases: ["joe fresh"], parent: "Loblaw Companies", segment: "fastfashion", country: "Canada", recognition: "low", knownFor: "Value fashion", reportUrl: null },
  { name: "John Lewis", aliases: ["john lewis"], parent: "John Lewis Partnership", segment: "department", country: "United Kingdom", recognition: "high", knownFor: "Department store", reportUrl: null },
  { name: "K-Way", aliases: ["k-way"], parent: "BasicNet", segment: "outdoor", country: "Italy", recognition: "low", knownFor: "Rainwear", reportUrl: null },
  { name: "Kaufland", aliases: ["kaufland"], parent: "Schwarz Group", segment: "department", country: "Germany", recognition: "medium", knownFor: "Hypermarket apparel", reportUrl: null },
  { name: "Kiabi", aliases: ["kiabi"], parent: "Kiabi", segment: "fastfashion", country: "France", recognition: "medium", knownFor: "Value family fashion", reportUrl: null },
  { name: "KiK", aliases: ["kik"], parent: "KiK", segment: "fastfashion", country: "Germany", recognition: "medium", knownFor: "Discount clothing", reportUrl: null },
  { name: "Kohl's", aliases: ["kohl's"], parent: "Kohl\u2019s", segment: "department", country: "United States", recognition: "medium", knownFor: "Department store", reportUrl: null },
  { name: "KOOVS", aliases: ["koovs"], parent: "KOOVS", segment: "online", country: "India", recognition: "low", knownFor: "Online fashion", reportUrl: null },
  { name: "La Redoute", aliases: ["la redoute"], parent: "Galeries Lafayette Group", segment: "online", country: "France", recognition: "medium", knownFor: "Online fashion", reportUrl: null },
  { name: "Lands' End", aliases: ["lands' end"], parent: "Lands\u2019 End", segment: "basics", country: "United States", recognition: "medium", knownFor: "Casual and outdoor basics", reportUrl: null },
  { name: "LC Waikiki", aliases: ["lc waikiki"], parent: "LC Waikiki", segment: "fastfashion", country: "Turkey", recognition: "low", knownFor: "Value fashion", reportUrl: null },
  { name: "Li-Ning", aliases: ["li-ning"], parent: "Li-Ning", segment: "sportswear", country: "China", recognition: "medium", knownFor: "Chinese sportswear", reportUrl: null },
  { name: "Lidl", aliases: ["lidl"], parent: "Schwarz Group", segment: "department", country: "Germany", recognition: "high", knownFor: "Discount supermarket apparel", reportUrl: null },
  { name: "Lindex", aliases: ["lindex"], parent: "Stockmann Group", segment: "fastfashion", country: "Sweden", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "LL Bean", aliases: ["ll bean"], parent: "L.L.Bean", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Outdoor apparel", reportUrl: null },
  { name: "Longchamp", aliases: ["longchamp"], parent: "Longchamp", segment: "luxury", country: "France", recognition: "medium", knownFor: "Leather goods", reportUrl: null },
  { name: "Macy's", aliases: ["macy's"], parent: "Macy\u2019s, Inc.", segment: "department", country: "United States", recognition: "high", knownFor: "Department store", reportUrl: null },
  { name: "Mammut", aliases: ["mammut"], parent: "Telemos Capital", segment: "outdoor", country: "Switzerland", recognition: "medium", knownFor: "Mountaineering gear", reportUrl: null },
  { name: "Marc Jacobs", aliases: ["marc jacobs"], parent: "LVMH", segment: "luxury", country: "United States", recognition: "high", knownFor: "Fashion", reportUrl: null },
  { name: "Marni", aliases: ["marni"], parent: "OTB Group", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Fashion", reportUrl: null },
  { name: "Matalan", aliases: ["matalan"], parent: "Matalan", segment: "fastfashion", country: "United Kingdom", recognition: "medium", knownFor: "Value fashion", reportUrl: null },
  { name: "Max", aliases: ["max"], parent: "Landmark Group", segment: "fastfashion", country: "United Arab Emirates", recognition: "low", knownFor: "Value fashion", reportUrl: null },
  { name: "Max Mara", aliases: ["max mara"], parent: "Max Mara Fashion Group", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Women\u2019s luxury", reportUrl: null },
  { name: "Merrell", aliases: ["merrell"], parent: "Wolverine World Wide", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Hiking footwear", reportUrl: null },
  { name: "Metersbonwe", aliases: ["metersbonwe"], parent: "Metersbonwe", segment: "fastfashion", country: "China", recognition: "low", knownFor: "Chinese casualwear", reportUrl: null },
  { name: "Mexx", aliases: ["mexx"], parent: "Mexx", segment: "fastfashion", country: "Netherlands", recognition: "low", knownFor: "Casual fashion", reportUrl: null },
  { name: "Mizuno", aliases: ["mizuno"], parent: "Mizuno", segment: "sportswear", country: "Japan", recognition: "medium", knownFor: "Sports equipment and footwear", reportUrl: null },
  { name: "Monoprix", aliases: ["monoprix"], parent: "Groupe Casino", segment: "department", country: "France", recognition: "medium", knownFor: "Supermarket apparel", reportUrl: null },
  { name: "Morrisons", aliases: ["morrisons"], parent: "Morrisons", segment: "department", country: "United Kingdom", recognition: "medium", knownFor: "Supermarket apparel (Nutmeg)", reportUrl: null },
  { name: "MRP", aliases: ["mrp"], parent: "Mr Price Group", segment: "fastfashion", country: "South Africa", recognition: "low", knownFor: "Value fashion (Mr Price)", reportUrl: null },
  { name: "Muji", aliases: ["muji"], parent: "Ryohin Keikaku", segment: "basics", country: "Japan", recognition: "high", knownFor: "Minimalist lifestyle goods", reportUrl: null },
  { name: "New Look", aliases: ["new look"], parent: "New Look", segment: "fastfashion", country: "United Kingdom", recognition: "medium", knownFor: "Value fashion", reportUrl: null },
  { name: "New Yorker", aliases: ["new yorker"], parent: "New Yorker", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Youth fashion", reportUrl: null },
  { name: "Nine West", aliases: ["nine west"], parent: "Authentic Brands Group", segment: "footwear", country: "United States", recognition: "medium", knownFor: "Women\u2019s footwear", reportUrl: null },
  { name: "Nordstrom", aliases: ["nordstrom"], parent: "Nordstrom, Inc.", segment: "department", country: "United States", recognition: "high", knownFor: "Department store", reportUrl: null },
  { name: "Otto", aliases: ["otto"], parent: "Otto Group", segment: "online", country: "Germany", recognition: "medium", knownFor: "Online retail group", reportUrl: null },
  { name: "Paris", aliases: ["paris"], parent: "Cencosud", segment: "department", country: "Chile", recognition: "low", knownFor: "Latin American department store", reportUrl: null },
  { name: "Pepe Jeans", aliases: ["pepe jeans"], parent: "Pepe Jeans", segment: "denim", country: "Spain", recognition: "medium", knownFor: "Denim", reportUrl: null },
  { name: "Pimkie", aliases: ["pimkie"], parent: "Pimkie", segment: "fastfashion", country: "France", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Prisma", aliases: ["prisma"], parent: "S Group", segment: "department", country: "Finland", recognition: "low", knownFor: "Hypermarket apparel", reportUrl: null },
  { name: "Quiksilver", aliases: ["quiksilver"], parent: "Boardriders", segment: "outdoor", country: "United States", recognition: "high", knownFor: "Surfwear", reportUrl: null },
  { name: "REI", aliases: ["rei"], parent: "REI Co-op", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Outdoor co-op retailer", reportUrl: null },
  { name: "Reliance Trends", aliases: ["reliance trends"], parent: "Reliance Retail", segment: "department", country: "India", recognition: "low", knownFor: "Indian fashion retailer", reportUrl: null },
  { name: "Reserved", aliases: ["reserved"], parent: "LPP", segment: "fastfashion", country: "Poland", recognition: "medium", knownFor: "Fast fashion", reportUrl: null },
  { name: "REVOLVE", aliases: ["revolve"], parent: "Revolve Group", segment: "online", country: "United States", recognition: "medium", knownFor: "Online fashion", reportUrl: null },
  { name: "Romwe", aliases: ["romwe"], parent: "Globalegrow", segment: "online", country: "China", recognition: "low", knownFor: "Online ultra-fast fashion", reportUrl: null },
  { name: "Roxy", aliases: ["roxy"], parent: "Boardriders", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Women\u2019s surfwear", reportUrl: null },
  { name: "Russell Athletic", aliases: ["russell athletic"], parent: "Fruit of the Loom", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Athletic basics", reportUrl: null },
  { name: "s.Oliver", aliases: ["s.oliver"], parent: "s.Oliver Group", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Casual fashion", reportUrl: null },
  { name: "Sainsbury's", aliases: ["sainsbury's"], parent: "Sainsbury\u2019s", segment: "department", country: "United Kingdom", recognition: "high", knownFor: "Supermarket apparel (Tu)", reportUrl: null },
  { name: "Saks Fifth Avenue", aliases: ["saks fifth avenue"], parent: "Hudson\u2019s Bay Company", segment: "department", country: "United States", recognition: "medium", knownFor: "Luxury department store", reportUrl: null },
  { name: "Sandro", aliases: ["sandro"], parent: "SMCP", segment: "fastfashion", country: "France", recognition: "medium", knownFor: "Contemporary fashion", reportUrl: null },
  { name: "Savage X Fenty", aliases: ["savage x fenty"], parent: "Savage X Fenty", segment: "basics", country: "United States", recognition: "high", knownFor: "Lingerie", reportUrl: null },
  { name: "Semir", aliases: ["semir"], parent: "Semir", segment: "fastfashion", country: "China", recognition: "low", knownFor: "Chinese casualwear", reportUrl: null },
  { name: "Shimamura", aliases: ["shimamura"], parent: "Shimamura", segment: "fastfashion", country: "Japan", recognition: "low", knownFor: "Value fashion retailer", reportUrl: null },
  { name: "Splash", aliases: ["splash"], parent: "Landmark Group", segment: "fastfashion", country: "United Arab Emirates", recognition: "low", knownFor: "Value fashion", reportUrl: null },
  { name: "Sports Direct", aliases: ["sports direct"], parent: "Frasers Group", segment: "sportswear", country: "United Kingdom", recognition: "medium", knownFor: "Sports retailer", reportUrl: null },
  { name: "Steve Madden", aliases: ["steve madden"], parent: "Steven Madden, Ltd.", segment: "footwear", country: "United States", recognition: "medium", knownFor: "Footwear", reportUrl: null },
  { name: "Takko", aliases: ["takko"], parent: "Takko Fashion", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Discount fashion", reportUrl: null },
  { name: "Tchibo", aliases: ["tchibo"], parent: "Tchibo", segment: "department", country: "Germany", recognition: "low", knownFor: "Coffee and apparel retailer", reportUrl: null },
  { name: "Ted Baker", aliases: ["ted baker"], parent: "Authentic Brands Group", segment: "fastfashion", country: "United Kingdom", recognition: "medium", knownFor: "Contemporary fashion", reportUrl: null },
  { name: "Tesco", aliases: ["tesco"], parent: "Tesco", segment: "department", country: "United Kingdom", recognition: "high", knownFor: "Supermarket apparel (F&F)", reportUrl: null },
  { name: "Tezenis", aliases: ["tezenis"], parent: "Calzedonia Group", segment: "basics", country: "Italy", recognition: "medium", knownFor: "Lingerie", reportUrl: null },
  { name: "The Children's Place", aliases: ["the children's place"], parent: "The Children\u2019s Place", segment: "basics", country: "United States", recognition: "medium", knownFor: "Children\u2019s clothing", reportUrl: null },
  { name: "The Warehouse", aliases: ["the warehouse"], parent: "The Warehouse Group", segment: "department", country: "New Zealand", recognition: "medium", knownFor: "Value retailer", reportUrl: null },
  { name: "Tod's", aliases: ["tod's"], parent: "Tod\u2019s", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Luxury footwear and leather", reportUrl: null },
  { name: "Tom Ford", aliases: ["tom ford"], parent: "The Est\u00e9e Lauder Companies", segment: "luxury", country: "United States", recognition: "high", knownFor: "Luxury fashion", reportUrl: null },
  { name: "Tom Tailor", aliases: ["tom tailor"], parent: "Tom Tailor", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Casual fashion", reportUrl: null },
  { name: "Tommy Bahama", aliases: ["tommy bahama"], parent: "Oxford Industries", segment: "fastfashion", country: "United States", recognition: "low", knownFor: "Resort wear", reportUrl: null },
  { name: "TOPVALU COLLECTION", aliases: ["topvalu collection"], parent: "AEON", segment: "department", country: "Japan", recognition: "low", knownFor: "Supermarket apparel", reportUrl: null },
  { name: "Tory Burch", aliases: ["tory burch"], parent: "Tory Burch", segment: "luxury", country: "United States", recognition: "high", knownFor: "Accessories and fashion", reportUrl: null },
  { name: "Triumph", aliases: ["triumph"], parent: "Triumph International", segment: "basics", country: "Germany", recognition: "medium", knownFor: "Lingerie", reportUrl: null },
  { name: "Truworths", aliases: ["truworths"], parent: "Truworths", segment: "department", country: "South Africa", recognition: "low", knownFor: "Fashion retailer", reportUrl: null },
  { name: "United Arrows", aliases: ["united arrows"], parent: "United Arrows", segment: "fastfashion", country: "Japan", recognition: "low", knownFor: "Japanese fashion retailer", reportUrl: null },
  { name: "Urban Outfitters", aliases: ["urban outfitters"], parent: "URBN", segment: "fastfashion", country: "United States", recognition: "high", knownFor: "Youth fashion", reportUrl: null },
  { name: "Valentino", aliases: ["valentino"], parent: "Valentino", segment: "luxury", country: "Italy", recognition: "high", knownFor: "Luxury fashion", reportUrl: null },
  { name: "Van Heusen", aliases: ["van heusen"], parent: "Authentic Brands Group", segment: "basics", country: "United States", recognition: "medium", knownFor: "Dress shirts and menswear", reportUrl: null },
  { name: "Vero Moda", aliases: ["vero moda"], parent: "Bestseller", segment: "fastfashion", country: "Denmark", recognition: "medium", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Very", aliases: ["very"], parent: "The Very Group", segment: "online", country: "United Kingdom", recognition: "medium", knownFor: "Online retailer", reportUrl: null },
  { name: "Walmart", aliases: ["walmart"], parent: "Walmart Inc.", segment: "department", country: "United States", recognition: "high", knownFor: "Supermarket apparel (George)", reportUrl: null },
  { name: "Woolworths South Africa", aliases: ["woolworths south africa"], parent: "Woolworths Holdings", segment: "department", country: "South Africa", recognition: "medium", knownFor: "Department store", reportUrl: null },
  { name: "Youngor", aliases: ["youngor"], parent: "Youngor", segment: "basics", country: "China", recognition: "low", knownFor: "Chinese menswear", reportUrl: null },
  { name: "Zeeman", aliases: ["zeeman"], parent: "Zeeman", segment: "fastfashion", country: "Netherlands", recognition: "low", knownFor: "Discount clothing", reportUrl: null },
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
  // expansion (founding / group signatories)
  'armani', 'michael-kors', 'versace', 'salvatore-ferragamo',
  'ermenegildo-zegna', 'nordstrom',
]);
const FASHION_PACT_FORMER = new Set(['herm-s']); // slug('Hermès') === 'herm-s'
const B_CORP_IDS = new Set(['patagonia', 'r-m-williams', 'camilla', 'chlo']);

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
  // expansion (own company validated)
  'gymshark', 'canda', 'mango', 'superdry', 'marks-and-spencer', 'guess',
  'g-star-raw', 'hugo-boss', 'ovs', 'decathlon', 'salvatore-ferragamo',
  'abercrombie-and-fitch', 'victoria-s-secret',
  // full-coverage batch (own company validated, exact SBTi name match)
  'american-eagle', 'aritzia', 'brunello-cucinelli', 'canada-goose', 'carrefour',
  'desigual', 'disney', 'fossil', 'gildan', 'hanes', 'john-lewis', 'kohl-s',
  'mizuno', 'nordstrom', 'otto', 's-oliver', 'shimamura', 'steve-madden',
  'tchibo', 'tom-tailor', 'united-arrows', 'very', 'walmart', 'woolworths-south-africa',
]);
const SBTI_PARENT = new Set([
  'louis-vuitton', 'dior', 'loewe', 'fendi', 'celine', 'gucci', 'saint-laurent',
  'balenciaga', 'bottega-veneta', 'zara', 'pullandbear', 'bershka', 'uniqlo', 'gu',
  'cos', 'calvin-klein', 'tommy-hilfiger', 'the-north-face', 'vans', 'timberland',
  'coach', 'kate-spade', 'prada', 'miu-miu', 'bonds', 'big-w', 'country-road',
  'the-iconic', 'shein',
  // expansion (parent/group validated)
  'converse', 'jordan', 'champion', 'ugg', 'kathmandu', 'speedo', 'massimo-dutti',
  'stradivarius', 'diesel', 'wrangler', 'michael-kors', 'versace', 'old-navy',
  'united-colors-of-benetton',
  // full-coverage batch (parent/group validated)
  'banana-republic', 'bonprix', 'chlo', 'hollister-co', 'jack-and-jones',
  'joe-fresh', 'la-redoute', 'russell-athletic', 'sports-direct', 'vero-moda',
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
  converse: 'Owned by Nike since 2003.',
  jordan: 'A Nike brand, built around Michael Jordan.',
  reebok: 'Sold by Adidas to Authentic Brands Group in 2021.',
  ugg: 'A brand of US group Deckers, which also owns Hoka.',
  diesel: 'Part of Italian group OTB, alongside Maison Margiela, Marni and Jil Sander.',
  wrangler: 'Spun out of VF Corporation into Kontoor Brands in 2019.',
  'michael-kors': 'Part of Capri Holdings, which also owns Versace and Jimmy Choo.',
  versace: 'Owned by Capri Holdings (formerly Michael Kors Holdings); a sale to Prada Group was agreed in 2025.',
  'old-navy': 'Part of Gap Inc.',
  'massimo-dutti': 'Part of Inditex, the group behind Zara.',
  stradivarius: 'Part of Inditex, the group behind Zara.',
  kathmandu: 'Part of KMD Brands, which also owns Rip Curl and Oboz.',
  champion: 'A Hanesbrands label; Hanesbrands agreed to a Gildan takeover in 2025.',
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
  // expansion batch
  converse: 50, jordan: 50, champion: 38, reebok: 1, fila: 15, skechers: 7,
  speedo: 47, gymshark: 27, lacoste: 38, decathlon: 26, ugg: 57, 'dr-martens': 35,
  'columbia-sportswear': 37, kathmandu: 29, guess: 31, 'g-star-raw': 49, diesel: 19,
  wrangler: 33, canda: 68, 'united-colors-of-benetton': 73, mango: 49,
  'massimo-dutti': 50, stradivarius: 50, superdry: 49, 'river-island': 32,
  'abercrombie-and-fitch': 33, ovs: 83, prettylittlething: 24, 'marks-and-spencer': 38,
  'old-navy': 48, 'victoria-s-secret': 19, 'hugo-boss': 55, armani: 38,
  'michael-kors': 23, versace: 24, 'salvatore-ferragamo': 24,
  // full-coverage batch
  'aeropostale': 3,
  'ajio': 8,
  'aldi-nord': 31,
  'aldi-south': 34,
  'aldo': 14,
  'amazon': 26,
  'american-eagle': 21,
  'anta': 0,
  'anthropologie': 13,
  'aritzia': 22,
  'asda': 28,
  'bally': 33,
  'banana-republic': 48,
  'bcbgmaxazria': 1,
  'beanpole': 7,
  'belle': 0,
  'big-bazaar-ffb': 0,
  'billabong': 6,
  'bloomingdale-s': 7,
  'bonprix': 37,
  'bosideng': 0,
  'brooks-sports': 36,
  'brunello-cucinelli': 14,
  'buckle': 4,
  'burlington': 14,
  'calzedonia': 63,
  'canada-goose': 16,
  'carhartt': 7,
  'carolina-herrera': 16,
  'caroll': 5,
  'carrefour': 24,
  'carter-s': 25,
  'celio': 1,
  'chico-s': 14,
  'chlo': 43,
  'clarks': 17,
  'cortefiel': 21,
  'costco': 10,
  'deichmann': 2,
  'desigual': 25,
  'dick-s-sporting-goods': 27,
  'dillard-s': 3,
  'disney': 22,
  'dkny': 1,
  'dolce-and-gabbana': 2,
  'dressmann': 65,
  'dsw': 7,
  'eddie-bauer': 5,
  'el-corte-ingl-s': 24,
  'ermenegildo-zegna': 33,
  'esprit': 45,
  'express': 6,
  'fabletics': 2,
  'falabella': 11,
  'famous-footwear': 9,
  'fanatics': 18,
  'fashion-nova': 0,
  'fj-llr-ven': 40,
  'foot-locker': 9,
  'foschini': 18,
  'fossil': 16,
  'free-people': 13,
  'fruit-of-the-loom': 34,
  'furla': 5,
  'gerry-weber': 8,
  'gildan': 54,
  'hanes': 38,
  'heilan-home': 0,
  'helly-hansen': 30,
  'hema': 24,
  'hollister-co': 33,
  'hudson-s-bay': 9,
  'intimissimi': 63,
  'ito-yokado': 11,
  'jack-and-jones': 41,
  'jack-wolfskin': 25,
  'jil-sander': 18,
  'jockey': 2,
  'joe-fresh': 18,
  'john-lewis': 32,
  'k-way': 0,
  'kaufland': 12,
  'kiabi': 16,
  'kik': 17,
  'kohl-s': 17,
  'koovs': 0,
  'la-redoute': 13,
  'lands-end': 12,
  'lc-waikiki': 4,
  'li-ning': 9,
  'lidl': 25,
  'lindex': 44,
  'll-bean': 8,
  'longchamp': 2,
  'macy-s': 7,
  'mammut': 35,
  'marc-jacobs': 28,
  'marni': 17,
  'matalan': 29,
  'max': 1,
  'max-mara': 0,
  'merrell': 8,
  'metersbonwe': 0,
  'mexx': 0,
  'mizuno': 18,
  'monoprix': 18,
  'morrisons': 29,
  'mrp': 11,
  'muji': 28,
  'new-look': 42,
  'new-yorker': 0,
  'nine-west': 1,
  'nordstrom': 26,
  'otto': 20,
  'paris': 25,
  'pepe-jeans': 2,
  'pimkie': 18,
  'prisma': 22,
  'quiksilver': 6,
  'rei': 22,
  'reliance-trends': 10,
  'reserved': 20,
  'revolve': 2,
  'romwe': 3,
  'roxy': 6,
  'russell-athletic': 34,
  's-oliver': 43,
  'sainsbury-s': 51,
  'saks-fifth-avenue': 9,
  'sandro': 22,
  'savage-x-fenty': 0,
  'semir': 0,
  'shimamura': 4,
  'splash': 0,
  'sports-direct': 7,
  'steve-madden': 13,
  'takko': 7,
  'tchibo': 43,
  'ted-baker': 26,
  'tesco': 48,
  'tezenis': 63,
  'the-children-s-place': 17,
  'the-warehouse': 17,
  'tod-s': 9,
  'tom-ford': 0,
  'tom-tailor': 50,
  'tommy-bahama': 10,
  'topvalu-collection': 13,
  'tory-burch': 1,
  'triumph': 7,
  'truworths': 7,
  'united-arrows': 17,
  'urban-outfitters': 13,
  'valentino': 18,
  'van-heusen': 0,
  'vero-moda': 41,
  'very': 27,
  'walmart': 23,
  'woolworths-south-africa': 29,
  'youngor': 0,
  'zeeman': 54,
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
    method: 'Method: brand ownership from corporate filings and official brand pages. Transparency scores are the Fashion Transparency Index 2023, published by Fashion Revolution, which rates public disclosure only. Climate-target status is drawn from the Science Based Targets initiative dashboard; memberships from The Fashion Pact and B Lab. Per-field disclosure statuses are tracked in the repository and marked "Needs research" until a source is confirmed. Nothing here is assured reporting, a product footprint, or advice about a real brand.',
    attributionLabel: 'Data and attribution',
    attribution: 'This tool reproduces published figures with attribution, and claims none of them as its own. Fashion Transparency Index scores are © Fashion Revolution CIC, used for reference under their public research. Science Based Targets initiative data © SBTi. Certification and membership marks belong to their owners: The Fashion Pact, B Lab (B Corp), and the brands named. Company ownership is a matter of public record. Openweave is an independent, non-commercial reference tool and is not affiliated with, or endorsed by, any brand or organisation named. Every figure links to its source so you can check it. If you own a listing and something is wrong, it can be corrected.',
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
  { label: 'Science Based Targets initiative · Target dashboard', url: 'https://sciencebasedtargets.org/target-dashboard' },
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
