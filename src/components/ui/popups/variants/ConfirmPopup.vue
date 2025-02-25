<template>
	<popup-base
		:title="title"
		:emoji="emoji"
		:text="text"
		:theme="theme"
		@close="$emit('close')"
		:persistent="persistent"
	>
		<template #actions>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn :color="cancelColor" text @click="$emit('close')">
					{{ cancelText }}
				</v-btn>
				<v-btn :color="confirmColor" text @click="handleConfirm">
					{{ confirmText }}
				</v-btn>
			</v-card-actions>
		</template>
	</popup-base>
</template>

<script>
import PopupBase from "../PopupBase.vue";

export default {
	name: "ConfirmPopup",
	components: {
		PopupBase,
	},
	props: {
		title: { type: String, default: "Confirm" },
		emoji: { type: String, default: "" },
		text: { type: String, default: "Are you sure?" },
		confirmText: { type: String, default: "Confirm" },
		cancelText: { type: String, default: "Cancel" },
		confirmColor: { type: String, default: "primary" },
		cancelColor: { type: String, default: "grey darken-1" },
		nextPopup: { type: String, default: null },
		theme: { type: String, default: "default" },
		actionName: { type: String, default: "" },
		actionPayload: { type: Object, default: () => ({}) },
		persistent: {
			type: Boolean,
			default: true,
		},
	},
	methods: {
		handleConfirm() {
			this.$emit("action", {
				action: this.actionName || "confirm",
				data: {
					...this.actionPayload,
					nextPopup: this.nextPopup,
				},
			});
		},
	},
};
</script>
