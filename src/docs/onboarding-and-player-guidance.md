# Onboarding and Player Guidance Ideas

Last updated: 2026-06-22

This note captures ideas for making the first minutes of Click Studios clearer before adding a lot more functionality.

## Goals

- Teach the core writing loop before showing too many systems.
- Explain why the player is clicking, spending words, selling projects, and saving money.
- Reveal genre progress and deeper systems only when they matter.
- Reuse the popup/modal foundation, but allow tutorial messages to anchor near relevant UI.
- Keep guidance short, contextual, and skippable.

## Core First-Phase Loop

The writing phase should communicate this loop clearly:

1. Use a writing tool to create words.
2. Spend words to create writing products, starting with a logline.
3. Sell those writing products to other studios for money.
4. Spend money to improve word production.
5. Eventually create a full script and take that project into preproduction.

The player starts as a screenwriter selling ideas to other studios. Once they have enough money and enough words to complete a bigger script, they can move from working for others into producing their own project.

## Writing Product Value Ladder

The writing products should feel like an understandable ladder, not arbitrary buttons with higher prices.

- A logline is a compact story pitch. It is useful, but still just the seed of an idea.
- A synopsis adds shape to the story and explains what happens.
- An outline gives the story structure, sequence, and major beats.
- A treatment adds more detail, character arcs, and scene-level thinking.
- A draft script is much closer to something a studio can actually develop.
- A shooting script is ready enough to become the player's own production pipeline.

Tutorial and flavor text should explain that other studios pay more as an idea becomes more detailed, more thought through, and closer to a usable script.

Implemented direction:

- The writing phase now presents one primary story-sale slot instead of adding every unlocked writing product as another card.
- The slot upgrades from Logline to Synopsis to Outline to Treatment to Draft Script to Shooting Script.
- Earlier sale types stop appearing once the next tier unlocks, which keeps the screen focused and makes each upgrade feel like improvement rather than clutter.
- The current implementation uses a simple pulse animation and tier label. Later, this can be replaced or expanded with a shared unlock reveal component, richer card transitions, sparkles, sound hooks, or tutorial callouts without changing the core progression rules.
- Shooting Script remains the capstone story tier because it creates the player's own project and unlocks preproduction. Balance should be reviewed because it currently pays less efficiently per word than Draft Script, so the UI frames it as a greenlight milestone as well as a payout.

Possible early copy:

"A logline is only the seed of a movie. A synopsis is worth more because it gives another studio the shape of the story."

"Outlines sell for more because they solve more of the story. The closer your work gets to a real script, the more valuable it becomes."

## Writer Hire Ladder

The main writer hire card should also behave like a ladder instead of an expanding list.

Implemented direction:

- The main writer slot upgrades from Intern to Junior Writer to Screenwriter to Cowriters.
- The player can no longer hire lower-tier main writers after a higher tier unlocks.
- Existing lower-tier writers who were already hired remain active until their timers expire, so saves and current sessions do not abruptly lose active workers.
- Script Doctor stays separate because it has a different role: it multiplies other writing output instead of generating words directly.
- The current card uses the same simple pulse animation hook as the story-sale slot, giving future animation work one obvious place to attach richer effects.

Balance notes:

- Replacing lower hires is currently safe because each main writer tier is much more efficient than the previous one.
- If future tiers become more specialized rather than strictly better, this ladder may need branching choices, sidegrades, or a temporary "legacy hire" affordance.
- Worker milestone names such as `fiveInterns` can remain as historical save-compatible achievements for now, but future save/schema cleanup should rename these around main writer tiers rather than specific permanent cards.

## Guided Tutorial Concept

Instead of only using centered modal popups, add a tutorial hint system that can point to parts of the interface.

Possible behavior:

- A small message bubble can anchor near a button, card, counter, or panel.
- The bubble can be moved around the page based on the current tutorial step.
- The tutorial can highlight the related UI element.
- The player can dismiss or skip tutorial steps.
- Tutorial state should be saved so completed guidance does not repeat every reload.

This could be built on top of the current popup system, but likely needs a distinct `guidedHint` or `coachMark` layer because these hints should not always block the screen.

## Suggested Opening Tutorial Flow

1. Welcome / Game Flow

   Use a polished studio naming screen. Keep the first impression glamorous and brief.

2. Writing Tool

   Anchor near the pencil/writing button.

   Suggested copy: "Click your writing tool to make words."

3. Logline / Fundraising

   Trigger when the player reaches 20 words and the logline card becomes relevant.

   Suggested copy: "Earn up to $1M for other studios. Then write your own script."

4. Tool Upgrade

   Trigger after the first sale reveals the first upgrade card.

   Suggested copy: "Buy better tools. Later, hire help."

5. First Goal

   Follow the upgrade explanation.

   Suggested copy: "Make $20. Buy your first upgrade."

6. Product Value Explanation

   Trigger when the next writing product unlocks.

   Suggested copy: "More developed ideas sell for more."

7. Writer Hire

   Trigger when the hire card unlocks.

   Suggested copy: "Contract writers make words for a short run."

8. Writers Room

   Trigger after the first writer is hired and the room appears.

   Suggested copy: "Active writers show up here while they work."

9. Genre Progress Reveal

   Keep the genre/progress card hidden and inactive until the tutorial has introduced it.

   Suggested copy: "From now on, sold writing improves this genre."

10. Full Script / Preproduction Setup

   Trigger as the player approaches the first major script milestone.

   Suggested copy: "A full script can become your first production."

## Sale Flavor

Selling writing products should provide more flavorful feedback than only changing the money counter.

Ideas:

- Show a toast when a product sells.
- Include the product type, sale price, generated movie title or concept, and buyer studio.
- Define a small set of rival/buyer studios early so the world feels populated.
- Randomly combine sale copy from data tables to keep repeated sales lively.

Example toast patterns:

- "Sold the logline for _Midnight at the Mall_ to Silverline Pictures for $6."
- "Neon Harbor Studios bought your synopsis, _The Last Weather Girl_, for $40."
- "Your outline for _A Very Normal Heist_ was picked up by Cobalt Gate Films for $220."

Possible data files:

- `src/data/rivalStudios.js`
- `src/data/movieTitleFragments.js`
- `src/data/saleFlavorTemplates.js`

This should remain lightweight at first. The goal is to make the economy feel like the player is participating in a movie industry, not just converting one counter into another.

## Writer's Room Readability

The writer's room should make empty seats clearer.

Ideas:

- Show empty seats as visible chair/slot placeholders.
- Separate filled seats from open capacity so players understand why they can or cannot hire more writers.
- Add a small label such as `3 / 5 seats filled`.
- Empty seats could be dimmed, dashed, or outlined.
- Locked future seats could look different from currently empty seats.

The player should be able to understand at a glance:

- how many writers are active
- how much capacity remains
- whether the next useful action is hiring a writer or upgrading the room

## Unlock Presentation

Unlocks should feel more visually exciting.

Ideas:

- Add a more animated unlock presentation for new products, workers, systems, and phases.
- Use a short sparkle, burst, flash, or card flip when something appears.
- Pair unlocks with one clear sentence explaining why the new option matters.
- Keep the animation quick so it feels rewarding without blocking play.
- Consider a shared `UnlockReveal` component or animation class so unlocks feel consistent across phases.

Good unlock copy should answer:

- What did I unlock?
- Why is it useful?
- What should I try next?

## Writer Expiration Animation

When a temporary writer leaves the writer's room, the disappearance should feel intentional instead of abrupt.

Ideas:

- Add a small poof/fade animation when a writer expires.
- Show a final little motion or smoke/sparkle burst on the occupied seat.
- Delay removing the visual element until the animation completes, while the underlying worker has already expired.
- Keep the animation readable but not too noisy, since many writers may expire during active play.

This would make temporary hires feel more like characters coming and going, not just counters decrementing.

## Phase Banner / Prototype Messaging

The current banner that says the writing phase is the only working phase should eventually be replaced.

Better direction:

- Show which phases are currently implemented and playable.
- Distinguish between locked because of progression and unavailable because development has not reached that phase yet.
- Use the development endpoint modal only when the player reaches the current end of playable content.
- Keep the message polished and product-like instead of apologetic.

Possible banner direction:

"Playable now: Writing, Preproduction, Filming prototype. More phases are in development."

## UI Reveal Notes

- The genre card should not be visible immediately unless the tutorial has introduced it.
- Early UI should focus attention on the writing button, word count, logline card, money count, and first upgrade.
- Cards that are technically available but conceptually unexplained should stay hidden or visually quiet until their tutorial moment.
- Tutorial hints should use consistent placement, tone, and controls so players learn how to interact with guidance.
- Avoid eyebrow labels in guidance and card UI. Prefer clear visual patterns, short titles, direct verbs, iconography, progress, and motion over small uppercase labels.
- Resource counters should teach through feedback where possible. Manual writing clicks should visibly feed the word counter; sales should visibly feed the money counter.

## Unlock Progress Concepts

The next iteration should help the player understand what they are working toward without adding more tutorial text.

Option A: one active goal bar

- Show one compact progress strip above the writing board.
- The strip names the next feature and tracks one requirement, such as money earned, words written, sales completed, or writers hired.
- Only one unlock goal appears at a time, so the player always has a single obvious objective.
- This is the easiest match for the current code because unlocks already happen in a rough sequence through milestones such as first sale, enough cash for writer hire, product sales, and writer counts.
- Risk: it can make the game feel too linear if future systems should be discovered in parallel.

Option B: shadow placeholders in the board

- Reserve dimmed spaces where future features will appear.
- Each placeholder contains a small progress fill or requirement hint.
- When the requirement is met, the placeholder becomes the real feature card or panel.
- This makes the board itself teach progression and gives players a spatial memory of what is coming next.
- Risk: it can make the first screen feel busier unless placeholders are visually quiet and limited to near-term unlocks.

Recommended direction

Use a hybrid. Start with one active goal strip for the first five minutes, then use local placeholders only where the locked feature has an obvious home on the board.

- Early loop: use one active goal strip for "Sell a logline", "Buy your first upgrade", and "Hire your first writer."
- Feature areas: use local placeholders for bigger board regions such as Writers Room, Genre Progress, and later phase-specific panels.
- Code shape: define unlock goals in data alongside guidance steps, with `id`, `targetFeature`, `metric`, `current`, `required`, `label`, and `placeholderTarget`.
- Store shape: keep progress calculation in a focused guidance/progression store so components render simple `activeGoal` and `placeholderGoals`.
- Visual language: use progress fills, pips, disabled panels, and small motion. Avoid long explanatory text.

## Implementation Ideas

- Add a `useTutorialStore` or `useGuidanceStore` Pinia store.
- Store completed tutorial step ids in the versioned save schema.
- Define tutorial steps in data, not hard-coded components.
- Each step could include:
  - `id`
  - `trigger`
  - `target`
  - `placement`
  - `title`
  - `body`
  - `blocking`
  - `nextStep`
- Add a `GuidedHintManager` component near `PopupManager`.
- Use stable target ids or refs on key UI elements such as the writing button, word counter, logline card, money counter, tool upgrade card, and genre card.

## Related Refactors

- Versioned save/load should happen before the tutorial becomes elaborate, because tutorial completion state needs to persist cleanly.
- Design tokens should define hint bubble, highlight, scrim, and tutorial button styles.
- Early writing UI reveal rules should probably live in progression/tutorial state instead of component-local conditions.
- Unlock presentation, sale flavor toasts, writer room seats, and writer poof animations should use shared animation/design tokens after the design pass.
