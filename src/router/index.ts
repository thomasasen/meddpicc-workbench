import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ReverseTimelineView from '../views/ReverseTimelineView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: HomeView,
    },
    {
      path: '/tools/go-live-rueckwaertsplanung',
      name: 'go-live-rueckwaertsplanung',
      component: ReverseTimelineView,
    },
  ],
})

export default router
