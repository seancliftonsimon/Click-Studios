<template>
	<v-card class="py-6">
		<v-row class="mx-2 mb-1 align-center justify-space-apart">
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('searchesPerClick')"
					:disabled="playerInspiration < costs.searchesPerClick"
				>
					<div>{{ "+ Searches per click" }}</div>
					<div>{{ costs.searchesPerClick }} ✨</div>
				</v-btn>
			</v-col>
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('pitchesPerClick')"
					:disabled="playerInspiration < costs.pitchesPerClick"
				>
					<div>{{ "+ Pitches per click" }}</div>
					<br /><br />
					<div>{{ costs.pitchesPerClick }} ✨</div>
				</v-btn>
			</v-col>
		</v-row>
		<v-row class="mx-2 my-1 align-center">
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('shortenSearches')"
					:disabled="playerInspiration < costs.shortenSearches"
				>
					<span>{{ "Shorter Searches" }}</span>
					<span>{{ costs.shortenSearches }} ✨</span>
				</v-btn>
			</v-col>
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('biggerInvestors')"
					:disabled="playerInspiration < costs.biggerInvestors"
				>
					<div>{{ "Bigger Investors" }}</div>
					<div>{{ costs.biggerInvestors }} ✨</div>
				</v-btn>
			</v-col>
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('betterPitches')"
					:disabled="playerInspiration < costs.betterPitches"
				>
					<div>{{ "Better Pitches" }}</div>
					<div>{{ costs.betterPitches }} ✨</div>
				</v-btn>
			</v-col>
		</v-row>
		<v-row class="mx-2 mt-1 align-center justify-space-apart">
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('autoSearch')"
					:disabled="playerInspiration < costs.autoSearch"
				>
					<div>{{ "Auto Search" }}</div>
					<div>{{ costs.autoSearch }} ✨</div>
				</v-btn>
			</v-col>
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('autoPitch')"
					:disabled="playerInspiration < costs.autoPitch"
				>
					<div>{{ "Auto Pitch" }}</div>
					<div>{{ costs.autoPitch }} ✨</div>
				</v-btn>
			</v-col>
			<v-col align="center">
				<v-btn
					class="upgrade-button"
					@click="triggerAction('autoCollect')"
					:disabled="playerInspiration < costs.autoCollect"
				>
					<div>{{ "Auto Collect" }}</div>
					<div>{{ costs.autoCollect }} ✨</div>
				</v-btn>
			</v-col>
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
.upgrade-button {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	background-color: #fef7e5;
	border-radius: 8px;
}
</style>
