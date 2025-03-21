<template>
	<div class="shot-timeline-container">
		<h2 class="text-h5 mb-4">Shot Timeline</h2>

		<!-- Visual Option 1: Basic Card Timeline -->
		<v-card class="mb-6">
			<v-card-title class="text-subtitle-1"
				>Option 1: Card Timeline</v-card-title
			>
			<v-card-text class="position-relative pa-0">
				<div class="timeline-wrapper">
					<div class="d-flex flex-nowrap shot-timeline">
						<v-card
							v-for="shot in shots"
							:key="'card-' + shot.id"
							:class="['shot-card', getStatusClass(shot.status)]"
							width="90"
							height="65"
							variant="outlined"
							class="ma-1"
						>
							<v-card-text class="pa-1">
								<div class="text-center shot-number">{{ shot.id }}</div>
								<div
									v-if="shot.status === 'completed'"
									class="shot-score text-center"
								>
									{{ shot.score }}%
								</div>
							</v-card-text>
						</v-card>
					</div>
				</div>
			</v-card-text>
		</v-card>

		<!-- Visual Option 4: Stepper Timeline -->
		<v-card class="mb-6">
			<v-card-title class="text-subtitle-1"
				>Option 4: Stepper Timeline</v-card-title
			>
			<v-card-text class="position-relative pa-0">
				<div class="stepper-wrapper">
					<v-stepper alt-labels flat class="shots-stepper">
						<v-stepper-header>
							<template
								v-for="(shot, index) in shots.slice(0, 10)"
								:key="'stepper-' + shot.id"
							>
								<v-stepper-item
									:value="shot.id"
									:complete="shot.status === 'completed'"
									:class="getStatusClass(shot.status)"
								>
									<template v-slot:title>
										{{ shot.id }}
									</template>
									<template v-slot:subtitle v-if="shot.status === 'completed'">
										{{ shot.score }}%
									</template>
								</v-stepper-item>
								<v-divider v-if="index < 9"></v-divider>
							</template>
						</v-stepper-header>
					</v-stepper>
					<div class="d-flex justify-end mt-2 px-3 pb-2">
						<span class="text-caption">
							Showing first 10 shots. Full timeline has
							{{ shots.length }} shots.
						</span>
					</div>
				</div>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			shots: Array.from({ length: 40 }, (_, i) => ({
				id: i + 1,
				status: this.getRandomStatus(),
				score: this.getRandomScore(),
			})),
		};
	},
	methods: {
		getRandomStatus() {
			const statuses = ["pending", "current", "completed"];
			const weights = [0.6, 0.1, 0.3]; // 60% pending, 10% current, 30% completed
			const random = Math.random();
			let sum = 0;
			for (let i = 0; i < weights.length; i++) {
				sum += weights[i];
				if (random < sum) return statuses[i];
			}
			return statuses[0];
		},
		getRandomScore() {
			return Math.floor(Math.random() * 101); // 0-100
		},
		getStatusClass(status) {
			switch (status) {
				case "pending":
					return "shot-pending";
				case "current":
					return "shot-current";
				case "completed":
					return "shot-completed";
				default:
					return "";
			}
		},
		getScoreColor(score) {
			if (score >= 90) return "success";
			if (score >= 75) return "info";
			if (score >= 50) return "warning";
			return "error";
		},
		chunkArray(array, size) {
			const result = [];
			for (let i = 0; i < array.length; i += size) {
				result.push(array.slice(i, i + size));
			}
			return result;
		},
	},
};
</script>

<style scoped>
.shot-timeline-container {
	margin-bottom: 24px;
	width: 100%;
	box-sizing: border-box;
}

.timeline-wrapper {
	overflow-x: auto;
	width: 100%;
	padding: 16px 16px 8px 16px;
}

.stepper-wrapper {
	width: 100%;
	overflow: hidden;
}

.shot-timeline {
	width: max-content;
}

.shot-card {
	transition: all 0.3s ease;
	flex-shrink: 0;
}

.shot-pending {
	background-color: #f5f5f5;
	opacity: 0.7;
}

.shot-current {
	background-color: #bbdefb;
	border: 2px solid #1976d2 !important;
	box-shadow: 0 0 10px rgba(25, 118, 210, 0.5);
}

.shot-completed {
	background-color: #e8f5e9;
}

.shot-number {
	font-size: 1.1rem;
	font-weight: bold;
}

.shot-score {
	font-size: 0.8rem;
	margin-top: 2px;
}

.shots-stepper {
	width: 100%;
}

.shots-stepper :deep(.v-stepper-header) {
	overflow-x: auto;
	overflow-y: hidden;
	flex-wrap: nowrap;
	padding: 16px 16px 8px 16px;
}
</style>
