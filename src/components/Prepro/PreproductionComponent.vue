<!-- Preproductioncomponent.vue -->
<template>
	<v-container fluid class="phase-container">
		<!-- First row spanning full width -->
		<v-row>
			<v-col cols="12" md="3">
				<PitchingComponent v-if="componentVisibility.pitchingComponent" />
				<v-card v-else class="cs-panel-quiet center-content"><br /><br /></v-card>
			</v-col>
			<v-col cols="12" md="9">
				<!-- Progress bar row -->
				<v-row>
					<v-col cols="12">
						<v-card class="cs-panel-quiet pa-2">
							<div class="d-flex align-center">
								<span class="cs-section-title mr-3 font-weight-bold"
									>Progress</span
								>
								<v-progress-linear
									:model-value="totalProgress"
									height="30"
									class="cs-progress"
								>
								</v-progress-linear>
							</div>
						</v-card>
					</v-col>
				</v-row>
				<!-- HireWorkersCard and InspirationShop row -->
				<v-row>
					<v-col cols="12" md="4">
						<HireWorkersCard />
						<v-card
							v-if="currentInvestorTier < 5"
							class="cs-panel-quiet mt-2 pa-2 elevation-2"
						>
							<v-btn
								block
								class="cs-button cs-button-money upgrade-button py-2"
								@click="upgradeInvestors"
								:disabled="preproDollarCount < investorUpgradeCost"
							>
								<v-col>
									<div class="button-text">Upgrade Investor Tier</div>
									<div class="button-cost">
										${{ investorUpgradeCost.toLocaleString() }}
									</div>
								</v-col>
							</v-btn>
						</v-card>
					</v-col>
					<v-col cols="12" md="8">
						<InspirationShop v-if="componentVisibility.inspirationShop" />
						<v-card v-else class="cs-panel-quiet center-content"
							><br /><br
						/></v-card>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<!-- Second row with PreproBanner -->
		<v-row>
			<v-col cols="12">
				<PreproBanner
					v-if="componentVisibility.preproBanner"
					:actorSparkleIsActive="actorSparkleActive"
					@roleCast="handleRoleCast"
					@shotPlanned="handleShotPlanned"
					@setBuilt="handleSetBuilt"
					@locationScouted="handleLocationScouted"
					@costumeMade="handleCostumeMade"
					@lookDesigned="handleLookDesigned"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { mapState, mapActions } from "pinia";
import { useGameStore } from "@/store";
import { useGuidanceStore } from "@/stores/guidanceStore";
import PitchingComponent from "./PitchingComponent.vue";
import InspirationShop from "./InspirationShop.vue";
import HireWorkersCard from "./HireWorkersCard.vue";
import PreproBanner from "./PreproBanner.vue";
import { useGameClockStore } from "@/stores/gameClockStore";
import { usePreproductionStore } from "@/stores/preproductionStore";

export default {
	components: {
		PitchingComponent,
		InspirationShop,
		HireWorkersCard,
		PreproBanner,
	},
	data() {
		return {
			actorSparkleActive: false,
			unregisterWageTicker: null,
		};
	},
	computed: {
		...mapState(useGameStore, {
			getProductCardDetails: "getProductCardDetails",
			wordCount: "wordCount",
			preproDollarCount: "preproDollarCount",
			inspiration: "inspiration",
			scriptTitle: "scriptTitle",
			scriptGenre: "scriptGenre",
			actorGoal: "actorGoal",
			completeRolesCount: "completeRolesCount",
			shotGoal: "shotGoal",
			completeShotsCount: "completeShotsCount",
			setGoal: "setGoal",
			builtSetsCount: "builtSetsCount",
			locationGoal: "locationGoal",
			scoutedLocationsCount: "scoutedLocationsCount",
			costumeGoal: "costumeGoal",
			madeCostumesCount: "madeCostumesCount",
			lookGoal: "lookGoal",
			styledLooksCount: "styledLooksCount",
		}),
		...mapState(useGameStore, {
			componentVisibility: (state) => state.componentVisibility,
			milestones: (state) => state.milestones,
			currentInvestorTier: (state) => state.currentInvestorTier,
		}),
		investorUpgradeCost() {
			return this.preproductionStore.investorUpgradeCost;
		},
		preproductionStore() {
			return usePreproductionStore();
		},
		gameClockStore() {
			return useGameClockStore();
		},
		totalProgress() {
			const goalTotal =
				this.actorGoal +
				this.shotGoal +
				this.setGoal +
				this.locationGoal +
				this.costumeGoal +
				this.lookGoal;
			const completeTotal =
				this.completeRolesCount +
				this.completeShotsCount +
				this.builtSetsCount +
				this.scoutedLocationsCount +
				this.madeCostumesCount +
				this.styledLooksCount;
			return (completeTotal / goalTotal) * 100;
		},
	},
	methods: {
		...mapActions(useGameStore, [
			"spendInspiration",
			"addInspiration",
			"showToast",
			"checkDepartmentHeadsMilestone",
			"checkInspirationMilestone",
			"hireDepartmentHead",
		]),
		upgradeInvestors() {
			if (this.preproductionStore.upgradeInvestors()) {
				const tierNames = ["Small", "Medium", "Large", "Very Large", "Whale"];
				const newTier = this.currentInvestorTier;
				this.showToast(`Unlocked ${tierNames[newTier - 1]} Investors!`);
			}
		},
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
		initializePreproductionUI() {
			console.log("Initializing preproduction UI...");
			console.log("Current milestones:", this.milestones);
			console.log("Current component visibility:", this.componentVisibility);

			// Check if we need to update the store with the current state
			this.checkDepartmentHeadsMilestone();

			// Set initial visibility based on milestones
			if (this.milestones.twoDepartmentHeads) {
				console.log("Two department heads milestone is achieved");
				// Make the hire workers card visible if it's not already
				if (!this.componentVisibility.hireWorkersCard) {
					console.log("Making hireWorkersCard visible");
					useGameStore().TOGGLE_COMPONENT_VISIBILITY("hireWorkersCard");
				}

				// Make the pitching component visible if it's not already
				if (!this.componentVisibility.pitchingComponent) {
					console.log("Making pitchingComponent visible");
					useGameStore().TOGGLE_COMPONENT_VISIBILITY("pitchingComponent");
				}

				// Make the searchers and pitchers card visible if it's not already
				if (!this.componentVisibility.searchersPitchersCard) {
					console.log("Making searchersPitchersCard visible");
					useGameStore().TOGGLE_COMPONENT_VISIBILITY("searchersPitchersCard");
				}
			}

			// Only update the visibility of the inspiration shop without showing the popup
			if (this.milestones.firstInspirationPoint) {
				console.log("First inspiration point milestone is achieved");
				if (!this.componentVisibility.inspirationShop) {
					console.log("Making inspirationShop visible (without popup)");
					useGameStore().TOGGLE_COMPONENT_VISIBILITY("inspirationShop");
				}
			}

			// Pitching component is always visible initially if two department heads milestone is not achieved
			if (
				!this.milestones.twoDepartmentHeads &&
				!this.componentVisibility.pitchingComponent
			) {
				console.log("Making pitchingComponent visible (default)");
				useGameStore().TOGGLE_COMPONENT_VISIBILITY("pitchingComponent");
			}

			console.log(
				"After initialization, component visibility:",
				this.componentVisibility
			);
		},
	},
	// Add created hook to ensure initial state
	created() {
		this.actorSparkleActive = false;
	},
	watch: {
		totalProgress: {
			handler(newVal) {
				if (newVal === 100 && !useGameStore().isFilmingUnlocked) {
					// All preproduction tasks are complete, unlock filming phase
					useGameStore().UPDATE_STATE_VARIABLE({
						key: "isFilmingUnlocked",
						value: true,
					});
						useGuidanceStore().triggerStep("unlock_filming");
					}
				},
			immediate: true,
		},
	},
	mounted() {
		console.log("PreproductionComponent mounted");
		this.unregisterWageTicker = this.gameClockStore.registerTicker(
			"preproduction:wages",
			(elapsedSeconds) => {
				this.preproductionStore.deductWorkerWages(elapsedSeconds);
			}
		);

		// Initialize component visibility based on milestones
		this.initializePreproductionUI();
	},
	beforeUnmount() {
		console.log("PreproductionComponent beforeUnmount");
		if (this.unregisterWageTicker) {
			this.unregisterWageTicker();
			this.unregisterWageTicker = null;
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
@media (max-width: 600px) {
	.phase-container {
		padding-left: var(--cs-gutter-mobile);
		padding-right: var(--cs-gutter-mobile);
		padding-top: var(--cs-gutter-mobile);
		/* Size to content so the in-flow phase nav sits just below it. */
		height: auto;
	}
}
.dollar-counter {
	color: var(--cs-color-success);
	font-family: var(--cs-font-body);
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
.progress-text {
	color: var(--cs-color-white);
	font-weight: bold;
	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}
</style>
