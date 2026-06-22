import { defineStore } from "pinia";
import legacyStore from "@/store";

export const useWritingStore = defineStore("writing", {
	getters: {
		wordCount() {
			return legacyStore.state.wordCount;
		},
		wordsPerSecond() {
			return legacyStore.getters.wordsPerSecond;
		},
		products() {
			return legacyStore.state.products;
		},
		workers() {
			return legacyStore.state.workers;
		},
		currentWriteTool() {
			return legacyStore.state.currentWriteTool;
		},
	},
	actions: {
		increaseWordCount(amount) {
			return legacyStore.dispatch("increaseWordCount", amount);
		},
		sellProduct(payload) {
			return legacyStore.dispatch("sellProduct", payload);
		},
		purchaseTool(payload) {
			return legacyStore.dispatch("purchaseTool", payload);
		},
		hireWorker(payload) {
			return legacyStore.dispatch("hireWorker", payload);
		},
		expireWorkers() {
			return legacyStore.dispatch("expireWorkers");
		},
	},
});
