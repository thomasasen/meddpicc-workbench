import { createRouter, createWebHashHistory } from 'vue-router'

import ChecklistView from '../views/ChecklistView.vue'
import ChampionKnowledgeView from '../views/ChampionKnowledgeView.vue'
import CompetitionKnowledgeView from '../views/CompetitionKnowledgeView.vue'
import DecisionCriteriaKnowledgeView from '../views/DecisionCriteriaKnowledgeView.vue'
import DecisionProcessKnowledgeView from '../views/DecisionProcessKnowledgeView.vue'
import DiscoveryCallKnowledgeView from '../views/DiscoveryCallKnowledgeView.vue'
import EconomicBuyerKnowledgeView from '../views/EconomicBuyerKnowledgeView.vue'
import MetricsKnowledgeView from '../views/MetricsKnowledgeView.vue'
import PainImplicationKnowledgeView from '../views/PainImplicationKnowledgeView.vue'
import PaperProcessKnowledgeView from '../views/PaperProcessKnowledgeView.vue'
import EvidenceView from '../views/EvidenceView.vue'
import HomeView from '../views/HomeView.vue'
import ReverseTimelineView from '../views/ReverseTimelineView.vue'
import QuickPaybackView from '../views/QuickPaybackView.vue'
import MetricBuilderView from '../views/MetricBuilderView.vue'
import CostOfDelayView from '../views/CostOfDelayView.vue'
import ValueBridgeView from '../views/ValueBridgeView.vue'
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
      path: '/tools/value-bridge',
      name: 'value-bridge',
      component: ValueBridgeView,
    },
    {
      path: '/tools/cost-of-delay',
      name: 'cost-of-delay',
      component: CostOfDelayView,
    },
    {
      path: '/tools/metric-builder',
      name: 'metric-builder',
      component: MetricBuilderView,
    },
    {
      path: '/tools/quick-payback',
      name: 'quick-payback',
      component: QuickPaybackView,
    },
    {
      path: '/tools/reverse-timeline',
      name: 'reverse-timeline',
      component: ReverseTimelineView,
    },
    {
      path: '/knowledge/discovery-call',
      name: 'knowledge-discovery-call',
      component: DiscoveryCallKnowledgeView,
    },
    {
      path: '/checklists/discovery-call',
      name: 'checklist-discovery-call',
      component: ChecklistView,
      props: { checklistId: 'discovery-call' },
    },
    {
      path: '/knowledge/decision-criteria',
      name: 'knowledge-decision-criteria',
      component: DecisionCriteriaKnowledgeView,
    },
    {
      path: '/checklists/decision-criteria',
      name: 'checklist-decision-criteria',
      component: ChecklistView,
      props: { checklistId: 'decision-criteria' },
    },
    {
      path: '/knowledge/decision-process',
      name: 'knowledge-decision-process',
      component: DecisionProcessKnowledgeView,
    },
    {
      path: '/checklists/decision-process',
      name: 'checklist-decision-process',
      component: ChecklistView,
      props: { checklistId: 'decision-process' },
    },
    {
      path: '/knowledge/pain-implication',
      name: 'knowledge-pain-implication',
      component: PainImplicationKnowledgeView,
    },
    {
      path: '/checklists/pain-implication',
      name: 'checklist-pain-implication',
      component: ChecklistView,
      props: { checklistId: 'pain-implication' },
    },
    {
      path: '/knowledge/champion',
      name: 'knowledge-champion',
      component: ChampionKnowledgeView,
    },
    {
      path: '/checklists/champion',
      name: 'checklist-champion',
      component: ChecklistView,
      props: { checklistId: 'champion' },
    },
    {
      path: '/knowledge/competition',
      name: 'knowledge-competition',
      component: CompetitionKnowledgeView,
    },
    {
      path: '/checklists/competition',
      name: 'checklist-competition',
      component: ChecklistView,
      props: { checklistId: 'competition' },
    },
    {
      path: '/knowledge/paper-process',
      name: 'knowledge-paper-process',
      component: PaperProcessKnowledgeView,
    },
    {
      path: '/checklists/paper-process',
      name: 'checklist-paper-process',
      component: ChecklistView,
      props: { checklistId: 'paper-process' },
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
