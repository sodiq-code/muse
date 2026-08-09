# MUSE

**The product is not AI-generated content. The product is accumulated creative intelligence.**

MUSE is a persistent AI creative teammate that develops a long-term understanding of one creator and uses that knowledge to autonomously improve their next work. The core loop — **Memory → Learning → Autonomy → Better creative decisions** — compounds with use. Every published piece teaches MUSE more about the creator. Every result makes MUSE more useful.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Minds SDK](https://img.shields.io/badge/Minds_SDK-0.1.3-purple)](https://www.npmjs.com/package/@animocabrands/minds-client-lib)
[![Track](https://img.shields.io/badge/Track-Audience_Growth_&_Engagement-green)]()
[![Creative Minds Jam](https://img.shields.io/badge/Creative_Minds_Jam-1-orange)](https://dorahacks.io/hackathon/creativeminds/detail)

---

## Problem

Content creators face a documented crisis: **78% report burnout** (62% severe), the market is **winner-take-most** ($250B+ concentrated at the top), and mid-tier creators lack team infrastructure. Current AI tools are **stateless** — every session starts from zero. They generate content but don't learn from outcomes, don't remember what worked, and can't act without a prompt.

> *"Persistence is the unlock that separates a useful chatbot from a true agent."* — Yusuf Goolamabbas, Animoca CKO
>
> *"Agents that work persistently for creators — not platforms — is the future I want to fund."* — Yat Siu, Animoca Co-Founder

---

## Solution — The Learning Loop

The learning loop is MUSE's core invention. Not the multi-Mind squad — the squad exists to serve the loop; the loop is the moat.

```
Create → Publish → Observe → Analyse → Update Memory → Change Strategy → Create Better
    ↑                                                                |
    └────────────────────────────────────────────────────────────────┘
```

**What this means:** A clipper generates; MUSE learns. A clipper's value is constant across users. MUSE's value compounds with use — because the Mind's memory of the creator's voice, audience, and hook performance grows with every cycle.

---

## Architecture

```
CREATOR ("I'm going offline.")
    ↓
MUSE — Orchestrator Mind (Identity + Memory + State + Decisions + Autonomy)
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

- **Muse** — Orchestrator. Holds creator identity, persistent memory, strategic decisions, overnight autonomy. Uses Soul, LTM, STM, Alarm Clock.
- **Maker** — Creative execution. Receives structured instructions from Muse (topic, voice, audience, historical evidence, hook recommendation). Uses Skills, STM, Circles.
- **Guardian** — Community and safety. Flags risks, monitors sentiment, feeds audience intelligence back to Muse. Uses Circles, LTM.
- **Overnight Work** — Approval-gated autonomy: Muse wakes, analyses signals, delegates to Maker, evaluates, updates memory, prepares morning brief. Creator reviews with one tap — no uncontrolled public publishing.

---

## Minds Integration — Structural Dependency

Minds is not a feature. Remove it and MUSE ceases to function. The dependency is structural, not decorative:

| Minds Feature | Purpose | Loss Without It |
|---|---|---|
| Soul | Persistent agent identity across sessions | No creator state — becomes a stateless chatbot |
| LTM | Long-term memory | No cross-session knowledge — every session starts from zero |
| STM | Session context for multi-step workflows | Cannot track delegation → evaluation → approval flow |
| Circles | Multi-Mind coordination | Three disconnected agents, no delegation possible |
| Skills | Tool use (drafting, analytics, publishing) | Advisory-only, cannot act |
| Alarm Clock | Autonomous wake-up at scheduled times | No overnight work — the core differentiator disappears |

---

## The Five Key Claims

These are the assertions the product rests on. Each is falsifiable:

| # | Claim | Falsification |
|---|---|---|
| C1 | Persistence + memory is the unlock — MUSE passes the "remove Minds" test | If the product works equally well with a stateless LLM, the claim is false |
| C2 | The learning loop is the real invention — the squad serves the loop, not vice versa | If the squad could collapse to one Mind without losing core value, the squad is not the invention |
| C3 | Scope discipline is the decisive variable — 3 focused Minds beat 4 stretched ones in 20 days | If a 4-Mind build ships equally reliable and polished, the claim is false |
| C4 | A real creator + statistical honesty is the credibility moat | If no real creator is secured, confidence downgrades to disclosed simulation |
| C5 | The overnight autonomous turn is the demo climax — the unforgettable moment | If judges remember a different moment more vividly, the bet was wrong |

---

## What's Built — With Evidence

| Component | Evidence |
|---|---|
| 12 Prisma models (frozen since Day 13) | `prisma/schema.prisma` |
| 35 service modules | `src/lib/*.ts` |
| 56 API route handlers | `src/app/api/**` — 12 route groups |
| 5 dashboard screens | Today, Memory, Learning, Overnight, Control |
| 3-agent delegation flow | Muse → Maker → Evaluate → Creator |
| Learning engine with confidence scoring | Observe-Compare-Infer-Update-Recommend cycle |
| Overnight scheduler with approval gates | `overnight-scheduler-service.ts`, `Approval` model |
| Creator feedback loop | Feedback → Refinements → Gate → Memory update |
| Epistemic honesty system | Sample-size gates, confidence decay, simulation disclosure |
| 3-tier demo fallback | Live → Simulated → Pre-recorded, with health checks |
| Bazaar Skill — Creator Memory Engine | Hook + Voice + Performance + Decision memory as reusable Skill |

### The Six Non-Negotiables

These must work. Everything else is cuttable:

1. **Persistent memory** — MUSE remembers previous interactions across sessions
2. **Structured learning** — Performance changes memory; the loop closes
3. **Autonomous execution** — MUSE works without the creator asking (overnight wake-up)
4. **Delegation** — Muse → Maker via Circles with structured instructions
5. **Explainable recommendations** — MUSE can explain why, with cited evidence
6. **Working dashboard** — Creator sees what happened (5 screens)

---

## Demo

```bash
bun install && bun run db:push && bun run dev
```

**The demo climax** — Jules goes offline at 22:00. MUSE wakes, analyses signals, recalls strongest hook patterns, delegates to Maker, evaluates draft, updates memory. At 06:00: *"Good morning. I worked while you were offline."* Jules asks: *"Why did you choose this hook?"* MUSE: *"Because you used this pattern 8 times. Those posts averaged 72% retention vs. your 61% baseline. You approved similar framing twice."* **This is where the judge sees recall, not generation.**

**Fallback** — When Minds API is degraded, automatically falls back: live → simulated → pre-recorded (all data tagged `isSimulation: true`). Rehearsal mode at `/api/demo/rehearsal` plays all 10 scenes at 3x speed.

---

## Honesty & Disclosure

Every claim carries an evidence level: **observed** → **correlation** → **confidence-weighted** → **recommendation**. Simulated data is never hidden. Sample-size gates prevent overclaiming: < 3 data points = no "pattern"; < 10 = no "trend." Confidence decays without confirming evidence.

**Example recommendation output:**
> Hook: Contrarian claim · Historical avg: 61% · This post: 72% · Lift: +11pp · Confidence: Medium · *Recommendation: Increase contrarian openings, but test against tutorial openings before declaring a permanent preference.*

---

## Scope Discipline

The tier system enforces scope. After Day 8, no new Minds, integrations, or features:

| Tier | Items | Rule |
|---|---|---|
| **Tier 1 — Must have** | Muse, Maker, learning loop, persistent memory, dashboard, approval-gated autonomy | Always ships |
| **Tier 2 — Strong bonus** | Guardian, Circles, Bazaar Skill, real creator data | Ships if time permits |
| **Tier 3 — Only if finished** | Wallet, NFT, autonomous publishing, Scout, multi-platform | Do not start before Tier 1+2 |

**Explicitly excluded:** Full TikTok/IG/YouTube/X integrations, NFT marketplace, DAO, sponsorship negotiation, autonomous financial transactions, 10-agent swarm, fake metrics, fake creator, unnecessary blockchain.

---

## Limitations

**Simulated (disclosed):** Maker output, content metrics, creator decisions, audience data use pre-recorded demo data — all tagged `isSimulation: true`.

**Not built:** Real platform API integrations, multi-creator support, A/B testing, production deployment. Voice accuracy and learning convergence require real creator data at scale over weeks — not demonstrable in a single demo session.

**Admitted:** The Minds Builder API is ~6 weeks old; `POST /v1/minds` does not exist (no programmatic Mind creation per user). Current architecture supports one creator per manually-provisioned Mind. This is disclosed honestly and framed as a cohort model for the investment phase.

---

## Hackathon Submission

**Creative Minds Jam #1: Hong Kong** — [dorahacks.io/hackathon/creativeminds/detail](https://dorahacks.io/hackathon/creativeminds/detail)

| | |
|---|---|
| **Track** | 1 — Audience Growth & Engagement |
| **Mind ID** | `9fd0483e-f36b-1410-8466-00039ce7df11` |
| **Deadline** | August 28, 2026, 23:59 HKT |
| **Prize Pool** | $10,000 USD |
| **Investment Path** | [Minds Investment Programme](https://build.hellominds.ai/program) — up to $250K |

**Track fit:** MUSE automates audience engagement feedback loops — learns what hooks retain viewers, what content grows audience, acts on those patterns proactively. This is audience growth powered by persistent memory, not generic advice.

**Judging alignment:**

| Criterion | How MUSE Satisfies |
|---|---|
| Minds Integration Depth | Structural dependency — remove Minds and product collapses (C1) |
| Creator-Economy Problem Fit | 78% creator burnout + winner-take-most squeeze = documented pain |
| Innovation & Creativity | The learning loop is a category shift — clippers generate; MUSE learns (C2) |
| Execution & Completeness | 5 screens, 56 endpoints, 35 services, 3-tier fallback, 6 non-negotiables met |
| Viability & Scalability | Fundable shape: price ($19–29/mo), user (mid-tier creators), channel (Bazaar), moat (memory) |

---

*Built for [Creative Minds Jam #1](https://dorahacks.io/hackathon/creativeminds/detail). The product isn't AI-generated content. The product is accumulated creative intelligence.*
