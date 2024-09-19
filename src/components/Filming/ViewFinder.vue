<template>
	<div
		class="image-container"
		style="
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		"
	>
		<v-row class="side-by-side">
			<div class="image-wrapper">
				<img
					v-if="selectedImage"
					:src="selectedImage"
					alt="Viewfinder Image"
					:style="{ filter: computedFilter }"
				/>
			</div>
			<div class="slider-container">
				<!-- Soundband Target Slider -->
				<v-range-slider
					class="soundBandTarget no-pointer-events"
					v-model="soundBandTarget"
					readonly="true"
					thumb-size="0"
					direction="vertical"
					:min="audioRangeMin"
					:max="audioRangeMax"
					track-color="red"
					track-size="12"
					track-fill-color="green"
				></v-range-slider>
				<!-- User Adjusted Slider -->
				<v-range-slider
					class="soundBandSlider"
					v-model="soundBand"
					strict
					thumb-label="always"
					direction="vertical"
					:min="audioRangeMin"
					:max="audioRangeMax"
				></v-range-slider>
			</div>
		</v-row>
		<v-row class="sliders">
			<v-col>
				<label>
					Focus:
					<input
						type="range"
						v-model="focusValue"
						min="0"
						max="100"
						steps="1"
					/>
				</label>
			</v-col>
			<v-col>
				<label>
					Lighten:
					<input
						type="range"
						v-model="lightenValue"
						min="0"
						max="100"
						steps="1"
					/>
				</label>
			</v-col>
		</v-row>
		<v-btn
			:disabled="!shotReady"
			@click="wrapCurrentShot"
			class="mb-3"
			color="primary"
		>
			Action!
		</v-btn>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// Image list and index
			images: [
				require("@/assets/ShotArt/volcano.png"),
				require("@/assets/ShotArt/savanna.png"),
				require("@/assets/ShotArt/mountains.png"),
				require("@/assets/ShotArt/skichalet.png"),
				require("@/assets/ShotArt/hotsprings.png"),
				require("@/assets/ShotArt/river.png"),
				require("@/assets/ShotArt/desertpx.png"),
				require("@/assets/ShotArt/nightclub.png"),
				require("@/assets/ShotArt/office.png"),
				require("@/assets/ShotArt/ballroom.png"),
				require("@/assets/ShotArt/planetarium.png"),
				require("@/assets/ShotArt/bar.png"),
				require("@/assets/ShotArt/emptyfloor.png"),
				require("@/assets/ShotArt/classroom.png"),
				require("@/assets/ShotArt/wintercabin.png"),
				require("@/assets/ShotArt/trainstation.png"),
				require("@/assets/ShotArt/train.png"),
				require("@/assets/ShotArt/vineyard.png"),
				require("@/assets/ShotArt/fishtank.png"),
				require("@/assets/ShotArt/attic.png"),
				require("@/assets/ShotArt/meetingroom.png"),
				require("@/assets/ShotArt/library.png"),
				require("@/assets/ShotArt/greenhouse.png"),
				require("@/assets/ShotArt/brewery.png"),
				require("@/assets/ShotArt/church.png"),
				require("@/assets/ShotArt/circus.png"),
				require("@/assets/ShotArt/rooftop.png"),
				require("@/assets/ShotArt/constructionsite.png"),
				require("@/assets/ShotArt/diner.png"),
				require("@/assets/ShotArt/dormroom.png"),
				require("@/assets/ShotArt/elevators.png"),
				require("@/assets/ShotArt/ferry.png"),
				require("@/assets/ShotArt/garage.png"),
				require("@/assets/ShotArt/hauntedhouse.png"),
				require("@/assets/ShotArt/lighthouse.png"),
				require("@/assets/ShotArt/lockerroom.png"),
				require("@/assets/ShotArt/operahouse.png"),
				require("@/assets/ShotArt/grandballroom.png"),
				require("@/assets/ShotArt/flat.png"),
				require("@/assets/ShotArt/prisoncell.png"),
				require("@/assets/ShotArt/recordingstudio.png"),
				require("@/assets/ShotArt/courtroompx.png"),
				require("@/assets/ShotArt/icerinkpx.png"),
				require("@/assets/ShotArt/greenhousepx.png"),
				require("@/assets/ShotArt/beachpx.png"),
				require("@/assets/ShotArt/roadpx.png"),
				require("@/assets/ShotArt/templepx.png"),
				require("@/assets/ShotArt/canyonpx.png"),
				require("@/assets/ShotArt/cabinpx.png"),
				require("@/assets/ShotArt/delta.png"),
				require("@/assets/ShotArt/desert.png"),
				require("@/assets/ShotArt/fjord.png"),
				require("@/assets/ShotArt/graveyardpx.png"),
				require("@/assets/ShotArt/lavafield.png"),
				require("@/assets/ShotArt/marsh.png"),
				require("@/assets/ShotArt/mistymountains.png"),
				require("@/assets/ShotArt/museumpx.png"),
				require("@/assets/ShotArt/oasis.png"),
				require("@/assets/ShotArt/prairie.png"),
			],
			selectedImage: null,

			// Viewfinder Values
			focusValue: 0,
			lightenValue: 0,
			audioRangeMin: -45,
			audioRangeMax: -35,

			// soundBand values
			soundBand: [-42, -38],
			soundBandTarget: [-40, -36],
			calibrationThreshold: 1.25,

			// Limits for the soundBandTarget slider
			soundBandMinLowerLimit: -45, // Lower limit for the minimum value
			soundBandMinUpperLimit: -39, // Upper limit for the minimum value
			soundBandMaxLowerBuffer: 2, // Minimum gap between min and max values
			soundBandMaxUpperLimit: -35, // Upper limit for the maximum value
		};
	},
	computed: {
		computedFilter() {
			// Maximum blur amount (in px)
			const maxBlur = 25;
			const blurAmount = maxBlur * (1 - this.focusValue / 100);
			const minBrightness = 0.2;
			const brightnessAmount =
				minBrightness + (1 - minBrightness) * (this.lightenValue / 100);
			return `blur(${blurAmount}px) brightness(${brightnessAmount})`;
		},
		soundBandCalibrated() {
			const targetMin = this.soundBandTarget[0];
			const targetMax = this.soundBandTarget[1];
			const userMin = this.soundBand[0];
			const userMax = this.soundBand[1];

			return (
				Math.abs(userMin - targetMin) <= this.calibrationThreshold &&
				Math.abs(userMax - targetMax) <= this.calibrationThreshold
			);
		},
		shotReady() {
			return (
				this.soundBandCalibrated &&
				this.focusValue >= 99 &&
				this.lightenValue >= 99
			);
		},
	},
	methods: {
		wrapCurrentShot() {
			this.showRandomImage();
			this.generateRandomSoundBandTarget();
		},
		showRandomImage() {
			const randomIndex = Math.floor(Math.random() * this.images.length);
			this.selectedImage = this.images[randomIndex];
			// Reset focusValue and lightenValue to 0
			this.focusValue = 0;
			this.lightenValue = 0;
		},
		generateRandomSoundBandTarget() {
			const minLowerLimit = this.soundBandMinLowerLimit;
			const minUpperLimit = this.soundBandMinUpperLimit;

			const min =
				Math.floor(Math.random() * (minUpperLimit - minLowerLimit + 1)) +
				minLowerLimit;

			const maxLowerLimit = min + this.soundBandMaxLowerBuffer;
			const maxUpperLimit = this.soundBandMaxUpperLimit;

			const max =
				Math.floor(Math.random() * (maxUpperLimit - maxLowerLimit + 1)) +
				maxLowerLimit;

			// Set new soundBandTarget values
			this.soundBandTarget = [min, max];
		},
	},
	mounted() {
		this.wrapCurrentShot();
	},
};
</script>

<style scoped>
.image-container img {
	display: block;
	margin: 0 auto;
	transition: filter 0.3s ease;
}

.side-by-side {
	gap: 40px;
}

.slider-container {
	display: flex;
	flex-direction: row;
	gap: 20px;
}

.no-pointer-events {
	pointer-events: none; /* Disables interaction while keeping the appearance */
}

.soundBandSlider {
	height: 200px;
}

.soundBandTarget {
	height: 200px;
	border-radius: 0px !important; /* Remove rounding on the unfilled part */
}

.image-wrapper {
	width: 800px; /* Set your desired width */
	height: 449px; /* Set your desired height */
	position: relative;
	overflow: hidden; /* Hide any overflow */
}

.image-wrapper img {
	width: 100%;
	height: 100%;
	object-fit: cover; /* Use 'contain' if you prefer no cropping */
}

.sliders {
	padding-bottom: 0px;
}

.sliders label {
	display: block;
	margin: 10px 0;
	font-size: 18px;
}

.sliders input {
	width: 100%;
	max-width: 300px;
}
</style>
