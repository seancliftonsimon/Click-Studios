<template>
	<v-card
		class="cs-panel mx-auto mb-4 worker-card"
		:class="{
			'script-doctor': workerType === 'scriptDoctor',
			'tier-upgrade-pulse': isUpgrading,
		}"
		elevation="2"
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
		<v-row class="worker-body-row" no-gutters>
			<v-col cols="5" class="d-flex justify-center align-center">
				<span class="worker-emoji">{{ emoji }}</span>
			</v-col>
			<v-col cols="7" class="d-flex flex-column justify-space-between">
				<v-card-actions class="px-4">
					<v-btn
						block
						class="cs-button spend-money-btn"
						:class="{ inactive: !(canAfford && isUnderCapacity) }"
						:disabled="!(canAfford && isUnderCapacity)"
						@click="makeHire(cost)"
					>
						<span>Hire for ${{ $formatNumber(cost) }}</span>
					</v-btn>
				</v-card-actions>
			</v-col>
		</v-row>
		<v-row class="worker-meta-row pb-3">
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
	background: var(--cs-color-popcorn);
}

.worker-card {
	border-color: rgba(49, 59, 114, 0.22);
}

.worker-body-row,
.worker-meta-row {
	margin-top: -20px;
}

.worker-emoji {
	font-size: 4rem;
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
	font-family: var(--cs-font-body);
	font-size: 18px;
	font-weight: 500;
}

.tier-pips {
	display: flex;
	gap: 4px;
	margin-bottom: 5px;
}

.tier-pip {
	border: 1px solid var(--cs-color-curtain);
	border-radius: 999px;
	height: 7px;
	width: 7px;
}

.tier-pip-active {
	background: var(--cs-color-curtain);
}

.worker-text {
	color: var(--cs-color-curtain);
	font-family: var(--cs-font-body);
	font-weight: 500;
}

.tier-upgrade-pulse {
	animation: tier-upgrade-pulse 0.7s ease-out;
}

@keyframes tier-upgrade-pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(250, 208, 28, 0.65);
		transform: scale(0.98);
	}
	55% {
		box-shadow: 0 0 0 8px rgba(250, 208, 28, 0.18);
		transform: scale(1.02);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(250, 208, 28, 0);
		transform: scale(1);
	}
}
</style>
