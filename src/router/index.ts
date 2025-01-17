import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/wingchun',
    name: 'Home',
    component: HomeView,
},
{
  path: '/wingchun/quiz',
  name: 'Quiz',
  component: () => import('../views/Quiz.vue'),
},
{
  path: '/wingchun/motor',
  name: 'Motoriek',
  component: () => import('../views/Motoriek.vue'),
},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
