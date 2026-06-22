import { defineStore } from "pinia";
import legacyStore from "@/store";

export const usePlayerStore = defineStore("player", {
	getters: {
		studioName() {
			return legacyStore.state.studioName;
		},
		writingDollarCount() {
			return legacyStore.state.writingDollarCount;
		},
		preproDollarCount() {
			return legacyStore.state.preproDollarCount;
		},
	},
	actions: {
		setStudioName(studioName) {
			legacyStore.commit("UPDATE_STATE_VARIABLE", {
				key: "studioName",
				value: studioName,
			});
		},
	},
});
