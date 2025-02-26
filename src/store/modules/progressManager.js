export default {
	namespaced: true,

	state: {
		progressBars: {}, // Will store progress for each component type
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
	},

	actions: {
		calculateProgress({ commit, getters }, { componentId, amount }) {
			// Get current progress
			const currentProgress = getters.getProgress(componentId);

			// Create a new progress object to avoid modifying the original
			const newProgress = { ...currentProgress };

			// Update barThree
			newProgress.barThree += amount;

			// Handle overflow for barThree to barTwo
			while (newProgress.barThree >= 100) {
				newProgress.barThree -= 100;
				newProgress.barTwo += 1;
			}

			// Handle overflow for barTwo to barOne
			while (newProgress.barTwo >= 50) {
				newProgress.barTwo -= 50;
				newProgress.barOne += 1;
			}

			// Commit the updated progress
			commit("UPDATE_PROGRESS", { componentId, progress: newProgress });
		},
	},

	getters: {
		getProgress: (state) => (componentId) => {
			return (
				state.progressBars[componentId] || { barOne: 0, barTwo: 0, barThree: 0 }
			);
		},
	},
};
