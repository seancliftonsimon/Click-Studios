import { defineStore } from "pinia";
import legacyStore from "@/store";

export const useDebugStore = defineStore("debug", {
	getters: {
		secondPhaseSaveState() {
			return legacyStore.state.secondPhaseSaveState;
		},
	},
	actions: {
		loadSecondPhaseCheckpoint() {
			localStorage.setItem("gameState", legacyStore.state.secondPhaseSaveState);
			legacyStore.commit("LOAD_STATE");
		},
	},
});
