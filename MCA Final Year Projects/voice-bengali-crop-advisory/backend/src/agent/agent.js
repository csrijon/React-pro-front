// ---------------------------------------------------------------------------
// THE AGENT
// ---------------------------------------------------------------------------
// A "tool-routed, retrieval-grounded" advisory workflow. It is deliberately
// small so a student can read the whole thing in one sitting:
//
//   1. validate      -> question text, language, optional crop
//   2. classify      -> which topic is this? (tool selection step)
//   3. route tools   -> decide which tools to call for that topic
//   4. retrieve      -> pull matching entries from the local knowledge base
//   5. generate      -> LLM writes a Bengali answer grounded in those entries
//   6. post-check    -> uncertainty flag + expert escalation when evidence is thin
//
// This is NOT a fully autonomous agent: it has one fixed pipeline with an
// explicit routing decision (which tools to use). That honesty matters for the
// project report and the viva.
// ---------------------------------------------------------------------------
import { classify } from './classify.js'
import { retrieve } from './retrieve.js'
import { buildSystemPrompt, buildUserPrompt } from './prompt.js'

// Routing table: which tools each topic is allowed to use.
// "kb_retrieve" = search the local knowledge base, "weather_hint" = mention
// weather caution (live weather is Phase 3).
const ROUTES = {
  crop_problem: ['kb_retrieve', 'weather_hint'],
  irrigation: ['kb_retrieve', 'weather_hint'],
  pest: ['kb_retrieve', 'weather_hint'],
  fertilizer: ['kb_retrieve'],
  general: ['kb_retrieve'],
}

export async function runAdvisory({ question, language = 'bn', crop = '', provider }) {
  const steps = []

  const classification = classify(question)
  steps.push({
    tool: 'classify',
    label: 'প্রশ্ন শ্রেণিবদ্ধ করা হয়েছে',
    detail: `topic=${classification.category}`,
  })

  const tools = ROUTES[classification.category] || ['kb_retrieve']
  steps.push({
    tool: 'route',
    label: 'টুল নির্বাচন (tool routing)',
    detail: tools.join(', '),
  })

  let hits = []
  let uncertain = true
  if (tools.includes('kb_retrieve')) {
    const result = retrieve({ question, category: classification.category, crop })
    hits = result.hits
    uncertain = result.uncertain
    steps.push({
      tool: 'kb_retrieve',
      label: 'জ্ঞানভাণ্ডার থেকে তথ্য নেওয়া হচ্ছে',
      detail: `${hits.length} entry/entries matched`,
    })
  }

  if (tools.includes('weather_hint')) {
    steps.push({
      tool: 'weather_hint',
      label: 'আবহাওয়া সতর্কতা যোগ করা হয়েছে',
      detail: 'live weather = Phase 3',
    })
  }

  steps.push({
    tool: 'generate',
    label: `${provider.isMock ? 'ডেমো (mock)' : provider.name} মডেলে উত্তর তৈরি`,
    detail: provider.isMock ? 'no real LLM call' : 'calling LLM provider',
  })

  const result = await provider.generate({
    system: buildSystemPrompt({ language, category: classification.category, hits }),
    user: buildUserPrompt({ question, crop }),
    timeoutMs: 15000,
    hits,
    language,
  })

  // Post-check: thin evidence or a demo model always means "escalate".
  const needsExpert = uncertain || provider.isMock

  return {
    answer: result.text,
    category: classification.category,
    language,
    sources: hits.map(({ entry, score, matched }) => ({
      id: entry.id,
      title_bn: entry.title_bn,
      title_en: entry.title_en,
      publisher: entry.publisher,
      url: entry.url,
      reviewed_date: entry.reviewed_date,
      needs_review: entry.needs_review,
      score,
      matched_keywords: matched,
    })),
    uncertainty: {
      needs_expert: needsExpert,
      reason: uncertain
        ? 'no_knowledge_base_match'
        : provider.isMock
          ? 'mock_provider'
          : 'ok',
    },
    provider: { name: provider.name, model: result.model, demo: provider.isMock },
    steps,
  }
}
