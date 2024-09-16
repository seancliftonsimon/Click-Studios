import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

const app = createApp(App);

// Define the global method here, before mounting the app
app.config.globalProperties.$formatNumber = (value) => {
	return new Intl.NumberFormat("en-US").format(value);
};

app.config.globalProperties.$formatNumberShort = (value) => {
	// Numbers under 1,000
	if (value < 1000) {
		return new Intl.NumberFormat("en-US").format(value);
	}
	// Numbers from 1,000 to 998,999
	else if (value >= 1000 && value <= 998999) {
		return (value / 1000).toFixed(0) + "K";
	}
	// Numbers from 999,000 to 998,000,000
	else if (value >= 999000 && value <= 998000000) {
		return (value / 1000000).toFixed(0) + "M";
	}
	// Numbers from 999,000,000 to 998,000,000,000
	else if (value >= 999000000 && value <= 998000000000) {
		return (value / 1000000000).toFixed(0) + "B";
	} else {
		return (value / 1000000000).toFixed(0) + "B";
	}
};
app.use(router).use(store).use(vuetify).mount("#app");
