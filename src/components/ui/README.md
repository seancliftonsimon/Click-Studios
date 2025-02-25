# Click Studios Popup System

This directory contains the components for the Click Studios popup system. The popup system is designed to be flexible, maintainable, and support various types of popups.

## Components

### PopupBase.vue

The base component for all popups. It provides the core functionality and styling for popups.

### InfoPopup.vue

A popup for displaying informational messages. It extends PopupBase and adds specific functionality for info popups.

### ConfirmPopup.vue

A popup for confirmation dialogs with confirm and cancel options. It extends PopupBase and adds specific functionality for confirmation popups.

### InputPopup.vue

A popup for collecting user input. It extends PopupBase and adds specific functionality for input popups.

### PopupManager.vue

A component that manages the popup queue and renders the appropriate popup type.

## Usage

### Using the Popup Service

The popup service provides a convenient API for showing popups. It's available as a singleton instance and can be imported from the services directory:

```javascript
import { popupService } from "@/services";

// Show a popup by ID
popupService.showPopup("tutorial_welcome");

// Show an info popup
popupService.showInfoPopup("Title", "Message", {
	emoji: "✨",
	theme: "default",
	buttonText: "OK",
});

// Show a confirmation popup
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

// Show an input popup
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
		maxLength: 50,
		required: true,
	}
);

// Show an achievement notification
popupService.showAchievement(
	"Achievement Unlocked",
	"You have unlocked a new achievement!",
	"🏆"
);

// Show a feature unlock notification
popupService.showFeatureUnlock(
	"New Feature",
	"You have unlocked a new feature!",
	"🔓"
);

// Show an error message
popupService.showError("Something went wrong!");

// Close the current popup
popupService.closeCurrentPopup();

// Clear all popups
popupService.clearAllPopups();
```

### Registering Popups

Popups are registered in the `src/data/popups.js` file. Each popup has a unique ID and a configuration object. The configuration object must include the following properties:

- `id`: Unique identifier
- `type`: Popup type (info, input, confirm, list, custom)
- `title`: Popup title
- `text`: Main content text

Optional properties:

- `emoji`: Optional emoji icon
- `theme`: Visual theme
- Type-specific properties (inputTarget, confirmAction, etc.)

Example:

```javascript
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
	// ...
};
```

### Popup Types

The popup system supports the following popup types:

- `info`: For displaying informational messages
- `confirm`: For confirmation dialogs with confirm and cancel options
- `input`: For collecting user input

### Popup Themes

The popup system supports the following themes:

- `default`: Default theme
- `tutorial`: Theme for tutorial popups
- `achievement`: Theme for achievement popups
- `error`: Theme for error popups
- `success`: Theme for success popups
- `warning`: Theme for warning popups

## Extending the Popup System

To add a new popup type:

1. Create a new component that extends PopupBase
2. Add the new popup type to the PopupManager component
3. Add a method to the popup service for showing the new popup type

To add a new popup theme:

1. Add the new theme to the PopupBase component's CSS
2. Use the new theme in your popup configurations
