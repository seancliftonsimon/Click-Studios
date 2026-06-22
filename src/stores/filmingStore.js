import { defineStore } from "pinia";
import legacyStore from "@/store";

export const useFilmingStore = defineStore("filming", {
	getters: {
		filmingShots() {
			return legacyStore.getters.filmingShots;
		},
		currentFilmingShot() {
			return legacyStore.getters.currentFilmingShot;
		},
		filmedShotsCount() {
			return legacyStore.getters.filmedShotsCount;
		},
		filmingShotGoal() {
			return legacyStore.getters.filmingShotGoal;
		},
		averageFilmingScore() {
			return legacyStore.getters.averageFilmingScore;
		},
	},
	actions: {
		wrapCurrentShot(payload) {
			return legacyStore.dispatch("wrapCurrentShot", payload);
		},
		resetFilmingProgress() {
			legacyStore.commit("RESET_FILMING_PROGRESS");
		},
	},
});
