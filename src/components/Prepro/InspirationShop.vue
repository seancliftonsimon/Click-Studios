<template>
	<v-card class="py-6">
		<v-row class="mx-2 mb-1 align-center justify-space-apart">
			<v-col align="center">
				<span>+ Searches per click </span
				><v-btn
					@click="triggerAction('searchesPerClick')"
					:disabled="playerInspiration < costs.searchesPerClick"
					>{{ costs.searchesPerClick }} ✨</v-btn
				>
			</v-col>
			<v-col align="center">
				<span>+ Pitches per click </span
				><v-btn
					@click="triggerAction('pitchesPerClick')"
					:disabled="playerInspiration < costs.pitchesPerClick"
					>{{ costs.pitchesPerClick }} ✨</v-btn
				>
			</v-col>
		</v-row>
		<v-row class="mx-2 my-1 align-center justify-space-apart">
			<v-col align="center">
				<span>+ Worker search speed </span
				><v-btn
					@click="triggerAction('workerSearchSpeed')"
					:disabled="playerInspiration < costs.workerSearchSpeed"
					>{{ costs.workerSearchSpeed }} ✨</v-btn
				></v-col
			>
			<v-col align="center">
				<span>+ Worker pitch speed </span
				><v-btn
					@click="triggerAction('workerPitchSpeed')"
					:disabled="playerInspiration < costs.workerPitchSpeed"
					>{{ costs.workerPitchSpeed }} ✨</v-btn
				>
			</v-col>
		</v-row>

		<v-row class="mx-2 my-1 align-center justify-space-apart">
			<v-col align="center">
				<span>Shorter Searches </span
				><v-btn
					@click="triggerAction('shortenSearches')"
					:disabled="playerInspiration < costs.shortenSearches"
					>{{ costs.shortenSearches }} ✨</v-btn
				></v-col
			>
			<v-col align="center">
				<span>Bigger Investors </span
				><v-btn
					@click="triggerAction('biggerInvestors')"
					:disabled="playerInspiration < costs.biggerInvestors"
					>{{ costs.biggerInvestors }} ✨</v-btn
				>
			</v-col>
			<v-col align="center">
				<span>Better Pitches </span
				><v-btn
					@click="triggerAction('betterPitches')"
					:disabled="playerInspiration < costs.betterPitches"
					>{{ costs.betterPitches }} ✨</v-btn
				>
			</v-col>
		</v-row>
		<v-row class="mx-2 mt-1 align-center justify-space-apart">
			<v-col align="center">
				<span>Auto Search </span
				><v-btn
					@click="triggerAction('autoSearch')"
					:disabled="this.playerInspiration < costs.autoSearch"
				>
					{{ costs.autoSearch }} ✨</v-btn
				></v-col
			>
			<v-col align="center">
				<span>Auto Pitch </span
				><v-btn
					@click="triggerAction('autoPitch')"
					:disabled="playerInspiration < costs.autoPitch"
					>{{ costs.autoPitch }} ✨</v-btn
				></v-col
			>
			<v-col align="center">
				<span>Auto Collect </span
				><v-btn
					@click="triggerAction('autoCollect')"
					:disabled="playerInspiration < costs.autoCollect"
					>{{ costs.autoCollect }} ✨</v-btn
				></v-col
			>
		</v-row>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";

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
		// Dynamic cost calculations based on the number of times each button has been activated
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
		calculateCost(count, increments) {
			let cost = 0;
			for (let i = 0; i <= count && i < increments.length; i++) {
				cost += increments[i];
			}
			return cost;
		},
		triggerAction(actionName) {
			if (this.playerInspiration >= this.costs[actionName]) {
				this.buttonActivations[actionName]++;
				this.playerInspiration -= this.costs[actionName];
				console.log(`${actionName} has been triggered.`);
			} else {
				console.log(`Not enough inspiration to trigger ${actionName}.`);
			}
		},
	},
};
</script>

<style scoped>
.neat-row {
	display: grid;
	align-items: center;
}

.v-btn {
	width: fit-content;
}

.v-row {
	gap: 8px;
}

.v-col {
	background-color: aquamarine;
	border-radius: 8px;
}
</style>
