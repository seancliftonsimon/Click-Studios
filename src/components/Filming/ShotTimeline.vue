<template>
	<div class="shot-timeline-container">
		<h2 class="text-h5 mb-4">Shot Timeline</h2>

		<v-card class="mb-6">
			<v-card-title class="text-subtitle-1">Shooting Schedule</v-card-title>
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
								<div class="shot-name text-center">
									{{ shot.name }}
								</div>
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
	</div>
</template>

<script>
export default {
	props: {
		shots: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
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
	width: 110px !important;
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

.shot-name {
	font-size: 0.65rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.shot-score {
	font-size: 0.8rem;
	margin-top: 2px;
}
</style>
