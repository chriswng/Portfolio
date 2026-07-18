# Sevenfold — v2 design notes

Not built or bundled (plain `.md`). The record of what the rebuild took from
each reference, the motion system, and how the brief's constraints are met.

## References — what I took (a mechanic, not a screenshot)

One extraction each: a layout structure, a motion curve, a cursor behaviour, a
type treatment, or a colour logic. Studied for how they *work*, then rebuilt in
this page's own material (textile, not their pixels).

| Reference | What I took | Where it lives here |
|---|---|---|
| **mesh3d.gallery / the-state-of-the-gallery** (primary) | **Layout structure.** A "state of" report that treats data as the exhibition: one continuous scroll, each measure given its own room, the frame established then leaned off-centre. | The whole page is one continuous world; `.fs-sec-inner` never centres, it leans module by module. The Road (m3) is a pinned, full-bleed "room". |
| **bilalgurkansanli.com / pro-mode** | **Motion curve.** A hard, confident *catch* on interaction — response is instant, then eases; no soft 300ms fade. | The `--grab` curve `cubic-bezier(0.18,0.9,0.12,1)`: cursor-ring press, chip `:active`, the cloth node snapping to the pointer. |
| **wforwumbo.com** | **Cursor behaviour.** The cursor is a tool that names itself — it changes word and shape over each zone. | `CursorLayer`: a ring plus a word that reads `grab / stretch / pour / rub / scrub / weigh` from `data-cursor` on the zone under it. |
| **tekatekistudios.com** | **Texture.** Surface is never flat digital white; a woven/paper grain sits under everything at low opacity. | Body ground is a woven calico (repeating thread gradients + faint dye-bleed); `.fs-tex` is a fixed feTurbulence paper grain at 5%. |
| **meech213.com** | **Type treatment.** Oversized display set tight and cropped, mixed with an italic serif annotation voice. | Archivo 900 headlines at `clamp(...,10.5vw,8.6rem)` line-height 0.9; Instrument Serif italics for asides (`.fs-sub`, rig reads). |
| **seve.app** | **Motion curve.** Weight coming to rest with a small overshoot, like a hung object settling. | The `--settle` curve and the CPU springs: the verdict beam, the travelling garment landing in each seat, swatch lift. |
| **clothing-network.de** | **Layout structure.** An editorial grid built to be broken — content deliberately misaligned row to row. | Two named grid-breaks: the Lab (m2) head shoved right off its rig column; the Field (m5) plot bled to the right viewport edge. |
| **permianworld.com** | **WebGL as the ground, not an ornament.** A live simulated surface you move through, reacting under the pointer. | `ClothField`: a real Verlet cloth (CPU sim, `ogl` draw) as the hero surface — grab it and the weave stretches with fold light and shadow. |
| **appsignal.com** | **Colour logic + data type.** Restrained ground, one accent that only appears to mean something; monospace for every figure. | Calico ground, indigo used only for live/selected/strained states (never decoration); JetBrains Mono on every number, labelled once as indicative. |

## Motion — three curves, three jobs

Nothing linear, nothing a stock 300ms ease. Different elements move at
different rates. The CPU springs in `FashionApp` and `ClothField` are the
physical extension of the same three intents.

- **grab** `cubic-bezier(0.18, 0.9, 0.12, 1)` — the instant of catching: quick
  to respond, then eases off. Press, pick-up, node-snap.
- **settle** `cubic-bezier(0.34, 1.56, 0.64, 1)` — coming to rest: a small
  overshoot, like weight finding its hang. Landings, the verdict.
- **travel** `cubic-bezier(0.22, 1, 0.36, 1)` — moving across distance or
  revealing: long, unhurried, no bounce. Section reveals, the garment's transit.

## Modules a still frame can't capture

- **Cloth (hero).** Grab the weave; it stretches with fold light/shadow and
  indigo bleeds along the pull, then springs back. Ambient breeze ripples it.
- **The Lab (m2).** Stretch frays and recovers by fabric; rub sheds visible
  microfibres for polyester, barely for linen; pour absorbs or beads; bury
  decays over scrubbed years. The animation *is* the data.
- **Cut & make (m1).** The total is grabbable — drag it down and the model
  solves backwards for which single decision would land it there.
- **The Verdict (m7).** Factor tags fall onto a balance and it settles under
  spring physics; you feel the ruling approaching before it lands.

## Craft

- 60fps target with particles: cloth sim is ~800 nodes / 3 constraint
  iterations, strain buffers hoisted (no per-frame allocation); every canvas
  and the cloth pause off-screen via `IntersectionObserver`.
- `prefers-reduced-motion`: the cloth settles to a static drape (not blank);
  loops stop; reveals become instant. A working static site, not a disabled one.
- Keyboard: rail, chips, sliders and scrub targets are focusable with a visible
  indigo focus ring (weld on dark sections).
- Touch: stretch, rub, pour, scrub and cloth-grab are all pointer-events, so
  they work the same on touch.

## Chrome bans honoured

No rounded cards, no soft drop shadows (hard letterpress ink offsets instead),
no glassmorphism, no gradient blobs, no icon library, no emoji, no Tailwind
greys (neutrals are tinted toward the textile hues), no purple.
