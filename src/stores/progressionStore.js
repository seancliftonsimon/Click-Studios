import { defineStore } from "pinia";
import { useGameStore } from "@/store";
import { useGuidanceStore } from "@/stores/guidanceStore";

export const useProgressionStore = defineStore("progression", {
	getters: {
		milestones() {
			return useGameStore().milestones;
		},
		isFilmingUnlocked() {
			return useGameStore().isFilmingUnlocked;
		},
	},
	actions: {
		checkDepartmentHeadsMilestone() {
			return useGameStore().checkDepartmentHeadsMilestone();
		},
		checkInspirationMilestone() {
			return useGameStore().checkInspirationMilestone();
		},
		unlockFilming() {
				useGameStore().UPDATE_STATE_VARIABLE({
					key: "isFilmingUnlocked",
					value: true,
				});
				return useGuidanceStore().triggerStep("unlock_filming");
			},
	},
});
