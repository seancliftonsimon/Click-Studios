<template>
	<v-card
		class="cs-panel mx-auto mb-4 product-card"
		:class="{ 'tier-upgrade-pulse': isUpgrading }"
		elevation="2"
		v-if="isProductVisible"
		data-guidance-target="story-product-card"
	>
		<v-row justify="space-between" class="product-card-row" no-gutters>
			<div class="product-emoji ma-auto pa-3">{{ emoji }}</div>
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
			<div class="product-action-wrap pr-3 pt-2 pb-2">
				<v-col
					class="d-flex flex-column justify-space-between my-1 product-actions"
				>
					<v-card-actions>
						<v-btn
							class="cs-button spend-words-btn"
							:class="{ inactive: !canSell }"
							:disabled="!canSell"
							:ripple="false"
							@click="makeSale(cost, pay)"
						>
							<span>Use {{ $formatNumberShort(cost) }} words</span>
						</v-btn>
					</v-card-actions>
					<span class="product-pay mt-2">{{ saleResultLabel }}</span>
				</v-col>
			</div>
		</v-row>
		<v-row
			v-if="nextProductTierReady"
			justify="center"
			class="advance-row ma-0 pb-3 px-3"
		>
			<v-btn
				class="cs-button cs-button-primary advance-btn"
				block
				:ripple="false"
				@click="advance"
			>
				Advance to {{ nextProductTitle }} →
			</v-btn>
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
			nextProductTierReady: "nextProductTierReady",
			nextProductTierKey: "nextProductTierKey",
		}),
		nextProductTitle() {
			const details = this.nextProductTierKey
				? this.getProductCardDetails(this.nextProductTierKey)
				: null;
			return details ? details.title : "";
		},
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
		advance() {
			useGameStore().advanceWritingProductTier();
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
.product-card {
	border-color: rgba(147, 22, 33, 0.42);
	container-type: inline-size;
}

.product-card-row {
	align-items: center;
	flex-wrap: wrap;
	margin: 0;
	row-gap: 4px;
}

.product-emoji {
	font-size: 52px;
	line-height: 1;
}

.product-name {
	font-family: var(--cs-font-body);
	font-size: 18px;
	font-weight: 500;
	line-height: 1.2;
}

.product-copy {
	align-self: center;
	min-width: 82px;
}

.tier-pips {
	display: flex;
	gap: 4px;
	margin-bottom: 5px;
}

.tier-pip {
	border: 1px solid var(--cs-color-curtain);
	border-radius: 999px;
	height: 7px;
	width: 7px;
}

.tier-pip-active {
	background: var(--cs-color-curtain);
}

.product-pay {
	align-self: center;
	color: var(--cs-color-success);
	font-family: var(--cs-font-body);
	font-size: 0.9em;
	font-weight: 500;
	line-height: 1.2;
	text-align: center;
}

.advance-btn {
	font-weight: 500;
	letter-spacing: 0.3px;
	text-transform: none;
}

.product-actions {
	max-width: 170px;
	min-width: 0;
	padding: 0;
	width: 100%;
}

.product-actions .v-card-actions {
	min-height: 0;
	padding: 0;
}

.product-actions .v-btn {
	min-width: 0;
	white-space: normal;
	width: 100%;
}

.product-actions .v-btn span {
	line-height: 1.15;
	overflow-wrap: anywhere;
	text-align: center;
	white-space: normal;
}

.product-action-wrap {
	box-sizing: border-box;
	flex: 1 1 132px;
	max-width: 100%;
	min-width: 118px;
}

@container (max-width: 270px) {
	.product-card-row {
		justify-content: center !important;
		text-align: center;
	}

	.product-emoji {
		font-size: 42px;
		padding-bottom: 4px !important;
		padding-top: 8px !important;
	}

	.product-copy {
		flex-basis: calc(100% - 72px);
	}

	.product-action-wrap {
		flex-basis: 100%;
		min-width: 0;
		padding: 0 12px 12px !important;
		width: 100%;
	}

	.product-actions {
		margin: 0 !important;
		max-width: none;
	}
}

.tier-upgrade-pulse {
	animation: tier-upgrade-pulse 0.7s ease-out;
}

@keyframes tier-upgrade-pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(250, 208, 28, 0.65);
		transform: scale(0.98);
	}
	55% {
		box-shadow: 0 0 0 8px rgba(250, 208, 28, 0.18);
		transform: scale(1.02);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(250, 208, 28, 0);
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
