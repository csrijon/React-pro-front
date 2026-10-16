import test from 'node:test'
import assert from 'node:assert/strict'
import { classify } from '../src/agent/classify.js'
import { retrieve } from '../src/agent/retrieve.js'
import { buildSystemPrompt } from '../src/agent/prompt.js'

test('classify: irrigation question', () => {
  const r = classify('ধানের ক্ষেতে কত দিন পানি দেব?')
  assert.equal(r.category, 'irrigation')
})

test('classify: pest/disease question', () => {
  const r = classify('আমার ধানের পাতায় ছোপ দেখছি')
  assert.equal(r.category, 'pest')
})

test('classify: fertilizer question', () => {
  const r = classify('ইউরিয়া সার কীভাবে দেব?')
  assert.equal(r.category, 'fertilizer')
})

test('classify: falls back to general', () => {
  const r = classify('hello')
  assert.equal(r.category, 'general')
})

test('retrieve: finds rice entry for a rice question', () => {
  const { hits, uncertain } = retrieve({ question: 'ধানের পানি সেচ', category: 'irrigation' })
  assert.equal(uncertain, false)
  assert.ok(hits.length > 0)
  assert.equal(hits[0].entry.id, 'kb-rice-water')
})

test('retrieve: unrelated question is flagged uncertain', () => {
  const { uncertain, hits } = retrieve({ question: 'zzz qqq xyz', category: 'general' })
  assert.equal(uncertain, true)
  assert.equal(hits.length, 0)
})

test('system prompt always contains the no-dosage safety rule', () => {
  const p = buildSystemPrompt({ language: 'bn', category: 'pest', hits: [] })
  assert.match(p, /NEVER give exact pesticide/)
  assert.match(p, /Krishi Vigyan Kendra/)
})
