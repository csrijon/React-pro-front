// Loads environment variables once and exports a single typed config object.
// Nothing secret is ever printed — only names are used elsewhere.
import 'dotenv/config'

const flag = (value, fallback) =>
  value === undefined || value === '' ? fallback : /^(1|true|yes)$/i.test(value)

const num = (value, fallback) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function loadConfig(env = process.env) {
  const provider = (env.LLM_PROVIDER || 'mock').toLowerCase()
  return {
    port: num(env.PORT, 4000),
    corsOrigin: env.CORS_ORIGIN || 'http://localhost:5173',
    provider: provider === 'openai' ? 'openai' : 'mock',
    llm: {
      apiKey: env.LLM_API_KEY || env.OPENAI_API_KEY || '',
      baseUrl: (env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, ''),
      model: env.LLM_MODEL || 'gpt-4o-mini',
      timeoutMs: num(env.LLM_TIMEOUT_MS, 12000),
    },
    weather: {
      apiKey: env.WEATHER_API_KEY || '',
      place: env.WEATHER_PLACE || 'Barasat,West Bengal,IN',
    },
    limits: {
      maxQuestionChars: 600,
      maxCropChars: 60,
    },
    demo: !flag(env.PRODUCTION, false) && provider !== 'openai',
  }
}
