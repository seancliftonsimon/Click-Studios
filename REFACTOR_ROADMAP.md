# Click Studios Refactor Roadmap

Last updated: 2026-06-22

This file tracks the structural refactors needed to make Click Studios easier to extend into a full production-to-release idle game. Each step has a status, goal, implementation notes, and acceptance checks.

Architecture decision: the app now runs on Pinia. The former Vuex root store has been converted into the core Pinia `useGameStore`, with popup state moved into `usePopupStore` and domain-facing stores in `src/stores/`.

## Status Key

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

## Progress Overview

| Status | Step | Area | Goal |
| --- | --- | --- | --- |
| [x] | 1 | Preproduction correctness | Fix broken inspiration/search/worker upgrade wiring |
| [ ] | 2 | Save/load | Add a versioned save schema and stop saving static/dev data |
| [x] | 3 | Pinia state ownership | Remove Vuex and run the app through Pinia stores |
| [x] | 4 | Preproduction UI | Replace duplicated department bar-stack components with one configurable component |
| [x] | 5 | Timers | Centralize game-rule ticking for writing workers and preproduction progress |
| [x] | 6 | Static data | Move preproduction config, balance constants, and investor tiers out of components |
| [ ] | 7 | Design system | Create shared tokens and component variants for a consistent UI language |
| [ ] | 8 | Tests | Add focused tests for economy, unlocks, save migration, and phase progression |
| [ ] | 9 | Performance | Reduce bundle weight and clean dependency/build warnings |

## Step 1: Preproduction Correctness

Status: `[x]` Complete

### Problem

Several inspiration-shop upgrades were wired to state that the active game loop did not read:

- Search shortening updated `state.ranges.searchAmount`, but investor search uses `state.ranges.investorSearchAmount`.
- Worker speed upgrades updated `workerSearchSpeed` / `workerPitchSpeed`, but search and pitch cards read `searcherSpeed` / `pitcherSpeed`.
- Inspiration upgrade purchase levels lived in `InspirationShop.vue` component-local `data()`, so upgrade costs reset when the component remounted and were not durable game state.

### Changes Made

- `DECREASE_SEARCH_RANGE` now updates `ranges.investorSearchAmount`.
- Worker speed mutations now update `searcherSpeed` and `pitcherSpeed`.
- Added durable `preproUpgradeLevels` state and getter.
- Added `INCREMENT_PREPRO_UPGRADE_LEVEL`.
- Updated `InspirationShop.vue` to calculate costs from store state instead of local component state.

### Acceptance Checks

- `[x]` `npm run lint` passes.
- `[x]` `npm run build` passes.
- `[x]` Search-shortening purchases affect the same range used by investor search cards.
- `[x]` Worker speed purchases affect the same speeds used by investor search/pitch cards.
- `[x]` Upgrade level progression is stored in durable game state and survives component remounts under the current save model.
- `[x]` The new `preproUpgradeLevels` field is isolated enough to move into `usePreproductionStore` during the Pinia migration.

## Step 2: Versioned Save/Load

Status: `[ ]` Not started

### Goal

Replace full-state serialization with a stable save format that stores only durable player/run state and can hydrate the Pinia stores.

### Why It Matters

The current `SAVE_STATE` action serializes the whole core Pinia `useGameStore` state. That still includes static content pools, dev checkpoint data, UI-only state, and any stale fields from previous experiments. As the project grows, this will make saves fragile and harder to migrate. The save schema should be designed around durable domain boundaries instead of the current full-store object shape.

### Implementation Notes

- Introduce `SAVE_VERSION`.
- Create `createSaveSnapshot(stores)` that returns only durable state from Pinia-owned domains.
- Create `loadSaveSnapshot(snapshot, stores)` with migration support.
- Preserve compatibility with current localStorage saves where possible, including old full Vuex snapshots and current full Pinia snapshots.
- Add a migration adapter that maps old Vuex/current Pinia fields into the new save shape.
- Exclude popup registry/history, static pools, dev fixtures, generated build-only data, and transient timers.

### Acceptance Checks

- `[ ]` New saves include a version number.
- `[ ]` Loading an old save does not crash.
- `[ ]` Save/load does not depend on the old root Vuex state shape or the current full `useGameStore` shape.
- `[ ]` Each durable Pinia store has a clear serialize/hydrate path or equivalent save adapter.
- `[ ]` Save payload is meaningfully smaller than current full-state saves.
- `[ ]` Static content changes do not require wiping player saves.
- `[ ]` `npm run lint` passes.
- `[ ]` `npm run build` passes.
- `[ ]` Manual smoke test: save, reload page, load, confirm writing/preproduction progress remains intact.

## Step 3: Pinia State Ownership

Status: `[x]` Complete

### Goal

Remove Vuex and run the app through Pinia stores. The former Vuex root store now exists as the core Pinia `useGameStore`; domain stores in `src/stores/` compose that core store and `usePopupStore` while future work continues pushing ownership downward into smaller domain stores.

### Target Stores

- `usePlayerStore`: studio name, money, score, prestige/meta progression.
- `useProjectStore`: current script/movie, generated roles/shots/sets/locations/costumes/looks.
- `useWritingStore`: words, writing products, writing tools, writers room.
- `usePreproductionStore`: investors, inspiration, departments, workers, preproduction upgrades.
- `useFilmingStore`: shot filming state, shot scores, wrap progress.
- `useProgressionStore`: phase unlocks, milestones, route permissions, current prototype endpoint.
- `useUiStore`: toasts, modals, transient display state.
- `useDebugStore`: dev shortcuts and checkpoint loading.

### Migration Strategy

1. Install Pinia and register it in `src/main.js`.
2. Add new stores under `src/stores/`.
3. Move a low-risk domain first, such as UI state or progression flags.
4. Move rule-heavy domains next: writing, project, preproduction, then filming.
5. Replace `mapGetters` / `mapMutations` usage with direct Pinia store calls in migrated components.
6. Convert the popup module into `usePopupStore`.
7. Remove Vuex dependencies and dead Vuex modules.

### Changes Made

- Installed `pinia` and registered it in `src/main.js`.
- Added domain stores under `src/stores/`: player, writing, project, preproduction, filming, progression, UI, debug, and game clock.
- Moved the preproduction department workflow through `usePreproductionStore` and `useProjectStore`.
- Moved the debug checkpoint shortcut into `useDebugStore`.
- Converted the former Vuex root store into Pinia `useGameStore`.
- Converted the former popup Vuex module into Pinia `usePopupStore`.
- Removed the `vuex` and `@vue/cli-plugin-vuex` dependencies.
- Removed the dead Vuex `popupManager` and `progressManager` module files.

### Acceptance Checks

- `[x]` `pinia` is installed and registered with the Vue app.
- `[x]` New stores live under `src/stores/` with clear domain ownership.
- `[x]` Vuex is removed from runtime dependencies.
- `[x]` Preproduction department rules no longer live in six component-local implementations.
- `[x]` Existing user-facing flows still build: writing, preproduction unlock, filming endpoint.
- `[x]` Migrated cross-domain behavior is expressed through Pinia actions.
- `[~]` `UPDATE_STATE_VARIABLE` is still used by save/debug/UI paths and should be narrowed during Step 2.
- `[~]` The core `useGameStore` is still large; later refactors should move more ownership into the domain stores.
- `[x]` `npm run lint` passes.
- `[x]` `npm run build` passes.

## Step 4: Generic Preproduction Department Component

Status: `[x]` Complete

### Goal

Replace six duplicated bar-stack components with one data-driven `DepartmentProgressCard` that talks to Pinia stores.

### Implementation Notes

Create a department config object for:

- department id
- title and emoji
- locked hire label
- hire cost
- resource getter/key
- completion action
- progress labels
- completion text
- emitted event name

### Changes Made

- Added `DepartmentProgressCard.vue` as the shared preproduction department component.
- Replaced the six large bar-stack components with thin wrappers that pass a department id to the shared card.
- Added `src/data/preproductionDepartments.js` for labels, event names, completion flags, progress labels, and completion mutations.
- Department progress now lives in `usePreproductionStore`, so it does not reset simply because a card remounts.

### Acceptance Checks

- `[x]` Casting, shot planning, set building, location scouting, costume making, and look designing all render from the same component.
- `[x]` Department-specific labels and completion events still work through config.
- `[x]` Worker assignment/unassignment behavior is shared across departments.
- `[x]` Department state is read from and written through `usePreproductionStore` / `useProjectStore`.
- `[x]` Department progress no longer resets on remount.
- `[x]` `npm run lint` passes.
- `[x]` `npm run build` passes.

## Step 5: Central Game Ticker

Status: `[x]` Complete

### Goal

Move timers out of individual components and into one Pinia-backed game-loop service/store action that calculates elapsed-time progress.

### Why It Matters

Idle games need durable time math. Component-owned `setInterval`, `setTimeout`, `requestAnimationFrame`, and `window.*` timer registries are hard to save, pause, resume, and test.

### Implementation Notes

- Create either `src/services/gameTicker.js` plus Pinia actions, or a dedicated `useGameClockStore`.
- Store durable timing fields such as `lastTickAt`, worker expiration timestamps, and active production timers in Pinia.
- Keep rendering animation state separate from game-rule progress.

### Changes Made

- Added `useGameClockStore` as the single game-rule ticker.
- Moved preproduction department progress, worker wages, investor auto-search, investor auto-pitch, investor collect, and writer worker expiration onto the shared clock.
- Removed `window.intervals`, `window.workerTimeouts`, and `window.nextWorkerId` from game-rule timing.
- Changed writer worker expiration to use stored expected-removal timestamps instead of browser timeout ownership.
- Fixed investor search/pitch targets so they are rolled once per card instead of recalculated on every render.

### Acceptance Checks

- `[x]` Migrated game-rule timers use the shared clock instead of component-local intervals.
- `[x]` Progress can be calculated from `lastTickAt` timestamps.
- `[~]` Full offline catch-up is ready at the clock/store boundary but still needs Step 2 save/load hydration.
- `[x]` Worker expiration uses timestamps, not only browser timeouts.
- `[x]` `window.intervals`, `window.workerTimeouts`, and `window.nextWorkerId` are removed from game logic.
- `[x]` Game-rule timer actions live in Pinia stores or are called by the Pinia clock.
- `[x]` `npm run lint` passes.
- `[x]` `npm run build` passes.

## Step 6: Static Data and Tuning Config

Status: `[x]` Complete

### Goal

Move content pools and balancing constants out of mutable store state.

### Suggested Files

- `src/data/contentPools.js`
- `src/data/writingProducts.js`
- `src/data/workers.js`
- `src/data/preproductionDepartments.js`
- `src/data/balance.js`
- `src/data/debugSaves.js`

### Implementation Notes

- Pinia stores should keep IDs, progress values, generated project selections, and player-owned unlocks.
- Static pools and tuning constants should be imported by actions and selectors, not serialized as state.
- Debug saves can become fixture snapshots that hydrate Pinia stores through the same save/load path as real saves.

### Changes Made

- Added `src/data/balance.js` for preproduction tuning constants and investor tier upgrade costs.
- Added `src/data/preproductionDepartments.js` for department configuration.
- Added `src/data/investors.js` for investor tier names and pay ranges.
- Updated migrated preproduction components/stores to import these data files instead of embedding values in component-local logic.

### Acceptance Checks

- `[~]` Existing saves still include static pools until Step 2 replaces full-store serialization.
- `[~]` Script generation still reads pools from the core store; this should move with the Step 2 save migration.
- `[x]` Migrated Pinia state stores progress/selection data, not source config pools.
- `[x]` Preproduction balance and department changes can be made without touching player save shape.
- `[x]` `npm run lint` passes.
- `[x]` `npm run build` passes.

## Step 7: Design System

Status: `[ ]` Not started

### Goal

Create a consistent visual language so players understand actions, costs, progress, completion, locked states, and phase changes.

Chosen direction: Ticket Booth UI. See
`src/docs/ticket-booth-design-system.md`.

### Recommended Tokens

Palette based on existing notes:

- Curtain Red: `#931621`
- Academy Gold: `#fad01c`
- Night Sky: `#313b72`
- Pale Popcorn: `#fff5bf`
- Neutral Gray: `#cfcfcf`
- Black: `#0f0f0f`
- White: `#ffffff`

Typography:

- Use `Voltaire` for display/signage moments such as page titles, section titles,
  and short nav labels.
- Use `Roboto`/system sans for body text, movie names, compact stats, list rows,
  modal copy, and smaller button text so dense UI stays readable.

Component language:

- Primary action
- Spend words
- Spend money
- Hire/assign worker
- Upgrade
- Locked
- Completed
- Warning/no funds

### Acceptance Checks

- `[ ]` Vuetify theme exposes the app palette.
- `[ ]` Shared CSS tokens define Ticket Booth colors, typography, radius, shadow,
  and motion.
- `[ ]` Display text uses `Voltaire`; body/dense UI text uses `Roboto`/system sans.
- `[ ]` Cards use one standard radius unless intentionally distinct.
- `[ ]` Buttons use shared variants/classes instead of local hard-coded colors.
- `[ ]` Inline styles are removed from high-traffic components.
- `[ ]` Writing, preproduction, and filming screens share a recognizable layout grammar.
- `[ ]` Popup, button, row, segmented-control, progress, and modal primitives match
  the Ticket Booth component language.
- `[ ]` `npm run lint` passes.
- `[ ]` `npm run build` passes.
- `[ ]` Browser smoke test confirms no clipped/overlapping controls at desktop width.

## Step 8: Focused Tests

Status: `[ ]` Not started

### Goal

Add tests around the Pinia store actions and pure rules most likely to regress during refactors.

### Suggested Coverage

- Selling writing products subtracts words, pays money, and unlocks the next product.
- First shooting script unlocks preproduction and creates a project.
- Hiring department heads deducts money and unlocks worker-related UI at the right milestone.
- Inspiration purchases deduct currency and apply effects.
- Save migration keeps durable progress and ignores static data.
- Filming shot wrapping records scores and triggers the prototype endpoint when complete.

### Acceptance Checks

- `[ ]` A test runner is installed/configured.
- `[ ]` Core economy/progression tests run in CI or local scripts.
- `[ ]` Tests do not require browser rendering for pure game rules.
- `[ ]` Pinia stores/actions can be tested directly with fresh store instances.
- `[ ]` `npm run lint` passes.
- `[ ]` `npm run build` passes.
- `[ ]` Test command passes.

## Step 9: Performance and Maintenance

Status: `[ ]` Not started

### Goal

Reduce deploy size and keep dependencies healthy.

### Known Issues

- Build warns that Browserslist data is stale.
- Sass loader uses the legacy JS API.
- Image and font assets exceed recommended bundle sizes.
- `npm audit --omit=dev` currently reports advisories in build-chain dependencies.

### Acceptance Checks

- `[ ]` `npx update-browserslist-db@latest` has been evaluated on a branch.
- `[ ]` `npm audit fix` has been evaluated on a branch and does not break the build.
- `[ ]` Filming image assets are lazy-loaded or moved out of the initial bundle.
- `[ ]` Icon/font loading is reviewed so unused weights/assets are not shipped unnecessarily.
- `[ ]` `npm run lint` passes.
- `[ ]` `npm run build` passes.

## Pinia Target Architecture

Pinia is the target state system for this roadmap. It should make the project simpler than Vuex because each game domain can live in a small store with state, getters, and actions together. That fits Click Studios better than a mutation-heavy root store because most meaningful changes are game actions: `sellProduct`, `hireWorker`, `purchaseInspirationUpgrade`, `wrapShot`, and `advancePhase`.

Recommended patterns:

- Prefer actions for game rules, even though Pinia allows direct state edits.
- Keep one owning store per concept. For example, writing products belong to `useWritingStore`; generated roles and shots belong to `useProjectStore`; unlock rules belong to `useProgressionStore`.
- Allow cross-store calls when they express real game behavior, such as a writing action creating a project and then asking progression to unlock preproduction.
- Keep static data outside Pinia state. Stores can import data files, but save files should only contain player/run progress.
- Keep pushing ownership out of the core `useGameStore` into smaller domain stores as features expand.

The Vuex migration is complete: the app runs with Pinia stores only and `vuex` has been removed from `package.json`. The next architectural cleanup is Step 2: save/load should hydrate durable Pinia store slices through a versioned schema instead of serializing the full core store.
