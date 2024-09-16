<template>
	<v-card class="text-center pa-3" outlined>
		<!-- H2: Funding Received! -->
		<h2>Funding Received!</h2>
		<v-container>
			<span class="fundingAmount"
				>$ {{ $formatNumber(currentInvestment) }}</span
			>
		</v-container>
		<!-- Button: Pitch Investor -->
		<v-btn color="blue" class="mb-3" @click="nextCard">Collect</v-btn>
	</v-card>
</template>
<script>
import { mapGetters } from "vuex";

export default {
	computed: {
		...mapGetters(["currentInvestment"]),
	},
	methods: {
		nextCard() {
			this.$store.commit(
				"INCREASE_PREPRO_DOLLAR_AMOUNT",
				this.currentInvestment
			);
			console.log("increasing dollar amount by ");
			console.log(this.currentInvestment);
			this.$emit("nextCard");
		},
	},
};
</script>
<style scoped>
.fundingAmount {
	color: darkgreen;
	font-size: 3em;
	font-weight: bold;
}
</style>
