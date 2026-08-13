# Cost Per Wear — data provenance and attribution

This documents where every figure on the Cost Per Wear fashion transparency tool
(`/fashion/`) comes from, so the data can be traced and is properly credited.
The live dataset is `src/fashion/data.js`; the editable tracker is
`public/data/fashion-brands.csv`. Every figure on the page also links to its
source in the page itself.

## Principle

Cost Per Wear reproduces **published facts and figures with attribution** and
claims none of them as its own. Facts (a company's owner, a published index
score) are cited to their source. To avoid redistributing third parties'
copyrighted reports, the full report PDFs are **not** stored here; download them
from the official links below. Only the openly published SBTi company dataset is
kept in-repo as working provenance.

## Sources

| Data on the page | Source | Where to get it | Notes on use |
|---|---|---|---|
| Transparency score (0–100) | **Fashion Transparency Index 2023**, Fashion Revolution CIC | https://www.fashionrevolution.org/about/transparency/ | Scores read from the report's "Final Scores" table (2023 edition, p.45). Used as cited reference data with attribution; © Fashion Revolution CIC. Not redistributed here. |
| Climate-target status | **Science Based Targets initiative**, "Companies Taking Action" export | https://sciencebasedtargets.org/target-dashboard | Kept in-repo as `sbti-companies-taking-action.xlsx` (SBTi publishes this list for public use). A near-term status of "Targets set" drives the SBTi badge and climate signal. © SBTi. |
| The Fashion Pact membership | **The Fashion Pact** signatory list | https://www.thefashionpact.org/ | Membership fact, attributed. Marks belong to The Fashion Pact. |
| Certified B Corp | **B Lab** | https://www.bcorporation.net/ | Certification fact, attributed. "B Corp" is a B Lab trademark. |
| Ownership / provenance | Corporate filings and official brand ownership pages | (various, per company) | Matters of public record. |
| "Dig deeper" links | Good On You, Baptist World Aid (AU), Fashion Revolution | per link | Link-outs only; their ratings are theirs and are not reproduced here. |
| Claim-check rules | ACCC "Making environmental claims" guidance; EU/UK/US equivalents | https://www.accc.gov.au/business/environmental-claims | Educational summary of public guidance. |

## Files kept in this folder

- `sbti-companies-taking-action.xlsx` — the SBTi public company dataset,
  snapshot of 6 August 2026 (15,375 companies), kept as
  provenance for the climate-target signals shown on the page.

## Files intentionally not kept

- The Fashion Transparency Index 2023 report PDF, What Fuels Fashion 2024, and
  the Baptist World Aid Ethical Fashion Report are copyrighted publications.
  We use their published figures with attribution but do not redistribute the
  reports. Download them from the official links above.
- The Wikirate "FTI 2025" CSV exports (CC BY 4.0) were removed: their values are
  on an ambiguous scale and contradict the published 2023 figures, so they were
  not used. If needed again they can be re-exported from wikirate.org.

## Not affiliated

Cost Per Wear is an independent, non-commercial reference tool. It is not
affiliated with, sponsored by, or endorsed by any brand or organisation named.
Trademarks and report titles belong to their respective owners. If you own a
listing and something is wrong, it can be corrected.
