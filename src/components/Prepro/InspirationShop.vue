<template>
	<v-card class="d-flex fill-height">
		<v-col
			class="d-flex flex-column align-center justify-space-around"
			cols="4"
		>
			<v-row class="d-flex neat-row">
				<span>Auto Search</span>
				<v-btn
					@click="triggerAction('autoSearch')"
					:disabled="this.playerInspiration < costs.autoSearch"
					>{{ costs.autoSearch }} ✨</v-btn
				>
			</v-row>
			<v-row class="d-flex neat-row">
				<span>Auto Pitch</span>
				<v-btn
					@click="triggerAction('autoPitch')"
					:disabled="playerInspiration < costs.autoPitch"
					>{{ costs.autoPitch }} ✨</v-btn
				>
			</v-row>
			<v-row class="d-flex neat-row">
				<span>Auto Collect</span>
				<v-btn
					@click="triggerAction('autoCollect')"
					:disabled="playerInspiration < costs.autoCollect"
					>{{ costs.autoCollect }} ✨</v-btn
				>
			</v-row>
		</v-col>
		<v-col class="d-flex flex-column" cols="8">
			<v-row class="d-flex">
				<v-row class="d-flex neat-row">
					<span>Searches per click+</span>
					<v-btn
						@click="triggerAction('searchesPerClick')"
						:disabled="playerInspiration < costs.searchesPerClick"
						>{{ costs.searchesPerClick }} ✨</v-btn
					>
				</v-row>
				<v-row class="d-flex neat-row">
					<span>Pitches per click+</span>
					<v-btn
						@click="triggerAction('pitchesPerClick')"
						:disabled="playerInspiration < costs.pitchesPerClick"
						>{{ costs.pitchesPerClick }} ✨</v-btn
					>
				</v-row>
			</v-row>
			<v-row class="d-flex neat-row">
				<v-row class="d-flex neat-row">
					<span>Worker search speed+</span>
					<v-btn
						@click="triggerAction('workerSearchSpeed')"
						:disabled="playerInspiration < costs.workerSearchSpeed"
						>{{ costs.workerSearchSpeed }} ✨</v-btn
					>
				</v-row>
				<v-row class="d-flex neat-row">
					<span>Worker pitch speed+</span>
					<v-btn
						@click="triggerAction('workerPitchSpeed')"
						:disabled="playerInspiration < costs.workerPitchSpeed"
						>{{ costs.workerPitchSpeed }} ✨</v-btn
					>
				</v-row>
			</v-row>
			<v-row class="d-flex flex-column align-center justify-space-evenly">
				<v-row class="d-flex neat-row">
					<span>Shorter Searches+</span>
					<v-btn
						@click="triggerAction('shortenSearches')"
						:disabled="playerInspiration < costs.shortenSearches"
						>{{ costs.shortenSearches }} ✨</v-btn
					>
				</v-row>
				<v-row class="d-flex neat-row">
					<span>Bigger Investors+</span>
					<v-btn
						@click="triggerAction('biggerInvestors')"
						:disabled="playerInspiration < costs.biggerInvestors"
						>{{ costs.biggerInvestors }} ✨</v-btn
					>
				</v-row>
				<v-row class="d-flex neat-row">
					<span>Better Pitches+</span>
					<v-btn
						@click="triggerAction('betterPitches')"
						:disabled="playerInspiration < costs.betterPitches"
						>{{ costs.betterPitches }} ✨</v-btn
					>
				</v-row>
			</v-row>
		</v-col>
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
	min-width: 20px;
}
</style>
