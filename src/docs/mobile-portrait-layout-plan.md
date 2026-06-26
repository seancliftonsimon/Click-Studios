# Mobile Portrait Layout Plan

Last updated: 2026-06-26

This plan makes Click Studios render and feel native in **mobile portrait
orientation** (target ~360–430px wide, e.g. iPhone / mid-range Android) without
regressing the desktop experience. It is written to be edited as we learn; treat
the phased steps as a working backlog, not a fixed contract.

**Scope (beta):** App shell, Writing, and Preproduction only. Filming,
Postproduction, Marketing, and Release are **out of scope** for now — those
phases aren't beta-ready, so their portrait pass is deferred (Steps 5 and the
Filming parts of later steps are parked below for when they are).

## Status Key

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

## Progress Overview

| Status | Step | Area | Goal |
| --- | --- | --- | --- |
| [x] | 0 | Foundations | Mobile tokens, viewport, breakpoint helper, test harness |
| [x] | 1 | App shell | Replace the crammed top bar with a mobile header + bottom phase nav |
| [x] | 2 | Writing | Stack the 3-column writing screen into one readable column |
| [x] | 3 | Cards | Make worker/product/tool cards touch-friendly and unclipped |
| [x] | 4 | Preproduction | Reflow the 3/9 grid and the 6-department PreproBanner |
| [~] | 6 | Popups & guidance | Popups already responsive via `v-dialog`; bottom-sheet deferred |
| [x] | 7 | Polish | Tap targets, scroll, and a device QA pass (375/393/412) |
| — | 5 | Filming (parked) | Out of beta scope — deferred until Filming is ready |

### What shipped (verified by screenshot at 375 / 393 / 412px)

- **App shell:** desktop top bar preserved at `mdAndUp`; at `smAndDown` a compact
  header (ticket mark + studio name + money chip + kebab for Save/Load/Reset) and
  a fixed `v-bottom-navigation` with the six phases (locked phases dimmed + lock
  icon). Toast is width-aware.
- **Writing:** the 3/6/3 grid stacks to one column at `xs`, write action +
  counters first; counter min-widths relaxed; write button / tool card stack.
- **Preproduction:** the 3/9 and 4/8 grids stack at `xs`; the six PreproBanner
  departments wrap to a 2-per-row grid (`cols=6 sm=4 md=2`) with separators.
- **Interactions confirmed:** write button increments words, kebab opens
  Save/Load/Reset, locked phase tabs are non-navigable, money/affordance states
  update live.
- **Popups (Step 6):** `PopupBase` uses `v-dialog`, which is already
  viewport-constrained on phones (verified with the welcome popup). A dedicated
  bottom-sheet treatment was deferred as polish to avoid risking the desktop
  modal — left as a follow-up.

## Design Principles

These keep the work aligned with the Ticket Booth design system and AGENTS.md.

- **One column, vertical flow.** Portrait is a tall, narrow stack. Columns that
  sit side-by-side on desktop should stack top-to-bottom on phones, ordered by
  importance (primary action first, supporting cards after).
- **Thumb-first.** Primary actions live in the lower half of the screen where a
  thumb rests. Minimum touch target is **44×44px**; spacing between tappable
  rows is at least 8px.
- **Native chrome.** Use a compact top header for identity/state and a fixed
  **bottom navigation** for phase switching — the pattern players already expect
  from mobile apps. Respect safe-area insets (notch / home indicator).
- **Shape over text.** Per AGENTS.md and the design system, lean on icons,
  color, progress, and position rather than adding labels to compensate for
  small screens. No eyebrow/kicker text.
- **No horizontal scroll.** Nothing should require sideways scrolling. Wide
  artifacts (timelines, department stacks) either wrap, collapse, or become an
  intentional horizontal carousel with snap.
- **Don't fork the app.** Prefer responsive props, breakpoint-aware classes, and
  shared tokens over a separate mobile component tree. One source of truth that
  adapts.

## Current State Audit

What exists today and why it breaks in portrait.

### App shell — `src/App.vue`

- A single horizontal `v-app-bar` holds: a fixed **240px** ticket logo, six text
  phase links (`Writing … Release`), an "Very early alpha" note, and three
  Save/Load/Reset buttons. At ~390px none of this fits; `.phase-label` is
  `overflow: hidden`, so nav items get clipped rather than reflowed.
- The shell wraps `v-app-bar` **and** `v-main` inside a `<v-row class="mb-0">`,
  which is structurally wrong for Vuetify's app layout and complicates spacing.
- `.image-container` has `flex: 0 0 240px; min-width: 190px` — a hard floor that
  alone exceeds half a phone's width.
- Global toast is pinned `top right`; on mobile it should be width-aware.

### Phase screens — fixed 12-col grids, no breakpoints

A repo-wide grep shows hardcoded `cols="…"` with **no** `sm`/`md` overrides:

- `WritingComponent.vue`: `cols="3" / cols="6" / cols="3"` three-up layout.
- `PreproductionComponent.vue`: `cols="3" / cols="9"`, then nested `4 / 8`.
- Many cards split internally `cols="5" / cols="7"` (worker, tool, genre cards).
- Phase containers use `padding-left/right: 5%` and `padding-top: 2.5%`, which
  waste horizontal space that portrait can't spare.

Because Vuetify keeps `cols="3"` at every breakpoint, these stay three-across on
a phone and collapse to unreadable slivers.

### Hardest surfaces

- `Filming/ViewFinder.vue` (579 lines): a `.side-by-side` row with an image
  container and **vertical** `v-range-slider`s. Needs a portrait reflow and
  touch-sized slider thumbs/tracks.
- `Prepro/PreproBanner.vue` (373 lines): six department bar-stacks laid out in a
  row inside `px-8`. Must become vertical sections or a snap carousel.
- `Filming/ShotTimeline.vue`: a horizontal timeline — make it wrap or scroll-snap.
- Writer/worker/product cards: dense two-column internals; verify tap targets and
  that costs/buttons don't clip.

### What's already fine

- `public/index.html` has `<meta name="viewport" content="width=device-width,
  initial-scale=1.0">` — correct, no change needed beyond optional
  `viewport-fit=cover` for safe areas.
- Vuetify 3 is installed, so `useDisplay()`, responsive grid props, and
  `v-bottom-navigation` / `v-navigation-drawer` are available.
- Ticket Booth tokens exist in `src/styles/variables.scss`.

## Target Architecture

### Breakpoint strategy

- Adopt Vuetify's breakpoints; treat **`xs` (<600px) as the mobile/portrait
  target** and `smAndDown` as the "compact" band where the bottom nav and single
  column apply.
- Read state with `useDisplay()` in component setup where logic must branch
  (e.g. render bottom nav vs. inline nav), and use responsive **grid props**
  (`cols="12" sm="6" md="3"`) for pure layout so most screens need no JS.
- Add a thin composable `src/composables/useResponsive.js` exposing
  `isMobile`/`isCompact` so components don't each re-derive breakpoint logic.

### Layout shell

```
┌───────────────────────────┐
│  Header (compact)         │  logo mark + studio name + money chip
├───────────────────────────┤
│                           │
│  <router-view>            │  single scrollable column, 16px gutters
│  (phase content stacked)  │
│                           │
├───────────────────────────┤
│  Bottom nav: ✎ 🎬 ✂ 📣 🎟 │  phase tabs, locked = dimmed + 🔒
└───────────────────────────┘
```

- Desktop keeps the current top bar; mobile swaps to header + bottom nav via a
  `smAndDown` switch in `App.vue`.
- Save/Load/Reset move off the main bar on mobile into an overflow menu
  (kebab in header) or a Settings sheet — they're infrequent and shouldn't eat
  thumb space.

### Mobile tokens (extend, don't replace)

Add to `src/styles/variables.scss`:

```css
:root {
	--cs-touch-min: 44px;     /* minimum tap target */
	--cs-gutter-mobile: 16px; /* phase content side padding on phones */
	--cs-stack-gap: 12px;     /* vertical gap between stacked cards */
	--cs-bottom-nav-h: 64px;  /* reserve space so content isn't hidden */
}
```

Replace percent phase padding with a token-driven value at `xs` so gutters are
consistent and don't scale with viewport.

## Phased Implementation

### Step 0 — Foundations

Goal: make the rest of the work cheap and verifiable.

- Add mobile tokens to `variables.scss` (above).
- Add `viewport-fit=cover` to the viewport meta and a `.safe-bottom` /
  `.safe-top` utility using `env(safe-area-inset-*)`.
- Add `src/composables/useResponsive.js` wrapping `useDisplay()`.
- Establish a QA harness: document how to test in Chrome DevTools device mode
  (iPhone SE 375px, iPhone 14 Pro 393px, Pixel 7 412px) and, where possible,
  capture before/after screenshots with the project's browser tooling.

Acceptance: tokens compile, composable returns correct `isMobile` across
breakpoints, build passes.

### Step 1 — App shell (`App.vue`)

Goal: a real mobile header + bottom phase nav; nothing clipped.

- Restructure so `v-app-bar` and `v-main` are **not** wrapped in a `v-row`.
- Mobile header (`smAndDown`): small ticket mark + studio name (truncating), and
  the most important live stat (money). Kebab menu → Save / Load / Reset.
- `v-bottom-navigation` with the six phases as icon+short-label tabs; locked
  phases render dimmed with a lock affordance and remain non-navigable (reuse the
  existing `*Disabled` computeds and router guard).
- Desktop (`mdAndUp`) keeps today's top bar unchanged.
- Make the toast width-aware on mobile (`location="top"`, full-bleed).

Acceptance: at 375–430px the header fits with no clipped nav; all six phases are
reachable/lockable from the bottom nav; desktop unchanged; build passes.

### Step 2 — Writing screen (`WritingComponent.vue`)

Goal: the first-run screen stacks into one clear column.

- Change the `3 / 6 / 3` grid to `cols="12"` at `xs`, keeping `md` values for
  desktop. Order for portrait: **WriteButton + counters first**, then product
  cards, then workers/staff.
- Resource counter row: allow money + word counters to wrap; ensure the word
  counter's `min-width: 260px` doesn't force overflow at 360px (drop to `100%`
  at `xs`).
- Replace `5%` side padding with `--cs-gutter-mobile` at `xs`.

Acceptance: no horizontal scroll at 360px; primary write action visible without
scrolling; counters legible; build passes.

### Step 3 — Cards (Writing first, pattern reused everywhere)

Goal: touch-friendly, unclipped cards.

- Audit `WorkerCard`, `ContractWorkerCard`, `WritingToolCard`, `GenreCard`,
  `PurchaseCard`, `WritersRoom*` for internal `cols="5/7"` splits — keep the
  split (it reads fine) but verify buttons meet `--cs-touch-min` and costs don't
  wrap awkwardly.
- Ensure every actionable button/row is ≥44px tall on mobile via a shared
  `.cs-tap` helper or button sizing at `xs`.
- Confirm card max-width = column width (no fixed pixel widths that overflow).

Acceptance: all primary card actions are ≥44px and tappable without mis-hits;
nothing clips at 360px.

### Step 4 — Preproduction (`PreproductionComponent.vue`, `PreproBanner.vue`)

Goal: reflow the densest management screen.

- Outer `3 / 9` and nested `4 / 8` grids → `cols="12"` at `xs`, stacked:
  pitching → progress bar → hire/investor → inspiration shop → banner.
- `PreproBanner`: turn the six side-by-side department bar-stacks into either
  (a) a vertical list of full-width department sections, or (b) a horizontal
  **scroll-snap carousel** with a position indicator. Recommendation: vertical
  list for clarity (matches "one column, vertical flow"); revisit carousel only
  if vertical feels too long.
- Drop `px-8` to the mobile gutter token at `xs`.

Acceptance: every department is reachable and operable in portrait with no
horizontal scroll (or an intentional, indicated carousel); progress remains
readable; build passes.

### Step 5 — Filming (`ViewFinder.vue`, `ShotTimeline.vue`) — PARKED

Out of beta scope. Deferred until Filming is beta-ready. Notes kept for later.

Goal: the most custom-laid-out screen works under the thumb.

- `ViewFinder.side-by-side`: at `xs`, stack the viewfinder image above the
  sliders, or convert the vertical `v-range-slider`s to a horizontal layout
  beneath the image — whichever keeps the image large and the slider thumbs
  reachable. Increase `track-size`/thumb hit area for touch.
- Ensure the image scales to column width (no fixed dimensions causing overflow).
- `ShotTimeline`: wrap chips or make it a scroll-snap strip with clear current-shot
  emphasis.

Acceptance: a player can aim the sound-band slider and wrap a shot one-handed in
portrait; image isn't cut off; no horizontal page scroll.

### Step 6 — Popups & guidance (`ui/PopupBase.vue`, `GuidedHintManager.vue`)

Goal: modals and hints feel native, not desktop-centered.

- Render popups as **bottom sheets** at `smAndDown` (slide up from bottom,
  full-width, rounded top, safe-area padding) instead of centered cards.
- Verify guided-hint anchors (`data-guidance-target`) still resolve when targets
  move into the bottom nav / stacked layout; reposition bubbles so they don't sit
  off-screen.
- Keep copy short (design-system rule).

Acceptance: popups are reachable and dismissible one-handed; hints point at the
right on-screen element after the layout changes.

### Step 7 — Polish & QA

- Sweep for remaining hardcoded widths, `%` paddings, and `overflow: hidden`
  clips introduced by stacking.
- Reserve `--cs-bottom-nav-h` at the bottom of scroll areas so content isn't
  hidden behind the nav.
- Tune motion to stay brief on mobile; confirm no layout shift on rotation
  (portrait is the target, but rotation shouldn't break).
- Device pass: iPhone SE (375), iPhone 14 Pro (393), Pixel 7 (412); check tap
  targets, scroll, safe areas, and that desktop is unaffected.

## Risks & Open Questions

- **Bottom nav vs. hamburger drawer.** Bottom nav is recommended (6 phases, fast
  switching). If phase count grows, revisit a drawer or a "More" tab.
- **PreproBanner length.** A vertical stack of six departments may be long;
  decide between accordion sections, a carousel, or a summary-plus-detail view
  after seeing it on device.
- **ViewFinder slider ergonomics.** Vertical sliders are awkward for thumbs;
  horizontal may change game feel. Validate with playtest before committing.
- **Save/Load/Reset placement.** Confirm with the owner whether these belong in a
  kebab menu, a settings sheet, or stay visible.
- **Landscape on phones.** Out of scope for this plan (portrait-first), but the
  responsive grid should degrade gracefully rather than break.

## Acceptance Checks (whole effort)

- `[ ]` No horizontal scrolling on any phase at 360–430px width.
- `[ ]` All six phases reachable and lock states clear from a mobile nav.
- `[ ]` Every primary action ≥44×44px and comfortably tappable.
- `[ ]` Writing, Preproduction, and Filming are each fully playable one-handed in
  portrait.
- `[ ]` Popups/hints render and dismiss correctly on mobile.
- `[ ]` Desktop layout is visually unchanged.
- `[ ]` `npm run lint` and `npm run build` pass.

## File Touch List (anticipated)

- `public/index.html` — `viewport-fit=cover`.
- `src/styles/variables.scss` — mobile tokens, safe-area utilities, `xs` gutters.
- `src/composables/useResponsive.js` — new breakpoint composable.
- `src/App.vue` — shell restructure, mobile header, bottom nav, toast.
- `src/components/Writing/WritingComponent.vue` + Writing cards — responsive grid,
  tap targets.
- `src/components/Prepro/PreproductionComponent.vue`, `PreproBanner.vue` — grid
  reflow, department layout.
- `src/components/Filming/FilmingComponent.vue`, `ViewFinder.vue`,
  `ShotTimeline.vue` — portrait reflow.
- `src/components/ui/PopupBase.vue`, `GuidedHintManager.vue` — bottom sheets,
  anchor fixes.
</content>
</invoke>
