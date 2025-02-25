<template>
	<popup-base
		v-model="isVisible"
		:title="title"
		:text="text"
		:emoji="emoji"
		:theme="theme"
		:persistent="true"
		:show-close-button="false"
		@close="handleCancel"
	>
		<template #actions>
			<v-spacer></v-spacer>
			<v-btn :color="cancelColor" text @click="handleCancel" class="me-2">
				{{ cancelText }}
			</v-btn>
			<v-btn :color="confirmColor" @click="handleConfirm">
				{{ confirmText }}
			</v-btn>
		</template>
	</popup-base>
</template>

<script>
import PopupBase from "./PopupBase.vue";

export default {
	name: "ConfirmPopup",
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

		// Confirm popup specific props
		confirmText: {
			type: String,
			default: "Confirm",
		},
		cancelText: {
			type: String,
			default: "Cancel",
		},
		confirmColor: {
			type: String,
			default: "primary",
		},
		cancelColor: {
			type: String,
			default: "grey",
		},
		onConfirm: {
			type: Function,
			default: null,
		},
		onCancel: {
			type: Function,
			default: null,
		},
	},
	emits: ["update:modelValue", "confirmed", "cancelled"],
	computed: {
		isVisible: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit("update:modelValue", value);
			},
		},
	},
	methods: {
		handleConfirm() {
			this.isVisible = false;
			this.$emit("confirmed");

			// Call the onConfirm callback if provided
			if (typeof this.onConfirm === "function") {
				this.onConfirm();
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
