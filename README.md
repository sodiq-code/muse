# MUSE

**The product is not AI-generated content. The product is accumulated creative intelligence.**

MUSE is a persistent AI creative teammate that develops a long-term understanding of one creator and uses that knowledge to autonomously improve their next work. The core loop — **Memory → Learning → Autonomy → Better creative decisions** — compounds with use. Every published piece teaches MUSE more. Every result makes MUSE more useful.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Minds SDK](https://img.shields.io/badge/Minds_SDK-0.1.3-purple)](https://www.npmjs.com/package/@animocabrands/minds-client-lib)
[![Track](https://img.shields.io/badge/Track-Audience_Growth_&_Engagement-green)]()
[![Creative Minds Jam](https://img.shields.io/badge/Creative_Minds_Jam-1-orange)](https://dorahacks.io/hackathon/creativeminds/detail)

---

## Problem

**78% of creators report burnout** (62% severe). The market is **winner-take-most** — brand dollars concentrate at the top, mid-tier creators lack team infrastructure. Current AI tools are **stateless**: every session starts from zero. They generate but don't learn. They respond but don't remember. They stop when you close the app.

> *"Persistence is the unlock that separates a useful chatbot from a true agent. Teams that deeply understand context and memory will win this."* — Yusuf Goolamabbas, Animoca CKO
>
> *"Agents that work persistently for creators — not platforms — is the future I want to fund."* — Yat Siu, Animoca Co-Founder

---

## Solution — The Learning Loop

The learning loop is MUSE's core invention. Not the multi-Mind squad — the squad exists to serve the loop. The loop is the moat. Clippers generate; MUSE learns. A clipper's value is constant across users. MUSE's value compounds with use.

```
Create → Publish → Observe → Analyse → Update Memory → Change Strategy → Create Better
    ↑                                                                |
    └────────────────────────────────────────────────────────────────┘
```

This loop runs whether the creator is online or offline. That is the point.

---

## Architecture

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

- **Muse** — Holds creator identity, persistent memory, strategic decisions, overnight autonomy. Wakes at 23:00, analyses signals, delegates to Maker, evaluates, updates memory, prepares 06:00 brief. Uses Soul, LTM, STM, Alarm Clock.
- **Maker** — Receives structured instructions from Muse: `{creator, topic, audience, voice, historicalWinners, hookRecommendation}`. Returns draft. Does NOT own the creator's long-term memory — Muse does. Uses Skills, STM, Circles.
- **Guardian** — Classifies comments, flags risks, surfaces audience questions, feeds intelligence back to Muse. Uses Circles, LTM.
- **Overnight Work** — Approval-gated: Muse prepares autonomously, creator reviews with one tap. No uncontrolled public publishing. Every action produces an audit event.

---

## Minds Integration — Remove Minds and MUSE Ceases to Function

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

## What's Built

| Component | Evidence |
|---|---|
| 12 Prisma models (frozen) | `prisma/schema.prisma` |
| 35 service modules | `src/lib/*.ts` |
| 56 API route handlers | `src/app/api/**` — 12 route groups |
| 5 dashboard screens | Today, Memory, Learning, Overnight, Control |
| 3-agent delegation via Circles | Muse → Maker → Evaluate → Creator |
| Learning engine with confidence scoring | Observe-Compare-Infer-Update-Recommend |
| Overnight scheduler with approval gates | `overnight-scheduler-service.ts`, `Approval` model |
| Creator feedback → memory update | Feedback → Refinements → Gate → Learning |
| Epistemic honesty system | Sample-size gates, confidence decay, simulation disclosure |
| 3-tier demo fallback | Live → Simulated → Pre-recorded |
| Creator Memory Engine (Bazaar Skill) | Hook + Voice + Performance + Decision memory as reusable Skill |

### Voice Profile — Honest, Not a Clone

```
Directness: 91 · Technical Depth: 88 · Storytelling: 72 · Humor: 34 · Hype: 8
```

Not a mathematical voice clone — a profile. This is how MUSE avoids the "sameness is death" problem: every creator's profile is unique and disclosed.

### Hook Pattern Taxonomy (8 Types)

| Pattern | Example |
|---|---|
| Contrarian claim | "Most AI agents aren't really agents" |
| Question | "What if your code could think?" |
| Story | "Last week I shipped 10x faster..." |
| Statistic | "78% of creators report burnout" |
| Tutorial | "Here's how I set up AI agents in 5 min" |
| Listicle | "5 things every dev should know about AI" |
| Analogy | "AI agents are like interns..." |
| Personal | "I almost quit creating last month" |

### The Six Non-Negotiables

1. **Persistent memory** across sessions
2. **Structured learning** — performance changes memory, the loop closes
3. **Autonomous execution** — overnight wake-up without creator prompt
4. **Delegation** — Muse → Maker via Circles with structured instructions
5. **Explainable recommendations** — every suggestion cites evidence
6. **Working dashboard** — creator sees what happened (5 screens)

---

## Demo

```bash
bun install && bun run db:push && bun run dev
```

**The climax** — Jules goes offline at 22:00. MUSE wakes, analyses signals, recalls strongest hook patterns, delegates to Maker, evaluates, updates memory. At 06:00: *"Good morning. I worked while you were offline."* Jules asks: *"Why did you choose this hook?"* MUSE: *"Because you used this pattern 8 times. Those posts averaged 72% retention vs. your 61% baseline. You approved similar framing twice."* **The judge sees recall, not generation.**

**Fallback** — Minds API degraded? Automatic: live → simulated → pre-recorded. All simulated data tagged `isSimulation: true`. Rehearsal mode plays all 10 scenes at 3x speed.

---

## Honesty, Scope & Limitations

**Statistical honesty** — Every claim carries an evidence level: **observed** → **correlation** → **confidence-weighted** → **recommendation**. Sample-size gates: < 3 data points = no "pattern"; < 10 = no "trend." Confidence decays without confirming evidence. Example output:

> Hook: Contrarian claim · Historical avg: 61% · This post: 72% · Lift: +11pp · Confidence: Medium · *Increase contrarian openings, but test against tutorial openings before declaring a permanent preference.*

**Scope discipline** — Tier system enforces scope. After Day 8: no new Minds, integrations, or features. Tier 1 (Muse, Maker, loop, memory, dashboard, approval gates) always ships. Tier 2 (Guardian, Circles, Bazaar Skill, real creator data) ships if time permits. Tier 3 (wallet, NFT, Scout) only if finished. **Explicitly excluded:** full platform integrations, NFT marketplace, DAO, 10-agent swarm, fake metrics, unnecessary blockchain.

**Simulated (disclosed)** — Maker output, content metrics, creator decisions, audience data use pre-recorded demo data tagged `isSimulation: true`. **Not built:** Real platform API integrations, multi-creator support, A/B testing, production deployment. **Admitted:** Minds Builder API is ~6 weeks old; no `POST /v1/minds` endpoint. One creator per manually-provisioned Mind — framed as cohort model for investment phase.

---

## Hackathon Submission

**Creative Minds Jam #1: Hong Kong** — [dorahacks.io/hackathon/creativeminds/detail](https://dorahacks.io/hackathon/creativeminds/detail)

| | |
|---|---|
| **Track** | 1 — Audience Growth & Engagement |
| **Mind ID** | `9fd0483e-f36b-1410-8466-00039ce7df11` |
| **Deadline** | August 28, 2026, 23:59 HKT |
| **Prize Pool** | $10,000 USD |
| **Investment Path** | [Minds Investment Programme](https://build.hellominds.ai/program) — up to **$250K** |

> *"We're not building another AI content generator. We're building the persistent intelligence layer between a creator and their audience."*

**Track fit:** MUSE automates audience engagement feedback loops — learns what hooks retain viewers, what content grows audience, acts on those patterns proactively. Audience growth powered by persistent memory, not generic advice.

| Judging Criterion | How MUSE Satisfies |
|---|---|
| **Minds Integration Depth** | Structural dependency — remove Minds and product collapses |
| **Creator-Economy Problem Fit** | 78% burnout + winner-take-most = documented creator pain |
| **Innovation & Creativity** | Learning loop is a category shift — clippers generate; MUSE learns |
| **Execution & Completeness** | 5 screens, 56 endpoints, 35 services, 3-tier fallback, 6 non-negotiables met |
| **Viability & Scalability** | Price ($19–29/mo), user (mid-tier creators), channel (Bazaar Skill), moat (memory compounds) |

---

*Built for [Creative Minds Jam #1](https://dorahacks.io/hackathon/creativeminds/detail). The product isn't AI-generated content. The product is accumulated creative intelligence.*
