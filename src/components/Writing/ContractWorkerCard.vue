<template>
	<v-card
		class="mx-auto mb-4 contract-worker-card"
		:class="{ 'script-doctor-card': workerType === 'scriptDoctor' }"
		elevation="2"
		style="border-radius: 16px"
		v-if="isWorkerVisible"
		:data-guidance-target="workerType === 'scriptDoctor' ? 'script-doctor-card' : undefined"
	>
		<v-row no-gutters>
			<v-card-title class="worker-title py-1">
				<div>{{ name }}</div>
				<div class="worker-count" v-if="count > 0">
					{{ count }} signed
				</div>
			</v-card-title>
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
						:class="{ inactive: !canSign }"
						:disabled="!canSign"
						@click="makeSign"
					>
						<span>Sign for ${{ $formatNumber(cost) }}</span>
					</v-btn>
				</v-card-actions>
			</v-col>
		</v-row>
		<v-row style="margin-top: -20px" class="pb-3">
			<v-col class="text-center worker-text pl-3">
				<template v-if="workerType === 'scriptDoctor'">
					ALL WRITING X{{ currentMultiplier }}
				</template>
				<template v-else>{{ $formatNumber(wps) }} WPS / HEAD</template>
			</v-col>
			<v-col class="text-center worker-text pr-3">
				${{ $formatNumber(salary) }}/PAYDAY
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";

export default {
	name: "ContractWorkerCard",
	props: {
		workerType: String,
	},
	computed: {
		...mapState(useGameStore, {
			getWorkerDetails: "getWorkerDetails",
			currentWritersRoomCapacity: "currentWritersRoomCapacity",
			currentWorkerAmount: "currentWorkerAmount",
		}),
		workerDetails() {
			return this.getWorkerDetails(this.workerType) || {};
		},
		name() {
			return this.workerDetails.name ?? "";
		},
		emoji() {
			return this.workerDetails.emoji ?? "X";
		},
		cost() {
			return this.workerDetails.cost ?? 0;
		},
		wps() {
			return this.workerDetails.wps ?? 0;
		},
		salary() {
			return this.workerDetails.salary ?? 0;
		},
		count() {
			return this.workerDetails.count ?? 0;
		},
		isWorkerVisible() {
			return Boolean(this.workerDetails?.visible);
		},
		canAfford() {
			return useGameStore().writingDollarCount >= this.cost;
		},
		isUnderCapacity() {
			return (
				this.currentWorkerAmount < this.currentWritersRoomCapacity &&
				this.currentWritersRoomCapacity > 0
			);
		},
		canSign() {
			return this.canAfford && this.isUnderCapacity;
		},
		currentMultiplier() {
			const effect = this.workerDetails.effect ?? 0.2;
			return (1 + effect * this.count).toFixed(1);
		},
	},
	methods: {
		makeSign() {
			if (this.canSign) {
				useGameStore().hireWorker({ cost: this.cost, name: this.workerType });
			}
		},
	},
};
</script>

<style scoped>
.contract-worker-card {
	background-color: hsl(220, 40%, 96%);
}

.script-doctor-card {
	background-color: hsl(34, 100%, 89%);
}

.worker-title {
	align-self: center;
	font-family: "Roboto", sans-serif;
	font-size: 16px;
	font-weight: 500;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.worker-count {
	font-size: 13px;
	color: #555;
	font-weight: 400;
}

.worker-text {
	color: #1a3a6b;
	font-family: "Roboto", sans-serif;
	font-weight: 500;
}
</style>
