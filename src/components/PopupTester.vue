<template>
	<div class="popup-tester">
		<h1>Popup Tester</h1>
		<p>
			Use this component to test all popups without playing through the game.
		</p>

		<v-expansion-panels>
			<v-expansion-panel
				v-for="(popups, category) in popupCategories"
				:key="category"
			>
				<v-expansion-panel-title>
					{{ formatCategoryName(category) }} Popups
				</v-expansion-panel-title>
				<v-expansion-panel-text>
					<v-btn
						v-for="(popup, key) in popups"
						:key="key"
						color="primary"
						class="ma-2"
						@click="showPopup(popup.id)"
					>
						{{ popup.title || key }}
					</v-btn>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>

		<h2 class="mt-6">Direct Key Testing</h2>
		<p>Test popups by their direct keys (as used in dispatch calls):</p>

		<v-text-field
			v-model="popupKey"
			label="Enter popup key"
			placeholder="e.g., writersRoom_upgrade"
			class="mb-2"
		></v-text-field>

		<v-btn color="success" @click="showPopupByKey" :disabled="!popupKey">
			Show Popup
		</v-btn>
	</div>
</template>

<script>
import {
	tutorialPopups,
	achievementPopups,
	writersRoomPopups,
	scriptPopups,
	confirmationPopups,
	featureUnlockPopups,
	gamePhasePopups,
	errorPopups,
} from "../data/popups";

export default {
	name: "PopupTester",
	data() {
		return {
			popupKey: "",
			popupCategories: {
				tutorial: tutorialPopups,
				achievement: achievementPopups,
				writersRoom: writersRoomPopups,
				script: scriptPopups,
				confirmation: confirmationPopups,
				featureUnlock: featureUnlockPopups,
				gamePhase: gamePhasePopups,
				error: errorPopups,
			},
		};
	},
	methods: {
		formatCategoryName(name) {
			return (
				name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")
			);
		},
		showPopup(id) {
			this.$store.dispatch("popupManager/showPopup", { id });
		},
		showPopupByKey() {
			if (this.popupKey) {
				// Use the standardized format with the namespaced action
				this.$store.dispatch("popupManager/showPopup", { id: this.popupKey });
			}
		},
	},
};
</script>

<style scoped>
.popup-tester {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}
</style>
