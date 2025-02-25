<!-- WritingComponent.vue -->

<template>
	<v-container fluid class="phase-container bg-grey-lighten-2">
		<v-row>
			<v-col cols="3">
				<PurchaseCard
					v-for="(card, index) in cardsArray"
					:key="index"
					:cardType="card.cardType"
				/>
			</v-col>
			<v-col cols="6">
				<div class="d-flex">
					<DollarCounter />
					<WordCounter />
				</div>
				<div class="d-flex mt-5">
					<WriteButton cols="6" />
					<WritingToolCard cols="6" />
				</div>
				<GenreCard />
				<WritersRoom v-if="writersRoomVisible" />
				<WritersRoomUpgradeCard v-if="writersRoomVisible" />
			</v-col>
			<v-col cols="3">
				<!-- <div v-if="writersRoomVisible"> -->
				<div>
					<WorkerCard
						v-for="(worker, index) in workersArray"
						:key="index"
						:workerType="worker.workerType"
					/>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapState } from "vuex";

import PurchaseCard from "../PurchaseCard.vue";
import WorkerCard from "./WorkerCard.vue";
import WriteButton from "../buttons/WriteButton.vue";
import WritingToolCard from "./WritingToolCard.vue";
import WordCounter from "./WordCounter.vue";
import GenreCard from "./GenreCard.vue";
import WritersRoom from "./WritersRoom.vue";
import WritersRoomUpgradeCard from "./WritersRoomUpgradeCard.vue";
import DollarCounter from "../DollarCounter.vue";

export default {
	name: "WritingComponent", // It's a good practice to name your components
	components: {
		PurchaseCard, // Register PurchaseCard for use in the template
		WriteButton,
		WritingToolCard,
		WordCounter,
		WritersRoom,
		WritersRoomUpgradeCard,
		WorkerCard,
		GenreCard,
		DollarCounter,
	},
	computed: {
		...mapState({
			productCards: (state) => state.products, // This specifically maps `state.cards` from your `productcards` module to `productcards` computed property
			workersCards: (state) => state.workers, // Assuming `workers` is in the root state
			writersRoomVisible: (state) => state.writersRoomVisible,
			writersRoomUpgradeCardVisible: (state) =>
				state.writersRoomUpgradeCardVisible,
		}),
		cardsArray() {
			return Object.entries(this.productCards).map(([key, value]) => ({
				cardType: key,
				...value,
			}));
		},
		workersArray() {
			return Object.entries(this.workersCards).map(([key, value]) => ({
				workerType: key,
				...value,
			}));
		},
	},
	mounted() {
		console.log("WritingComponent mounted");

		// Create a global array to store worker timeouts that can be cleared when the component unmounts
		window.workerTimeouts = window.workerTimeouts || [];
	},
	beforeUnmount() {
		console.log("WritingComponent beforeUnmount");

		// Clean up any remaining worker timeouts
		if (window.workerTimeouts) {
			window.workerTimeouts.forEach(clearTimeout);
			window.workerTimeouts = [];
		}
	},
};
</script>

<style scoped>
.phase-container {
	padding-left: 5%;
	padding-right: 5%;
	padding-top: 2.5%;
	height: 100%;
}
</style>
