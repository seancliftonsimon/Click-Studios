<template>
	<!-- NOTE TO SELF XYZ this width below is just for testing and the container size should be set by the holder component-->
	<v-card class="text-center pa-3">
		<!-- H2: Investor Found! -->
		<h2>Investor Found!</h2>
		<!-- Container for Side-by-Side Sections -->
		<v-row no-gutters class="my-2 align=center">
			<!-- Emoji Section -->
			<v-col cols="4" class="text-center">
				<span role="img" class="investor-emoji" aria-label="Investor">👨‍💼</span>
			</v-col>
			<!-- Text Elements Section -->
			<v-col cols="8">
				<!-- Investor Name -->
				<div>{{ investorName }}</div>
				<!-- Funding Range -->
				<div>
					${{ $formatNumber(fundingMin) }} - ${{ $formatNumber(fundingMax) }}
				</div>
			</v-col>
		</v-row>
		<!-- Show progress bar when auto-pitching, button otherwise -->
		<div v-if="autoPitchEnabled" class="mt-2">
			<div class="text-subtitle-1 mb-1">Auto Pitching...</div>
			<v-progress-linear
				:model-value="pitchProgress"
				height="36"
				color="success"
				rounded
			>
				<template v-slot:default>Pitching...</template>
			</v-progress-linear>
		</div>
		<v-btn v-else color="success" @click="nextCard">Pitch Investor</v-btn>
	</v-card>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getInvestorTier } from "@/data/investors";
import { useGameClockStore } from "@/stores/gameClockStore";

export default {
	data() {
		return {
			pitchProgress: 0,
			unregisterTicker: null,
		};
	},
	computed: {
		...mapGetters({
			smallInvestorNames: "smallInvestorNames",
			smallInvestorPayRange: "smallInvestorPayRange",
			currentInvestorTier: "currentInvestorTier",
			autoPitchEnabled: "autoPitchEnabled",
		}),
		investorPool() {
			return getInvestorTier(this.currentInvestorTier).names;
		},
		investorPayRange() {
			return getInvestorTier(this.currentInvestorTier).payRange;
		},
		fundingMin() {
			return this.investorPayRange[0];
		},
		fundingMax() {
			return this.investorPayRange[1];
		},
		investorName() {
			// Make sure investorPool exists and has items
			if (!this.investorPool || this.investorPool.length === 0) {
				return "Unknown Investor";
			}

			const randomIndex = Math.floor(Math.random() * this.investorPool.length);
			return this.investorPool[randomIndex];
		},
		fundingAmt() {
			const min = this.investorPayRange[0] || 1000;
			const max = this.investorPayRange[1] || 5000;

			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		smallInvestorName() {
			if (!this.smallInvestorNames || this.smallInvestorNames.length === 0) {
				return "Unknown Investor";
			}

			const randomIndex = Math.floor(
				Math.random() * this.smallInvestorNames.length
			);
			return this.smallInvestorNames[randomIndex];
		},
		gameClockStore() {
			return useGameClockStore();
		},
	},
	methods: {
		...mapMutations(["UPDATE_STATE_VARIABLE"]),
		nextCard() {
			this.UPDATE_STATE_VARIABLE({
				key: "currentInvestor",
				value: this.investorName,
			});
			this.UPDATE_STATE_VARIABLE({
				key: "currentInvestment",
				value: this.fundingAmt,
			});
			console.log("current Investment now set: ");
			console.log(this.fundingAmt);
			/// XYZ ADD PAYOUT VALUE SETTING IN STATE HERE SO THAT THE PAY CARD CAN CALL IT AND REFERENCE IT!
			this.$emit("nextCard");
		},
		autoPitch(elapsedSeconds = 1) {
			if (!this.autoPitchEnabled) {
				this.pitchProgress = 0;
				return;
			}

			this.pitchProgress += elapsedSeconds * 100;
			if (this.pitchProgress >= 100) {
				this.pitchProgress = 0;
				this.nextCard();
			}
		},
	},
	mounted() {
		this.unregisterTicker = this.gameClockStore.registerTicker(
			"investor:autoPitch",
			this.autoPitch
		);
	},
	beforeUnmount() {
		if (this.unregisterTicker) {
			this.unregisterTicker();
			this.unregisterTicker = null;
		}
	},
};
</script>

<style scoped>
.investor-emoji {
	font-size: 4em;
}
</style>
