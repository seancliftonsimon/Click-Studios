<!-- Word Counter-->
<template>
	<v-card
		class="center-content pt-3 resource-counter"
		:class="{ 'resource-counter-pop': isPopping }"
		data-guidance-target="word-counter"
	>
		<span class="word-display">{{ $formatNumber(wordCount) }} words</span>
		<span
			v-if="floatingAmount"
			:key="floatingKey"
			class="resource-float word-float"
		>
			+{{ $formatNumber(floatingAmount) }}
		</span>
		<span class="wps-display"
			>+{{ $formatNumber(wordsPerSecond) }} words per second</span
		>
	</v-card>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";

export default {
	data() {
		return {
			isPopping: false,
			floatingAmount: 0,
			floatingKey: 0,
			popTimeout: null,
		};
	},
	computed: {
		...mapState(useGameStore, {
			wordCount: "wordCount",
			wordsPerSecond: "wordsPerSecond",
			manualWordBurst: "manualWordBurst",
		}),
	},
	watch: {
		"manualWordBurst.id"() {
			if (!this.manualWordBurst.amount) {
				return;
			}

			if (this.popTimeout) {
				window.clearTimeout(this.popTimeout);
			}

			this.floatingAmount = this.manualWordBurst.amount;
			this.floatingKey += 1;
			this.isPopping = false;

			this.$nextTick(() => {
				this.isPopping = true;
			});

			this.popTimeout = window.setTimeout(() => {
				this.isPopping = false;
				this.floatingAmount = 0;
				this.popTimeout = null;
			}, 650);
		},
	},
	beforeUnmount() {
		if (this.popTimeout) {
			window.clearTimeout(this.popTimeout);
		}
	},
};
</script>

<style scoped>
.resource-counter {
	overflow: visible;
	position: relative;
	transform-origin: center;
	transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.resource-counter-pop {
	animation: resource-counter-pop 0.34s ease-out;
}

.resource-float {
	font-family: "Roboto", sans-serif;
	font-size: 0.95rem;
	font-weight: 800;
	left: 50%;
	pointer-events: none;
	position: absolute;
	top: 16px;
	transform: translateX(-50%);
	animation: resource-float-up 0.65s ease-out forwards;
}

.word-float {
	color: #931621;
}

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

@keyframes resource-counter-pop {
	0% {
		transform: scale(1);
	}
	45% {
		box-shadow: 0 8px 20px rgba(147, 22, 33, 0.2);
		transform: scale(1.06);
	}
	100% {
		transform: scale(1);
	}
}

@keyframes resource-float-up {
	0% {
		opacity: 0;
		transform: translate(-50%, 8px) scale(0.9);
	}
	20% {
		opacity: 1;
	}
	100% {
		opacity: 0;
		transform: translate(-50%, -28px) scale(1.08);
	}
}
</style>
