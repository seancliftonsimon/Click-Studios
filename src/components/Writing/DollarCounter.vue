<template>
	<v-card
		class="center-content resource-counter"
		:class="{ 'resource-counter-pop': isPopping }"
		data-guidance-target="money-counter"
	>
		<span class="dollar-counter">${{ $formatNumber(writingDollarCount) }}</span>
		<span
			v-if="floatingAmount"
			:key="floatingKey"
			class="resource-float money-float"
		>
			+${{ $formatNumber(floatingAmount) }}
		</span>
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
			writingDollarCount: "writingDollarCount",
			writingDollarBurst: "writingDollarBurst",
		}),
	},
	watch: {
		"writingDollarBurst.id"() {
			if (!this.writingDollarBurst.amount) {
				return;
			}

			if (this.popTimeout) {
				window.clearTimeout(this.popTimeout);
			}

			this.floatingAmount = this.writingDollarBurst.amount;
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
}

.resource-counter-pop {
	animation: resource-counter-pop 0.34s ease-out;
}

.resource-float {
	font-family: Roboto, sans-serif;
	font-size: 0.95rem;
	font-weight: 800;
	left: 50%;
	pointer-events: none;
	position: absolute;
	top: 18px;
	transform: translateX(-50%);
	animation: resource-float-up 0.65s ease-out forwards;
}

.money-float {
	color: #2ebd4f;
}

.dollar-counter {
	color: #4caf50;
	font-family: Roboto, sans-serif;
	font-size: 22px;
	font-weight: 600;
}

.center-content {
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
}

@keyframes resource-counter-pop {
	0% {
		transform: scale(1);
	}
	45% {
		box-shadow: 0 8px 20px rgba(46, 189, 79, 0.22);
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
