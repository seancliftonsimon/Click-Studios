<template>
	<div>
		<!-- Add investor tier indicator with tooltip -->
		<div class="investor-tier-indicator text-center mb-2">
			<v-tooltip bottom>
				<template v-slot:activator="{ on, attrs }">
					<span v-bind="attrs" v-on="on" class="font-weight-bold">
						Current Investor Tier:
						<span v-if="currentInvestorTier === 1">Small Investors</span>
						<span v-else-if="currentInvestorTier === 2">Medium Investors</span>
						<span v-else-if="currentInvestorTier === 3">Large Investors</span>
						<span v-else-if="currentInvestorTier === 4"
							>Very Large Investors</span
						>
						<span v-else-if="currentInvestorTier === 5">Whale Investors</span>
					</span>
				</template>
				<span>Higher tier investors provide larger funding amounts</span>
			</v-tooltip>
		</div>
		<component :is="currentCard" @nextCard="nextCard"></component>
		<!-- Example button to go to the next card -->
	</div>
	<v-card
		v-if="componentVisibility.searchersPitchersCard"
		class="mt-2 pa-2 elevation-2"
	>
		<v-row>
			<v-col>
				<v-row class="py-5 justify-center">
					<div class="d-flex flex-column align-center">
						<div class="d-flex align-center">
							<v-btn
								@click="unassignSearcher"
								class="plus-minus-btn"
								:disabled="searcherCount <= 0"
								>-</v-btn
							>
							<span class="px-2">👤{{ searcherCount }} </span>
							<v-btn
								@click="assignSearcher"
								class="plus-minus-btn"
								:disabled="!hasUnassignedEmployees"
								>+</v-btn
							>
						</div>
						<span class="text-center font-weight-bold mt-2">Searchers</span>
					</div>
				</v-row>
			</v-col>
			<v-col>
				<v-row class="py-5 justify-center">
					<div class="d-flex flex-column align-center">
						<div class="d-flex align-center">
							<v-btn
								@click="unassignPitcher"
								class="plus-minus-btn"
								:disabled="pitcherCount <= 0"
								>-</v-btn
							>
							<span class="px-2">👤{{ pitcherCount }} </span>
							<v-btn
								@click="assignPitcher"
								class="plus-minus-btn"
								:disabled="!hasUnassignedEmployees"
								>+</v-btn
							>
						</div>
						<span class="text-center font-weight-bold mt-2">Pitchers</span>
					</div>
				</v-row>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import InvestorSearchCard from "./InvestorSearchCard.vue";
import InvestorFoundCard from "./InvestorFoundCard.vue";
import InvestorPitchCard from "./InvestorPitchCard.vue";
import InvestorPayCard from "./InvestorPayCard.vue";

export default {
	data() {
		return {
			currentCard: "InvestorSearchCard",
		};
	},
	computed: {
		...mapGetters({
			unassignedEmployeeCount: "unassignedEmployeeCount",
			searcherCount: "searcherCount",
			pitcherCount: "pitcherCount",
			currentInvestorTier: "currentInvestorTier",
		}),
		...mapState({
			componentVisibility: (state) => state.componentVisibility,
		}),
		hasUnassignedEmployees() {
			return this.unassignedEmployeeCount >= 1;
		},
	},
	components: {
		InvestorSearchCard,
		InvestorFoundCard,
		InvestorPitchCard,
		InvestorPayCard,
	},

	methods: {
		nextCard() {
			const cardSequence = [
				"InvestorSearchCard",
				"InvestorFoundCard",
				"InvestorPitchCard",
				"InvestorPayCard",
			];
			let currentIndex = cardSequence.indexOf(this.currentCard);
			let nextIndex = (currentIndex + 1) % cardSequence.length; // Loop back to 0 when reaching the end
			this.currentCard = cardSequence[nextIndex];
			console.log(`${this.currentCard}`);
		},
		assignSearcher() {
			this.$store.commit("ASSIGN_SEARCHER", 1);
		},
		unassignSearcher() {
			this.$store.commit("UNASSIGN_SEARCHER", 1);
		},
		assignPitcher() {
			this.$store.commit("ASSIGN_PITCHER", 1);
		},
		unassignPitcher() {
			this.$store.commit("UNASSIGN_PITCHER", 1);
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

.plus-minus-btn {
	min-width: 24px !important;
	width: 24px !important;
	padding: 0 !important;
}

/* Add styles for the investor tier indicator */
.investor-tier-indicator {
	background-color: #f5f5f5;
	padding: 8px;
	border-radius: 4px;
	margin-bottom: 12px;
}
</style>
