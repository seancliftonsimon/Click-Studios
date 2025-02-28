<template>
	<v-card>
		<v-col>
			<v-row>
				<span
					class="dollar-counter"
					:class="{ 'zero-balance': preproDollarCount === 0 }"
				>
					${{ $formatNumber(preproDollarCount) }}
				</span></v-row
			>
			<template v-if="isVisible">
				<v-row>
					<span class="payrate-counter"> -${{ totalPayrate }}/s</span>
				</v-row>
				<v-row>
					<v-btn
						class="hire-worker-button"
						:class="{ 'active-button': canAffordWorker }"
						@click="employeeHireClick"
						:disabled="!canAffordWorker"
					>
						Hire Worker ${{ displayWorkerCost }}
					</v-btn></v-row
				>
			</template>
		</v-col>
		<template v-if="isVisible">
			<v-divider />
			<v-row class="my-3 employee-assignments">
				<v-chip color="gray">
					<span>Unassigned: {{ unassignedEmployeeCount }}</span>
				</v-chip>
				<v-chip color="primary" variant="flat">
					<span>Assigned: {{ assignedEmployeeCount }}</span>
				</v-chip>
			</v-row>
		</template>
	</v-card>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
	data() {
		return {
			baseWorkerCost: 10, // Initial cost for the first worker
			trueWorkerCost: 10, // Tracks the actual cost with decimal precision
			workerRate: 3,
			costMultiplier: 1.1, // Each worker costs 1.1x the previous one
		};
	},
	methods: {
		...mapMutations(["HIRE_EMPLOYEE"]),
		employeeHireClick() {
			if (this.canAffordWorker) {
				this.$store.commit(
					"DECREASE_PREPRO_DOLLAR_AMOUNT",
					this.displayWorkerCost
				);
				this.$store.commit("HIRE_EMPLOYEE", 1);

				// Update the true cost for the next worker
				this.trueWorkerCost = this.trueWorkerCost * this.costMultiplier;
			}
		},
	},
	computed: {
		...mapGetters({
			preproDollarCount: "preproDollarCount",
			employeeCount: "employeeCount",
			unassignedEmployeeCount: "unassignedEmployeeCount",
		}),
		...mapState({
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
	background-color: #fef7e5 !important;
}

.dollar-counter {
	padding-top: 4px;
	margin: auto;
	font-size: 2.2em;
}

.zero-balance {
	color: red;
}

.payrate-counter {
	margin: auto;
	font-size: 1.2em;
	padding-bottom: 12px;
}

.employee-assignments {
	justify-content: space-evenly;
}

/* Custom color to match InspirationShop buttons */
:deep(.v-btn.hire-worker-button.v-btn--color-custom-beige) {
	background-color: #fef7e5;
}
</style>
