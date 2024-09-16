<template>
	<v-container v-if="hasShotsToPlan">
		<v-card class="d-flex flex-column align-center">
			<h4 class="py-0">🖼️ Planning: {{ currentShot.name }}</h4>
			<v-list class="pl-0">
				<v-list-item style="color: maroon" class="px-0">
					<v-col class="pb-1 pt-0">
						<h3>Frames</h3>
						<v-progress-linear
							style="height: 22px; width: 180px"
							:model-value="progressBarOne"
							:max="progressbarOneMax"
						>
						</v-progress-linear>
						<v-row class="justify-space-between">
							<span class="ml-2 mt-2"> {{ progressBarOne }} </span>
							<span class="mr-2 mt-2"> {{ progressbarOneMax }} </span>
						</v-row>
					</v-col>
				</v-list-item>
				<v-list-item style="color: red" class="px-0">
					<v-col class="pb-1 pt-0">
						<h3>Drafts</h3>
						<v-progress-linear
							style="height: 22px; width: 180px"
							:model-value="progressBarTwo"
							:max="progressbarTwoMax"
						>
						</v-progress-linear>
						<v-row class="justify-space-between">
							<span class="ml-2 mt-2"> {{ progressBarTwo }} </span>
							<span class="mr-2 mt-2"> {{ progressbarTwoMax }} </span>
						</v-row>
					</v-col>
				</v-list-item>
				<v-list-item style="color: orangered" class="px-0">
					<v-col class="pb-1 pt-0">
						<h3>Sketches</h3>
						<v-progress-linear
							style="height: 22px; width: 180px"
							:model-value="progressBarThree"
							:max="progressbarThreeMax"
						>
						</v-progress-linear>
						<v-row class="justify-space-between">
							<span class="ml-2 mt-2"> {{ progressBarThree }} </span>
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
		</v-card>
	</v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			progressBarOne: 0,
			progressBarTwo: 0,
			progressBarThree: 0,
			progressbarOneMax: 3,
			progressbarTwoMax: 8,
			progressbarThreeMax: 25,

			currentShotIndex: 0,

			localEmployees: 0,
			employeeSpeed: 1,

			ticksPerClick: 1,
		};
	},
	computed: {
		...mapGetters([
			"scriptShots",
			"preproDollarCount",
			"unassignedEmployeeCount",
			"employeeCount",
		]),
		currentShot() {
			return this.scriptShots[this.currentShotIndex];
		},
		hasShotsToPlan() {
			return this.scriptShots.some((shot) => !shot.isPlanned);
		},
		hasUnassignedEmployees() {
			return this.unassignedEmployeeCount >= 1;
		},
		ticksPerSecond() {
			return this.localEmployees * this.employeeSpeed;
		},
	},
	methods: {
		updateProgress() {
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
				this.planShot();
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
				this.planShot();
			}
		},
		planShot() {
			if (this.currentShot) {
				const lastShot = this.currentShot.name;
				this.$store.commit("SET_SHOT_PLANNED", {
					shotIndex: this.currentShotIndex,
				});
				const nextShotIndex = this.scriptShots.findIndex(
					(shot, index) => !shot.isCast && index > this.currentShotIndex
				);
				if (nextShotIndex !== -1) {
					this.currentShotIndex = nextShotIndex;
				} else {
					console.log("All shots have been planned.");
				}
				this.$emit("shotPlanned", lastShot);
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