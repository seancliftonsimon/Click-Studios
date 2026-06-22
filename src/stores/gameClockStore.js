import { defineStore } from "pinia";

const subscribers = new Map();
let intervalId = null;

export const useGameClockStore = defineStore("gameClock", {
	state: () => ({
		isRunning: false,
		lastTickAt: null,
		tickIntervalMs: 1000,
		activeSubscriberCount: 0,
	}),
	actions: {
		start() {
			if (intervalId) return;

			this.isRunning = true;
			this.lastTickAt = Date.now();
			intervalId = setInterval(() => {
				this.tick();
			}, this.tickIntervalMs);
		},
		stop() {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
			this.isRunning = false;
			this.lastTickAt = null;
		},
		registerTicker(id, callback) {
			subscribers.set(id, callback);
			this.activeSubscriberCount = subscribers.size;
			this.start();

			return () => this.unregisterTicker(id);
		},
		unregisterTicker(id) {
			subscribers.delete(id);
			this.activeSubscriberCount = subscribers.size;
			if (subscribers.size === 0) {
				this.stop();
			}
		},
		tick(now = Date.now()) {
			if (!this.lastTickAt) {
				this.lastTickAt = now;
				return;
			}

			const elapsedSeconds = Math.max(0, (now - this.lastTickAt) / 1000);
			this.lastTickAt = now;

			subscribers.forEach((callback) => {
				callback(elapsedSeconds, now);
			});
		},
	},
});
