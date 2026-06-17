# Development Backlog

## Done

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

- Split the Vuex store into clearer domain modules.
- Move static content pools and tuning constants out of mutable Vuex state.
- Add focused unit tests around accounting and unlock behavior.
- Review `progressManager` for durable-state vs UI-only responsibilities.

## Notes / Decisions

- Completed efforts should move from `In Progress` or `Next` into `Done` in the same commit as the implementation.
- The current priority order is correctness fixes first, refactors second.
