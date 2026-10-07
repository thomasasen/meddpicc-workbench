import { createRouter, createWebHashHistory } from 'vue-router'

import EvidenceView from '../views/EvidenceView.vue'
import HomeView from '../views/HomeView.vue'
import ReverseTimelineView from '../views/ReverseTimelineView.vue'
import RisksActionsView from '../views/RisksActionsView.vue'
import ReferencesView from '../views/ReferencesView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: HomeView,
    },
    {
      path: '/tools/reverse-timeline',
      name: 'reverse-timeline',
      component: ReverseTimelineView,
    },
    {
      path: '/evidence',
      name: 'evidence',
      component: EvidenceView,
    },
    {
      path: '/risks-actions',
      name: 'risks-actions',
      component: RisksActionsView,
    },
    {
      path: '/references',
      name: 'references',
      component: ReferencesView,
    },
  ],
})

export default router
