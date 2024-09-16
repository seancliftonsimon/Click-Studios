<!-- WritingToolCard -->

<template>
	<v-card rounded-s-xl elevation="2" v-if="isVisible" class="tool-card">
		<transition name="slide">
			<v-row align="center">
				<v-col cols="5" class="d-flex flex-column justify-center align-center">
					<h3 style="text-transform: uppercase" class="py-3 ml-3">
						{{ title }}
					</h3>
					<span style="font-size: 3em">{{ emoji }}</span>
				</v-col>
				<v-col cols="7" class="d-flex flex-column justify-space-between">
					<!-- Use text prop here -->
					<v-card-text
						style="text-transform: uppercase"
						class="wpc-text my-auto"
						>{{ $formatNumber(wordsPerClick) }} words per click</v-card-text
					>
					<v-card-actions class="px-4 pb-4">
						<v-btn
							block
							class="spend-money-btn"
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
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			showBody: true,
		};
	},
	name: "WritingToolCard",
	computed: {
		...mapGetters({
			currentToolDetails: "currentToolDetails", // Adjust according to the correct namespace if needed
		}),
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
			return this.$store.state.writingDollarCount >= this.cost;
		},
		isVisible() {
			return this.cost !== 0 && this.$store.state.writingToolCardVisible;
		},
	},
	methods: {
		handlePurchase() {
			const { cost, wordsPerClick } = this.currentToolDetails; // Assuming these are derived from your component's computed properties or props
			this.$store.dispatch("purchaseTool", { cost, wordsPerClick });
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

.wpc-text {
	font-family: "Roboto";
	font-weight: 500;
	font-size: 14px;
}
</style>
