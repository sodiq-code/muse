<div align="center">

# 🧠 MUSE

### **The AI Creative Team That Learns You**

**The product is not AI-generated content. The product is accumulated creative intelligence.**

[![CI](https://github.com/sodiq-code/muse/actions/workflows/ci.yml/badge.svg)](https://github.com/sodiq-code/muse/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/test_functions-27-brightgreen)](./scripts/count-test-functions.sh)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Minds SDK](https://img.shields.io/badge/Minds_SDK-0.1.3-purple)](https://www.npmjs.com/package/@animocabrands/minds-client-lib)
[![Prisma](https://img.shields.io/badge/Prisma-6-teal?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**→ [Watch the Demo Video](https://youtu.be/VnYF-AQzKMo)**

</div>

---

## The Problem

**78% of creators report burnout** (62% severe). The market is winner-take-most — brand dollars concentrate at the top, mid-tier creators lack team infrastructure. Current AI tools are stateless: every session starts from zero. They generate but don't learn. They respond but don't remember. They stop when you close the app.

> *"Persistence is the unlock that separates a useful chatbot from a true agent."*
> — Yusuf Goolamabbas, Animoca CKO

---

## The Solution — The Learning Loop

The learning loop is MUSE's core invention. **The loop is the moat.** Clippers generate; MUSE learns. A clipper's value is constant across users. MUSE's value compounds with use.

```
Create → Publish → Observe → Analyse → Update Memory → Change Strategy → Create Better
    ↑                                                                |
    └────────────────────────────────────────────────────────────────┘
```

This loop runs whether the creator is online or offline. **That is the point.**

---

## 🏗️ Architecture

```
CREATOR ("I'm going offline.")
    ↓
MUSE — Orchestrator Mind
  Identity + Memory + State + Autonomy
    ↓           ↓
MAKER          GUARDIAN
Creation       Community
& Voice        & Safety
    ↓
LEARNING ENGINE — Observe → Compare → Infer → Update → Recommend
    ↓
CREATOR MEMORY GRAPH — Identity · Voice · Audience · Performance · Hooks · Decisions
    ↓
NEXT ACTION
```

| Agent | Role | Minds Features |
|-------|------|---------------|
| **Muse** | Orchestrator — holds creator identity, persistent memory, strategic decisions, and overnight autonomy. Runs the full overnight pipeline: reviews signals, delegates to Maker, evaluates output, updates memory, and prepares the morning brief. | Soul, LTM, STM, Skills |
| **Maker** | Creative executor — receives structured instructions `{creator, topic, audience, voice, historicalWinners, hookRecommendation}`. Returns draft. Muse owns the long-term memory — Maker does not. | Skills, STM, Circles |
| **Guardian** | Community & safety — classifies comments, flags risks, surfaces audience questions, feeds intelligence back to Muse. | Circles, LTM |

**Overnight Work** — Approval-gated: Muse prepares a candidate draft (never publishes without human Approve), the creator reviews with one tap, and every action produces an `AuditEvent` for full traceability.

---

## 🧩 Minds Integration — Structural Dependency

Remove Minds and MUSE ceases to function. The dependency is structural, not decorative:

| Minds Feature | What MUSE Loses Without It |
|---|---|
| **Soul** | No persistent agent identity — becomes a stateless chatbot |
| **LTM** | No cross-session memory — every session starts from zero |
| **STM** | Cannot track delegation → evaluation → approval flow |
| **Circles** | Three disconnected agents, no delegation possible |
| **Skills** | Advisory-only, cannot act |

---

## ✅ What's Built

| Component | Count |
|---|---|
| Prisma models | **12** |
| Service modules | **35** |
| API route handlers | **58** |
| UI components (shadcn/ui) | **48** |
| Dashboard screens | **5** |
| Total TypeScript files | **146** |
| **CI/CD test functions** | **[27](./scripts/count-test-functions.sh)** — see [CI/CD & Testing](#cicd--testing) |

### Feature Matrix

Every row below is backed by a concrete artifact in the repo (file:line or file:function), not a status badge. **Proof, not promises** — click through to verify.

| Feature | Implementation | Proof (where it lives in the code) |
|---------|---------------|------------------------------------|
| **Dual-Account Minds Architecture** | Muse01 + muse02 via separate API keys, Circle delegation | `src/lib/minds-client.ts:28-66` — `MINDS_BUILDER_API_KEY` + `MINDS_MAKER_API_KEY`, `getMuseClient()` / `getMakerClient()`; `src/lib/minds-adapter.ts:281-326` `adapterGetCircle` / `adapterAddCircleMembers` |
| **Persistent Memory (LTM)** | MemoryEvents across domains, DB-persisted | `prisma/schema.prisma:123` `model MemoryEvent { category, key, value, confidence, source }`; `src/app/api/creator/memory/route.ts`; `src/app/api/dashboard/memory/route.ts` |
| **5-Step Learning Loop** | OBSERVE → COMPARE → INFER → UPDATE → RECOMMEND with confidence scoring | `src/lib/learning-engine-service.ts:3` (loop header), `:27` `EvidenceType` (`observed\|correlation\|recommendation\|insufficient\|statistical`), `:211-283` honesty checks; `src/app/api/learning/run/route.ts` |
| **Live Chat with Muse** | Real AI responses via Minds SDK `waitForReply` | `src/app/api/minds/chat/route.ts:10,106` `adapterSendMessageAndWait`; `src/lib/minds-adapter.ts:180` wraps `liveWaitForReply` |
| **Voice Profile** | 7 dimensions — Directness 91, Technical Depth 88, Storytelling 72, Humor 34, Hype 8 | `src/lib/voice-profiler.ts:54` `JULES_VOICE_PROFILE` (seed values), `:457` `analyzeVoice()`, `:494` `computeVoiceMatch()` |
| **Hook Pattern Taxonomy** | 8 types: contrarian_claim, question, story, statistic, tutorial, listicle, analogy, personal | `src/lib/hook-classifier.ts:12-19` `HookPattern` union, `:262` `ALL_PATTERNS`, `:277` `classifyHook()` |
| **Overnight Cycle** | On-demand autonomous pipeline: Muse reviews performance signals → delegates to Maker via Circle → Maker produces draft → Muse evaluates (voice match + hook compatibility) → stores candidate draft → prepares morning brief. Triggered from the dashboard and fully audit-logged. | `src/app/api/autonomy/run-overnight/route.ts` (POST), `src/lib/overnight-scheduler-service.ts:170` `runOvernightCycle()`, button at `src/app/page.tsx:2614` `onClick={runOvernightCycleAction}` |
| **Approval Gates** | Pending → Approve/Reject with reason, DB-persisted, expiry logic | `prisma/schema.prisma` `model Approval`; `src/lib/overnight-scheduler-service.ts:740` `approveAction`, `:837` `rejectAction`, `:990` `expireStaleApprovals`; `src/app/api/autonomy/{approve,reject,expire}/route.ts` |
| **SSE Real-Time Events** | Streaming from `/api/minds/events`, toast notifications, auto-reconnect | `src/app/api/minds/events/route.ts:18,60,91` `ReadableStream` + `text/event-stream` + `controller.enqueue`; `src/hooks/use-minds-events.ts` `EventSource` reconnect |
| **30s Auto-Polling** | Dashboard data refreshes every 30 seconds | `src/app/page.tsx:1465-1479` `setInterval(..., 30_000)` → `refreshAllDashboardData()` |
| **Statistical Confidence** | Sample-size gates, evidence-classified recommendations | `src/lib/learning-engine-service.ts:27` `EvidenceType`, `:177` `sampleSize`, `:260-279` "too few data points" + causation guards; `src/lib/hook-comparison.ts` |
| **Audit Trail** | Time/actor filters, expandable JSON detail, CSV export | `src/app/api/audit/export/route.ts:35` (`format === 'csv'`), `src/app/api/audit/filtered/route.ts`, `src/lib/overnight-scheduler-service.ts:1234` `getFilteredAuditTrail`, `:1149` `getAuditStats` |
| **Content Ingestion** | Bulk ingest, hook classification, metrics, performance summary | `src/lib/ingestion-pipeline.ts:3,54` `bulkIngestContent` → `classifyHook`; `src/app/api/content/ingest/route.ts:42` |
| **Delegation via Circles** | Muse → Maker with structured context, voice match evaluation | `src/app/api/delegation/send/route.ts:52` (POST execute), `src/app/api/delegation/beat/route.ts`; `src/lib/delegation-service.ts`, `src/lib/delegation-beat-service.ts` |
| **CI/CD + Unit Tests** | GitHub Actions: lint → typecheck → test → secret-guard → build; 27 test functions | `.github/workflows/ci.yml`; `tests/{hook-classifier,voice-profiler,utils}.test.ts`; `scripts/count-test-functions.sh` → `27` |

### Dashboard Screens

| Screen | Key Features |
|--------|-------------|
| **Today** | Greeting, overnight brief, top signals, pending approvals (approve/reject/modify), live activity feed, chat with Muse |
| **Memory** | Creator identity, voice radar (7 dimensions), winning hooks ranked by confidence, memory events |
| **Learning** | Learning timeline with confidence transitions, hook rankings, honesty checks, "Run Loop" button |
| **Overnight** | Schedule (23:00→00:00→06:00), Mind Theatre phase timeline, overnight output with scores, "Run Overnight Now" |
| **Control** | Autonomy settings (4 toggles), approval queue with approve/reject + reason, audit log with filters + export |

---

## 📊 Voice Profile & Hook Intelligence

### Voice Radar

```
Directness: 91 · Technical Depth: 88 · Storytelling: 72 · Humor: 34 · Hype: 8
```

Every creator's profile is unique — MUSE amplifies individual voice, never replicates a generic template.

### Hook Pattern Taxonomy

| Pattern | Example | When It Wins |
|---------|---------|-------------|
| Contrarian claim | "Most AI agents aren't really agents" | Audience values expertise over agreement |
| Question | "What if your code could think?" | Curiosity gap drives engagement |
| Story | "Last week I shipped 10x faster..." | Personal narrative builds trust |
| Statistic | "78% of creators report burnout" | Authority drives credibility |
| Tutorial | "Here's how I set up AI agents in 5 min" | Actionable value drives saves/shares |
| Listicle | "5 things every dev should know about AI" | Scannability drives consumption |
| Analogy | "AI agents are like interns..." | Simplification drives understanding |
| Personal | "I almost quit creating last month" | Vulnerability drives connection |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js 18+
- [Minds Platform](https://build.hellominds.ai/) account with two Minds provisioned (Muse + Maker)

### Installation

```bash
bun install
bun run db:push
bun run dev
```

### Environment Variables

A complete, documented template lives at **[`.env.example`](./.env.example)**. Copy it and fill in real values:

```bash
cp .env.example .env
```

```env
# Minimal local-dev set (see .env.example for the full list incl. Turso + dual Minds accounts)
DATABASE_URL=file:./dev.db
MINDS_MODE=live                 # or "simulate" for deterministic local mock data
MINDS_BUILDER_API_KEY=your-muse-api-key
MINDS_MUSE_ID=your-muse-mind-id
MINDS_MAKER_API_KEY=your-maker-api-key
MINDS_MAKER_ID=your-maker-mind-id
```

Production secrets are injected through the hosting platform's environment configuration (e.g. Vercel project environment variables) and are never stored in the repository.

---

## 🔁 CI/CD & Testing

A GitHub Actions pipeline runs on every push to `main` and on every pull request (see **[`.github/workflows/ci.yml`](./.github/workflows/ci.yml)**):

| Stage | Command | Purpose |
|-------|---------|---------|
| install | `bun install --frozen-lockfile` | Reproducible deps |
| lint | `bun run lint` | ESLint + Next.js rules |
| typecheck | `bunx tsc --noEmit` | Strict TypeScript |
| test | `bunx vitest run` | Unit test suite |
| count | `bash scripts/count-test-functions.sh` | Surfaces the test-function count to the job summary |
| secret-guard | `git ls-files \| grep '^\.env'` | Blocks any real `.env` from being tracked |
| build | `bun run build` | Production build |

### Test-function count: **27**

Counted by [`scripts/count-test-functions.sh`](./scripts/count-test-functions.sh) and re-verified locally:

```bash
bun run test:count   # → 27
bun run test         # → 3 files, 27 tests passed
```

| Test file | Functions | Covers |
|-----------|-----------|--------|
| `tests/hook-classifier.test.ts` | 11 | 8-pattern taxonomy, `classifyHook` / `classifyHooks`, confidence bounds |
| `tests/voice-profiler.test.ts` | 11 | Seed profile, `computeVoiceMatch` (perfect + divergent), `analyzeVoice`, color thresholds |
| `tests/utils.test.ts` | 5 | `cn()` class merging, tailwind-merge dedup, falsy handling |

Run locally:

```bash
bun install
bun run test         # run once
bun run test:watch   # watch mode
bun run lint         # eslint
bun run typecheck    # tsc --noEmit
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 4 + shadcn/ui + Framer Motion |
| **Database** | Prisma ORM + Turso |
| **AI Platform** | Minds SDK (`@animocabrands/minds-client-lib`) |
| **State** | Zustand + TanStack Query |
| **Validation** | Zod + React Hook Form |

---

<div align="center">

*The product isn't AI-generated content. The product is accumulated creative intelligence.*

</div>
