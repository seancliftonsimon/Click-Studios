import { createRouter, createWebHashHistory } from "vue-router";

//importing the components for each main phase
import WritingComponent from "@/components/Writing/WritingComponent.vue";
import PreproductionComponent from "@/components/Prepro/PreproductionComponent.vue";
import FilmingComponent from "@/components/Filming/FilmingComponent.vue";
import PostproductionComponent from "@/components/Postpro/PostproductionComponent.vue";
import MarketingComponent from "@/components/Marketing/MarketingComponent.vue";
import ReleaseComponent from "@/components/Release/ReleaseComponent.vue";
import PopupTester from "@/components/ui/PopupTester.vue";

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
	},
	{
		path: "/filming",
		name: "filming",
		component: FilmingComponent,
	},
	{
		path: "/postproduction",
		name: "postproduction",
		component: PostproductionComponent,
	},
	{
		path: "/marketing",
		name: "marketing",
		component: MarketingComponent,
	},
	{
		path: "/release",
		name: "release",
		component: ReleaseComponent,
	},
	{
		path: "/popup-tester",
		name: "popupTester",
		component: PopupTester,
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

	// Clean up any intervals or timers from the previous component
	if (from.name === "preproduction") {
		// Get all intervals and clear them
		const intervals = window.intervals || [];
		intervals.forEach(clearInterval);
		window.intervals = [];
	}

	next();
});

router.afterEach((to) => {
	console.log(`Navigation to ${to.name} completed`);
});

export default router;
