<template>
	<div class="sd" ref="root">
		<button
			class="sd-trigger"
			:class="{ 'sd-trigger-filled': value, 'sd-trigger-open': open }"
			@click="toggle"
		>
			<CategoryIcon v-if="icon" :type="icon" class="sd-icon" />
			<span class="sd-value">{{ value || placeholder }}</span>
			<span class="sd-caret">▾</span>
		</button>

		<div v-if="open" class="sd-panel">
			<CategoryIcon v-if="icon" :type="icon" class="sd-watermark" />
			<div v-if="!options.length" class="sd-empty">
				Unlock more to choose here.
			</div>
			<div v-else class="sd-grid">
				<button
					v-for="opt in options"
					:key="opt"
					class="sd-opt"
					:class="{ 'sd-opt-active': opt === value }"
					@click="choose(opt)"
				>
					{{ opt }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import CategoryIcon from "./CategoryIcon.vue";

export default {
	name: "SlotDropdown",
	components: { CategoryIcon },
	props: {
		value: { type: String, default: "" },
		options: { type: Array, default: () => [] },
		placeholder: { type: String, default: "Choose…" },
		icon: { type: String, default: "" },
	},
	emits: ["update"],
	data() {
		return { open: false };
	},
	methods: {
		toggle() {
			this.open = !this.open;
		},
		choose(opt) {
			this.$emit("update", opt);
			this.open = false;
		},
		onDocClick(e) {
			if (this.open && this.$refs.root && !this.$refs.root.contains(e.target)) {
				this.open = false;
			}
		},
	},
	mounted() {
		document.addEventListener("mousedown", this.onDocClick);
	},
	beforeUnmount() {
		document.removeEventListener("mousedown", this.onDocClick);
	},
};
</script>

<style scoped>
.sd {
	position: relative;
}

.sd-trigger {
	align-items: center;
	background: var(--cs-color-white);
	border: 1px solid var(--cs-color-line);
	border-radius: var(--cs-radius-control);
	cursor: pointer;
	display: flex;
	font-size: 0.85em;
	font-weight: 700;
	gap: 6px;
	justify-content: space-between;
	min-width: 130px;
	padding: 6px 10px;
	width: 100%;
}

.sd-trigger-filled {
	background: var(--cs-color-gold);
	border-color: #c89b00;
}

.sd-trigger-open {
	border-color: var(--cs-color-night);
	box-shadow: 0 0 0 2px rgba(49, 59, 114, 0.25);
}

.sd-icon {
	color: var(--cs-color-night);
}

.sd-trigger-filled .sd-icon {
	color: var(--cs-color-curtain);
}

.sd-value {
	flex: 1 1 auto;
	min-width: 0;
	overflow: hidden;
	text-align: left;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.sd-trigger:not(.sd-trigger-filled) .sd-value {
	color: var(--cs-color-muted);
	font-weight: 600;
}

.sd-caret {
	color: var(--cs-color-muted);
	font-size: 0.8em;
}

.sd-panel {
	background: var(--cs-color-ticket);
	border: 1px solid var(--cs-color-night);
	border-radius: var(--cs-radius-panel);
	box-shadow: var(--cs-shadow-soft);
	left: 0;
	margin-top: 4px;
	max-height: 260px;
	overflow-y: auto;
	padding: 8px;
	position: absolute;
	top: 100%;
	width: 300px;
	max-width: 86vw;
	z-index: 50;
}

.sd-watermark {
	color: var(--cs-color-night);
	height: 64px;
	opacity: 0.07;
	pointer-events: none;
	position: absolute;
	right: 8px;
	top: 8px;
	width: 64px;
}

.sd-grid {
	display: grid;
	gap: 5px;
	grid-template-columns: repeat(3, 1fr);
}

.sd-opt {
	background: var(--cs-color-white);
	border: 1px solid var(--cs-color-line);
	border-radius: var(--cs-radius-control);
	cursor: pointer;
	font-size: 0.8em;
	padding: 5px 8px;
	text-align: left;
	transition: all var(--cs-motion-fast);
}

.sd-opt:hover {
	background: var(--cs-color-night);
	border-color: #202852;
	color: var(--cs-color-white);
}

.sd-opt-active {
	background: var(--cs-color-gold);
	border-color: #c89b00;
}

.sd-empty {
	color: var(--cs-color-muted);
	font-size: 0.82em;
	font-style: italic;
	padding: 4px 6px;
}
</style>
