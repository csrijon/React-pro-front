import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { loadConfig } from '../src/config.js'
import { createApp } from '../src/server.js'
import { openAIProvider, ProviderError, mockProvider } from '../src/providers/adapter.js'
import { runAdvisory } from '../src/agent/agent.js'

// A provider that always explodes — used to check the API turns it into a safe 502.
function explodingProvider() {
  return {
    name: 'broken',
    isMock: false,
    async generate() {
      throw new ProviderError('upstream down', { code: 'PROVIDER_UNREACHABLE', status: 502 })
    },
  }
}

test('provider failure -> API responds 502 with a safe message', async () => {
  const config = loadConfig({ LLM_PROVIDER: 'mock' })
  const app = createApp({ config, provider: explodingProvider() })
  const server = app.listen(0)
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}/api/advice`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question: 'ধানের রোগ কী?' }),
    })
    assert.equal(res.status, 502)
    const body = await res.json()
    assert.equal(body.error, 'PROVIDER_UNREACHABLE')
    assert.ok(!body.message.includes('upstream down')) // no internal details leaked
  } finally {
    server.close()
  }
})

test('timeout -> ProviderError with code TIMEOUT and status 504', async () => {
  // A server that accepts the request but never answers.
  const hang = http.createServer(() => {})
  await new Promise((r) => hang.listen(0, r))
  const port = hang.address().port
  const provider = openAIProvider({
    apiKey: 'test-key',
    baseUrl: `http://127.0.0.1:${port}/v1`,
    model: 'test-model',
    timeoutMs: 150,
  })
  try {
    await assert.rejects(
      () => provider.generate({ system: 's', user: 'u' }),
      (err) => err instanceof ProviderError && err.code === 'TIMEOUT' && err.status === 504
    )
  } finally {
    hang.closeAllConnections?.()
    hang.close()
  }
})

test('openAI provider without an API key fails fast (MISCONFIGURED)', async () => {
  const provider = openAIProvider({ apiKey: '', baseUrl: 'http://127.0.0.1:1', model: 'm' })
  await assert.rejects(
    () => provider.generate({ system: 's', user: 'u' }),
    (err) => err.code === 'MISCONFIGURED' && err.status === 503
  )
})

test('mock provider is flagged as demo inside the agent result', async () => {
  const result = await runAdvisory({
    question: 'আলুর সেচ কীভাবে দেব?',
    language: 'bn',
    provider: mockProvider(),
  })
  assert.equal(result.provider.demo, true)
  assert.equal(result.uncertainty.needs_expert, true)
  assert.ok(result.sources.length > 0)
})

test('no retrieval match sets needs_expert + reason no_knowledge_base_match', async () => {
  const result = await runAdvisory({
    question: 'zzz qqq',
    language: 'bn',
    provider: mockProvider(),
  })
  assert.equal(result.sources.length, 0)
  assert.equal(result.uncertainty.reason, 'no_knowledge_base_match')
})
