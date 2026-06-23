<template>
	<div class="write-button-wrap">
			<v-btn
				:ripple="false"
				@mouseup="handleClick"
				class="cs-button write-tool-button d-flex flex-column mx-auto"
				data-guidance-target="writing-tool-button"
			>
			<v-col>
				<h3 class="py-2">{{ previousToolDetails.name }}</h3>
				<span class="write-tool-emoji py-1">{{
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
import { mapState, mapActions } from "pinia";
import { useGameStore } from "@/store";

export default {
	methods: {
		...mapActions(useGameStore, ["increaseWordCount"]),
		handleClick() {
			// Call the original increaseWordCount action
			this.increaseWordCount();
		},
	},
	computed: {
		...mapState(useGameStore, ["previousToolDetails"]),
	},
};
</script>

<style scoped>
.write-button-wrap {
	text-align: center;
	width: 100%;
}

.write-tool-button {
	align-items: center;
	background: linear-gradient(
		180deg,
		var(--cs-color-white) 0%,
		var(--cs-color-ticket) 100%
	) !important;
	border: 1px solid var(--cs-color-line);
	box-shadow: 3px 3px 0 rgba(49, 59, 114, 0.14);
	color: var(--cs-color-ink) !important;
	display: flex;
	flex-direction: column;
	font-weight: 500 !important;
	height: 100%;
	justify-content: center;
	width: 90%;
}

.write-tool-button:active {
	background: var(--cs-color-popcorn) !important;
}

.write-tool-button h3 {
	font-family: var(--cs-font-display);
	font-size: 1.45rem;
	font-weight: 500;
}

.write-tool-button :deep(.v-btn__content) {
	font-weight: 500;
}

.write-tool-emoji {
	font-size: 4em;
}
</style>
