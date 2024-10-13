<template>
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
		<v-row class="mx-2 mb-1 align-center justify-space-apart">
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
		<v-row class="mx-2 my-1 align-center justify-space-apart">
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
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('biggerInvestors', costs.biggerInvestors)"
					:disabled="playerInspiration < costs.biggerInvestors"
					><v-col>
						<div class="button-text">{{ "Bigger Investors" }}</div>
						<div class="button-cost">{{ costs.biggerInvestors }} ✨</div>
					</v-col></v-btn
				>
			</v-col>
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
		<v-row class="mx-2 mt-1 align-center justify-space-apart">
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
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('autoCollect', costs.autoCollect)"
					:disabled="playerInspiration < costs.autoCollect"
					><v-col>
						<div class="button-text">{{ "Auto Collect" }}</div>
						<div class="button-cost">{{ costs.autoCollect }} ✨</div>
					</v-col>
				</v-btn>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
	data() {
		return {
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
		...mapGetters({
			playerInspiration: "inspiration",
			unassignedEmployeeCount: "unassignedEmployeeCount",
		}),
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
		...mapActions(["spendInspiration", "addInspiration"]),
		calculateCost(count, increments) {
			let cost = 0;
			for (let i = 0; i <= count && i < increments.length; i++) {
				cost += increments[i];
			}
			return cost;
		},
		triggerAction(actionName, cost) {
			if (this.playerInspiration >= cost) {
				this.buttonActivations[actionName]++;
				this.spendInspiration(cost);
				console.log(`${actionName} has been triggered.`);
			} else {
				console.log(`Not enough inspiration to trigger ${actionName}.`);
			}
		},
	},
};
</script>

<style scoped>
.upgrade-button {
	width: 100%;
	height: 50px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	background-color: #fef7e5;
	border-radius: 8px;
}

.button-text,
.button-cost {
	width: 100%;
}

.button-text {
	padding-top: 2px;
	margin-bottom: 4px; /* Add a bit of space between text and cost if needed */
}

.inspiration-counter {
	font-family: "Roboto", sans-serif;
	font-size: 22px;
	color: #dfc506;
	font-weight: 600;
}
</style>
