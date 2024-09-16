<template>
	<v-dialog
		v-model="popupVisible"
		tabindex="0"
		@keyup.enter="handleButtonClick"
	>
		<v-card class="popup-card" style="border-radius: 12px">
			<v-card-title class="text-h4 my-4 text-center">{{
				currentPopupContent.title
			}}</v-card-title>
			<div class="text-center px-16">
				<span class="emoji" v-html="currentPopupContent.emoji"></span>

				<v-card-text>{{ currentPopupContent.text }}</v-card-text>
			</div>
			<v-spacer></v-spacer>
			<v-text-field
				v-if="currentPopupContent.inputField"
				v-model="inputValue"
				label="Type Here"
				autofocus
				class="popup-text-input"
				:counter="35"
				:maxlength="35"
			></v-text-field>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn :color="buttonColor" text @click="handleButtonClick">
					{{ buttonText }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
	data() {
		return {
			inputValue: "",
		};
	},
	computed: {
		...mapGetters(["currentPopupContent", "popupVisible"]),
		buttonText() {
			return this.currentPopupContent.buttonType === "next" ? "Next" : "Close";
		},
		buttonColor() {
			return this.currentPopupContent.buttonType === "next"
				? "blue darken-1"
				: "green darken-1";
		},
	},
	methods: {
		...mapMutations(["SET_POPUP_VISIBLE", "UPDATE_STATE_VARIABLE"]),
		...mapActions(["showPopup"]),
		handleButtonClick() {
			// If inputField is true, update the target state variable with inputValue before proceeding
			if (
				this.currentPopupContent.inputField &&
				this.currentPopupContent.inputTarget &&
				this.inputValue.trim() !== ""
			) {
				this.UPDATE_STATE_VARIABLE({
					key: this.currentPopupContent.inputTarget,
					value: this.inputValue,
				});
			}
			if (
				this.currentPopupContent.buttonType === "next" &&
				this.currentPopupContent.nextPopup
			) {
				this.showPopup(this.currentPopupContent.nextPopup);
			} else {
				this.SET_POPUP_VISIBLE(false);
			}
		},
	},
};
</script>

<style scoped>
.emoji {
	font-size: 5em;
	display: block;
}
.popup-card {
	margin: auto;
	width: 50%;
	max-width: 800px;
}

.popup-text-input {
	margin: auto;
	width: 80%;
}

.v-card-text {
	white-space: pre-line; /* Preserves new lines as they are in the text */
	font-size: 1.2em;
	font-family: "Roboto";
}

.v-card-title {
	font-family: "Roboto";
	font-weight: 600;
}
</style>
