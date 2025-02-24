<template>
	<v-container>
		<v-card class="d-flex flex-column align-center">
			<h3>🔭 Casting</h3>
			<v-container v-show="deptLocked" align="center">
				<span>Hire Casting Director</span>
				<v-btn :disabled="!canAffordHire" @click="hireDeptHead"> $5K </v-btn>
			</v-container>
			<v-container v-show="!deptLocked && hasRolesToCast" class="py-0">
				<h4 class="py-0" align="center">
					{{ currentRole ? currentRole.name : "All roles cast" }}
				</h4>
				<v-list class="pl-0">
					<v-list-item style="color: maroon" class="px-0">
						<v-col class="pa-0">
							<h3>Callbacks</h3>
							<v-progress-linear
								style="height: 22px; width: 170px"
								:model-value="progressBarOne"
								:max="progressbarOneMax"
							>
							</v-progress-linear>
							<v-row class="justify-space-between">
								<span class="ml-3 mt-2"> {{ progressBarOne }} </span>
								<span class="mr-2 mt-2"> {{ progressbarOneMax }} </span>
							</v-row>
						</v-col>
					</v-list-item>
					<v-list-item style="color: red" class="px-0">
						<v-col class="pa-0">
							<h3>Auditions</h3>
							<v-progress-linear
								style="height: 22px; width: 170px"
								:model-value="progressBarTwo"
								:max="progressbarTwoMax"
							>
							</v-progress-linear>
							<v-row class="justify-space-between">
								<span class="ml-3 mt-2"> {{ progressBarTwo }} </span>
								<span class="mr-2 mt-2"> {{ progressbarTwoMax }} </span>
							</v-row>
						</v-col>
					</v-list-item>
					<v-list-item style="color: orangered" class="px-0">
						<v-col class="pa-0">
							<h3>Cattle Call</h3>
							<v-progress-linear
								style="height: 22px; width: 170px"
								:model-value="progressBarThree"
								:max="progressbarThreeMax"
							>
							</v-progress-linear>
							<v-row class="justify-space-between">
								<span class="ml-3 mt-2"> {{ progressBarThree }} </span>
								<span class="mr-2 mt-2"> {{ progressbarThreeMax }}</span>
							</v-row>
						</v-col>
					</v-list-item>
				</v-list>

				<v-btn @click="updateProgressOnClick">+{{ ticksPerClick }}</v-btn
				><br />
				<v-divider class="py-1"></v-divider>
				<v-row class="py-5">
					<v-btn
						@click="unassignEmployee"
						class="plus-minus"
						:disabled="localEmployees <= 0"
						>-</v-btn
					>
					<span>👤{{ localEmployees }} </span>
					<v-btn
						@click="assignEmployee"
						class="plus-minus"
						:disabled="!hasUnassignedEmployees"
						>+</v-btn
					><br />
					<span class="text-center">{{ ticksPerSecond }}ps</span>
				</v-row>
			</v-container>
			<v-container v-show="!deptLocked && !hasRolesToCast">
				<span>Complete.</span> <br />
				<span> Workers have been unassigned.</span>
			</v-container>
		</v-card>
	</v-container>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
	data() {
		return {
			componentId: "casting",
			progressbarOneMax: 20,
			progressbarTwoMax: 50,
			progressbarThreeMax: 100,
			employeeSpeed: 1,
			intervalId: null,
			ticksPerClick: 1,
		};
	},
	computed: {
		...mapGetters([
			"scriptRoles",
			"preproDollarCount",
			"unassignedEmployeeCount",
			"employeeCount",
		]),
		...mapState({
			departmentState: state => state.departments.casting
		}),
		deptLocked: {
			get() {
				return this.departmentState.isLocked;
			},
			set(value) {
				this.$store.commit('SET_DEPARTMENT_LOCK', {
					department: this.componentId,
					isLocked: value
				});
			}
		},
		localEmployees: {
			get() {
				return this.departmentState.employees;
			},
			set(value) {
				this.$store.commit('SET_DEPARTMENT_EMPLOYEES', {
					department: this.componentId,
					count: value
				});
			}
		},
		currentRole() {
			return this.scriptRoles[this.currentRoleIndex];
		},
		hasRolesToCast() {
			return this.scriptRoles.some((role) => !role.isCast);
		},
		hasUnassignedEmployees() {
			return this.unassignedEmployeeCount >= 1;
		},
		ticksPerSecond() {
			return this.localEmployees * this.employeeSpeed;
		},
		canAffordHire() {
			return this.preproDollarCount >= 5000;
		},
	},
	methods: {
		...mapMutations(["HIRE_EMPLOYEE"]),
		updateProgress() {
			if (!this.hasRolesToCast) return;
			this.progressBarThree += this.ticksPerSecond;
			// Calculate the initial overflow for progressBarThree
			let overflowThree = this.progressBarThree - this.progressbarThreeMax;

			while (this.progressBarThree >= this.progressbarThreeMax) {
				// Deduct the max value from progressBarThree to handle the overflow
				this.progressBarThree -= this.progressbarThreeMax;
				// Increment progressBarTwo each time the max is deducted from progressBarThree
				this.progressBarTwo += 1;
				// Recalculate overflowThree for the next iteration of the loop
				overflowThree = this.progressBarThree - this.progressbarThreeMax;
			}

			// After handling the loop, if there's still any overflow, set progressBarThree to that overflow
			if (overflowThree > 0) {
				this.progressBarThree = overflowThree;
			}

			if (this.progressBarTwo >= this.progressbarTwoMax) {
				this.progressBarTwo = 0;
				this.progressBarOne += 1;
			}

			if (this.progressBarOne >= this.progressbarOneMax) {
				this.progressBarOne = 0;
				this.castRole();
			}
		},
		updateProgressOnClick() {
			this.progressBarThree += this.ticksPerClick;
			// Calculate the initial overflow for progressBarThree
			let overflowThree = this.progressBarThree - this.progressbarThreeMax;

			while (this.progressBarThree >= this.progressbarThreeMax) {
				this.progressBarThree -= this.progressbarThreeMax;
				this.progressBarTwo += 1;
				overflowThree = this.progressBarThree - this.progressbarThreeMax;
			}

			// After handling the loop, if there's still any overflow, set progressBarThree to that overflow
			if (overflowThree > 0) {
				this.progressBarThree = overflowThree;
			}

			if (this.progressBarTwo >= this.progressbarTwoMax) {
				this.progressBarTwo = 0;
				this.progressBarOne += 1;
			}

			if (this.progressBarOne >= this.progressbarOneMax) {
				this.progressBarOne = 0;
				this.castRole();
			}
		},
		castRole() {
			if (this.currentRole) {
				const lastRole = this.currentRole.name;
				this.$store.commit("SET_ROLE_CAST", {
					roleIndex: this.currentRoleIndex,
				});
				const nextRoleIndex = this.scriptRoles.findIndex(
					(role, index) => !role.isCast && index > this.currentRoleIndex
				);
				if (nextRoleIndex !== -1) {
					this.currentRoleIndex = nextRoleIndex;
				} else {
					console.log("All roles have been cast.");
					let i = this.localEmployees;
					while (i > 0) {
						this.unassignEmployee();
						i--;
						console.log("Unassigned one employee!");
					}
				}
				this.$emit("roleCast", lastRole);
			}
		},
		assignEmployee() {
			this.$store.commit("ASSIGN_EMPLOYEE", 1);
			this.localEmployees += 1;
		},
		unassignEmployee() {
			this.$store.commit("UNASSIGN_EMPLOYEE", 1);
			this.localEmployees -= 1;
		},
		hireDeptHead() {
			this.deptLocked = false;
			this.$store.commit("HIRE_EMPLOYEE", 1);
			this.assignEmployee();
		},
	},

	mounted() {
		// Call updateProgress every second (1000 milliseconds)
		this.intervalId = setInterval(this.updateProgress, 1000);
	},
	beforeUnmount() {
		// Clear the interval when the component is about to unmount
		clearInterval(this.intervalId);
	},
};
</script>

<style scoped>
.plus-minus {
	min-width: 0;
	max-width: fit-content;
}

span {
	display: grid;
	align-items: center;
}
</style>
