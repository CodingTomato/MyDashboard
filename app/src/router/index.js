import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Arbeitszeiten from '../views/Arbeitszeiten.vue';
import Invoives from '../views/Invoices.vue';

const routes = [
  {
    path: '/',
    name: 'Überblick',
    component: Home,
  },
  {
    path: '/arbeitszeiten',
    name: 'Arbeitszeiten',
    component: Arbeitszeiten,
  },
  {
    path: '/rechnungen',
    name: 'Aufträge',
    component: Invoives,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
