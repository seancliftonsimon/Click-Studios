<!-- WritingComponent.vue -->

<template>
	<v-container fluid class="phase-container">
		<v-row>
			<v-col cols="12" md="6" order="1" order-md="2">
				<div class="resource-counter-row">
					<DollarCounter class="money-counter-panel" />
					<WordCounter class="word-counter-panel" />
				</div>
				<div class="d-flex mt-5 write-action-row">
					<WriteButton cols="6" />
					<WritingToolCard cols="6" />
				</div>
				<GenreCard v-if="genreProgressVisible" />
				<WritersRoom v-if="writersRoomVisible" />
				<WritersRoomUpgradeCard v-if="writersRoomVisible" />
			</v-col>
			<v-col cols="12" md="3" order="2" order-md="1">
				<PurchaseCard
					v-for="card in cardsArray"
					:key="card.cardType"
					:cardType="card.cardType"
				/>
			</v-col>
			<v-col cols="12" md="3" order="3" order-md="3">
				<!-- Zone 1: Freelancers (single active card) -->
				<div>
					<WorkerCard
						v-for="worker in workersArray"
						:key="worker.workerType"
						:workerType="worker.workerType"
					/>
				</div>
				<!-- Zone 2: Contract staff -->
				<div v-if="contractWorkersArray.length > 0">
					<v-divider class="my-2" />
					<div class="cs-section-title zone-label">Staff</div>
					<ContractWorkerCard
						v-for="worker in contractWorkersArray"
						:key="worker.workerType"
						:workerType="worker.workerType"
					/>
					<!-- Payroll readout -->
					<div v-if="nextPayrollAt" class="payroll-readout mt-1">
						<span class="payroll-label">Next payroll:</span>
						<span class="payroll-timer">{{ payrollCountdown }}</span>
						<span class="payroll-amount">— ${{ $formatNumber(totalSalaryDue) }}</span>
					</div>
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
import ContractWorkerCard from "./ContractWorkerCard.vue";
import WriteButton from "./WriteButton.vue";
import WritingToolCard from "./WritingToolCard.vue";
import WordCounter from "./WordCounter.vue";
import GenreCard from "./GenreCard.vue";
import WritersRoom from "./WritersRoom.vue";
import WritersRoomUpgradeCard from "./WritersRoomUpgradeCard.vue";
import DollarCounter from "./DollarCounter.vue";

export default {
	name: "WritingComponent",
	components: {
		PurchaseCard,
		WriteButton,
		WritingToolCard,
		WordCounter,
		WritersRoom,
		WritersRoomUpgradeCard,
		WorkerCard,
		ContractWorkerCard,
		GenreCard,
		DollarCounter,
	},
	data() {
		return {
			unregisterWorkerExpirationTicker: null,
			unregisterPayrollTicker: null,
			now: Date.now(),
		};
	},
	computed: {
		...mapState(useGameStore, {
			getProductCardDetails: "getProductCardDetails",
			getWorkerDetails: "getWorkerDetails",
			visibleProductCardTypes: "visibleProductCardTypes",
			visibleWorkerCardTypes: "visibleWorkerCardTypes",
			visibleContractCardTypes: "visibleContractCardTypes",
			genreProgressVisible: (state) => state.switchGenreVisible,
			writersRoomVisible: (state) => state.writersRoomVisible,
			writersRoomUpgradeCardVisible: (state) =>
				state.writersRoomUpgradeCardVisible,
			nextPayrollAt: (state) => state.nextPayrollAt,
			currentWorkers: (state) => state.currentWorkers,
			workers: (state) => state.workers,
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
		contractWorkersArray() {
			return this.visibleContractCardTypes.map((workerType) => ({
				workerType,
				...this.getWorkerDetails(workerType),
			}));
		},
		payrollCountdown() {
			if (!this.nextPayrollAt) return "";
			const msLeft = Math.max(0, this.nextPayrollAt - this.now);
			const totalSecs = Math.ceil(msLeft / 1000);
			const mins = Math.floor(totalSecs / 60);
			const secs = totalSecs % 60;
			return `${mins}:${String(secs).padStart(2, "0")}`;
		},
		totalSalaryDue() {
			if (!this.nextPayrollAt) return 0;
			const paydayMs = 5 * 60 * 1000;
			return this.currentWorkers
				.filter((w) => {
					const def = this.workers[w.workerType];
					return (
						def?.employment === "contract" &&
						(w.signedAt ?? this.now) <= this.nextPayrollAt - paydayMs
					);
				})
				.reduce((sum, w) => sum + (this.workers[w.workerType]?.salary ?? 0), 0);
		},
		gameClockStore() {
			return useGameClockStore();
		},
		writingStore() {
			return useWritingStore();
		},
	},
	mounted() {
		this.unregisterWorkerExpirationTicker = this.gameClockStore.registerTicker(
			"writing:worker-expiration",
			(_, now) => {
				this.writingStore.expireWorkers();
				this.writingStore.processPayroll(now);
				this.now = now;
			}
		);
	},
	beforeUnmount() {
		if (this.unregisterWorkerExpirationTicker) {
			this.unregisterWorkerExpirationTicker();
			this.unregisterWorkerExpirationTicker = null;
		}
	},
};
</script>

<style scoped>
.phase-container {
	padding-right: 5%;
	padding-left: 5%;
	padding-top: 2.5%;
	height: 100%;
}

.resource-counter-row {
	align-items: stretch;
	display: flex;
	gap: 12px;
	width: 100%;
}

.money-counter-panel {
	flex: 0 1 32%;
	min-width: 120px;
}

.word-counter-panel {
	flex: 1 1 68%;
	min-width: 260px;
}

@media (max-width: 600px) {
	.phase-container {
		padding-left: var(--cs-gutter-mobile);
		padding-right: var(--cs-gutter-mobile);
		padding-top: var(--cs-gutter-mobile);
		/* Size to content so the in-flow phase nav sits just below it. */
		height: auto;
	}

	.word-counter-panel {
		min-width: 0;
	}

	.money-counter-panel {
		min-width: 0;
	}

	.write-action-row {
		flex-direction: column;
		gap: 12px;
	}

	.write-action-row > * {
		width: 100%;
	}
}

.zone-label {
	color: var(--cs-color-muted);
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 0.05em;
	margin-bottom: 4px;
	text-transform: uppercase;
}

.payroll-readout {
	background: var(--cs-color-ticket);
	border: 1px solid var(--cs-color-line);
	border-radius: var(--cs-radius-control);
	color: var(--cs-color-muted);
	font-size: 12px;
	padding: 4px 6px;
	display: flex;
	gap: 4px;
	align-items: center;
}

.payroll-label {
	font-weight: 500;
}

.payroll-timer {
	font-variant-numeric: tabular-nums;
	font-weight: 600;
	color: var(--cs-color-night);
}

.payroll-amount {
	color: var(--cs-color-muted);
}
</style>
