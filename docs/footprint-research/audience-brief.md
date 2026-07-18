# Life Footprint audience brief

One page, July 2026. Written before the audience-first build on this page and
used to decide what shipped. Every change in the accompanying PR names one of
these three audiences; anything that served nobody was cut or not built.

## Audience 1: assessors

Hiring managers, prospective clients and sustainability peers deciding in
under three minutes whether Chris is rigorous and can communicate.

- **Entry point:** the profile nav, a LinkedIn post, or a CV link. They land
  cold on the reveal story.
- **Job to be done:** "Show me evidence of rigour and communication, fast."
  They will never run an audit and never come back.
- **Single action we want:** reach the basis of preparation, believe it, and
  contact Chris (or return to the profile warm).
- **What blocked it:** the story asks for two to three minutes before the
  dashboard exists; the only exit was a generic skip that dumps them at the
  top of a long dashboard with no curated path. The method sat at section 05
  with nothing pointing to it, and the page had no contact action at all. The
  strongest evidence (cited factor engine, exclusions named, market survey)
  was the hardest content to reach.
- **What shipped for them:** a 45-second lane. A quiet "here to assess the
  work" link on the story cover and intro jumps straight to a skim strip:
  four cards (the number, the engine, the plan, the method) that show the
  craft in one screen each and link deeper, ending in a contact row with a
  mail action and the profile link. Plus the assurance-style audit pack
  download: the artefact an assessor recognises.

## Audience 2: people who run their own audit

Visitors who take the guided audit, mostly arriving from Chris's network.

- **Entry point:** "Start your own audit" on the cover, intro or outro.
- **Job to be done:** curiosity first ("what is my number?"), then "what
  should I actually do?", then, for a few, "keep me honest over time".
- **Single action we want:** finish the audit, act on one plan item, and come
  back when the next bill lands or the year rolls over.
- **What blocked it:** the page was a superb one-off. Nothing changed between
  visits: no new year to open, no sense that data ages, no reason to return
  beyond editing a static log. The audit they built quietly went stale.
- **What shipped for them:** multi-year audits. The financial year just
  rolled (FY2026 closed on 30 June), so the page now closes a finished year,
  archives it, opens the next one against the pinned factor set, and shows
  the years side by side. A freshness note says how old the newest entry is
  and what to fetch next. Hotel nights and the spend screening panel turn two
  named boundary gaps into numbers they can act on. The uncertainty range
  rewards better data quality with a visibly tighter band: logging a real
  bill now does something.

## Audience 3: arrivals from a shared card or link

People who tapped a LinkedIn banner or a share-snapshot link.

- **Entry point:** a snapshot URL with the summary in the fragment, or the
  page URL under a shared card. Ten seconds of attention, likely on a phone.
- **Job to be done:** "What is this, and whose number am I looking at?"
- **Single action we want:** understand it in one screen, then either start
  their own audit or skim to the method.
- **What blocked it:** the link preview was the generic portrait card from
  the profile page, so the share said "personal website" rather than "carbon
  audit"; the snapshot banner explained itself only after the click.
- **What shipped for them:** a footprint-specific social card (per-page OG
  image and copy) so the preview says what the page is before the click, and
  a provenance line on the snapshot banner naming the method behind the
  numbers, with a link straight to it.

## Cuts

- The "Worked example" mode button when no personal audit exists: it offered
  a switch to the only mode you were already in. Every first-time visitor saw
  a control that did nothing. Cut; the switcher now appears only once there
  are two audits to switch between.
- The "planned 2030" number on the shared-snapshot banner: the one figure on
  a ten-second surface that could not explain itself (it encodes the
  sharer's plan toggles, which the viewer cannot inspect). Cut from the
  banner; the share payload keeps it for compatibility.
- Everything else earned its place against one of the three audiences above,
  including near-duplicates we examined and kept: the intro replay chip is
  the only replay affordance for returning visitors, and the intro
  "See the worked example" anchor is the skipper's orientation cue.
