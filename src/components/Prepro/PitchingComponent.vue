<template>
	<div>
		<component :is="currentCard" @nextCard="nextCard"></component>
		<!-- Example button to go to the next card -->
	</div>
	<v-card class="mt-2 pa-2 elevation-2">
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
import { mapGetters } from "vuex";

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
</style>
