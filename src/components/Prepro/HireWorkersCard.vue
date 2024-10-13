<template>
	<v-card>
		<v-col>
			<v-row>
				<span class="dollar-counter">
					${{ $formatNumber(preproDollarCount) }}
				</span></v-row
			>
			<v-row>
				<span class="payrate-counter"> -${{ totalPayrate }}/s</span>
			</v-row>
			<v-row>
				<v-btn class="hire-worker-button" @click="employeeHireClick">
					Hire Worker ${{ workerCost }}
				</v-btn></v-row
			>
		</v-col>
		<v-divider />
		<v-row class="my-3 employee-assignments">
			<v-chip color="gray">
				<span>Unassigned: {{ unassignedEmployeeCount }}</span>
			</v-chip>
			<v-chip color="primary" variant="flat">
				<span>Assigned: {{ assignedEmployeeCount }}</span>
			</v-chip>
		</v-row>
	</v-card>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
	data() {
		return {
			workerCost: 10,
			workerRate: 3,
		};
	},
	methods: {
		...mapMutations(["HIRE_EMPLOYEE"]),
		employeeHireClick() {
			this.$store.commit("HIRE_EMPLOYEE", 1);
		},
	},
	computed: {
		...mapGetters({
			preproDollarCount: "preproDollarCount",
			employeeCount: "employeeCount",
			unassignedEmployeeCount: "unassignedEmployeeCount",
		}),
		assignedEmployeeCount() {
			return this.employeeCount - this.unassignedEmployeeCount;
		},
		totalPayrate() {
			return this.assignedEmployeeCount * this.workerRate;
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

.dollar-counter {
	padding-top: 4px;
	margin: auto;
	font-size: 2.2em;
}

.payrate-counter {
	margin: auto;
	font-size: 1.2em;
	padding-bottom: 12px;
}

.employee-assignments {
	justify-content: space-evenly;
}
</style>
