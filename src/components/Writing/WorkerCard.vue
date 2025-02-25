<template>
	<v-card
		class="mx-auto mb-4"
		:class="{ 'script-doctor': workerType === 'scriptDoctor' }"
		shaped
		elevation="2"
		style="border-radius: 16px"
		v-if="isWorkerVisible"
	>
		<v-row no-gutters>
			<v-card-title class="worker-title py-1">{{ name }}</v-card-title>
		</v-row>
		<v-row style="margin-top: -20px" no-gutters>
			<v-col cols="5" class="d-flex justify-center align-center">
				<span style="font-size: 4rem">{{ emoji }}</span>
			</v-col>
			<v-col cols="7" class="d-flex flex-column justify-space-between">
				<v-card-actions class="px-4">
					<v-btn
						block
						class="spend-money-btn"
						:class="{ inactive: !(canAfford && isUnderCapacity) }"
						:disabled="!(canAfford && isUnderCapacity)"
						@click="makeHire(cost)"
					>
						<!-- Use cost prop here -->
						<span>Hire for ${{ $formatNumber(cost) }}</span>
					</v-btn>
				</v-card-actions>
			</v-col>
		</v-row>
		<v-row style="margin-top: -20px" class="pb-3">
			<v-col class="text-center worker-text pl-3">
				<!-- Conditional Rendering for Script Doctors -->
				<template v-if="workerType === 'scriptDoctor'">
					ALL WRITING X{{ effect }}
				</template>
				<template v-else> {{ $formatNumber(wps) }} WPS </template>
			</v-col>
			<v-col class="text-center worker-text pr-3">
				FOR {{ $formatNumber(duration) }} MINS
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	props: {
		workerType: String,
	},
	name: "WorkerCard",
	computed: {
		...mapGetters({
			getWorkerDetails: "getWorkerDetails",
			workers: "workers",
			currentWritersRoomCapacity: "currentWritersRoomCapacity",
			currentWorkerAmount: "currentWorkerAmount",
		}),
		workerDetails() {
			// Unified computed property to fetch worker details once
			return this.getWorkerDetails(this.workerType);
		},
		name() {
			return this.workerDetails.name ?? "";
		},
		emoji() {
			return this.workerDetails.emoji ?? "X";
		},
		effect() {
			return this.workerDetails.effect ?? 1;
		},
		text() {
			return this.workerDetails.text ?? "";
		},
		cost() {
			return this.workerDetails.cost ?? 0;
		},
		wps() {
			return this.workerDetails.wps ?? 0;
		},
		duration() {
			return this.workerDetails.duration ?? 0;
		},
		canAfford() {
			return this.$store.state.writingDollarCount >= this.cost;
		},
		isWorkerVisible() {
			return this.workerDetails.visible;
		},
		isUnderCapacity() {
			return (
				this.currentWorkerAmount < this.currentWritersRoomCapacity &&
				this.currentWritersRoomCapacity > 0
			);
		},
	},
	methods: {
		makeHire(cost) {
			if (this.canAfford) {
				this.$store.dispatch("hireWorker", {
					cost,
					name: this.workerType, // Pass the workerType directly instead of the display name
				});
			}
		},
	},
};
</script>

<style scoped>
.script-doctor {
	background-color: hsl(34, 100%, 89%);
}

/* Add transition styles for the slide effect */
.slide-enter-active,
.slide-leave-active {
	transition: max-height 0.5s ease;
}
.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
	max-height: 0;
}

.worker-title {
	align-self: center;
	font-family: "Roboto";
	font-size: 18px;
	font-weight: 500;
}

.worker-text {
	font-family: "Roboto";
	color: #931621;
	font-weight: 500;
}
</style>
