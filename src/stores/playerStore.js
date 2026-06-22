import { defineStore } from "pinia";
import { useGameStore } from "@/store";

export const usePlayerStore = defineStore("player", {
	getters: {
		studioName() {
			return useGameStore().studioName;
		},
		writingDollarCount() {
			return useGameStore().writingDollarCount;
		},
		preproDollarCount() {
			return useGameStore().preproDollarCount;
		},
	},
	actions: {
		setStudioName(studioName) {
			useGameStore().UPDATE_STATE_VARIABLE({
				key: "studioName",
				value: studioName,
			});
		},
	},
});
