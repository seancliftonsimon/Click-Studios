<template>
	<div class="popup-manager">
		<!-- Info Popup -->
		<info-popup
			v-if="
				currentPopup &&
				currentPopup.config &&
				currentPopup.config.type === 'info'
			"
			v-model="isPopupVisible"
			:title="currentPopup.config.title"
			:text="currentPopup.config.text"
			:emoji="currentPopup.config.emoji"
			:theme="currentPopup.config.theme || globalSettings.defaultTheme"
			:button-text="currentPopup.config.buttonText"
			:button-color="currentPopup.config.buttonColor"
			:persistent="currentPopup.config.persistent"
			:next-popup-id="currentPopup.config.nextPopup"
			@closed="handlePopupClosed"
		/>

		<!-- Confirm Popup -->
		<confirm-popup
			v-if="
				currentPopup &&
				currentPopup.config &&
				currentPopup.config.type === 'confirm'
			"
			v-model="isPopupVisible"
			:title="currentPopup.config.title"
			:text="currentPopup.config.text"
			:emoji="currentPopup.config.emoji"
			:theme="currentPopup.config.theme || globalSettings.defaultTheme"
			:confirm-text="currentPopup.config.confirmText"
			:cancel-text="currentPopup.config.cancelText"
			:confirm-color="currentPopup.config.confirmColor"
			:cancel-color="currentPopup.config.cancelColor"
			@confirmed="handleConfirmed"
			@cancelled="handleCancelled"
		/>

		<!-- Input Popup -->
		<input-popup
			v-if="
				currentPopup &&
				currentPopup.config &&
				currentPopup.config.type === 'input'
			"
			v-model="isPopupVisible"
			:title="currentPopup.config.title"
			:text="currentPopup.config.text"
			:emoji="currentPopup.config.emoji"
			:theme="currentPopup.config.theme || globalSettings.defaultTheme"
			:input-label="currentPopup.config.inputLabel"
			:input-placeholder="currentPopup.config.inputPlaceholder"
			:input-hint="currentPopup.config.inputHint"
			:default-value="currentPopup.config.defaultValue"
			:max-length="currentPopup.config.maxLength"
			:required="currentPopup.config.required !== false"
			:input-target="currentPopup.config.inputTarget"
			:submit-text="
				currentPopup.config.submitText || currentPopup.config.buttonText
			"
			:submit-color="currentPopup.config.submitColor"
			:show-cancel-button="currentPopup.config.showCancelButton"
			:cancel-text="currentPopup.config.cancelText"
			:cancel-color="currentPopup.config.cancelColor"
			:next-popup-id="currentPopup.config.nextPopup"
			@submitted="handleInputSubmitted"
			@cancelled="handleCancelled"
		/>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import InfoPopup from "./InfoPopup.vue";
import ConfirmPopup from "./ConfirmPopup.vue";
import InputPopup from "./InputPopup.vue";

export default {
	name: "PopupManager",
	components: {
		InfoPopup,
		ConfirmPopup,
		InputPopup,
	},
	data() {
		return {
			isPopupVisible: false,
		};
	},
	computed: {
		...mapGetters("popupManager", [
			"currentPopup",
			"hasActivePopups",
			"popupQueueLength",
			"globalSettings",
		]),
	},
	watch: {
		currentPopup(newPopup) {
			if (newPopup) {
				this.isPopupVisible = true;
			} else {
				this.isPopupVisible = false;
			}
		},
	},
	methods: {
		...mapActions("popupManager", ["closePopup", "showNextPopup"]),

		handlePopupClosed() {
			this.closePopup();
		},

		handleConfirmed() {
			// Execute the confirm action if provided
			if (
				this.currentPopup &&
				this.currentPopup.config &&
				this.currentPopup.config.onConfirm
			) {
				this.currentPopup.config.onConfirm();
			}

			this.closePopup();
		},

		handleCancelled() {
			// Execute the cancel action if provided
			if (
				this.currentPopup &&
				this.currentPopup.config &&
				this.currentPopup.config.onCancel
			) {
				this.currentPopup.config.onCancel();
			}

			this.closePopup();
		},

		handleInputSubmitted(value) {
			// Execute the submit action if provided
			if (
				this.currentPopup &&
				this.currentPopup.config &&
				this.currentPopup.config.onSubmit
			) {
				this.currentPopup.config.onSubmit(value);
			}

			this.closePopup();
		},
	},
};
</script>

<style scoped>
.popup-manager {
	position: fixed;
	z-index: 1000;
}
</style>
