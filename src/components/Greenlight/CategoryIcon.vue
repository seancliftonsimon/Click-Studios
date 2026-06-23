<template>
	<svg
		class="cat-icon"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.6"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<!-- Person (roles) -->
		<g v-if="type === 'person'">
			<circle cx="12" cy="8" r="3.5" />
			<path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
		</g>
		<!-- Building (sets) -->
		<g v-else-if="type === 'building'">
			<rect x="5" y="3.5" width="14" height="17" rx="1" />
			<path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
			<path d="M10.5 20.5v-3h3v3" />
		</g>
		<!-- Map pin (locations) -->
		<g v-else-if="type === 'pin'">
			<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z" />
			<circle cx="12" cy="11" r="2.2" />
		</g>
		<!-- Clapperboard (shots) -->
		<g v-else-if="type === 'clapper'">
			<rect x="3.5" y="9" width="17" height="11" rx="1" />
			<path d="M3.5 9l2.4-3.2 3.4.7-2.4 3.2M9.3 6.5l3.4.7-2.4 3.2M14.7 7.2l3.4.7-2.4 3.2" />
		</g>
	</svg>
</template>

<script>
export default {
	name: "CategoryIcon",
	props: {
		type: { type: String, required: true },
	},
};
</script>

<style scoped>
.cat-icon {
	width: 1.15em;
	height: 1.15em;
	flex: 0 0 auto;
}
</style>
