import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/index.vue";
import Week from "../pages/week/index.vue";
import WeekAll from "../pages/weekAll/index.vue";
import OT from "../pages/ot/index.vue";
import Test from "../pages/test/index.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: "/", //url
    //   name: "Home",
    //   component: Home,
    // },
    {
      path: "/",
      redirect: "/weekAll",
    },
    {
      path: "/week", //url
      name: "Week",
      component: Week,
    },
    {
      path: "/weekAll", //url
      name: "WeekAll",
      component: WeekAll,
    },
    {
      path: "/ot",
      name: "OT",
      component: OT,
    },
    {
      path: "/test",
      name: "Test",
      component: Test,
    },
  ],
});

// 1: home, 2: todos, 3:/todos/create, 4: /todos/:id

export default router;
