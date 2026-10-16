import test from 'node:test'
import assert from 'node:assert/strict'
import { loadConfig } from '../src/config.js'
import { createProvider } from '../src/providers/adapter.js'
import { createApp } from '../src/server.js'

// Boot the real app once with the mock provider and hit it over real HTTP.
const config = loadConfig({ LLM_PROVIDER: 'mock', CORS_ORIGIN: 'http://localhost:5173' })
const provider = createProvider(config)
const app = createApp({ config, provider })
const server = app.listen(0)
const base = () => `http://127.0.0.1:${server.address().port}`

test.after(() => server.close())

test('GET /api/health returns ok and demo flag', async () => {
  const res = await fetch(`${base()}/api/health`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.status, 'ok')
  assert.equal(body.demo_mode, true)
  assert.equal(body.provider, 'mock')
})

test('POST /api/advice: valid question returns answer + sources + steps', async () => {
  const res = await fetch(`${base()}/api/advice`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question: 'ধানের ক্ষেতে পানি কীভাবে দেব?', language: 'bn' }),
  })
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.ok(body.answer.length > 10)
  assert.equal(body.category, 'irrigation')
  assert.ok(Array.isArray(body.sources))
  assert.ok(body.sources.length > 0)
  assert.ok(body.steps.some((s) => s.tool === 'route'))
  assert.equal(body.provider.demo, true)
  assert.equal(body.uncertainty.needs_expert, true)
  // Source metadata must be honest: url null, needs_review true for demo seed.
  assert.equal(body.sources[0].needs_review, true)
  assert.equal(body.sources[0].url, null)
})

test('POST /api/advice: empty question -> 400', async () => {
  const res = await fetch(`${base()}/api/advice`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question: '   ' }),
  })
  assert.equal(res.status, 400)
  const body = await res.json()
  assert.equal(body.error, 'invalid_request')
})

test('POST /api/advice: missing body -> 400', async () => {
  const res = await fetch(`${base()}/api/advice`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  })
  assert.equal(res.status, 400)
})

test('POST /api/advice: oversized question -> 400', async () => {
  const res = await fetch(`${base()}/api/advice`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question: 'ক'.repeat(config.limits.maxQuestionChars + 1) }),
  })
  assert.equal(res.status, 400)
  const body = await res.json()
  assert.equal(body.error, 'question_too_long')
})

test('POST /api/advice: invalid language -> 400', async () => {
  const res = await fetch(`${base()}/api/advice`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question: 'ধান সম্পর্কে বলুন', language: 'fr' }),
  })
  assert.equal(res.status, 400)
  assert.equal((await res.json()).error, 'invalid_language')
})

test('GET /api/crop-guide lists seed entries with review flags', async () => {
  const res = await fetch(`${base()}/api/crop-guide`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.ok(body.count > 0)
  assert.equal(body.entries[0].needs_review, true)
})

test('GET /api/weather returns labelled demo data without a key', async () => {
  const res = await fetch(`${base()}/api/weather`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.live, false)
  assert.ok(body.demo_note)
})

test('unknown route -> 404 JSON', async () => {
  const res = await fetch(`${base()}/api/nope`)
  assert.equal(res.status, 404)
})
