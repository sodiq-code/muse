# MUSE

**AI creative team that learns a creator's voice, audience, and performance — then acts on that knowledge autonomously, even while the creator is offline.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Minds SDK](https://img.shields.io/badge/Minds_SDK-0.1.3-purple)](https://www.npmjs.com/package/@animocabrands/minds-client-lib)
[![Track](https://img.shields.io/badge/Track-Audience_Growth_&_Engagement-green)]()
[![Creative Minds Jam](https://img.shields.io/badge/Creative_Minds_Jam-1-orange)](https://dorahacks.io/hackathon/creativeminds/detail)

---

## Problem → Solution

**Problem:** Current AI creative tools are stateless — every session starts from zero. They don't remember what worked, don't learn from outcomes, and can't act without a prompt.

**Solution:** MUSE runs a persistent loop: **Remember → Learn → Act → Measure → Remember**. Three Minds agents (Muse, Maker, Guardian) learn a creator's patterns over time and act proactively, including overnight while the creator is offline.

---

## How It Works

```
Creator ──▶ Muse (Orchestrator) ──▶ Maker (Creative Execution)
                    │                       │
                    ◀── Evaluate ◀──────────┘
                    │
                    ▼
             Guardian (Safety & Voice Check)
                    │
                    ▼
         Learning Engine: Observe → Compare → Infer → Update → Recommend
                    │
                    ▼
         Creator Memory Graph: Identity · Voice · Audience · Performance
```

- **Muse** — Loads creator memory, decides what to do, delegates to Maker, evaluates output, presents to creator. Uses Soul, LTM, STM, Alarm Clock.
- **Maker** — Generates hooks, drafts content, explores ideas — grounded in creator voice. Uses Skills, STM, Circles.
- **Guardian** — Checks drafts against voice profile, monitors audience sentiment, flags risks. Uses Circles, LTM.
- **Learning Engine** — Observes outcomes, compares expected vs. actual, infers patterns, updates memory with confidence scores, generates evidence-backed recommendations.
- **Overnight Work** — Muse acts autonomously while creator is offline. All actions go through approval gates for morning review.

---

## Minds Integration (Structural Dependency)

Minds is not a feature of MUSE — it is the foundation. Remove Minds and the product ceases to function:

| Minds Feature | Purpose | Loss Without It |
|---|---|---|
| Soul | Persistent agent identity | Agents forget who they are between sessions |
| LTM | Long-term memory | No cross-session knowledge retention |
| STM | Session context | Cannot track multi-step workflows |
| Circles | Multi-agent coordination | Three disconnected agents, no delegation |
| Skills | Tool use (drafting, analytics) | Advisory-only, cannot act |
| Alarm Clock | Scheduled autonomous actions | No proactive work while creator is offline |

---

## What's Built — With Evidence

| Component | Evidence |
|---|---|
| 12 Prisma models (frozen) | `prisma/schema.prisma` |
| 35 service modules | `src/lib/*.ts` — 35 files |
| 56 API route handlers | `src/app/api/**` — 12 route groups |
| 5 dashboard screens | Today, Memory, Learning, Overnight, Control |
| 3-agent delegation flow | Muse → Maker → Evaluate → Creator |
| Learning engine with confidence scoring | Observe-Compare-Infer-Update-Recommend cycle |
| Overnight scheduler with approval gates | `overnight-scheduler-service.ts`, `Approval` model |
| Creator feedback loop | Feedback → Refinements → Gate → Memory update |
| Epistemic honesty system | Sample-size gates, confidence decay, simulation disclosure |
| 3-tier demo fallback | Live → Simulated → Pre-recorded, with health checks |
| Honesty verification API | `/api/validation/honesty`, `/api/learning/honesty` |

---

## Demo

```bash
bun install && bun run db:push && bun run dev
```

10-scene demo follows Jules (a mid-tier creator) through a full MUSE cycle: morning briefing → memory review → go offline → overnight delegation → morning results → learning update. When Minds API is unavailable, automatically falls back to simulated → pre-recorded mode (all data labeled `isSimulation: true`).

**Rehearsal mode** — `/api/demo/rehearsal` plays all scenes at 3x speed to verify readiness before presenting.

---

## Honesty & Disclosure

Every claim in MUSE carries an evidence level (observed → correlation → confidence-weighted → recommendation). Simulated data is never hidden — all demo data is tagged `isSimulation: true` with source attribution. Recommendations with < 3 data points do not claim "pattern"; < 10 do not claim "trend."

---

## Limitations

**Simulated:** Maker output, content metrics, creator decisions, and audience data use pre-recorded demo data (disclosed). **Not built:** Real platform API integrations (YouTube/Twitter), multi-creator support, A/B testing, production deployment. Voice accuracy and learning convergence require real creator data at scale over weeks — not demonstrable in a single demo session.

---

## Hackathon Submission

**Creative Minds Jam #1: Hong Kong** — [dorahacks.io/hackathon/creativeminds/detail](https://dorahacks.io/hackathon/creativeminds/detail)

| | |
|---|---|
| **Track** | 1 — Audience Growth & Engagement |
| **Mind ID** | `9fd0483e-f36b-1410-8466-00039ce7df11` |
| **Deadline** | August 28, 2026, 23:59 HKT |
| **Prize Pool** | $10,000 USD + up to $250K investment path |

**Track fit:** MUSE automates audience engagement feedback loops — it learns what hooks retain viewers, what content grows audience, and acts on those patterns proactively. This is audience growth powered by persistent memory, not generic advice.

**Judging alignment:**
- **Minds Integration Depth** — Structural dependency (see table above)
- **Creator-Economy Problem Fit** — Audience growth is a defined, measurable creator problem
- **Innovation** — Multi-agent delegation with approval gates and cross-session learning
- **Execution** — Working demo: 5 screens, 56 endpoints, 35 services, 3-tier fallback
- **Viability** — Clear path to real integrations (documented in Limitations)

---

*Built for [Creative Minds Jam #1](https://dorahacks.io/hackathon/creativeminds/detail).*
