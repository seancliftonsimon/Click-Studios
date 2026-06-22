# Development Backlog

## Done

- Removed Vuex entirely; the app now runs on Pinia with no bridging. The former
  Vuex root store is now the Pinia `useGameStore` (`src/store/index.js`) and the
  `popupManager` module is `usePopupStore` (`src/store/popup.js`). The domain
  stores in `src/stores/` (writing, project, player, preproduction, filming,
  progression, ui, …) now compose `useGameStore`/`usePopupStore` directly
  instead of delegating to a legacy Vuex store. The dead `progressManager`
  module was dropped. Components no longer use `this.$store` or Vuex map helpers.
- Guarded inspiration spending so the shop exits early when a purchase is unaffordable.

## In Progress

- None.

## Next

- Resource accounting hotfixes.
- State ownership and game rules refactor.
- Save/load schema cleanup.
- Timer lifecycle cleanup.
- Preproduction component deduplication.

## Backlog

- Push remaining state/logic out of the core `useGameStore` down into the domain
  Pinia stores so the domain stores own their slices directly.
- Move static content pools and tuning constants out of mutable store state.
- Add focused unit tests around accounting and unlock behavior.

## Notes / Decisions

- Completed efforts should move from `In Progress` or `Next` into `Done` in the same commit as the implementation.
- The current priority order is correctness fixes first, refactors second.
