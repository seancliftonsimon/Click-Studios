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
					"spend-words": "#931621",
					"spend-money": "#006400", // darkgreen
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
