<template>
		<v-card class="rounded-lg mt-2" data-guidance-target="writers-room-upgrade-card">
		<v-row>
			<v-col class="center-content">
				<v-row class="my-auto">
					<v-col class="center-content">
						<v-chip :color="chipColor" label class="ml-1">
							{{ workersDisplay.length }} / {{ currentCapacity }}
						</v-chip>
					</v-col>
					<v-col class="my-auto pl-0" align="left">
						<span class="capacity-text"> WRITERS </span>
					</v-col>
				</v-row>
			</v-col>
			<v-col class="my-auto" align="right" v-if="writersRoomUpgradeVisible">
				<span class="capacity-text">NEXT CAPACITY</span>
			</v-col>
			<v-col cols="1" class="my-auto pl-0" v-if="writersRoomUpgradeVisible">
				<v-chip label>
					{{ nextCapacity }}
				</v-chip>
			</v-col>
			<v-col class="center-content" v-if="writersRoomUpgradeVisible">
				<v-card-actions>
					<v-btn
						class="spend-money-btn"
						@click="attemptUpgrade"
						:class="{ inactive: !canAffordUpgrade }"
						:disabled="!canAffordUpgrade"
						><span>Upgrade for ${{ $formatNumber(nextCost) }}</span></v-btn
					>
				</v-card-actions>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";

export default {
	computed: {
		...mapState(useGameStore, {
			currentWorkerAmount: "currentWorkerAmount",
			nextWritersRoomUpgrade: "nextWritersRoomUpgrade",
			getWorkerDetails: "getWorkerDetails",
			workers: "workers",
			currentCapacity: "currentWritersRoomCapacity",
			writersRoomUpgradeVisible: "writersRoomUpgradeVisible",
		}),
		workersDisplay() {
			return useGameStore().currentWorkers.map((workerEntry) => {
				const workerDetails = useGameStore().workers[workerEntry.workerType];
				if (!workerDetails) {
					console.error(
						`Details not found for worker type: ${workerEntry.workerType}`
					);
					return { ...workerEntry, emoji: "❓" }; // Fallback emoji
				}
				return { ...workerEntry, emoji: workerDetails.emoji };
			});
		},
		atCapacity() {
			return this.workersDisplay.length === this.currentCapacity;
		},
		chipColor() {
			return this.atCapacity ? "red" : "green";
		},
		nextCost() {
			// Retrieves the cost of the next upgrade, if available
			return this.nextWritersRoomUpgrade
				? this.nextWritersRoomUpgrade.cost
				: "N/A";
		},
		nextCapacity() {
			// Retrieves the capacity value of the next upgrade, if available
			return this.nextWritersRoomUpgrade
				? this.nextWritersRoomUpgrade.capacity
				: "N/A";
		},
		canAffordUpgrade() {
			return (
				this.nextWritersRoomUpgrade &&
				useGameStore().writingDollarCount >= this.nextWritersRoomUpgrade.cost
			);
		},
		isVisible() {
			return this.nextWritersRoomUpgrade !== null;
		},
	},
	methods: {
		attemptUpgrade() {
			if (this.canAffordUpgrade) {
				this.upgradeWritersRoomCapacity();
			} else {
				console.error(
					"Cannot upgrade - either due to insufficient funds or capacity."
				);
			}
		},
		upgradeWritersRoomCapacity() {
			useGameStore().upgradeWritersRoom();
		},
	},
};
</script>

<style scoped>
.center-content {
	display: flex;
	justify-content: center;
}

.capacity-text {
	font-family: "Roboto";
	font-weight: medium;
	font-size: 16px;
}
</style>
