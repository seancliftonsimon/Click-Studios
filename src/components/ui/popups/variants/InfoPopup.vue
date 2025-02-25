<template>
	<popup-base
		:title="title"
		:emoji="emoji"
		:text="text"
		:button-text="buttonText"
		:button-color="buttonColor"
		:next-popup="nextPopup"
		:theme="theme"
		@close="$emit('close')"
		@action="$emit('action', $event)"
	/>
</template>

<script>
import PopupBase from "../PopupBase.vue";

export default {
	name: "InfoPopup",
	components: {
		PopupBase,
	},
	props: {
		title: { type: String, default: "" },
		emoji: { type: String, default: "" },
		text: { type: String, default: "" },
		buttonText: { type: String, default: "Close" },
		buttonColor: { type: String, default: "green darken-1" },
		nextPopup: { type: String, default: null },
		theme: { type: String, default: "default" },
	},
};
</script>
