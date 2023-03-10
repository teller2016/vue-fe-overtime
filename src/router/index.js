import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/index.vue";
import Week from "../pages/week/index.vue";
import OT from "../pages/ot/index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/", //url
      name: "Home",
      component: Home,
    }, // 객체 하나가 하나의 route를 의미
    {
      path: "/week", //url
      name: "Week",
      component: Week,
    },
    {
      path: "/ot",
      name: "OT",
      component: OT,
    },
  ],
});

// 1: home, 2: todos, 3:/todos/create, 4: /todos/:id

export default router;
