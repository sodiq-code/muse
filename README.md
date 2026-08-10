<div align="center">

# 🧠 MUSE

### **The AI Creative Team That Learns You**

**The product is not AI-generated content. The product is accumulated creative intelligence.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Minds SDK](https://img.shields.io/badge/Minds_SDK-0.1.3-purple)](https://www.npmjs.com/package/@animocabrands/minds-client-lib)
[![Prisma](https://img.shields.io/badge/Prisma-6-teal?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![Track](https://img.shields.io/badge/Track-Audience_Growth_&_Engagement-green)]()
[![Creative Minds Jam](https://img.shields.io/badge/Creative_Minds_Jam-1-orange)](https://dorahacks.io/hackathon/creativeminds/detail)

</div>

---

## The Problem

**78% of creators report burnout** (62% severe). The market is **winner-take-most** — brand dollars concentrate at the top, mid-tier creators lack team infrastructure. Current AI tools are **stateless**: every session starts from zero. They generate but don't learn. They respond but don't remember. They stop when you close the app.

> *"Persistence is the unlock that separates a useful chatbot from a true agent. Teams that deeply understand context and memory will win this."*
> — Yusuf Goolamabbas, Animoca CKO

> *"Agents that work persistently for creators — not platforms — is the future I want to fund."*
> — Yat Siu, Animoca Co-Founder

---

## The Solution — The Learning Loop

The learning loop is MUSE's core invention. Not the multi-Mind squad — the squad exists to serve the loop. **The loop is the moat.** Clippers generate; MUSE learns. A clipper's value is constant across users. MUSE's value compounds with use.

```
Create → Publish → Observe → Analyse → Update Memory → Change Strategy → Create Better
    ↑                                                                |
    └────────────────────────────────────────────────────────────────┘
```

This loop runs whether the creator is online or offline. **That is the point.**

---

## 🏗️ Architecture

```
CREATOR ("I'm going offline.")                    THREE EMOTIONAL TRIGGERS:
    ↓                                              1. The underdog creator
MUSE — Orchestrator Mind                           2. The overnight miracle
  Identity + Memory + State + Autonomy             3. Real value to the creator
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

| Agent | Role | Minds Features Used |
|-------|------|-------------------|
| **Muse** | Orchestrator — holds creator identity, persistent memory, strategic decisions, overnight autonomy. Wakes at 23:00, analyses signals, delegates to Maker, evaluates, updates memory, prepares 06:00 brief. | Soul, LTM, STM, Alarm Clock |
| **Maker** | Creative executor — receives structured instructions from Muse: `{creator, topic, audience, voice, historicalWinners, hookRecommendation}`. Returns draft. Does NOT own the creator's long-term memory — Muse does. | Skills, STM, Circles |
| **Guardian** | Community & safety — classifies comments, flags risks, surfaces audience questions, feeds intelligence back to Muse. | Circles, LTM |

**Overnight Work** — Approval-gated: Muse prepares autonomously, creator reviews with one tap. No uncontrolled public publishing. Every action produces an audit event.

---

## 🧩 Minds Integration — Remove Minds and MUSE Ceases to Function

The dependency is structural, not decorative:

| Minds Feature | What MUSE Loses Without It |
|---|---|
| **Soul** | No persistent agent identity — becomes a stateless chatbot |
| **LTM** | No cross-session memory — every session starts from zero |
| **STM** | Cannot track delegation → evaluation → approval flow |
| **Circles** | Three disconnected agents, no delegation possible |
| **Skills** | Advisory-only, cannot act |
| **Alarm Clock** | No overnight work — the core differentiator disappears |

---

## ✅ What's Built — Full Feature Inventory

### Core System

| Component | Count | Evidence |
|---|---|---|
| Prisma models (frozen schema) | **12** | `prisma/schema.prisma` |
| Service modules | **35** | `src/lib/*.ts` |
| API route handlers | **58** | `src/app/api/**` — 12 route groups |
| UI components (shadcn/ui) | **48** | `src/components/ui/*.tsx` |
| Total TypeScript files | **146** | `src/**/*.ts, *.tsx` |
| Dashboard screens | **5** | Today, Memory, Learning, Overnight, Control |

### Feature Matrix

| Feature | Implementation | Verified |
|---------|---------------|----------|
| **Dual-Account Minds Architecture** | Muse01 + muse02 via separate API keys, Circle delegation | ✅ LIVE |
| **Persistent Memory (LTM)** | 47+ MemoryEvents across 4 domains, survives restarts | ✅ Turso DB |
| **5-Step Learning Loop** | OBSERVE → COMPARE → INFER → UPDATE → RECOMMEND with statistical honesty | ✅ LIVE |
| **Live Chat with Muse** | Real AI responses via Minds SDK `waitForReply`, 13-31s response time | ✅ LIVE |
| **Voice Profile** | 7 dimensions (Directness 91, Technical Depth 88, Storytelling 72, Humor 34, Hype 8...) — honest profile, not a clone | ✅ DB |
| **Hook Pattern Taxonomy** | 8 types: contrarian_claim, question, story, statistic, tutorial, listicle, analogy, personal | ✅ DB |
| **Overnight Cycle** | Wake at 23:00 → Draft → Brief at 06:00, with "Run Overnight Now" button | ✅ LIVE |
| **Approval Gates** | Pending → Approve/Reject with reason, DB-persisted, expiry logic | ✅ LIVE |
| **SSE Real-Time Events** | Streaming from `/api/minds/events`, toast notifications, auto-reconnect | ✅ LIVE |
| **30s Auto-Polling** | Dashboard data refreshes every 30 seconds, "last updated" timestamp | ✅ Working |
| **Epistemic Honesty** | Sample-size gates (<3 = no pattern, <10 = no trend), confidence decay, simulation disclosure | ✅ Working |
| **3-Tier Demo Fallback** | Live → Simulated → Pre-recorded. All simulated data tagged `isSimulation: true` | ✅ Working |
| **Audit Trail** | 47+ events, time filters, actor filters, expandable JSON detail, CSV export | ✅ DB |
| **Content Ingestion Pipeline** | Bulk ingest, hook classification, metrics, performance summary | ✅ DB |
| **Creator Feedback → Memory** | Correction/approval/rejection/refinement → CreatorDecision + MemoryEvent | ✅ DB |
| **Delegation via Circles** | Muse → Maker with structured context, voice match evaluation | ✅ LIVE |

### Dashboard Screens

| Screen | Key Features |
|--------|-------------|
| **Today** | Greeting, overnight brief, top signals, pending approvals (approve/reject/modify), live activity feed (SSE), chat with Muse |
| **Memory** | Creator identity, voice radar (7 dimensions), winning hooks ranked by sample size + confidence, memory events timeline |
| **Learning** | 20-item learning timeline with confidence transitions, hook rankings, honesty checks, "Run Loop" button |
| **Overnight** | Schedule (23:00→00:00→06:00), Mind Theatre phase timeline, overnight output with draft + scores, "Run Overnight Now" button |
| **Control** | Autonomy settings (4 toggles), approval queue (approve/reject with reason + loading states), audit log (filters + search + export + expandable JSON) |

---

## 🎯 The Six Non-Negotiables

| # | Non-Negotiable | How MUSE Delivers |
|---|---|---|
| 1 | **Persistent memory** across sessions | LTM + Turso DB — 47+ MemoryEvents accumulate, never reset |
| 2 | **Structured learning** — performance changes memory, the loop closes | 5-step engine with confidence scoring and evidence chains |
| 3 | **Autonomous execution** — overnight wake-up without creator prompt | Alarm Clock + DB-backed scheduler + approval gates |
| 4 | **Delegation** — Muse → Maker via Circles with structured instructions | Circle API with full creator context as instruction payload |
| 5 | **Explainable recommendations** — every suggestion cites evidence | Sample sizes, confidence levels, historical baselines, forbidden phrases |
| 6 | **Working dashboard** — creator sees what happened | 5 screens, 58 endpoints, SSE events, 30s auto-refresh |

---

## 📊 Voice Profile — Honest, Not a Clone

```
Directness: 91 · Technical Depth: 88 · Storytelling: 72 · Humor: 34 · Hype: 8
```

Not a mathematical voice clone — a **profile**. This is how MUSE avoids the "sameness is death" problem: every creator's profile is unique and disclosed.

### Hook Pattern Taxonomy

| Pattern | Example | When It Wins |
|---------|---------|-------------|
| Contrarian claim | "Most AI agents aren't really agents" | When audience values expertise over agreement |
| Question | "What if your code could think?" | When curiosity gap drives engagement |
| Story | "Last week I shipped 10x faster..." | When personal narrative builds trust |
| Statistic | "78% of creators report burnout" | When authority/proof drives credibility |
| Tutorial | "Here's how I set up AI agents in 5 min" | When actionable value drives saves/shares |
| Listicle | "5 things every dev should know about AI" | When scannability drives consumption |
| Analogy | "AI agents are like interns..." | When simplification drives understanding |
| Personal | "I almost quit creating last month" | When vulnerability drives connection |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A [Minds Platform](https://build.hellominds.ai/) account with two Minds provisioned (Muse + Maker)

### Installation

```bash
# Clone and install
bun install

# Set up database (SQLite via Prisma + Turso)
bun run db:push

# Start development server
bun run dev
```

Open `http://localhost:3000` to see the dashboard.

### Environment Variables

Create a `.env` file with your Minds Platform credentials:

```env
# Minds Platform — Muse (Orchestrator)
MINDS_API_KEY_MUSE=your-muse-api-key
MINDS_MUSE_ID=your-muse-mind-id

# Minds Platform — Maker (Creative Executor)
MINDS_API_KEY_MAKER=your-maker-api-key
MINDS_MAKER_ID=your-maker-mind-id

# Database
DATABASE_URL=file:./dev.db
```

### Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server on port 3000 |
| `bun run build` | Production build |
| `bun run lint` | ESLint code quality check |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:generate` | Generate Prisma client |

---

## 🧪 Demo Walkthrough

### The Climax — Overnight Work

Jules goes offline at 22:00. MUSE wakes, analyses signals, recalls strongest hook patterns, delegates to Maker, evaluates, updates memory. At 06:00:

> *"Good morning. I worked while you were offline."*

Jules asks: *"Why did you choose this hook?"*

MUSE: *"Because you used this pattern 8 times. Those posts averaged 72% retention vs. your 61% baseline. You approved similar framing twice."*

**The judge sees recall, not generation.**

### Interactive Features to Demo

1. **Today Tab** — See live SSE events streaming in, chat with Muse (get real AI responses)
2. **Memory Tab** — Browse your accumulated creative intelligence across 4 domains
3. **Learning Tab** — Run the learning loop, watch confidence scores update with honesty checks
4. **Overnight Tab** — Click "Run Overnight Now", watch the full cycle execute with morning brief
5. **Control Tab** — Approve/reject pending drafts with reason, toggle autonomy settings, browse audit log

### Fallback System

Minds API degraded? Automatic graceful degradation:
- **Live mode** → Real Minds SDK responses
- **Simulated mode** → Context-aware generated responses (tagged `isSimulation: true`)
- **Pre-recorded mode** → Static demo data for offline/rehearsal

---

## 🛡️ Honesty, Scope & Limitations

### Statistical Honesty

Every claim carries an evidence level: **observed** → **correlation** → **confidence-weighted** → **recommendation**.

- **Sample-size gates**: < 3 data points = no "pattern"; < 10 = no "trend"
- **Confidence decay**: Confidence degrades without confirming evidence
- **Forbidden phrases**: "guaranteed", "always", "never" are blocked from recommendations

Example output:

> Hook: Contrarian claim · Historical avg: 61% · This post: 72% · Lift: +11pp · Confidence: Medium · *Increase contrarian openings, but test against tutorial openings before declaring a permanent preference.*

### Scope Discipline

Tier system enforces scope:
- **Tier 1** (always ships): Muse, Maker, learning loop, memory, dashboard, approval gates
- **Tier 2** (ships if time permits): Guardian, Circles, Bazaar Skill, real creator data
- **Tier 3** (only if finished): wallet, NFT, Scout

**Explicitly excluded:** full platform integrations, NFT marketplace, DAO, 10-agent swarm, fake metrics, unnecessary blockchain.

### Admitted Limitations

- Maker output uses simulator in current deployment (real Minds SDK `waitForReply` wired but Maker response latency is 30-60s)
- Content metrics, creator decisions, audience data use pre-recorded demo data tagged `isSimulation: true`
- One creator per manually-provisioned Mind — framed as cohort model for investment phase
- Minds Builder API is ~6 weeks old; no `POST /v1/minds` endpoint yet
- **Not built:** Real platform API integrations, multi-creator support, A/B testing, production deployment

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main dashboard (3,673 lines, 5 tabs)
│   ├── layout.tsx            # Root layout with Toaster
│   └── api/                  # 58 route handlers across 12 groups
│       ├── dashboard/        # Screen data: today, memory, learning, overnight, control
│       ├── minds/            # SDK proxy: status, chat, events, history, draft, skills, circle, message
│       ├── creator/          # Profile, voice, memory, decisions, audit, recruit
│       ├── content/          # CRUD, ingestion, performance, metrics
│       ├── learning/         # Full cycle: run, analyze, compare, predict, explain, honesty, hooks, rankings, proof
│       ├── delegation/       # Send task, evaluate output, get story beat
│       ├── autonomy/         # Approve, reject, expire, status, history, run-overnight
│       ├── feedback/         # Submit, summarize, refine, gate, simulate
│       ├── audit/            # Stats, filtered, export
│       ├── validation/       # Day 1 check, full run, honesty report
│       └── demo/             # Health, scene, rehearsal
├── components/ui/            # 48 shadcn/ui components
├── hooks/
│   ├── use-minds-events.ts   # SSE streaming with reconnect + simulated fallback
│   └── use-mobile.ts         # Responsive breakpoint hook
└── lib/                      # 35 service modules
    ├── minds-client.ts       # Minds SDK client configuration
    ├── minds-adapter.ts      # SDK adapter: send, history, waitForReply, live/simulate mode
    ├── learning-engine.ts    # 5-step learning loop
    ├── learning-engine-service.ts
    ├── honesty-verifier-service.ts  # Statistical honesty + forbidden phrases
    ├── voice-profiler.ts     # 7-dimension voice analysis
    ├── hook-classifier.ts    # 8-type hook taxonomy
    ├── hook-comparison.ts    # Pattern effectiveness comparison
    ├── delegation-service.ts # Muse → Maker delegation pipeline
    ├── delegation-beat-service.ts   # Story beat generation
    ├── overnight-scheduler-service.ts  # DB-backed overnight cycle + approval gates
    ├── overnight-screen-service.ts
    ├── autonomy-scheduler.ts
    ├── control-screen-service.ts
    ├── creator-service.ts    # Creator CRUD + voice
    ├── creator-feedback-service.ts
    ├── creator-recruitment.ts
    ├── ingestion-pipeline.ts
    ├── performance-service.ts
    ├── evaluation-service.ts
    ├── decision-service.ts
    ├── draft-pipeline.ts
    ├── maker-simulator.ts
    ├── memory-screen-service.ts
    ├── today-screen-service.ts
    ├── learning-screen-service.ts
    ├── explanation-service.ts
    ├── proof-experiment.ts
    ├── e2e-validation-service.ts
    ├── demo-reliability-service.ts
    ├── demo-prerecorded-data.ts
    ├── disclosed-simulation-service.ts
    ├── seed.ts               # Database seeder
    ├── db.ts                 # Prisma client (Turso)
    └── utils.ts              # Tailwind merge utility
```

---

## 🗄️ Database Schema

```
Creator (1) ──── (N) ContentItem
Creator (1) ──── (N) CreatorDecision
Creator (1) ──── (N) MemoryEvent
Creator (1) ──── (N) Recommendation
Creator (1) ──── (N) Draft
Creator (1) ──── (N) Approval
Creator (1) ──── (N) AuditEvent

ContentItem (1) ──── (N) ContentMetric
ContentItem (1) ──── (N) Hook
ContentItem (1) ──── (N) CreatorDecision
ContentItem (1) ──── (N) Draft
ContentItem (1) ──── (N) AutonomousRun

Hook (1) ──── (N) HookPattern
```

**12 models total**. Schema frozen as of Day 5 — no changes without explicit approval.

---

## 🏆 Hackathon Submission

**Creative Minds Jam #1: Hong Kong** — [dorahacks.io/hackathon/creativeminds/detail](https://dorahacks.io/hackathon/creativeminds/detail)

| | |
|---|---|
| **Track** | 1 — Audience Growth & Engagement |
| **Mind ID** | `9fd0483e-f36b-1410-8466-00039ce7df11` |
| **Deadline** | August 28, 2026, 23:59 HKT |
| **Prize Pool** | $10,000 USD |
| **Investment Path** | [Minds Investment Programme](https://build.hellominds.ai/program) — up to **$250K** |

> *"We're not building another AI content generator. We're building the persistent intelligence layer between a creator and their audience."*

### Track Fit

MUSE automates audience engagement feedback loops — learns what hooks retain viewers, what content grows audience, acts on those patterns proactively. **Audience growth powered by persistent memory, not generic advice.**

### Judging Criteria

| Criterion | How MUSE Satisfies |
|---|---|
| **Minds Integration Depth** | Structural dependency — remove Minds and product collapses (Soul, LTM, STM, Circles, Skills, Alarm Clock all required) |
| **Creator-Economy Problem Fit** | 78% burnout + winner-take-most = documented creator pain with specific solution |
| **Innovation & Creativity** | Learning loop is a category shift — clippers generate; MUSE learns. Statistical honesty prevents inflated claims |
| **Execution & Completeness** | 5 screens, 58 endpoints, 35 services, 12 DB models, 3-tier fallback, 6 non-negotiables met, live chat working |
| **Viability & Scalability** | Price ($19–29/mo), user (mid-tier creators), channel (Bazaar Skill), moat (memory compounds with use) |

---

## 💰 Business Model

| Tier | Price | Target |
|------|-------|--------|
| **Solo** | $19/mo | Independent creators (5K-20K followers) |
| **Growth** | $29/mo | Scaling creators (20K-100K followers) |

**Value metric**: Hours saved per week + content performance improvement rate. Not "content generated" — the value is in the **learning**, not the output.

**Growth path**: As creators grow from 5K → 50K → 500K followers, Muse's memory graph grows richer, recommendations become more accurate, and the creator's dependence on Muse deepens — not because of lock-in, but because the accumulated learning is genuinely valuable.

---

## 🧠 The Emotional Arc

### 1. The Underdog Creator

Jules has 12,000 YouTube subscribers. She spends evenings writing hooks, mornings checking analytics, afternoons wondering why last week's video underperformed. She can't afford a creative director. She can't afford to burn out. She is one algorithm change away from losing everything.

### 2. The Overnight Miracle

Jules tells Muse: *"I'm going offline."* She sleeps. While she sleeps, Muse analyzes her last 8 posts, identifies that contrarian hooks outperform by 11pp, drafts two hook variations with 72% predicted retention, and prepares a briefing. Jules wakes up to: *"Good morning. I worked while you were offline."* She reviews, approves, publishes — in 10 minutes instead of 6 hours.

### 3. Real Value to the Creator

After 30 days, Jules doesn't just have better hooks. She has a **creative intelligence asset**: a memory graph that knows her voice, audience, winning patterns, and decision history. Portable. Explainable. Compounding. The value isn't in Muse's output — it's in Jules's accumulated creative intelligence, captured and amplified by the learning loop.

---

## 🔑 Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/minds/status` | GET | Live Minds status (dual account, credits, skills, circle) |
| `/api/minds/chat` | POST | Chat with Muse — real AI responses via Minds SDK |
| `/api/minds/events` | GET | SSE stream — real-time Mind activity |
| `/api/learning/run` | POST | Execute full 5-step learning loop |
| `/api/learning/honesty` | GET | Run honesty verification on all metrics |
| `/api/autonomy/run-overnight` | POST | Trigger overnight cycle (DB-backed) |
| `/api/autonomy/approve` | POST | Approve pending action (approval gate) |
| `/api/autonomy/reject` | POST | Reject pending action with reason |
| `/api/delegation/send` | POST | Delegate task to Maker via Circle |
| `/api/content/ingest` | POST | Bulk content ingestion pipeline |
| `/api/dashboard/today` | GET | Today screen data (greeting, brief, signals, approvals) |
| `/api/dashboard/control` | GET | Control screen data (settings, queue, audit) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) + Framer Motion |
| **Database** | Prisma ORM + SQLite (local) / Turso (production) |
| **AI Platform** | Minds SDK (`@animocabrands/minds-client-lib`) |
| **State** | Zustand (client) + TanStack Query (server) |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |

---

<div align="center">

**Built for [Creative Minds Jam #1](https://dorahacks.io/hackathon/creativeminds/detail)**

*The product isn't AI-generated content. The product is accumulated creative intelligence.*

</div>
