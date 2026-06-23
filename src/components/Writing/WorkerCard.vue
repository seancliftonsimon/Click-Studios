<template>
	<v-card
		class="mx-auto mb-4"
		:class="{
			'script-doctor': workerType === 'scriptDoctor',
			'tier-upgrade-pulse': isUpgrading,
		}"
		shaped
		elevation="2"
		style="border-radius: 16px"
		v-if="isWorkerVisible"
		:data-guidance-target="guidanceTarget"
	>
		<v-row no-gutters>
			<v-card-title class="worker-title py-1">
				<div>
					<div
						v-if="workerType !== 'scriptDoctor'"
						class="tier-pips"
						:aria-label="tierLabel"
					>
						<span
							v-for="pip in writerTierTotal"
							:key="pip"
							class="tier-pip"
							:class="{ 'tier-pip-active': pip <= writerTierNumber }"
						></span>
					</div>
					<div>{{ name }}</div>
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
						:class="{ inactive: !(canAfford && isUnderCapacity) }"
						:disabled="!(canAfford && isUnderCapacity)"
						@click="makeHire(cost)"
					>
						<span>Hire for ${{ $formatNumber(cost) }}</span>
					</v-btn>
				</v-card-actions>
			</v-col>
		</v-row>
		<v-row style="margin-top: -20px" class="pb-3">
			<v-col class="text-center worker-text pl-3">
				{{ $formatNumber(wps) }} WPS
			</v-col>
			<v-col class="text-center worker-text pr-3">
				FOR {{ $formatNumber(duration) }} MINS
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";

export default {
	name: "WorkerCard",
	props: {
		workerType: String,
	},
	data() {
		return {
			isUpgrading: false,
			upgradeAnimationTimeout: null,
		};
	},
	computed: {
		...mapState(useGameStore, {
			getWorkerDetails: "getWorkerDetails",
			writerTierOrder: "writerTierOrder",
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
		effect() {
			return this.workerDetails.effect ?? 1;
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
			return useGameStore().writingDollarCount >= this.cost;
		},
		isWorkerVisible() {
			return Boolean(this.workerDetails?.visible);
		},
		isUnderCapacity() {
			return (
				this.currentWorkerAmount < this.currentWritersRoomCapacity &&
				this.currentWritersRoomCapacity > 0
			);
		},
		writerTierNumber() {
			return this.writerTierOrder.indexOf(this.workerType) + 1;
		},
		writerTierTotal() {
			return this.writerTierOrder.length;
		},
		tierLabel() {
			return `${this.name} is upgrade ${this.writerTierNumber} of ${this.writerTierTotal}`;
		},
		guidanceTarget() {
			return this.workerType === "scriptDoctor"
				? "script-doctor-card"
				: "writer-hire-card";
		},
	},
	watch: {
		workerType() {
			this.triggerUpgradeAnimation();
		},
	},
	mounted() {
		this.triggerUpgradeAnimation();
	},
	beforeUnmount() {
		if (this.upgradeAnimationTimeout) {
			window.clearTimeout(this.upgradeAnimationTimeout);
		}
	},
	methods: {
		makeHire(cost) {
			if (this.canAfford && this.isUnderCapacity) {
				useGameStore().hireWorker({
					cost,
					name: this.workerType,
				});
			}
		},
		triggerUpgradeAnimation() {
			if (this.upgradeAnimationTimeout) {
				window.clearTimeout(this.upgradeAnimationTimeout);
			}
			this.isUpgrading = true;
			this.upgradeAnimationTimeout = window.setTimeout(() => {
				this.isUpgrading = false;
				this.upgradeAnimationTimeout = null;
			}, 700);
		},
	},
};
</script>

<style scoped>
.script-doctor {
	background-color: hsl(34, 100%, 89%);
}

.slide-enter-active,
.slide-leave-active {
	transition: max-height 0.5s ease;
}

.slide-enter,
.slide-leave-to {
	max-height: 0;
}

.worker-title {
	align-self: center;
	font-family: "Roboto", sans-serif;
	font-size: 18px;
	font-weight: 500;
}

.tier-pips {
	display: flex;
	gap: 4px;
	margin-bottom: 5px;
}

.tier-pip {
	border: 1px solid #931621;
	border-radius: 999px;
	height: 7px;
	width: 7px;
}

.tier-pip-active {
	background: #931621;
}

.worker-text {
	color: #931621;
	font-family: "Roboto", sans-serif;
	font-weight: 500;
}

.tier-upgrade-pulse {
	animation: tier-upgrade-pulse 0.7s ease-out;
}

@keyframes tier-upgrade-pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.65);
		transform: scale(0.98);
	}
	55% {
		box-shadow: 0 0 0 8px rgba(255, 193, 7, 0.18);
		transform: scale(1.02);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
		transform: scale(1);
	}
}
</style>
