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
				<!-- Investor Name - Updated to use investorName instead of smallInvestorName -->
				<div>{{ investorName }}</div>
				<!-- Funding Range -->
				<div>
					${{ $formatNumber(fundingMin) }} - ${{ $formatNumber(fundingMax) }}
				</div>
			</v-col>
		</v-row>
		<!-- Button: Pitch Investor -->
		<v-btn color="success" @click="nextCard">Pitch Investor</v-btn>
	</v-card>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
	computed: {
		...mapGetters({
			smallInvestorNames: "smallInvestorNames",
			smallInvestorPayRange: "smallInvestorPayRange",
			currentInvestorTier: "currentInvestorTier",
		}),
		investorPool() {
			// Make sure we have a valid tier
			const tier = this.currentInvestorTier || 1;
			
			switch (tier) {
				case 1:
					return this.$store.state.pools?.smallInvestors || [];
				case 2:
					return this.$store.state.pools?.mediumInvestors || [];
				case 3:
					return this.$store.state.pools?.largeInvestors || [];
				case 4:
					return this.$store.state.pools?.veryLargeInvestors || [];
				case 5:
					return this.$store.state.pools?.whaleInvestors || [];
				default:
					return this.$store.state.pools?.smallInvestors || [];
			}
		},
		investorPayRange() {
			// Make sure we have a valid tier
			const tier = this.currentInvestorTier || 1;
			
			switch (tier) {
				case 1:
					return this.$store.state.ranges?.smallInvestorPayAmount || [1000, 5000];
				case 2:
					return this.$store.state.ranges?.mediumInvestorPayAmount || [5000, 20000];
				case 3:
					return this.$store.state.ranges?.largeInvestorPayAmount || [20000, 100000];
				case 4:
					return this.$store.state.ranges?.veryLargeInvestorPayAmount || [100000, 500000];
				case 5:
					return this.$store.state.ranges?.whaleInvestorPayAmount || [500000, 2000000];
				default:
					return this.$store.state.ranges?.smallInvestorPayAmount || [1000, 5000];
			}
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
	},
};
</script>

<style scoped>
.investor-emoji {
	font-size: 4em;
}
</style>
