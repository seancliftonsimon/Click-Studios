<template>
	<v-card class="mt-4">
		<v-row>
			<v-col cols="4">
				<v-row align="center" class="my-1" justify="space-around">
					<span class="genre-name"> {{ selectedGenreName }}</span>
					<v-chip class="align-right" color="primary" label>
						Level {{ currentGenreDetails.level }}
					</v-chip>
				</v-row>
				<v-row align="center">
					<v-select
						v-if="switchGenreVisible"
						:items="genreNames"
						v-model="selectedGenreName"
						item-text="name"
						item-value="name"
						class="pl-4 pr-0"
					></v-select
				></v-row>
			</v-col>
			<v-col cols="8" class="d-flex flex-column justify-center">
				<v-progress-linear
					:model-value="progress"
					class="rounded-t-lg text-red-darken-4 bg-red-lighten-4"
					:height="60"
				>
					<div>
						<span style="font-size: 2em">{{ emoji }}</span>
					</div>
				</v-progress-linear>
				<div
					class="align-under text-center rounded-b-lg text-red-darken-4 bg-red-lighten-4"
				>
					{{ $formatNumber(wordsToNextLevel) }} words until Level
					{{ currentGenreDetails.level + 1 }}
				</div>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
	data() {
		return {
			selectedGenreName: "", // This will hold the selected genre name
		};
	},
	computed: {
		...mapState({
			genres: (state) => state.genres,
		}),
		...mapGetters({
			currentGenreDetails: "currentGenreDetails",
			switchGenreVisible: "switchGenreVisible",
		}),
		genreNames() {
			return Object.values(this.genres).map((genre) => genre.name);
		},

		currentLevelCap() {
			return this.currentGenreDetails.level > 0
				? this.$store.state.levelCaps[this.currentGenreDetails.level - 1]
				: 0;
		},
		nextLevelCap() {
			return this.currentGenreDetails.level < this.$store.state.levelCaps.length
				? this.$store.state.levelCaps[this.currentGenreDetails.level]
				: this.currentLevelCap;
		},
		wordsToNextLevel() {
			return this.currentGenreDetails.wordsNeeded
		},
		progress() {
			const wordsProgressed =
				this.nextLevelCap - this.currentGenreDetails.wordsNeeded;
			let progress = (wordsProgressed / this.nextLevelCap) * 100;
			return Math.min(Math.max(progress, 0), 100); // Ensure progress is between 0 and 100
		},
		emoji() {
			return this.currentGenreDetails.emoji;
		},
	},
	watch: {
		selectedGenreName(newValue) {
			this.handleGenreChange(newValue);
		},
	},
	methods: {
		...mapMutations({
			setCurrentGenre: "SET_CURRENT_GENRE",
		}),
		updateGenre(value) {
			this.setCurrentGenre(value);
		},
		handleGenreChange(selectedGenreName) {
			console.log("Genre selected:", selectedGenreName);
			// Find the genre key from the genre name
			const genreKey = Object.keys(this.genres).find(
				(key) => this.genres[key].name === selectedGenreName
			);
			if (genreKey) {
				this.setCurrentGenre(genreKey); // Dispatch the mutation with the genre key
			}
		},
	},
	mounted() {
		this.selectedGenreName = this.currentGenreDetails.name; // Set initial selected genre name
	},
};
</script>

<style scoped>
.v-card {
	padding: 8px;
}
.center-content {
	display: flex;
	flex-direction: column;
	justify-content: center; /* Vertically center the content */
	align-self: center; /* Horizontally center the content */
}

.row-content {
	display: flex;
	flex-direction: column;
}
.center-button {
	display: flex;
	flex-direction: column;
	justify-content: center; /* Vertically center the content */
	align-items: center; /* Horizontally center the content */
	padding-top: 30px;
	margin-bottom: -20px;
}

.genre-name {
	font-family: Roboto;
	font-weight: normal;
	font-size: 22px;
}

.align-under {
	align-self: center;
	align-items: center; /* Horizontally center the content */
	width: 100%;
}
</style>
