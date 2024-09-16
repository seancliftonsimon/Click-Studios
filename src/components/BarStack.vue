<template>
	<v-container>
		<v-card>
			<v-card-title class="py-0">
				<slot></slot>
			</v-card-title>
			<v-list class="pl-0">
				<v-list-item style="color: maroon" class="px-0">
					<v-col class="pb-1 pt-0">
						<h3>Callbacks</h3>
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
						<h3>Auditions</h3>
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
						<h3>Days</h3>
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
			<v-btn @click="updateProgress">Increase</v-btn>
			<span> per Second: {{ ticksPerSecond }}</span>
			<v-container class="pa-0">
				<v-select
					v-model="ticksPerSecond"
					:items="tickOptions"
					label="Ticks per Second"
					outlined
				></v-select>
			</v-container>
		</v-card>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			progressBarOne: 0,
			progressBarTwo: 0,
			progressBarThree: 0,
			progressbarOneMax: 20,
			progressbarTwoMax: 50,
			progressbarThreeMax: 100,

			ticksPerSecond: 1, // Default value
			tickOptions: [1, 5, 10, 20, 50], // Options for the dropdown
		};
	},
	methods: {
		updateProgress() {
			this.progressBarThree += this.ticksPerSecond;
			if (this.progressBarThree >= this.progressbarThreeMax) {
				this.progressBarThree = 0; // Reset progressBarFour
				this.progressBarTwo += 1; // Increase progressBarThree
			}
			if (this.progressBarTwo > this.progressbarTwoMax) {
				this.progressBarTwo = 0; // Reset progressBarThree
				this.progressBarOne += 1; // Increase progressBarTwo
			}
			if (this.progressBarOne > this.progressbarOneMax) {
				this.progressBarOne = 0; // Reset progressBarTwo
			}

			/** console.log(`progressBarFour equals ${this.progressBarFour}`); **/
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
