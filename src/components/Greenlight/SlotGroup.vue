<template>
	<div class="sg">
		<div class="sg-head">
			<span class="sg-title">
				<CategoryIcon v-if="icon" :type="icon" class="sg-icon" />
				{{ title }}
			</span>
			<span
				class="sg-count"
				:class="{ 'sg-count-done': filledCount === count }"
			>
				{{ filledCount }} / {{ count }}
			</span>
			<button
				class="sg-dice"
				:disabled="!options.length"
				:title="`Randomize all ${title.toLowerCase()}`"
				@click="$emit('randomize')"
			>
				🎲
			</button>
		</div>
		<div class="sg-slots">
			<SlotDropdown
				v-for="i in count"
				:key="i"
				:value="values[i - 1] || ''"
				:options="options"
				:placeholder="placeholder"
				:icon="icon"
				@update="$emit('set', { index: i - 1, value: $event })"
			/>
		</div>
	</div>
</template>

<script>
import SlotDropdown from "./SlotDropdown.vue";
import CategoryIcon from "./CategoryIcon.vue";

export default {
	name: "SlotGroup",
	components: { SlotDropdown, CategoryIcon },
	props: {
		title: { type: String, required: true },
		count: { type: Number, required: true },
		values: { type: Array, default: () => [] },
		options: { type: Array, default: () => [] },
		placeholder: { type: String, default: "Choose…" },
		icon: { type: String, default: "" },
	},
	emits: ["set", "randomize"],
	computed: {
		filledCount() {
			return this.values.slice(0, this.count).filter(Boolean).length;
		},
	},
};
</script>

<style scoped>
.sg {
	background: var(--cs-color-white);
	border: 1px solid var(--cs-color-line);
	border-radius: var(--cs-radius-panel);
	padding: 12px 14px;
}

.sg-head {
	align-items: center;
	display: flex;
	gap: 10px;
	margin-bottom: 10px;
}

.sg-title {
	align-items: center;
	display: inline-flex;
	font-family: var(--cs-font-display);
	font-size: 1.05em;
	gap: 6px;
}

.sg-icon {
	color: var(--cs-color-curtain);
	width: 1.2em;
	height: 1.2em;
}

.sg-dice {
	background: var(--cs-color-popcorn);
	border: 1px solid var(--cs-color-line);
	border-radius: var(--cs-radius-control);
	cursor: pointer;
	font-size: 0.95em;
	line-height: 1;
	margin-left: auto;
	padding: 4px 8px;
	transition: transform var(--cs-motion-fast);
}

.sg-dice:hover:not(:disabled) {
	transform: rotate(-12deg) scale(1.08);
}

.sg-dice:disabled {
	cursor: not-allowed;
	opacity: 0.4;
}

.sg-count {
	background: var(--cs-color-popcorn);
	border: 1px solid var(--cs-color-line);
	border-radius: 999px;
	font-size: 0.8em;
	font-weight: 800;
	padding: 1px 9px;
}

.sg-count-done {
	background: var(--cs-color-success);
	border-color: var(--cs-color-success);
	color: var(--cs-color-white);
}

.sg-slots {
	display: grid;
	gap: 8px;
	grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
}
</style>
