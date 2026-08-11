<div align="center">

# 🧠 MUSE

### **The AI Creative Team That Learns You**

**The product is not AI-generated content. The product is accumulated creative intelligence.**

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
| **Muse** | Orchestrator — holds creator identity, persistent memory, strategic decisions, overnight autonomy. Wakes at 23:00, analyses signals, delegates to Maker, evaluates, updates memory, prepares 06:00 brief. | Soul, LTM, STM, Alarm Clock |
| **Maker** | Creative executor — receives structured instructions `{creator, topic, audience, voice, historicalWinners, hookRecommendation}`. Returns draft. Muse owns the long-term memory — Maker does not. | Skills, STM, Circles |
| **Guardian** | Community & safety — classifies comments, flags risks, surfaces audience questions, feeds intelligence back to Muse. | Circles, LTM |

**Overnight Work** — Approval-gated: Muse prepares autonomously, creator reviews with one tap. Every action produces an audit event.

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
| **Alarm Clock** | No overnight work — the core differentiator disappears |

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

### Feature Matrix

| Feature | Implementation | Status |
|---------|---------------|--------|
| **Dual-Account Minds Architecture** | Muse01 + muse02 via separate API keys, Circle delegation | ✅ LIVE |
| **Persistent Memory (LTM)** | MemoryEvents across 4 domains (Identity, Voice, Audience, Performance), DB-persisted | ✅ LIVE |
| **5-Step Learning Loop** | OBSERVE → COMPARE → INFER → UPDATE → RECOMMEND with confidence scoring | ✅ LIVE |
| **Live Chat with Muse** | Real AI responses via Minds SDK `waitForReply` | ✅ LIVE |
| **Voice Profile** | 7 dimensions — Directness 91, Technical Depth 88, Storytelling 72, Humor 34, Hype 8 | ✅ LIVE |
| **Hook Pattern Taxonomy** | 8 types: contrarian_claim, question, story, statistic, tutorial, listicle, analogy, personal | ✅ LIVE |
| **Overnight Cycle** | Wake at 23:00 → Draft → Brief at 06:00, "Run Overnight Now" button | ✅ LIVE |
| **Approval Gates** | Pending → Approve/Reject with reason, DB-persisted, expiry logic | ✅ LIVE |
| **SSE Real-Time Events** | Streaming from `/api/minds/events`, toast notifications, auto-reconnect | ✅ LIVE |
| **30s Auto-Polling** | Dashboard data refreshes every 30 seconds | ✅ Working |
| **Statistical Confidence** | Sample-size gates, confidence decay, evidence-classified recommendations | ✅ Working |
| **Audit Trail** | Time/actor filters, expandable JSON detail, CSV export | ✅ Working |
| **Content Ingestion** | Bulk ingest, hook classification, metrics, performance summary | ✅ Working |
| **Delegation via Circles** | Muse → Maker with structured context, voice match evaluation | ✅ LIVE |

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

```env
MINDS_API_KEY_MUSE=your-muse-api-key
MINDS_MUSE_ID=your-muse-mind-id
MINDS_API_KEY_MAKER=your-maker-api-key
MINDS_MAKER_ID=your-maker-mind-id
DATABASE_URL=file:./dev.db
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
