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
			<v-card class="cs-modal popup-card" :class="[`popup-theme-${theme}`]">
				<div v-if="theme === 'premiere'" class="premiere-strip"></div>
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
						class="cs-button cs-button-primary popup-close-btn"
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
	overflow: hidden;
}

.popup-title {
	color: var(--cs-color-ink);
	font-family: var(--cs-font-display);
	font-weight: 800;
	padding: 24px 28px 8px;
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
	padding: 0 28px 22px;
	text-align: center;
}

.popup-text {
	color: var(--cs-color-muted);
	font-size: 1rem;
	line-height: 1.4;
	text-align: center;
	white-space: pre-line;
}

.popup-actions {
	padding: 0 28px 24px;
}

/* Theme variations */
.popup-theme-default {
	background-color: var(--cs-color-white);
}

.popup-theme-tutorial {
	background-color: var(--cs-color-ticket);
}

.popup-theme-achievement {
	background-color: var(--cs-color-ticket);
}

.popup-theme-premiere {
	background: linear-gradient(
		180deg,
		var(--cs-color-popcorn) 0%,
		var(--cs-color-white) 52%,
		var(--cs-color-ticket) 100%
	);
	border: 1px solid rgba(147, 22, 33, 0.16);
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

.premiere-strip {
	background: repeating-linear-gradient(
		90deg,
		var(--cs-color-curtain) 0,
		var(--cs-color-curtain) 22px,
		var(--cs-color-gold) 22px,
		var(--cs-color-gold) 34px
	);
	height: 8px;
}

/* Accessibility focus styles */
.popup-card:focus {
	outline: 2px solid var(--cs-color-night);
	outline-offset: 2px;
}

/* Animation enhancements */
.dialog-transition-enter-active,
.dialog-transition-leave-active {
	transition: all var(--cs-motion-medium);
}

.dialog-transition-enter-from,
.dialog-transition-leave-to {
	opacity: 0;
	transform: scale(0.95);
}
</style>
