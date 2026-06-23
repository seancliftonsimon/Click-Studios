# Ticket Booth Design System

Click Studios should move toward a tactile ticket-booth UI: chunky, readable,
playful, and studio-themed without becoming text-heavy.

## Core Direction

- The interface should feel like tickets, booth signs, counters, stamped panels,
  and physical controls.
- Use clear shapes, color, spacing, progress, and motion before explanatory text.
- Avoid eyebrow labels, kicker text, and small subtitles above main titles.
- Favor short titles, direct verbs, visible state, and obvious affordances.
- Keep game data readable first. The theme should support management decisions,
  not bury them.

## Palette

- Curtain Red: `#931621`
- Academy Gold: `#fad01c`
- Night Sky: `#313b72`
- Pale Popcorn: `#fff5bf`
- Ticket Paper: `#fffaf0`
- Ink Black: `#151313`
- Muted Ink: `#625947`
- Booth Line: `#d9c783`
- White: `#ffffff`

## Typography

- Display/signage font: `Voltaire`, then `Arial`, then `sans-serif`.
- Body/UI font: `Roboto`, then `system-ui`, then `-apple-system`, then
  `BlinkMacSystemFont`, then `Segoe UI`, then `sans-serif`.
- Use Voltaire for page titles, section titles, major navigation, and short
  booth-sign labels.
- Do not use Voltaire for movie names, dense lists, explanatory copy, small
  button text, financial values with supporting details, or modal body copy.
- Movie titles should use the body/UI stack unless they are being treated as a
  poster or marquee object.
- Body copy should usually be `14px` to `16px`; avoid smaller text except for
  compact metadata.

Suggested CSS tokens:

```css
:root {
	--cs-color-curtain: #931621;
	--cs-color-gold: #fad01c;
	--cs-color-night: #313b72;
	--cs-color-popcorn: #fff5bf;
	--cs-color-ticket: #fffaf0;
	--cs-color-ink: #151313;
	--cs-color-muted: #625947;
	--cs-color-line: #d9c783;

	--cs-font-display: "Voltaire", Arial, sans-serif;
	--cs-font-body: "Roboto", system-ui, -apple-system, BlinkMacSystemFont,
		"Segoe UI", sans-serif;

	--cs-radius-panel: 8px;
	--cs-radius-control: 8px;
	--cs-shadow-ticket: 8px 8px 0 rgba(147, 22, 33, 0.18);
	--cs-motion-fast: 140ms ease;
}
```

## Component Language

### Buttons

- Primary actions use Curtain Red, white text, a strong border, and a small
  tactile shadow.
- Secondary actions use Academy Gold or Ticket Paper depending on importance.
- Warning actions use white or Ticket Paper with Curtain Red text/border.
- Buttons should feel pressable: hover lifts slightly, active state returns to
  baseline.
- Short verbs should be preferred: `Write`, `Sell`, `Hire`, `Upgrade`, `Assign`.

### Panels

- Panels should look like ticket stock or booth placards.
- Use Ticket Paper backgrounds, Curtain Red or Booth Line borders, `8px` radius,
  and restrained offset shadows.
- Avoid deep nested cards. Use dividers, rows, tabs, or stamped chips inside a
  panel instead.

### Lists And Rankings

- Rows should be readable in the body font.
- Selected rows use Curtain Red fill or border, not only a subtle tint.
- Rank numbers, costs, and resource amounts can be bold and shape-driven.
- Avoid repeating labels when columns or component position already explain the
  value.

### Toggles And Segmented Controls

- Toggles should look physical, with a visible knob or stamped state.
- Segmented controls should use clear selected fill and border changes.
- Metric tabs should not all be identical boxes in every context; use compact
  ticket tabs, row headers, or stamped filters depending on the screen.

### Modals And Popups

- Modals should resemble a ticket-window notice or booth placard.
- Keep modal copy short.
- The title should state the result or choice directly.
- Action buttons should sit together and use the same tactile button language.
- Tutorial hints may use the same palette but should stay lighter and less
  interruptive than blocking modals.

### Progress And Feedback

- Progress bars should look like ticket punches, booth gauges, or sturdy fills.
- Resource counters should visibly react when fed.
- Unlocks should use quick card flips, stamps, flashes, or ticket-punch motion.
- Keep animation brief and readable.

## Implementation Plan

### 1. Create Shared Tokens

- Add color, font, radius, shadow, and motion tokens in shared styles.
- Expose the palette in the Vuetify theme.
- Load or confirm `Voltaire` for display use.
- Keep `Roboto`/system sans as the body UI font.

### 2. Build Primitive Classes

- Add reusable classes for:
  - `.cs-panel`
  - `.cs-button`
  - `.cs-button-primary`
  - `.cs-button-secondary`
  - `.cs-button-warning`
  - `.cs-row`
  - `.cs-segmented-control`
  - `.cs-progress`
  - `.cs-modal`
- Prefer classes/tokens before creating new Vue abstractions.

### 3. Convert The App Shell

- Update the top nav to use the final palette tokens.
- Keep the ticket-logo feeling, but make nav items and Save/Load/Reset match the
  same button language.
- Remove inline colors from the shell where possible.

### 4. Convert High-Traffic Writing UI

- Start with Writing because it is the first screen and has the densest early
  interaction loop.
- Convert writing button, word counter, money counter, product sale card,
  writing tool card, worker cards, and writers room panels.
- Use Voltaire for section signage, but body font for movie names, costs,
  descriptions, worker names, and compact stats.

### 5. Convert Guidance And Popups

- Update popup base styles to use ticket-window panels and tactile actions.
- Make guided hints use consistent highlight, bubble, and button tokens.
- Keep guidance short and avoid eyebrow labels.

### 6. Convert Preproduction And Filming

- Apply the same panel, row, button, and progress primitives to department
  progress cards, investor cards, inspiration shop, shot timeline, and viewfinder
  supporting UI.
- Let phase-specific components vary layout, but keep the shared control
  language.

### 7. Remove Local Styling Drift

- Audit inline styles and one-off button/card colors.
- Replace duplicated shadows, radii, borders, and hard-coded colors with tokens.
- Keep exceptions only where the component is intentionally distinct, such as a
  poster, ticket, modal, or viewfinder.

### 8. Verify In Browser

- Check desktop and narrow widths.
- Confirm no clipped controls or overlapping panels.
- Confirm hover, active, selected, disabled, locked, complete, and warning states.
- Run `npm run build`.

## First Screens To Convert

1. App shell/nav/actions.
2. Writing button and counters.
3. Writing sale and upgrade cards.
4. Writers room and worker cards.
5. Popup base and guided hints.
6. Preproduction progress/action cards.
