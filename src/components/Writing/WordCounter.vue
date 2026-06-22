<!-- Word Counter-->
<template>
	<v-card class="center-content pt-3">
		<span class="word-display">{{ $formatNumber(wordCount) }} words</span>
		<span class="wps-display"
			>+{{ $formatNumber(wordsPerSecond) }} words per second</span
		>
	</v-card>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";

export default {
	computed: {
		...mapState(useGameStore, {
			wordCount: "wordCount",
			wordsPerSecond: "wordsPerSecond",
		}),
	},
};
</script>

<style scoped>
.word-display {
	font-family: "Roboto", sans-serif;
	font-size: 22px;
	color: #931621;
	font-weight: 600;
	text-align: center;
}

.wps-display {
	font-family: "Roboto";
	font-size: 18px;
	font-weight: 400;
}

.center-content {
	height: 100px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center; /* Horizontally center the content */
}
</style>
