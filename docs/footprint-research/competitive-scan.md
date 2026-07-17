# Consumer carbon-footprint app market scan

Research input for the Life Footprint page (`/footprint/`). Compiled July 2026
from vendor sites, app stores, methodology documents and press. The condensed
version of this ships on the page in the "Why this exists" section; this file
is the evidence trail.

Hypothesis tested: the market is crowded but shallow. Most consumer apps are a
one-off quiz followed by an offer to buy offsets, wrapped in gamification.
Almost none publish transparent cited methodology, track a person's own
activity data over time, use Australian (DCCEEW NGA) emission factors, or
build a ranked abatement plan.

## Tool-by-tool survey

| Tool | Platform / price | Method transparency | Quiz vs tracking | Factors / AU NGA? | Reduction pathway | Status 2026 |
|---|---|---|---|---|---|---|
| Earth Hero (earthhero.org) | iOS/Android, free non-profit | Partial: in-app source links, no factor workbook | Survey, re-estimated as answers update | Volunteer-researched, IPCC targets. No NGA | Large action library with targets; no cost ranking; no offset push | Active, ~150k users |
| Klima (klima.com) | iOS/Android, offset subscription | Blog "deep dive", no tables | One-off ~10-question quiz | "Vast pool of sources". No NGA | Offsets are the product | Absorbed by Wren, 1 May 2025 (wren.co/blog/wren-klima-acquisition) |
| Capture (capture.work) | iOS/Android, freemium + offsets | Low, marketing only | GPS transport tracking + diet survey | IPCC/UNFCCC averages. No NGA | Insights + offsets | Active, pivoted B2B |
| Aerial (aerial.is) | iOS, free + offsets | Low | Semi-automatic (inbox scanning for travel receipts) | Own travel factors. No NGA | Offsets (incl. NFT offsets era) | Dormant: no product news since ~2022 |
| EcoGuide (indie) | iOS, freemium | None found | Quiz + manual logging | Unknown. No NGA | Tips + offset links | Active, minor |
| CoolClimate (coolclimate.berkeley.edu) | Web, free (UC Berkeley) | High: peer-reviewed (Jones & Kammen), but CEDA factor database is licensed, not open | One-off detailed survey | CEDA consumption-based, US benchmarks. No NGA | Best-in-class: "Take Action" ranks actions by GHG and $ saved, separately, never $/t | Active |
| WWF UK (footprint.wwf.org.uk) | Web, free | High: published methodology PDF (2021), Defra/ONS consumption accounts | One-off 24-question quiz | Defra/ONS UK. No NGA | Generic tips | Active |
| Giki Zero (giki.earth) | Web/app, free + B2B | Medium: claims, no workbook | Survey + step tracking | UK Defra-based. No NGA | Steps ranked by impact level; no cost view | Active, employer-focused |
| Commons, ex Joro (thecommons.earth) | iOS/Android, free + rewards | Medium: blog-level, spend factors for 180 categories | Genuine ongoing tracking via linked bank cards (spend proxy) | Own US spend intensities. No NGA | Nudges, challenges, cashback (pivoted from offsets) | Active (Joro→Commons was a 2023 rebrand, not a shutdown) |
| Wren (wren.co) | Web, offset subscription | Medium: calculator on CoolClimate/World Bank; project docs detailed | One-off quiz | Licensed CoolClimate/CEDA. No NGA | Offsets are the product | Active, consolidating the category (absorbed Climaider, Tomorrow's Air, Klima) |
| Carbon Footprint Ltd (carbonfootprint.com) | Web, free + offsets/consulting | Medium-high: FAQs state UK Gov 2025 factors incl. country grids | One-off estimate | UK DEFRA + country grid averages (AU average, not state NGA) | Ends at offsets | Active |
| ClimateHero (climatehero.org) | Web, free + offset subscription | Medium: data-sources page, ~30 public sources | One-off 5-minute quiz | Mixed public. No NGA | Tips + "climate positive" subscription | Active |
| Doconomy / UNFCCC Lifestyle Calculator | Web (white-label to banks) | High: published Methodology Handbook PDF | One-off ~10-minute quiz | UNFCCC-curated, country-differentiated (AU country average) | Habit suggestions | Active |
| One Small Step (AU, onesmallstepapp.com) | iOS/Android, free + enterprise | Medium: methodology post; licenses Tomorrow co. consumption model + ABS census | Habit programmes, self-report; no bill/odometer ingestion | AU-localised, NOT DCCEEW NGA | Strongest consumer pathway found: roadmap to 2 t/yr, actions sortable by money saved OR carbon (never $/t) | Active: ~100k downloads, ANU rollout Aug 2025 |
| Carbon Positive Australia (carbonpositiveaustralia.org.au) | Web, free (charity) | Medium-high: "how we calculated" disclosure, AU Government factors + ABS, updated annually | One-off survey | Australian Government (NGA-derived) + ABS | Tips, then reforestation donation | Active |
| Carbon Neutral (carbonneutral.com.au) | Web, free calculator (offset seller) | HIGH: 13-page public methodology PDF citing NGA Factors by vintage, GHG Protocol scopes, IPCC 8% aviation uplift. Closest thing to a consumer basis of preparation | One-off estimate | DCCEEW NGA (national weighted average), ABS, UK BEIS freight | Ends at offset purchase | Active |
| ClimateClever (climateclever.org) | Web app, AU; household tier + paid schools/business | Medium: blog explains location-specific government grid factors | Genuine bill tracking over time (the only AU consumer-adjacent tool doing this) | AU government grid factors (NGER-derived, state-based) | Action plans with cost-savings framing | Active; schools/business first, home tier secondary |
| CommBank Carbon Tracker (Cogo) | In-app, AU, free | Low-medium: no public factor docs | Ongoing spend-based tracking from real transactions | Cogo AU spend intensities. Not NGA | Category breakdown + in-app offsets | Active bank feature |
| EPA Victoria Australian Greenhouse Calculator | Web | Was high (published assumptions, CSIRO-developed) | Household scenario inputs | Australian factors | Educational scenarios | RETIRED ("no longer provided or supported by EPA") |

Also sighted: US EPA household calculator (publishes factors, US-only, one-off);
NMF.earth open-source footprint repo; a long tail of low-transparency indie
apps in 2025-26 roundups.

## The three sharp questions

**(a) Does any consumer tool publish factors and boundary like an
organisational GHG inventory?** Almost, but only at the web-calculator end:
Carbon Neutral (AU), WWF-UK, Doconomy/UNFCCC publish real methodology
documents; CoolClimate is peer-reviewed with licensed factors. All four are
one-off quizzes. No tool that tracks a person over time publishes its factors
or a boundary statement.

**(b) Does any consumer tool offer a personal marginal-abatement-cost view?**
No. CoolClimate ranks by tonnes and dollars separately; One Small Step sorts
by money saved or carbon impact, separately. Nobody divides one by the other,
treats upfront vs recurring cost, or draws the curve. Actual MACC tooling is
professional only (a US$149 Excel add-in; enterprise carbon platforms).

**(c) Is any consumer tool built on DCCEEW NGA factors?** Only static web
calculators run by offset sellers and charities (Carbon Neutral national
average; Carbon Positive Australia; ClimateClever for bills). No
store-distributed consumer app. One Small Step, the flagship AU app, licenses
an international consumption model instead. Nothing consumer-facing exposes
state-resolved NGA scope 2 factors, which matter more in Australia than
almost anywhere (SA 0.22 vs VIC 0.78 kg CO2-e/kWh).

## Verdict

The "crowded but shallow" hypothesis holds, with corrections: methodology
transparency is not absent, it just never co-occurs with tracking; Commons
and One Small Step are alive (contrary to shutdown hunches); and Australian
factors exist in web calculators. The precise whitespace the Life Footprint
page occupies: a published NGA-based basis of preparation + ongoing tracking
of a person's own activity data + an abatement plan priced in $/tonne,
together. The market found offsets easier to sell than method; the
consolidation of Klima into Wren (May 2025) and the retirement of EPA
Victoria's calculator both deepened the gap this page fills.
