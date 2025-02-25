export default {
	namespaced: true,

	state: {
		activePopups: [], // Stack of popups (to allow multiple/queued popups)
		popupRegistry: {}, // Registry of popup definitions
		popupHistory: [], // History of displayed popups
		popupQueue: [], // Queue for sequential popups
		globalSettings: {
			animationSpeed: 300, // Default animation speed in ms
			defaultTheme: "default", // Default theme for popups
			allowBackdropClose: false, // Ensure clicking backdrop does not close popup
			escToClose: false, // Ensure ESC key does not close popup
		},
		registrationComplete: false, // Flag to track if registration is complete
		registrationErrors: false, // Flag to track if there were any errors during registration
	},

	mutations: {
		REGISTER_POPUP(state, { id, config }) {
			// Basic validation
			if (!id || !config.type) {
				console.error("Invalid popup configuration", { id, config });
				state.registrationErrors = true;
				return;
			}

			// Register the popup without logging
			state.popupRegistry[id] = config;
		},

		SET_REGISTRATION_COMPLETE(state, value) {
			state.registrationComplete = value;

			// Only log if registration is complete and there were no errors
			if (value && !state.registrationErrors) {
				console.log("All popups registered successfully");
			}
		},

		SHOW_POPUP(state, { id, props = {} }) {
			// Check if the popup is registered
			if (!state.popupRegistry[id]) {
				console.error(`Popup ${id} is not registered.`);
				console.log("Available popups:", Object.keys(state.popupRegistry));
				return;
			}

			// Merge the popup configuration with any provided props
			const popupConfig = {
				...state.popupRegistry[id],
				...props,
			};

			// Add the popup to the active list
			state.activePopups.push({
				id,
				config: popupConfig,
			});

			// Add to history
			state.popupHistory.push(id);
		},

		QUEUE_POPUP(state, { id, props = {} }) {
			const popupConfig = state.popupRegistry[id];

			if (!popupConfig) {
				console.error(`Cannot queue popup: ${id} is not registered`);
				return;
			}

			// Add to queue
			state.popupQueue.push({ id, props });
		},

		CLOSE_POPUP(state) {
			if (state.activePopups.length > 0) {
				// Add to history before removing
				const popup = state.activePopups.pop();
				state.popupHistory.push({
					...popup,
					closedAt: Date.now(),
				});
			}
		},

		CLEAR_ALL_POPUPS(state) {
			// Add all active popups to history
			const now = Date.now();
			state.popupHistory = [
				...state.popupHistory,
				...state.activePopups.map((popup) => ({
					...popup,
					closedAt: now,
				})),
			];

			state.activePopups = [];
		},

		CLEAR_POPUP_QUEUE(state) {
			state.popupQueue = [];
		},

		SHOW_NEXT_POPUP(state) {
			if (state.popupQueue.length > 0) {
				const nextPopup = state.popupQueue.shift();
				const popupConfig = state.popupRegistry[nextPopup.id];

				// Merge default config with provided props
				const popupData = {
					id: nextPopup.id,
					config: { ...popupConfig, ...nextPopup.props },
					timestamp: Date.now(),
				};

				state.activePopups.push(popupData);
			}
		},

		UPDATE_GLOBAL_SETTINGS(state, settings) {
			state.globalSettings = { ...state.globalSettings, ...settings };
		},
	},

	actions: {
		registerPopup({ commit }, { id, config }) {
			commit("REGISTER_POPUP", { id, config });
		},

		showPopup({ commit, state }, { id, props = {} }) {
			// Check if popup exists in registry
			if (!state.popupRegistry[id]) {
				console.error(`Popup ${id} is not registered`);
				return;
			}

			commit("SHOW_POPUP", { id, props });
		},

		queuePopup({ commit, state, dispatch }, { id, props = {} }) {
			// Check if popup exists in registry
			if (!state.popupRegistry[id]) {
				console.error(`Popup ${id} is not registered`);
				return;
			}

			// If no active popups, show immediately, otherwise queue
			if (state.activePopups.length === 0) {
				dispatch("showPopup", { id, props });
			} else {
				commit("QUEUE_POPUP", { id, props });
			}
		},

		closePopup({ commit, state, dispatch }) {
			commit("CLOSE_POPUP");

			// Show next popup in queue if available
			if (state.popupQueue.length > 0 && state.activePopups.length === 0) {
				dispatch("showNextPopup");
			}
		},

		clearAllPopups({ commit }) {
			commit("CLEAR_ALL_POPUPS");
		},

		clearPopupQueue({ commit }) {
			commit("CLEAR_POPUP_QUEUE");
		},

		showNextPopup({ commit }) {
			commit("SHOW_NEXT_POPUP");
		},

		updateGlobalSettings({ commit }, settings) {
			commit("UPDATE_GLOBAL_SETTINGS", settings);
		},

		registerPopupGroup({ dispatch }, popupGroup) {
			// Register a group of popups at once
			Object.entries(popupGroup).forEach(([key, config]) => {
				dispatch("registerPopup", {
					id: config.id || key,
					config,
				});
			});
		},

		completeRegistration({ commit }) {
			// Mark registration as complete and trigger the final log message
			commit("SET_REGISTRATION_COMPLETE", true);
		},
	},

	getters: {
		currentPopup: (state) =>
			state.activePopups[state.activePopups.length - 1] || null,
		hasActivePopups: (state) => state.activePopups.length > 0,
		popupQueueLength: (state) => state.popupQueue.length,
		getPopupById: (state) => (id) => state.popupRegistry[id] || null,
		globalSettings: (state) => state.globalSettings,
		popupHistory: (state) => state.popupHistory,
		isRegistrationComplete: (state) => state.registrationComplete,
		hasRegistrationErrors: (state) => state.registrationErrors,
	},
};
