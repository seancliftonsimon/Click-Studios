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
				<div>{{ smallInvestorName }}</div>
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
		}),
		fundingMin() {
			return this.smallInvestorPayRange[0];
		},
		fundingMax() {
			return this.smallInvestorPayRange[1];
		},
		smallInvestorName() {
			const randomIndex = Math.floor(
				Math.random() * this.smallInvestorNames.length
			);
			return this.smallInvestorNames[randomIndex];
		},
		fundingAmt() {
			return (
				Math.floor(
					Math.random() *
						(this.smallInvestorPayRange[1] - this.smallInvestorPayRange[0] + 1)
				) + this.smallInvestorPayRange[0]
			);
		},
	},
	methods: {
		...mapMutations(["UPDATE_STATE_VARIABLE"]),
		nextCard() {
			this.UPDATE_STATE_VARIABLE({
				key: "currentInvestor",
				value: this.smallInvestorName,
			});
			this.UPDATE_STATE_VARIABLE({
				key: "currentInvestment",
				value: this.fundingAmt,
			});
			console.log("current Investment now set: ")
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
