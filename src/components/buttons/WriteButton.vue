<template>
	<div style="width: 100%" align="center">
		<v-btn
			:ripple="false"
			@mouseup="increaseWordCount"
			class="write-tool-button d-flex flex-column mx-auto"
		>
			<v-col>
				<h3 class="py-2">{{ previousToolDetails.name }}</h3>
				<span class="py-1" style="font-size: 4em">{{
					previousToolDetails.emoji
				}}</span>
				<br />
				<span class="py-2"
					>{{ $formatNumber(previousToolDetails.wordsPerClick) }} words per
					click</span
				>
			</v-col>
		</v-btn>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
	methods: {
		...mapActions(["increaseWordCount"]),
	},
	computed: {
		...mapGetters(["previousToolDetails"]),
	},
};
</script>

<style scoped>
.write-tool-button {
	border-radius: 12px;
	width: 90%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: hsl(34, 100%, 89%);
}

.write-tool-button:active {
	background-color: hsl(34, 100%, 69%); /* Darken the color more */
}
</style>
