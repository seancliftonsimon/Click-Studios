<template>
	<v-card class="cs-panel text-center pa-3">
		<!-- Manual Pitch Button -->
		<v-btn class="cs-button cs-button-primary" @click="addPitch"
			>Pitch x{{ manualPitchAmount }}</v-btn
		>
		<!-- Text: Pitching Investor Name… -->
		<h3 class="my-4">Pitching {{ currentInvestor }}</h3>
		<!-- Progress Linear Bar -->
		<v-progress-linear
			:model-value="pitchCount"
			:max="pitchesNeeded"
			:height="40"
			class="cs-progress cs-progress-gold mb-4"
			rounded
		></v-progress-linear>
		<!-- Text: Pitches per Second -->
		<div>+ {{ pitchesPerSecond }} per second {{ pitchesNeeded }} needed</div>
	</v-card>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";
import { useGameClockStore } from "@/stores/gameClockStore";

export default {
	data() {
		return {
			pitchCount: 0,
			pitchesNeededValue: 0,
			unregisterTicker: null,
		};
	},
	computed: {
		...mapState(useGameStore, {
			manualPitchAmount: "manualPitchAmount",
			pitchRange: "pitchRange",
			pitcherCount: "pitcherCount",
			pitcherSpeed: "pitcherSpeed",
			currentInvestor: "currentInvestor",
			preproDollarCount: "preproDollarCount",
		}),
		pitchesNeeded() {
			return this.pitchesNeededValue;
		},
		pitchesPerSecond() {
			return this.pitcherCount * this.pitcherSpeed;
		},
		gameClockStore() {
			return useGameClockStore();
		},
	},
	methods: {
		rollPitchesNeeded() {
			this.pitchesNeededValue =
				Math.floor(
					Math.random() * (this.pitchRange[1] - this.pitchRange[0] + 1)
				) + this.pitchRange[0];
		},
		updateProgress(elapsedSeconds = 1) {
			// Only update progress if there are preproduction dollars available
			if (this.preproDollarCount > 0 && this.pitcherCount > 0) {
				this.pitchCount += this.pitchesPerSecond * elapsedSeconds;
			}
		},
		addPitch() {
			this.pitchCount += this.manualPitchAmount;
		},
		resetPitchCount() {
			this.pitchCount = 0;
			this.rollPitchesNeeded();
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
	created() {
		this.rollPitchesNeeded();
	},
	mounted() {
		this.unregisterTicker = this.gameClockStore.registerTicker(
			"investor:pitch",
			this.updateProgress
		);
	},
	beforeUnmount() {
		if (this.unregisterTicker) {
			this.unregisterTicker();
			this.unregisterTicker = null;
		}
	},
};
</script>
