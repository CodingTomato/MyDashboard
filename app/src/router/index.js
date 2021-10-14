import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Arbeitszeiten from '../views/Arbeitszeiten.vue';
import { store } from '../store';

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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // if (to.name !== 'Login' && !(store.state.user)) next({ name: 'Login' })
  // else if (to.name === 'Login' && store.state.user) next({ name: 'Überblick' })
  // else next()
  console.log(store);
  next();
})

export default router;
