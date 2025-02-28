<template>
	<v-card class="center-content">
		<span class="dollar-counter">${{ $formatNumber(writingDollarCount) }}</span>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	computed: {
		...mapGetters({
			writingDollarCount: "writingDollarCount",
		}),
	},
};
</script>

<style>
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
