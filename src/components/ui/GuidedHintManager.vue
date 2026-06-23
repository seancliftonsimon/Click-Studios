<template>
	<div v-if="activeStep" class="guided-hint-layer">
		<div
			v-if="targetRect"
			class="guided-hint-highlight"
			:style="highlightStyle"
		></div>
		<div class="guided-hint-card" :style="cardStyle">
			<div class="guided-hint-title">{{ activeStep.title }}</div>
			<p class="guided-hint-body">{{ activeStep.body }}</p>
			<div class="guided-hint-actions">
				<v-btn
					v-if="activeStep.group === 'core'"
					variant="text"
					size="small"
					class="guided-hint-skip"
					@click="skipCoreTutorial"
				>
					Skip tutorial
				</v-btn>
				<v-spacer></v-spacer>
				<v-btn
					size="small"
					class="cs-button cs-button-primary guided-hint-button"
					@click="completeActiveStep"
				>
					Got it
				</v-btn>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useGuidanceStore } from "@/stores/guidanceStore";

export default {
	name: "GuidedHintManager",
	data() {
		return {
			targetRect: null,
			targetRefreshInterval: null,
		};
	},
	computed: {
		...mapState(useGuidanceStore, ["activeStep"]),
		highlightStyle() {
			if (!this.targetRect) {
				return {};
			}

			return {
				left: `${this.targetRect.left - 8}px`,
				top: `${this.targetRect.top - 8}px`,
				width: `${this.targetRect.width + 16}px`,
				height: `${this.targetRect.height + 16}px`,
			};
		},
		cardStyle() {
			if (!this.targetRect) {
				return {
					left: "50%",
					top: "160px",
					transform: "translateX(-50%)",
				};
			}

			const gap = 14;
			const maxWidth = 320;
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			let left = this.targetRect.left;
			let top = this.targetRect.bottom + gap;

			if (this.activeStep.placement === "top") {
				top = this.targetRect.top - gap;
			} else if (this.activeStep.placement === "left") {
				left = this.targetRect.left - maxWidth - gap;
				top = this.targetRect.top + this.targetRect.height / 2;
			} else if (this.activeStep.placement === "right") {
				left = this.targetRect.right + gap;
				top = this.targetRect.top + this.targetRect.height / 2;
			}

			if (this.activeStep.placement === "left" || this.activeStep.placement === "right") {
				top -= 80;
			}

			left = Math.min(Math.max(16, left), viewportWidth - maxWidth - 16);
			top = Math.min(Math.max(16, top), viewportHeight - 180);

			return {
				left: `${left}px`,
				top: `${top}px`,
				maxWidth: `${maxWidth}px`,
			};
		},
	},
	watch: {
		activeStep() {
			this.$nextTick(this.updateTargetRect);
		},
	},
	mounted() {
		window.addEventListener("resize", this.updateTargetRect);
		window.addEventListener("scroll", this.updateTargetRect, true);
		this.targetRefreshInterval = window.setInterval(this.updateTargetRect, 250);
		this.updateTargetRect();
	},
	beforeUnmount() {
		window.removeEventListener("resize", this.updateTargetRect);
		window.removeEventListener("scroll", this.updateTargetRect, true);
		if (this.targetRefreshInterval) {
			window.clearInterval(this.targetRefreshInterval);
		}
	},
	methods: {
		...mapActions(useGuidanceStore, [
			"completeActiveStep",
			"skipCoreTutorial",
		]),
		updateTargetRect() {
			if (!this.activeStep?.target) {
				this.targetRect = null;
				return;
			}

			const target = document.querySelector(
				`[data-guidance-target="${this.activeStep.target}"]`
			);
			if (!target) {
				this.targetRect = null;
				return;
			}

			const rect = target.getBoundingClientRect();
			this.targetRect = {
				left: rect.left,
				top: rect.top,
				right: rect.right,
				bottom: rect.bottom,
				width: rect.width,
				height: rect.height,
			};
		},
	},
};
</script>

<style scoped>
.guided-hint-layer {
	position: fixed;
	inset: 0;
	z-index: 1002;
	pointer-events: none;
}

.guided-hint-highlight {
	position: fixed;
	border: 2px solid var(--cs-color-gold);
	border-radius: var(--cs-radius-panel);
	box-shadow:
		0 0 0 9999px rgba(20, 12, 16, 0.18),
		0 0 18px rgba(250, 208, 28, 0.6);
	transition: all var(--cs-motion-medium);
	pointer-events: none;
}

.guided-hint-card {
	position: fixed;
	background: var(--cs-color-ticket);
	border: 1px solid rgba(147, 22, 33, 0.18);
	border-radius: var(--cs-radius-panel);
	box-shadow: var(--cs-shadow-soft);
	color: var(--cs-color-ink);
	padding: 14px 16px 12px;
	pointer-events: auto;
	transition: all var(--cs-motion-medium);
}

.guided-hint-title {
	font-family: var(--cs-font-display);
	font-size: 1.05rem;
	font-weight: 800;
	margin-top: 0;
}

.guided-hint-body {
	font-size: 0.92rem;
	line-height: 1.35;
	margin: 5px 0 10px;
}

.guided-hint-actions {
	align-items: center;
	display: flex;
	gap: 8px;
}

.guided-hint-skip {
	color: var(--cs-color-muted);
}

.guided-hint-button {
	font-weight: 700;
}
</style>
