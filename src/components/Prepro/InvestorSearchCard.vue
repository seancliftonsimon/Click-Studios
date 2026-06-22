<template>
	<v-card class="text-center pa-3" outlined>
		<!-- Show progress bar when auto-searching, button otherwise -->
		<div v-if="autoSearchEnabled && preproDollarCount > 0" class="mb-4">
			<div class="text-subtitle-1 mb-1">Auto Searching...</div>
			<v-progress-linear
				:model-value="searchActionProgress"
				height="36"
				color="primary"
				rounded
			>
				<template v-slot:default>Searching...</template>
			</v-progress-linear>
		</div>
		<v-btn v-else color="primary" @click="addSearch"
			>Search x{{ manualSearchAmount }}</v-btn
		>
		<!-- Text: Finding Investors... -->
		<h3 class="my-4">Finding Investors...</h3>
		<!-- Progress Linear Bar -->
		<v-progress-linear
			:model-value="searchCount"
			:max="searchesNeeded"
			:height="40"
			color="blue"
			rounded
			class="mb-4"
		></v-progress-linear>
		<!-- Text: Searches per Second -->
		<div>+ {{ searchesPerSecond }} per second, {{ searchesNeeded }} needed</div>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { useGameClockStore } from "@/stores/gameClockStore";

export default {
	data() {
		return {
			searchCount: 0,
			searchActionProgress: 0,
			searchesNeededValue: 0,
			unregisterTicker: null,
		};
	},
	computed: {
		...mapGetters({
			manualSearchAmount: "manualSearchAmount",
			searchRange: "searchRange",
			searcherCount: "searcherCount",
			searcherSpeed: "searcherSpeed",
			preproDollarCount: "preproDollarCount",
			autoSearchEnabled: "autoSearchEnabled",
		}),
		searchesNeeded() {
			return this.searchesNeededValue;
		},
		searchesPerSecond() {
			return this.searcherCount * this.searcherSpeed;
		},
		gameClockStore() {
			return useGameClockStore();
		},
	},
	methods: {
		rollSearchesNeeded() {
			this.searchesNeededValue =
				Math.floor(
					Math.random() * (this.searchRange[1] - this.searchRange[0] + 1)
				) + this.searchRange[0];
		},
		updateProgress(elapsedSeconds = 1) {
			// Only update progress if there are preproduction dollars available
			if (this.preproDollarCount > 0 && this.searcherCount > 0) {
				this.searchCount += this.searchesPerSecond * elapsedSeconds;
			}

			if (this.autoSearchEnabled && this.preproDollarCount > 0) {
				this.searchActionProgress += elapsedSeconds * 100;

				while (this.searchActionProgress >= 100) {
					this.searchActionProgress -= 100;
					this.addSearch();
				}
			} else if (this.searchActionProgress > 0) {
				this.stopAutoSearch();
			}
		},
		stopAutoSearch() {
			this.searchActionProgress = 0;
		},
		addSearch() {
			this.searchCount += this.manualSearchAmount;
		},
		resetSearchCount() {
			this.searchCount = 0;
			this.rollSearchesNeeded();
		},
	},
	watch: {
		searchCount(newValue) {
			if (newValue >= this.searchesNeeded) {
				this.stopAutoSearch();
				this.$emit("nextCard");
				this.resetSearchCount();
			}
		},
	},
	created() {
		this.rollSearchesNeeded();
	},
	mounted() {
		this.unregisterTicker = this.gameClockStore.registerTicker(
			"investor:search",
			this.updateProgress
		);
	},
	beforeUnmount() {
		if (this.unregisterTicker) {
			this.unregisterTicker();
			this.unregisterTicker = null;
		}
		this.stopAutoSearch();
	},
};
</script>
