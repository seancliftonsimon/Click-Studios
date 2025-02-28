<template>
	<v-card
		class="mx-auto mb-4"
		shaped
		elevation="2"
		style="border-radius: 12px"
		v-if="isProductVisible"
	>
		<v-row justify="space-between" class="flex-nowrap">
			<div style="font-size: 52px" class="ma-auto pa-3">{{ emoji }}</div>
			<div class="product-name flex-grow-1">{{ title }}</div>
			<div class="pr-3 pt-2 pb-2">
				<v-col
					class="d-flex flex-column justify-space-between my-1"
					style="max-width: 170px"
				>
					<v-card-actions>
						<v-btn
							class="spend-words-btn"
							:class="{ inactive: !canSell }"
							:disabled="!canSell"
							:ripple="false"
							@click="makeSale(cost, pay)"
						>
							<!-- Use cost prop here -->
							<span style="color: black; font-weight: medium"
								>Use {{ $formatNumberShort(cost) }} words</span
							>
						</v-btn>
					</v-card-actions>
					<span class="product-pay mt-2"> PAYS ${{ $formatNumber(pay) }} </span>
				</v-col>
			</div>
		</v-row>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	props: {
		cardType: String,
	},
	data() {
		return {
			showBody: true,
		};
	},
	name: "PurchaseCard",
	computed: {
		...mapGetters({
			getProductCardDetails: "getProductCardDetails",
			wordCount: "wordCount",
		}),
		title() {
			const details = this.getProductCardDetails(this.cardType);
			return details ? details.title : "";
		},
		emoji() {
			const details = this.getProductCardDetails(this.cardType);
			return details ? details.emoji : "";
		},
		text() {
			const details = this.getProductCardDetails(this.cardType);
			return details ? details.text : "";
		},
		cost() {
			const details = this.getProductCardDetails(this.cardType);
			return details ? details.cost : 0;
		},
		pay() {
			const details = this.getProductCardDetails(this.cardType);
			return details ? details.pay : 0;
		},
		canSell() {
			return this.wordCount >= this.cost; // Use mapped "wordCount" directly
		},
		isProductVisible() {
			return this.getProductCardDetails(this.cardType).visible;
		},
	},
	methods: {
		makeSale(cost, pay) {
			if (this.canSell) {
				this.$store.dispatch("sellProduct", {
					cardType: this.cardType,
					cost,
					pay,
				});
			}
		},
	},
};
</script>

<style>
.product-name {
	align-self: center;
	font-family: Roboto;
	font-size: 18px;
	font-weight: 500;
}

.product-pay {
	align-self: center;
	font-family: Roboto;
	font-size: 1em;
	font-weight: 500;
	color: rgb(39, 193, 39);
}
/* Add transition styles for the slide effect */
.slide-enter-active,
.slide-leave-active {
	transition: max-height 0.5s ease;
}
.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
	max-height: 0;
}
</style>
