<template>
	<v-card class="cs-panel">
		<v-col>
			<v-row>
				<h3 class="dollar-counter-title">{{ title }} Budget</h3>
			</v-row>
			<v-row>
				<span
					class="dollar-counter"
					:class="{ 'zero-balance': preproDollarCount === 0 }"
				>
					${{ $formatNumber(preproDollarCount) }}
				</span>
			</v-row>
			<v-row>
				<span class="payrate-counter">
					-${{ preproDollarCount === 0 ? 0 : totalPayrate }}/s</span
				>
			</v-row>
			<template v-if="isVisible">
				<v-divider />
				<v-row class="my-3 employee-assignments">
					<div class="progress-container">
						<v-progress-linear
							:model-value="assignedProgressValue"
							height="40"
							:rounded="false"
							class="cs-progress employee-progress"
						>
							<template v-slot:default>
								<span
									class="employee-stats"
									:class="{ 'furloughed-text': preproDollarCount === 0 }"
								>
									<strong v-if="preproDollarCount === 0 && employeeCount > 0">
										{{ employeeCount }} Workers Furloughed
									</strong>
									<strong
										v-else-if="
											assignedEmployeeCount > 0 &&
											assignedEmployeeCount === employeeCount &&
											preproDollarCount > 0
										"
									>
										All {{ employeeCount }} Workers Assigned
									</strong>
									<strong v-else-if="assignedEmployeeCount > 0">
										{{ assignedEmployeeCount }}/{{ employeeCount }} Workers
										Assigned
									</strong>
									<strong v-else-if="employeeCount > 0">
										{{ employeeCount }} Workers Unassigned
									</strong>
									<strong v-else>0 Workers</strong>
								</span>
							</template>
						</v-progress-linear>
					</div>
				</v-row>
				<v-row>
					<v-btn
						class="cs-button cs-button-money hire-worker-button mb-3"
						:class="{ 'active-button': canAffordWorker }"
						@click="employeeHireClick"
						:disabled="!canAffordWorker"
					>
						Hire Worker ${{ displayWorkerCost }}
					</v-btn></v-row
				>
			</template>
		</v-col>
	</v-card>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useGameStore } from "@/store";

export default {
	data() {
		return {
			baseWorkerCost: 100, // Initial cost for the first worker
			trueWorkerCost: 100, // Tracks the actual cost with decimal precision
			workerRate: 3,
			costMultiplier: 1.05, // Each worker costs 1.x the previous one
		};
	},
	methods: {
		...mapActions(useGameStore, ["HIRE_EMPLOYEE"]),
		employeeHireClick() {
			if (this.canAffordWorker) {
				useGameStore().DECREASE_PREPRO_DOLLAR_AMOUNT(this.displayWorkerCost);
				useGameStore().HIRE_EMPLOYEE(1);

				// Update the true cost for the next worker
				this.trueWorkerCost = this.trueWorkerCost * this.costMultiplier;
			}
		},
	},
	computed: {
		...mapState(useGameStore, {
			title: "scriptTitle",
			preproDollarCount: "preproDollarCount",
			employeeCount: "employeeCount",
			unassignedEmployeeCount: "unassignedEmployeeCount",
		}),
		...mapState(useGameStore, {
			componentVisibility: (state) => state.componentVisibility,
		}),
		isVisible() {
			return this.componentVisibility.hireWorkersCard;
		},
		assignedEmployeeCount() {
			return this.employeeCount - this.unassignedEmployeeCount;
		},
		totalPayrate() {
			return this.assignedEmployeeCount * this.workerRate;
		},
		displayWorkerCost() {
			// Round to the nearest integer for display and purchasing
			return Math.round(this.trueWorkerCost);
		},
		canAffordWorker() {
			return this.preproDollarCount >= this.displayWorkerCost;
		},
		progressValue() {
			// Convert to numbers and calculate percentage
			const assigned = Number(this.assignedEmployeeCount);
			const total = Number(this.employeeCount);
			// Return 0 if there are no employees, otherwise calculate the percentage
			return total > 0 ? (assigned / total) * 100 : 0;
		},
		assignedProgressValue() {
			// Log the dollar count to help debug
			console.log("Current preproDollarCount:", this.preproDollarCount);

			// Calculate percentage of assigned workers
			const assigned = Number(this.assignedEmployeeCount);
			const total = Number(this.employeeCount);
			// Return 0 if there are no employees, otherwise calculate the percentage
			return total > 0 ? (assigned / total) * 100 : 0;
		},
		unassignedProgressValue() {
			// Convert to numbers and calculate percentage of unassigned workers
			const unassigned = Number(this.unassignedEmployeeCount);
			const total = Number(this.employeeCount);
			// Return 0 if there are no employees, otherwise calculate the percentage
			return total > 0 ? (unassigned / total) * 100 : 0;
		},
	},
};
</script>

<style scoped>
.hire-worker-button {
	font-weight: bold;
	margin: auto;
	width: 80%;
	height: 3.4em;
}

.active-button {
	background-color: var(--cs-color-night) !important;
}

.dollar-counter {
	padding-top: 4px;
	margin: auto;
	font-size: 2.2em;
}

.dollar-counter-title {
	font-family: var(--cs-font-display);
	font-size: 1.2em;
	margin: auto;
}

.zero-balance {
	color: var(--cs-color-danger);
}

.payrate-counter {
	margin: auto;
	font-size: 1.2em;
	padding-bottom: 12px;
}

.employee-assignments {
	justify-content: space-evenly;
}

.progress-container {
	width: 80%;
	margin: auto;
}

.employee-progress {
	overflow: hidden;
}

/* Override progress bar colors with more specific selectors */
:deep(.employee-progress .v-progress-linear__determinate) {
	background-color: v-bind(
		'preproDollarCount === 0 ? "#FF5252" : assignedEmployeeCount === employeeCount && employeeCount > 0 ? "#81C784" : "#FFCC80"'
	) !important;
}

:deep(.employee-progress .v-progress-linear__background) {
	background-color: var(--cs-color-gray) !important;
	opacity: 1 !important;
}

.employee-stats {
	width: 100%;
	text-align: center;
	color: var(--cs-color-ink);
	font-size: 1.1rem;
	font-weight: 500;
}

.furloughed-text {
	color: white;
}

</style>
