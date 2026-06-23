<template>
	<div v-if="visible" class="gdp" :class="{ 'gdp-collapsed': collapsed }">
		<button class="gdp-toggle" @click="collapsed = !collapsed">
			🎬 Greenlight Test {{ collapsed ? "▸" : "▾" }}
		</button>

		<div v-if="!collapsed" class="gdp-body">
			<div class="gdp-row">
				<button class="gdp-btn gdp-btn-budget gdp-btn-wide" @click="open">
					🎬 Greenlight a Film
				</button>
			</div>
			<div class="gdp-row">
				<button class="gdp-btn gdp-btn-wide" @click="openLibrary">
					📚 Studio Library
				</button>
			</div>

			<div class="gdp-label">
				Unlock more options
				<span class="gdp-genre">(roles → {{ currentGenre }})</span>
			</div>
			<div class="gdp-row">
				<button class="gdp-btn" @click="unlock('roles')">+ Role</button>
				<button class="gdp-btn" @click="unlock('sets')">+ Set</button>
				<button class="gdp-btn" @click="unlock('locations')">
					+ Location
				</button>
				<button class="gdp-btn" @click="unlock('shots')">+ Shot</button>
			</div>

			<div class="gdp-counts">
				roles({{ currentGenre }}): {{ unlocks.roles[currentGenre] }} · sets:
				{{ unlocks.sets }} · loc: {{ unlocks.locations }} · shots:
				{{ unlocks.shots }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "pinia";
import { useGameStore } from "@/store";

export default {
	name: "GreenlightDebugPanel",
	data() {
		return { collapsed: false, visible: false };
	},
	computed: {
		...mapState(useGameStore, ["currentGenre", "projectUnlocks"]),
		unlocks() {
			return this.projectUnlocks;
		},
	},
	methods: {
		open() {
			useGameStore().openGreenlight();
		},
		openLibrary() {
			useGameStore().openLibrary();
		},
		unlock(category) {
			useGameStore().unlockNextProjectTier({ category });
		},
		toggleVisible() {
			this.visible = !this.visible;
			if (this.visible) this.collapsed = false;
		},
		onKeydown(event) {
			if (event.metaKey || event.ctrlKey || event.altKey) return;
			if (event.code === "Backquote" || event.key === "`" || event.key === "~") {
				event.preventDefault();
				this.toggleVisible();
			}
		},
	},
	mounted() {
		window.addEventListener("keydown", this.onKeydown);
	},
	beforeUnmount() {
		window.removeEventListener("keydown", this.onKeydown);
	},
};
</script>

<style scoped>
.gdp {
	position: fixed;
	bottom: 14px;
	left: 14px;
	z-index: 1900;
	background: var(--cs-color-ticket);
	border: 1px solid var(--cs-color-curtain);
	border-radius: var(--cs-radius-panel);
	box-shadow: var(--cs-shadow-soft);
	padding: 8px;
	width: 280px;
	font-family: var(--cs-font-body);
}

.gdp-collapsed {
	width: auto;
}

.gdp-toggle {
	background: var(--cs-color-curtain);
	border: none;
	border-radius: var(--cs-radius-control);
	color: var(--cs-color-white);
	cursor: pointer;
	font-weight: 800;
	padding: 6px 10px;
	width: 100%;
}

.gdp-body {
	margin-top: 8px;
}

.gdp-label {
	color: var(--cs-color-muted);
	font-size: 0.78em;
	font-weight: 800;
	margin: 8px 0 4px;
	text-transform: uppercase;
	letter-spacing: 0.04em;
}

.gdp-genre {
	color: var(--cs-color-curtain);
	text-transform: none;
}

.gdp-row {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
}

.gdp-btn {
	background: var(--cs-color-gold);
	border: 1px solid #c89b00;
	border-radius: var(--cs-radius-control);
	cursor: pointer;
	font-size: 0.8em;
	font-weight: 700;
	padding: 4px 9px;
}

.gdp-btn-budget {
	background: var(--cs-color-night);
	border-color: #202852;
	color: var(--cs-color-white);
}

.gdp-btn-wide {
	width: 100%;
	font-size: 0.9em;
	padding: 7px 9px;
}

.gdp-counts {
	color: var(--cs-color-muted);
	font-size: 0.74em;
	margin-top: 8px;
}
</style>
