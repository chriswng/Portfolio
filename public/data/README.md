# fashion-brands.csv — Cost Per Wear research tracker

This is the human-editable research tracker behind the Cost Per Wear fashion
brand transparency lookup (`/fashion/`). It exists so gaps can be filled in
over time, from checked sources, without touching the app code.

## What is verified vs pending

- **Verified now:** `brand_name`, `parent_company`, `segment`,
  `country_or_region`, `user_recognition_level`, and the sustainability
  report landing page. These are stable public facts.
- **The one quantified signal:** `transparency_score` is the Fashion
  Transparency Index (FTI) 2023 score from Fashion Revolution, where a
  specific published figure could be verified. Verified as of this commit:
  Gucci 80, Kmart Australia 76, Target Australia 76, H&M 71, The North Face
  66, Timberland 66, Vans 65. Temu and The Iconic are confirmed **not
  assessed** by FTI 2023.
- **Pending (`Needs research`):** every other FTI score, plus all the
  per-field disclosure columns (`climate_target_summary`,
  `scope_1_2_disclosed`, `scope_3_disclosed`, `materials_notes`,
  `supply_chain_notes`, `circularity_notes`). These are honestly blank until
  a source is confirmed. Nothing here is invented.

## Columns

| Column | Meaning |
|---|---|
| `brand_name` | Brand as consumers know it |
| `parent_company` | Real corporate parent / reporting group |
| `segment` | Market segment |
| `country_or_region` | Headquarters |
| `user_recognition_level` | `high` / `medium`, rough familiarity |
| `ownership_provenance` | Short verified ownership history (who owns it, when it changed hands) |
| `fashion_pact` | Fashion Pact signatory / former signatory (verified) |
| `certified_b_corp` | Certified B Corporation (verified) |
| `sustainability_report_url` | Official sustainability/ESG landing page |
| `annual_report_url` | Annual/financial report (to research) |
| `transparency_source` | Where the transparency score comes from |
| `transparency_score` | FTI 2023 score 0–100, or `Needs research` / `Not assessed` |
| `climate_target_summary` | Public, dated emissions target (to research) |
| `scope_1_2_disclosed` | Own-operations & energy emissions disclosure |
| `scope_3_disclosed` | Supply-chain emissions disclosure |
| `materials_notes` | Reported fibres/materials |
| `supply_chain_notes` | Published supplier/factory list |
| `circularity_notes` | Repair / resale / take-back / recycling |
| `source_quality` | How solid the cited value is |
| `needs_manual_research` | `yes` / `no` |
| `notes` | Free text / context |

## How to update

1. Fill a cell with a **sourced** value and record the source in `notes`
   (a URL and the year). Never guess a number.
2. To make a confirmed value show on the live page, mirror it into the
   canonical dataset at `src/fashion/data.js`:
   - FTI scores go in the brand's `fti` field (plus an `ftiNote`).
   - Per-field statuses use the ids in `STATUS`: `disclosed`, `partial`,
     `parent`, `notFound`, or `research`.
3. Re-run `npm run build`. The page reads only from `data.js`, so this CSV
   is the working document and `data.js` is what ships.

Keep the two in sync. When in doubt, prefer `Needs research` over a
confident-looking guess. The whole point of the tool is that it does not
overclaim.
