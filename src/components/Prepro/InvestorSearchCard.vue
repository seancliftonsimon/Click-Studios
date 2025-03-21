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

export default {
	data() {
		return {
			searchCount: 0,
			searchActionProgress: 0,
			progressInterval: null,
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
			return (
				Math.floor(
					Math.random() * (this.searchRange[1] - this.searchRange[0] + 1)
				) + this.searchRange[0]
			);
		},
		searchesPerSecond() {
			return this.searcherCount * this.searcherSpeed;
		},
	},
	methods: {
		updateProgress() {
			// Only update progress if there are preproduction dollars available
			if (this.preproDollarCount > 0 && this.searcherCount > 0) {
				this.searchCount += this.searchesPerSecond;
			}

			// If auto-search is enabled and we have enough preproduction dollars,
			// start the progress bar if not already running
			if (
				this.autoSearchEnabled &&
				this.preproDollarCount > 0 &&
				!this.progressInterval
			) {
				this.startAutoSearch();
			} else if (
				(!this.autoSearchEnabled || this.preproDollarCount <= 0) &&
				this.progressInterval
			) {
				this.stopAutoSearch();
			}
		},
		startAutoSearch() {
			// Add initial delay before starting progress
			setTimeout(() => {
				this.searchActionProgress = 0;
				// Update progress every 50ms (20 updates over 1000ms)
				this.progressInterval = setInterval(() => {
					this.searchActionProgress += 5; // 5% increment
					if (this.searchActionProgress >= 100) {
						this.searchActionProgress = 0; // Reset for next cycle
						this.addSearch();
					}
				}, 50);
			}, 100); // Wait 100ms before starting progress
		},
		stopAutoSearch() {
			if (this.progressInterval) {
				clearInterval(this.progressInterval);
				this.progressInterval = null;
			}
			this.searchActionProgress = 0;
		},
		addSearch() {
			this.searchCount += this.manualSearchAmount;
		},
		resetSearchCount() {
			this.searchCount = 0;
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
	mounted() {
		// Call updateProgress every second (1000 milliseconds)
		this.intervalId = setInterval(this.updateProgress, 1000);
	},
	beforeUnmount() {
		// Clear all intervals when component unmounts
		clearInterval(this.intervalId);
		this.stopAutoSearch();
	},
};
</script>
