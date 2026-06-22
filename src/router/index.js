import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/store";

//importing the components for each main phase
import WritingComponent from "@/components/Writing/WritingComponent.vue";
import PreproductionComponent from "@/components/Prepro/PreproductionComponent.vue";
import FilmingComponent from "@/components/Filming/FilmingComponent.vue";
import PostproductionComponent from "@/components/Postpro/PostproductionComponent.vue";
import MarketingComponent from "@/components/Marketing/MarketingComponent.vue";
import ReleaseComponent from "@/components/Release/ReleaseComponent.vue";
import PopupTester from "@/components/ui/PopupTester.vue";
import ExampleToastUsage from "@/components/ExampleToastUsage.vue";

const routes = [
	{
		path: "/",
		name: "writing",
		component: WritingComponent,
	},
	{
		path: "/preproduction",
		name: "preproduction",
		component: PreproductionComponent,
		meta: { unlockGetter: "isPreproductionUnlocked" },
	},
	{
		path: "/filming",
		name: "filming",
		component: FilmingComponent,
		meta: { unlockGetter: "isFilmingUnlocked" },
	},
	{
		path: "/postproduction",
		name: "postproduction",
		component: PostproductionComponent,
		meta: {
			unlockGetter: "isPostproductionUnlocked",
			developmentEndpoint: true,
		},
	},
	{
		path: "/marketing",
		name: "marketing",
		component: MarketingComponent,
		meta: {
			unlockGetter: "isMarketingUnlocked",
			developmentEndpoint: true,
		},
	},
	{
		path: "/release",
		name: "release",
		component: ReleaseComponent,
		meta: {
			unlockGetter: "isReleaseUnlocked",
			developmentEndpoint: true,
		},
	},
	{
		path: "/popup-tester",
		name: "popupTester",
		component: PopupTester,
	},
	{
		path: "/toast-examples",
		name: "toastExamples",
		component: ExampleToastUsage,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
	// Log the navigation attempt
	console.log(`Navigating from ${from.name || "start"} to ${to.name}`);

	if (to.meta.unlockGetter && !store.getters[to.meta.unlockGetter]) {
		if (to.meta.developmentEndpoint && store.getters.isFilmingUnlocked) {
			store.dispatch("showDevelopmentEndpoint", { force: true });
			next({ name: "filming" });
			return;
		}

		store.dispatch("showToast", {
			message: "That phase is still locked.",
			type: "temporary",
		});
		next({ name: "writing" });
		return;
	}

	next();
});

router.afterEach((to) => {
	console.log(`Navigation to ${to.name} completed`);
});

export default router;
