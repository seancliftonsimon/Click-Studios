<template>
	<v-card>
		<v-container fluid class="d-flex flex-column px-8">
			<h3>{{ title }} Preproduction Progress</h3>
			<v-row justify="space-between" align="center">
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
				</v-col>
				<v-col>
					<v-chip color="orange-darken-2"
						>{{ completeShotsCount }}/{{ shotGoal }}</v-chip
					><span>Shots</span>
				</v-col>
				<v-col>
					<v-chip color="grey-darken-4"
						>{{ builtSetsCount }}/{{ setGoal }}</v-chip
					>
					<span>Sets</span></v-col
				>
				<v-col
					><v-chip color="green-darken-2"
						>{{ scoutedLocationsCount }}/{{ locationGoal }}</v-chip
					><span>Locations</span>
				</v-col>
				<v-col>
					<v-chip color="blue-darken-2"
						>{{ madeCostumesCount }}/{{ costumeGoal }}</v-chip
					><span>Costumes</span></v-col
				>
				<v-col>
					<v-chip color="indigo-darken-2"
						>{{ styledLooksCount }}/{{ lookGoal }}</v-chip
					>
					<span>Looks</span>
				</v-col>
				<v-progress-circular
					:model-value="totalProgress"
					:size="70"
					:width="10"
				></v-progress-circular>
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
		actorSparkleIsActive(newVal) {
			this.showActorSparkle = newVal;
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
			this.showActorSparkle = false;
			this.$emit("animation-complete");
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
