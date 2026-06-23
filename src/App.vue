<!-- App.vue Component -->
<template>
	<v-app>
		<!-- Global Toast Notification -->
		<v-snackbar
			v-model="toastVisible"
			:timeout="toastType === 'temporary' ? 4000 : -1"
			location="top right"
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

		<v-row class="mb-0">
			<!-- Permanent Navigation Bar -->
			<v-app-bar color="#931621" permanent class="game-app-bar">
				<div class="image-container">
					<img :src="ticketImage" alt="Click Studios" class="ticket-image" />
					<span
						style="width: 100%"
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
					<v-btn size="small" @click="saveGame">Save</v-btn>
					<v-btn size="small" @click="loadGame">Load</v-btn>
					<v-btn size="small" color="error" @click="resetGame">Reset</v-btn>
				</div>
			</v-app-bar>

			<!-- Main Area -->
			<v-main>
				<PopupManager v-if="!isMockupRoute" />
				<GuidedHintManager v-if="!isMockupRoute" />
				<router-view />
			</v-main>
			</v-row>
		</v-app>
</template>

<script>
import PopupManager from "./components/ui/PopupManager.vue";
import GuidedHintManager from "./components/ui/GuidedHintManager.vue";
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
		]),
		toastVisible: {
			get() {
				return useGameStore().toastVisible;
			},
			set(value) {
				useGameStore().SET_TOAST_VISIBLE(value);
			},
		},
		titleFontSize() {
			if (this.studioName.length >= 28) {
				return "1.2em";
			} else if (this.studioName.length >= 16 && this.studioName.length <= 27) {
				return "1.5em";
			} else if (this.studioName.length <= 15) {
				return "2em";
			}
			return "1em";
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
	background-color: rgb(249, 155, 31);
	font-weight: bold;
}

.spend-words-btn span {
	font-weight: 500;
}

.spend-words-btn:disabled {
	opacity: 0.4;
	font-weight: normal;
}

.spend-money-btn {
	background-color: rgb(50, 207, 50);
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
	font-family: "Voltaire", sans-serif;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #4a4a4a; /* Adjust text color as needed */
	font-weight: bold;
	line-height: 1em;
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
</style>

<!--Replace this code with a 'for' thing that can handle the states by reading them from a data object somewhere
<SidebarPhase title="Writing" :locked="false" />
<SidebarPhase title="Preproduction" :locked="true" />
<SidebarPhase title="Filming" :locked="true" />
<SidebarPhase title="Postproduction" :locked="true" />
<SidebarPhase title="Marketing" :locked="true" />
<SidebarPhase title="Release" :locked="true" /> -->
