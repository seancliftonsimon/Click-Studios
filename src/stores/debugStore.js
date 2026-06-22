import { defineStore } from "pinia";
import { useGameStore } from "@/store";

export const useDebugStore = defineStore("debug", {
	getters: {
		secondPhaseSaveState() {
			return useGameStore().secondPhaseSaveState;
		},
	},
	actions: {
		loadSecondPhaseCheckpoint() {
			localStorage.setItem("gameState", useGameStore().secondPhaseSaveState);
			useGameStore().LOAD_STATE();
		},
	},
});
