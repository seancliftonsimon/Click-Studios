// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify({
	theme: {
		defaultTheme: "myTheme",
		themes: {
			myTheme: {
				colors: {
					primary: "#931621",
					secondary: "#fad01c",
					accent: "#313b72",
					success: "#2e7d32",
					warning: "#f57c00",
					error: "#c62828",
					"curtain-red": "#931621",
					"academy-gold": "#fad01c",
					"night-sky": "#313b72",
					"pale-popcorn": "#fff5bf",
					"ticket-paper": "#fffaf0",
					"booth-line": "#d9c783",
					"ink-black": "#151313",
					"muted-ink": "#625947",
					"neutral-gray": "#cfcfcf",
					"spend-words": "#931621",
					"spend-money": "#313b72",
				},
			},
		},
	},
	components: {
		VBtn: {
			defaultProps: {
				ripple: false,
			},
		},
	},
});
