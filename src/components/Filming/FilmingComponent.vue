<!-- FilmingComponent.vue-->
<template>
	<v-container fluid class="phase-container bg-grey-lighten-2">
		<v-card class="fill-height center-content">
			<v-card-title> Filming </v-card-title>
			<ViewFinder />
		</v-card>
	</v-container>
</template>

<script>
import ViewFinder from "./ViewFinder.vue";

export default {
	components: {
		ViewFinder,
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
