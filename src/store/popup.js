import { defineStore } from "pinia";

// Pinia store managing the state and logic for all popups.
// (Formerly the namespaced Vuex module "popupManager".)
export const usePopupStore = defineStore("popup", {
	state: () => ({
		activePopups: [], // Stack of popups (to allow multiple/queued popups)
		popupRegistry: {}, // Registry of popup definitions
		popupHistory: [], // History of displayed popups
		popupQueue: [], // Queue for sequential popups
		globalSettings: {
			animationSpeed: 300,
			defaultTheme: "default",
			allowBackdropClose: false,
			escToClose: false,
		},
		registrationComplete: false,
		registrationErrors: false,
	}),

	getters: {
		currentPopup: (state) =>
			state.activePopups[state.activePopups.length - 1] || null,
		hasActivePopups: (state) => state.activePopups.length > 0,
		popupQueueLength: (state) => state.popupQueue.length,
		getPopupById: (state) => (id) => state.popupRegistry[id] || null,
		isRegistrationComplete: (state) => state.registrationComplete,
		hasRegistrationErrors: (state) => state.registrationErrors,
	},

	actions: {
		// --- Former mutations ---
		REGISTER_POPUP({ id, config }) {
			if (!id || !config.type) {
				console.error("Invalid popup configuration", { id, config });
				this.registrationErrors = true;
				return;
			}
			this.popupRegistry[id] = config;
		},

		SET_REGISTRATION_COMPLETE(value) {
			this.registrationComplete = value;
			if (value && !this.registrationErrors) {
				console.log("All popups registered successfully");
			}
		},

		SHOW_POPUP({ id, props = {} }) {
			if (!this.popupRegistry[id]) {
				console.error(`Popup ${id} is not registered.`);
				console.log("Available popups:", Object.keys(this.popupRegistry));
				return;
			}
			const popupConfig = { ...this.popupRegistry[id], ...props };
			this.activePopups.push({ id, config: popupConfig });
			this.popupHistory.push(id);
		},

		QUEUE_POPUP({ id, props = {} }) {
			const popupConfig = this.popupRegistry[id];
			if (!popupConfig) {
				console.error(`Cannot queue popup: ${id} is not registered`);
				return;
			}
			this.popupQueue.push({ id, props });
		},

		CLOSE_POPUP() {
			if (this.activePopups.length > 0) {
				const popup = this.activePopups.pop();
				this.popupHistory.push({ ...popup, closedAt: Date.now() });
			}
		},

		CLEAR_ALL_POPUPS() {
			const now = Date.now();
			this.popupHistory = [
				...this.popupHistory,
				...this.activePopups.map((popup) => ({ ...popup, closedAt: now })),
			];
			this.activePopups = [];
		},

		CLEAR_POPUP_QUEUE() {
			this.popupQueue = [];
		},

		SHOW_NEXT_POPUP() {
			if (this.popupQueue.length > 0) {
				const nextPopup = this.popupQueue.shift();
				const popupConfig = this.popupRegistry[nextPopup.id];
				const popupData = {
					id: nextPopup.id,
					config: { ...popupConfig, ...nextPopup.props },
					timestamp: Date.now(),
				};
				this.activePopups.push(popupData);
			}
		},

		UPDATE_GLOBAL_SETTINGS(settings) {
			this.globalSettings = { ...this.globalSettings, ...settings };
		},

		// --- Former actions ---
		registerPopup({ id, config }) {
			this.REGISTER_POPUP({ id, config });
		},

		showPopup({ id, props = {} }) {
			if (!this.popupRegistry[id]) {
				console.error(`Popup ${id} is not registered`);
				return;
			}
			this.SHOW_POPUP({ id, props });
		},

		queuePopup({ id, props = {} }) {
			if (!this.popupRegistry[id]) {
				console.error(`Popup ${id} is not registered`);
				return;
			}
			if (this.activePopups.length === 0) {
				this.SHOW_POPUP({ id, props });
			} else {
				this.QUEUE_POPUP({ id, props });
			}
		},

		closePopup() {
			this.CLOSE_POPUP();
			if (this.popupQueue.length > 0 && this.activePopups.length === 0) {
				this.showNextPopup();
			}
		},

		clearAllPopups() {
			this.CLEAR_ALL_POPUPS();
		},

		clearPopupQueue() {
			this.CLEAR_POPUP_QUEUE();
		},

		showNextPopup() {
			this.SHOW_NEXT_POPUP();
		},

		updateGlobalSettings(settings) {
			this.UPDATE_GLOBAL_SETTINGS(settings);
		},

		registerPopupGroup(popupGroup) {
			Object.entries(popupGroup).forEach(([key, config]) => {
				this.registerPopup({ id: config.id || key, config });
			});
		},

		completeRegistration() {
			this.SET_REGISTRATION_COMPLETE(true);
		},
	},
});
