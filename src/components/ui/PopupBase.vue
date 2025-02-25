<template>
	<v-dialog
		:model-value="modelValue"
		@update:model-value="$emit('update:modelValue', $event)"
		:max-width="maxWidth"
		:persistent="persistent"
		:content-class="`popup-${theme}`"
		:transition="transition"
		:overlay-opacity="overlayOpacity"
		@keydown.esc="handleEscKey"
		@click:outside="handleOutsideClick"
	>
		<v-card class="popup-card" :class="[`popup-theme-${theme}`]">
			<v-card-title
				class="popup-title text-h5 d-flex align-center justify-center text-center"
			>
				<span v-if="emoji" class="popup-emoji me-2">{{ emoji }}</span>
				{{ title }}
			</v-card-title>

			<v-card-text class="popup-content text-center">
				<slot name="content">
					<p v-if="text" class="popup-text text-center">{{ text }}</p>
				</slot>
			</v-card-text>

			<v-card-actions class="popup-actions">
				<slot name="actions">
					<v-spacer></v-spacer>
					<v-btn
						v-if="showCloseButton"
						:color="closeButtonColor"
						@click="$emit('close')"
						class="popup-close-btn"
					>
						{{ closeButtonText }}
					</v-btn>
				</slot>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: "PopupBase",
	props: {
		// Core props
		modelValue: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: "",
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

		// Dialog behavior props
		persistent: {
			type: Boolean,
			default: true,
		},
		maxWidth: {
			type: [String, Number],
			default: 500,
		},
		transition: {
			type: String,
			default: "dialog-transition",
		},
		overlayOpacity: {
			type: [String, Number],
			default: 0.5,
		},
		allowEscClose: {
			type: Boolean,
			default: false,
		},
		allowOutsideClick: {
			type: Boolean,
			default: false,
		},

		// Button props
		showCloseButton: {
			type: Boolean,
			default: true,
		},
		closeButtonText: {
			type: String,
			default: "Close",
		},
		closeButtonColor: {
			type: String,
			default: "primary",
		},
	},
	emits: ["update:modelValue", "close"],
	methods: {
		handleEscKey() {
			if (this.allowEscClose && !this.persistent) {
				this.$emit("close");
			}
		},
		handleOutsideClick() {
			if (this.allowOutsideClick && !this.persistent) {
				this.$emit("close");
			}
		},
	},
};
</script>

<style scoped>
.popup-card {
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.popup-title {
	padding: 20px 24px 10px;
	font-weight: 600;
	text-align: center;
	width: 100%;
}

.popup-emoji {
	font-size: 1.5em;
	line-height: 1;
	display: inline-block;
	text-align: center;
}

.popup-content {
	padding: 0 24px 20px;
	text-align: center;
}

.popup-text {
	white-space: pre-line;
	font-size: 1.1em;
	line-height: 1.5;
	text-align: center;
}

.popup-actions {
	padding: 0 24px 20px;
}

/* Theme variations */
.popup-theme-default {
	background-color: #ffffff;
}

.popup-theme-tutorial {
	background-color: #e3f2fd;
}

.popup-theme-achievement {
	background-color: #f9fbe7;
}

.popup-theme-error {
	background-color: #ffebee;
}

.popup-theme-success {
	background-color: #e8f5e9;
}

.popup-theme-warning {
	background-color: #fff8e1;
}

/* Accessibility focus styles */
.popup-card:focus {
	outline: 2px solid #1976d2;
	outline-offset: 2px;
}

/* Animation enhancements */
.dialog-transition-enter-active,
.dialog-transition-leave-active {
	transition: all 0.3s ease;
}

.dialog-transition-enter-from,
.dialog-transition-leave-to {
	opacity: 0;
	transform: scale(0.95);
}
</style>
