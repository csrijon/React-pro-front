# PROJECT REPORT
### বাংলা কৃষি সহায়ক — Voice-Based Bengali Crop Advisory AI Agent
**Course:** MCA Final Year Project
**Milestone:** Phase 1 (Frontend Prototype) + Phase 2 (Backend & Basic AI-Agent Workflow)
**Status:** Completed for this milestone (Phase 3 remains)

---

## 1. Project Overview

A web application that helps Bengali-speaking farmers of West Bengal get **first-level crop
guidance** in Bengali. The user types a question (voice input is planned for Phase 3), the system
understands the topic, searches a small agricultural knowledge base, and answers in Bengali with
**visible sources** and an honest **"ask an expert"** warning when evidence is weak.

> This is informational support only — it is **not** a diagnosis system and **does not replace**
> a qualified agricultural expert or Krishi Vigyan Kendra (KVK).

---

## 2. What Is Completed

### ✅ Phase 1 — Frontend (100% of scope)

| # | Feature | Status |
|---|---|---|
| 1 | Bengali-first, mobile-first responsive UI titled **“বাংলা কৃষি সহায়ক”** with English subtitle | ✅ Done |
| 2 | 5 pages/sections: **Home, Ask Advice, Crop Guide, Weather, About/Roadmap** | ✅ Done |
| 3 | Ask Advice: bn/en typed question, optional crop & language selector | ✅ Done |
| 4 | Example (suggestion) questions — one click to ask | ✅ Done |
| 5 | Loading state, error state, empty-input handling, API-failure handling | ✅ Done |
| 6 | Answer panel with topic badge (সেচ / পোক-রোগ / সার / ফসল / সাধারণ) | ✅ Done |
| 7 | Source/evidence panel (title, publisher, score, review status, link-or-none) | ✅ Done |
| 8 | Expert-escalation caution box when the answer is uncertain or demo | ✅ Done |
| 9 | "Agent trace" panel showing which steps the agent executed | ✅ Done |
| 10 | Crop Guide: searchable entries (rice, potato, jute, vegetables…) | ✅ Done |
| 11 | Weather page: live data if API key set, otherwise clearly labelled **demo** | ✅ Done |
| 12 | Demo-mode / live-mode banner driven by `GET /api/health` | ✅ Done |
| 13 | Accessibility: skip link, labelled form controls, visible focus states, semantic HTML, `aria-live` regions | ✅ Done |
| 14 | Microphone button shown as **“শীঘ্রই আসছে”** and disabled (no fake speech claim) | ✅ Done (honest placeholder) |
| 15 | No dead links + 404 page | ✅ Done |

### ✅ Phase 2 — Backend & AI-Agent Workflow (100% of scope)

| # | Feature | Status |
|---|---|---|
| 1 | Node.js + Express REST API, separate from the frontend | ✅ Done |
| 2 | `POST /api/advice` — question + optional `language`/`crop` → structured JSON | ✅ Done |
| 3 | `GET /api/health`, `GET /api/crop-guide`, `GET /api/weather` | ✅ Done |
| 4 | Input validation (1–600 chars), 32 KB body limit, clear HTTP status codes (400/404/413/502/503/504) | ✅ Done |
| 5 | Timeout + provider-failure handling with safe user-facing messages | ✅ Done |
| 6 | LLM integrated through a **provider adapter** (all keys/models via env vars) | ✅ Done |
| 7 | **Agent workflow** in its own module (`backend/src/agent/`):<br>1. validate → 2. **classify** topic → 3. **tool routing** → 4. **retrieve** from KB → 5. **grounded prompt** → 6. **generate** → 7. uncertainty check | ✅ Done |
| 8 | Explicit tool-selection step (`ROUTES` table: `kb_retrieve`, `weather_hint`) — more than one LLM call | ✅ Done |
| 9 | Small curated **seed knowledge base** (9 entries) with source metadata: title, publisher, url, crop/topic, reviewed date, `needs_review` | ✅ Done |
| 10 | Safety system prompt: answer in user's language, no invented facts, **no chemical dosages**, general-guidance vs diagnosis, escalate to expert/KVK when evidence is insufficient | ✅ Done |
| 11 | Response contains: `answer`, `category`, `sources[]`, `uncertainty.needs_expert`, `provider`, `steps[]` | ✅ Done |
| 12 | **Mock/demo provider mode** for local development, visibly flagged in the UI (yellow banner) | ✅ Done |
| 13 | CORS limited to the frontend origin, minimal logging (no question text / personal data) | ✅ Done |
| 14 | `.env.example` placeholders only, `.env` ignored by Git, no secrets committed | ✅ Done |
| 15 | No user accounts, no database (kept minimal as instructed) | ✅ Done |

### ✅ Testing, Build & Documentation

| # | Item | Actual result |
|---|---|---|
| 1 | Backend unit/API tests (`node --test`, 3 files) | **21 tests — 21 pass, 0 fail** |
| 2 | Test coverage: valid question, empty, oversized, invalid language, retrieval hit, retrieval miss, provider failure (502), timeout (504), missing API key (503), mock flags, health, crop-guide, weather, 404 | ✅ Done |
| 3 | Frontend production build (`vite build`) | ✅ built in 669 ms — JS 182.65 kB (gzip 60.29 kB), CSS 5.75 kB |
| 4 | Manual smoke test: server start, `/api/health`, advice request, empty-question 400, frontend dev server 200 | ✅ Done |
| 5 | `README.md` — setup, env config, API contract, Mermaid architecture, concepts glossary, limitations, Phase 3 | ✅ Done |
| 6 | `IMPLEMENTATION_REPORT.md` — truthful feature status table + viva explanation | ✅ Done |
| 7 | `.gitignore` — `node_modules/`, `dist/`, `.env` verified ignored | ✅ Done |

---

## 3. Tech Stack (one-line summary)

| Layer | Technology |
|---|---|
| Frontend | **React 18** + **Vite 5** + **React Router 6**, hand-written CSS |
| Backend | **Node.js 20** + **Express 4** |
| AI / Agent | Custom agent pipeline (JS modules) + **LLM provider adapter** (OpenAI-compatible API via native `fetch`, default **mock mode**) |
| Data | Static JSON knowledge base (no database) |
| Testing | **node:test** (Node's built-in test runner) + native `fetch` for HTTP tests |
| Tooling | npm, dotenv, CORS package, Git |

---

## 4. Technology List (with why it was used)

### Frontend
| Technology | Version | Purpose / why |
|---|---|---|
| React | ^18.3.1 | Component-based UI, state management for chat-like answer flow |
| Vite | ^5.4.11 | Fast dev server + production bundler (replaces CRA/webpack) |
| @vitejs/plugin-react | ^4.3.4 | JSX transform and React Fast Refresh |
| react-router-dom | ^6.28.0 | Client-side routing for the 5 pages + 404 |
| Plain CSS (custom properties, Grid/Flexbox) | — | Mobile-first responsive design, no heavy UI library |
| Google Fonts — Noto Sans Bengali + Inter | — | Readable Bengali typography |
| Web Speech API | — | **Not used** — button shown as "coming soon" (Phase 3) |

### Backend
| Technology | Version | Purpose / why |
|---|---|---|
| Node.js | ≥ 20 (v20.19.4 used) | Built-in `fetch` (no axios), built-in `node --test` (no Jest), `AbortController` timeouts |
| Express | ^4.21.2 | HTTP server, routing, middleware |
| cors | ^2.8.5 | Restrict API access to the frontend origin |
| dotenv | ^16.4.5 | Load `.env` variables — keys never hardcoded |
| JSON files (`kb/seed.json`) | — | Zero-cost, inspectable knowledge base (no DB per instructions) |

### AI / Agent concepts implemented
| Concept | Where |
|---|---|
| **Provider adapter** (swap mock ↔ real LLM without touching agent code) | `backend/src/providers/adapter.js` |
| **Classification / tool routing** (explicit decision step) | `backend/src/agent/classify.js`, `ROUTES` in `agent.js` |
| **Retrieval** (keyword scoring over the knowledge base) | `backend/src/agent/retrieve.js` |
| **Grounding** (retrieved snippets injected into system prompt) | `backend/src/agent/prompt.js` |
| **Source attribution** (titles/publisher/review flags returned) | `sources[]` in the API response |
| **Uncertainty / escalation flag** | `uncertainty.needs_expert` |
| **Environment-based configuration** | `backend/src/config.js` + `.env.example` |
| Timeout handling (AbortController) | openAI provider in `adapter.js` |

> Honest note: retrieval is **keyword-based**, so it is described as
> *"tool-routed, retrieval-grounded"* — not full vector RAG.

---

## 5. Architecture (text diagram)

```
┌──────────────────────────────┐
│  FRONTEND — React + Vite     │  http://localhost:5173
│  Home | Ask | Guide | Weather│
│  | About   (Bengali UI)      │
└──────────────┬───────────────┘
               │  POST /api/advice {question, language, crop}
               │  GET  /api/health | /api/crop-guide | /api/weather
┌──────────────▼───────────────┐
│  BACKEND — Node.js + Express │  http://localhost:4000
│  validate → agent pipeline:  │
│    classify → route → retrieve│
│    → grounded prompt → generate│
│  provider: mock | openai      │
│  KB: kb/seed.json (9 entries) │
└──────────────┬───────────────┘
               │  returns {answer, category, sources[],
               │           uncertainty, provider, steps[]}
               ▼
        JSON response rendered in the answer panel
```

---

## 6. API Summary

| Method | Endpoint | Purpose | Result |
|---|---|---|---|
| POST | `/api/advice` | Ask a question | 200 answer+sources+steps · 400/413 invalid · 502/503/504 provider issues |
| GET | `/api/health` | Server + demo/live mode | 200 |
| GET | `/api/crop-guide` | Knowledge base entries for the guide page | 200 |
| GET | `/api/weather` | Live weather if configured, else labelled demo | 200 |

---

## 7. Test & Build Results (actually run)

| Command | Result |
|---|---|
| `cd backend && npm install` | 71 packages added |
| `cd backend && npm test` | **21/21 pass, 0 fail** |
| `cd frontend && npm run build` | **success** — 40 modules, JS 182.65 kB (gzip 60.29 kB), CSS 5.75 kB |
| `npm start` + `curl /api/health` | `{"status":"ok","provider":"mock","demo_mode":true}` |
| `curl POST /api/advice` (Bengali question) | 200 with answer, 2 sources, 4 agent steps, `needs_expert:true` |
| `curl` empty question | `400 invalid_request` |
| Frontend dev server `/` and `/ask` | 200 |

---

## 8. NOT Completed (truthful list — Phase 3)

| Feature | Status |
|---|---|
| Speech-to-text (Bengali voice input) | ❌ Not implemented — UI says "শীঘ্রই আসছে" |
| Text-to-speech (answer read aloud) | ❌ Not implemented |
| Live weather by default | ⛔ Demo only — needs `WEATHER_API_KEY` |
| Crop image → disease detection model | ❌ Not implemented |
| Vector/embedding RAG | ❌ Keyword retrieval only (documented honestly) |
| Real LLM answers | ⛔ **Mock mode by default** — needs `LLM_PROVIDER=openai` + key |
| User login / database | ❌ Intentionally excluded from this milestone |
| Evaluation set / accuracy measurement | ❌ Not done |
| Deployment (cloud hosting) | ❌ Not done |

---

## 9. Deliverables Checklist

1. ✅ Working responsive frontend (5 pages)
2. ✅ Backend API connected to the frontend
3. ✅ Tool-routed, retrieval-grounded Bengali advisory workflow with source metadata + uncertainty handling
4. ✅ `.env.example`, `.gitignore` checks, API documentation (README)
5. ✅ Tests/build results with commands (this report §7)
6. ✅ Updated README + truthful implementation report
7. ✅ Remaining-work list for Phase 3 (this report §8)

---

## 10. How to Run

```bash
# Terminal 1 — backend
cd backend && cp .env.example .env && npm install && npm start

# Terminal 2 — frontend
cd frontend && cp .env.example .env && npm install && npm run dev
```
Open **http://localhost:5173** (yellow banner = demo/mock mode).

---

*Report generated: 2026-10-12 · All numbers above are from commands actually executed during development.*
