<template>
	<v-container>
		<h2>Filming Component</h2>
		<v-card style="max-width: 400px; background-color: palegoldenrod">
			<v-card-title> FILMING STUFF </v-card-title>
		</v-card>
		<ViewFinder />
	</v-container>
</template>

<script>
import ViewFinder from "./Filming/ViewFinder.vue";

export default {
	components: {
		ViewFinder,
	},
};
</script>
