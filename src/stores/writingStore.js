import { defineStore } from "pinia";
import { useGameStore } from "@/store";

export const useWritingStore = defineStore("writing", {
	getters: {
		wordCount() {
			return useGameStore().wordCount;
		},
		wordsPerSecond() {
			return useGameStore().wordsPerSecond;
		},
		products() {
			return useGameStore().products;
		},
		workers() {
			return useGameStore().workers;
		},
		currentWriteTool() {
			return useGameStore().currentWriteTool;
		},
	},
	actions: {
		increaseWordCount(amount) {
			return useGameStore().increaseWordCount(amount);
		},
		sellProduct(payload) {
			return useGameStore().sellProduct(payload);
		},
		purchaseTool(payload) {
			return useGameStore().purchaseTool(payload);
		},
		hireWorker(payload) {
			return useGameStore().hireWorker(payload);
		},
		expireWorkers() {
			return useGameStore().expireWorkers();
		},
	},
});
