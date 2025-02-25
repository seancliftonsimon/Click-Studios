# Popup System Migration Guide

This guide will help you migrate from the old popup system to the new, more versatile popup system in Click Studios.

## Overview of Changes

The new popup system offers several improvements:

- Support for different popup types (info, input, confirm)
- A queue mechanism for sequential popups
- Improved styling and animations
- Better organization of popup definitions
- A service-based API for showing popups

## Migration Steps

### Step 1: Update Import Statements

Replace imports of the old `PopupComponent` with the new `PopupManager`:

```javascript
// Old
import PopupComponent from "@/components/PopupComponent.vue";

// New
import PopupManager from "@/components/ui/PopupManager.vue";
```

### Step 2: Update Component Registration

Update component registration in your Vue components:

```javascript
// Old
components: {
  PopupComponent,
},

// New
components: {
  PopupManager,
},
```

### Step 3: Update Popup Triggers

Replace direct Vuex store calls with the popup service:

```javascript
// Old
this.$store.dispatch("showPopup", "tutorialOne");

// New
import { popupService } from "@/services";
popupService.showPopup("tutorial_welcome");
```

### Step 4: Update Popup Definitions

The new popup system uses a standardized format for popup definitions. Update your popup definitions in `src/data/popups.js`:

```javascript
// Old
export const tutorialPopups = {
	welcome: {
		type: "input",
		title: "Name Your Studio",
		emoji: "✨",
		text: "Thanks for trying out my game! \n\n Name your studio to begin:",
		buttonText: "Next",
		inputTarget: "studioName",
		nextPopup: "tutorial_introduction",
		theme: "tutorial",
	},
};

// New
export const tutorialPopups = {
	welcome: {
		id: "tutorial_welcome",
		type: "input",
		title: "Name Your Studio",
		emoji: "✨",
		text: "Thanks for trying out my game! \n\n Name your studio to begin:",
		buttonText: "Next",
		inputTarget: "studioName",
		nextPopup: "tutorial_introduction",
		theme: "tutorial",
	},
};
```

### Step 5: Update Popup Types

The new popup system uses different type names:

- `default` is now `info`
- `confirm` remains `confirm`
- `input` remains `input`

Update your popup definitions accordingly:

```javascript
// Old
type: "default",

// New
type: "info",
```

### Step 6: Use the Popup Service for Dynamic Popups

For dynamically created popups, use the popup service methods:

```javascript
// Old
this.$store.dispatch("showPopup", {
	type: "default",
	title: "Achievement Unlocked",
	text: "You have unlocked a new achievement!",
	emoji: "🏆",
	theme: "achievement",
	buttonText: "Great!",
});

// New
import { popupService } from "@/services";
popupService.showAchievement(
	"Achievement Unlocked",
	"You have unlocked a new achievement!",
	"🏆"
);
```

### Step 7: Update Confirmation Popups

For confirmation popups, use the `showConfirmPopup` method:

```javascript
// Old
this.$store.dispatch("showPopup", {
	type: "confirm",
	title: "Confirm Action",
	text: "Are you sure you want to proceed?",
	confirmText: "Yes",
	cancelText: "No",
	confirmColor: "primary",
	theme: "default",
});

// New
import { popupService } from "@/services";
popupService.showConfirmPopup(
	"Confirm Action",
	"Are you sure you want to proceed?",
	() => {
		// Action to perform when confirmed
		console.log("Confirmed!");
	},
	{
		confirmText: "Yes",
		cancelText: "No",
		emoji: "❓",
	}
);
```

### Step 8: Update Input Popups

For input popups, use the `showInputPopup` method:

```javascript
// Old
this.$store.dispatch("showPopup", {
	type: "input",
	title: "Enter Name",
	text: "Please enter your name:",
	inputTarget: "playerName",
	buttonText: "Submit",
	theme: "default",
});

// New
import { popupService } from "@/services";
popupService.showInputPopup(
	"Enter Name",
	"Please enter your name:",
	(value) => {
		// Action to perform with the input value
		console.log(`Name: ${value}`);
	},
	{
		inputLabel: "Name",
		inputPlaceholder: "John Doe",
		inputTarget: "playerName",
		maxLength: 50,
		required: true,
	}
);
```

### Step 9: Update Popup Closing

Replace direct Vuex store calls with the popup service:

```javascript
// Old
this.$store.commit("SET_POPUP_VISIBLE", false);

// New
import { popupService } from "@/services";
popupService.closeCurrentPopup();
```

## Backward Compatibility

The new popup system includes a compatibility layer that maps old popup keys to new ones. This allows existing code to continue working while you migrate to the new system.

The mapping is defined in `src/data/popups.js`:

```javascript
export const popupKeyMapping = {
	tutorialOne: "tutorial_welcome",
	introduction: "tutorial_introduction",
	// ...
};
```

## Testing

After migrating, test all popup functionality to ensure everything works as expected:

1. Test all popup types (info, input, confirm)
2. Test popup queuing
3. Test popup closing
4. Test popup transitions
5. Test popup themes

## Need Help?

If you encounter any issues during migration, refer to the documentation in `src/components/ui/README.md` or contact the development team.
