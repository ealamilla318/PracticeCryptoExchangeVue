import Vue from "vue";
import Router from "vue-router";
import HomeView from "@/views/Home";
import AboutView from "@/views/About";
import ErrorView from "@/views/Error";
import CoinDetail from "@/views/CoinDetail";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/404",
      name: "error",
      component: ErrorView,
    },
    {
      path: "/coin/:id",
      name: "coin-detail",
      component: CoinDetail
    }
  ],
});
