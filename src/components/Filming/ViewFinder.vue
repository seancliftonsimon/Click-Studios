<template>
	<v-row class="side-by-side">
		<div
			class="image-container"
			style="
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			"
		>
			<div class="image-wrapper">
				<img
					v-if="selectedImage"
					:src="selectedImage"
					alt="Viewfinder Image"
					:style="{ filter: computedFilter }"
				/>
			</div>
		</div>
		<div class="slider-container">
			<!-- Soundband Target Slider -->
			<v-range-slider
				class="soundBandTarget no-pointer-events"
				v-model="soundBandTarget"
				:readonly="true"
				thumb-size="0"
				direction="vertical"
				:min="audioRangeMin"
				:max="audioRangeMax"
				track-color="red"
				track-size="12"
				track-fill-color="green"
			></v-range-slider>
			<!-- User Adjusv-range-sliderted Slider -->
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
		<v-col>
			<label>
				Focus:
				<input type="range" v-model="focusValue" min="0" max="100" steps="1" />
			</label>
		</v-col>
	</v-row>
	<div class="text-center">
		<v-btn @click="evaluateAndWrapShot" color="primary">
			<span style="font-size: 2em">📣</span> <span>Action!</span>
		</v-btn>

		<div v-if="lastShotFeedback.length > 0" class="mt-4 feedback-box">
			<div class="shot-score" :class="lastShotScoreClass">
				Shot Score: {{ lastShotScore }}%
			</div>
			<div
				v-for="(feedback, index) in lastShotFeedback"
				:key="index"
				class="feedback-item"
			>
				{{ feedback }}
			</div>
		</div>
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
			focusTarget: 0,
			lightenTarget: 0,
			focusThreshold: 4,
			lightenThreshold: 4,
			audioRangeMin: -45,
			audioRangeMax: -35,

			// soundBand values
			soundBand: [-42, -38],
			soundBandTarget: [-40, -36],
			calibrationThreshold: 0.75,

			// Limits for the soundBandTarget slider
			soundBandMinLowerLimit: -45, // Lower limit for the minimum value
			soundBandMinUpperLimit: -39, // Upper limit for the minimum value
			soundBandMaxLowerBuffer: 2, // Minimum gap between min and max values
			soundBandMaxUpperLimit: -35, // Upper limit for the maximum value
			lastShotFeedback: [],
			lastShotScore: 0,
		};
	},
	computed: {
		computedFilter() {
			// Calculate how far we are from targets
			const focusDelta = this.focusValue - this.focusTarget;
			const lightenDelta = this.lightenValue - this.lightenTarget;

			// Focus effects
			let focusEffect = "";
			const maxBlur = 25;
			const minBlur = 0.15; // Always maintain a tiny bit of blur

			if (focusDelta < 0) {
				// Under-focused: apply blur
				const blurAmount = maxBlur * (1 - this.focusValue / this.focusTarget);
				focusEffect = `blur(${Math.max(minBlur, blurAmount)}px)`;
			} else if (focusDelta > 0) {
				// Over-focused: apply blur that increases with distance from target
				const overFocusRatio = focusDelta / (100 - this.focusTarget);
				const blurAmount = maxBlur * overFocusRatio;
				focusEffect = `blur(${Math.max(minBlur, blurAmount)}px)`;
			} else {
				// At target: apply minimal blur
				focusEffect = `blur(${minBlur}px)`;
			}

			// Brightness effects
			let brightnessEffect = "";
			const minBrightness = 0.2;
			const baseContrast = 98; // Slightly reduce contrast always

			if (lightenDelta < 0) {
				// Under-exposed
				const brightnessAmount =
					minBrightness +
					(1 - minBrightness) * (this.lightenValue / this.lightenTarget);
				brightnessEffect = `brightness(${brightnessAmount}) contrast(${baseContrast}%)`;
			} else if (lightenDelta > 0) {
				// Over-exposed: increase brightness and reduce contrast to create wash-out effect
				const overExposeAmount = lightenDelta / (100 - this.lightenTarget);
				const brightnessAmount = 1 + overExposeAmount * 1.5;
				const contrastReduction = Math.max(0, 100 - overExposeAmount * 70);
				brightnessEffect = `brightness(${brightnessAmount}) contrast(${contrastReduction}%)`;
			} else {
				// At target: apply very subtle brightness/contrast adjustment
				brightnessEffect = `brightness(0.99) contrast(${baseContrast}%)`;
			}

			// Combine effects
			return `${focusEffect} ${brightnessEffect}`.trim();
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
				Math.abs(this.focusValue - this.focusTarget) <= this.focusThreshold &&
				Math.abs(this.lightenValue - this.lightenTarget) <=
					this.lightenThreshold
			);
		},
		actionButtonErrors() {
			let errors = [];

			if (Math.abs(this.focusValue - this.focusTarget) > this.focusThreshold) {
				if (this.focusValue < this.focusTarget) {
					errors.push("The image is too blurry");
				} else {
					errors.push("The image is too sharp");
				}
			}

			if (
				Math.abs(this.lightenValue - this.lightenTarget) > this.lightenThreshold
			) {
				if (this.lightenValue < this.lightenTarget) {
					errors.push("The image is too dark");
				} else {
					errors.push("The image is too bright");
				}
			}

			// Check sound band calibration
			if (!this.soundBandCalibrated) {
				const targetMin = this.soundBandTarget[0];
				const targetMax = this.soundBandTarget[1];
				const userMin = this.soundBand[0];
				const userMax = this.soundBand[1];

				// Determine specific sound range errors
				if (userMin < targetMin && userMax > targetMax) {
					errors.push(
						"The mic range is too large and will pick up extra noise"
					);
				}
				if (userMin > targetMin && userMax < targetMax) {
					errors.push(
						"The mic range is too narrow and won't pick up enough sound"
					);
				}
				if (userMin < targetMin && userMax < targetMax) {
					errors.push("The mic range is too low");
				}
				if (userMin > targetMin && userMax > targetMax) {
					errors.push("The mic range is too high");
				}
			}

			return errors;
		},
		lastShotScoreClass() {
			if (this.lastShotScore >= 90) return "score-excellent";
			if (this.lastShotScore >= 75) return "score-good";
			if (this.lastShotScore >= 50) return "score-fair";
			return "score-poor";
		},
		currentShotQuality() {
			let feedback = [];
			let totalScore = 0;

			// Evaluate focus (worth 35% of total score)
			const focusDelta = Math.abs(this.focusValue - this.focusTarget);
			const focusScore = Math.max(0, 100 - focusDelta * 2);
			totalScore += focusScore * 0.35;

			if (focusDelta > this.focusThreshold) {
				if (this.focusValue < this.focusTarget) {
					feedback.push("The image is too blurry");
				} else {
					feedback.push("The image is too sharp");
				}
			}

			// Evaluate brightness (worth 35% of total score)
			const lightenDelta = Math.abs(this.lightenValue - this.lightenTarget);
			const lightenScore = Math.max(0, 100 - lightenDelta * 2);
			totalScore += lightenScore * 0.35;

			if (lightenDelta > this.lightenThreshold) {
				if (this.lightenValue < this.lightenTarget) {
					feedback.push("The image is too dark");
				} else {
					feedback.push("The image is too bright");
				}
			}

			// Evaluate sound calibration (worth 30% of total score)
			const targetMin = this.soundBandTarget[0];
			const targetMax = this.soundBandTarget[1];
			const userMin = this.soundBand[0];
			const userMax = this.soundBand[1];

			const minDelta = Math.abs(userMin - targetMin);
			const maxDelta = Math.abs(userMax - targetMax);
			const soundScore = Math.max(0, 100 - (minDelta + maxDelta) * 20);
			totalScore += soundScore * 0.3;

			if (!this.soundBandCalibrated) {
				if (userMin < targetMin && userMax > targetMax) {
					feedback.push(
						"The mic range is too large and will pick up extra noise"
					);
				} else if (userMin > targetMin && userMax < targetMax) {
					feedback.push(
						"The mic range is too narrow and won't pick up enough sound"
					);
				} else if (userMin < targetMin && userMax < targetMax) {
					feedback.push("The mic range is too low");
				} else if (userMin > targetMin && userMax > targetMax) {
					feedback.push("The mic range is too high");
				}
			}

			// If everything is within thresholds, give a perfect 100%
			if (
				feedback.length === 0 &&
				focusDelta <= this.focusThreshold &&
				lightenDelta <= this.lightenThreshold &&
				this.soundBandCalibrated
			) {
				return {
					score: 100,
					feedback: ["Perfect shot! Everything is just right!"],
				};
			}

			return {
				score: Math.round(totalScore),
				feedback: feedback,
			};
		},
	},
	methods: {
		evaluateAndWrapShot() {
			const quality = this.currentShotQuality;
			this.lastShotScore = quality.score;
			this.lastShotFeedback = quality.feedback;

			// If the shot was perfect, add a special message
			if (quality.feedback.length === 0) {
				this.lastShotFeedback = ["Perfect shot! Everything is just right!"];
			}

			// Move to next shot
			this.showRandomImage();
			this.generateRandomSoundBandTarget();
		},
		showRandomImage() {
			const randomIndex = Math.floor(Math.random() * this.images.length);
			this.selectedImage = this.images[randomIndex];
			// Generate random target values between 20 and 80
			this.focusTarget = Math.floor(Math.random() * 61) + 20; // 20-80 range
			this.lightenTarget = Math.floor(Math.random() * 61) + 20; // 20-80 range
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
		this.evaluateAndWrapShot();
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
	flex-grow: 0;
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
	flex-grow: 0;
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

.feedback-box {
	border: 1px solid #ccc;
	border-radius: 8px;
	padding: 16px;
	margin-top: 16px;
	background-color: #f5f5f5;
	max-width: 600px;
	margin-left: auto;
	margin-right: auto;
}

.feedback-item {
	margin: 8px 0;
	color: #666;
}

.shot-score {
	font-size: 1.2em;
	font-weight: bold;
	margin-bottom: 12px;
	padding: 8px;
	border-radius: 4px;
}

.score-excellent {
	color: #2e7d32;
	background-color: #e8f5e9;
}

.score-good {
	color: #1976d2;
	background-color: #e3f2fd;
}

.score-fair {
	color: #f57c00;
	background-color: #fff3e0;
}

.score-poor {
	color: #c62828;
	background-color: #ffebee;
}
</style>
