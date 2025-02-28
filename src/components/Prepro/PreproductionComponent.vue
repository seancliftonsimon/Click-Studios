<!-- Preproductioncomponent.vue -->
<template>
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
				<v-card class="center-content"><br /><br /></v-card>
			</v-col>
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
import PitchingComponent from "./PitchingComponent.vue";
import InspirationShop from "./InspirationShop.vue";
import HireWorkersCard from "./HireWorkersCard.vue";
import CastingBarStack from "./CastingBarStack.vue";
import ShotPlanningBarStack from "./ShotPlanningBarStack.vue";
import SetBuildingBarStack from "./SetBuildingBarStack.vue";
import LocationScoutingBarStack from "./LocationScoutingBarStack.vue";
import CostumeMakingBarStack from "./CostumeMakingBarStack.vue";
import LookDesigningBarStack from "./LookDesigningBarStack.vue";

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
		...mapActions(["spendInspiration", "addInspiration", "showToast"]),
		handleRoleCast(role) {
			this.showToast(`Inspiring! You've cast the role of ${role}.`);
			this.addInspiration(1);

			// Add timeout to reset the sparkle effect
			this.actorSparkleActive = true;
			setTimeout(() => {
				this.actorSparkleActive = false;
			}, 2000); // Reset after 2 seconds
		},
		handleCostumeMade(costume) {
			this.showToast(`Inspiring! You've made ${costume}.`);
			this.addInspiration(1);
		},
		handleShotPlanned(shot) {
			this.showToast(`Inspiring! You've planned ${shot}.`);
			this.addInspiration(1);
		},
		handleSetBuilt(set) {
			this.showToast(`Inspiring! You've built ${set}.`);
			this.addInspiration(1);
		},
		handleLocationScouted(location) {
			this.showToast(`Inspiring! You've scouted ${location}.`);
			this.addInspiration(1);
		},
		handleLookDesigned(look) {
			this.showToast(`Inspiring! You've designed ${look}.`);
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
