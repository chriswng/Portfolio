# Openweave — design notes

Not built or bundled (plain `.md`). The record of what the page is for, how it
is built, and the honesty rules it holds to.

## What this page is

A practical fashion brand transparency lookup. You search a brand you actually
recognise and get its real corporate parent, its market segment, its
headquarters, and a plain reading of what it discloses. It is a useful daily
tool first, an interesting exploration second.

The page answers one job clearly: **"Before I buy from this brand, who owns it
and what does it actually tell me?"**

## Structure, ordered by usefulness

1. **Hero** — one-line reason to use it, and the search box as the primary
   action. The fashion-coded visual is a small stack of swaying swing tags
   (pure CSS), not a literal garment.
2. **Brand lookup** — the core. Search resolves to a "care label" brand card:
   parent company, segment, HQ, an FTI disclosure score where verified, and a
   row of disclosure signals each labelled honestly.
3. **Compare** — line up to three brands tag to tag.
4. **The directory** — every tracked brand as a compact tag, filterable by
   segment and Australian relevance, sortable by score / recognition / segment.
5. **What the signals mean** — the load-bearing explainer: transparency is not
   performance, the parent company matters, Scope 3 is where the weight sits.
6. **Research backlog** — honest about the gaps, links to the editable CSV.

## Honesty rules

- **No fictional brands.** Every company is real, grouped under its real parent
  (Gucci → Kering, Uniqlo → Fast Retailing, The North Face/Vans/Timberland →
  VF Corporation, and so on).
- **No invented metrics.** The only quantified signal is the Fashion
  Transparency Index 2023 score, and only where a specific published figure was
  verified (Gucci 80, Kmart AU 76, Target AU 76, H&M 71, The North Face 66,
  Timberland 66, Vans 65). Everything else reads "Needs research".
- **We label, we do not rank.** Statuses are Disclosed / Partly disclosed /
  Parent-level only / Not found / Needs research. No "good", "bad", "ethical" or
  "sustainable" is attached to any brand.
- **The tracker is real.** `public/data/fashion-brands.csv` is the editable
  research document; `src/fashion/data.js` is what ships.

## Design language

Editorial and premium, coded to fashion through the **garment care label** and
the **swing tag**: monospaced data rows (JetBrains Mono), punched holes and
string, hard ink borders with offset shadows, no rounded cards, no gradient
blobs. Archivo for display, Instrument Serif for editorial asides. Palette is
calico ground, vat indigo accent, madder for section indices.

## Brand logos

Every company shows its **real logo**, loaded at runtime from a logo CDN
(`LOGO_CDN`) keyed by the brand's web domain (`BRAND_DOMAIN` in `data.js`), and
framed in a small care-label tile by the `BrandLogo` component. Corporate-group
cards show the real parent logo via `GROUP_DOMAIN`.

Where no domain is on file, or a logo fails to load, the tile falls back to a
generated **woven-label monogram**: derived from the brand's own data
(`deriveMonogram()`), set in a segment-specific typeface with a segment-coloured
stitch line (`SEGMENT_STYLE`). This guarantees every brand (present or future)
always has a mark, and keeps the fallback inside the calico / indigo / madder
palette. A short `MONO_OVERRIDES` map covers houses whose established lettermark
differs from the plain initials (Gucci GG, Saint Laurent YSL, and so on).

`LOGO_CDN` is a single swap-point: `logo.clearbit.com` needs no API key; moving
to a keyed provider later changes only that line. The marks appear on the
directory tags, the lookup card, the compare table, the corporate-group cards,
the autocomplete, and the hero swing tags.

## Interaction and access

- Search is forgiving: partial, lowercase, alias and parent-company aware, with
  keyboard-navigable autocomplete (arrow keys, enter, escape).
- One source of truth: selecting a brand anywhere (hero, lookup, directory,
  example chips) loads it into the lookup card and scrolls to it.
- No canvas, no WebGL, no drag physics. The old spinning cloth hero and its
  runaway rotation are gone. The only motion is the CSS swing-tag sway, which is
  disabled under `prefers-reduced-motion`.
- Skip link first, labelled inputs, `aria` roles on the combobox/listbox,
  decorative visuals `aria-hidden`.

## Product depth

- **Deep-linked state.** The selected brand and the compare set live in the URL
  hash (`#brand=gucci&compare=zara,h-m`), so any lookup is shareable and the
  back button works. A brand card has a copy-link button.
- **Corporate group lens.** The parent name on every card is a link, and the
  directory has a Groups view: LVMH, Kering, Inditex, VF and the rest shown as
  cards listing the brands they own with each brand's score and a mean. This is
  the "read the parent, not the brand" thesis made explorable.
- **Sister brands.** A card lists the other labels under the same owner as
  chips with their scores, so you can hop across a portfolio.
- **Compare table.** Up to three brands aligned in one table, row by row
  (parent, segment, HQ, FTI bar, then each disclosure signal).
- **Directory tools.** Free-text filter, segment chips with live counts,
  Australian and Scored-only toggles, four sort orders.
- **Wayfinding and polish.** A fixed section rail tracks the active section;
  `/` (or Cmd/Ctrl+K) focuses search from anywhere; recently viewed brands
  persist in localStorage; sections reveal on scroll, disabled under
  reduced motion.

## Making it useful in the hand (v3)

Informed by a look at the wider tool landscape (Good On You, Baptist World Aid's
Ethical Fashion Guide, Fashion Revolution, and the ACCC's greenwashing
guidance):

- **Dig deeper.** Every brand card links out to independent second opinions and
  the primary sources: the brand's own report, its Good On You rating
  (`directory.goodonyou.eco/brand/<slug>`), Baptist World Aid's Australian
  ethical-fashion score, and the Fashion Transparency Index. Openweave is a
  launchpad; it links, it never restates another service's rating as its own.
  Note: Baptist World Aid moved from A-F letters to a score out of 100 in 2022,
  so we link to the guide rather than assert a grade.
- **Before you buy.** A practical, per-brand checklist built only from what is
  on file (ownership, the FTI score, general guidance). No invented metrics: it
  tells you what to check, not what to conclude. This is the "what to research
  before buying" job, made concrete.
- **Claim check.** A greenwashing utility grounded in the ACCC's eight
  principles (aligned with the EU, UK and US equivalents). Paste any marketing
  claim and it flags the vague and absolute terms regulators single out and the
  qualifier each demands. It reads only what you paste and judges no real brand.
- **Form.** An at-a-glance stat band under the hero, and a dark editorial
  spotlight band that states the ownership-concentration fact in one line, for
  pacing and contrast against the calico ground.

All additions hold the honesty rules: no invented metrics, no fictional brands,
link out rather than overclaim, and static-site-safe (every integration is a
link or a baked dataset, never a runtime API call).

## More real data and a materials lens (v4)

Another research pass (The Fashion Pact signatory list, B Lab's B Corp
directory, Good On You's method, Baptist World Aid, and the Higg MSI debate):

- **Commitments and memberships.** Each brand card now shows verified industry
  memberships: **The Fashion Pact** (the CEO-led climate/biodiversity/oceans
  coalition, 23 signatories in this set, with Hermès marked as having left in
  2023 and LVMH correctly absent) and **Certified B Corp** (Patagonia, plus the
  Australian labels R.M. Williams and Camilla). These are membership signals,
  not performance, and the copy says so. Both are directory filters.
- **More Australian brands.** Added R.M. Williams (Tattarang), Zimmermann
  (Advent International), Camilla, Lorna Jane and Bonds (Hanesbrands, now
  Gildan) with verified ownership, taking the set to 61.
- **Materials.** A fibre-level guide for the "before you buy" job: the common
  fibres with an honest "in its favour / what to watch" for each, and a
  deliberate refusal to crown a winner. It names the Higg Materials
  Sustainability Index controversy (synthetics scored well partly because
  microplastic and ocean pollution were left out; regulators in Norway and the
  Netherlands paused its consumer use in 2022) rather than parroting a single
  ranking.
- **Sources.** Good On You, Baptist World Aid, The Fashion Pact, B Lab and the
  ACCC guide are now cited in the footer.

## Owning the white space + reference-led form (v5)

A competitor teardown (Good On You, Remake, Fashion Checker, Wikirate, Ethical
Consumer, Project Cece) found the same gap in every rival: none of them lead
with honest, dated corporate-ownership provenance, and none expose their own
data freshness. Plus a design study of the seven reference sites (Madam
Speaker, GO-SEE, Synthesis Capital, 2-TIMES, Your Creative, CoLabs, House of
Gucci) for transferable mechanics, not visuals.

- **Ownership provenance.** Brand cards now carry a verified ownership line
  (who owns it, who owned it before, when it changed hands, listed vs
  private-equity). This is the category's white space, and the tool's ownership
  lens is built to own it. Facts only; brands without a confirmed note omit
  the line.
- **Freshness stamp.** Every card states "Ownership and memberships verified as
  of {date}" — the one thing no competitor exposes.
- **Regulation radar + certification decoder.** In the signals section: a
  forward-looking radar of the rules that will change what brands must disclose
  (EU Digital Product Passport ~2027-28, EU Empowering Consumers Directive from
  Sept 2026, France's Coût Environnemental), and a decoder of what common
  certifications actually verify (and their edge). Note: the EU Green Claims
  Directive was shelled in 2025, so the claim-check copy no longer treats it as
  live; EmpCo (offset-based "carbon neutral" and self-made labels become red
  flags) is referenced instead.
- **SBTi link-out.** "Dig deeper" now includes the SBTi Target Dashboard so a
  brand's science-based-target status can be checked at source (we link, we do
  not assert a status we cannot verify).

## Real numbers, ingested from primary sources (v6)

Christopher supplied the primary documents (in `docs/data-sources/`), which
unlocked the biggest honesty upgrade yet: replacing "Needs research" with
verified figures read straight from source.

- **FTI 2023 scores for 51 of 61 brands.** Read from the Fashion Transparency
  Index 2023 report's own "Final Scores" table (Fashion Revolution). The top of
  the table matched the seven scores already verified, confirming the read.
  Brands Fashion Revolution did not score individually (Loewe, COS, and several
  private Australian labels) stay "Needs research". The research backlog fell
  from ~54 brands to 8.
- **SBTi climate targets for 50 brands.** Read from the SBTi "Companies Taking
  Action" export. A validated near-term target upgrades the climate-target
  signal to Disclosed (brand-level) or Parent-level only (group-level), and
  shows an "SBTi near-term target" badge. Honest nuance preserved: Gucci's
  target is Kering's; Shein has a validated target but a transparency score of 7.
- **Deliberately NOT used.** The Wikirate "FTI 2025" CSVs were left out: their
  values are on an ambiguous scale and contradict the published 2023 figures, so
  they read as partial/in-progress data, not an authoritative index. Preferring
  "Needs research" over a confident-looking guess is the whole point.
- Sources are filed and documented in `docs/data-sources/README.md`.

## Wider universe + airtight attribution (v7)

- **97 brands, 87 with verified FTI 2023 scores.** Expanded from 61 with a batch
  of household names read from the same FTI 2023 report (Converse, UGG, Dr.
  Martens, Marks & Spencer, Michael Kors, Versace, Diesel, Guess, Mango,
  Superdry, Decathlon, Champion, Reebok, Kathmandu, Armani, Hugo Boss, OVS and
  more), each with a verified parent and, where confirmed, SBTi and Fashion Pact
  status. Only 8 brands remain "Needs research".
- **Attribution, because facts must be credited, not claimed.** A "Data and
  attribution" block in the footer states plainly that Openweave reproduces
  published figures with attribution and claims none as its own (FTI © Fashion
  Revolution CIC; SBTi © SBTi; marks belong to The Fashion Pact, B Lab and the
  brands), that it is independent and non-commercial, and that every figure
  links to its source. Each score also carries its source inline, and the CSV
  tracker has an attribution header.
- **No redistribution of copyrighted reports.** The full FTI, What Fuels
  Fashion and Baptist World Aid report PDFs are deliberately NOT stored in the
  repo, only cited and linked; `docs/data-sources/README.md` records where each
  figure came from and where to download the originals. Only the openly
  published SBTi company dataset is kept as working provenance.
- Search ranking fixed so exact aliases win (e.g. "m&s" resolves to Marks &
  Spencer, not a substring match on Hermès).

## Full FTI 2023 coverage (v8)

- **258 brands, 248 with a verified FTI 2023 score.** Extended to the near-full
  Fashion Transparency Index 2023 universe (all 250 ranked brands and retailers
  bar a couple of name-clash duplicates), read from the report's "Final Scores"
  table. Names and parents come from the report's A-Z; segment, HQ and
  recognition are classified from public knowledge (facts, not invented
  metrics). Only 8 private/unscored labels remain "Needs research".
- **Commitments extended honestly.** SBTi status added for the new batch only
  where the company name matched the SBTi export exactly (fuzzy matches were
  discarded, so no false positives): 111 brands now carry an SBTi target, 29 the
  Fashion Pact, 4 a B Corp (adding Chloé). Grocery and department retailers that
  FTI assesses for apparel (Walmart, Carrefour, Kohl's, Nordstrom, etc.) are
  included and filterable under "Department & value".
- The source stays cited, never redistributed: the FTI report PDF was pulled
  from git history only to read the scores, and is not committed back.
- **Form, reference-led and restrained.** A numbered section rail with `04 / 07`
  progress (Your Creative); one settle curve `cubic-bezier(0.16,1,0.3,1)` on all
  reveals (2-TIMES); a dashed sewn-edge on the brand card so it reads as a woven
  care label (Madam Speaker); claim verdicts render the pasted claim marked up
  like an annotated record, disputed phrases underlined in madder (Madam
  Speaker); and native `<details>` for the claim methodology (CoLabs). No
  WebGL, no gradients, all motion reduced-motion-gated.
