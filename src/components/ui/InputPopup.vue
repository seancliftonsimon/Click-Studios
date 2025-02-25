<template>
	<popup-base
		v-model="isVisible"
		:title="title"
		:text="text"
		:emoji="emoji"
		:theme="theme"
		:persistent="persistent"
		:show-close-button="false"
		@close="handleCancel"
	>
		<template #content>
			<p v-if="text" class="popup-text mb-4">{{ text }}</p>

			<v-text-field
				v-model="inputValue"
				:label="inputLabel"
				:placeholder="inputPlaceholder"
				:hint="inputHint"
				:counter="maxLength > 0"
				:maxlength="maxLength > 0 ? maxLength : undefined"
				:rules="validationRules"
				:autofocus="autofocus"
				@keyup.enter="handleSubmit"
				class="mt-4"
			></v-text-field>
		</template>

		<template #actions>
			<v-spacer></v-spacer>
			<v-btn
				v-if="showCancelButton"
				:color="cancelColor"
				text
				@click="handleCancel"
				class="me-2"
			>
				{{ cancelText }}
			</v-btn>
			<v-btn
				:color="submitColor"
				:disabled="!isInputValid"
				@click="handleSubmit"
			>
				{{ submitText }}
			</v-btn>
		</template>
	</popup-base>
</template>

<script>
import PopupBase from "./PopupBase.vue";

export default {
	name: "InputPopup",
	components: {
		PopupBase,
	},
	props: {
		// Inherit core props from PopupBase
		modelValue: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			default: "",
		},
		emoji: {
			type: String,
			default: "",
		},
		theme: {
			type: String,
			default: "default",
		},

		// Input popup specific props
		inputLabel: {
			type: String,
			default: "Enter your response",
		},
		inputPlaceholder: {
			type: String,
			default: "",
		},
		inputHint: {
			type: String,
			default: "",
		},
		defaultValue: {
			type: String,
			default: "",
		},
		maxLength: {
			type: Number,
			default: 0,
		},
		required: {
			type: Boolean,
			default: true,
		},
		inputTarget: {
			type: String,
			default: "",
		},
		submitText: {
			type: String,
			default: "Submit",
		},
		submitColor: {
			type: String,
			default: "primary",
		},
		showCancelButton: {
			type: Boolean,
			default: false,
		},
		cancelText: {
			type: String,
			default: "Cancel",
		},
		cancelColor: {
			type: String,
			default: "grey",
		},
		persistent: {
			type: Boolean,
			default: true,
		},
		autofocus: {
			type: Boolean,
			default: true,
		},
		onSubmit: {
			type: Function,
			default: null,
		},
		onCancel: {
			type: Function,
			default: null,
		},
		nextPopupId: {
			type: String,
			default: null,
		},
	},
	emits: ["update:modelValue", "submitted", "cancelled"],
	data() {
		return {
			inputValue: this.defaultValue,
		};
	},
	computed: {
		isVisible: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit("update:modelValue", value);
			},
		},
		validationRules() {
			const rules = [];

			if (this.required) {
				rules.push((v) => !!v || "This field is required");
			}

			if (this.maxLength > 0) {
				rules.push(
					(v) =>
						(v && v.length <= this.maxLength) ||
						`Maximum ${this.maxLength} characters`
				);
			}

			return rules;
		},
		isInputValid() {
			if (this.required && !this.inputValue) {
				return false;
			}

			if (
				this.maxLength > 0 &&
				this.inputValue &&
				this.inputValue.length > this.maxLength
			) {
				return false;
			}

			return true;
		},
	},
	methods: {
		handleSubmit() {
			if (!this.isInputValid) {
				return;
			}

			this.isVisible = false;
			this.$emit("submitted", this.inputValue);

			// Update state variable if inputTarget is provided
			if (this.inputTarget && this.inputValue) {
				this.$store.commit("UPDATE_STATE_VARIABLE", {
					key: this.inputTarget,
					value: this.inputValue,
				});
			}

			// Call the onSubmit callback if provided
			if (typeof this.onSubmit === "function") {
				this.onSubmit(this.inputValue);
			}

			// Show the next popup if specified
			if (this.nextPopupId) {
				this.$store.dispatch("popupManager/showPopup", {
					id: this.nextPopupId,
				});
			}
		},

		handleCancel() {
			this.isVisible = false;
			this.$emit("cancelled");

			// Call the onCancel callback if provided
			if (typeof this.onCancel === "function") {
				this.onCancel();
			}
		},
	},
};
</script>
