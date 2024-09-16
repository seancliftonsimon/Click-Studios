<template>
	<v-card class="rounded-lg mt-5">
		<v-container
			class="writers-room rounded-lg my-3 mx-auto"
			:style="{ backgroundColor: roomColor }" >
			<v-row>
				<span
					v-for="worker in workersDisplay"
					:key="worker.id"
					style="font-size: 3em"
					>{{ worker.emoji }}</span
				>
			</v-row>
		</v-container>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	computed: {
		...mapGetters({
			getWorkerDetails: "getWorkerDetails",
			workers: "workers",
			currentCapacity: "currentWritersRoomCapacity",
		}),
		workersDisplay() {
			return this.$store.state.currentWorkers.map((workerEntry) => {
				const workerDetails = this.$store.state.workers[workerEntry.workerType];
				if (!workerDetails) {
					console.error(
						`Details not found for worker type: ${workerEntry.workerType}`
					);
					return { ...workerEntry, emoji: "❓" }; // Fallback emoji
				}
				return { ...workerEntry, emoji: workerDetails.emoji };
			});
		},
		atCapacity() {
			return this.workersDisplay.length >= this.currentCapacity;
		},
		roomColor() {
			return this.atCapacity ? 'lightgrey' : 'ghostwhite';
		}
	},
};
</script>

<style scoped>
.writers-room {
	min-height: 6em;
	border: 2px dashed #000;
	padding: 4px;
	width: 96%;
}
.worker-emoji {
	display: inline-block; /* Ensures emojis wrap like text */
}
.grow {
	flex-grow: 1;
}
</style>
