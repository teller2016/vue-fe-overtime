import { createRouter, createWebHistory } from 'vue-router';
import WeekAll from '../pages/weekAll/index.vue';
import OT from '../pages/ot/index.vue';
import PersonalWeek from '../pages/personalWeek/index.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/weekAll',
    },
    {
      path: '/weekAll',
      name: 'WeekAll',
      component: WeekAll,
    },
    {
      path: '/personalWeek',
      name: 'PersonalWeek',
      component: PersonalWeek,
    },
    {
      path: '/ot',
      name: 'OT',
      component: OT,
    },
  ],
});

// 1: home, 2: todos, 3:/todos/create, 4: /todos/:id

export default router;
