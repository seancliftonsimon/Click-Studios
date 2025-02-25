<template>
	<v-card class="rounded-lg mt-5">
		<v-container
			class="writers-room rounded-lg my-3 mx-auto"
			:style="{ backgroundColor: roomColor }"
		>
			<div class="worker-grid">
				<worker-emoji
					v-for="worker in workersDisplay"
					:key="worker.id"
					:emoji="worker.emoji"
					:id="worker.id"
					:worker-type="worker.workerType"
					:hire-time="getWorkerTimes(worker).hireTime"
					:expected-removal-time="getWorkerTimes(worker).expectedRemovalTime"
					:animation-start-time="getWorkerTimes(worker).animationStartTime"
					:words-per-second="getWorkerWps(worker)"
					@worker-expired="handleWorkerExpired(worker)"
				/>
			</div>
		</v-container>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";
import WorkerEmoji from "./WorkerEmoji.vue";

export default {
	components: {
		WorkerEmoji,
	},
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

				return {
					...workerEntry,
					emoji: workerDetails.emoji,
					duration: workerDetails.duration,
				};
			});
		},
		atCapacity() {
			return this.workersDisplay.length >= this.currentCapacity;
		},
		roomColor() {
			return this.atCapacity ? "lightgrey" : "ghostwhite";
		},
	},
	methods: {
		getWorkerTimes(worker) {
			const workerDetails = this.$store.state.workers[worker.workerType];

			// Default times in case we can't find them
			const defaultTimes = {
				hireTime: Date.now(),
				expectedRemovalTime: Date.now() + (worker.duration || 10) * 60 * 1000,
				animationStartTime:
					Date.now() + ((worker.duration || 10) * 60 - 5) * 1000,
			};

			if (!workerDetails || !workerDetails.times) return defaultTimes;

			// Get worker timing info from store
			const workerTimes = workerDetails.times[worker.id];
			if (!workerTimes) return defaultTimes;

			return {
				hireTime: workerTimes.hireTime || defaultTimes.hireTime,
				expectedRemovalTime:
					workerTimes.expectedRemovalTime || defaultTimes.expectedRemovalTime,
				animationStartTime:
					workerTimes.animationStartTime || defaultTimes.animationStartTime,
			};
		},
		isWorkerExpiring(worker) {
			const workerDetails = this.$store.state.workers[worker.workerType];
			if (!workerDetails || !workerDetails.times) return false;

			// Get worker timing info from store
			const workerTimes = workerDetails.times[worker.id];
			if (!workerTimes) return false;

			const now = Date.now();

			// Show animation between animationStartTime and expectedRemovalTime
			if (workerTimes.animationStartTime && workerTimes.expectedRemovalTime) {
				const hasAnimationStarted = now >= workerTimes.animationStartTime;
				const hasBeenRemoved = now >= workerTimes.expectedRemovalTime;

				const isExpiring = hasAnimationStarted && !hasBeenRemoved;

				if (isExpiring) {
					const timeRemaining = workerTimes.expectedRemovalTime - now;
					console.log(
						`Worker ${worker.id} is expiring. Time remaining before removal: ${(
							timeRemaining / 1000
						).toFixed(1)}s`
					);
				}

				return isExpiring;
			}

			return false;
		},
		handleWorkerExpired(worker) {
			// Remove the worker from the store when it expires
			this.$store.commit("REMOVE_WORKER", {
				workerType: worker.workerType,
				id: worker.id,
			});
		},
		getWorkerWps(worker) {
			const workerDetails = this.$store.state.workers[worker.workerType];
			return workerDetails ? workerDetails.wps : 0;
		},
	},
};
</script>

<style scoped>
.writers-room {
	min-height: 6em;
	border: 2px dashed #000;
	padding: 10px;
	width: 96%;
}

.worker-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
	gap: 8px;
	justify-content: center;
	padding: 10px;
}
</style>
