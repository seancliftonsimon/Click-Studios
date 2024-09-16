<template>
	<v-card
		class="mx-auto mb-4"
		shaped
		elevation="2"
		style="border-radius: 16px"
		v-if="isProductVisible"
	>
		<v-row no-gutters>
			<v-card-title class="worker-title py-1">{{ name }}</v-card-title>
		</v-row>
		<v-row style="margin-top: -20px" no-gutters v-if="showBody">
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
						@click="makeHire(cost, name)"
					>
						<!-- Use cost prop here -->
						<span>Hire for ${{ $formatNumber(cost) }}</span>
					</v-btn>
				</v-card-actions>
			</v-col>
		</v-row>
		<v-row style="margin-top: -20px" class="d-flex pb-3">
			<v-col class="text-center worker-text mx-auto" cols="6">
				{{ $formatNumber(wps) }} WPS
			</v-col>
			<v-col class="text-center worker-text" cols="6">
				FOR {{ $formatNumber(duration) }} MINS
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "ScriptDoctorCard",
	computed: {
		...mapGetters({
			getWorkerDetails: "getWorkerDetails",
			workers: "workers",
			currentWritersRoomCapacity: "currentWritersRoomCapacity",
			currentWorkerAmount: "currentWorkerAmount",
		}),
		name() {
			const details = this.getWorkerDetails(this.workerType);
			return details ? details.name : "";
		},
		emoji() {
			const details = this.getWorkerDetails(this.workerType);
			return details ? details.emoji : "";
		},
		text() {
			const details = this.getWorkerDetails(this.workerType);
			return details ? details.text : "";
		},
		cost() {
			const details = this.getWorkerDetails(this.workerType);
			return details ? details.cost : 0;
		},
		wps() {
			const details = this.getWorkerDetails(this.workerType);
			return details ? details.wps : 0;
		},
		duration() {
			const details = this.getWorkerDetails(this.workerType);
			return details ? details.duration : 0;
		},
		canAfford() {
			return this.$store.state.writingDollarCount >= this.cost;
		},
		isProductVisible() {
			return this.getWorkerDetails(this.workerType).visible;
		},
		isUnderCapacity() {
			return (
				this.currentWorkerAmount < this.currentWritersRoomCapacity &&
				this.currentWritersRoomCapacity > 0
			);
		},
	},
	methods: {
		makeHire(cost, name) {
			if (this.canAfford) {
				this.$store.dispatch("hireWorker", { cost, name });
			}
		},
	},
};
</script>

<style scoped>
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
