# Writing Phase Balance & Economy Overhaul — Implementation Plan

Last updated: 2026-06-23
Status: **Finalized — all decisions locked, ready to implement.**

This plan rebalances the **Writing** phase so the player unlocks something on a
steady cadence, never has to click rapidly for too long to reach the next thing,
and transitions cleanly from active clicking to idle automation. It also replaces
the single expiring-worker model with a two-track **freelance vs. contract** labor
system.

## Locked decisions (quick reference)

| Decision | Choice |
| --- | --- |
| Shooting Script finale | **200,000 words** |
| Script Doctor multiplier | **Diminishing: `1 + 0.2 * count`** (no longer compounding) |
| Payroll model | **Discrete renewals** |
| Payroll clock | **Global payday** — one shared 5-min timer; new hires skip their first payday |
| Payroll shortfall | **Highest-salary contract lapses first** |
| Payroll warning | One-cycle-ahead warning toast before an unaffordable payday |
| Freelance card display | **Single active card** (in-place upgrade ladder) |
| Freelance re-hiring | **Manual only** (no auto-rehire toggle) |
| Script Doctor seats | **Shares the Writers Room seat cap** with everyone else |
| Script Doctor terms | $24,000 signing (x1.15/head) + $600/payday salary |
| Roster names | Intern · Junior Writer · Freelance Screenwriter · Staff Writer · Senior Staff · Script Doctor |
| Writing tool ladder | **Set B — 10 throughput-themed tools** (Pencil → Printing Plant); no AI/render/supercomputer |
| Tier advancement | **Player-paced** — selling 5 unlocks the next tier as a choice; the current product stays sellable; advance when ready |
| Anti-valley approach | **Static tool sequencing** (price tracks pay, power tracks cost) + player-paced advance — **no** dynamic click floor, **no** per-sale skill wps |

## Scope

**In scope (this plan):**

- Writing product ladder retune (word costs + pay).
- Writing tool ladder (throughput-themed Set B) + the static anti-valley loop.
- Worker model redesign: Freelancers (temp) + Staff (contract/payroll).
- Script Doctor changed from compounding to diminishing multiplier.
- Shooting Script finale set to 200,000 words.

**Out of scope (deferred, do not touch here):**

- Preproduction pitching/searching click economy, investor tiers, inspiration
  shop, department balancing. These are a **separate later effort** with their own
  plan. Nothing in this document should change preproduction numbers or flow.
- Filmography / reputation systems (see `filmography-and-reputation-plan.md`).

## Design intent & cadence targets

Tune against these guardrails, not just raw numbers:

- **Constant time-between-rewards.** The wait to the next unlock/purchase should
  stay in a band the whole phase, not be trivial early and a wall late.
- **Click to bootstrap, idle to scale.** Manual clicking carries roughly the first
  2-3 minutes, then becomes a top-up. Any step longer than ~90s should be
  idle/automation time, not click time.
- **Uniform, legible challenge.** The challenge numbers are fixed and identical for
  every player. No dynamic guardrails the player could feel (no auto-scaling click
  value, no hidden per-sale wps). The legible answer to a rising click count is
  always "buy the next tool," and that tool is always affordable.
- **Gentle ratios.** ~5-7x between product tiers; no lone 33x cliff.
- **Cadence:** first unlock < 30s, early unlocks every ~60-90s, mid-game every
  2-4 min. Whole Writing phase ~20-30 min for a first-time player.
- **Automation timing:** contract staff should be a worthwhile buy by ~10-15 min
  of playtime and clearly the dominant strategy by ~20 min.

---

## Part 1 — Product ladder retune

Selling 5 of a tier **unlocks** the next one — but advancement is now
**player-paced** (Part 2.3), not automatic: the current product stays sellable so
the player can bank for the next tool before graduating. Word costs hold a steady
~6x ratio and remove the old 33x cliff to the shooting script; pay rises so each
tier feels like a raise.

| Tier | Word cost (old -> new) | Pay (old -> new) | `text` label |
| --- | --- | --- | --- |
| Logline | 20 -> **15** | $6 -> **$6** | Earn $6 |
| Synopsis | 120 -> **120** | $40 -> **$42** | Earn $42 |
| Outline | 800 -> **700** | $320 -> **$300** | Earn $300 |
| Treatment | 5,000 -> **4,000** | $2,200 -> **$2,000** | Earn $2,000 |
| Draft Script | 30,000 -> **22,000** | $15,000 -> **$13,000** | Earn $13,000 |
| Shooting Script | 1,000,000 -> **200,000** | greenlight | Greenlight your project. |

Word-cost ratios become ~6.7x / 5.8x / 5.7x / 5.5x / **9.1x** for the finale. The
finale stays the single largest step (a deliberate "final push") but lands in
~2.4-3.3 min of idle output at the realistic ~1,000-1,400 wps band instead of
being a 15-min wall.

**Where:** `products` state in `src/store/index.js`. Update each entry's `cost`,
`pay`, and `text`. The milestone gates in `sellProduct` still fire on the 5th sale,
but they now **unlock** the next tier (flag it available) instead of auto-switching
the active card — see Part 2.3.

---

## Part 2 — Writing tools & the anti-valley loop

The valley (forced onto a higher tier with a too-weak tool, no cash for the next
one, no automation floor) is solved **statically** — no dynamic click floor, no
hidden per-sale wps. The challenge numbers are fixed and identical for every
player; the legible way out of a click grind is always **buy the next tool**, and
that tool is always affordable from the tier you're on.

### 2.1 Tool ladder (Set B — throughput-themed)

Named for word *output* (hand-writing -> mechanical -> mass printing), not tech
era. Early steps are small/cheap/frequent (gentle ramp); late steps are big leaps
that pay off on high-value stories.

| Tool | words/click | cost |
| --- | --- | --- |
| Pencil | 1 | $0 |
| Ballpoint Pen | 2 | $12 |
| Fountain Pen | 4 | $40 |
| Typewriter | 7 | $110 |
| Electric Typewriter | 14 | $280 |
| Word Processor | 28 | $650 |
| Mechanical Keyboard | 80 | $2,400 |
| Printing Press | 300 | $10,000 |
| Industrial Printer | 1,200 | $45,000 |
| Printing Plant | 4,500 | $160,000 |

Early ratios ~x1.75-2; late ratios ~x3-4. (Names are swappable — e.g. Mechanical
Keyboard -> Dictation Machine, Industrial Printer -> Offset Printer.)

### 2.2 Two static rules that kill the valley

1. **Price tracks pay.** Each tool costs ~2-4 sales of the product tier it serves,
   so the next tool is always reachable from the work you're already doing.
   Anchored against the product pays (logline $6, synopsis $42, outline $300,
   treatment $2,000, draft $13,000): Pencil->Fountain Pen carry logline/synopsis;
   Typewriter/Electric Typewriter/Word Processor carry outline; Mechanical Keyboard
   carries treatment; Printing Press carries draft; Industrial Printer/Printing
   Plant carry the shooting finale. On the *matched* tool, clicks-per-story stay
   ~20-40 the whole way.
2. **Power tracks cost.** Each tool is strong enough that, once bought, it returns
   clicks-per-story to that ~20-40 band. When you cross into a new tier still
   holding your old tool, clicks rise (the uniform "go buy the next tool" signal) —
   identical in shape for everyone, and the upgrade is affordable.

### 2.3 Player-paced advancement

Selling the 5th of a tier **unlocks** the next tier but does **not** auto-switch
the active card. The current product stays sellable, with a "Next tier ready ->"
affordance; the player advances when they choose. This lets them bank for the next
tool before graduating, so they are never shoved onto a tier they cannot yet equip
for. Compatible with the single-active-card UI: it is still one product card, plus
an advance control once the next tier is unlocked.

### 2.4 Where (code)

- `writeTools` state in `src/store/index.js`: replace the map with the Set B
  entries above (renames the former `aimodel`/`renderFarm`/`supercomputer` keys and
  re-numbers `wordsPerClick`/`cost`). Tool purchasing and the `previousToolDetails`
  getter read the map by `Object.keys` order, so keep keys ordered low->high.
  Update any tool-name references in popups/guidance.
- `sellProduct` (~lines 2548-2601): on the 5th sale, set a "next tier unlocked"
  flag instead of calling `upgradeWritingProductTier` directly. Add an
  `advanceWritingProductTier` action the player triggers from the card, and keep
  the current tier's card visible/sellable until they do. The existing
  `setWritingProductTierByIndex` / `currentWritingProductTierIndex` machinery drives
  the switch when the player confirms.

---

## Part 3 — Worker model: Freelance vs. Contract

Replace "every writer expires" with two tracks. This fixes the re-hire treadmill:
freelancers stay the hands-on early engine; contract staff become the idle backbone
that survives when the player walks away.

### 3.1 The two modes

| | Freelancers (gig) | Staff (contract) |
| --- | --- | --- |
| Duration | Temporary — expire after a short stint | Permanent — until released |
| Cost shape | **Flat** fee per hire, paid up front | **Rising signing fee** (x1.15/head) + a **salary** charged on payday |
| Player action | Manual re-hire when they expire (active) | Sign once, then ignore (idle) |
| Fails when | Never (you just stop re-hiring) | Can't make payroll -> highest-salary contract lapses |
| Role | Bootstrap + lean-in clicker layer | Idle backbone that doesn't decay |

**Rising cost rule:** the x1.15-per-head ramp lives **only on permanent staff**
(the thing you accumulate). Freelancers are a flat gig rate — re-hiring the same
intern never costs more than last time. Staff **salary is flat per head** so
payroll stays legible; the signing ramp alone does the pacing.

**No auto-rehire.** Freelancers are manual re-hire only — that friction is the
intended active layer, and it preserves a clear reason to graduate to staff.

### 3.2 Roster & numbers

Six worker types (old roster + one split). Old `screenwriter`/`cowriters` are
repurposed.

| Display name | wps | Mode | Signing / fee | Salary (per payday) | Stint |
| --- | --- | --- | --- | --- | --- |
| Intern | 1 | Freelance | $25 flat | — | 30s |
| Junior Writer | 5 | Freelance | $70 flat | — | 60s |
| Freelance Screenwriter | 15 | Freelance | $200 flat | — | 5 min |
| **Staff Writer** | 15 | **Contract** | $350 (x1.15/head) | $40 | permanent |
| **Senior Staff** | 70 | **Contract** | $3,000 (x1.15/head) | $150 | permanent |
| Script Doctor | multiplier | **Contract** | $24,000 (x1.15/head) | $600 | permanent |

Mapping from current code: `intern` unchanged; `junior` -> **Junior Writer**
(same numbers); `screenwriter` -> **Freelance Screenwriter** (same numbers,
renamed); add new **Staff Writer**; `cowriters` -> **Senior Staff** (now contract
instead of expiring); `scriptDoctor` -> **Script Doctor** contract (see Part 4).

**The rent-vs-buy decision lives at the 15-wps tier.** Freelance Screenwriter
($200 / 5 min = $200 per cycle) vs. Staff Writer ($350 signing + $40/payday).
Per cycle you save $160 with the contract, so payback is $350 / $160 = ~2.2
paydays = **~11 min of uptime**. A Staff Writer signed around the 12-min playtime
mark pays for itself by ~22 min — "useful by ~12 min, clearly better by ~20."
Senior Staff are **contract-only** (no freelance equivalent): they are the pure
post-20-min scale-up, governed by the signing ramp + seat cap, not by a crossover.

### 3.3 Payroll: discrete global payday

- **Signing** deducts the ramped fee once: `signingBase * 1.15^(current contract
  count of that type)`. Signing also requires an open seat (3.5).
- **Payday** is a single shared event. State holds `nextPayrollAt`, initialized to
  `now + 5min` when the **first** contract is signed and advanced by 5 min each
  time it fires. On the payroll tick (subscribed to `gameClockStore`), when
  `now >= nextPayrollAt`:
  1. A contract is charged only once it has been employed a **full cycle** — i.e.
     `signedAt <= nextPayrollAt - 5min`. This is the "new hires skip their first
     payday" rule; a staffer always gets a free first cycle.
  2. `totalDue = sum of salaries of all eligible contracts`.
  3. If `writingDollarCount >= totalDue`: deduct it.
  4. If short: release the **highest-salary** eligible contract, recompute, repeat
     until affordable (or none remain), then deduct the affordable remainder. Show
     a toast naming who was let go.
  5. Advance `nextPayrollAt += 5min`; clear the cycle's warning flag.
- **Warning:** when a payday is within ~30s and the projected `totalDue` exceeds
  the current balance, fire a one-time warning toast ("Payroll due soon: need $X,
  you have $Y"). Use a per-cycle `payrollWarned` flag so it fires once.
- Salaries are per-payday lumps: Staff Writer $40, Senior Staff $150, Script
  Doctor $600.

Note: salary is **light pressure / flavor**, not the governor on headcount —
sales income outweighs payroll by ~40x at the draft tier. The real caps are seats
and the signing ramp (3.4).

### 3.4 What actually bounds idle output

The real governors on permanent wps are:

1. **Seats** — the shared Writers Room cap (`writersRoomCapacities`, ~lines 1481-1493).
2. **The x1.15 signing ramp** — fielding 16 Senior Staff costs ~$167k cumulative
   (1,120 wps); 30 of them costs ~$2.2M. The ramp compounds against expansion.
3. **Room-upgrade cost curve** — $21k -> $66k -> $197k -> $590k per tier.

Realistic output at the shooting-script unlock (~24 min) is **~1,000-1,400 wps**
additive. At ~1,200 wps the 200k finale is a **~2.8 min push** — a satisfying
"my studio carries me home" beat, not trivial. Do **not** rely on salary to hold
this line; rely on seats + the signing ramp.

### 3.5 Capacity interplay

A **single shared seat cap**. Contract staff (including Script Doctors) hold seats
permanently; freelancers fill whatever is left, temporarily. The existing capacity
check in `hireWorker` (`if (this.currentWorkers.length >= this.currentWritersRoomCapacity)`,
~line 2697) enforces this once both modes live in `currentWorkers`; signing a
contract must also respect it (no free contract seats). Because Script Doctors take
normal seats, adding one means one fewer base-word writer — a real raw-output vs.
multiplier optimization.

### 3.6 UI structure (three zones)

1. **Freelancers** — a **single active card** via the existing tier ladder
   (Intern -> Junior Writer -> Freelance Screenwriter). Only the highest unlocked
   freelancer shows; lower tiers collapse into it, exactly like today's in-place
   upgrade ladder. Expiring, flat cost, manual re-hire.
2. **Staff (on contract)** — persistent stacking cards for Staff Writer then Senior
   Staff. Each card shows current headcount, the next ramped signing fee, and the
   contribution. Signing again re-rolls the ramped fee.
3. **Script Doctor** — separate specialist card (multiplier).

Add a **payroll readout**: "Payroll due: $X" with a countdown to the next payday.
The rent-vs-buy decision requires the Freelancers zone (showing Freelance
Screenwriter) and the Staff zone (showing Staff Writer) to be visible at the same
time, which the unlock cadence below guarantees.

### 3.7 Unlock cadence (tie labor to product milestones)

Interleave labor unlocks with the product ladder so each product beat also brings
a hiring beat:

| Trigger | Unlocks |
| --- | --- |
| First sale (existing first-dollars path) | Freelance hiring (Intern) |
| `$200` total earned (existing) | Junior Writer |
| Outline tier unlocked (`fiveSynopses`) | Freelance Screenwriter |
| Treatment tier unlocked (`fiveOutlines`) | **Staff Writer (contract zone opens)** |
| Draft Script tier unlocked (`fiveTreatments`) | **Senior Staff** |
| Draft Script tier unlocked (`fiveTreatments`) | Script Doctor |

Re-point the existing dollar-threshold writer unlocks in `checkDollarMilestones`
(~line 2610) and `normalizeWritingTierState` (~line 1785) onto these product
milestones for the new tiers. Keep the early freelance unlocks roughly where they
are; they already feel good.

---

## Part 4 — Script Doctor: diminishing multiplier

Replace the compounding multiplier with a diminishing (linear-additive) one so
stacking doctors can't trivialize the finale.

- **Old:** `scriptDoctorMultiplier *= Math.pow(worker.effect, worker.count)` with
  `effect = 1.4` -> x1.4, x1.96, x2.74, x3.84 ... (explodes).
- **New:** `multiplier = 1 + 0.2 * doctorCount` -> x1.2, x1.4, x1.6, x1.8, x2.0 ...
  Store `effect: 0.2` and compute `1 + effect * count`.

**Where:** `wordsPerSecond` getter in `src/store/index.js` (~lines 1554-1567).
Replace the `Math.pow` branch; sum all non-doctor workers into `baseWordsPerSecond`
as today, then return `base * (1 + 0.2 * doctorCount)`.

Sanity check at unlock (~1,200 base wps): 0 doctors = 1,200 (200k = 2.8 min),
5 doctors = x2.0 = 2,400 (200k = 1.4 min). Bounded and readable.

**Tuning note:** Script Doctors now carry three curbs at once — the x1.15 signing
ramp, the diminishing multiplier, and a shared seat cost. That may make them feel
under-powered; expect a loosening pass in playtest (e.g. drop the signing ramp or
raise the +0.2 step) once the rest of the economy is in.

---

## Part 5 — Shooting Script finale (200,000 words)

Set the shooting script `cost` to **200,000** (Part 1 table). At the realistic
~1,000-1,400 wps band this is a ~2.4-3.3 min finale — the largest single step in
the phase, paced as idle/automation time, not clicking. This number only holds
because the Script Doctor is now diminishing (Part 4); without that, a
doctor-stacked player runs 4-8x faster and the fixed cost would not survive.

(Because the anti-valley fix is fully static — no dynamic click floor — there is
no risk of an invisible safety net trivializing the finale; a fully-unautomated
player simply makes the shooting script on whatever tool they bought, at the same
fixed cost as everyone else.)

---

## Part 6 — Code change map

All in `src/store/index.js` unless noted.

- `products`: update `cost`, `pay`, `text` per Part 1.
- `writeTools`: replace the whole map with Set B (Part 2.1) — renames the
  `aimodel`/`renderFarm`/`supercomputer` keys and re-numbers values; keep keys in
  low->high order; update tool-name references in popups/guidance.
- `sellProduct` + product-card components: **player-paced advancement** (Part 2.3)
  — the 5th sale unlocks the next tier as a choice (new `advanceWritingProductTier`
  action + "next tier unlocked" flag) rather than auto-switching the active card.
- `workers` (~311-363): restructure each entry to include `employment:
  "freelance" | "contract"`, `signingBase` (contract), `salary` (per-payday lump,
  contract), and keep `wps` / `duration` (freelance). Rename `junior` display to
  "Junior Writer"; `screenwriter` -> Freelance Screenwriter; add `staffWriter`;
  convert `cowriters` -> `seniorStaff` (contract); update `scriptDoctor`
  (`effect: 0.2`, contract terms).
- `writerTierOrder` (~444): **keep** as the freelance ladder (`["intern",
  "junior", "screenwriter"]`) driving the single active freelance card via
  `currentWriterTierIndex`. **Add** a parallel `contractTierOrder =
  ["staffWriter", "seniorStaff"]` for the persistent contract cards. Update the
  visible-card getters (`visibleWorkerCardTypes`, ~1670; `currentMainWriterType`,
  ~1662) for the three-zone layout (3.6).
- New payroll state: `nextPayrollAt` (timestamp, null until first contract),
  `payrollWarned` (per-cycle flag). Each contract worker stores `signedAt`.
- `wordsPerSecond` (~1554): diminishing Script Doctor (Part 4).
- `hireWorker` (~2671): branch on `employment`. Freelance = current path (flat
  cost + timed expiry). Contract = require an open seat, deduct the ramped signing
  fee, stamp `signedAt`, add a permanent worker with no `expectedRemovalTime`, and
  initialize `nextPayrollAt` if this is the first contract.
- `expireWorkers` (~2791): only expire `employment === "freelance"` workers; skip
  contracts.
- **New payroll action** subscribed to `gameClockStore`
  (`src/stores/gameClockStore.js`): implements the global-payday logic in 3.3
  (eligibility by `signedAt`, total due, highest-salary-first lapse, advance clock,
  warning toast). Model the dollar deduction on `deductWorkerWages` in
  `src/stores/preproductionStore.js:134`.
- `checkDollarMilestones` (~2610) & `normalizeWritingTierState` (~1785): re-point
  new-tier unlocks onto product milestones (3.7).
- Components: `src/components/Writing/` — three zones (3.6): keep the freelance
  `WorkerCard`/`WritersRoom`, add a persistent Staff/Contract card, and a "Payroll
  due: $X" readout with a countdown.

---

## Part 7 — Save / migration

The save system is versioned (`src/services/saveService.js`, currently
`SAVE_VERSION = 2`, which already maps `cowriters -> seniorStaff` and seeds
`nextPayrollAt`). The save stores only progress keys (`count`/`totalcount`/
`visible`) and re-derives `cost`/`pay`/`wordsPerClick` from live config on load —
so product and tool retunes apply to existing saves automatically. When extending:

- Bump the save version if the worker/tool **shape** changes again.
- On load: ensure any contract worker's `employment`, `signingBase`, `salary`
  default from the static roster; clear stale `currentWorkers` timers; leave
  `nextPayrollAt` null until the player signs a contract post-load.
- For the tool rename (Set B): map any old saved `currentWriteTool` key
  (`aimodel`/`renderFarm`/`supercomputer`) to the nearest new key, or reset to the
  highest affordable tool, so a loaded save never points at a missing tool key.
- Focused manual check: load a pre-change save and confirm no NaN dollars, no stuck
  cards, the contract zone appears at the right milestone, and the active tool
  resolves.

---

## Part 8 — Implementation order

Stage it so each step is independently testable:

1. **Tool ladder (Set B) + player-paced advance** (Part 2). Product costs are
   already in; swap the tool map to Set B and make tier advancement player-paced.
   Biggest felt impact on the valley, lowest risk. Verify by playing to the draft
   tier.
2. **Script Doctor diminishing** (Part 4). One getter change.
3. **Shooting Script = 200k** (Part 5). One number; verify finale length.
4. **Freelance/Contract worker model** (Part 3). The real work — do it last:
   state restructure, `hireWorker` branch, global-payday action, three-zone UI,
   save migration.

---

## Part 9 — Verification / playtest checks

- First unlock arrives in < 30s; product unlocks land every ~60-90s early.
- No stretch of pure clicking longer than ~2-3 min without a purchase/unlock.
- Clicks-per-story stay ~20-40 on the matched tool; entering a new tier on the old
  tool raises clicks, but the next tool is affordable within ~2-4 sales of the
  current tier (no valley) — and the rule is the same for every player.
- Tier advancement is player-paced: the 5th sale unlocks the next tier as a choice;
  the current product stays sellable so the player can bank for the next tool first.
- A Staff Writer signed ~12 min in is net-positive vs. freelancing by ~22 min.
- At the shooting-script unlock, idle wps sits ~1,000-1,400 (not >3,000); the 200k
  finale takes ~2.4-3.3 min.
- Stacking Script Doctors scales linearly (x1.2, x1.4, x1.6...), never compounding.
- Global payday: the first payday after signing a contract is skipped for that
  contract (it gets a full free cycle); subsequent paydays charge it.
- Running out of cash on a payday lapses the **highest-salary** contract first —
  no negative balance, no crash — and a warning toast fired ~30s earlier.
- Old saves load and migrate without orphaned worker timers or missing tool keys.

---

## Deferred / optional (not v1)

- **Extra "Polished Draft" product tier** between Draft and Shooting Script — adds
  one more unlock beat and lengthens the phase without inflating any single step.
  Add only if playtesting shows the phase ends too quickly.
- **Per-card "day rate vs. sign to contract" toggle** on every archetype (more
  agency, more UI/save cost) instead of the split roster. Revisit if players ask.
- **Script Doctor loosening pass** if the three combined curbs make them too weak
  (Part 4 tuning note).
- **Lengthening freelance stints** (Intern 30s -> 60s, Junior 60s -> 120s) if the
  early re-hire cadence feels too busy.
- All preproduction labor/economy work — separate plan.

### Explicitly rejected (do not reintroduce)

- **Dynamic relative click floor** (click value scaling with the current product's
  size). Rejected: it is a guardrail the player can feel and makes the challenge
  non-uniform between players. The static tool-sequencing in Part 2 replaces it.
- **Per-sale permanent "skill" wps.** Rejected for the same reason — passive output
  comes only from hired workers.
