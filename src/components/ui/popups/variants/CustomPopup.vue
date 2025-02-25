<template>
	<popup-base :title="title" :theme="theme" @close="$emit('close')">
		<template #content>
			<div class="px-4">
				<slot name="content">
					<!-- Default content if no slot provided -->
					<div class="text-center">
						<span v-if="emoji" class="emoji" v-html="emoji"></span>
						<v-card-text class="text-center">{{ text }}</v-card-text>
					</div>
				</slot>
			</div>
		</template>

		<template #actions>
			<slot name="actions">
				<!-- Default actions if no slot provided -->
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn :color="buttonColor" text @click="handleDefaultAction">
						{{ buttonText }}
					</v-btn>
				</v-card-actions>
			</slot>
		</template>
	</popup-base>
</template>

<script>
import PopupBase from "../PopupBase.vue";

export default {
	name: "CustomPopup",
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
		// Custom props
		actionHandler: { type: Function, default: null },
		persistent: {
			type: Boolean,
			default: true,
		},
	},
	methods: {
		handleDefaultAction() {
			if (this.actionHandler) {
				this.actionHandler();
			} else if (this.nextPopup) {
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
