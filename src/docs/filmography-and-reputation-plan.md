# Filmography and Studio Reputation Plan

Last updated: 2026-06-22

This plan describes how to add filmography, studio reputation, genre-specific identity, and release learning systems to Click Studios. It is intentionally a planning document only; no implementation should begin until the open questions below are answered.

## Design Goal

Click Studios should let the player feel like they are building a real movie studio over time. Each movie should leave a trace, teach the player something about the market, and shape the studio's reputation. The player should be able to imagine a title, genre, series, or creative strategy, watch how that movie performs, and use what they learned to make future movies more successful.

The feature should support the existing production loop:

1. Write and sell early products to other studios.
2. Create a shooting script that becomes the player's own movie.
3. Move the movie through preproduction, filming, postproduction, marketing, and release.
4. Save the released movie into a filmography.
5. Convert results into money, score, reputation, genre experience, unlocks, and lessons for future projects.

## Design Principles

- Preserve the studio-executive fantasy. The player should make high-level creative and business choices, not micromanage every person on set.
- Keep the first implementation lightweight. A useful filmography and release report are more important than a large simulation formula.
- Make every completed movie matter. Even a flop should teach something, unlock flavor, or affect reputation.
- Make genre specialization visible. The player should understand when their studio is becoming known for horror, comedy, drama, action, or future genres.
- Keep market logic learnable. The scoring formula can stay partially hidden, but release reports should explain why a movie succeeded or failed.
- Use existing project data first. The current script object already has title, genre, quality, roles, shots, sets, locations, costumes, and looks.
- Avoid copying Game Dev Tycoon directly. Borrow its authorship and learning loop, but translate it into film-specific systems.

## Current Project Hooks

The existing code already has several useful foundations:

- `currentScript` stores the active movie project after a shooting script is created.
- `generateScript` creates title, genre, quality, roles, shots, sets, locations, costumes, and looks.
- Genre state tracks level, words needed, and quality.
- Progression state already unlocks phases.
- Preproduction departments already map project resources into work.
- Popups and toasts can announce unlocks, phase transitions, and flavor events.

The first implementation should extend those systems instead of creating a parallel game model.

## Proposed Data Model

### Active Project

The active project should eventually contain:

- `id`
- `title`
- `genre`
- `subgenre` or `tone`
- `targetAudience`
- `budgetTier`
- `creativeFocus`
- `releaseWindow`
- `marketingStrategy`
- `quality`
- `productionStats`
- `releaseResults`
- `status`
- `createdAt`
- `releasedAt`

Not all fields need to exist in the first version. The minimum useful version is `id`, `title`, `genre`, `quality`, `status`, `releaseResults`, and `releasedAt`.

### Released Film

Released films should be stored as immutable snapshots so future changes to tuning formulas do not rewrite history.

Recommended filmography record:

```js
{
	id: "film_001",
	title: "Tomorrow's Tears",
	genre: "drama",
	quality: 2.4,
	budget: 100000,
	marketingSpend: 25000,
	criticScore: 72,
	audienceScore: 66,
	openingWeekend: 180000,
	totalGross: 620000,
	profit: 495000,
	reputationChanges: {
		overall: 4,
		drama: 8,
	},
	lessons: [
		"Drama audiences responded well to strong writing.",
		"Marketing spend was low for the release size.",
	],
	flags: ["profitable", "genreReputationGain"],
	releasedAt: 12,
}
```

### Studio Reputation

Studio reputation should be separated from genre experience.

- Genre experience answers: "How good is the studio at making this type of movie?"
- Reputation answers: "How does the market perceive this studio?"

Recommended reputation state:

```js
{
	overall: 0,
	genres: {
		horror: 0,
		comedy: 0,
		drama: 0,
		action: 0,
	},
	tags: {
		indieDarling: false,
		horrorSpecialist: false,
		reliableHitmaker: false,
		awardsContender: false,
	},
	recentTrend: null,
}
```

## Implementation Order

### Phase 1: Save-Safe Foundation

Goal: make sure filmography and reputation can be added without making save data harder to maintain.

Tasks:

- Define a versioned save shape for new filmography and reputation fields.
- Decide whether filmography lives in the core `useGameStore` temporarily or in a new `useFilmographyStore`.
- Add initial empty state for released films and studio reputation.
- Add migration defaults for old saves.
- Add tests or focused manual checks for loading a save with no filmography data.

Deliverable:

- Empty filmography and reputation state exists safely, with no UI yet.

### Phase 2: Released Film Snapshot

Goal: when a movie reaches release, store a permanent record.

Tasks:

- Create a `createReleasedFilmSnapshot(project, releaseResults)` helper.
- Include title, genre, quality, project resource counts, budget, scores, revenue, profit, and release date.
- Add a store action such as `releaseCurrentProject` or `addReleasedFilm`.
- Ensure a released film is not accidentally mutated when `currentScript` changes.
- Decide what happens to `currentScript` after release: clear it, archive it, or start the next project flow.

Deliverable:

- Releasing a movie creates a durable filmography record.

### Phase 3: Filmography Screen

Goal: give the player a visible history of their studio.

Tasks:

- Add a Filmography route or tab.
- Show an empty state before the first release.
- Show each released film as a compact row or card.
- Include title, genre, critic score, audience score, total gross, profit, and reputation gain.
- Add sorting or grouping later, but keep the first version simple.
- Link from release report to the new filmography entry.

Initial UI recommendation:

- Use a dense table/list for released films.
- Use one expanded details panel or dialog for deeper movie stats.
- Avoid large nested cards.

Deliverable:

- The player can review every released movie and compare results.

### Phase 4: Release Report

Goal: make each release feel like a meaningful result, not just a counter payout.

Tasks:

- Create a release report modal or screen after a movie is released.
- Show headline result: hit, flop, sleeper hit, critical darling, audience favorite, profitable, or costly miss.
- Show critic score, audience score, opening weekend, total gross, profit, and reputation changes.
- Generate two or three short lessons based on performance.
- Add one clear "what this means" line that helps the player plan their next movie.

Possible lesson examples:

- "Your horror reputation helped opening weekend."
- "Critics liked the script quality, but audiences wanted stronger marketing."
- "The budget was too high for the studio's current reputation."
- "Comedy performed well with broad audiences, but weak production quality limited reviews."

Deliverable:

- Every release teaches the player at least one actionable lesson.

### Phase 5: Reputation Gains

Goal: make the studio's history affect future performance.

Tasks:

- Add overall reputation gains from profitable or well-reviewed films.
- Add genre reputation gains from successful films in a specific genre.
- Add small reputation losses or stagnation from flops.
- Add thresholds for reputation labels.
- Show reputation in a Studio Profile panel.
- Ensure reputation helps future releases but does not guarantee success.

Suggested first-pass formula:

- Overall reputation increases from profit, critic score, and audience score.
- Genre reputation increases more strongly for the movie's genre.
- A flop can reduce overall reputation slightly but should not punish early experimentation too hard.

Deliverable:

- The player can see their studio becoming known for specific kinds of movies.

### Phase 6: Genre Identity and Specialization

Goal: connect current genre XP with the broader studio reputation system.

Tasks:

- Keep the existing genre level/quality system as production skill.
- Add genre reputation as market perception.
- Show both in a genre profile:
  - Skill: "How good your team is at this genre."
  - Reputation: "How much the market associates your studio with this genre."
- Add specialization labels at thresholds.
- Let genre reputation influence marketing efficiency, opening weekend, or audience anticipation.

Possible labels:

- Horror: "Midnight Specialist", "Cult Favorite", "Scream Factory"
- Comedy: "Crowd-Pleaser", "Reliable Comedy House"
- Drama: "Festival Contender", "Prestige Studio"
- Action: "Stunt Shop", "Blockbuster Builder"

Deliverable:

- Genre progress feels like studio identity, not only a quality multiplier.

### Phase 7: Project DNA Choices

Goal: add Game Dev Tycoon-style authorship without overwhelming the player.

Tasks:

- Add a small project setup step when the shooting script becomes the player's own movie.
- Ask for title and one or two meaningful identity choices.
- Store those choices on `currentScript` or a new active project object.
- Use choices later in release scoring and release report lessons.

Candidate choices:

- Target audience: adults, teens, family, niche cinephiles, broad audience.
- Tone: grounded, stylish, funny, intense, sentimental, weird.
- Creative focus: script, cast, spectacle, visuals, editing, marketing hook.
- Budget ambition: micro, indie, mid-budget, studio, blockbuster.

First implementation should probably choose only two:

- `targetAudience`
- `creativeFocus`

Deliverable:

- The player can shape what kind of movie they are making before production begins.

### Phase 8: Market Trends

Goal: create changing context so the player does not always repeat the same optimal strategy.

Tasks:

- Add one active market trend at a time.
- Show the trend in a visible but compact UI area.
- Let trends affect demand, marketing efficiency, awards chances, or audience score.
- Include trend references in release reports when relevant.

Example trends:

- "Horror is hot this season."
- "Audiences are tired of expensive action sequels."
- "Festival buyers are looking for prestige dramas."
- "Family movies are overperforming during the holiday window."

Deliverable:

- The market feels alive without requiring constant attention.

### Phase 9: Sequels and Franchises

Goal: let the player build stories and series across multiple releases.

Tasks:

- Add sequel eligibility based on profit, audience score, cult status, or awards.
- Store optional `franchiseId` on films.
- Add a "Make Sequel" action from filmography.
- Give sequels a starting awareness bonus.
- Add sequel fatigue if the player repeats too often without improving quality or changing the hook.

Deliverable:

- Successful movies can become franchises, and the filmography becomes strategically useful.

### Phase 10: Awards and Prestige Hooks

Goal: connect high-quality releases to the long-term prestige loop.

Tasks:

- Add awards eligibility based on critic score, genre, release window, and awards campaign.
- Add awards nominations/wins to filmography records.
- Use awards to increase reputation and unlock prestige bonuses.
- Keep awards as an endgame or post-release layer, not an early-game burden.

Deliverable:

- The filmography records not only commercial results, but also legacy.

## Suggested Minimum Viable Slice

The first implementation should stop after these pieces:

1. Add filmography state.
2. Add released film snapshots.
3. Add a filmography screen.
4. Add a simple release report.
5. Add basic overall and genre reputation.

Do not add sequels, trends, awards, or deep project DNA until the basic loop feels good.

## Suggested UI Surfaces

### Studio Profile

Purpose: show who the studio has become.

Should include:

- Studio name
- Overall reputation
- Best genre
- Genre reputation list
- Reputation labels
- Total films released
- Total profit
- Best reviewed film
- Highest grossing film

### Filmography

Purpose: show the studio's history.

Should include:

- Released movie list
- Empty state before first release
- Movie details dialog
- Stats comparison
- Future sequel/franchise actions

### Release Report

Purpose: teach and celebrate.

Should include:

- Result headline
- Scores
- Money
- Reputation changes
- Lessons learned
- Button to view filmography
- Button to start next project, once that flow exists

## Balancing Notes

- Early films should be allowed to succeed modestly. The player should not need deep system mastery to enjoy the first release.
- Reputation should grow slowly enough to matter, but quickly enough that the first few releases visibly change the studio profile.
- Genre reputation should reward specialization without making other genres feel pointless.
- Filmography should record failed movies because they make the studio story better.
- The release formula should support multiple success types:
  - low-budget profitable hit
  - critical darling
  - audience favorite
  - blockbuster
  - cult movie
  - awards contender

## Technical Notes

- Prefer a focused `useFilmographyStore` once the save/load cleanup is stable.
- Keep release formula helpers outside components.
- Store immutable snapshots for released films.
- Keep generated labels and lessons in data/config files where practical.
- Add unit tests around release snapshot creation and reputation calculation once formulas exist.
- Avoid connecting this to every phase at once. It is better to add the release snapshot first, then make earlier choices feed into it.

## Open Questions Before Implementation

### Core Fantasy

1. Should the player feel more like an independent filmmaker, a studio founder, or a studio executive?
2. In the early game, are they personally writing and producing, or are they already managing a small company?
3. Should the studio identity feel sincere and creative, satirical and Hollywood-businessy, or somewhere between those?
4. Should the game celebrate artistic success, commercial success, or both equally?

### Filmography

5. What should the filmography screen feel like: a clean business ledger, a movie poster shelf, a studio archive, or a trade-publication chart?
6. Should every released film get a generated poster/title-card eventually, or is text-first acceptable for a long time?
7. What are the must-see stats on the filmography list itself?
8. What stats should only appear after expanding a film?
9. Should unreleased/current projects appear in filmography, or should filmography only show completed releases?
10. Should failed/cancelled projects ever be archived?

### Release Results

11. Which release metrics matter most: critic score, audience score, box office, profit, awards, reputation, or long-tail income?
12. Should critic score and audience score be equally important?
13. Should a movie be able to be a financial flop but still grow reputation?
14. Should a movie be able to be critically bad but commercially huge?
15. How punishing should flops be in the early game?
16. Should opening weekend and total gross both be shown, or is total gross enough for the first version?
17. Should movies generate ongoing income after release, or should each release pay out once?

### Studio Reputation

18. Should reputation be a visible number, a label, a progress bar, or all three?
19. Should overall reputation directly improve future sales, or mostly unlock opportunities?
20. Should genre reputation affect quality, audience demand, marketing efficiency, investor interest, or all of those?
21. Should reputation ever decrease?
22. Should reputation have named tiers such as "Unknown", "Festival Buzz", "Reliable Studio", and "Major Studio"?
23. Should the studio be able to become known for multiple genres at once?
24. Should over-specialization create drawbacks, such as weaker performance outside the studio's known genres?

### Genre System

25. Are the starting genres still horror, comedy, drama, and action?
26. What genres should be added next, if any?
27. Should genre XP come from writing only, released films only, or both?
28. Should genre level improve production quality, market trust, or both?
29. Should genre combinations exist later, such as action-comedy or horror-drama?
30. Should subgenres exist, such as slasher, rom-com, prestige drama, heist, or creature feature?

### Project DNA

31. How many choices should the player make when creating a movie?
32. Which choices feel most fun: target audience, tone, budget ambition, creative focus, cast strategy, marketing angle, release window?
33. Should the player choose these all at once, or should each production phase add one choice?
34. Should choices have obvious pros/cons, or should the player learn through release reports?
35. Should title entry remain required, optional, or skippable with generated titles?
36. Should the player be able to rename a movie before release?

### Market Learning

37. How explicit should the release report be about why a movie performed well or poorly?
38. Should lessons be phrased like industry analysis, critic blurbs, audience feedback, or internal studio notes?
39. Should the game reveal exact bonuses and penalties, or keep them qualitative?
40. Should the player build a permanent "market knowledge" library from past releases?
41. Should market knowledge become an upgradeable research system later?

### Trends

42. Should market trends exist from the start, or unlock after several releases?
43. Should trends be predictable, random, seasonal, or tied to in-game years?
44. Should trends mostly affect genres, audiences, budgets, release windows, or marketing channels?
45. Should the player be able to research upcoming trends?
46. Should trends be gentle flavor or strong strategic pressure?

### Sequels and Franchises

47. When should sequels unlock?
48. What makes a movie sequel-worthy: profit, audience score, reputation, cult status, or awards?
49. Should sequels be safer than originals?
50. Should sequel fatigue be modeled?
51. Should franchises have names and multiple entries in the filmography?
52. Should a bad sequel damage the original film's reputation?
53. Should the player be able to reboot or remake old movies?

### Awards and Prestige

54. Should awards be central to the win condition, or one path among several?
55. Should awards favor specific genres like drama, or should every genre have award paths?
56. Should awards require a marketing/awards campaign spend?
57. Should awards happen immediately after release or during a separate award season?
58. What should prestige rewards permanently improve?

### Economy and Balance

59. Should film budgets be explicit spending choices, or derived from production work?
60. Should the player be able to overspend and risk bankruptcy?
61. Should investors care about reputation and genre history?
62. Should bigger budgets raise the quality ceiling, audience expectations, or both?
63. Should low-budget movies have special upside, such as higher profit margins or festival buzz?
64. Should marketing spend mostly affect opening weekend, total gross, audience score, or awareness?

### UI and Pacing

65. Where should Studio Profile live: top nav, dashboard card, filmography tab, or separate route?
66. When should the Filmography nav item unlock?
67. How much should the release report interrupt play?
68. Should reputation changes animate like unlocks?
69. Should the player see filmography before the first release as a locked/empty goal?
70. Should genre reputation be visible during writing, after first release, or only on Studio Profile?

### Tone and Content

71. Should rival/buyer studios remain fictional and playful?
72. Should generated movie titles lean realistic, funny, genre-parody, or mixed?
73. Should review blurbs be written as critics, audience comments, trade press, or internal notes?
74. How silly can the game get before it stops matching the intended tone?
75. Should the game include modern industry concepts like streaming, franchises, IP, AI, and cinematic universes?

## Decisions Needed Before First Implementation

The first build should not start until these questions are answered:

1. What are the first visible filmography stats?
2. What are the first reputation categories?
3. Should reputation be numeric, labeled, or both?
4. What release metrics should exist in version one?
5. Should release results be mostly deterministic from project quality or include meaningful randomness?
6. Should the first version include project DNA choices, or only store the current generated script data?
7. Where should the Filmography screen live in navigation?
8. What tone should release lessons and review blurbs use?

## Recommended First Answers

If no strong preference exists, the recommended first implementation is:

- Filmography unlocks after the first movie release.
- Filmography list shows title, genre, critic score, audience score, total gross, profit, and result label.
- Studio Profile shows overall reputation and genre reputations as labels plus progress bars.
- Version one release metrics are critic score, audience score, total gross, profit, and reputation gain.
- Reputation is both numeric internally and label-based in the UI.
- Release reports use qualitative lessons, not exact formula breakdowns.
- Project DNA waits until after filmography and reputation are working.
- Tone is light industry-trade analysis with occasional playful movie-business flavor.
