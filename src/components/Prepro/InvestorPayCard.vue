<template>
	<v-card class="text-center pa-3" outlined>
		<!-- H2: Funding Received! -->
		<h2>Funding Received!</h2>
		<v-container>
			<span class="fundingAmount"
				>$ {{ $formatNumber(currentInvestment) }}</span
			>
		</v-container>
		<!-- Show progress bar when auto-collecting, button otherwise -->
		<div v-if="autoCollectEnabled" class="mb-3">
			<div class="text-subtitle-1 mb-1">Auto Collecting...</div>
			<v-progress-linear
				:model-value="collectProgress"
				height="36"
				color="blue"
				rounded
				striped
			>
				<template v-slot:default>Collecting...</template>
			</v-progress-linear>
		</div>
		<v-btn v-else color="blue" class="mb-3" @click="nextCard">Collect</v-btn>
	</v-card>
</template>
<script>
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			collectProgress: 0,
			progressInterval: null,
		};
	},
	computed: {
		...mapGetters(["currentInvestment", "autoCollectEnabled"]),
	},
	methods: {
		nextCard() {
			this.$store.commit(
				"INCREASE_PREPRO_DOLLAR_AMOUNT",
				this.currentInvestment
			);
			console.log("increasing dollar amount by ");
			console.log(this.currentInvestment);
			this.$emit("nextCard");
		},
		autoCollect() {
			// If auto-collect is enabled, show progress bar
			if (this.autoCollectEnabled) {
				// Add initial delay before starting progress
				setTimeout(() => {
					this.collectProgress = 0;
					// Update progress every 50ms (20 updates over 1000ms)
					this.progressInterval = setInterval(() => {
						this.collectProgress += 5; // 5% increment
						if (this.collectProgress >= 100) {
							clearInterval(this.progressInterval);
							this.nextCard();
						}
					}, 50);
				}, 100); // Wait 100ms before starting progress
			}
		},
	},
	mounted() {
		this.autoCollect();
	},
	beforeUnmount() {
		// Clear any existing intervals
		if (this.progressInterval) {
			clearInterval(this.progressInterval);
		}
	},
};
</script>
<style scoped>
.fundingAmount {
	color: darkgreen;
	font-size: 3em;
	font-weight: bold;
}
</style>
