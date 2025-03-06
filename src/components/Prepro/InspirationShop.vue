<template>
	<!-- Main card container -->
	<v-card class="py-6">
		<!-- Title row -->
		<v-row class="mx-1 align-center justify-space-between">
			<!-- Invisible spacer on the left -->
			<v-col cols="2">
				<!-- Empty div as spacer -->
			</v-col>

			<!-- Title in the center -->
			<v-col cols="6" class="text-center">
				<h3>{{ "Spend Inspiration" }}</h3>
			</v-col>

			<!-- Inspiration count on the right -->
			<v-col cols="2" class="text-right">
				<span class="inspiration-counter">{{ playerInspiration }} ✨</span>
			</v-col>
		</v-row>

		<!-- First row of upgrade buttons -->
		<v-row class="mx-2 mb-1 align-center justify-space-apart">
			<!-- Button for upgrading searches per click -->
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('searchesPerClick', costs.searchesPerClick)"
					:disabled="playerInspiration < costs.searchesPerClick"
				>
					<v-col>
						<div class="button-text">{{ "Searches per click 1 → 3" }}</div>
						<div class="button-cost">{{ costs.searchesPerClick }} ✨</div>
					</v-col>
				</v-btn>
			</v-col>

			<!-- Button for upgrading pitches per click -->
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('pitchesPerClick', costs.pitchesPerClick)"
					:disabled="playerInspiration < costs.pitchesPerClick"
				>
					<v-col>
						<div class="button-text">{{ "Pitches per click 1 → 3" }}</div>
						<div class="button-cost">{{ costs.pitchesPerClick }} ✨</div>
					</v-col>
				</v-btn>
			</v-col>
		</v-row>

		<!-- Second row of upgrade buttons -->
		<v-row class="mx-2 my-1 align-center justify-space-apart">
			<!-- Button for shortening search time -->
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('shortenSearches', costs.shortenSearches)"
					:disabled="playerInspiration < costs.shortenSearches"
				>
					<v-col>
						<div class="button-text">{{ "Shorter Searches" }}</div>
						<div class="button-cost">{{ costs.shortenSearches }} ✨</div>
					</v-col>
				</v-btn>
			</v-col>

			<!-- Button for attracting bigger investors -->
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('biggerInvestors', costs.biggerInvestors)"
					:disabled="playerInspiration < costs.biggerInvestors"
				>
					<v-col>
						<div class="button-text">{{ "Bigger Investors" }}</div>
						<div class="button-cost">{{ costs.biggerInvestors }} ✨</div>
					</v-col>
				</v-btn>
			</v-col>

			<!-- Button for improving pitch quality -->
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('betterPitches', costs.betterPitches)"
					:disabled="playerInspiration < costs.betterPitches"
				>
					<v-col>
						<div class="button-text">{{ "Better Pitches" }}</div>
						<div class="button-cost">{{ costs.betterPitches }} ✨</div>
					</v-col>
				</v-btn>
			</v-col>
		</v-row>

		<!-- Third row of upgrade buttons -->
		<v-row class="mx-2 mt-1 align-center justify-space-apart">
			<!-- Button for enabling auto search -->
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('autoSearch', costs.autoSearch)"
					:disabled="playerInspiration < costs.autoSearch"
				>
					<v-col>
						<div class="button-text">{{ "Auto Search" }}</div>
						<div class="button-cost">{{ costs.autoSearch }} ✨</div>
					</v-col>
				</v-btn>
			</v-col>

			<!-- Button for enabling auto pitch -->
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('autoPitch', costs.autoPitch)"
					:disabled="playerInspiration < costs.autoPitch"
				>
					<v-col>
						<div class="button-text">{{ "Auto Pitch" }}</div>
						<div class="button-cost">{{ costs.autoPitch }} ✨</div>
					</v-col>
				</v-btn>
			</v-col>

			<!-- Button for enabling auto collect -->
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('autoCollect', costs.autoCollect)"
					:disabled="playerInspiration < costs.autoCollect"
				>
					<v-col>
						<div class="button-text">{{ "Auto Collect" }}</div>
						<div class="button-cost">{{ costs.autoCollect }} ✨</div>
					</v-col>
				</v-btn>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
// Import Vuex helpers for mapping state and actions
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
	data() {
		return {
			// Track button activations for upgrades
			buttonActivations: {
				autoSearch: 0,
				autoPitch: 0,
				autoCollect: 0,
				searchesPerClick: 0,
				pitchesPerClick: 0,
				workerSearchSpeed: 0,
				workerPitchSpeed: 0,
				shortenSearches: 0,
				biggerInvestors: 0,
				betterPitches: 0,
			},
		};
	},
	computed: {
		// Map Vuex getters to local computed properties
		...mapGetters({
			playerInspiration: "inspiration",
			unassignedEmployeeCount: "unassignedEmployeeCount",
		}),
		// Calculate costs for each upgrade based on activations
		costs() {
			return {
				autoSearch: this.buttonActivations.autoSearch * 2 + 10,
				autoPitch: this.buttonActivations.autoPitch * 2 + 10,
				autoCollect: this.buttonActivations.autoCollect * 2 + 10,
				searchesPerClick: this.calculateCost(
					this.buttonActivations.searchesPerClick,
					[1, 2, 4, 6, 8]
				),
				pitchesPerClick: this.calculateCost(
					this.buttonActivations.pitchesPerClick,
					[1, 2, 4, 6, 8]
				),
				workerSearchSpeed: this.calculateCost(
					this.buttonActivations.workerSearchSpeed,
					[3, 7, 10]
				),
				workerPitchSpeed: this.calculateCost(
					this.buttonActivations.workerPitchSpeed,
					[3, 7, 10]
				),
				shortenSearches: this.calculateCost(
					this.buttonActivations.shortenSearches,
					[8, 14]
				),
				biggerInvestors: this.calculateCost(
					this.buttonActivations.biggerInvestors,
					[8, 14]
				),
				betterPitches: this.calculateCost(
					this.buttonActivations.betterPitches,
					[8, 14]
				),
			};
		},
	},
	methods: {
		...mapMutations([
			"INCREASE_MANUAL_SEARCH_AMOUNT",
			"INCREASE_MANUAL_PITCH_AMOUNT",
			"INCREASE_WORKER_SEARCH_SPEED",
			"INCREASE_WORKER_PITCH_SPEED",
			"DECREASE_SEARCH_RANGE",
			"DECREASE_PITCH_RANGE",
			"UPGRADE_INVESTOR_TIER",
		]),
		...mapActions(["spendInspiration", "showToast"]),
		calculateCost(activations, costArray) {
			return activations < costArray.length ? costArray[activations] : Infinity;
		},
		triggerAction(action, cost) {
			// Spend inspiration first
			this.spendInspiration(cost);
			this.buttonActivations[action]++;

			switch (action) {
				case "searchesPerClick":
					this.INCREASE_MANUAL_SEARCH_AMOUNT(1);
					this.showToast("Manual search amount increased!");
					break;
				case "pitchesPerClick":
					this.INCREASE_MANUAL_PITCH_AMOUNT(1);
					this.showToast("Manual pitch amount increased!");
					break;
				case "workerSearchSpeed":
					this.INCREASE_WORKER_SEARCH_SPEED(1);
					this.showToast("Worker search speed increased!");
					break;
				case "workerPitchSpeed":
					this.INCREASE_WORKER_PITCH_SPEED(1);
					this.showToast("Worker pitch speed increased!");
					break;
				case "shortenSearches":
					this.DECREASE_SEARCH_RANGE();
					this.showToast("Search time shortened!");
					break;
				case "biggerInvestors": {
					this.UPGRADE_INVESTOR_TIER();
					const tierNames = ["Small", "Medium", "Large", "Very Large", "Whale"];
					const newTier = this.$store.state.currentInvestorTier;
					this.showToast(`Unlocked ${tierNames[newTier - 1]} Investors!`);
					break;
				}
				case "betterPitches":
					this.DECREASE_PITCH_RANGE();
					this.showToast("Pitch time shortened!");
					break;
				// Add other cases as needed
			}
		},
	},
};
</script>

<style scoped>
/* Styles for the upgrade button */
.upgrade-button {
	width: 100%;
	height: 50px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	background-color: #fef7e5;
}

.button-text,
.button-cost {
	width: 100%;
}

.button-text {
	padding-top: 2px;
	margin-bottom: 4px; /* Add a bit of space between text and cost if needed */
}
</style>
