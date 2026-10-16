// Provider adapter: one small interface for every LLM backend.
//
//   provider.generate({ system, user, timeoutMs }) -> { text, model, latencyMs }
//
// Two implementations:
//   - mockProvider(): deterministic local demo answers (no network, no key).
//     Its output is ALWAYS labelled "mock" so the UI can show a demo banner.
//   - openAIProvider(): calls any OpenAI-compatible /chat/completions endpoint.
//
// Keeping this behind an adapter means the agent code never changes when the
// model changes — a common real-world pattern.
export class ProviderError extends Error {
  constructor(message, { code = 'PROVIDER_ERROR', status = 502, cause } = {}) {
    super(message)
    this.name = 'ProviderError'
    this.code = code
    this.status = status
    this.cause = cause
  }
}

export function mockProvider() {
  return {
    name: 'mock',
    isMock: true,
    async generate({ user, hits, language }) {
      const bn = language !== 'en'
      if (!hits.length) {
        return {
          text: bn
            ? 'দুঃখিত, এই প্রশ্নের জন্য আমার জ্ঞানভাণ্ডারে যথেষ্ট তথ্য পাওয়া যায়নি। অনুগ্রহ করে স্থানীয় কৃষি বিশেষজ্ঞ বা কৃষি বিজ্ঞান কেন্দ্রে (KVK) যোগাযোগ করুন। এটি ডেমো (mock) উত্তর।'
            : 'Sorry, I do not have enough knowledge-base evidence for this question. Please contact a local agricultural expert or Krishi Vigyan Kendra. (This is a demo/mock answer.)',
          model: 'mock-v1',
          latencyMs: 120,
        }
      }
      const joined = hits
        .map(({ entry }) => `${entry.title_bn}: ${entry.summary_bn}`)
        .join(' আর ')
      const tail = bn
        ? ' আরও জানতে স্থানীয় কৃষি সেবা কেন্দ্রে যোগাযোগ করুন। এটি ডেমো (mock) উত্তর — সত্যিকারের উত্তরের জন্য LLM_PROVIDER=openai সেট করুন।'
        : ' Contact your local agricultural service centre for more. This is a demo/mock answer.'
      return {
        text: (language === 'en' ? 'Summary: ' : 'সংক্ষেপে: ') + joined + tail,
        model: 'mock-v1',
        latencyMs: 120,
      }
    },
  }
}

export function openAIProvider(llm) {
  return {
    name: 'openai',
    isMock: false,
    async generate({ system, user, timeoutMs = llm.timeoutMs }) {
      if (!llm.apiKey) {
        throw new ProviderError('LLM API key is not configured on the server.', {
          code: 'MISCONFIGURED',
          status: 503,
        })
      }
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const res = await fetch(`${llm.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${llm.apiKey}`,
          },
          body: JSON.stringify({
            model: llm.model,
            temperature: 0.2,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
          signal: controller.signal,
        })
        if (!res.ok) {
          throw new ProviderError(`LLM provider returned HTTP ${res.status}.`, {
            code: 'PROVIDER_HTTP_ERROR',
            status: 502,
          })
        }
        const data = await res.json()
        const text = data?.choices?.[0]?.message?.content
        if (!text) {
          throw new ProviderError('LLM provider returned an empty response.', {
            code: 'EMPTY_RESPONSE',
            status: 502,
          })
        }
        return { text: text.trim(), model: data.model || llm.model, latencyMs: 0 }
      } catch (err) {
        if (err?.name === 'AbortError') {
          throw new ProviderError('The AI provider timed out.', {
            code: 'TIMEOUT',
            status: 504,
            cause: err,
          })
        }
        if (err instanceof ProviderError) throw err
        throw new ProviderError('The AI provider could not be reached.', {
          code: 'PROVIDER_UNREACHABLE',
          status: 502,
          cause: err,
        })
      } finally {
        clearTimeout(timer)
      }
    },
  }
}

export function createProvider(config) {
  return config.provider === 'openai' ? openAIProvider(config.llm) : mockProvider()
}
