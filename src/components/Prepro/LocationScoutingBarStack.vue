<template>
	<v-container>
		<v-card class="d-flex flex-column align-center">
			<h3>📍 Locations</h3>
			<v-container v-show="deptLocked" align="center">
				<span>Hire Location Manager</span>
				<v-btn :disabled="!canAffordHire" @click="hireDeptHead"> $5K </v-btn>
			</v-container>
			<v-container v-show="!deptLocked && hasLocationsToScout" class="py-0">
				<h4 class="py-0" align="center">
					{{ currentLocation ? currentLocation.name : "All locations scouted" }}
				</h4>
				<v-list v-show="hasLocationsToScout" class="pl-0">
					<v-list-item style="color: maroon" class="px-0">
						<v-col class="pa-0">
							<h3>Permitting</h3>
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
							<h3>Site Visit</h3>
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
							<h3>Research</h3>
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
					>
					<span class="text-center">{{ ticksPerSecond }}ps</span>
				</v-row>
			</v-container>
			<v-container v-show="!deptLocked && !hasLocationsToScout">
				<span>Complete.</span> <br />
				<span> Workers have been unassigned.</span>
			</v-container>
		</v-card>
	</v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";

export default {
	data() {
		return {
			deptLocked: true,
			componentId: "locationScouting",
			progressbarOneMax: 20,
			progressbarTwoMax: 50,
			progressbarThreeMax: 100,
			currentLocationIndex: 0,
			localEmployees: 0,
			employeeSpeed: 1,
			ticksPerClick: 1,
			intervalId: null,
		};
	},
	computed: {
		...mapGetters([
			"scriptLocations",
			"preproDollarCount",
			"unassignedEmployeeCount",
			"employeeCount",
		]),
		...mapState({
			departmentState: (state) => state.departments.locationScouting,
		}),
		deptLocked: {
			get() {
				return this.departmentState.isLocked;
			},
			set(value) {
				this.$store.commit("SET_DEPARTMENT_LOCK", {
					department: this.componentId,
					isLocked: value,
				});
			},
		},
		localEmployees: {
			get() {
				return this.departmentState.employees;
			},
			set(value) {
				this.$store.commit("SET_DEPARTMENT_EMPLOYEES", {
					department: this.componentId,
					count: value,
				});
			},
		},
		...mapGetters("progressManager", ["getProgress"]),
		currentLocation() {
			return this.scriptLocations[this.currentLocationIndex];
		},
		hasLocationsToScout() {
			return this.scriptLocations.some((location) => !location.isScouted);
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
		currentProgress() {
			return this.getProgress(this.componentId);
		},
		progressBarOne() {
			return this.currentProgress.barOne;
		},
		progressBarTwo() {
			return this.currentProgress.barTwo;
		},
		progressBarThree() {
			return this.currentProgress.barThree;
		},
	},

	methods: {
		...mapMutations(["HIRE_EMPLOYEE"]),
		...mapActions("progressManager", ["calculateProgress"]),
		updateProgress() {
			if (!this.hasLocationsToScout) return;

			this.calculateProgress({
				componentId: this.componentId,
				ticksPerSecond: this.ticksPerSecond,
				maxValues: {
					one: this.progressbarOneMax,
					two: this.progressbarTwoMax,
					three: this.progressbarThreeMax,
				},
				onComplete: () => this.scoutLocation(),
			});
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
				this.scoutLocation();
			}
		},
		scoutLocation() {
			if (this.currentLocation) {
				const lastLocation = this.currentLocation.name;

				this.$store.commit("SET_LOCATION_SCOUTED", {
					locationIndex: this.currentLocationIndex,
				});
				const nextLocationIndex = this.scriptLocations.findIndex(
					(location, index) =>
						!location.isScouted && index > this.currentLocationIndex
				);
				if (nextLocationIndex !== -1) {
					this.currentLocationIndex = nextLocationIndex;
				} else {
					console.log("All locations have been scouted.");
					let i = this.localEmployees;
					while (i > 0) {
						this.unassignEmployee();
						i--;
						console.log("Unassigned one employee!");
					}
				}
				this.$emit("locationScouted", lastLocation);
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
		this.intervalId = setInterval(this.updateProgress, 1000);
	},
	beforeUnmount() {
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
