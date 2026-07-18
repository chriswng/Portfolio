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
