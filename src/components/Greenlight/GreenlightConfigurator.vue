<template>
	<div v-if="visible" class="gl-overlay" @click.self="cancel">
		<v-card class="cs-modal gl-card">
			<div class="gl-header">
				<h2 class="cs-display gl-title">{{ stepTitle }}</h2>
				<v-btn icon="mdi-close" variant="text" size="small" @click="cancel" />
			</div>

			<!-- Breadcrumb -->
			<div class="gl-crumbs">
				<button
					class="gl-crumb"
					:class="{ 'gl-crumb-active': step === 1 }"
					:disabled="step === 1"
					@click="goTo(1)"
				>
					{{ step > 1 ? genreMeta.name : "Genre" }}
				</button>
				<span class="gl-crumb-sep">›</span>
				<button
					class="gl-crumb"
					:class="{ 'gl-crumb-active': step === 2 }"
					:disabled="step <= 2"
					@click="goTo(2)"
				>
					{{ step > 2 ? budget.name : "Budget" }}
				</button>
				<span class="gl-crumb-sep">›</span>
				<span class="gl-crumb" :class="{ 'gl-crumb-active': step === 3 }">
					Customize
				</span>
			</div>

			<!-- STEP 1: GENRE -->
			<div v-if="step === 1" class="gl-cards">
				<button
					v-for="g in genres"
					:key="g.key"
					class="gl-choice"
					@click="pickGenre(g.key)"
				>
					<span class="gl-choice-emoji">{{ g.emoji }}</span>
					<span class="gl-choice-name">{{ g.name }}</span>
				</button>
			</div>

			<!-- STEP 2: BUDGET -->
			<div v-if="step === 2" class="gl-cards">
				<button
					v-for="b in budgetTiers"
					:key="b.id"
					class="gl-choice gl-choice-wide"
					@click="pickBudget(b.id)"
				>
					<span class="gl-choice-emoji">{{ b.emoji }}</span>
					<span class="gl-choice-name">{{ b.name }}</span>
					<span class="gl-choice-meta">
						{{ $plural(b.counts.roles, "role") }} ·
						{{ $plural(b.counts.sets, "set") }} ·
						{{ $plural(b.counts.locations, "location") }} ·
						{{ $plural(b.counts.shots, "shot") }}
					</span>
				</button>
			</div>

			<!-- STEP 3: CUSTOMIZE -->
			<div v-if="step === 3" class="gl-customize">
				<SlotGroup
					title="Cast Roles"
					icon="person"
					:count="budget.counts.roles"
					:values="selectedRoles"
					:options="roleOptions"
					placeholder="Role"
					@set="setSlot('selectedRoles', $event.index, $event.value)"
					@randomize="
						randomize('selectedRoles', roleOptions, budget.counts.roles)
					"
				/>
				<SlotGroup
					title="Sets"
					icon="building"
					:count="budget.counts.sets"
					:values="selectedSets"
					:options="setOptions"
					placeholder="Set"
					@set="setSlot('selectedSets', $event.index, $event.value)"
					@randomize="randomize('selectedSets', setOptions, budget.counts.sets)"
				/>
				<SlotGroup
					title="Locations"
					icon="pin"
					:count="budget.counts.locations"
					:values="selectedLocations"
					:options="locationOptions"
					placeholder="Location"
					@set="setSlot('selectedLocations', $event.index, $event.value)"
					@randomize="
						randomize(
							'selectedLocations',
							locationOptions,
							budget.counts.locations
						)
					"
				/>

				<div class="gl-title-row">
					<span class="gl-group-title">🎬 Title</span>
					<v-text-field
						v-model="title"
						placeholder="Name your film"
						density="compact"
						variant="outlined"
						hide-details
						class="gl-title-input"
					/>
				</div>
			</div>

			<!-- Footer nav -->
			<div class="gl-footer">
				<v-btn
					v-if="step > 1"
					class="cs-button cs-button-warning"
					@click="step--"
				>
					Back
				</v-btn>
				<v-btn v-else class="cs-button cs-button-warning" @click="cancel">
					Cancel
				</v-btn>

				<div class="gl-footer-right">
					<v-btn
						v-if="step === 3"
						class="cs-button cs-button-secondary"
						@click="fillEmpty"
					>
						🎲 Fill empty
					</v-btn>
					<v-btn
						v-if="step === 3"
						class="cs-button cs-button-primary"
						:disabled="!canConfirm"
						@click="confirm"
					>
						Greenlight 🎬
					</v-btn>
				</div>
			</div>
		</v-card>
	</div>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";
import { budgetTiers, getBudgetTier } from "@/data/projectPools";
import SlotGroup from "./SlotGroup.vue";

const GENRES = [
	{ key: "horror", name: "Horror", emoji: "😱" },
	{ key: "comedy", name: "Comedy", emoji: "🤣" },
	{ key: "drama", name: "Drama", emoji: "🥲" },
	{ key: "action", name: "Action", emoji: "😎" },
];

export default {
	name: "GreenlightConfigurator",
	components: { SlotGroup },
	data() {
		return {
			budgetTiers,
			genres: GENRES,
			step: 1,
			genre: "drama",
			budgetId: "low",
			title: "",
			selectedRoles: [],
			selectedSets: [],
			selectedLocations: [],
		};
	},
	computed: {
		...mapState(useGameStore, [
			"greenlightVisible",
			"greenlightBudgetId",
			"currentGenre",
		]),
		visible() {
			return this.greenlightVisible;
		},
		stepTitle() {
			return (
				{
					1: "Pick a Genre",
					2: "Choose a Budget",
					3: "Build Your Film",
				}[this.step] || "Greenlight a Film"
			);
		},
		genreMeta() {
			return GENRES.find((g) => g.key === this.genre) || GENRES[0];
		},
		budget() {
			return getBudgetTier(this.budgetId) || budgetTiers[0];
		},
		roleOptions() {
			return useGameStore().unlockedRolesForGenre(this.genre);
		},
		setOptions() {
			return useGameStore().unlockedSets;
		},
		locationOptions() {
			return useGameStore().unlockedLocations;
		},
		canConfirm() {
			return (
				this.filled(this.selectedRoles) === this.budget.counts.roles &&
				this.filled(this.selectedSets) === this.budget.counts.sets &&
				this.filled(this.selectedLocations) === this.budget.counts.locations
			);
		},
	},
	watch: {
		greenlightVisible(open) {
			if (open) this.reset();
		},
	},
	methods: {
		reset() {
			this.step = 1;
			this.budgetId = this.greenlightBudgetId || "low";
			this.genre = this.currentGenre || "drama";
			this.title = "";
			this.selectedRoles = [];
			this.selectedSets = [];
			this.selectedLocations = [];
		},
		filled(arr) {
			return arr.filter(Boolean).length;
		},
		goTo(targetStep) {
			// Breadcrumb navigation only steps backward; choices are preserved.
			if (targetStep < this.step) this.step = targetStep;
		},
		pickGenre(key) {
			this.genre = key;
			this.selectedRoles = [];
			this.step = 2;
		},
		pickBudget(id) {
			this.budgetId = id;
			// Drop any picks beyond the new budget's slot counts.
			this.selectedRoles = this.selectedRoles.slice(0, this.budget.counts.roles);
			this.selectedSets = this.selectedSets.slice(0, this.budget.counts.sets);
			this.selectedLocations = this.selectedLocations.slice(
				0,
				this.budget.counts.locations
			);
			this.step = 3;
		},
		setSlot(key, index, value) {
			const next = [...this[key]];
			next[index] = value;
			this[key] = next;
		},
		fillEmpty() {
			this.fillOne("selectedRoles", this.roleOptions, this.budget.counts.roles);
			this.fillOne("selectedSets", this.setOptions, this.budget.counts.sets);
			this.fillOne(
				"selectedLocations",
				this.locationOptions,
				this.budget.counts.locations
			);
		},
		fillOne(key, options, count) {
			if (!options.length) return;
			const next = [...this[key]];
			for (let i = 0; i < count; i++) {
				if (!next[i]) {
					next[i] = options[Math.floor(Math.random() * options.length)];
				}
			}
			this[key] = next;
		},
		// Re-roll an entire category, overwriting all slots. Avoids back-to-back
		// duplicates when there are enough distinct options to allow it.
		randomize(key, options, count) {
			if (!options.length) return;
			const next = [];
			for (let i = 0; i < count; i++) {
				let pick = options[Math.floor(Math.random() * options.length)];
				if (options.length > 1) {
					let guard = 0;
					while (pick === next[i - 1] && guard < 8) {
						pick = options[Math.floor(Math.random() * options.length)];
						guard++;
					}
				}
				next.push(pick);
			}
			this[key] = next;
		},
		confirm() {
			useGameStore().confirmGreenlight({
				title: this.title.trim(),
				genre: this.genre,
				budgetId: this.budgetId,
				roles: this.selectedRoles.filter(Boolean),
				sets: this.selectedSets.filter(Boolean),
				locations: this.selectedLocations.filter(Boolean),
			});
		},
		cancel() {
			useGameStore().closeGreenlight();
		},
	},
};
</script>

<style scoped>
.gl-overlay {
	position: fixed;
	inset: 0;
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(21, 19, 19, 0.55);
	padding: 24px;
}

.gl-card {
	width: 100%;
	max-width: 840px;
	max-height: 90vh;
	overflow-y: auto;
	padding: 18px 22px 22px;
}

.gl-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.gl-title {
	font-size: 1.7em;
	color: var(--cs-color-curtain);
}

.gl-crumbs {
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin: 8px 0 18px;
}

.gl-crumb {
	background: none;
	border: none;
	color: var(--cs-color-muted);
	cursor: pointer;
	font-family: var(--cs-font-display);
	font-size: 1em;
	padding: 0;
}

.gl-crumb:not(:disabled):hover {
	color: var(--cs-color-night);
	text-decoration: underline;
}

.gl-crumb:disabled {
	cursor: default;
}

.gl-crumb-active {
	color: var(--cs-color-curtain);
	font-weight: 800;
}

.gl-crumb-sep {
	color: var(--cs-color-line);
	font-size: 1em;
}

/* Genre / budget choice grids */
.gl-cards {
	display: grid;
	gap: 12px;
	grid-template-columns: repeat(2, 1fr);
}

.gl-choice {
	align-items: center;
	background: var(--cs-color-white);
	border: 1px solid var(--cs-color-line);
	border-radius: var(--cs-radius-panel);
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 18px 14px;
	text-align: center;
	transition: all var(--cs-motion-fast);
}

.gl-choice:hover {
	border-color: var(--cs-color-night);
	transform: translateY(-2px);
}

.gl-choice-emoji {
	font-size: 2em;
}

.gl-choice-name {
	font-family: var(--cs-font-display);
	font-size: 1.15em;
}

.gl-choice-wide {
	align-items: flex-start;
	text-align: left;
}

.gl-choice-meta {
	color: var(--cs-color-muted);
	font-size: 0.78em;
}

/* Customize step */
.gl-customize {
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.gl-title-row {
	align-items: center;
	display: flex;
	gap: 14px;
}

.gl-group-title {
	font-family: var(--cs-font-display);
	font-size: 1.05em;
	white-space: nowrap;
}

.gl-title-input {
	max-width: 340px;
}

.gl-footer {
	align-items: center;
	border-top: 1px solid var(--cs-color-line);
	display: flex;
	justify-content: space-between;
	margin-top: 18px;
	padding-top: 16px;
}

.gl-footer-right {
	display: flex;
	gap: 10px;
}
</style>
