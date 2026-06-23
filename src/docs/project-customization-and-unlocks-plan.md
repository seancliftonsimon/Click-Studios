# Project Customization & Unlockable Pools Plan

Last updated: 2026-06-23

Planning document only. No implementation should begin until the open questions
at the end are resolved. This plan covers the **front half** of a project's
life — how the player *shapes* a movie before production. The **back half**
(release results, box office, studio reputation, filmography) is owned by
[`filmography-and-reputation-plan.md`](./filmography-and-reputation-plan.md);
the two interlock and share data fields.

## Goal

Replace the current "random roll + name it" project creation with an active,
expressive setup flow. Instead of `generateScript()` silently sampling random
roles/sets/locations, the player **chooses** them from curated pools that
**unlock and grow over time** as they release films — mostly within a genre,
with some options spanning all genres. The player names the film at the end.

## Three layers of choice (the core design rule)

Per the direction set for this feature, choices split cleanly into two kinds,
which keeps strategy and creativity from muddying each other:

| Layer | Examples | Affects outcomes? | Nature |
|-------|----------|-------------------|--------|
| **Strategic (macro)** | Subgenre/tone, Budget tier, Scale (how many roles/sets/locations), Studio fame as a gate | **Yes** — feeds the release/reputation formula | A few high-stakes knobs |
| **Cosmetic (micro)** | Which specific roles, which sets, which locations | **No** — pure flavor/identity | Many expressive picks |
| **Naming** | The film's title | No | Final flourish |

Individual roles/sets/locations are *flavor only* — picking "Vampire" vs "Witch"
or "Lighthouse" vs "Diner" changes the film's character and the player's mental
story, not its score. Strategy lives at the macro level: subgenre, budget, and
scale (and, as a gate, studio fame). This is the load-bearing decision; every
mechanic below respects it.

## Current setup (what we're changing)

- **`generateScript()`** (`src/store/index.js:2981`) fires when a Shooting
  Script is sold (`src/store/index.js:2574`). It rolls random counts from
  `state.ranges` (2–5 roles, 5–15 shots, 2–8 sets, 3–11 locations) and randomly
  samples from pools. The player only names the title afterward, via a popup.
- **Pools** live in `state.pools`: `roles` are per-genre (on the `genres`
  object, ~40 each), while `sets`, `locations`, `shots`, `costumes`, `looks`
  are flat global string arrays.
- A rich **image-backed library** (`state.pools.settings`, ~50 sets/locations
  with photos in `src/assets/ShotPhotos/`) already exists but is **completely
  unused** by generation. This system should adopt it.
- Selected items become work-items in the six **preproduction departments**
  (`src/data/preproductionDepartments.js`): Casting, Shots, Sets, Locations,
  Costumes, Looks. Each department reads a `resourceKey` off `currentScript`.
- **Genres** already track `level`, `quality`, `wordsNeeded` (word-count
  leveling, capped ~12). There is also an unused `inspiration` currency.

**Scope of conversion:** Roles, Sets, and Locations become player-chosen.
Shots, Costumes, and Looks stay auto-generated (Shots are abstract camera
angles; Costumes/Looks derive per chosen role). This keeps the first version
focused while covering the three most tangible, creative departments.

## Unlock system

### Driver: films released per genre

Add a per-genre release counter and a studio-wide total:

- `genres[g].filmsReleased` — incremented when a film of genre `g` reaches
  release (hook into the filmography plan's `releaseCurrentProject` / Phase 2).
- `totalFilmsReleased` — sum across genres, drives cross-genre unlocks.

### Tiered, derived unlocking (no big save lists)

Every pool item is tagged with a `scope` and a `tier`. An item is unlocked iff
its tier is `<=` the unlocked tier for its scope, and the unlocked tier is
**derived from the release counters** rather than stored:

```
unlockedTier("horror") = tierFor(genres.horror.filmsReleased)
unlockedTier("all")    = tierFor(totalFilmsReleased)

tierFor(n): thresholds e.g. [0→T0, 1→T1, 3→T2, 6→T3, 10→T4, 15→T5]
```

Benefits: saves stay tiny (just counters), it's migration-proof (old saves
compute to T0 automatically), and "what's unlocked" is always consistent.
Optionally store a small `seenUnlocks` set purely to fire one-time "🔓 New
options unlocked!" toasts without re-announcing.

### Pool item shape (restructure)

Convert flat arrays into tagged objects in a new `src/data/pools.js`:

```js
// roles are scoped to a genre; sets/locations can be genre-specific OR "all"
{ id: "vampire", name: "Vampire", scope: "horror", tier: 1 }
{ id: "diner",   name: "Diner",   scope: "all",    tier: 0, image: "assets/ShotPhotos/diner.jpg" }
```

- `scope`: a genre key (`horror`/`comedy`/`drama`/`action`) **or** `"all"`
  (cross-genre — the "some options span all genres" requirement).
- `tier`: `0` = starter (immediately available), `1+` = unlocked by releases.
- `image`: optional; sets/locations adopt the existing `settings` photos.

Starter tier (T0) seeds each genre with ~5 roles and the `"all"` scope with
~6 sets and ~6 locations, so a brand-new studio has real choices immediately.
Each subsequent genre tier adds ~5–8 roles plus a couple of genre-flavored
sets/locations; cross-genre `"all"` tiers (driven by `totalFilmsReleased`)
add broadly useful sets/locations so generalist players also keep discovering.

## Strategic macro layer

### Budget tiers (gates scale, sets risk/reward)

New `src/data/budgets.js`. Each tier defines the allowed slot ranges, an
upfront cost, a payoff/reach modifier for the release formula, and a fame gate:

```js
{ id: "indie", name: "Indie", slots: { roles: [2,4], sets: [1,3], locations: [2,4] },
  cost: ..., reachMultiplier: ..., fameRequired: 0 }
// Micro → Indie → Studio → Blockbuster, each wider/pricier/higher-reach
```

Budget choice is strategic: bigger budget = more slots and higher ceiling, but
higher cost and higher risk if the film underperforms.

### Scale (player sets the counts)

Within the chosen budget's ranges, the player picks **how many** roles, sets,
and locations the film has (steppers/sliders). This satisfies "player sets
scale too" — bigger movies cost more and can earn more. The chosen counts
replace the random `state.ranges` counts and define how many slots the cosmetic
pickers present.

### Subgenre / tone

New `src/data/subgenres.js`: per-genre subgenres, themselves unlockable by
`genres[g].filmsReleased`. Each carries outcome modifiers (audience appeal,
risk, budget affinity) consumed by the release formula (defined in the
filmography plan). Subgenre may also **theme** the cosmetic pickers — surfacing
on-theme roles/sets first — but never restricts; any unlocked item stays
pickable. Selection is captured onto the project; the exact scoring math is
deferred to the filmography plan.

### Studio fame

A studio-level reputation stat (owned by the filmography/reputation plan). It is
an **input/gate**, not a per-project pick: it gates which budget tiers and
subgenres are *available*. It grows from releases.

## The Greenlight Configurator (new UI)

Replaces the random `generateScript()` + name popup. Opens when the player sells
a Shooting Script (`src/store/index.js:2574`). A short, multi-step flow:

1. **Genre & Subgenre** — confirm genre (existing), pick an unlocked subgenre. *(strategic)*
2. **Budget & Scale** — pick a budget tier (fame-gated), set role/set/location counts within its ranges. *(strategic)*
3. **Cast Roles** — fill each role slot from unlocked genre roles. *(cosmetic)*
4. **Build the World** — fill set slots and location slots from unlocked pools (image cards). *(cosmetic)*
5. **Title & Confirm** — name the film, review a summary, lock it in. *(naming)*

Optional **"Surprise Me"** on any step auto-fills from unlocked items (reuses
the old random logic) for players who don't want to micromanage.

**Output:** a `currentScript` object **identical in shape to today**
(`roles`/`sets`/`locations` arrays with their completion flags, plus
auto-derived `costumes`/`looks`/`shots`), **plus** new macro fields:
`subgenre`, `budgetTier`, `scale`, projected `cost`. Downstream preproduction
departments are unchanged — they still read `resourceKey` arrays.

Costumes/Looks/Shots stay auto-generated but now derive deterministically from
the chosen roles (costumes/looks per role) and a shot count from scale.

## Code changes (concrete)

New data files:
- `src/data/pools.js` — tier/scope-tagged roles, sets, locations; absorbs the
  image-backed `settings` library.
- `src/data/budgets.js` — budget tiers, slot ranges, costs, reach, fame gates.
- `src/data/subgenres.js` — per-genre subgenres, unlock tiers, outcome modifiers.

`src/store/index.js`:
- Add `genres[g].filmsReleased` and `totalFilmsReleased`; increment on release.
- Add getters: `unlockedRoles(genre)`, `unlockedSets`, `unlockedLocations`,
  `availableSubgenres(genre)`, `availableBudgets`, and the `tierFor` helpers.
- Add `buildScriptFromSelections(selections)` that assembles `currentScript`
  from player picks (counts from scale, items from picks, costumes/looks/shots
  derived). Keep `generateScript()` as the "Surprise Me" / fallback path so
  onboarding and any tests keep working.
- Change the Shooting-Script sale hook to open the configurator instead of
  generating + naming immediately.

New components under `src/components/Greenlight/`:
`GreenlightConfigurator.vue` plus step components
(`SubgenreStep`, `BudgetScaleStep`, `RoleSelectStep`, `WorldSelectStep`,
`TitleConfirmStep`), reusing existing card/picker patterns.

Release flow (filmography Phase 2): increment the per-genre counter and fire a
"🔓 New options unlocked in {Genre}!" toast when a tier threshold is crossed.

## Save / migration

- Versioned saves already exist. New fields get safe defaults
  (`filmsReleased: 0`, etc.). Because unlocks are **derived from counters**,
  there are no unlock lists to migrate — old saves simply compute to tier 0.
- `generateScript()` stays callable, so existing flows/tests don't break.

## Suggested phasing

- **A — Data restructure.** Build `pools.js` with `scope`/`tier`; adopt images.
  `generateScript` reads the new structure (still random). No player-facing change.
- **B — Unlock engine.** Per-genre release counter, unlock getters, "🔓" toasts.
  Pools now visibly grow as films release (selection still random).
- **C — Cosmetic configurator.** Greenlight Configurator for Roles/Sets/Locations
  hand-picking + Title-at-end. Random selection replaced by player choice.
- **D — Strategic layer.** Budget tiers + scale steppers + subgenre selection
  captured onto the project and wired to release outcomes (with filmography plan).
- **E — Fame gating & polish.** Fame-gated budgets/subgenres, subgenre-themed
  suggestions, discovery/unlock animations.

## Open questions

1. **Budget currency.** Pay project costs from `writingDollars`, or introduce a
   single unified studio cash balance first? (Leaning unified, but it's a
   prerequisite for the strategic layer.)
2. **Item availability granularity.** Should some pool items be exclusive to a
   subgenre, or always available within their genre once the tier unlocks?
   (Recommend: always available within genre; subgenre only *themes* ordering,
   to keep picks purely cosmetic.)
3. **"Surprise Me" auto-fill.** Keep a one-click random fill for players who
   don't want to curate every slot? (Recommend yes.)
4. **Costumes/Looks later.** Leave them auto forever, or promote them to
   optional cosmetic picks in a later phase?
5. **Unlock cadence numbers.** Confirm the tier thresholds
   `[1, 3, 6, 10, 15]` films and the per-tier item counts feel right, or tune.
