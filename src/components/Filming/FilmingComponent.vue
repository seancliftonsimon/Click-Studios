<!-- FilmingComponent.vue-->
<template>
	<v-container fluid class="phase-container bg-grey-lighten-2">
		<v-card class="fill-height center-content">
			<v-card-title> Filming </v-card-title>

			<!-- Add the shot timeline component at the top -->
			<v-row>
				<v-col>
					<ShotTimeline />
				</v-col>
			</v-row>

			<!-- Existing ViewFinder component -->
			<v-row>
				<v-col>
					<ViewFinder />
				</v-col>
			</v-row>
		</v-card>
	</v-container>
</template>

<script>
import ViewFinder from "./ViewFinder.vue";
import ShotTimeline from "./ShotTimeline.vue";

export default {
	components: {
		ViewFinder,
		ShotTimeline,
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
