# Prompt — Improve the portfolio with the imported design skills

Paste the block below into a fresh Claude Code session in this repo. It drives an
audit-first, motion-aware improvement pass that leans on the taste, emildesign,
and impeccable skills now installed under `.claude/skills/`.

Before running it, decide **one target** — the whole site, or a single page
(`/`, `/work/`, `/footprint/`, `/footprint/method/`, `/fashion/`). A scoped pass
produces sharper work than "improve everything".

---

## The prompt

> You are improving Christopher Wang's portfolio (React 18 + Vite, four+ pages,
> deployed to GitHub Pages). Read `CLAUDE.md` and `PRODUCT.md` first and treat
> every convention there as a hard constraint — especially: all editorial copy
> lives in `src/data/` (never inline in JSX), design tokens live in `:root` in
> `src/styles/global.css`, the footprint method page must stay in sync with any
> engine/factor change, and all copy is Australian English with no em dashes and
> no en dash clause separators.
>
> **Target for this pass:** <the main profile page `/` — change this line>.
> Do not touch other pages unless a shared component forces it.
>
> Work in four phases, using the installed skills, and **pause after Phase 1 for
> my sign-off before changing any code.**
>
> **Phase 1 — Audit (read-only).** Invoke `redesign-existing-projects` and
> `design-taste-frontend` to audit the target. Identify generic-AI / templated
> patterns, weak hierarchy, spacing and typographic problems, and anything that
> reads as "slop". Separately invoke `find-animation-opportunities` to list, with
> exact proposed values, motion that is missing or that should be removed. Then
> run `impeccable`'s `critique` / `audit` for a craft-level read. Deliver one
> prioritised, deduplicated list: each item = problem, why it matters, proposed
> fix, effort, and risk. Do not write code yet.
>
> **Phase 2 — Implement.** After I approve the list, implement the high-value
> items. For visual/layout/typography work, follow `design-taste-frontend`,
> `high-end-visual-design`, and `impeccable`'s `polish` / `craft`. Keep edits
> inside existing tokens and component structure; put new copy in `src/data/`.
> Respect the register — this is a premium editorial portfolio for a
> sustainability advisor, not a flashy SaaS landing page. Use motion sparingly.
>
> **Phase 3 — Motion.** For any animation work, follow `apple-design` and
> `emil-design-eng` for the craft bar, and use `improve-animations` to plan and
> `review-animations` to check. Every animation must be gated on
> `prefersReducedMotion()` and cursor-only interactions on `canHover()` (from
> `src/utils/media.js`); canvas/WebGL loops must pause off-screen via
> `IntersectionObserver` and clean up on unmount.
>
> **Phase 4 — Verify.** Run `npm run build` (the only automated gate) and fix any
> failure. Confirm: skip link still first, `aria-current` on the active nav link,
> decorative canvases `aria-hidden`, purely visual motion hidden from assistive
> tech, no horizontal overflow, contrast preserved. If you changed the footprint
> engine or factors, update `/footprint/method/`. Summarise what changed and why,
> and flag anything you deliberately left alone.
>
> Constraints: no new heavy dependencies without asking; keep neutrals tinted
> toward the matcha brand hue (do not "restore" cool-blue slate); titles never end
> in a full stop. Show me diffs before committing.

---

## Skill quick-reference

Installed under `.claude/skills/` (invoke with the Skill tool or `/<name>`):

| When you want to… | Skill |
|---|---|
| Audit an existing page and strip generic-AI patterns | `redesign-existing-projects`, `design-taste-frontend` |
| Ship non-templated layout / type / hierarchy | `design-taste-frontend`, `high-end-visual-design` (soft), `impeccable` |
| Craft-level critique, polish, harden a UI | `impeccable` (`critique`, `polish`, `craft`, `harden`) |
| Find where motion is missing or wrong (read-only) | `find-animation-opportunities` |
| Plan a motion overhaul, then review it | `improve-animations`, `review-animations` |
| Apple-grade gesture / spring / material craft | `apple-design`, `emil-design-eng` |
| Name a motion effect you can only describe | `animation-vocabulary` |
| Generate design references / brand boards (images only) | `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit`, `image-to-code` |
| A specific aesthetic direction | `minimalist-ui`, `industrial-brutalist-ui`, `high-end-visual-design`, `gpt-taste` |

Guardrail: the imagegen and brutalist/minimalist "direction" skills change the
*look*. This portfolio already has a committed premium-editorial identity, so use
them for exploration only — the default working pair is `redesign-existing-projects`
+ `impeccable`, kept inside the existing token system.
