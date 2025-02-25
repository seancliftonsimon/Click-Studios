<template>
	<popup-base
		v-model="isVisible"
		:title="title"
		:text="text"
		:emoji="emoji"
		:theme="theme"
		:persistent="persistent"
		:close-button-text="buttonText"
		:close-button-color="buttonColor"
		@close="handleClose"
	>
		<template v-if="$slots.content" #content>
			<slot name="content"></slot>
		</template>

		<template v-if="$slots.actions" #actions>
			<slot name="actions"></slot>
		</template>
	</popup-base>
</template>

<script>
import PopupBase from "./PopupBase.vue";

export default {
	name: "InfoPopup",
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

		// Info popup specific props
		buttonText: {
			type: String,
			default: "OK",
		},
		buttonColor: {
			type: String,
			default: "primary",
		},
		persistent: {
			type: Boolean,
			default: true,
		},
		onClose: {
			type: Function,
			default: null,
		},
		nextPopupId: {
			type: String,
			default: null,
		},
	},
	emits: ["update:modelValue", "closed"],
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
		handleClose() {
			this.isVisible = false;
			this.$emit("closed");

			// Call the onClose callback if provided
			if (typeof this.onClose === "function") {
				this.onClose();
			}

			// Show the next popup if specified
			if (this.nextPopupId) {
				this.$store.dispatch("popupManager/showPopup", {
					id: this.nextPopupId,
				});
			}
		},
	},
};
</script>
