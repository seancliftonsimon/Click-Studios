<template>
	<v-card class="text-center pa-3" outlined>
		<!-- Manual Search Button -->
		<v-btn color="primary" @click="addSearch"
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
		};
	},
	computed: {
		...mapGetters({
			manualSearchAmount: "manualSearchAmount",
			searchRange: "searchRange",
			searcherCount: "searcherCount",
			searcherSpeed: "searcherSpeed",
			preproDollarCount: "preproDollarCount",
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
				this.$emit("nextCard");
				this.resetSearchCount();
				console.log("Search Target Met!");
			}
		},
	},
	mounted() {
		// Call updateProgress every second (1000 milliseconds)
		this.intervalId = setInterval(this.updateProgress, 1000);
	},
	beforeUnmount() {
		// Clear the interval when the component is about to unmount
		clearInterval(this.intervalId);
	},
};
</script>
