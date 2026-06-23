<!-- FilmingComponent.vue-->
<template>
	<v-container fluid class="phase-container">
		<v-card class="cs-panel fill-height center-content">
			<v-card-title class="d-flex flex-wrap align-center justify-space-between">
				<span class="cs-panel-title"
					>Filming {{ scriptTitle ? `: ${scriptTitle}` : "" }}</span
				>
				<span class="text-subtitle-1">
					{{ filmedShotsCount }}/{{ filmingShotGoal }} shots wrapped
					<span v-if="averageFilmingScore">
						| Avg. {{ averageFilmingScore }}%
					</span>
				</span>
			</v-card-title>

			<!-- Add the shot timeline component at the top -->
			<v-row>
				<v-col>
					<ShotTimeline :shots="filmingShots" />
				</v-col>
			</v-row>

			<!-- Existing ViewFinder component -->
			<v-row>
				<v-col>
					<ViewFinder
						:current-shot="currentFilmingShot"
						:is-complete="filmedShotsCount >= filmingShotGoal"
						@shot-wrapped="wrapShot"
					/>
				</v-col>
			</v-row>
		</v-card>
	</v-container>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useGameStore } from "@/store";
import ViewFinder from "./ViewFinder.vue";
import ShotTimeline from "./ShotTimeline.vue";

export default {
	components: {
		ViewFinder,
		ShotTimeline,
	},
	computed: {
		...mapState(useGameStore, [
			"scriptTitle",
			"filmingShots",
			"filmingShotGoal",
			"filmedShotsCount",
			"currentFilmingShot",
			"averageFilmingScore",
		]),
	},
	methods: {
		...mapActions(useGameStore, ["wrapCurrentShot", "showDevelopmentEndpoint"]),
		wrapShot({ score }) {
			this.wrapCurrentShot(score);
		},
	},
	mounted() {
		if (this.filmingShotGoal > 0 && this.filmedShotsCount >= this.filmingShotGoal) {
			this.showDevelopmentEndpoint();
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
</style>
