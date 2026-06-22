import { defineStore } from "pinia";
import { useGameStore } from "@/store";

export const useFilmingStore = defineStore("filming", {
	getters: {
		filmingShots() {
			return useGameStore().filmingShots;
		},
		currentFilmingShot() {
			return useGameStore().currentFilmingShot;
		},
		filmedShotsCount() {
			return useGameStore().filmedShotsCount;
		},
		filmingShotGoal() {
			return useGameStore().filmingShotGoal;
		},
		averageFilmingScore() {
			return useGameStore().averageFilmingScore;
		},
	},
	actions: {
		wrapCurrentShot(payload) {
			return useGameStore().wrapCurrentShot(payload);
		},
		resetFilmingProgress() {
			useGameStore().RESET_FILMING_PROGRESS();
		},
	},
});
