<!-- WritingToolCard -->

<template>
		<v-card
			elevation="2"
			v-if="isVisible"
			class="cs-panel tool-card"
			data-guidance-target="writing-tool-upgrade-card"
		>
		<transition name="slide">
			<v-row align="center">
				<v-col cols="5" class="d-flex flex-column justify-center align-center">
					<h3 class="tool-title py-3 ml-3">
						{{ title }}
					</h3>
					<span class="tool-emoji">{{ emoji }}</span>
				</v-col>
				<v-col cols="7" class="d-flex flex-column justify-space-between">
					<!-- Use text prop here -->
					<v-card-text
						class="wpc-text my-auto"
						>{{ $plural(wordsPerClick, "word") }} per click</v-card-text
					>
					<v-card-actions class="px-4 pb-4">
						<v-btn
							block
							class="cs-button spend-money-btn"
							@click="handlePurchase"
							:class="{ inactive: !canAfford }"
							:disabled="!canAfford"
						>
							<!-- Use cost prop here -->
							<strong>Pay ${{ $formatNumber(cost) }}</strong>
						</v-btn>
					</v-card-actions>
				</v-col>
			</v-row>
		</transition>
	</v-card>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";

export default {
	data() {
		return {
			showBody: true,
		};
	},
	name: "WritingToolCard",
	computed: {
		...mapState(useGameStore, {
			currentToolDetails: "currentToolDetails", // Adjust according to the correct namespace if needed
		}),
		...mapState(useGameStore, ["canAffordTool", "isToolVisible"]),
		title() {
			return this.currentToolDetails?.name || "No Tool Available";
		},
		emoji() {
			return this.currentToolDetails?.emoji || "";
		},
		wordsPerClick() {
			return this.currentToolDetails?.wordsPerClick || 0;
		},
		cost() {
			return this.currentToolDetails?.cost || 0;
		},

		canAfford() {
			return this.canAffordTool(this.cost);
		},
		isVisible() {
			return this.isToolVisible(this.cost);
		},
	},
	methods: {
		handlePurchase() {
			const { cost, wordsPerClick } = this.currentToolDetails; // Assuming these are derived from your component's computed properties or props
			useGameStore().purchaseTool({ cost, wordsPerClick });
		},
	},
};
</script>

<style scoped>
/* Add transition styles for the slide effect */
.slide-enter-active,
.slide-leave-active {
	transition: max-height 0.5s ease;
}
.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
	max-height: 0;
}

.transparent-button {
	background-color: transparent !important;
	color: white !important;
}

.tool-card {
	width: 100%;
}

.tool-title {
	font-family: var(--cs-font-display);
	text-transform: uppercase;
}

.tool-emoji {
	font-size: 3em;
}

.wpc-text {
	font-family: var(--cs-font-body);
	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;
}

/* Compact the next-tool card on phones so it doesn't push the rest of the
   writing screen down. */
@media (max-width: 600px) {
	.tool-emoji {
		font-size: 1.9em;
	}

	.tool-title {
		padding-top: 6px !important;
		padding-bottom: 6px !important;
		font-size: 1rem;
	}

	.tool-card .wpc-text {
		padding-top: 4px;
		padding-bottom: 4px;
	}

	.tool-card .v-card-actions {
		padding-bottom: 10px !important;
	}
}
</style>
