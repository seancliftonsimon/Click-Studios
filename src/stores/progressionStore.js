import { defineStore } from "pinia";
import { useGameStore } from "@/store";
import { usePopupStore } from "@/store/popup";

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
			return usePopupStore().showPopup({
				id: "achievement_filmingUnlocked",
			});
		},
	},
});
