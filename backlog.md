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
- Converted writing products and main writer hires into in-place upgrade ladders:
  the writing screen now shows one active story sale tier and one active main
  writer tier, with Script Doctor preserved as a separate specialist card.
  Current cards use a simple reusable pulse animation hook for future unlock
  effects.

## In Progress

- None.

## Next

- Resource accounting hotfixes.
- Save/load schema cleanup.
- Guided tutorial / contextual hint system for the early writing loop. See
  `src/docs/onboarding-and-player-guidance.md`.
- Ticket Booth design-system pass. See
  `src/docs/ticket-booth-design-system.md`.
- Writer room empty-seat clarity, juicier unlock reveals, sale flavor toasts,
  and writer expiration poof animations. See `src/docs/onboarding-and-player-guidance.md`.
- Continue moving ownership from the core `useGameStore` into focused domain stores.

## Backlog

- Push remaining state/logic out of the core `useGameStore` down into the domain
  Pinia stores so the domain stores own their slices directly.
- Move static content pools and tuning constants out of mutable store state.
- Add focused unit tests around accounting and unlock behavior.

## Notes / Decisions

- Completed efforts should move from `In Progress` or `Next` into `Done` in the same commit as the implementation.
- The current priority order is correctness fixes first, refactors second.
