<template>
	<v-container>
		<v-card class="d-flex flex-column align-center">
			<h3>📍 Locations</h3>
			<v-container v-show="deptLocked" align="center">
				<span>Hire Location Manager</span>
				<v-btn :disabled="!canAffordHire" @click="hireDeptHead">
					${{ cost }}
				</v-btn>
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
				<div class="d-flex justify-center">
					<v-btn @click="updateProgressOnClick">+{{ ticksPerClick }}</v-btn>
				</div>
				<br />
				<v-divider class="py-1"></v-divider>
				<!-- Employee controls section with conditional visibility -->
				<v-row class="py-5 justify-center align-center">
					<v-btn
						v-show="isHireWorkersVisible"
						@click="unassignEmployee"
						class="plus-minus mx-1"
						:disabled="localEmployees <= 0"
						>-</v-btn
					>
					<span class="mx-1">👤{{ localEmployees }} </span>
					<v-btn
						v-show="isHireWorkersVisible"
						@click="assignEmployee"
						class="plus-minus mx-1"
						:disabled="!hasUnassignedEmployees"
						>+</v-btn
					>
					<span class="text-center mx-1">{{ ticksPerSecond }}ps</span>
				</v-row>
			</v-container>
			<v-container
				v-if="!deptLocked && !hasLocationsToScout"
				class="d-flex flex-column align-center justify-center text-center"
				style="min-height: 100%"
			>
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
			componentId: "locationScouting",
			progressbarOneMax: 3,
			progressbarTwoMax: 5,
			progressbarThreeMax: 10,
			employeeSpeed: 1,
			intervalId: null,
			ticksPerClick: 1,
			currentLocationIndex: 0,
			cost: 500,
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
			componentVisibility: (state) => state.componentVisibility,
		}),
		isHireWorkersVisible() {
			return this.componentVisibility.hireWorkersCard;
		},
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
			// TODO: Change back to 5000 after testing
			return this.preproDollarCount >= 500;
		},
		currentProgress() {
			return (
				this.getProgress(this.componentId) || {
					barOne: 0,
					barTwo: 0,
					barThree: 0,
				}
			);
		},
		progressBarOne() {
			return this.currentProgress?.barOne || 0;
		},
		progressBarTwo() {
			return this.currentProgress?.barTwo || 0;
		},
		progressBarThree() {
			return this.currentProgress?.barThree || 0;
		},
	},

	methods: {
		...mapMutations(["HIRE_EMPLOYEE", "HIRE_DEPARTMENT_HEAD"]),
		...mapActions({
			calculateProgress: "progressManager/calculateProgress",
			hireDepartmentHead: "hireDepartmentHead",
		}),
		updateProgress() {
			if (!this.hasLocationsToScout || this.preproDollarCount <= 0) return;

			this.$nextTick(() => {
				this.calculateProgress({
					componentId: this.componentId,
					amount: this.ticksPerSecond,
				});

				// Check if the top bar is full and trigger scoutLocation if it is
				if (this.progressBarOne >= this.progressbarOneMax) {
					this.scoutLocation();
				}
			});
		},
		updateProgressOnClick() {
			this.calculateProgress({
				componentId: this.componentId,
				amount: this.ticksPerClick,
			});

			this.$nextTick(() => {
				if (this.progressBarOne >= this.progressbarOneMax) {
					this.scoutLocation();
				}
			});
		},
		scoutLocation() {
			if (this.currentLocation) {
				const lastLocation = this.currentLocation.name;

				this.$store.commit("SET_LOCATION_SCOUTED", {
					locationIndex: this.currentLocationIndex,
				});

				// Reset progress for this component
				this.$store.commit("progressManager/RESET_PROGRESS", this.componentId);

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

				// Emit the locationScouted event with the location name
				this.$emit("locationScouted", lastLocation);

				// Also emit a more specific event that includes the component ID
				this.$emit("taskCompleted", {
					component: this.componentId,
					location: lastLocation,
				});
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
			this.$store.dispatch("hireDepartmentHead", {
				department: this.componentId,
				// TODO: Change back to 5000 after testing
				cost: this.cost,
			});
			this.$store.commit("HIRE_EMPLOYEE", 1);
			this.assignEmployee();
		},
	},

	created() {
		// Initialize from store if exists
		const storedProgress = this.$store.getters["progressManager/getProgress"](
			this.componentId
		);
		if (storedProgress) {
			this.localProgress = { ...storedProgress };
		}
		// Initialize max values in the store
		this.$store.commit("progressManager/SET_MAX_VALUES", {
			componentId: this.componentId,
			maxValues: {
				barOne: this.progressbarOneMax,
				barTwo: this.progressbarTwoMax,
				barThree: this.progressbarThreeMax,
			},
		});
	},
	mounted() {
		// Reset progress when component is mounted
		this.$store.commit("progressManager/RESET_PROGRESS", this.componentId);

		this.intervalId = setInterval(this.updateProgress, 1000);
		window.intervals = window.intervals || [];
		window.intervals.push(this.intervalId);
	},
	beforeUnmount() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			const index = window.intervals.indexOf(this.intervalId);
			if (index > -1) {
				window.intervals.splice(index, 1);
			}
		}
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
