<template>
	<v-dialog v-model="isVisible" max-width="500px" persistent>
		<v-card :class="['popup-card', themeClass]">
			<v-card-title class="text-h4 my-4 text-center">{{ title }}</v-card-title>
			<slot name="content">
				<div class="text-center px-4">
					<span v-if="emoji" class="emoji" v-html="emoji"></span>
					<v-card-text class="text-center">{{ text }}</v-card-text>
				</div>
			</slot>
			<slot name="actions">
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn :color="buttonColor" text @click="handleButtonClick">
						{{ buttonText }}
					</v-btn>
				</v-card-actions>
			</slot>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: "PopupBase",
	props: {
		title: { type: String, default: "" },
		emoji: { type: String, default: "" },
		text: { type: String, default: "" },
		buttonText: { type: String, default: "Close" },
		buttonColor: { type: String, default: "green darken-1" },
		nextPopup: { type: String, default: null },
		theme: { type: String, default: "default" },
	},
	computed: {
		isVisible: {
			get() {
				return true;
			},
			set(value) {
				if (!value) this.$emit("close");
			},
		},
		themeClass() {
			return `theme-${this.theme}`;
		},
	},
	methods: {
		handleButtonClick() {
			if (this.nextPopup) {
				this.$emit("action", {
					action: "next",
					data: { nextPopup: this.nextPopup },
				});
			} else {
				this.$emit("close");
			}
		},
	},
};
</script>

<style scoped>
.popup-card {
	border-radius: 12px;
	margin: auto;
	width: 50%;
	max-width: 800px;
}
.emoji {
	font-size: 5em;
	display: block;
	text-align: center;
}
.v-card-text {
	white-space: pre-line; /* Preserves new lines as they are in the text */
	font-size: 1.2em;
	font-family: "Roboto";
	text-align: center;
}
.v-card-title {
	font-family: "Roboto";
	font-weight: 600;
	text-align: center;
	width: 100%;
}
/* Theme classes */
.theme-default {
	/* Default styling */
}
.theme-achievement {
	background-color: #f9a825;
	color: white;
}
.theme-tutorial {
	background-color: #e3f2fd;
}
.theme-error {
	background-color: #ffebee;
}
</style>
