export default {
	namespaced: true,

	state: {
		progressBars: {}, // Will store progress for each component type
	},

	mutations: {
		UPDATE_PROGRESS(state, { componentId, progress }) {
			if (!state.progressBars[componentId]) {
				state.progressBars[componentId] = {
					barOne: 0,
					barTwo: 0,
					barThree: 0,
				};
			}
			state.progressBars[componentId] = progress;
		},
	},

	actions: {
		calculateProgress(
			{ commit, state },
			{
				componentId,
				ticksPerSecond,
				maxValues = { one: 20, two: 50, three: 100 },
				onComplete = null,
			}
		) {
			const currentProgress = state.progressBars[componentId] || {
				barOne: 0,
				barTwo: 0,
				barThree: 0,
			};
			let { barOne, barTwo, barThree } = currentProgress;

			// Add ticks to lowest bar
			barThree += ticksPerSecond;

			// Handle overflow calculations
			let overflowThree = barThree - maxValues.three;

			while (barThree >= maxValues.three) {
				barThree -= maxValues.three;
				barTwo += 1;
				overflowThree = barThree - maxValues.three;
			}

			if (overflowThree > 0) {
				barThree = overflowThree;
			}

			if (barTwo >= maxValues.two) {
				barTwo = 0;
				barOne += 1;
			}

			if (barOne >= maxValues.one) {
				barOne = 0;
				if (onComplete) onComplete();
			}

			const newProgress = { barOne, barTwo, barThree };
			commit("UPDATE_PROGRESS", { componentId, progress: newProgress });

			return newProgress;
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
