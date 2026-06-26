import { computed } from "vue";
import { useDisplay } from "vuetify";

/**
 * Shared breakpoint helper so components don't each re-derive mobile logic.
 *
 * - `isMobile`  : true on phone-portrait widths (Vuetify `xs`, < 600px).
 * - `isCompact` : true on phones and small tablets (`smAndDown`, < 960px) —
 *                 the band where we use the bottom nav and single-column stacks.
 */
export function useResponsive() {
	const display = useDisplay();

	const isMobile = computed(() => display.xs.value);
	const isCompact = computed(() => display.smAndDown.value);

	return { isMobile, isCompact };
}
