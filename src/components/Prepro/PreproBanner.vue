<template>
	<v-card>
		<v-container fluid class="px-8">
			<v-row>
				<v-col cols="11">
					<h3>{{ title }} Preproduction Progress</h3>
					<v-row justify="space-between" align="center" class="py-2">
						<v-col>
							<v-chip color="red-darken-2"
								>{{ completeRolesCount }}/{{ actorGoal }}</v-chip
							><span>Actors </span>
							<span
								v-show="showActorSparkle"
								@animationend="handleAnimationEnd"
								class="sparkle"
							>
								✨
							</span>
							<div class="resource-chips">
								<v-chip
									v-for="(role, index) in scriptRoles"
									:key="'role-' + index"
									variant="flat"
									:color="role.isCast ? 'red' : 'red-lighten-4'"
									:class="{
										'completed-chip': role.isCast,
										'incomplete-chip': !role.isCast,
									}"
									size="small"
									class="ma-1"
								>
									{{ role.name }}
								</v-chip>
							</div>
						</v-col>
						<v-col>
							<v-chip color="orange-darken-2"
								>{{ completeShotsCount }}/{{ shotGoal }}</v-chip
							><span>Shots</span>
							<div class="resource-chips">
								<v-chip
									v-for="(shot, index) in scriptShots"
									:key="'shot-' + index"
									variant="flat"
									:color="shot.isPlanned ? 'orange' : 'orange-lighten-4'"
									:class="{
										'completed-chip': shot.isPlanned,
										'incomplete-chip': !shot.isPlanned,
									}"
									size="small"
									class="ma-1"
								>
									{{ shot.name }}
								</v-chip>
							</div>
						</v-col>
						<v-col>
							<v-chip color="grey-darken-4"
								>{{ builtSetsCount }}/{{ setGoal }}</v-chip
							>
							<span>Sets</span>
							<div class="resource-chips">
								<v-chip
									v-for="(set, index) in scriptSets"
									:key="'set-' + index"
									variant="flat"
									:color="set.isBuilt ? 'grey' : 'grey-lighten-4'"
									:class="{
										'completed-chip': set.isBuilt,
										'incomplete-chip': !set.isBuilt,
									}"
									size="small"
									class="ma-1"
								>
									{{ set.name }}
								</v-chip>
							</div>
						</v-col>
						<v-col
							><v-chip color="green-darken-2"
								>{{ scoutedLocationsCount }}/{{ locationGoal }}</v-chip
							><span>Locations</span>
							<div class="resource-chips">
								<v-chip
									v-for="(location, index) in scriptLocations"
									:key="'location-' + index"
									variant="flat"
									:color="location.isScouted ? 'green' : 'green-lighten-4'"
									:class="{
										'completed-chip': location.isScouted,
										'incomplete-chip': !location.isScouted,
									}"
									size="small"
									class="ma-1"
								>
									{{ location.name }}
								</v-chip>
							</div>
						</v-col>
						<v-col>
							<v-chip color="blue-darken-2"
								>{{ madeCostumesCount }}/{{ costumeGoal }}</v-chip
							><span>Costumes</span>
							<div class="resource-chips">
								<v-chip
									v-for="(costume, index) in scriptCostumes"
									:key="'costume-' + index"
									variant="flat"
									:color="costume.isMade ? 'blue' : 'blue-lighten-4'"
									:class="{
										'completed-chip': costume.isMade,
										'incomplete-chip': !costume.isMade,
									}"
									size="small"
									class="ma-1"
								>
									{{ costume.name }} ({{ costume.role }})
								</v-chip>
							</div>
						</v-col>
						<v-col>
							<v-chip color="indigo-darken-2"
								>{{ styledLooksCount }}/{{ lookGoal }}</v-chip
							>
							<span>Looks</span>
							<div class="resource-chips">
								<v-chip
									v-for="(look, index) in scriptLooks"
									:key="'look-' + index"
									variant="flat"
									:color="look.isDesigned ? 'indigo' : 'indigo-lighten-4'"
									:class="{
										'completed-chip': look.isDesigned,
										'incomplete-chip': !look.isDesigned,
									}"
									size="small"
									class="ma-1"
								>
									{{ look.name }} ({{ look.role }})
								</v-chip>
							</div>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="1" class="d-flex align-center justify-center">
					<v-progress-circular
						:model-value="totalProgress"
						:size="70"
						:width="10"
					></v-progress-circular>
				</v-col>
			</v-row>
		</v-container>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	props: {
		actorSparkleIsActive: Boolean,
	},
	data() {
		return {
			showActorSparkle: false,
		};
	},
	watch: {
		actorSparkleIsActive: {
			handler(newVal) {
				this.$nextTick(() => {
					this.showActorSparkle = newVal;
				});
			},
			immediate: true,
		},
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
	computed: {
		...mapGetters({
			title: "scriptTitle",
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
			scriptRoles: "scriptRoles",
			scriptShots: "scriptShots",
			scriptSets: "scriptSets",
			scriptLocations: "scriptLocations",
			scriptCostumes: "scriptCostumes",
			scriptLooks: "scriptLooks",
		}),
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
		handleAnimationEnd() {
			this.$nextTick(() => {
				this.showActorSparkle = false;
				this.$emit("animation-complete");
			});
		},
	},
};
</script>

<style scoped>
.v-chip {
	font-family: Roboto;
	font-size: 16px;
}

span {
	font-family: Roboto;
	font-size: 16px;
	text-transform: capitalize;
}

.sparkle {
	animation: bounce 1s linear;
	font-size: 24px;
}

.resource-chips {
	margin-top: 8px;
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	justify-content: center;
}

.resource-chips .v-chip {
	font-size: 12px;
}

.completed-chip {
	color: white !important;
	font-weight: 500;
}

.incomplete-chip {
	color: rgba(0, 0, 0, 0.87) !important;
}

.v-chip.completed-chip {
	opacity: 1 !important;
}

@keyframes bounce {
	0% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-40px);
	}
	100% {
		transform: translateY(0);
		opacity: 0;
	}
}
</style>
