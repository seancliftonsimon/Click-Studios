<template>
	<div v-if="visible" class="lib-overlay" @click.self="close">
		<v-card class="cs-modal lib-card">
			<div class="lib-header">
				<h2 class="cs-display lib-title">Studio Library</h2>
				<v-btn icon="mdi-close" variant="text" size="small" @click="close" />
			</div>

			<!-- Roles, grouped by genre -->
			<div class="lib-section">
				<div class="lib-section-head">
					<CategoryIcon type="person" class="lib-section-icon" />
					<span class="lib-section-title">Roles</span>
				</div>
				<div v-for="g in genres" :key="g.key" class="lib-genre">
					<div class="lib-genre-head">
						<span>{{ g.emoji }} {{ g.name }}</span>
						<span class="lib-count">
							{{ unlockedCount(rolePools[g.key], roleTier(g.key)) }} /
							{{ rolePools[g.key].length }}
						</span>
					</div>
					<div class="lib-chips">
						<span
							v-for="(name, i) in rolePools[g.key]"
							:key="name + i"
							class="lib-chip"
							:class="
								i < unlockedCount(rolePools[g.key], roleTier(g.key))
									? 'lib-chip-on'
									: 'lib-chip-off'
							"
						>
							{{
								i < unlockedCount(rolePools[g.key], roleTier(g.key))
									? name
									: "🔒"
							}}
						</span>
					</div>
				</div>
			</div>

			<!-- Shared categories -->
			<div
				v-for="cat in sharedCategories"
				:key="cat.key"
				class="lib-section"
			>
				<div class="lib-section-head">
					<CategoryIcon :type="cat.icon" class="lib-section-icon" />
					<span class="lib-section-title">{{ cat.label }}</span>
					<span class="lib-count lib-count-right">
						{{ unlockedCount(cat.pool, tier(cat.key)) }} / {{ cat.pool.length }}
					</span>
				</div>
				<div class="lib-chips">
					<span
						v-for="(name, i) in cat.pool"
						:key="name + i"
						class="lib-chip"
						:class="
							i < unlockedCount(cat.pool, tier(cat.key))
								? 'lib-chip-on'
								: 'lib-chip-off'
						"
					>
						{{ i < unlockedCount(cat.pool, tier(cat.key)) ? name : "🔒" }}
					</span>
				</div>
			</div>

			<div class="lib-footer">
				<v-btn class="cs-button cs-button-primary" @click="close">Done</v-btn>
			</div>
		</v-card>
	</div>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";
import {
	rolePools,
	setPool,
	locationPool,
	shotPool,
	POOL_STARTER,
	POOL_STEP,
} from "@/data/projectPools";
import CategoryIcon from "./CategoryIcon.vue";

const GENRES = [
	{ key: "horror", name: "Horror", emoji: "😱" },
	{ key: "comedy", name: "Comedy", emoji: "🤣" },
	{ key: "drama", name: "Drama", emoji: "🥲" },
	{ key: "action", name: "Action", emoji: "😎" },
];

export default {
	name: "StudioLibrary",
	components: { CategoryIcon },
	data() {
		return {
			rolePools,
			genres: GENRES,
			sharedCategories: [
				{ key: "sets", label: "Sets", icon: "building", pool: setPool },
				{
					key: "locations",
					label: "Locations",
					icon: "pin",
					pool: locationPool,
				},
				{ key: "shots", label: "Shots", icon: "clapper", pool: shotPool },
			],
		};
	},
	computed: {
		...mapState(useGameStore, ["libraryVisible", "projectUnlocks"]),
		visible() {
			return this.libraryVisible;
		},
	},
	methods: {
		roleTier(genreKey) {
			return this.projectUnlocks.roles[genreKey] || 0;
		},
		tier(categoryKey) {
			return this.projectUnlocks[categoryKey] || 0;
		},
		unlockedCount(pool, tier) {
			return Math.min(pool.length, POOL_STARTER + tier * POOL_STEP);
		},
		close() {
			useGameStore().closeLibrary();
		},
	},
};
</script>

<style scoped>
.lib-overlay {
	position: fixed;
	inset: 0;
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(21, 19, 19, 0.55);
	padding: 24px;
}

.lib-card {
	width: 100%;
	max-width: 760px;
	max-height: 90vh;
	overflow-y: auto;
	padding: 18px 22px 22px;
}

.lib-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.lib-title {
	font-size: 1.7em;
	color: var(--cs-color-curtain);
}

.lib-section {
	border-top: 1px solid var(--cs-color-line);
	padding: 14px 0 4px;
}

.lib-section-head {
	align-items: center;
	display: flex;
	gap: 7px;
	margin-bottom: 10px;
}

.lib-section-icon {
	color: var(--cs-color-curtain);
	width: 1.3em;
	height: 1.3em;
}

.lib-section-title {
	font-family: var(--cs-font-display);
	font-size: 1.2em;
}

.lib-genre {
	margin-bottom: 12px;
}

.lib-genre-head {
	display: flex;
	justify-content: space-between;
	font-weight: 700;
	margin-bottom: 5px;
}

.lib-count {
	color: var(--cs-color-muted);
	font-variant-numeric: tabular-nums;
}

.lib-count-right {
	margin-left: auto;
}

.lib-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
}

.lib-chip {
	border-radius: 999px;
	font-size: 0.8em;
	font-weight: 600;
	padding: 3px 10px;
}

.lib-chip-on {
	background: var(--cs-color-gold);
	border: 1px solid #c89b00;
	color: var(--cs-color-ink);
}

.lib-chip-off {
	background: var(--cs-color-ticket);
	border: 1px dashed var(--cs-color-line);
	color: var(--cs-color-muted);
	min-width: 28px;
	text-align: center;
}

.lib-footer {
	display: flex;
	justify-content: flex-end;
	margin-top: 16px;
}
</style>
