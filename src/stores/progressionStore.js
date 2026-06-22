import { defineStore } from "pinia";
import legacyStore from "@/store";

export const useProgressionStore = defineStore("progression", {
	getters: {
		milestones() {
			return legacyStore.state.milestones;
		},
		isFilmingUnlocked() {
			return legacyStore.state.isFilmingUnlocked;
		},
	},
	actions: {
		checkDepartmentHeadsMilestone() {
			return legacyStore.dispatch("checkDepartmentHeadsMilestone");
		},
		checkInspirationMilestone() {
			return legacyStore.dispatch("checkInspirationMilestone");
		},
		unlockFilming() {
			legacyStore.commit("UPDATE_STATE_VARIABLE", {
				key: "isFilmingUnlocked",
				value: true,
			});
			return legacyStore.dispatch("popupManager/showPopup", {
				id: "achievement_filmingUnlocked",
			});
		},
	},
});
