import { createRouter, createWebHashHistory } from "vue-router";

//importing the components for each main phase
import WritingComponent from "@/components/Writing/WritingComponent.vue";
import PreproductionComponent from "@/components/PreproductionComponent.vue";
import FilmingComponent from "@/components/FilmingComponent.vue";
import PostproductionComponent from "@/components/PostproductionComponent.vue";
import MarketingComponent from "@/components/MarketingComponent.vue";
import ReleaseComponent from "@/components/ReleaseComponent.vue";

const routes = [
  {
    path: '/',
    name: 'writing',
    component: WritingComponent
  },
  {
    path: '/preproduction',
    name: 'preproduction',
    component: PreproductionComponent
  },
  {
    path: '/filming',
    name: 'filming',
    component: FilmingComponent
  },
  {
    path: '/postproduction',
    name: 'postproduction',
    component: PostproductionComponent
  },
  {
    path: '/marketing',
    name: 'marketing',
    component: MarketingComponent
  },
  {
    path: '/release',
    name: 'release',
    component: ReleaseComponent
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
