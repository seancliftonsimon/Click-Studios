<template>
	<v-card
		class="mx-auto mb-4"
		:class="{ 'tier-upgrade-pulse': isUpgrading }"
		shaped
		elevation="2"
		style="border-radius: 12px"
		v-if="isProductVisible"
		data-guidance-target="story-product-card"
	>
		<v-row justify="space-between" class="flex-nowrap">
			<div style="font-size: 52px" class="ma-auto pa-3">{{ emoji }}</div>
			<div class="product-copy flex-grow-1">
				<div class="tier-pips" :aria-label="tierLabel">
					<span
						v-for="pip in productTierTotal"
						:key="pip"
						class="tier-pip"
						:class="{ 'tier-pip-active': pip <= productTierNumber }"
					></span>
				</div>
				<div class="product-name">{{ title }}</div>
			</div>
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
							<span style="color: black; font-weight: medium">
								Use {{ $formatNumberShort(cost) }} words
							</span>
						</v-btn>
					</v-card-actions>
					<span class="product-pay mt-2">{{ saleResultLabel }}</span>
				</v-col>
			</div>
		</v-row>
	</v-card>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";

export default {
	name: "PurchaseCard",
	props: {
		cardType: String,
	},
	data() {
		return {
			showBody: true,
			isUpgrading: false,
			upgradeAnimationTimeout: null,
		};
	},
	computed: {
		...mapState(useGameStore, {
			getProductCardDetails: "getProductCardDetails",
			writingProductTierOrder: "writingProductTierOrder",
			wordCount: "wordCount",
		}),
		productDetails() {
			return this.getProductCardDetails(this.cardType);
		},
		title() {
			return this.productDetails ? this.productDetails.title : "";
		},
		emoji() {
			return this.productDetails ? this.productDetails.emoji : "";
		},
		text() {
			return this.productDetails ? this.productDetails.text : "";
		},
		cost() {
			return this.productDetails ? this.productDetails.cost : 0;
		},
		pay() {
			return this.productDetails ? this.productDetails.pay : 0;
		},
		canSell() {
			return this.wordCount >= this.cost;
		},
		isProductVisible() {
			return Boolean(this.productDetails?.visible);
		},
		isCapstoneProduct() {
			return this.cardType === "shootingScript";
		},
		productTierNumber() {
			return this.writingProductTierOrder.indexOf(this.cardType) + 1;
		},
		productTierTotal() {
			return this.writingProductTierOrder.length;
		},
		tierLabel() {
			return `${this.title} is upgrade ${this.productTierNumber} of ${this.productTierTotal}`;
		},
		saleResultLabel() {
			if (this.isCapstoneProduct) {
				return `PAYS $${this.$formatNumber(
					this.pay
				)} + UNLOCKS PREPRODUCTION`;
			}
			return `PAYS $${this.$formatNumber(this.pay)}`;
		},
	},
	watch: {
		cardType() {
			this.triggerUpgradeAnimation();
		},
	},
	mounted() {
		this.triggerUpgradeAnimation();
	},
	beforeUnmount() {
		if (this.upgradeAnimationTimeout) {
			window.clearTimeout(this.upgradeAnimationTimeout);
		}
	},
	methods: {
		makeSale(cost, pay) {
			if (this.canSell) {
				useGameStore().sellProduct({
					cardType: this.cardType,
					cost,
					pay,
				});
			}
		},
		triggerUpgradeAnimation() {
			if (this.upgradeAnimationTimeout) {
				window.clearTimeout(this.upgradeAnimationTimeout);
			}
			this.isUpgrading = true;
			this.upgradeAnimationTimeout = window.setTimeout(() => {
				this.isUpgrading = false;
				this.upgradeAnimationTimeout = null;
			}, 700);
		},
	},
};
</script>

<style>
.product-name {
	font-family: Roboto, sans-serif;
	font-size: 18px;
	font-weight: 500;
}

.product-copy {
	align-self: center;
}

.tier-pips {
	display: flex;
	gap: 4px;
	margin-bottom: 5px;
}

.tier-pip {
	border: 1px solid #931621;
	border-radius: 999px;
	height: 7px;
	width: 7px;
}

.tier-pip-active {
	background: #931621;
}

.product-pay {
	align-self: center;
	color: rgb(39, 193, 39);
	font-family: Roboto, sans-serif;
	font-size: 0.9em;
	font-weight: 500;
}

.tier-upgrade-pulse {
	animation: tier-upgrade-pulse 0.7s ease-out;
}

@keyframes tier-upgrade-pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.65);
		transform: scale(0.98);
	}
	55% {
		box-shadow: 0 0 0 8px rgba(255, 193, 7, 0.18);
		transform: scale(1.02);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
		transform: scale(1);
	}
}

.slide-enter-active,
.slide-leave-active {
	transition: max-height 0.5s ease;
}

.slide-enter,
.slide-leave-to {
	max-height: 0;
}
</style>
