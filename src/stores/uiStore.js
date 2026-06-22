import { defineStore } from "pinia";
import { useGameStore } from "@/store";
import { usePopupStore } from "@/store/popup";

export const useUiStore = defineStore("ui", {
	getters: {
		componentVisibility() {
			return useGameStore().componentVisibility;
		},
	},
	actions: {
		showToast(payload) {
			return useGameStore().showToast(payload);
		},
		showPopup(id) {
			return usePopupStore().showPopup({ id });
		},
		setComponentVisible(componentName, visible) {
			if (useGameStore().componentVisibility[componentName] !== visible) {
				useGameStore().TOGGLE_COMPONENT_VISIBILITY(componentName);
			}
		},
	},
});
