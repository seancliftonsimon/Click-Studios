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
import { mapState } from "pinia";
import { useGameStore } from "@/store";
import { useGameClockStore } from "@/stores/gameClockStore";

export default {
	data() {
		return {
			collectProgress: 0,
			unregisterTicker: null,
		};
	},
	computed: {
		...mapState(useGameStore, ["currentInvestment", "autoCollectEnabled"]),
		gameClockStore() {
			return useGameClockStore();
		},
	},
	methods: {
		nextCard() {
			useGameStore().INCREASE_PREPRO_DOLLAR_AMOUNT(this.currentInvestment);
			console.log("increasing dollar amount by ");
			console.log(this.currentInvestment);
			this.$emit("nextCard");
		},
		autoCollect(elapsedSeconds = 1) {
			if (!this.autoCollectEnabled) {
				this.collectProgress = 0;
				return;
			}

			this.collectProgress += elapsedSeconds * 100;
			if (this.collectProgress >= 100) {
				this.collectProgress = 0;
				this.nextCard();
			}
		},
	},
	mounted() {
		this.unregisterTicker = this.gameClockStore.registerTicker(
			"investor:collect",
			this.autoCollect
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
<style scoped>
.fundingAmount {
	color: darkgreen;
	font-size: 3em;
	font-weight: bold;
}
</style>
