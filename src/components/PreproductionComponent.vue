<!-- Preproductioncomponent.vue -->
<template>
	<v-snackbar v-model="snackbarVisible" :timeout="4000" right color="success">
		<span> {{ snackbarMessage }}</span>
		<v-btn flat color="white" @click="snackbarVisible = false">X</v-btn>
	</v-snackbar>
	<v-container fluid class="phase-container bg-grey-lighten-2">
		<!-- First row spanning full width -->
		<v-row>
			<v-col cols="12">
				<PreproBanner :actorSparkleIsActive="actorSparkleActive" />
			</v-col>
		</v-row>
		<!-- Second row with six components each containing three v-cards -->
		<v-row>
			<v-col cols="2">
				<CastingBarStack class="pa-0" @roleCast="handleRoleCast" />
			</v-col>
			<v-col cols="2">
				<ShotPlanningBarStack class="pa-0" @shotPlanned="handleShotPlanned" />
			</v-col>
			<v-col cols="2">
				<SetBuildingBarStack class="pa-0" @setBuilt="handleSetBuilt" />
			</v-col>
			<v-col cols="2">
				<LocationScoutingBarStack
					class="pa-0"
					@locationScouted="handleLocationScouted"
				/>
			</v-col>
			<v-col cols="2">
				<CostumeMakingBarStack class="pa-0" @costumeMade="handleCostumeMade" />
			</v-col>
			<v-col cols="2">
				<LookDesigningBarStack
					class="pa-0"
					@lookDesigned="handleLookDesigned"
				/>
			</v-col>
		</v-row>
		<!-- Third row with four components -->
		<v-row>
			<v-col cols="3">
				<PitchingComponent />
				<v-card class="center-content"><br /><br /> </v-card
			></v-col>
			<v-col cols="6">
				<InspirationShop />
			</v-col>
			<v-col cols="3">
				<HireWorkersCard />
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import PitchingComponent from "./Prepro/PitchingComponent.vue";
import InspirationShop from "./Prepro/InspirationShop.vue";
import HireWorkersCard from "./Prepro/HireWorkersCard.vue";
import CastingBarStack from "./Prepro/CastingBarStack.vue";
import ShotPlanningBarStack from "./Prepro/ShotPlanningBarStack.vue";
import SetBuildingBarStack from "./Prepro/SetBuildingBarStack.vue";
import LocationScoutingBarStack from "./Prepro/LocationScoutingBarStack.vue";
import CostumeMakingBarStack from "./Prepro/CostumeMakingBarStack.vue";
import LookDesigningBarStack from "./Prepro/LookDesigningBarStack.vue";

import PreproBanner from "./PreproBanner.vue";

export default {
	components: {
		PitchingComponent,
		InspirationShop,
		HireWorkersCard,
		CastingBarStack,
		PreproBanner,
		ShotPlanningBarStack,
		LocationScoutingBarStack,
		SetBuildingBarStack,
		CostumeMakingBarStack,
		LookDesigningBarStack,
	},
	data() {
		return {
			snackbarVisible: false,
			snackbarMessage: "empty snackbar",
			actorSparkleActive: false,
		};
	},
	computed: {
		...mapGetters({
			getProductCardDetails: "getProductCardDetails",
			wordCount: "wordCount",
			preproDollarCount: "preproDollarCount",
			inspiration: "inspiration",
			scriptTitle: "scriptTitle",
			scriptGenre: "scriptGenre",
		}),
	},
	methods: {
		...mapActions(["spendInspiration", "addInspiration"]),
		handleRoleCast(role) {
			this.snackbarMessage = `Inspiring! You've cast the role of ${role}.`;
			this.snackbarVisible = true;
			this.addInspiration(1);

			// Add timeout to reset the sparkle effect
			this.actorSparkleActive = true;
			setTimeout(() => {
				this.actorSparkleActive = false;
			}, 2000); // Reset after 2 seconds
		},
		handleCostumeMade(costume) {
			this.snackbarMessage = `Inspiring! You've made ${costume}.`;
			this.snackbarVisible = true;
			this.addInspiration(1);
		},
		handleShotPlanned(shot) {
			this.snackbarMessage = `Inspiring! You've planned ${shot}.`;
			this.snackbarVisible = true;
			this.addInspiration(1);
		},
		handleSetBuilt(set) {
			this.snackbarMessage = `Inspiring! You've built ${set}.`;
			this.snackbarVisible = true;
			this.addInspiration(1);
		},
		handleLocationScouted(location) {
			this.snackbarMessage = `Inspiring! You've scouted ${location}.`;
			this.snackbarVisible = true;
			this.addInspiration(1);
		},
		handleLookDesigned(look) {
			this.snackbarMessage = `Inspiring! You've designed ${look}.`;
			this.snackbarVisible = true;
			this.addInspiration(1);
		},
	},
	// Add created hook to ensure initial state
	created() {
		this.actorSparkleActive = false;
	},
	mounted() {
		console.log("PreproductionComponent mounted");
		// Store intervals globally so they can be cleaned up
		window.intervals = window.intervals || [];

		// Add wage deduction interval
		const wageInterval = setInterval(() => {
			this.$store.dispatch("deductWorkerWages");
		}, 1000);
		window.intervals.push(wageInterval);
	},
	beforeUnmount() {
		console.log("PreproductionComponent beforeUnmount");
		// Clean up any remaining intervals
		if (window.intervals) {
			window.intervals.forEach(clearInterval);
			window.intervals = [];
		}
	},
};
</script>

<style scoped>
.phase-container {
	padding-left: 5%;
	padding-right: 5%;
	padding-top: 2.5%;
	height: 100%;
}
.dollar-counter {
	color: #4caf50;
	font-family: Roboto;
	font-size: 22px;
	font-weight: 600;
}
.center-content {
	display: flex;
	flex-direction: column;
	justify-content: center; /* Vertically center the content */
	align-items: center; /* Horizontally center the content */
	width: 100%; /* Ensure it spans the width of its container */
}
</style>
