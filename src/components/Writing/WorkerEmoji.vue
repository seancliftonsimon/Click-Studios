<template>
	<div class="worker-container" :class="{ expiring: isExpiring }">
		<div
			class="progress-background"
			:style="{
				height: `${progressPercentage}%`,
			}"
		></div>
		<div class="emoji-content">{{ emoji }}</div>
	</div>
</template>

<script>
export default {
	name: "WorkerEmoji",
	props: {
		emoji: {
			type: String,
			required: true,
		},
		id: {
			type: Number,
			required: true,
		},
		workerType: {
			type: String,
			required: true,
		},
		hireTime: {
			type: Number,
			required: true,
		},
		expectedRemovalTime: {
			type: Number,
			required: true,
		},
		animationStartTime: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			currentTime: Date.now(),
			refreshInterval: null,
			hasExpired: false,
			expirationTimeout: null,
		};
	},
	computed: {
		totalDuration() {
			return this.expectedRemovalTime - this.hireTime;
		},
		timeRemaining() {
			return Math.max(0, this.expectedRemovalTime - this.currentTime);
		},
		progressPercentage() {
			return Math.min(
				100,
				Math.max(0, (this.timeRemaining / this.totalDuration) * 100)
			);
		},
		isExpiring() {
			return (
				this.currentTime >= this.animationStartTime &&
				this.currentTime < this.expectedRemovalTime
			);
		},
	},
	methods: {
		updateTime() {
			this.currentTime = Date.now();

			if (this.isExpiring) {
				const timeRemainingSeconds = (this.timeRemaining / 1000).toFixed(1);
				console.log(
					`Worker ${this.id} is expiring. Time remaining: ${timeRemainingSeconds}s`
				);
			}

			// Check if worker has expired but we haven't emitted the event yet
			if (this.currentTime >= this.expectedRemovalTime && !this.hasExpired) {
				this.hasExpired = true;
				this.$emit("worker-expired");
				console.log(
					`Worker ${this.id} has expired and emitted worker-expired event`
				);
			}
		},
		setupExpirationTimeout() {
			// Clear any existing timeout
			if (this.expirationTimeout) {
				clearTimeout(this.expirationTimeout);
			}

			// Calculate time until expiration
			const timeUntilExpiration = Math.max(
				0,
				this.expectedRemovalTime - Date.now()
			);

			// Set timeout to emit event exactly when the worker expires
			this.expirationTimeout = setTimeout(() => {
				if (!this.hasExpired) {
					this.hasExpired = true;
					this.$emit("worker-expired");
					console.log(
						`Worker ${this.id} has expired via timeout and emitted worker-expired event`
					);
				}
			}, timeUntilExpiration);
		},
	},
	mounted() {
		// Update time every 100ms for smooth progress bar
		this.refreshInterval = setInterval(this.updateTime, 100);
		this.updateTime(); // Initialize

		// Set up the expiration timeout
		this.setupExpirationTimeout();
	},
	beforeUnmount() {
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
		}
		if (this.expirationTimeout) {
			clearTimeout(this.expirationTimeout);
		}
	},
};
</script>

<style scoped>
.worker-container {
	position: relative;
	width: 70px;
	height: 70px;
	margin: 8px;
	border-radius: 8px;
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border: 1px solid #ddd;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease;
}

.worker-container:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.emoji-content {
	position: relative;
	z-index: 2;
	font-size: 2.5em;
	text-align: center;
}

.progress-background {
	position: absolute;
	width: 100%;
	background: linear-gradient(to right, #90ee90, #7ad27a); /* Gradient green */
	bottom: 0;
	left: 0;
	z-index: 1;
	transition: height 0.1s linear;
}

.expiring .progress-background {
	background: linear-gradient(to right, #ff5722, #ff7043);
	animation: pulse 0.6s ease-in-out infinite alternate;
}

.expiring {
	box-shadow: 0 0 12px rgba(255, 87, 34, 0.5);
	border: 1px solid #ff5722;
}

.expiring .emoji-content {
	animation: wiggle 0.6s ease-in-out infinite alternate;
}

@keyframes pulse {
	0% {
		opacity: 0.7;
		box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.5);
	}
	100% {
		opacity: 1;
		box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.8);
	}
}

@keyframes wiggle {
	0% {
		transform: scale(0.8);
	}
	50% {
		transform: rotate(-5deg) scale(1.1);
	}
	100% {
		transform: rotate(5deg) scale(1.2);
	}
}
</style>
