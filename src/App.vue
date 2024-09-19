<!-- App.vue Component -->
<template>
	<v-app>
		<v-row class="mb-0">
			<img :src="bannerImage" alt="Prototype Banner" class="banner-image" />
			<!-- Permanent Navigation Bar -->
			<v-app-bar color="#931621" permanent>
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
						:title="
							preproductionDisabled ? '🔒 Preproduction' : 'Preproduction'
						"
						:disabled="preproductionDisabled"
					></v-list-item>

					<v-list-item
						:to="{ name: 'filming' }"
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
					<v-row>
						<v-btn @click="saveGame">Save Game</v-btn>
						<v-btn @click="loadGame">Load Game</v-btn>
					</v-row>
				</v-container>
			</v-app-bar>

			<!-- Main Area -->
			<v-main>
				<PopupComponent />
				<router-view />
			</v-main>
		</v-row>
	</v-app>
</template>

<script>
import PopupComponent from "./components/PopupComponent.vue";
import { mapGetters } from "vuex";
export default {
	name: "App",
	components: {
		PopupComponent,
	},
	data() {
		return {
			ticketImage: require("@/assets/title-ticket.png"),
			bannerImage: require("@/assets/SuperEarlyPrototypeBanner.png"),
		};
	},
	methods: {
		saveGame() {
			this.$store.commit("SAVE_STATE");
			console.log("Game Saved");
		},
		loadGame() {
			this.$store.commit("LOAD_STATE");
			console.log("Game Loaded");
		},
	},
	computed: {
		...mapGetters([
			"studioName",
			"isPreproductionUnlocked",
			"isFilmingUnlocked",
			"isPostproductionUnlocked",
			"isMarketingUnlocked",
			"isReleaseUnlocked",
		]),
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
	},
	mounted() {
		// Dispatch the action when the component mounts
		this.$store.dispatch("updateWordCount");
		this.$store.dispatch("showPopup", "tutorialOne");
		// XYZ this is where the beginner pop ups need to be reactivated
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
	position: relative;
	text-align: center;
	height: 100%;
}
.ticket-image {
	height: 100%;
}

.banner-image {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 1005;
	width: auto;
	height: 200px;
	pointer-events: none;
}

.phase-label {
	font-family: "Voltaire", sans-serif;
	font-size: 18px;
	color: white;
	text-align: center;
	display: flex;
	height: 75%;
	flex-direction: row;
	justify-content: space-around;
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
	align-self: center;
}
.v-list-item-title {
	font-size: 1.2em;
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
