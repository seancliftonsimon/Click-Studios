<template>
	<popup-base
		:title="title"
		:emoji="emoji"
		:text="text"
		:button-text="buttonText"
		:button-color="buttonColor"
		:theme="theme"
		@close="$emit('close')"
		:persistent="persistent"
	>
		<template #content>
			<div class="text-center px-4">
				<span v-if="emoji" class="emoji" v-html="emoji"></span>
				<v-card-text>{{ text }}</v-card-text>
				<v-text-field
					v-model="inputValue"
					:label="inputLabel"
					autofocus
					class="popup-text-input"
					:counter="maxLength"
					:maxlength="maxLength"
				></v-text-field>
			</div>
		</template>

		<template #actions>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					:color="buttonColor"
					text
					@click="handleSubmit"
					:disabled="inputRequired && !inputValue.trim()"
				>
					{{ buttonText }}
				</v-btn>
			</v-card-actions>
		</template>
	</popup-base>
</template>

<script>
import PopupBase from "../PopupBase.vue";

export default {
	name: "InputPopup",
	components: {
		PopupBase,
	},
	props: {
		title: { type: String, default: "" },
		emoji: { type: String, default: "" },
		text: { type: String, default: "" },
		buttonText: { type: String, default: "Submit" },
		buttonColor: { type: String, default: "blue darken-1" },
		nextPopup: { type: String, default: null },
		theme: { type: String, default: "default" },
		inputTarget: { type: String, required: true },
		inputLabel: { type: String, default: "Type Here" },
		maxLength: { type: Number, default: 35 },
		inputRequired: { type: Boolean, default: true },
		persistent: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			inputValue: "",
		};
	},
	methods: {
		handleSubmit() {
			if (this.inputRequired && !this.inputValue.trim()) {
				return;
			}

			this.$emit("action", {
				action: "input",
				data: {
					inputTarget: this.inputTarget,
					value: this.inputValue,
					nextPopup: this.nextPopup,
				},
			});
		},
	},
};
</script>

<style scoped>
.popup-text-input {
	margin: auto;
	width: 80%;
}
</style>
