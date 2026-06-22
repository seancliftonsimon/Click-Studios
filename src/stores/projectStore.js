import { defineStore } from "pinia";
import { useGameStore } from "@/store";

export const useProjectStore = defineStore("project", {
	getters: {
		currentScript() {
			return useGameStore().currentScript;
		},
		roles() {
			return useGameStore().currentScript?.roles || [];
		},
		shots() {
			return useGameStore().currentScript?.shots || [];
		},
		sets() {
			return useGameStore().currentScript?.sets || [];
		},
		locations() {
			return useGameStore().currentScript?.locations || [];
		},
		costumes() {
			return useGameStore().currentScript?.costumes || [];
		},
		looks() {
			return useGameStore().currentScript?.looks || [];
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
			useGameStore()[departmentConfig.completeMutation]({
				[departmentConfig.completePayloadKey]: itemIndex,
			});
		},
	},
});
