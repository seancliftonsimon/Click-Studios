<template>
	<v-card class="text-center pa-3" outlined>
		<!-- Manual Pitch Button -->
		<v-btn color="primary" @click="addPitch"
			>Pitch x{{ manualPitchAmount }}</v-btn
		>
		<!-- Text: Pitching Investor Name… -->
		<h3 class="my-4">Pitching {{ currentInvestor }}</h3>
		<!-- Progress Linear Bar -->
		<v-progress-linear
			:model-value="pitchCount"
			:max="pitchesNeeded"
			:height="40"
			color="green"
			rounded
			class="mb-4"
		></v-progress-linear>
		<!-- Text: Pitches per Second -->
		<div>+ {{ pitchesPerSecond }} per second {{ pitchesNeeded }} needed</div>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			pitchCount: 0,
		};
	},
	computed: {
		...mapGetters({
			manualPitchAmount: "manualPitchAmount",
			pitchRange: "pitchRange",
			pitcherCount: "pitcherCount",
			pitcherSpeed: "pitcherSpeed",
			currentInvestor: "currentInvestor",
			preproDollarCount: "preproDollarCount",
		}),
		pitchesNeeded() {
			return (
				Math.floor(
					Math.random() * (this.pitchRange[1] - this.pitchRange[0] + 1)
				) + this.pitchRange[0]
			);
		},
		pitchesPerSecond() {
			return this.pitcherCount * this.pitcherSpeed;
		},
	},
	methods: {
		updateProgress() {
			// Only update progress if there are preproduction dollars available
			if (this.preproDollarCount > 0 && this.pitcherCount > 0) {
				this.pitchCount += this.pitchesPerSecond;
			}
		},
		addPitch() {
			this.pitchCount += this.manualPitchAmount;
		},
		resetPitchCount() {
			this.pitchCount = 0;
		},
	},
	watch: {
		pitchCount(newValue) {
			if (newValue >= this.pitchesNeeded) {
				this.$emit("nextCard");
				this.resetPitchCount();
				console.log("Pitch Target Met!");
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
