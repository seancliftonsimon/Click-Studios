export default {
	namespaced: true,

	state: {
		progressBars: {}, // Will store progress for each component type
		maxValues: {}, // Will store max values for each component type
	},

	mutations: {
		UPDATE_PROGRESS(state, { componentId, progress }) {
			// Don't create new object, just update existing one
			state.progressBars[componentId] = { ...progress };
		},
		RESET_PROGRESS(state, componentId) {
			state.progressBars[componentId] = {
				barOne: 0,
				barTwo: 0,
				barThree: 0,
			};
		},
		SET_MAX_VALUES(state, { componentId, maxValues }) {
			state.maxValues[componentId] = { ...maxValues };
		},
	},

	actions: {
		calculateProgress({ commit, getters, state }, { componentId, amount }) {
			// Get current progress
			const currentProgress = getters.getProgress(componentId);

			// Use stored max values or fallback to defaults
			const maxVals = state.maxValues[componentId] || {
				barOne: 3,
				barTwo: 5,
				barThree: 10,
			};

			// Create a new progress object to avoid modifying the original
			const newProgress = { ...currentProgress };

			// Update barThree
			newProgress.barThree += amount;

			// Handle overflow for barThree to barTwo
			while (newProgress.barThree >= maxVals.barThree) {
				newProgress.barThree -= maxVals.barThree;
				newProgress.barTwo += 1;
			}

			// Handle overflow for barTwo to barOne
			while (newProgress.barTwo >= maxVals.barTwo) {
				newProgress.barTwo -= maxVals.barTwo;
				newProgress.barOne += 1;
			}

			// Cap barOne at its maximum value
			if (newProgress.barOne > maxVals.barOne) {
				newProgress.barOne = maxVals.barOne;
			}

			// Commit the updated progress
			commit("UPDATE_PROGRESS", { componentId, progress: newProgress });
		},

		// New action that respects component-specific max values
		calculateProgressWithMax(
			{ commit, getters, state },
			{ componentId, amount, maxValues }
		) {
			// Get current progress
			const currentProgress = getters.getProgress(componentId);

			// Store max values if provided
			if (maxValues) {
				commit("SET_MAX_VALUES", {
					componentId,
					maxValues: {
						barOne: maxValues.barOne || 3,
						barTwo: maxValues.barTwo || 5,
						barThree: maxValues.barThree || 10,
					},
				});
			}

			// Use stored max values or fallback to defaults
			const maxVals = state.maxValues[componentId] || {
				barOne: 3,
				barTwo: 5,
				barThree: 10,
			};

			// Create a new progress object to avoid modifying the original
			const newProgress = { ...currentProgress };

			// Update barThree
			newProgress.barThree += amount;

			// Handle overflow for barThree to barTwo
			while (newProgress.barThree >= maxVals.barThree) {
				newProgress.barThree -= maxVals.barThree;
				newProgress.barTwo += 1;
			}

			// Handle overflow for barTwo to barOne
			while (newProgress.barTwo >= maxVals.barTwo) {
				newProgress.barTwo -= maxVals.barTwo;
				newProgress.barOne += 1;
			}

			// Cap barOne at its maximum value
			if (newProgress.barOne > maxVals.barOne) {
				newProgress.barOne = maxVals.barOne;
			}

			// Commit the updated progress
			commit("UPDATE_PROGRESS", { componentId, progress: newProgress });

			// Return whether barOne is at max (for components to check)
			return newProgress.barOne >= maxVals.barOne;
		},

		// Action to directly set progress values
		setProgress({ commit }, { componentId, progress }) {
			commit("UPDATE_PROGRESS", { componentId, progress });
		},
	},

	getters: {
		getProgress: (state) => (componentId) => {
			return (
				state.progressBars[componentId] || { barOne: 0, barTwo: 0, barThree: 0 }
			);
		},
		getMaxValues: (state) => (componentId) => {
			return (
				state.maxValues[componentId] || { barOne: 3, barTwo: 5, barThree: 10 }
			);
		},
	},
};
