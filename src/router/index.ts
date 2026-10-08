import { createRouter, createWebHashHistory } from 'vue-router'

import ChecklistView from '../views/ChecklistView.vue'
import EconomicBuyerKnowledgeView from '../views/EconomicBuyerKnowledgeView.vue'
import MetricsKnowledgeView from '../views/MetricsKnowledgeView.vue'
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
      path: '/knowledge/metrics',
      name: 'knowledge-metrics',
      component: MetricsKnowledgeView,
    },
    {
      path: '/checklists/metrics',
      name: 'checklist-metrics',
      component: ChecklistView,
      props: { checklistId: 'metrics' },
    },
    {
      path: '/knowledge/economic-buyer',
      name: 'knowledge-economic-buyer',
      component: EconomicBuyerKnowledgeView,
    },
    {
      path: '/checklists/economic-buyer',
      name: 'checklist-economic-buyer',
      component: ChecklistView,
      props: { checklistId: 'economic-buyer' },
    },
    {
      path: '/checklists/economic-buyer-meeting',
      name: 'checklist-economic-buyer-meeting',
      component: ChecklistView,
      props: { checklistId: 'economic-buyer-meeting' },
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
