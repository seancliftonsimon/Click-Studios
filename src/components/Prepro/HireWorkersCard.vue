<template>
	<v-card>
		<h2>Workers</h2>
		<span> Cost: $10 </span>
		<v-btn @click="employeeHireClick"> Hire </v-btn>
		<v-divider />
        <span>Total: {{ employeeCount }}</span>
		<br />
		<span>Unassigned: {{ unassignedEmployeeCount }}</span>
		<br />
		<span>Assigned: {{ assignedEmployeeCount }}</span>
	</v-card>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
	methods: {
		...mapMutations(["HIRE_EMPLOYEE"]),
        employeeHireClick() {
            this.$store.commit("HIRE_EMPLOYEE", 1);
        }
	},
	computed: {
		...mapGetters({
			employeeCount: "employeeCount",
			unassignedEmployeeCount: "unassignedEmployeeCount",
		}),
		assignedEmployeeCount() {
			return this.employeeCount - this.unassignedEmployeeCount;
		},
	},
};
</script>

<style scoped></style>
