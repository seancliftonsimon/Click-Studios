<!-- Word Counter-->
<template>
	<v-card
		class="center-content pt-3 resource-counter"
		:class="{ 'resource-counter-pop': isPopping }"
		data-guidance-target="word-counter"
	>
		<span class="word-display">{{ $formatNumber(wordCount) }} words</span>
		<span
			v-for="float in floatingBursts"
			:key="float.id"
			class="resource-float word-float"
			:style="float.style"
		>
			+{{ $formatNumber(float.amount) }}
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
			floatingBursts: [],
			nextFloatId: 1,
			floatTimeouts: [],
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

			this.addFloatingBurst(this.manualWordBurst.amount);
			this.isPopping = false;

			this.$nextTick(() => {
				this.isPopping = true;
			});

			this.popTimeout = window.setTimeout(() => {
				this.isPopping = false;
				this.popTimeout = null;
			}, 650);
		},
	},
	methods: {
		addFloatingBurst(amount) {
			const id = this.nextFloatId++;
			const x = this.randomBetween(35, 65);
			const startY = this.randomBetween(-24, -8);
			const drift = this.randomBetween(-18, 18);
			const rise = this.randomBetween(38, 58);
			const rotation = this.randomBetween(-8, 8);

			this.floatingBursts.push({
				id,
				amount,
				style: {
					left: `${x}%`,
					top: `${startY}px`,
					"--float-drift": `${drift}px`,
					"--float-rise": `${rise}px`,
					"--float-rotation": `${rotation}deg`,
				},
			});

			const timeoutId = window.setTimeout(() => {
				this.floatingBursts = this.floatingBursts.filter(
					(float) => float.id !== id
				);
				this.floatTimeouts = this.floatTimeouts.filter(
					(timeout) => timeout !== timeoutId
				);
			}, 760);

			this.floatTimeouts.push(timeoutId);
		},
		randomBetween(min, max) {
			return Math.round(min + Math.random() * (max - min));
		},
	},
	beforeUnmount() {
		if (this.popTimeout) {
			window.clearTimeout(this.popTimeout);
		}
		this.floatTimeouts.forEach((timeoutId) => {
			window.clearTimeout(timeoutId);
		});
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
	font-size: 1.45rem;
	font-weight: 800;
	pointer-events: none;
	position: absolute;
	text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9);
	transform: translate(-50%, 0) rotate(var(--float-rotation, 0deg));
	animation: resource-float-up 0.65s ease-out forwards;
	white-space: nowrap;
	z-index: 9999;
}

.word-float {
	color: #931621;
}

.word-display {
	font-family: "Roboto", sans-serif;
	font-size: 21px;
	color: #931621;
	font-weight: 600;
	line-height: 1.1;
	text-align: center;
	white-space: nowrap;
}

.wps-display {
	font-family: "Roboto";
	font-size: 16px;
	font-weight: 400;
	white-space: nowrap;
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
		transform: translate(-50%, 8px) rotate(var(--float-rotation, 0deg))
			scale(0.9);
	}
	20% {
		opacity: 1;
	}
	100% {
		opacity: 0;
		transform:
			translate(
				calc(-50% + var(--float-drift, 0px)),
				calc(-1 * var(--float-rise, 42px))
			)
			rotate(var(--float-rotation, 0deg))
			scale(1.08);
	}
}
</style>
