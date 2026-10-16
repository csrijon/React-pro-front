import { Router } from 'express'
import { runAdvisory } from '../agent/agent.js'

const LANGS = new Set(['bn', 'en'])

export function adviceRouter({ provider, config }) {
  const router = Router()

  // POST /api/advice  { question, language?, crop? }
  router.post('/', async (req, res) => {
    const body = req.body || {}
    const question = typeof body.question === 'string' ? body.question.trim() : ''
    const language = typeof body.language === 'string' ? body.language : 'bn'
    const crop = typeof body.crop === 'string' ? body.crop.trim() : ''

    if (!question) {
      return res.status(400).json({
        error: 'invalid_request',
        message: 'প্রশ্ন খালি হতে পারে না। (question is required)',
      })
    }
    if (question.length > config.limits.maxQuestionChars) {
      return res.status(400).json({
        error: 'question_too_long',
        message: `প্রশ্ন সর্বোচ্চ ${config.limits.maxQuestionChars} অক্ষরের হতে পারে।`,
      })
    }
    if (!LANGS.has(language)) {
      return res.status(400).json({
        error: 'invalid_language',
        message: 'language must be "bn" or "en"',
      })
    }
    if (crop.length > config.limits.maxCropChars) {
      return res.status(400).json({
        error: 'crop_too_long',
        message: `crop must be at most ${config.limits.maxCropChars} characters`,
      })
    }

    try {
      const result = await runAdvisory({ question, language, crop, provider })
      return res.json(result)
    } catch (err) {
      // Safe messages only — never leak stack traces or provider internals.
      const status = err?.status || 500
      const message =
        status === 504
          ? 'AI সেবাটি সময়মতো উত্তর দেয়নি, আবার চেষ্টা করুন।'
          : status >= 500
            ? 'AI সেবাটি এখন সাড়া দিচ্ছে না। অনুগ্রহ করে পরে চেষ্টা করুন।'
            : err?.message || 'Request failed.'
      console.error('[advice] error', err?.code || 'INTERNAL', err?.message)
      return res.status(status).json({ error: err?.code || 'internal_error', message })
    }
  })

  return router
}
