# Openweave — primary data sources

Raw source material behind the Openweave fashion transparency tool
(`/fashion/`). This folder is not built or deployed; it is the provenance
record so the numbers on the page can be traced to a document.

The live dataset lives in `src/fashion/data.js`; the editable tracker is
`public/data/fashion-brands.csv`. Values below were read from these files and
copied in with the source cited. Anything not found here stays "Needs research".

| File | What it is | How it was used |
|---|---|---|
| `fashion-transparency-index-2023.pdf` | Fashion Revolution, Fashion Transparency Index 2023 (250 brands scored on public disclosure). | The "Final Scores" table (report p.45) was read to fill verified FTI 2023 scores for 51 of the tracked brands. These are the authoritative rounded percentages. |
| `sbti-companies-taking-action.xlsx` | Science Based Targets initiative "Companies Taking Action" export (near-term / net-zero validation status per company). | Companies with a near-term status of "Targets set" (validated) drive the SBTi badge and the climate-target signal, split brand-level vs parent/group-level. |
| `what-fuels-fashion-2024.pdf` | Fashion Revolution, What Fuels Fashion 2024 (climate-focused disclosure review). | Reference for the climate/decarbonisation framing. Not yet mined for per-brand values. |
| `baptist-world-aid-ethical-fashion-report-2024.pdf` | Baptist World Aid Australia, Ethical Fashion Report (companies scored out of 100 on worker rights and environment). | Australian second-opinion source, linked from each brand's "Dig deeper". Per-brand scores not yet ingested. |
| `wikirate-fti-2025-*.csv` | Wikirate export tagged "Fashion Transparency Index 2025" (Answer / Input Answer / Source). CC BY 4.0. | NOT used for scores: the values are on an ambiguous small scale and contradict the published 2023 figures, so they look like partial/in-progress community data rather than an authoritative published index. Kept for reference only. |

## Notes on honesty

- FTI 2023 scores are the published percentages, read from the report's own
  results table. Brands Fashion Revolution did not score individually (e.g.
  Loewe, COS, and several private Australian labels) are left "Needs research".
- SBTi status is a membership/validation signal, not a performance measure. A
  parent-level target is labelled as such; the brand's own detail may differ.
- The Wikirate 2025 CSVs were deliberately not converted into scores. When in
  doubt, the tool prefers "Needs research" over a confident-looking guess.
