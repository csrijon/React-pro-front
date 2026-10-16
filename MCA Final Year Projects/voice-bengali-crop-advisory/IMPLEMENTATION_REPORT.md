# Implementation Report — Phase 1 + Phase 2

Project: **বাংলা কৃষি সহায়ক (Voice-Based Bengali Crop Advisory AI Agent)**
Date of this report: 2026-10-12
Location: `MCA Final Year Projects/voice-bengali-crop-advisory/`

## 1. Repository baseline discovered

- The target folder `MCA Final Year Projects/` contained **only** the prompt file
  `Phase_1_and_2_Frontend_AI_Agent_Prompt.txt` — no existing application, so no stack to preserve.
- A separate, older folder (`Voice-Based Bengali Crop Advisory AI Agent/`) holds a chat-style
  **frontend-only mock prototype** (React + Vite, client-side mock answers). It was **not modified**
  and is **not** used by this project. This project is a clean implementation following the prompt.
- Per the prompt's default rule, the stack is: **React + Vite** (frontend) and **Node.js + Express**
  (backend), Node ≥ 20 (built-in `node --test` and global `fetch`, so no extra test/http libraries).
- Environment: Node v20.19.4, npm 10.8.2.

## 2. Features implemented

### Phase 1 — Frontend (implemented)

| feature | status | notes |
|---|---|---|
| Bengali-first responsive UI, title “বাংলা কৃষি সহায়ক” + English subtitle | ✅ | mobile-first CSS, Noto Sans Bengali |
| Pages: Home, Ask Advice, Crop Guide, Weather, About/Roadmap | ✅ | `react-router-dom`, no dead links, 404 page |
| Typed question (bn/en), example questions, loading state, error state | ✅ | AbortController timeout, safe Bengali error messages |
| Answer panel + source/evidence panel (titles, publisher, score, review flag) | ✅ | same data the agent used |
| Expert-escalation caution | ✅ | shown whenever `uncertainty.needs_expert` |
| Backend-connected (real HTTP call) | ✅ | `VITE_API_BASE`, health check drives the demo/live banner |
| Accessibility: skip link, labels, focus-visible, semantic HTML | ✅ | keyboard test recommended (manual) |
| Microphone control | ⛔ shown as “শীঘ্রই আসছে” (coming soon), **disabled** | no speech recognition claimed |
| Crop image preview / disease detection | ⛔ not implemented | Phase 3 |
| Weather: live data | ⛔ demo only unless `WEATHER_API_KEY` set | UI labels it “ডেমো তথ্য” |

### Phase 2 — Backend + AI workflow (implemented)

| feature | status | notes |
|---|---|---|
| `POST /api/advice` with question + optional language/crop | ✅ | documented in README |
| Input validation, 32 KB body limit, clear status codes | ✅ | 400/404/413/502/503/504 |
| LLM via **provider adapter** (`mock` \| `openai`), env-based config | ✅ | keys never logged or committed |
| Agent workflow: classify → route tools → retrieve → grounded prompt → generate → uncertainty | ✅ | `backend/src/agent/agent.js` |
| Explicit routing/tool-selection step | ✅ | `ROUTES` table + `steps[]` returned to the UI |
| Curated seed knowledge base with source metadata | ✅ | 9 entries, all `needs_review: true`, `url: null` (no fabricated links) |
| Honest labelling: keyword retrieval, **not** full RAG | ✅ | README + About page say so |
| Safety system prompt (language, no dosage, no invented facts, escalation) | ✅ | `agent/prompt.js` |
| Mock/demo mode visible in UI | ✅ | `/api/health.demo_mode` → yellow banner |
| `GET /api/health`, `GET /api/crop-guide`, `GET /api/weather` | ✅ | |
| CORS for the frontend origin, safe error messages, minimal logging | ✅ | logs only method/path/status/duration |
| No accounts / no database | ✅ | intentionally minimal |

## 3. Architecture and request flow

```
React UI (5173)
   │  POST /api/advice { question, language, crop }
   ▼
Express (4000)  → validate → agent.classify (keyword rules)
                            → agent route (ROUTES table)
                            → agent.retrieve (KB keyword scoring)
                            → prompt.buildSystemPrompt (grounded + safety rules)
                            → provider.generate (mock | openai-compatible, with timeout)
                            → post-check (needs_expert)
   ◄── { answer, category, sources[], uncertainty, provider, steps[] }
```

## 4. Files created

- Root: `README.md`, `IMPLEMENTATION_REPORT.md`, `package.json` (convenience scripts), `.gitignore`
- Backend: `package.json`, `.env.example`, `src/{index,server,config,logger,weather}.js`,
  `src/agent/{agent,classify,retrieve,prompt}.js`, `src/providers/adapter.js`,
  `src/routes/{advice,meta}.js`, `src/kb/seed.json`,
  `test/{agent,api,provider}.test.js`
- Frontend: `package.json`, `vite.config.js`, `index.html`, `.env.example`,
  `src/{main,App,index.css}`, `src/lib/api.js`,
  `src/pages/{Home,AskAdvice,CropGuide,Weather,About}.jsx`

## 5. Environment variables needed (names only)

`PORT`, `CORS_ORIGIN`, `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`,
`LLM_TIMEOUT_MS`, `WEATHER_API_KEY`, `WEATHER_PLACE`, `VITE_API_BASE`
(no secret values are stored in this repository; `.env` is git-ignored)

## 6. Commands run and their actual results

| command | result |
|---|---|
| `cd backend && npm install` | added 71 packages |
| `cd backend && npm test` | **21 tests, 21 pass, 0 fail** (`node --test`) |
| `cd frontend && npm install` | install ok (react, react-dom, react-router-dom, vite) |
| `cd frontend && npm run build` | **built in 669 ms** — dist/assets/index-*.js 182.65 kB (gzip 60.29 kB), css 5.75 kB |
| `node backend/src/index.js` + `curl /api/health` | `{"status":"ok","provider":"mock","demo_mode":true,…}` |
| `curl POST /api/advice` (Bengali leaf-spot question) | `200`, answer + 2 sources + 4 agent steps + `needs_expert:true` |
| `curl POST /api/advice` with empty question | `400` `{"error":"invalid_request",…}` |
| `npm run dev` (frontend) + `curl http://localhost:5173/` and `/ask` | `200` (dev server serves the app) |

Test suites: `test/agent.test.js` (classify/retrieve/prompt), `test/api.test.js` (HTTP behaviour),
`test/provider.test.js` (failure, timeout, misconfiguration, mock flags).

## 7. Manual testing still needed

- Open http://localhost:5173 on a phone-sized viewport and walk through all 5 pages.
- Keyboard-only navigation (Tab through nav, form, chips, submit) and visible focus rings.
- Submit each example question and confirm the source panel and caution box appear.
- Turn the backend off and confirm the red "ব্যাকএন্ড সার্ভার পাওয়া যায়নি" banner.
- With `LLM_PROVIDER=openai` and a real key, confirm the banner becomes "লাইভ মোড" and answers change.
- Oversized paste (> 600 chars) and malformed JSON requests.

## 8. Mocked / partial / not implemented

- **Mocked:** the LLM itself (`mock` provider, default), weather (demo payload without a key).
- **Partial:** weather (live path exists but needs an API key); escalation logic (rule-based).
- **Not implemented:** speech-to-text, text-to-speech, crop-image disease detection, vector RAG,
  user accounts, database, evaluation set, deployment.

## 9. Next 3 recommended tasks

1. Wire a real LLM key (`LLM_PROVIDER=openai`) and compare 10 Bengali questions against the mock
   answers; tune the system prompt in `backend/src/agent/prompt.js`.
2. Grow the knowledge base: get 3–5 reviewed entries per major crop from an authoritative source,
   record `publisher`, verified `url` and `reviewed_date`, flip `needs_review` to `false`.
3. Start Phase 3 with speech: browser `SpeechRecognition` (bn-IN/bn-BD) for input and
   `speechSynthesis` for reading answers aloud, with graceful fallback where unsupported.

## 10. Viva one-paragraph explanation

"We built a Bengali crop-advisory web app. The React frontend asks the Express backend a question
over `POST /api/advice`. The backend runs a small agent pipeline: keyword rules classify the
question into a topic (irrigation, pest, fertilizer…), a routing table decides which tools run, a
local knowledge base is searched by keyword, and those snippets are inserted into the system prompt
so the model's answer is *grounded* in real entries. A provider adapter lets us swap a mock demo
model for a real OpenAI-compatible model using only environment variables. Every answer comes back
with its sources, an uncertainty flag, and an escalation message telling the farmer to contact KVK
when evidence is thin. Speech, live weather and image-based disease detection are honest Phase 3
items — the UI shows them as coming soon rather than pretending they work."
