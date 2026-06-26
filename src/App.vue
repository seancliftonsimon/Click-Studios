<!-- App.vue Component -->
<template>
	<v-app>
		<!-- Global Toast Notification -->
		<v-snackbar
			v-model="toastVisible"
			:timeout="toastType === 'temporary' ? 4000 : -1"
			:location="isCompact ? 'top' : 'top right'"
			color="success"
		>
			{{ toastMessage }}
			<template v-slot:actions v-if="toastType === 'persistent'">
				<v-btn
					icon="mdi-close"
					size="small"
					variant="text"
					@click="hideToast"
				></v-btn>
			</template>
		</v-snackbar>

		<!-- Permanent Navigation Bar (desktop) -->
		<v-app-bar
			v-if="!isCompact"
			color="curtain-red"
			permanent
			class="game-app-bar"
		>
				<div class="image-container">
					<img :src="ticketImage" alt="Click Studios" class="ticket-image" />
					<span
						:style="{ fontSize: titleFontSize }"
						class="title-text"
					>
						{{ studioName }}
					</span>
				</div>
				<v-container class="phase-label">
					<!-- Writing -->
					<v-list-item :to="{ name: 'writing' }" title="Writing"></v-list-item>

					<!-- Preproduction -->
					<v-list-item
						:to="{ name: 'preproduction' }"
						data-guidance-target="preproduction-nav"
						:title="
							preproductionDisabled ? '🔒 Preproduction' : 'Preproduction'
						"
						:disabled="preproductionDisabled"
					></v-list-item>

					<v-list-item
						:to="{ name: 'filming' }"
						data-guidance-target="filming-nav"
						:title="filmingDisabled ? '🔒 Filming' : 'Filming'"
						:disabled="filmingDisabled"
					></v-list-item>

					<v-list-item
						:to="{ name: 'postproduction' }"
						:title="
							postproductionDisabled ? '🔒 Postproduction' : 'Postproduction'
						"
						:disabled="postproductionDisabled"
					></v-list-item>

					<v-list-item
						:to="{ name: 'marketing' }"
						:title="marketingDisabled ? '🔒 Marketing' : 'Marketing'"
						:disabled="marketingDisabled"
					></v-list-item>

					<v-list-item
						:to="{ name: 'release' }"
						:title="releaseDisabled ? '🔒 Release' : 'Release'"
						:disabled="releaseDisabled"
					></v-list-item>
				</v-container>
				<span class="alpha-note">Very early alpha</span>
				<div class="game-actions">
					<v-btn
						size="small"
						class="cs-button cs-button-secondary"
						@click="saveGame"
						>Save</v-btn
					>
					<v-btn
						size="small"
						class="cs-button cs-button-secondary"
						@click="loadGame"
						>Load</v-btn
					>
					<v-btn
						size="small"
						class="cs-button cs-button-warning"
						@click="resetGame"
						>Reset</v-btn
					>
				</div>
			</v-app-bar>

			<!-- Compact header (mobile portrait) -->
			<v-app-bar
				v-else
				color="curtain-red"
				:height="56"
				flat
				class="game-app-bar-mobile"
			>
				<div class="mobile-brand">
					<img :src="ticketImage" alt="Click Studios" class="mobile-ticket" />
					<span class="mobile-studio-name">{{ studioName }}</span>
				</div>
				<v-spacer />
				<v-chip class="cs-chip mobile-money-chip" size="small">
					${{ $formatNumber(writingDollarCount) }}
				</v-chip>
				<v-menu location="bottom end">
					<template v-slot:activator="{ props }">
						<v-btn
							icon="mdi-dots-vertical"
							variant="text"
							color="white"
							v-bind="props"
							aria-label="More options"
						></v-btn>
					</template>
					<v-list class="mobile-actions-menu" density="compact">
						<v-list-item title="Save" @click="saveGame"></v-list-item>
						<v-list-item title="Load" @click="loadGame"></v-list-item>
						<v-list-item title="Reset" @click="resetGame"></v-list-item>
					</v-list>
				</v-menu>
			</v-app-bar>

			<!-- Main Area -->
			<v-main>
				<PopupManager v-if="!isMockupRoute" />
				<GuidedHintManager v-if="!isMockupRoute" />
				<GreenlightConfigurator v-if="!isMockupRoute" />
				<StudioLibrary v-if="!isMockupRoute" />
				<GreenlightDebugPanel v-if="!isMockupRoute" />
				<router-view />
			</v-main>

			<!-- Phase navigation (mobile portrait) -->
			<v-bottom-navigation
				v-if="isCompact && !isMockupRoute"
				v-model="activePhase"
				color="academy-gold"
				bg-color="curtain-red"
				:height="64"
				grow
				class="game-bottom-nav safe-bottom"
			>
				<v-btn
					v-for="phase in phaseNav"
					:key="phase.value"
					:value="phase.value"
					:to="phase.disabled ? undefined : { name: phase.value }"
					:disabled="phase.disabled"
					class="phase-nav-btn"
				>
					<v-icon>{{ phase.disabled ? "mdi-lock" : phase.icon }}</v-icon>
					<span class="phase-nav-label">{{ phase.label }}</span>
				</v-btn>
			</v-bottom-navigation>
		</v-app>
</template>

<script>
import PopupManager from "./components/ui/PopupManager.vue";
import GuidedHintManager from "./components/ui/GuidedHintManager.vue";
import GreenlightConfigurator from "./components/Greenlight/GreenlightConfigurator.vue";
import StudioLibrary from "./components/Greenlight/StudioLibrary.vue";
import GreenlightDebugPanel from "./components/Debug/GreenlightDebugPanel.vue";
import { mapState } from "pinia";
import { useGameStore } from "@/store";
import { useGuidanceStore } from "@/stores/guidanceStore";
import { usePreproductionStore } from "@/stores/preproductionStore";
import { AUTO_SAVE_INTERVAL_MS } from "@/services/saveService";
import { popupService } from "./services";

export default {
	name: "App",
	components: {
		PopupManager,
		GuidedHintManager,
		GreenlightConfigurator,
		StudioLibrary,
		GreenlightDebugPanel,
	},
	data() {
		return {
			ticketImage: require("@/assets/title-ticket.png"),
			autoSaveIntervalId: null,
		};
	},
	methods: {
		saveContext() {
			return {
				guidanceStore: useGuidanceStore(),
				preproductionStore: usePreproductionStore(),
			};
		},
		saveGame() {
			useGameStore().SAVE_STATE({
				...this.saveContext(),
				download: true,
			});
			console.log("Game Saved");
		},
		loadGame() {
			useGameStore().LOAD_STATE(this.saveContext());
			console.log("Game Loaded");
		},
		resetGame() {
			if (
				!window.confirm(
					"Reset your game and delete the local save? This cannot be undone."
				)
			) {
				return;
			}

			popupService.clearAllPopups();
			useGameStore().RESET_STATE(this.saveContext());
			this.showWelcomeIfNeeded();
		},
		autoSaveGame() {
			useGameStore().SAVE_STATE({
				...this.saveContext(),
				label: "Autosave",
			});
		},
		startAutoSave() {
			if (this.autoSaveIntervalId) return;

			this.autoSaveIntervalId = window.setInterval(
				this.autoSaveGame,
				AUTO_SAVE_INTERVAL_MS
			);
			window.addEventListener("beforeunload", this.autoSaveGame);
		},
		stopAutoSave() {
			if (this.autoSaveIntervalId) {
				window.clearInterval(this.autoSaveIntervalId);
				this.autoSaveIntervalId = null;
			}
			window.removeEventListener("beforeunload", this.autoSaveGame);
		},
		hideToast() {
			useGameStore().SET_TOAST_VISIBLE(false);
		},
		showWelcomeIfNeeded() {
			const guidanceStore = useGuidanceStore();
			guidanceStore.hydrate();

			if (guidanceStore.welcomeCompleted) {
				guidanceStore.startCoreTutorial();
				return;
			}

			popupService.showPopup("tutorial_welcome", {
				onSubmit: () => {
					guidanceStore.markWelcomeComplete();
					guidanceStore.startCoreTutorial();
				},
			});
		},
	},
	computed: {
		...mapState(useGameStore, [
			"studioName",
			"isPreproductionUnlocked",
			"isFilmingUnlocked",
			"isPostproductionUnlocked",
			"isMarketingUnlocked",
			"isReleaseUnlocked",
			"toastMessage",
			"toastType",
			"writingDollarCount",
		]),
		isCompact() {
			return this.$vuetify.display.smAndDown;
		},
		phaseNav() {
			return [
				{
					value: "writing",
					label: "Write",
					icon: "mdi-pencil",
					disabled: false,
				},
				{
					value: "preproduction",
					label: "Prep",
					icon: "mdi-clipboard-text",
					disabled: this.preproductionDisabled,
				},
				{
					value: "filming",
					label: "Film",
					icon: "mdi-movie-open",
					disabled: this.filmingDisabled,
				},
				{
					value: "postproduction",
					label: "Post",
					icon: "mdi-content-cut",
					disabled: this.postproductionDisabled,
				},
				{
					value: "marketing",
					label: "Promo",
					icon: "mdi-bullhorn",
					disabled: this.marketingDisabled,
				},
				{
					value: "release",
					label: "Release",
					icon: "mdi-ticket",
					disabled: this.releaseDisabled,
				},
			];
		},
		activePhase: {
			get() {
				return this.$route.name;
			},
			set() {
				// Navigation is handled by each tab's :to binding.
			},
		},
		toastVisible: {
			get() {
				return useGameStore().toastVisible;
			},
			set(value) {
				useGameStore().SET_TOAST_VISIBLE(value);
			},
		},
		titleFontSize() {
			if (this.studioName.length <= 12) {
				return "2em";
			} else if (this.studioName.length <= 18) {
				return "1.6em";
			} else if (this.studioName.length <= 24) {
				return "1.32em";
			} else if (this.studioName.length <= 32) {
				return "1.08em";
			} else if (this.studioName.length <= 42) {
				return "0.94em";
			}
			return "0.82em";
		},
		preproductionDisabled() {
			return !this.isPreproductionUnlocked;
		},
		filmingDisabled() {
			return !this.isFilmingUnlocked;
		},
		postproductionDisabled() {
			return !this.isPostproductionUnlocked;
		},
		marketingDisabled() {
			return !this.isMarketingUnlocked;
		},
		releaseDisabled() {
			return !this.isReleaseUnlocked;
		},
		isMockupRoute() {
			return this.$route.meta.mockup === true;
		},
	},
	mounted() {
		// Dispatch the action when the component mounts
		useGameStore().updateWordCount();
		this.$router.isReady().then(() => {
			if (!this.isMockupRoute) {
				this.showWelcomeIfNeeded();
			}
		});
		this.startAutoSave();
	},
	beforeUnmount() {
		this.stopAutoSave();
	},
};
</script>

<style>
.spend-words-btn {
	background: var(--cs-color-curtain) !important;
	border: 1px solid #6f1019;
	border-radius: var(--cs-radius-control) !important;
	box-shadow: 3px 3px 0 rgba(21, 19, 19, 0.2);
	color: var(--cs-color-white) !important;
	font-weight: 800;
	text-transform: none;
}

.spend-words-btn span {
	font-weight: 500;
}

.spend-words-btn:disabled {
	opacity: 0.4;
	font-weight: normal;
}

.spend-money-btn {
	background: var(--cs-color-night) !important;
	border: 1px solid #202852;
	border-radius: var(--cs-radius-control) !important;
	box-shadow: 3px 3px 0 rgba(21, 19, 19, 0.2);
	color: var(--cs-color-white) !important;
	font-weight: 800;
	text-transform: none;
}

.spend-money-btn span {
	font-weight: 500;
}

.spend-money-btn:disabled {
	opacity: 0.4;
	font-weight: normal;
}

#app {
	position: relative;
	overflow: hidden;
}

.image-container {
	flex: 0 0 240px;
	position: relative;
	text-align: center;
	height: 100%;
	min-width: 190px;
}
.ticket-image {
	height: 100%;
}

.alpha-note {
	flex: 0 0 auto;
	align-self: center;
	margin-right: 12px;
	padding: 2px 8px;
	border: 1px solid rgba(255, 255, 255, 0.55);
	border-radius: 4px;
	font-family: "Voltaire", sans-serif;
	font-size: 12px;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: white;
	white-space: nowrap;
	opacity: 0.85;
}

.phase-label {
	align-items: center;
	font-family: "Voltaire", sans-serif;
	font-size: 18px;
	color: white;
	text-align: center;
	display: flex;
	flex: 1 1 auto;
	gap: 4px;
	height: 75%;
	flex-direction: row;
	justify-content: flex-start;
	min-width: 0;
	overflow: hidden;
	padding-left: 8px;
	padding-right: 8px;
}

.game-actions {
	align-items: center;
	display: flex;
	flex: 0 0 auto;
	gap: 6px;
	padding-right: 14px;
}

.game-actions .v-btn {
	font-family: "Voltaire", sans-serif;
	min-width: 54px;
}

.title-text {
	color: var(--cs-color-muted);
	display: block;
	font-family: var(--cs-font-display);
	font-weight: bold;
	left: 50%;
	line-height: 1em;
	max-width: 146px;
	overflow: hidden;
	position: absolute;
	text-overflow: ellipsis;
	top: 50%;
	transform: translate(-50%, -50%);
	white-space: nowrap;
	width: max-content;
}

.v-list-item {
	display: flex;
	flex: 0 1 auto;
	align-self: center;
	min-width: fit-content;
	padding-left: 8px;
	padding-right: 8px;
}
.v-list-item-title {
	font-size: 1.05em;
	overflow: visible;
	white-space: nowrap;
}
.v-list-item__content {
	overflow: visible;
	white-space: nowrap;
}

/* --- Mobile portrait shell --- */
.game-app-bar-mobile .v-toolbar__content {
	padding-left: 12px;
	padding-right: 4px;
}

.mobile-brand {
	align-items: center;
	display: flex;
	gap: 8px;
	min-width: 0;
	overflow: hidden;
}

.mobile-ticket {
	height: 34px;
	flex: 0 0 auto;
}

.mobile-studio-name {
	color: white;
	font-family: var(--cs-font-display);
	font-size: 1.15rem;
	font-weight: bold;
	line-height: 1.1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.mobile-money-chip {
	font-variant-numeric: tabular-nums;
	margin-right: 2px;
}

.game-bottom-nav {
	border-top: 2px solid rgba(255, 255, 255, 0.16);
}

.phase-nav-btn {
	min-width: 0 !important;
	padding: 0 !important;
}

.phase-nav-label {
	font-family: var(--cs-font-display);
	font-size: 0.7rem;
	letter-spacing: 0.01em;
	margin-top: 2px;
	text-transform: none;
}
</style>

<!--Replace this code with a 'for' thing that can handle the states by reading them from a data object somewhere
<SidebarPhase title="Writing" :locked="false" />
<SidebarPhase title="Preproduction" :locked="true" />
<SidebarPhase title="Filming" :locked="true" />
<SidebarPhase title="Postproduction" :locked="true" />
<SidebarPhase title="Marketing" :locked="true" />
<SidebarPhase title="Release" :locked="true" /> -->
