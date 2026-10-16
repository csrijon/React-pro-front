// Step 2 of the agent: retrieve relevant knowledge-base entries.
// This is honest keyword retrieval (BM25-lite), NOT a vector database.
// It scores each seed entry by how many of its keywords appear in the question,
// plus a bonus when the entry's topic matches the classified topic.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Loaded from disk instead of `import ... with { type: 'json' }` so it works
// on any Node >= 18 without experimental flags.
const seedPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'kb', 'seed.json')
const seed = JSON.parse(readFileSync(seedPath, 'utf8'))

const normalize = (s) => String(s || '').toLowerCase()

function entryKeywords(entry) {
  const words = []
  for (const crop of entry.crops || []) words.push(normalize(crop))
  for (const topic of entry.topics || []) words.push(normalize(topic))
  words.push(normalize(entry.title_en), normalize(entry.title_bn))
  return words.filter(Boolean)
}

export function retrieve({ question, category, crop, limit = 2, entries = seed.entries }) {
  const q = normalize(question)
  const cropQ = normalize(crop)

  const scored = entries.map((entry) => {
    let score = 0
    const matched = []
    for (const kw of entryKeywords(entry)) {
      if (kw.length < 2) continue
      if (q.includes(kw)) {
        score += 2
        matched.push(kw)
      } else if (cropQ && cropQ.includes(kw)) {
        score += 1.5
        matched.push(`${kw}(crop)`)
      }
    }
    if ((entry.topics || []).includes(category)) score += 1
    return { entry, score, matched }
  })

  // A "hit" needs at least one real keyword match. The topic bonus alone is
  // not evidence, so it can never create a hit by itself.
  const hits = scored
    .filter((s) => s.matched.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return {
    hits,
    // Flagged so the answer layer can say "no evidence found" honestly.
    uncertain: hits.length === 0,
  }
}
