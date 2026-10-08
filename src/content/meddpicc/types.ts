export type KnowledgeTopicId =
  | 'economic-buyer'
  | 'metrics'
  | 'discovery-call'
  | 'decision-criteria'
  | 'decision-process'
  | 'paper-process'
  | 'pain-implication'

export type ChecklistId =
  | 'economic-buyer'
  | 'economic-buyer-meeting'
  | 'metrics'
  | 'discovery-call'
  | 'decision-criteria'
  | 'decision-process'
  | 'paper-process'
  | 'pain-implication'

export interface MeddpiccConcept {
  id: string
  meaning: string
  whyItMatters: string
  signals: string[]
  commonMisinterpretation: string
  possibleQuestionsOrActions: string[]
  learnMore?: string
  sourceNote?: string
}

export interface KnowledgeMisinterpretation {
  claim: string
  explanation: string
}

export interface KnowledgeTopic {
  id: KnowledgeTopicId
  eyebrow: string
  title: string
  lead: string
  shortDefinition: string
  benefit: string
  whyImportant: string[]
  recognitionConceptIds: string[]
  misinterpretations: KnowledgeMisinterpretation[]
  discoveryQuestions: string[]
  withoutDirectAccess: string[]
  practiceActions?: string[]
  authorPerspective: {
    whyte: string
    lahoutifard: string
    practicalTakeaway: string
  }
  sourceNotes: string[]
}

export interface ChecklistItem {
  id: string
  question: string
  meaning: string
  whyItMatters: string
  signals: string[]
  commonMisinterpretation: string
  possibleQuestionsOrActions: string[]
  learnMore?: string
  relatedKnowledge?: KnowledgeTopicId
  sourceNote?: string
}

export interface ChecklistDefinition {
  id: ChecklistId
  eyebrow: string
  title: string
  lead: string
  whenToUse: string
  benefit: string
  items: ChecklistItem[]
  sourceNotes: string[]
}
