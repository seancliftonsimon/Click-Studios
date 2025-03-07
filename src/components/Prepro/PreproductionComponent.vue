<!-- Preproductioncomponent.vue -->
<template>
	<v-container fluid class="phase-container bg-grey-lighten-2">
		<!-- First row spanning full width -->
		<v-row>
			<v-col cols="3">
				<PitchingComponent v-if="componentVisibility.pitchingComponent" />
				<v-card v-else class="center-content"><br /><br /></v-card>
			</v-col>
			<v-col cols="9">
				<!-- Progress bar row -->
				<v-row>
					<v-col cols="12">
						<v-card class="pa-2">
							<div class="d-flex align-center">
								<span class="mr-3 font-weight-bold"
									>Progress:</span
								>
								<v-progress-linear
									:model-value="totalProgress"
									height="30"
									color="primary"
								>
								</v-progress-linear>
							</div>
						</v-card>
					</v-col>
				</v-row>
				<!-- HireWorkersCard and InspirationShop row -->
				<v-row>
					<v-col cols="4">
						<HireWorkersCard />
						<v-card
							v-if="currentInvestorTier < 5"
							class="mt-2 pa-2 elevation-2"
						>
							<v-btn
								block
								class="upgrade-button py-2"
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
					<v-col cols="8">
						<InspirationShop v-if="componentVisibility.inspirationShop" />
						<v-card v-else class="center-content"><br /><br /></v-card>
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
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import PitchingComponent from "./PitchingComponent.vue";
import InspirationShop from "./InspirationShop.vue";
import HireWorkersCard from "./HireWorkersCard.vue";
import PreproBanner from "./PreproBanner.vue";

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
		...mapState({
			componentVisibility: (state) => state.componentVisibility,
			milestones: (state) => state.milestones,
			currentInvestorTier: (state) => state.currentInvestorTier,
		}),
		investorUpgradeCost() {
			// Return the cost for the next tier upgrade based on current tier
			// Tier 1 is Small, so currentInvestorTier of 1 means we want index 0 for upgrade to Medium
			return this.$store.state.investorTierUpgradeCosts[
				this.currentInvestorTier - 1
			];
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
		...mapActions([
			"spendInspiration",
			"addInspiration",
			"showToast",
			"checkDepartmentHeadsMilestone",
			"checkInspirationMilestone",
			"hireDepartmentHead",
		]),
		...mapMutations(["UPGRADE_INVESTOR_TIER", "DECREASE_PREPRO_DOLLAR_AMOUNT"]),
		upgradeInvestors() {
			if (this.preproDollarCount >= this.investorUpgradeCost) {
				this.DECREASE_PREPRO_DOLLAR_AMOUNT(this.investorUpgradeCost);
				this.UPGRADE_INVESTOR_TIER();
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
					this.$store.commit("TOGGLE_COMPONENT_VISIBILITY", "hireWorkersCard");
				}

				// Make the pitching component visible if it's not already
				if (!this.componentVisibility.pitchingComponent) {
					console.log("Making pitchingComponent visible");
					this.$store.commit(
						"TOGGLE_COMPONENT_VISIBILITY",
						"pitchingComponent"
					);
				}

				// Make the searchers and pitchers card visible if it's not already
				if (!this.componentVisibility.searchersPitchersCard) {
					console.log("Making searchersPitchersCard visible");
					this.$store.commit(
						"TOGGLE_COMPONENT_VISIBILITY",
						"searchersPitchersCard"
					);
				}
			}

			// Only update the visibility of the inspiration shop without showing the popup
			if (this.milestones.firstInspirationPoint) {
				console.log("First inspiration point milestone is achieved");
				if (!this.componentVisibility.inspirationShop) {
					console.log("Making inspirationShop visible (without popup)");
					this.$store.commit("TOGGLE_COMPONENT_VISIBILITY", "inspirationShop");
				}
			}

			// Pitching component is always visible initially if two department heads milestone is not achieved
			if (
				!this.milestones.twoDepartmentHeads &&
				!this.componentVisibility.pitchingComponent
			) {
				console.log("Making pitchingComponent visible (default)");
				this.$store.commit("TOGGLE_COMPONENT_VISIBILITY", "pitchingComponent");
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
				if (newVal === 100) {
					// All preproduction tasks are complete, unlock filming phase
					this.$store.commit("UPDATE_STATE_VARIABLE", {
						key: "isFilmingUnlocked",
						value: true,
					});
					// Show a popup to notify the player
					this.$store.dispatch("popupManager/showPopup", {
						id: "achievement_filmingUnlocked",
					});
				}
			},
			immediate: true,
		},
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

		// Initialize component visibility based on milestones
		this.initializePreproductionUI();
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
.progress-text {
	color: white;
	font-weight: bold;
	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}
</style>
