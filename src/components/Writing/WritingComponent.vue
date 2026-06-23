<!-- WritingComponent.vue -->

<template>
	<v-container fluid class="phase-container bg-grey-lighten-2">
		<v-row>
			<v-col cols="3">
				<PurchaseCard
					v-for="card in cardsArray"
					:key="card.cardType"
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
					<GenreCard v-if="genreProgressVisible" />
				<WritersRoom v-if="writersRoomVisible" />
				<WritersRoomUpgradeCard v-if="writersRoomVisible" />
			</v-col>
			<v-col cols="3">
				<!-- <div v-if="writersRoomVisible"> -->
				<div>
					<WorkerCard
						v-for="worker in workersArray"
						:key="worker.workerType"
						:workerType="worker.workerType"
					/>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";
import { useGameClockStore } from "@/stores/gameClockStore";
import { useWritingStore } from "@/stores/writingStore";

import PurchaseCard from "./PurchaseCard.vue";
import WorkerCard from "./WorkerCard.vue";
import WriteButton from "./WriteButton.vue";
import WritingToolCard from "./WritingToolCard.vue";
import WordCounter from "./WordCounter.vue";
import GenreCard from "./GenreCard.vue";
import WritersRoom from "./WritersRoom.vue";
import WritersRoomUpgradeCard from "./WritersRoomUpgradeCard.vue";
import DollarCounter from "./DollarCounter.vue";

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
	data() {
		return {
			unregisterWorkerExpirationTicker: null,
		};
	},
	computed: {
		...mapState(useGameStore, {
				getProductCardDetails: "getProductCardDetails",
				getWorkerDetails: "getWorkerDetails",
				visibleProductCardTypes: "visibleProductCardTypes",
				visibleWorkerCardTypes: "visibleWorkerCardTypes",
				genreProgressVisible: (state) => state.switchGenreVisible,
				writersRoomVisible: (state) => state.writersRoomVisible,
			writersRoomUpgradeCardVisible: (state) =>
				state.writersRoomUpgradeCardVisible,
		}),
		cardsArray() {
			return this.visibleProductCardTypes.map((cardType) => ({
				cardType,
				...this.getProductCardDetails(cardType),
			}));
		},
		workersArray() {
			return this.visibleWorkerCardTypes.map((workerType) => ({
				workerType,
				...this.getWorkerDetails(workerType),
			}));
		},
		gameClockStore() {
			return useGameClockStore();
		},
		writingStore() {
			return useWritingStore();
		},
	},
	mounted() {
		console.log("WritingComponent mounted");
		this.unregisterWorkerExpirationTicker = this.gameClockStore.registerTicker(
			"writing:worker-expiration",
			() => {
				this.writingStore.expireWorkers();
			}
		);
	},
	beforeUnmount() {
		console.log("WritingComponent beforeUnmount");
		if (this.unregisterWorkerExpirationTicker) {
			this.unregisterWorkerExpirationTicker();
			this.unregisterWorkerExpirationTicker = null;
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
