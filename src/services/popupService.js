import store from "@/store";
import { popupKeyMapping } from "@/data/popups";

/**
 * Popup Service
 * Provides methods for displaying and managing popups
 */
class PopupService {
	/**
	 * Constructor
	 */
	constructor() {
		this.store = store;
	}

	/**
	 * Show a popup by ID with optional props
	 * @param {string} id - The ID of the popup to show
	 * @param {Object} props - Optional props to override default popup configuration
	 * @returns {void}
	 */
	showPopup(id, props = {}) {
		// Check for legacy popup keys
		const mappedId = popupKeyMapping[id] || id;

		this.store.dispatch("popupManager/showPopup", {
			id: mappedId,
			props,
		});
	}

	/**
	 * Queue a popup to be shown after the current popup is closed
	 * @param {string} id - The ID of the popup to queue
	 * @param {Object} props - Optional props to override default popup configuration
	 * @returns {void}
	 */
	queuePopup(id, props = {}) {
		// Check for legacy popup keys
		const mappedId = popupKeyMapping[id] || id;

		this.store.dispatch("popupManager/queuePopup", {
			id: mappedId,
			props,
		});
	}

	/**
	 * Show an info popup with the given title and text
	 * @param {string} title - The title of the popup
	 * @param {string} text - The main content text
	 * @param {Object} options - Additional options for the popup
	 * @returns {void}
	 */
	showInfoPopup(title, text, options = {}) {
		const popupConfig = {
			type: "info",
			title,
			text,
			...options,
		};

		// Generate a dynamic ID if not provided
		const id = options.id || `dynamic_info_${Date.now()}`;

		// Register the popup first
		this.store.dispatch("popupManager/registerPopup", {
			id,
			config: popupConfig,
		});

		// Then show it
		this.store.dispatch("popupManager/showPopup", {
			id,
			props: {},
		});
	}

	/**
	 * Show a confirmation popup with the given title and text
	 * @param {string} title - The title of the popup
	 * @param {string} text - The main content text
	 * @param {Function} onConfirm - Callback function when confirmed
	 * @param {Object} options - Additional options for the popup
	 * @returns {void}
	 */
	showConfirmPopup(title, text, onConfirm, options = {}) {
		const popupConfig = {
			type: "confirm",
			title,
			text,
			onConfirm,
			onCancel: options.onCancel,
			confirmText: options.confirmText || "Confirm",
			cancelText: options.cancelText || "Cancel",
			confirmColor: options.confirmColor || "primary",
			cancelColor: options.cancelColor || "grey",
			...options,
		};

		// Generate a dynamic ID if not provided
		const id = options.id || `dynamic_confirm_${Date.now()}`;

		// Register the popup first
		this.store.dispatch("popupManager/registerPopup", {
			id,
			config: popupConfig,
		});

		// Then show it
		this.store.dispatch("popupManager/showPopup", {
			id,
			props: {},
		});
	}

	/**
	 * Show an input popup with the given title and text
	 * @param {string} title - The title of the popup
	 * @param {string} text - The main content text
	 * @param {Function} onSubmit - Callback function when submitted
	 * @param {Object} options - Additional options for the popup
	 * @returns {void}
	 */
	showInputPopup(title, text, onSubmit, options = {}) {
		const popupConfig = {
			type: "input",
			title,
			text,
			onSubmit,
			onCancel: options.onCancel,
			inputLabel: options.inputLabel || "Enter your response",
			inputPlaceholder: options.inputPlaceholder || "",
			inputHint: options.inputHint || "",
			defaultValue: options.defaultValue || "",
			maxLength: options.maxLength || 0,
			required: options.required !== false,
			inputTarget: options.inputTarget || "",
			submitText: options.submitText || "Submit",
			submitColor: options.submitColor || "primary",
			showCancelButton: options.showCancelButton || false,
			cancelText: options.cancelText || "Cancel",
			cancelColor: options.cancelColor || "grey",
			...options,
		};

		// Generate a dynamic ID if not provided
		const id = options.id || `dynamic_input_${Date.now()}`;

		// Register the popup first
		this.store.dispatch("popupManager/registerPopup", {
			id,
			config: popupConfig,
		});

		// Then show it
		this.store.dispatch("popupManager/showPopup", {
			id,
			props: {},
		});
	}

	/**
	 * Close the current popup
	 * @returns {void}
	 */
	closeCurrentPopup() {
		this.store.dispatch("popupManager/closePopup");
	}

	/**
	 * Clear all popups
	 * @returns {void}
	 */
	clearAllPopups() {
		this.store.dispatch("popupManager/clearAllPopups");
	}

	/**
	 * Show an achievement notification
	 * @param {string} title - The achievement title
	 * @param {string} text - The achievement description
	 * @param {string} emoji - The emoji to display
	 * @returns {void}
	 */
	showAchievement(title, text, emoji = "🏆") {
		this.showInfoPopup(title, text, {
			emoji,
			theme: "achievement",
			buttonText: "Great!",
		});
	}

	/**
	 * Show a feature unlock notification
	 * @param {string} featureName - The name of the unlocked feature
	 * @param {string} description - The feature description
	 * @param {string} emoji - The emoji to display
	 * @returns {void}
	 */
	showFeatureUnlock(featureName, description, emoji) {
		this.showInfoPopup(`🔓 ${featureName}`, description, {
			emoji,
			theme: "achievement",
			buttonText: "Great!",
		});
	}

	/**
	 * Show an error message
	 * @param {string} message - The error message
	 * @param {string} title - The error title
	 * @returns {void}
	 */
	showError(message, title = "Error") {
		this.showInfoPopup(title, message, {
			emoji: "⚠️",
			theme: "error",
			buttonText: "OK",
		});
	}

	/**
	 * Show a temporary toast notification that auto-dismisses
	 * @param {string} message - The toast message
	 * @returns {void}
	 */
	showTemporaryToast(message) {
		this.store.dispatch("showToast", {
			message,
			type: "temporary",
		});
	}

	/**
	 * Show a persistent toast notification that requires manual dismissal
	 * @param {string} message - The toast message
	 * @returns {void}
	 */
	showPersistentToast(message) {
		this.store.dispatch("showToast", {
			message,
			type: "persistent",
		});
	}
}

// Create and export a singleton instance
const popupService = new PopupService();
export default popupService;
