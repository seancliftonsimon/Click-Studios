<template>
	<div>
		<component :is="currentCard" @nextCard="nextCard"></component>
		<!-- Example button to go to the next card -->
	</div>
	<v-row>
		<v-col>
			<v-row class="py-5">
				<v-btn
					@click="unassignSearcher"
					class="plus-minus"
					:disabled="searcherCount <= 0"
					>-</v-btn
				>
				<span>👤{{ searcherCount }} </span>
				<v-btn
					@click="assignSearcher"
					class="plus-minus"
					:disabled="!hasUnassignedEmployees"
					>+</v-btn
				>
				<span class="text-center"> Searchers</span>
			</v-row>
		</v-col>
		<v-col>
			<v-row class="py-5">
				<v-btn
					@click="unassignPitcher"
					class="plus-minus"
					:disabled="pitcherCount <= 0"
					>-</v-btn
				>
				<span>👤{{ pitcherCount }} </span>
				<v-btn
					@click="assignPitcher"
					class="plus-minus"
					:disabled="!hasUnassignedEmployees"
					>+</v-btn
				>
				<span class="text-center"> Pitchers</span>
			</v-row>
		</v-col>
	</v-row>
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
</style>
