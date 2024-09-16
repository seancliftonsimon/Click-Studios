<template>
	<v-dialog v-model="isDialogVisible">
		<v-card style="min-height: 180px">
			<v-card-title>{{ title }}</v-card-title>
			<v-card-text>{{ description }}</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="green darken-1" text @click="closeDialog">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
	name: "TestPopUp",
	computed: {
		// Using mapGetters to bind Vuex getters to component properties
		...mapGetters({
			isDialogVisible: "popupVisible",
			title: "popupTitle",
			description: "scriptDescription",
		}),
	},
	methods: {
		...mapMutations({
			setPopupVisible: "SET_POPUP_VISIBLE",
		}),
		closeDialog() {
			this.setPopupVisible(false); // Close dialog by updating Vuex state
		},
	},
};
</script>

<style>
.v-dialog {
	max-width: 800px;
}
</style>
