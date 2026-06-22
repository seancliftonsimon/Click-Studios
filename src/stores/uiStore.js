import { defineStore } from "pinia";
import legacyStore from "@/store";

export const useUiStore = defineStore("ui", {
	getters: {
		componentVisibility() {
			return legacyStore.state.componentVisibility;
		},
	},
	actions: {
		showToast(payload) {
			return legacyStore.dispatch("showToast", payload);
		},
		showPopup(id) {
			return legacyStore.dispatch("popupManager/showPopup", { id });
		},
		setComponentVisible(componentName, visible) {
			if (legacyStore.state.componentVisibility[componentName] !== visible) {
				legacyStore.commit("TOGGLE_COMPONENT_VISIBILITY", componentName);
			}
		},
	},
});
