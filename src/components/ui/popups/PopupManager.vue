<template>
	<div class="popup-manager">
		<component
			v-if="currentPopup"
			:is="getPopupComponent(currentPopup.id)"
			v-bind="currentPopup.config"
			@close="closePopup"
			@action="handlePopupAction"
		/>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import InfoPopup from "./variants/InfoPopup.vue";
import InputPopup from "./variants/InputPopup.vue";
import ConfirmPopup from "./variants/ConfirmPopup.vue";
import ListPopup from "./variants/ListPopup.vue";
import CustomPopup from "./variants/CustomPopup.vue";

export default {
	name: "PopupManager",
	components: {
		InfoPopup,
		InputPopup,
		ConfirmPopup,
		ListPopup,
		CustomPopup,
	},
	computed: {
		...mapGetters("popupManager", ["currentPopup"]),
	},
	methods: {
		...mapActions("popupManager", ["closePopup", "showPopup"]),

		getPopupComponent(id) {
			// Map popup types to component names
			const componentMap = {
				info: "InfoPopup",
				input: "InputPopup",
				confirm: "ConfirmPopup",
				list: "ListPopup",
				custom: "CustomPopup",
			};

			// Get the popup type from the current popup's config
			const popupType = this.currentPopup?.config?.type || "info";
			return componentMap[popupType] || "InfoPopup";
		},

		handlePopupAction({ action, data }) {
			// Get the current popup config
			const popupConfig = this.currentPopup.config;

			// Dispatch the appropriate action based on popup interaction
			if (action === "close") {
				this.closePopup();
			} else if (action === "next" && popupConfig.nextPopup) {
				this.closePopup();
				this.showPopup({ id: popupConfig.nextPopup });
			} else if (action === "input" && popupConfig.inputTarget) {
				// Handle input submission
				this.$store.commit("UPDATE_STATE_VARIABLE", {
					key: popupConfig.inputTarget,
					value: data.value,
				});

				if (popupConfig.nextPopup) {
					this.closePopup();
					this.showPopup({ id: popupConfig.nextPopup });
				} else {
					this.closePopup();
				}
			} else if (action === "confirm" && popupConfig.confirmAction) {
				// Handle confirmation actions
				if (typeof popupConfig.confirmAction === "string") {
					this.$store.dispatch(
						popupConfig.confirmAction,
						popupConfig.payload || {}
					);
				} else if (typeof popupConfig.confirmAction === "function") {
					popupConfig.confirmAction(popupConfig.payload || {});
				}

				if (popupConfig.nextPopup) {
					this.closePopup();
					this.showPopup({ id: popupConfig.nextPopup });
				} else {
					this.closePopup();
				}
			} else {
				// Handle custom actions by emitting events that parent components can listen for
				this.$emit(action, data);

				// Check if we need to navigate to another popup
				if (popupConfig.nextPopup) {
					this.closePopup();
					this.showPopup({ id: popupConfig.nextPopup });
				}
			}
		},
	},
};
</script>
