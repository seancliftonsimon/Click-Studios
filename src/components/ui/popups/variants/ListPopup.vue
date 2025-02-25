<template>
	<popup-base
		:title="title"
		:emoji="emoji"
		:text="text"
		:button-text="buttonText"
		:button-color="buttonColor"
		:theme="theme"
		@close="$emit('close')"
		@action="$emit('action', $event)"
	>
		<template #content>
			<div class="text-center px-4">
				<span v-if="emoji" class="emoji" v-html="emoji"></span>
				<v-card-text class="text-center">{{ text }}</v-card-text>

				<v-list class="text-center">
					<v-list-item
						v-for="(item, index) in items"
						:key="index"
						@click="handleItemClick(item, index)"
					>
						<v-list-item-avatar v-if="item.icon || item.emoji">
							<v-icon v-if="item.icon">{{ item.icon }}</v-icon>
							<span
								v-else-if="item.emoji"
								v-html="item.emoji"
								class="list-emoji"
							></span>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title class="text-center">{{
								item.title
							}}</v-list-item-title>
							<v-list-item-subtitle v-if="item.subtitle" class="text-center">{{
								item.subtitle
							}}</v-list-item-subtitle>
						</v-list-item-content>

						<v-list-item-action v-if="item.action">
							<v-btn
								icon
								:color="item.actionColor || 'primary'"
								@click.stop="handleItemAction(item, index)"
							>
								<v-icon>{{ item.actionIcon || "mdi-chevron-right" }}</v-icon>
							</v-btn>
						</v-list-item-action>
					</v-list-item>
				</v-list>
			</div>
		</template>
	</popup-base>
</template>

<script>
import PopupBase from "../PopupBase.vue";

export default {
	name: "ListPopup",
	components: {
		PopupBase,
	},
	props: {
		title: { type: String, default: "" },
		emoji: { type: String, default: "" },
		text: { type: String, default: "" },
		items: {
			type: Array,
			default: () => [],
			// Each item should have: title, subtitle (optional), icon/emoji (optional),
			// action (optional), actionIcon (optional), actionColor (optional)
		},
		buttonText: { type: String, default: "Close" },
		buttonColor: { type: String, default: "green darken-1" },
		nextPopup: { type: String, default: null },
		theme: { type: String, default: "default" },
		selectable: { type: Boolean, default: false },
	},
	methods: {
		handleItemClick(item, index) {
			if (this.selectable) {
				this.$emit("action", {
					action: "select",
					data: { item, index },
				});
			}
		},
		handleItemAction(item, index) {
			if (item.action) {
				this.$emit("action", {
					action: item.action,
					data: { item, index },
				});
			}
		},
	},
};
</script>

<style scoped>
.list-emoji {
	font-size: 1.5em;
	text-align: center;
}
</style>
