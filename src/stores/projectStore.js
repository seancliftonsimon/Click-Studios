import { defineStore } from "pinia";
import legacyStore from "@/store";

export const useProjectStore = defineStore("project", {
	getters: {
		currentScript() {
			return legacyStore.state.currentScript;
		},
		roles() {
			return legacyStore.state.currentScript?.roles || [];
		},
		shots() {
			return legacyStore.state.currentScript?.shots || [];
		},
		sets() {
			return legacyStore.state.currentScript?.sets || [];
		},
		locations() {
			return legacyStore.state.currentScript?.locations || [];
		},
		costumes() {
			return legacyStore.state.currentScript?.costumes || [];
		},
		looks() {
			return legacyStore.state.currentScript?.looks || [];
		},
	},
	actions: {
		itemsForDepartment(departmentConfig) {
			return this[departmentConfig.resourceKey] || [];
		},
		nextIncompleteIndex(departmentConfig) {
			return this.itemsForDepartment(departmentConfig).findIndex(
				(item) => !item[departmentConfig.completionFlag]
			);
		},
		completeDepartmentItem(departmentConfig, itemIndex) {
			legacyStore.commit(departmentConfig.completeMutation, {
				[departmentConfig.completePayloadKey]: itemIndex,
			});
		},
	},
});
