import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "./styles/variables.scss";
import { registerAllPopups } from "./data/popups";
import { useDebugStore } from "./stores/debugStore";

loadFonts();

const app = createApp(App);
const pinia = createPinia();

// Define the global method here, before mounting the app
app.config.globalProperties.$formatNumber = (value) => {
	return new Intl.NumberFormat("en-US").format(value);
};

// Pluralize a noun based on count: $plural(1, "word") -> "1 word".
app.config.globalProperties.$plural = (count, noun, suffix = "s") => {
	const formatted = new Intl.NumberFormat("en-US").format(count);
	return `${formatted} ${noun}${count === 1 ? "" : suffix}`;
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

app.config.performance = true;
app.config.warnHandler = function (msg, vm, trace) {
	console.warn("[Vue warn]: " + msg + trace);
};

// Pinia must be active before any store is used (popup registration, router guard)
app.use(pinia);

// Register all popups
registerAllPopups();

app.use(router).use(vuetify).mount("#app");

document.addEventListener("keydown", function (event) {
	// Check if '2' and 'P' are pressed together (key '2' and key 'p')
	if (event.key === "p") {
		console.log("Second Phase Unlocked");
		useDebugStore(pinia).loadSecondPhaseCheckpoint();
	}
});
