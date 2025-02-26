<template>
	<v-container>
		<v-card class="d-flex flex-column align-center">
			<h3>🪡 Costumes</h3>
			<v-container v-show="deptLocked" align="center">
				<span>Hire Head of Costumes</span>
				<v-btn :disabled="!canAffordHire" @click="hireDeptHead"> $5K </v-btn>
			</v-container>
			<v-container v-show="!deptLocked && hasCostumesToMake" class="py-0">
				<h4 class="py-0" align="center">
					{{ currentCostume ? currentCostume.name : "All costumes made" }}
				</h4>
				<v-list class="pl-0">
					<v-list-item style="color: maroon" class="px-0">
						<v-col class="pa-0">
							<h3>Patterns</h3>
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
							<h3>Panels</h3>
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
							<h3>Stitches</h3>
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
			<v-container v-show="!deptLocked && !hasCostumesToMake">
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
			componentId: "costumeMaking",
			progressbarOneMax: 20,
			progressbarTwoMax: 50,
			progressbarThreeMax: 100,
			employeeSpeed: 1,
			intervalId: null,
			ticksPerClick: 1,
			currentCostumeIndex: 0,
		};
	},
	computed: {
		...mapGetters([
			"scriptCostumes",
			"preproDollarCount",
			"unassignedEmployeeCount",
			"employeeCount",
		]),
		...mapState({
			departmentState: (state) => state.departments.costumeMaking,
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
		currentCostume() {
			return this.scriptCostumes[this.currentCostumeIndex];
		},
		hasCostumesToMake() {
			return this.scriptCostumes.some((costume) => !costume.isMade);
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
		...mapGetters("progressManager", ["getProgress"]),
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
		}),
		updateProgress() {
			if (!this.hasCostumesToMake || this.preproDollarCount <= 0) return;

			this.$nextTick(() => {
				this.calculateProgress({
					componentId: this.componentId,
					amount: this.ticksPerSecond,
				});
			});
		},
		updateProgressOnClick() {
			// Instead of directly modifying computed properties, use the store action
			this.calculateProgress({
				componentId: this.componentId,
				amount: this.ticksPerClick,
			});

			// Check if we've completed a costume after the progress update
			this.$nextTick(() => {
				if (this.progressBarOne >= this.progressbarOneMax) {
					this.makeCostume();
				}
			});
		},
		makeCostume() {
			if (this.currentCostume) {
				const lastCostume = this.currentCostume.name;
				this.$store.commit("SET_COSTUME_MADE", {
					costumeIndex: this.currentCostumeIndex,
				});
				const nextCostumeIndex = this.scriptCostumes.findIndex(
					(costume, index) =>
						!costume.isMade && index > this.currentCostumeIndex
				);
				if (nextCostumeIndex !== -1) {
					this.currentCostumeIndex = nextCostumeIndex;
				} else {
					console.log("All costumes have been made.");
					let i = this.localEmployees;
					while (i > 0) {
						this.unassignEmployee();
						i--;
						console.log("Unassigned one employee!");
					}
				}
				this.$emit("costumeMade", lastCostume);
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
			this.$store.commit("HIRE_DEPARTMENT_HEAD", {
				department: this.componentId,
				cost: 5000,
			});
			this.$store.commit("HIRE_EMPLOYEE", 1);
			this.assignEmployee();
		},
	},
	created() {
		// No longer needed as we're using the store directly
	},
	mounted() {
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
