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
		calculateProgress({ commit }, { componentId, progress }) {
			commit("UPDATE_PROGRESS", { componentId, progress });
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
