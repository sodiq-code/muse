# MUSE

**An AI creative team that learns a content creator's voice, audience, and performance patterns — then acts on that knowledge autonomously.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Minds SDK](https://img.shields.io/badge/Minds_SDK-0.1.3-purple)](https://www.npmjs.com/package/@animocabrands/minds-client-lib)
[![Track](https://img.shields.io/badge/Track-Audience_Growth_&_Engagement-green)]()
[![Creative Minds Jam](https://img.shields.io/badge/Creative_Minds_Jam-1-orange)](https://dorahacks.io/hackathon/creativeminds/detail)

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Architecture](#architecture)
- [The Three Minds](#the-three-minds)
- [Creator Memory System](#creator-memory-system)
- [Learning Engine](#learning-engine)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Evidence and Honesty Policy](#evidence-and-honesty-policy)
- [Limitations and Disclosure](#limitations-and-disclosure)
- [Project Structure](#project-structure)
- [Hackathon Submission](#hackathon-submission)

---

## Overview

MUSE is a multi-agent creative assistant built on the [Minds platform](https://hellominds.ai/) by Animoca Brands. It uses three persistent AI agents — **Muse** (orchestrator), **Maker** (creative executor), and **Guardian** (community and safety) — that learn a content creator's patterns over time and act on their behalf, even when the creator is offline.

**Core capabilities:**

| Capability | Implementation | Evidence |
|---|---|---|
| Persistent creator memory | 4-domain memory graph (Identity, Voice, Audience, Performance) stored via Minds LTM + local SQLite | 12 Prisma models, `MemoryEvent` records with confidence scores and source attribution |
| Multi-agent delegation | Muse delegates structured tasks to Maker, evaluates output, returns to creator | `delegation-service.ts`, `delegation-beat-service.ts`, `/api/delegation/*` endpoints |
| Autonomous overnight work | Scheduled runs with approval gates — creator reviews actions in the morning | `overnight-scheduler-service.ts`, `AutonomousRun` + `Approval` models, `/api/autonomy/*` endpoints |
| Learning from outcomes | Observe-Compare-Infer-Update-Recommend cycle adjusts recommendations based on measured results | `learning-engine.ts`, `HookPattern` model with sample sizes and effectiveness scores |
| Epistemic honesty | Every claim tagged with evidence level; simulated data disclosed; sample-size gates prevent overclaiming | `honesty-verifier-service.ts`, `disclosed-simulation-service.ts`, `/api/validation/honesty` endpoint |
| Demo reliability | Three-tier fallback (live → simulated → pre-recorded) with health checks and rehearsal mode | `demo-reliability-service.ts`, `/api/demo/health`, `/api/demo/rehearsal` endpoints |

---

## Problem Statement

Content creators face a repeatable set of problems that current AI tools do not solve:

1. **Stateless assistance** — Most AI creative tools treat every session as a blank slate. They do not remember the creator's voice, audience, or what worked last time.

2. **No learning loop** — Current tools generate content on request but do not measure whether it worked, adjust based on outcomes, or improve over time.

3. **Reactive only** — Creators must prompt every action. There is no proactive work — no analysis overnight, no draft preparation, no follow-up on published content.

4. **Generic output** — Without persistent memory of a specific creator's style and audience, AI suggestions are generic and often off-brand.

MUSE addresses these problems by maintaining persistent state, learning from measured outcomes, and acting proactively.

---

## Solution

MUSE implements a continuous loop that persists across sessions:

```
Remember → Learn → Act → Measure → Remember
    ↑                                |
    └────────────────────────────────┘
```

1. **Remember** — Load the creator's accumulated creative intelligence (voice profile, audience patterns, hook effectiveness, past decisions).
2. **Learn** — Observe new data since the last session (content metrics, creator feedback, audience signals).
3. **Act** — Generate recommendations, draft content, delegate to Maker — all grounded in memory.
4. **Measure** — Track outcomes of every action (hook effectiveness, creator acceptance rate).
5. **Remember** — Write new learnings back to memory, adjusting confidence scores.

This loop runs whether the creator is online or offline.

### Minds Platform Dependency

MUSE requires the Minds platform for its core value proposition. The relationship is structural, not incidental:

| Minds Feature | Role in MUSE | Loss Without It |
|---|---|---|
| Soul | Persistent agent identity across sessions | Agents forget who they are between sessions |
| LTM | Long-term memory for accumulated learning | No cross-session knowledge retention |
| STM | Short-term memory for conversation context | Cannot track multi-step creative workflows |
| Circles | Multi-agent coordination (Muse ↔ Maker ↔ Guardian) | Three disconnected agents, no delegation |
| Skills | Tool use (drafting, publishing, analytics) | Agents become advisory-only, cannot act |
| Alarm Clock | Scheduled autonomous actions (overnight work) | No proactive work while creator is offline |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Creator (Human)                     │
└─────────────┬───────────────────────────┬───────────────┘
              │                           │
              ▼                           ▼
┌─────────────────────┐     ┌─────────────────────────────┐
│    Muse Mind         │     │    Minds Platform            │
│    (Orchestrator)    │────▶│    Soul · LTM · STM          │
│                      │     │    Circles · Skills · Alarm  │
└──────┬──────┬────────┘     └─────────────────────────────┘
       │      │
       ▼      ▼
┌──────────┐ ┌──────────┐
│  Maker   │ │ Guardian  │
│  Mind    │ │   Mind    │
│(Creative │ │(Community │
│ Execution│ │  & Safety)│
└──────────┘ └──────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                   Learning Engine                        │
│   Observe → Compare → Infer → Update → Recommend        │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│               Creator Memory Graph                       │
│   Identity · Voice · Audience · Performance              │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. Creator interacts with Muse (conversation or approval).
2. Muse loads creator memory from Minds LTM and local database.
3. Muse delegates creative tasks to Maker with structured instructions.
4. Maker produces drafts/hooks and returns them to Muse.
5. Muse evaluates Maker output against creator voice profile.
6. Guardian checks for safety and brand consistency.
7. Learning Engine observes outcomes and updates memory.
8. Recommendations are grounded in evidence with confidence scores.

---

## The Three Minds

### Muse — The Orchestrator

- **Responsibility**: Primary point of contact for the creator. Loads memory, delegates work, evaluates output, presents results.
- **Minds features**: Soul (identity), LTM (accumulated learning), STM (conversation), Alarm Clock (overnight triggers).
- **Implementation**: `minds-adapter.ts`, `minds-client.ts`, `/api/minds/*`

### Maker — The Creative Executor

- **Responsibility**: Generates hooks, drafts content, explores ideas — grounded in the creator's voice profile.
- **Minds features**: Skills (content tools), STM (task context), Circles (receives delegation from Muse).
- **Implementation**: `maker-simulator.ts` (fallback), `draft-pipeline.ts`, `hook-classifier.ts`

### Guardian — The Community and Safety Mind

- **Responsibility**: Monitors community signals, flags risks, ensures content consistency with creator voice.
- **Minds features**: Circles (community monitoring), LTM (audience patterns).
- **Implementation**: `evaluation-service.ts`, `voice-profiler.ts`

---

## Creator Memory System

The Creator Memory Graph stores four interconnected domains of creative intelligence. Each domain is backed by `MemoryEvent` records with source attribution and confidence scores.

### Identity Domain
- Niche, expertise areas, content pillars
- Values and boundaries
- Brand positioning

### Voice Domain
- Tone patterns (analyzed from past content)
- Vocabulary preferences and avoid-list
- Pacing, structure, and format patterns
- Voice consistency score (tracked over time)

### Audience Domain
- Demographic patterns (observed, not assumed)
- Engagement patterns by content type, time, hook type
- Response patterns to different tones and formats
- Growth trajectory and retention signals

### Performance Domain
- Hook effectiveness by type (question, bold claim, story, counter-intuitive)
- Content performance by format, length, topic
- Timing effectiveness
- Creator decision patterns (accepted, modified, rejected — and why)

### Hook and Decision Tracking

- **Hooks**: Stored with type, text, and measured effectiveness. `HookPattern` records accumulate confidence as sample size grows.
- **Creator Decisions**: Every recommendation receives a decision (`accepted`, `modified`, `rejected`, `ignored`). Modifications are captured for learning. This is how MUSE learns what the creator wants versus what it suggests.

---

## Learning Engine

The learning engine follows a five-step cycle:

```
Observe → Compare → Infer → Update → Recommend
```

1. **Observe** — Ingest new data: content metrics, creator feedback, audience signals.
2. **Compare** — Expected performance versus actual performance.
3. **Infer** — What changed? What patterns hold? Distinguishes observed facts from correlations. Does not claim causation without sufficient evidence.
4. **Update** — Adjust confidence scores, update memory events, refine voice profile. Confidence decreases when sample size is small. Confidence increases only with consistent evidence.
5. **Recommend** — Generate suggestions grounded in updated memory. Every recommendation includes: what, why (with evidence), and confidence level.

### Statistical Honesty Rules

| Rule | Threshold | Effect |
|---|---|---|
| Minimum sample for "pattern" | n ≥ 3 | Below 3 data points, no pattern claim |
| Minimum sample for "trend" | n ≥ 10 | Below 10 data points, no trend claim |
| Confidence decay | No confirming evidence for 30 days | Confidence score decreases |
| Simulation disclosure | All demo/simulated data | Labeled `isSimulation: true`, `source: 'prerecorded'` |

---

## Demo

### Running the Demo

```bash
bun run dev
```

Open the application and navigate to the **Demo** tab.

### Demo Scenes

The demo presents 10 scenes following Jules, a mid-tier creator, through a full MUSE cycle:

| Scene | Description |
|-------|-------------|
| 1 | Jules opens MUSE — sees today's briefing |
| 2 | Memory screen — voice, audience, winning hooks |
| 3 | Jules goes offline |
| 4 | 22:00 — overnight work begins |
| 5 | Muse delegates to Maker with structured instructions |
| 6 | Maker returns; Muse evaluates (Voice 94%, Hook 91%) |
| 7 | 06:00 — morning briefing with overnight results |
| 8 | Persistence demonstration: recommendation cites 8 posts, 72% retention, 2 approvals |
| 9 | Learning: underperforming hook marked — confidence adjusted |
| 10 | Summary: persistent memory differentiates MUSE from stateless tools |

### Fallback Mode

When the Minds API is unavailable or degraded (latency > 5s), the demo automatically switches to pre-recorded fallback mode:

| Mode | Description |
|---|---|
| **Live** | Full Minds API integration, real conversations, real memory |
| **Simulated** | Maker simulator generates responses locally; Minds API used for persistence only |
| **Pre-recorded** | All 10 scenes play from pre-recorded data |

All fallback data is labeled `isSimulation: true`. The transition between modes is seamless to the user.

### Demo Reliability

- **Health check**: `/api/demo/health` pings Minds API (cached for 30s), reports `healthy` / `degraded` / `down`
- **Rehearsal mode**: Auto-plays all 10 scenes at 3x speed to verify demo readiness before presentation
- **Pre-recorded turns**: Every scene has complete conversation turns, narration, and data snapshots

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js (App Router) | 16 | Full-stack React framework |
| Language | TypeScript | 5 | Type safety throughout |
| Styling | Tailwind CSS + shadcn/ui | 4 | Utility-first CSS + component library |
| Database | Prisma ORM + SQLite | 6 | Schema, queries, migrations |
| State | Zustand + TanStack Query | 5 | Client state + server state |
| AI Platform | Minds SDK | 0.1.3 | Persistent AI agents with memory |
| Charts | Recharts | 2 | Data visualization |
| Animation | Framer Motion | 12 | UI transitions |
| Icons | Lucide React | 0.525 | Icon library |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime v1.0+
- Node.js 18+

### Installation

```bash
git clone https://github.com/sodiq-code/muse.git
cd muse
bun install
```

### Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#environment-variables)).

### Database Setup

```bash
bun run db:push
```

This creates the SQLite database and applies the Prisma schema (12 models).

### Start Development Server

```bash
bun run dev
```

The application runs on `http://localhost:3000`.

### Verify

1. Open the application in your browser
2. Check the Demo tab for API health status
3. Run a demo rehearsal to verify all 10 scenes play correctly

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | SQLite database path (e.g., `file:./db/custom.db`) |
| `MINDS_BUILDER_API_KEY` | For live mode | Minds Builder API key (JWT) |
| `MINDS_HUMAN_ID` | For live mode | Mind ID for the human creator |
| `MINDS_MUSE_ID` | For live mode | Mind ID for Muse (orchestrator) |
| `MINDS_MAKER_ID` | For live mode | Mind ID for Maker (creative executor) |
| `MINDS_MUSE_EMAIL` | For live mode | Email address for Muse mind |
| `MINDS_MAKER_EMAIL` | For live mode | Email address for Maker mind |
| `MINDS_MODE` | No | `live` or `simulate` (default: `simulate`) |
| `CREATOR_NAME` | No | Demo creator display name |
| `CREATOR_EMAIL` | No | Demo creator email |
| `CREATOR_PLATFORM` | No | Primary platform (default: `youtube`) |

The application runs in `simulate` mode by default. Live mode requires valid Minds API credentials.

---

## API Reference

### Dashboard

| Endpoint | Method | Description |
|---|---|---|
| `/api/dashboard/today` | GET | Today's briefing: priorities, pending items, recommendations |
| `/api/dashboard/memory` | GET | Creator memory graph across 4 domains |
| `/api/dashboard/learning` | GET | Learning engine status: patterns, confidence, recent inferences |
| `/api/dashboard/overnight` | GET | Overnight work results |
| `/api/dashboard/control` | GET | Control panel: delegations, approvals, autonomous runs |

### Creator

| Endpoint | Method | Description |
|---|---|---|
| `/api/creator` | GET/POST | Get or create a creator |
| `/api/creator/voice` | GET | Get creator voice profile |
| `/api/creator/voice/analyze` | POST | Analyze content to extract voice patterns |
| `/api/creator/memory` | GET | Get creator memory events |
| `/api/creator/decisions` | GET | Get creator decision history |
| `/api/creator/recruit` | POST | Creator onboarding flow |
| `/api/creator/audit` | GET | Creator audit trail |

### Content

| Endpoint | Method | Description |
|---|---|---|
| `/api/content` | GET/POST | List or create content items |
| `/api/content/ingest` | POST | Ingest content with metrics |
| `/api/content/performance` | GET | Content performance summary |
| `/api/content/metrics` | GET | Raw content metrics |

### Learning

| Endpoint | Method | Description |
|---|---|---|
| `/api/learning/run` | POST | Run a full learning cycle |
| `/api/learning/analyze` | POST | Analyze a specific content item |
| `/api/learning/comparison` | GET | Compare expected vs. actual performance |
| `/api/learning/rankings` | GET | Hook and content type rankings |
| `/api/learning/hooks` | GET | Hook pattern analysis |
| `/api/learning/predict` | POST | Predict content performance |
| `/api/learning/proof` | GET | Evidence for a specific learning |
| `/api/learning/explain` | GET | Explain why a recommendation was made |
| `/api/learning/honesty` | GET | Honesty verification for learning claims |

### Minds Platform

| Endpoint | Method | Description |
|---|---|---|
| `/api/minds/status` | GET | Minds API health and configuration |
| `/api/minds/message` | POST | Send message to a mind |
| `/api/minds/history` | GET | Get conversation history |
| `/api/minds/circle` | GET | Get mind's circle members |
| `/api/minds/skills` | GET | Get mind's equipped skills |
| `/api/minds/draft` | POST | Generate draft via Maker |

### Delegation

| Endpoint | Method | Description |
|---|---|---|
| `/api/delegation/send` | POST | Delegate a task from Muse to Maker |
| `/api/delegation/evaluate` | POST | Evaluate Maker's output |
| `/api/delegation/beat` | GET | Get delegation beat (story element) |

### Autonomy

| Endpoint | Method | Description |
|---|---|---|
| `/api/autonomy/status` | GET | Get autonomous run status |
| `/api/autonomy/approve` | POST | Approve an autonomous action |
| `/api/autonomy/reject` | POST | Reject an autonomous action |
| `/api/autonomy/expire` | POST | Expire a pending approval |
| `/api/autonomy/approval-history` | GET | Get approval history |
| `/api/autonomy/run-overnight` | POST | Trigger overnight autonomous run |

### Feedback

| Endpoint | Method | Description |
|---|---|---|
| `/api/feedback/submit` | POST | Submit creator feedback |
| `/api/feedback/summary` | GET | Feedback summary statistics |
| `/api/feedback/refinements` | GET | Refinements based on feedback |
| `/api/feedback/gate` | GET | Feedback gate status |
| `/api/feedback/simulate` | POST | Simulate feedback (demo) |

### Audit

| Endpoint | Method | Description |
|---|---|---|
| `/api/audit/stats` | GET | Audit event statistics |
| `/api/audit/filtered` | GET | Filtered audit events |
| `/api/audit/export` | GET | Export audit trail |

### Validation

| Endpoint | Method | Description |
|---|---|---|
| `/api/validation/day1` | GET | Day 1 validation check |
| `/api/validation/run` | POST | Run full validation suite |
| `/api/validation/honesty` | GET | Honesty verification report |

### Demo

| Endpoint | Method | Description |
|---|---|---|
| `/api/demo/health` | GET | Minds API health and fallback status |
| `/api/demo/scene` | GET | Pre-recorded scene data |
| `/api/demo/rehearsal` | GET/POST | Demo rehearsal controls |

### Drafts

| Endpoint | Method | Description |
|---|---|---|
| `/api/drafts` | GET/POST | List or create drafts |

---

## Evidence and Honesty Policy

MUSE applies epistemic honesty to all claims and recommendations. This is not a marketing position — it is a technical constraint enforced in code.

### Evidence Levels

| Level | Label | Meaning | Example |
|---|---|---|---|
| 1 | Observed | Direct measurement, no inference | "Hook A achieved 72% retention across 8 posts" |
| 2 | Correlation | Pattern detected, causation not claimed | "Question hooks correlate with higher retention (r=0.6)" |
| 3 | Confidence-weighted | Inference with explicit confidence and sample size | "Predicted 68% retention (confidence: 0.7, n=8)" |
| 4 | Recommendation | Actionable suggestion based on evidence | "Try a question hook — data supports this (level 2 evidence)" |

### Disclosed Simulation

All demo and simulated data carries explicit labels:
- `isSimulation: true` — data was generated, not measured
- `source: 'prerecorded'` or `source: 'simulated'` — origin of the data
- The UI displays a transparency notice in demo mode

### Honesty Verification

The `/api/validation/honesty` and `/api/learning/honesty` endpoints produce a report covering:
- Which data points are observed vs. simulated
- Which claims meet sample size thresholds
- Which confidence scores are calibrated vs. estimated

---

## Limitations and Disclosure

### Built and Functional

| Component | Status | Verification |
|---|---|---|
| 12 Prisma models | Frozen since Day 13 | Schema in `prisma/schema.prisma` |
| 35 service modules | Implemented | Source in `src/lib/` |
| 5 dashboard screens | Working | Today, Memory, Learning, Overnight, Control |
| Creator memory system | Working | 4 domains with confidence scoring |
| Learning engine | Working | Observe-Compare-Infer-Update-Recommend cycle |
| Delegation flow | Working | Muse → Maker → Evaluation → Creator |
| Overnight scheduler | Working | Approval-gated autonomous runs |
| Demo reliability | Working | 3-tier fallback, health checks, rehearsal |
| Minds SDK integration | Working | Soul, LTM, STM, Circles, Skills, Alarm Clock |
| Creator feedback loop | Working | Feedback submission, refinements, gate |
| E2E validation | Working | Full validation suite with honesty checks |
| Demo reliability with submission docs | Working | Simulator fallback, rehearsal, documentation |

### Simulated (Disclosed)

| Component | Current State | Disclosure |
|---|---|---|
| Maker creative output | Local simulator in `simulate` mode | Labeled `source: 'simulated'` |
| Content metrics | Pre-recorded demo data | Labeled `isSimulation: true` |
| Creator decisions | Scripted for 10-scene demo | Labeled `isSimulation: true` |
| Audience data | Inferred from pre-recorded data | Confidence scores reflect limited evidence |
| Performance predictions | Simplified models | Confidence scores disclosed with each prediction |

### Not Built

| Gap | Impact | What It Would Require |
|---|---|---|
| Real platform integrations | No live YouTube/Twitter/Instagram metric ingestion | Platform API credentials and OAuth flows |
| Multi-creator support | Single creator per instance | Authentication and data isolation |
| Production deployment | Hackathon prototype only | Infrastructure, monitoring, scaling |
| A/B testing | No controlled experiments validating learning accuracy | Experiment framework and statistical analysis |
| Real-time audience monitoring | Guardian uses simulated community signals | WebSocket or streaming API integration |
| Voice profile accuracy at scale | Demo data only | Real content analysis across 50+ pieces per creator |
| Learning loop convergence | Not validated with real creators over time | Weeks of real creator interaction data |

---

## Project Structure

```
muse/
├── prisma/
│   └── schema.prisma              # 12 models (frozen)
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main dashboard (6 tabs)
│   │   ├── layout.tsx             # Root layout
│   │   └── api/                   # 56 API route handlers
│   │       ├── dashboard/         # 5 endpoints
│   │       ├── creator/           # 7 endpoints
│   │       ├── content/           # 4 endpoints
│   │       ├── learning/          # 10 endpoints
│   │       ├── minds/             # 6 endpoints
│   │       ├── delegation/        # 3 endpoints
│   │       ├── autonomy/          # 6 endpoints
│   │       ├── feedback/          # 5 endpoints
│   │       ├── audit/             # 3 endpoints
│   │       ├── validation/        # 3 endpoints
│   │       ├── demo/              # 3 endpoints
│   │       └── drafts/            # 1 endpoint
│   ├── lib/                       # 35 service modules
│   │   ├── minds-client.ts        # Minds SDK wrapper
│   │   ├── minds-adapter.ts       # Minds ↔ MUSE adapter
│   │   ├── creator-service.ts     # Creator CRUD + voice
│   │   ├── learning-engine.ts     # Core learning engine
│   │   ├── learning-engine-service.ts
│   │   ├── evaluation-service.ts  # Maker output evaluation
│   │   ├── delegation-service.ts  # Muse → Maker delegation
│   │   ├── delegation-beat-service.ts
│   │   ├── decision-service.ts    # Creator decision tracking
│   │   ├── hook-classifier.ts     # Hook type classification
│   │   ├── hook-comparison.ts     # Hook effectiveness comparison
│   │   ├── voice-profiler.ts      # Voice pattern extraction
│   │   ├── performance-service.ts # Content performance analysis
│   │   ├── explanation-service.ts # Recommendation explanations
│   │   ├── honesty-verifier-service.ts
│   │   ├── disclosed-simulation-service.ts
│   │   ├── maker-simulator.ts     # Local Maker fallback
│   │   ├── overnight-scheduler-service.ts
│   │   ├── overnight-screen-service.ts
│   │   ├── autonomy-scheduler.ts  # Autonomous action scheduler
│   │   ├── draft-pipeline.ts      # Draft creation pipeline
│   │   ├── ingestion-pipeline.ts  # Content/metric ingestion
│   │   ├── control-screen-service.ts
│   │   ├── today-screen-service.ts
│   │   ├── memory-screen-service.ts
│   │   ├── learning-screen-service.ts
│   │   ├── creator-feedback-service.ts
│   │   ├── creator-recruitment.ts # Creator onboarding
│   │   ├── e2e-validation-service.ts
│   │   ├── proof-experiment.ts    # Evidence tracking
│   │   ├── demo-reliability-service.ts
│   │   ├── demo-prerecorded-data.ts
│   │   ├── seed.ts                # Database seeding
│   │   ├── db.ts                  # Prisma client
│   │   └── utils.ts
│   ├── components/
│   │   └── ui/                    # 48 shadcn/ui components
│   └── hooks/
│       ├── use-minds-events.ts    # Minds event stream
│       ├── use-mobile.ts          # Mobile detection
│       └── use-toast.ts           # Toast notifications
```

---

## Hackathon Submission

### Creative Minds Jam #1: Hong Kong

| Field | Value |
|---|---|
| **Hackathon** | [Creative Minds Jam #1: Hong Kong](https://dorahacks.io/hackathon/creativeminds/detail) |
| **Organizer** | Vibe Valley / DoraHacks |
| **Platform** | [Minds by Animoca Brands](https://hellominds.ai/) |
| **Track** | 1 — Audience Growth & Engagement |
| **Mind ID** | `9fd0483e-f36b-1410-8466-00039ce7df11` |
| **Repository** | [github.com/sodiq-code/muse](https://github.com/sodiq-code/muse) |
| **Submission Deadline** | August 28, 2026, 23:59 HKT |
| **Prize Pool** | $10,000 USD |
| **Investment Path** | [Minds Investment Programme](https://build.hellominds.ai/program) — up to $250,000 |

### Track Alignment

MUSE competes in **Track 1: Audience Growth & Engagement** based on the following alignment:

1. **Learning from audience signals** — The Learning Engine observes what content resonates and adjusts recommendations. This automates audience engagement feedback loops.
2. **Hook optimization** — By classifying and measuring hook effectiveness, MUSE targets the first 5 seconds that determine whether an audience member stays or leaves.
3. **Persistent audience memory** — The Audience domain in the Creator Memory Graph accumulates knowledge about what works for a specific creator's audience — not generic advice.
4. **Overnight work** — While the creator is offline, MUSE analyzes performance data and prepares improved strategies for the next day's content.

### Judging Criteria Alignment

| Criterion | How MUSE Addresses It |
|---|---|
| Minds Integration Depth | Mind is structurally required — remove Minds and MUSE ceases to function. Uses Soul, LTM, STM, Circles, Skills, Alarm Clock. |
| Creator-Economy Problem Fit | Addresses audience growth and engagement — a defined, measurable problem for content creators. |
| Innovation & Creativity | Multi-agent architecture with delegation, approval gates, and persistent learning across sessions. |
| Execution & Completeness | Working demo with 5 dashboard screens, 56 API endpoints, 35 service modules, 3-tier fallback. |
| Viability & Scalability | Clear path to real platform integrations and multi-creator support (documented in Limitations). |

### Submission Requirements Checklist

- [x] Working product with Minds Agent integral to core operations
- [x] Persistence demonstration (memory, continuity, autonomous follow-up)
- [x] Creator-economy problem fit (Track 1: Audience Growth & Engagement)
- [x] Code repository with technical documentation
- [ ] Demo video (1.5–2 minutes) — to be produced

---

*Built for [Creative Minds Jam #1](https://dorahacks.io/hackathon/creativeminds/detail). MUSE uses persistent memory and learning to move beyond single-session AI assistance.*
