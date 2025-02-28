<template>
	<div class="toast-example">
		<h2>Toast Notification Examples</h2>
		<div class="buttons">
			<v-btn color="primary" @click="showTemporaryToast"
				>Show Temporary Toast</v-btn
			>
			<v-btn color="secondary" @click="showPersistentToast"
				>Show Persistent Toast</v-btn
			>
			<v-btn color="info" @click="showDirectToast">Show Toast Directly</v-btn>
		</div>
	</div>
</template>

<script>
import { popupService } from "@/services";

export default {
	name: "ExampleToastUsage",
	methods: {
		// Example using the popupService helper methods
		showTemporaryToast() {
			popupService.showTemporaryToast(
				"This is a temporary toast that will auto-dismiss after 4 seconds"
			);
		},

		showPersistentToast() {
			popupService.showPersistentToast(
				"This is a persistent toast that requires manual dismissal"
			);
		},

		// Example using the store directly
		showDirectToast() {
			this.$store.dispatch("showToast", {
				message: "This is a toast with custom configuration",
				type: "persistent", // or "temporary"
			});
		},
	},
};
</script>

<style scoped>
.toast-example {
	padding: 20px;
	max-width: 800px;
	margin: 0 auto;
}

.buttons {
	display: flex;
	gap: 10px;
	margin-top: 20px;
}
</style>
