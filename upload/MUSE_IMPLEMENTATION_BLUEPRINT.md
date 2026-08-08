# 🏆 MUSE — Complete Implementation Blueprint
## *The AI Creative Team That Learns You*
### Creative Minds Jam #1 — Grand Prize Execution Plan

> **Target Repo:** https://github.com/sodiq-code  
> **Hackathon:** Creative Minds Jam #1: Hong Kong (DoraHacks × Animoca Minds)  
> **Track:** 1 — Audience Growth & Engagement  
> **Deadline:** August 28, 2026, 23:59 HKT  
> **Real Prize:** US$250K Minds Investment Programme (not the $2,300 Grand Prize)  
> **Core Thesis:** *"The product isn't AI-generated content. The product is accumulated creative intelligence."*

---

## TABLE OF CONTENTS

1. [Strategic Foundation](#1-strategic-foundation)
2. [Architecture Deep-Dive](#2-architecture-deep-dive)
3. [Minds Platform Integration Map](#3-minds-platform-integration-map)
4. [Repository Structure & Tech Stack](#4-repository-structure--tech-stack)
5. [Database Schema (Complete)](#5-database-schema-complete)
6. [The Three Minds — Detailed Specs](#6-the-three-minds--detailed-specs)
7. [The Learning Loop — Core Engine](#7-the-learning-loop--core-engine)
8. [Creator Memory System](#8-creator-memory-system)
9. [The Custom Skill — Creator Memory Engine](#9-the-custom-skill--creator-memory-engine)
10. [Five Dashboard Screens — UI Specs](#10-five-dashboard-screens--ui-specs)
11. [Autonomy & Overnight System](#11-autonomy--overnight-system)
12. [Demo Fallback Architecture](#12-demo-fallback-architecture)
13. [API Routes — Complete Map](#13-api-routes--complete-map)
14. [20-Day Execution Timeline](#14-20-day-execution-timeline)
15. [Demo Script (90 Seconds)](#15-demo-script-90-seconds)
16. [Submission Package Checklist](#16-submission-package-checklist)
17. [12 Non-Negotiable Rules](#17-12-non-negotiable-rules)
18. [Risk Register & Mitigations](#18-risk-register--mitigations)
19. [Tier System (Scope Discipline)](#19-tier-system-scope-discipline)
20. [What NOT to Build](#20-what-not-to-build)
21. [Business Model & Investment Story](#21-business-model--investment-story)
22. [Open-Source Strategy](#22-open-source-strategy)
23. [Security Architecture](#23-security-architecture)
24. [Go/No-Go Gates](#24-gono-go-gates)

---

## 1. STRATEGIC FOUNDATION

### 1.1 The One Sentence That Drives Everything

> **"Muse remembers what makes your content work, learns from every result, and keeps working after you log off."**

### 1.2 The Core Product Loop

```
Remember → Learn → Act → Measure → Remember
```

**NOT:** Prompt → Generate → Done

### 1.3 Why This Wins

| Competitive Advantage | Explanation |
|----------------------|-------------|
| Passes "Remove Minds" test | Remove persistent Soul/LTM/autonomy and the product ceases to exist |
| Learning loop is the invention | No competitor (OpusClip, Submagic, Buffer) does post-publish learning |
| Three emotional triggers | (1) The underdog creator (2) The overnight miracle (3) Real value moving to the creator |
| Fundable company shape | Maps directly to Animoca's US$10M Investment Programme |
| Statistical honesty | Observed/correlation/confidence/recommendation are separated — judges detect inflated metrics |
| Real creator mandate | One actual creator with 5k-20k followers = credibility moat |

### 1.4 The Five Judging Criteria — Our Score Strategy

| Criterion (1-10) | What Judge Must See | Our Demo Moment |
|-------------------|---------------------|-----------------|
| Minds Integration Depth | Remove the Mind, product breaks | Persistence beat: "Why did you choose this hook?" → cites 8 posts, 72% retention |
| Creator-Economy Problem Fit | Genuine, well-defined pain | Real creator Jules + 78% burnout stat + mid-tier squeeze |
| Innovation & Creativity | Novel, not a clone | Learning loop as category shift; custom Bazaar Skill |
| Execution & Completeness | Functional demo, thoughtful UX | 5-screen dashboard; overnight Mind Theatre; simulator fallback |
| Viability & Scalability | Path to real adoption | Price ($19-29/mo), user (mid-tier creators), channel (Bazaar) |

---

## 2. ARCHITECTURE DEEP-DIVE

### 2.1 Three-Layer Architecture

```
                    ┌──────────────────────────┐
                    │       CREATOR            │
                    │  "I'm going offline."    │
                    └────────────┬─────────────┘
                                 │
                        Web UI / Telegram
                                 │
                                 ▼
                    ┌───────────────────────────┐
                    │          MUSE             │
                    │    Orchestrator Mind       │
                    │  Identity + Memory + State │
                    │  Decision + Planning       │
                    └───────┬──────────┬────────┘
                            │          │
                       Circle        Circle
                       (native)      (native)
                            │          │
                            ▼          ▼
                     ┌──────────┐ ┌───────────┐
                     │  MAKER   │ │ GUARDIAN  │
                     │ Creative │ │ Community │
                     │ & Voice  │ │ & Safety  │
                     └────┬─────┘ └─────┬─────┘
                          │              │
                          └──────┬───────┘
                                 ▼
                      ┌─────────────────────┐
                      │   LEARNING ENGINE   │
                      │  Observe → Compare  │
                      │  → Infer → Update   │
                      │  → Recommend        │
                      └──────────┬──────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │  CREATOR MEMORY GRAPH   │
                    │  Identity · Voice       │
                    │  Audience · Performance │
                    │  Hooks · Decisions      │
                    │  Experiments            │
                    └────────────┬────────────┘
                                 │
                                 └──────► NEXT ACTION
```

### 2.2 Data Flow — Publishing Cycle

```
Creator creates content
        │
        ▼
Maker assists with voice-aligned draft (Muse delegates via Circle)
        │
        ▼
Creator publishes
        │
        ▼
Guardian monitors audience response (comments, engagement signals)
        │
        ▼
Learning Engine: Observe → Analyse → Update Memory → Change Strategy
        │
        ▼
Muse recommends next action with evidence ("Your contrarian hooks avg 72% retention")
        │
        ▼
Creator approves or rejects → Decision logged → Memory refined
        │
        ▼
Better next content → MORE DATA → STRONGER MEMORY → FLYWHEEL
```

---

## 3. MINDS PLATFORM INTEGRATION MAP

### 3.1 Platform Primitives We Use

| Primitive | How Muse Uses It | Critical? |
|-----------|-----------------|-----------|
| **Soul (Identity)** | Muse's persistent identity as "creative teammate" | YES — Tier 1 |
| **LTM (Long-Term Memory)** | Creator profile, voice, performance history, decisions | YES — Tier 1 |
| **STM (Short-Term Memory)** | Active task context (current draft, current analysis) | YES — Tier 1 |
| **Skills** | "Creator Memory Engine" custom Skill on Bazaar | YES — Tier 1 |
| **Circles** | Muse ↔ Maker ↔ Guardian collaboration | YES — Tier 1 |
| **Alarm Clock** | Overnight autonomous wake-up at 23:00 | YES — Tier 1 |
| **Wallet** | Loyalty credential for top supporters | NO — Tier 3 |
| **SSE Events** | Real-time UI updates from Mind activity | YES — Tier 1 |
| **Cognition Credits** | Budget monitoring, balance checks | YES — operational |

### 3.2 API Routes We Call

| API Route | Purpose | Frequency |
|-----------|---------|-----------|
| `POST /v1/messaging/conversations` | Create conversation channels | Onboarding |
| `POST /v1/messaging/send` | Send instructions to Minds | Every interaction |
| `GET /v1/messaging/histories/{alias}` | Retrieve conversation history | Dashboard load |
| `GET /v1/messaging/events` (SSE) | Real-time Mind activity stream | Always connected |
| `GET /v1/minds/{mindId}` | Check Mind status, wallet info | Health checks |
| `PATCH /v1/minds/{mindId}` | Enable/disable Minds | Control panel |
| `GET/PUT/DELETE /v1/minds/{mindId}/skills` | Equip/unequip Skills | Setup + Bazaar |
| `GET/POST/DELETE /v1/circles/{mindId}` | Manage Circle membership | Setup + changes |
| `GET /v1/minds/{mindId}/cognition/usage` | Monitor cognition spend | Dashboard |
| `GET /v1/minds/{mindId}/credits` | Check credit balance | Health checks |
| `GET /v1/bazaar/skills` | Search Bazaar for Skills | Setup |
| `GET /v1/bazaar/skills/{skillId}` | Get Skill details | Setup |

### 3.3 Client Library Usage Pattern

```typescript
import { createMindsClient } from '@animocabrands/minds-client-lib';

const client = createMindsClient({ builderApiKey: process.env.MINDS_BUILDER_API_KEY });

// Core patterns we'll use:
// 1. Send instruction to Muse
const reply = await client.waitForReply(museAlias, instruction);

// 2. Listen for real-time events
const events = client.getEvents(); // SSE stream

// 3. Retrieve memory/history
const history = await client.getHistory(alias, { limit: 50 });

// 4. Manage Circle (Muse ↔ Maker ↔ Guardian)
await client.addCircleMembers(museMindId, { emails: [makerEmail, guardianEmail] });

// 5. Equip custom Skill
await client.equipSkills(museMindId, { ids: [creatorMemorySkillId] });

// 6. Check cognition balance
const balance = await client.getCognitionBalance(museMindId);
```

---

## 4. REPOSITORY STRUCTURE & TECH STACK

### 4.1 Monorepo Structure

```
sodiq-code/muse/
├── apps/
│   ├── web/                          # Next.js 16 Frontend (App Router)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx        # Root layout with providers
│   │   │   │   ├── page.tsx          # Main dashboard entry
│   │   │   │   └── api/             # API routes
│   │   │   │       ├── minds/
│   │   │   │       │   ├── route.ts          # Minds management
│   │   │   │       │   ├── message/route.ts  # Send to Mind
│   │   │   │       │   ├── history/route.ts  # Get history
│   │   │   │       │   └── events/route.ts   # SSE proxy
│   │   │   │       ├── memory/
│   │   │   │       │   ├── route.ts          # Memory CRUD
│   │   │   │       │   └── insights/route.ts # Learning insights
│   │   │   │       ├── creator/
│   │   │   │       │   ├── route.ts          # Creator profile
│   │   │   │       │   └── content/route.ts  # Content ingestion
│   │   │   │       ├── learning/
│   │   │   │       │   ├── route.ts          # Learning engine
│   │   │   │       │   └── hooks/route.ts    # Hook analysis
│   │   │   │       ├── autonomy/
│   │   │   │       │   ├── route.ts          # Overnight schedule
│   │   │   │       │   ├── status/route.ts   # Autonomy status
│   │   │   │       │   └── approve/route.ts  # Approval gate
│   │   │   │       └── dashboard/
│   │   │   │           └── route.ts          # Dashboard data
│   │   │   ├── components/
│   │   │   │   ├── ui/              # shadcn/ui components
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── today-screen.tsx      # Screen 1
│   │   │   │   │   ├── memory-screen.tsx     # Screen 2
│   │   │   │   │   ├── learning-screen.tsx   # Screen 3
│   │   │   │   │   ├── overnight-screen.tsx  # Screen 4
│   │   │   │   │   └── control-screen.tsx    # Screen 5
│   │   │   │   ├── memory/
│   │   │   │   │   ├── identity-card.tsx
│   │   │   │   │   ├── voice-radar.tsx
│   │   │   │   │   ├── performance-table.tsx
│   │   │   │   │   └── decision-log.tsx
│   │   │   │   ├── learning/
│   │   │   │   │   ├── hook-analysis.tsx
│   │   │   │   │   ├── insight-card.tsx
│   │   │   │   │   ├── evidence-badge.tsx
│   │   │   │   │   └── recommendation.tsx
│   │   │   │   ├── overnight/
│   │   │   │   │   ├── mind-theatre.tsx
│   │   │   │   │   ├── timeline.tsx
│   │   │   │   │   └── morning-brief.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── source-badge.tsx      # "Why Muse chose this"
│   │   │   │       ├── evidence-tag.tsx
│   │   │   │       ├── confidence-meter.tsx
│   │   │   │       └── mind-status-indicator.tsx
│   │   │   ├── lib/
│   │   │   │   ├── minds-client.ts   # Minds SDK wrapper
│   │   │   │   ├── minds-adapter.ts  # Live ↔ Simulator adapter
│   │   │   │   └── utils.ts
│   │   │   └── hooks/
│   │   │       ├── use-minds-events.ts      # SSE hook
│   │   │       ├── use-creator-memory.ts
│   │   │       └── use-overnight-status.ts
│   │   ├── tailwind.config.ts
│   │   └── next.config.ts
│   │
│   └── broker/                       # Backend Service (mini-service)
│       ├── src/
│       │   ├── index.ts              # Fastify server entry
│       │   ├── routes/
│       │   │   ├── minds.ts          # Mind management routes
│       │   │   ├── memory.ts         # Memory operations
│       │   │   ├── learning.ts       # Learning engine routes
│       │   │   ├── autonomy.ts       # Overnight/autonomy routes
│       │   │   └── creator.ts        # Creator profile routes
│       │   ├── services/
│       │   │   ├── minds-service.ts       # Minds SDK integration
│       │   │   ├── memory-service.ts      # Creator memory CRUD
│       │   │   ├── learning-engine.ts     # Core learning loop
│       │   │   ├── hook-analyzer.ts       # Hook extraction & classification
│       │   │   ├── autonomy-scheduler.ts  # Overnight job scheduler
│       │   │   ├── approval-gate.ts       # Human approval workflow
│       │   │   └── simulator.ts           # Fallback simulator
│       │   ├── lib/
│       │   │   ├── minds-client.ts   # Typed Minds SDK wrapper
│       │   │   ├── db.ts             # Prisma client
│       │   │   └── logger.ts         # pino logger
│       │   └── types/
│       │       ├── memory.ts
│       │       ├── learning.ts
│       │       └── minds.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
│
├── packages/
│   ├── shared/                       # Shared types & utils
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── creator.ts
│   │   │   │   ├── memory.ts
│   │   │   │   ├── learning.ts
│   │   │   │   ├── hooks.ts
│   │   │   │   └── autonomy.ts
│   │   │   └── constants.ts
│   │   └── package.json
│   │
│   └── skill/                        # Bazaar Skill package
│       ├── src/
│       │   ├── creator-memory-engine.ts  # The custom Skill logic
│       │   ├── hook-classifier.ts
│       │   ├── voice-profiler.ts
│       │   └── recommendation-engine.ts
│       └── package.json
│
├── docs/
│   ├── architecture.md               # 1-page technical diagram
│   ├── product-narrative.md          # 1-page story
│   ├── evidence.md                   # Creator evidence
│   └── limitations.md               # Honest limitations
│
├── demo/
│   ├── script.md                     # 90-second demo script
│   ├── video/                        # Recorded demo
│   └── fallback-data/               # Pre-recorded simulator data
│
├── .env.example
├── README.md                         # Hackathon README
└── package.json                      # Root workspace
```

### 4.2 Tech Stack (Locked)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 16 + TypeScript (App Router) | Hackathon-optimized; SSR for dashboard |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Fast, consistent, beautiful |
| **State** | Zustand (client) + TanStack Query (server) | Optimal for real-time + cached data |
| **Backend** | Node.js + Fastify + TypeScript | Low-latency API; lighter than NestJS |
| **Database** | PostgreSQL (via Prisma ORM) | Structured creator data; complex queries |
| **Minds SDK** | @animocabrands/minds-client-lib v0.1.3+ | Official SDK; typed |
| **Minds CLI** | @animocabrands/minds-cli | Dev-time testing & debugging |
| **Queue** | BullMQ + Redis | Overnight job scheduling |
| **Validation** | Zod | Runtime type safety |
| **Logger** | pino | Fast structured logging |
| **Real-time** | SSE (via Minds Events API) | Native Minds event streaming |
| **Deployment** | Vercel (frontend) + Railway (backend) | Fast deploy; free tiers |

### 4.3 Environment Variables

```env
# Minds Platform
MINDS_BUILDER_API_KEY=           # Builder API key (X-Api-Key header)
MINDS_MUSE_ID=                   # Muse orchestrator Mind UUID
MINDS_MAKER_ID=                  # Maker creative Mind UUID
MINDS_GUARDIAN_ID=               # Guardian community Mind UUID
MINDS_MUSE_EMAIL=                # Muse's email address
MINDS_MAKER_EMAIL=               # Maker's email address
MINDS_GUARDIAN_EMAIL=            # Guardian's email address

# Database
DATABASE_URL=postgresql://...

# Redis (BullMQ)
REDIS_URL=redis://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
BROKER_PORT=3030

# Creator (real creator credentials)
CREATOR_NAME=Jules
CREATOR_EMAIL=
CREATOR_PLATFORM=youtube
```

---

## 5. DATABASE SCHEMA (COMPLETE)

### 5.1 Prisma Schema

```prisma
// ============================================
// MUSE — Creator Memory Database
// ============================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ---------- CREATOR IDENTITY ----------

model Creator {
  id            String   @id @default(cuid())
  name          String
  email         String?  @unique
  niche         String
  bio           String?
  avatarUrl     String?
  
  // Voice Profile (stored as JSON for flexibility)
  voiceProfile  Json     @default("{}")
  // { directness: 91, technicalDepth: 88, humor: 34, hype: 8, storytelling: 72, sentenceLength: 43, ctaIntensity: 28 }
  
  // Audience
  primaryPlatform  String   @default("youtube")
  audienceSize     Int      @default(0)
  audienceType     String   @default("technical creators")
  
  // Preferences
  tone           Json     @default("[]")  // ["direct", "technical", "conversational"]
  avoid          Json     @default("[]")  // ["corporate language", "fake urgency"]
  contentBoundaries Json  @default("[]")
  schedulingPrefs   Json  @default("{}")
  
  // Metadata
  isRealCreator  Boolean  @default(false)  // true = real creator, false = simulated
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // Relations
  contentItems     ContentItem[]
  metrics          ContentMetric[]
  hooks            Hook[]
  hookPatterns     HookPattern[]
  decisions        CreatorDecision[]
  memoryEvents     MemoryEvent[]
  recommendations  Recommendation[]
  drafts           Draft[]
  approvals        Approval[]
}

// ---------- CONTENT & PERFORMANCE ----------

model ContentItem {
  id          String   @id @default(cuid())
  creatorId   String   @map("creator_id")
  platform    String   // youtube, tiktok, instagram, x
  type        String   // video, post, thread, reel, story
  title       String
  content     String?  @db.text
  hook        String?  // The opening hook text
  cta         String?  // Call to action
  topic       String?
  tags        Json     @default("[]")
  
  // Metadata
  publishedAt DateTime?
  externalId  String?  // Platform-specific ID
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  creator     Creator       @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  metrics     ContentMetric[]
  hookAnalysis Hook?
}

model ContentMetric {
  id          String   @id @default(cuid())
  contentId   String   @map("content_id")
  creatorId   String   @map("creator_id")
  
  views       Int      @default(0)
  likes       Int      @default(0)
  comments    Int      @default(0)
  shares      Int      @default(0)
  saves       Int      @default(0)
  clicks      Int      @default(0)
  
  retention   Float?   // 0-1, average retention percentage
  engagementRate Float? // 0-1, engagement / views
  clickThroughRate Float? // 0-1
  
  // Computed
  outcome     String?  // "winner", "average", "underperformer"
  
  measuredAt  DateTime @default(now())
  createdAt   DateTime @default(now())
  
  contentItem ContentItem @relation(fields: [contentId], references: [id], onDelete: Cascade)
  creator     Creator     @relation(fields: [creatorId], references: [id], onDelete: Cascade)
}

// ---------- HOOK SYSTEM ----------

model Hook {
  id          String   @id @default(cuid())
  contentId   String   @map("content_id")
  creatorId   String   @map("creator_id")
  
  hookText    String   // The actual hook text
  pattern     String   // contrarian_claim, question, story, statistic, tutorial, listicle, analogy, personal
  confidence  Float    @default(0.5) // 0-1, classification confidence
  
  // Performance of this specific hook
  retention   Float?
  engagementRate Float?
  outcome     String?
  
  classifiedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  
  contentItem ContentItem @relation(fields: [contentId], references: [id], onDelete: Cascade)
  creator     Creator     @relation(fields: [creatorId], references: [id], onDelete: Cascade)
}

model HookPattern {
  id          String   @id @default(cuid())
  creatorId   String   @map("creator_id")
  
  pattern     String   @unique // contrarian_claim, question, story, etc.
  label       String   // Human-readable label
  
  // Aggregate stats
  sampleSize  Int      @default(0)
  avgRetention Float   @default(0)
  avgEngagement Float  @default(0)
  winRate     Float   @default(0) // % that are "winners"
  
  // Statistical honesty
  confidence  String  @default("low") // low, medium, high
  evidenceLevel String @default("observed") // observed, correlation, recommendation
  
  lastUpdated DateTime @default(now())
  createdAt   DateTime @default(now())
  
  creator     Creator  @relation(fields: [creatorId], references: [id], onDelete: Cascade)
}

// ---------- CREATOR DECISIONS ----------

model CreatorDecision {
  id          String   @id @default(cuid())
  creatorId   String   @map("creator_id")
  
  type        String   // approved, rejected, modified, scheduled, ignored
  category    String   // hook, topic, cta, format, timing, voice
  
  // What was decided
  originalValue String?  // What Muse suggested
  finalValue    String?  // What creator chose
  
  // Context
  reasoning   String?  // Why Muse suggested it
  creatorNote String?  // Why creator rejected/modified
  
  // Learning signal
  learnedFrom String?  // "audience_response", "creator_feedback", "performance_data"
  
  createdAt   DateTime @default(now())
  
  creator     Creator  @relation(fields: [creatorId], references: [id], onDelete: Cascade)
}

// ---------- MEMORY EVENTS (Audit Trail) ----------

model MemoryEvent {
  id          String   @id @default(cuid())
  creatorId   String   @map("creator_id")
  
  domain      String   // identity, voice, performance, decisions
  action      String   // created, updated, inferred, corrected, learned
  key         String   // What changed
  oldValue    String?  @db.text
  newValue    String?  @db.text
  
  // Provenance
  source      String   // creator, mind_muse, mind_maker, mind_guardian, learning_engine, manual
  evidenceType String  @default("observed") // observed, correlation, inference, recommendation
  confidence  Float?   // 0-1
  
  // For the "Why?" feature
  explanation String?  @db.text
  
  createdAt   DateTime @default(now())
  
  creator     Creator  @relation(fields: [creatorId], references: [id], onDelete: Cascade)
}

// ---------- RECOMMENDATIONS ----------

model Recommendation {
  id          String   @id @default(cuid())
  creatorId   String   @map("creator_id")
  
  type        String   // hook, topic, format, timing, cta
  value       String   // The recommendation itself
  explanation String   @db.text // "Why Muse chose this" — MANDATORY
  
  // Evidence chain
  evidenceType String  // observed, correlation, recommendation
  confidence  String   // low, medium, high
  dataPoints  Int      @default(0) // How many data points support this
  supportingFacts Json @default("[]") // Array of supporting evidence
  
  status      String   @default("pending") // pending, approved, rejected, expired
  creatorNote String?
  
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
  resolvedAt  DateTime?
  
  creator     Creator  @relation(fields: [creatorId], references: [id], onDelete: Cascade)
}

// ---------- DRAFTS (Overnight Output) ----------

model Draft {
  id          String   @id @default(cuid())
  creatorId   String   @map("creator_id")
  
  type        String   // content_draft, caption, hook, cta
  title       String?
  content     String   @db.text
  
  // Attribution
  createdBy   String   // mind_muse, mind_maker
  parentRunId String?  @map("parent_run_id") // Links to autonomous run
  
  // Quality
  voiceMatch  Float?   // 0-1, alignment with creator voice
  hookCompat  Float?   // 0-1, hook pattern compatibility
  
  status      String   @default("draft") // draft, reviewed, approved, published, rejected
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  creator     Creator  @relation(fields: [creatorId], references: [id], onDelete: Cascade)
}

// ---------- AUTONOMY SYSTEM ----------

model AutonomousRun {
  id          String   @id @default(cuid())
  creatorId   String   @map("creator_id")
  
  // Schedule
  scheduledAt DateTime
  startedAt   DateTime?
  completedAt DateTime?
  
  // What happened
  steps       Json     @default("[]")
  // [{ time, action, mind, input, output, duration }]
  
  summary     String?  @db.text
  status      String   @default("scheduled") // scheduled, running, completed, failed, cancelled
  
  createdAt   DateTime @default(now())
}

model Approval {
  id          String   @id @default(cuid())
  creatorId   String   @map("creator_id")
  runId       String?  @map("run_id")
  draftId     String?  @map("draft_id")
  
  action      String   // publish, schedule, modify
  description String   @db.text
  autoSource  String   // mind_muse, mind_maker, overnight_run
  
  status      String   @default("pending") // pending, approved, rejected
  creatorNote String?
  
  requestedAt DateTime @default(now())
  resolvedAt  DateTime?
  
  creator     Creator  @relation(fields: [creatorId], references: [id], onDelete: Cascade)
}

// ---------- AUDIT (Security) ----------

model AuditEvent {
  id          String   @id @default(cuid())
  creatorId   String?  @map("creator_id")
  
  action      String
  actor       String   // mind_muse, mind_maker, mind_guardian, system, creator
  target      String?
  details     Json     @default("{}")
  
  // Every autonomous action gets an audit event
  isAutonomous Boolean @default(false)
  approvalId  String?  @map("approval_id")
  
  createdAt   DateTime @default(now())
}
```

---

## 6. THE THREE MINDS — DETAILED SPECS

### 6.1 Mind #1 — MUSE (Orchestrator) — Tier 1

**Role:** The strategic brain. Owns creator identity, memory, decisions, and the learning loop.

**Soul Configuration (DNA):**
```
Name: Muse
Identity: You are Muse, a persistent AI creative teammate. You develop a long-term 
understanding of one creator and use that accumulated knowledge to autonomously 
improve the creator's next work. You are NOT a content generator. You are a 
creative intelligence that accumulates over time.

Core Questions You Answer:
- Who am I working for?
- What does this creator sound like?
- Who is their audience?
- What content has worked?
- What failed?
- What did the creator approve/reject?
- What changed recently?
- What should we try next?

Operating Principles:
- Never publish without explicit approval
- Every recommendation must cite evidence
- Distinguish observed data from correlation from recommendation
- Prioritize learning over generation
- Protect the creator's voice, don't override it
- When uncertain, say so with confidence level
```

**Key Responsibilities:**
- Morning brief generation (06:00)
- Strategic recommendation with evidence
- Memory updates from creator feedback
- Delegation to Maker (via Circle)
- Overnight orchestration (23:00-06:00)
- Approval gate management

### 6.2 Mind #2 — MAKER (Creative Execution) — Tier 1

**Role:** The creative executor. Receives structured instructions from Muse and produces voice-aligned drafts.

**Soul Configuration (DNA):**
```
Name: Maker
Identity: You are Maker, a specialized creative Mind. You receive structured 
instructions from Muse (the orchestrator) and produce content aligned to the 
creator's voice and strategy. You do NOT own the creator's long-term identity — 
Muse does. You execute with craft, speed, and voice fidelity.

Input Format You Expect:
{
  creator: string,
  topic: string,
  objective: string,
  audience: string,
  voice: VoiceProfile,
  historicalWinners: Hook[],
  instruction: string
}

Output Format You Produce:
{
  script: string,
  caption: string,
  title: string,
  cta: string,
  alternativeHooks: string[],
  thumbnailConcept?: string
}
```

**Key Constraint:** Maker does NOT own the creator's long-term memory. It receives context from Muse and returns output. Muse evaluates and stores.

### 6.3 Mind #3 — GUARDIAN (Community & Safety) — Tier 2

**Role:** Protect the creator's relationship with their audience. Narrow and focused.

**Soul Configuration (DNA):**
```
Name: Guardian
Identity: You are Guardian, a community intelligence Mind. You protect the 
creator's relationship with their audience. You are deliberately narrow — you 
do NOT become a giant moderation platform.

Your Core Functions:
- Classify comments (supportive, question, toxic, spam, collaboration)
- Identify valuable supporters and recurring fans
- Flag genuinely toxic content
- Identify recurring audience questions (content ideas)
- Identify emerging audience interests
- Summarize community sentiment
- Feed audience intelligence BACK to Muse

Operating Principle:
Every insight you generate flows to Muse via Circle. You are the audience's 
voice in the creative team.
```

**Key Constraint:** Guardian feeds intelligence to Muse. It does not act independently on the creator's behalf.

---

## 7. THE LEARNING LOOP — CORE ENGINE

### 7.1 The Loop (This IS the Product)

```
CREATE → PUBLISH → OBSERVE → ANALYSE → UPDATE MEMORY → CHANGE STRATEGY → CREATE BETTER → NEXT ITERATION
```

### 7.2 Learning Engine Implementation

```typescript
// services/learning-engine.ts

interface LearningInput {
  creatorId: string;
  contentId: string;
  metrics: ContentMetric;
  previousMemory: CreatorMemory;
}

interface LearningOutput {
  memoryUpdates: MemoryUpdate[];
  strategyChanges: StrategyChange[];
  recommendations: Recommendation[];
  evidenceChain: EvidenceChain[];
}

class LearningEngine {
  async run(input: LearningInput): Promise<LearningOutput> {
    // Step 1: OBSERVE — Gather raw signals
    const signals = await this.observe(input);
    
    // Step 2: COMPARE — Against historical memory
    const comparisons = await this.compare(signals, input.previousMemory);
    
    // Step 3: INFER — What changed and why
    const inferences = await this.infer(comparisons);
    
    // Step 4: UPDATE — Modify creator memory
    const memoryUpdates = await this.updateMemory(inferences);
    
    // Step 5: RECOMMEND — Next action with evidence
    const recommendations = await this.recommend(memoryUpdates, input.previousMemory);
    
    return { memoryUpdates, strategyChanges, recommendations, evidenceChain };
  }

  private async observe(input: LearningInput): Promise<Signal[]> {
    // Extract: hook pattern, engagement signals, retention curve, audience response
    // Mark each signal as: observed | correlation | inference
  }

  private async compare(signals: Signal[], memory: CreatorMemory): Promise<Comparison[]> {
    // Compare current performance against historical baselines
    // "This contrarian hook outperformed your average by 18%"
    // NOT: "Contrarian hooks are popular" (too generic)
  }

  private async infer(comparisons: Comparison[]): Promise<Inference[]> {
    // Determine: What does this mean FOR THIS CREATOR?
    // Statistical honesty: 
    //   < 5 data points → confidence: "low"
    //   5-15 data points → confidence: "medium"  
    //   > 15 data points → confidence: "high"
  }

  private async updateMemory(inferences: Inference[]): Promise<MemoryUpdate[]> {
    // Update: hook patterns, voice profile, performance baselines
    // Every update is a MemoryEvent (audit trail)
  }

  private async recommend(updates: MemoryUpdate[], memory: CreatorMemory): Promise<Recommendation[]> {
    // Generate: Next action recommendations
    // EVERY recommendation MUST have:
    //   - explanation (string)
    //   - evidenceType (observed | correlation | recommendation)
    //   - confidence (low | medium | high)
    //   - dataPoints (number)
    //   - supportingFacts (array)
  }
}
```

### 7.3 Statistical Honesty System

```
┌─────────────────────────────────────────────────────┐
│              STATISTICAL HONESTY FRAMEWORK           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  OBSERVED (8 posts)                                 │
│    ↓ correlation analysis                           │
│  CORRELATION ("Contrarian hooks correlate with      │
│    higher retention for this creator")               │
│    ↓ confidence assessment                          │
│  CONFIDENCE (Medium — 8 samples, needs more)        │
│    ↓ actionability check                           │
│  RECOMMENDATION ("Test more contrarian hooks in     │
│    AI workflow topic — last one was 11 days ago")   │
│                                                     │
│  ❌ NEVER: "AI discovered that..."                   │
│  ❌ NEVER: "Your audience loves X" (from 2 posts)   │
│  ✅ ALWAYS: "Based on 8 posts, contrarian hooks     │
│     avg 72% retention vs 61% baseline (Medium       │
│     confidence. Testing more recommended.)"          │
└─────────────────────────────────────────────────────┘
```

---

## 8. CREATOR MEMORY SYSTEM

### 8.1 Four Memory Domains

**Domain 1 — IDENTITY**
```json
{
  "creator": "Jules",
  "niche": "AI / developer education",
  "audience": "technical creators",
  "tone": ["direct", "technical", "conversational"],
  "avoid": ["corporate language", "fake urgency", "excessive hype"]
}
```

**Domain 2 — VOICE (Profile, NOT Clone)**
```json
{
  "directness": 91,
  "technicalDepth": 88,
  "humor": 34,
  "hype": 8,
  "storytelling": 72,
  "sentenceLength": 43,
  "ctaIntensity": 28
}
```

**Domain 3 — PERFORMANCE**
```json
{
  "content_id": "video_017",
  "platform": "YouTube",
  "topic": "AI agents",
  "hook": "Most AI agents aren't really agents",
  "hook_pattern": "contrarian_claim",
  "retention": 0.71,
  "engagement_rate": 0.084,
  "views": 18400,
  "cta": "comment",
  "result": "winner"
}
```

**Domain 4 — CREATOR DECISIONS**
```json
{
  "type": "rejected",
  "category": "hook",
  "originalValue": "5 AI tools you need right now",
  "finalValue": "Most AI tools aren't worth your time",
  "reasoning": "Hype-driven, doesn't match voice",
  "learnedFrom": "creator_feedback"
}
```

### 8.2 Memory Retrieval for Recommendations

When Muse generates a recommendation, it queries:
1. **Voice domain** → "What does this creator sound like?"
2. **Performance domain** → "What hook patterns win for THEM?"
3. **Decisions domain** → "What have they rejected before?"
4. **Identity domain** → "What do they avoid?"

---

## 9. THE CUSTOM SKILL — CREATOR MEMORY ENGINE

### 9.1 Bazaar Skill Specification

**Name:** Creator Memory Engine  
**Type:** Skill (learned playbook)  
**Trust:** Wild (community-published, initially)  

**Workflow:**
```
1. Parse content metadata → Extract topic, platform, format, timing
2. Parse metrics → Extract views, engagement, retention, clicks
3. Identify hook → Extract opening hook text from content
4. Classify hook pattern → Match to pattern taxonomy
5. Compare against historical → Query creator's hook_pattern table
6. Determine statistical signal → Compute confidence, evidence level
7. Update creator memory → Write to all 4 memory domains
8. Generate recommendation → With FULL evidence chain
9. Explain confidence → "Based on N posts, X pattern averages Y%"
```

### 9.2 Hook Pattern Taxonomy

| Pattern | Example | Description |
|---------|---------|-------------|
| contrarian_claim | "Most AI agents aren't really agents" | Challenges common belief |
| question | "What if your code could think?" | Opens with a question |
| story | "Last week I shipped 10x faster..." | Personal narrative |
| statistic | "78% of creators report burnout" | Data-driven opener |
| tutorial | "Here's how I set up AI agents in 5 min" | Direct value promise |
| listicle | "5 things every dev should know about AI" | Numbered list |
| analogy | "AI agents are like interns..." | Metaphorical comparison |
| personal | "I almost quit creating last month" | Vulnerability/sharing |

---

## 10. FIVE DASHBOARD SCREENS — UI SPECS

### Screen 1 — TODAY (Home)

```
┌─────────────────────────────────────────────┐
│  🌅 Good morning, Jules.                    │
│  Muse worked while you were offline.        │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 📋 OVERNIGHT BRIEF                  │    │
│  │ • Reviewed 3 new comments           │    │
│  │ • Drafted 2 content suggestions     │    │
│  │ • Updated hook performance data     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ ⚡ TOP   │  │ 📊 NEW  │  │ 💡 TRY  │     │
│  │ SIGNS   │  │ DATA    │  │ NEXT    │     │
│  │         │  │         │  │         │     │
│  │ Engage │  │ 3 posts │  │ Contr.  │     │
│  │ up 12% │  │ analyzed│  │ hook    │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 📝 PENDING APPROVAL                 │    │
│  │ "Your audience doesn't need more     │    │
│  │  AI tools." — Contrarian hook draft  │    │
│  │  [Approve] [Modify] [Reject]         │    │
│  │  Source: Muse · 8 posts · 72% avg    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Key UX Rule:** Every action shows its SOURCE and EVIDENCE.

### Screen 2 — MEMORY

```
┌─────────────────────────────────────────────┐
│  🧠 What Muse Knows About You              │
│                                             │
│  ┌─ IDENTITY ──────────────────────────┐    │
│  │ Niche: AI / developer education     │    │
│  │ Audience: Technical creators         │    │
│  │ Tone: Direct, Technical, Convers.    │    │
│  │ Avoid: Corporate, Hype, Fake urgency │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─ VOICE RADAR ───────────────────────┐    │
│  │     Directness ████████░░ 91        │    │
│  │  Tech Depth ████████░░ 88           │    │
│  │  Storytell. ███████░░░ 72           │    │
│  │     Humor    ████░░░░░░ 34          │    │
│  │       Hype   █░░░░░░░░░  8          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─ WINNING HOOKS ─────────────────────┐    │
│  │ Contrarian  72% avg retention (8)   │    │
│  │ Story       67% avg retention (6)   │    │
│  │ Question    61% avg retention (7)   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  "This isn't a chatbot. This is memory."   │
└─────────────────────────────────────────────┘
```

### Screen 3 — LEARNING (MOST IMPORTANT)

```
┌─────────────────────────────────────────────┐
│  📈 How Muse Is Learning                   │
│                                             │
│  ┌─ LEARNING TIMELINE ─────────────────┐    │
│  │                                     │    │
│  │ Video #12                           │    │
│  │   ↓ Published                       │    │
│  │ Performance: 71% retention          │    │
│  │   ↓ Hook analysis                   │    │
│  │ Pattern: Contrarian claim           │    │
│  │   ↓ Comparison                      │    │
│  │ +18% vs your average (61%)         │    │
│  │   ↓ Memory updated                  │    │
│  │ Contrarian confidence: MEDIUM→HIGH  │    │
│  │   ↓ Strategy changed                │    │
│  │ Prioritize contrarian in AI topics  │    │
│  │                                     │    │
│  │ Video #13                           │    │
│  │   ↓ Used contrarian hook            │    │
│  │   ↓ Result: +11% retention          │    │
│  │   ↓ THE LOOP IS WORKING             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─ INSIGHT ───────────────────────────┐    │
│  │ "Your audience responds better to   │    │
│  │  direct technical explanations than │    │
│  │  broad AI news."                    │    │
│  │  Evidence: 8 posts · Medium conf.   │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Screen 4 — OVERNIGHT (Mind Theatre)

```
┌─────────────────────────────────────────────┐
│  🌙 While You Were Offline                 │
│                                             │
│  ┌─ MIND THEATRE ──────────────────────┐    │
│  │                                     │    │
│  │ 22:00  Creator went offline         │    │
│  │ 23:00  Muse: Reviewing signals...   │    │
│  │ 23:15  Muse: Checking performance...│    │
│  │ 23:30  Muse: Delegating to Maker... │    │
│  │ 00:00  Maker: Creating draft...     │    │
│  │ 00:15  Muse: Evaluating output...   │    │
│  │ 00:30  Muse: Storing candidate      │    │
│  │ 06:00  Muse: Morning brief ready    │    │
│  │                                     │    │
│  │ Status: ✅ Complete                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─ OVERNIGHT OUTPUT ──────────────────┐    │
│  │ Draft: "Your audience doesn't need  │    │
│  │ more AI tools."                     │    │
│  │ Voice match: 94%                    │    │
│  │ Hook compat: 91%                    │    │
│  │ [Review] [Approve] [Reject]         │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Screen 5 — CREATOR CONTROL

```
┌─────────────────────────────────────────────┐
│  ⚙️ You're In Control                      │
│                                             │
│  ┌─ AUTONOMY SETTINGS ────────────────┐    │
│  │                                     │    │
│  │ Overnight analysis    [ON]          │    │
│  │ Draft creation        [ON]          │    │
│  │ Auto-publish          [OFF] 🔒      │    │
│  │ Community monitoring  [ON]          │    │
│  │                                     │    │
│  │ ⚠️  Publishing ALWAYS requires      │    │
│  │     your explicit approval.         │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─ APPROVAL QUEUE ────────────────────┐    │
│  │ 2 items pending your review         │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─ AUDIT LOG ────────────────────────┐    │
│  │ 23:00 Muse reviewed signals         │    │
│  │ 23:30 Muse delegated to Maker       │    │
│  │ 06:00 Muse prepared morning brief   │    │
│  │ Every action logged. Always.        │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 11. AUTONOMY & OVERNIGHT SYSTEM

### 11.1 Overnight Schedule

```
22:00  Creator goes offline (detected via inactivity)
23:00  Muse wakes up (Alarm Clock Skill)
       → Reviews recent performance signals
       → Checks community sentiment (Guardian feed)
23:30  Muse delegates to Maker (via Circle)
       → Structured instruction with creator voice, winning hooks, topic
00:00  Maker produces draft
00:15  Muse evaluates Maker's output
       → Voice match score
       → Hook compatibility score
       → Alignment with creator preferences
00:30  Muse stores candidate draft (NOT published)
06:00  Muse prepares morning brief
       → Summary of overnight work
       → Drafts ready for review
       → New insights from learning engine
09:00  Creator reviews and approves/rejects
       → If approved → scheduled for publishing
       → If rejected → logged as CreatorDecision → memory updated
```

### 11.2 Approval Gate (Non-Negotiable)

**Autonomous preparation + Human approval = Trust**

```typescript
class ApprovalGate {
  async requestApproval(params: {
    action: string;
    description: string;
    autoSource: string;
    draftId: string;
  }): Promise<Approval> {
    // 1. Create approval record
    const approval = await db.approval.create({
      data: {
        ...params,
        status: 'pending',
      }
    });
    
    // 2. Create audit event
    await db.auditEvent.create({
      data: {
        action: 'approval_requested',
        actor: params.autoSource,
        isAutonomous: true,
        approvalId: approval.id,
      }
    });
    
    // 3. Notify creator (NEVER auto-publish)
    await this.notifyCreator(approval);
    
    return approval;
  }
}
```

---

## 12. DEMO FALLBACK ARCHITECTURE

### 12.1 Adapter Pattern

```
Live Minds API → Adapter → (Live | Simulator) → Same UI
```

```typescript
// lib/minds-adapter.ts

interface MindsAdapter {
  send(mindId: string, message: string): Promise<MindResponse>;
  getHistory(alias: string): Promise<HistoryMessageRecord[]>;
  getEvents(): AsyncIterable<Event>;
}

class LiveMindsAdapter implements MindsAdapter {
  // Uses real @animocabrands/minds-client-lib
  // Falls back to simulator on timeout/error
}

class SimulatorMindsAdapter implements MindsAdapter {
  // Uses pre-recorded responses from demo/fallback-data/
  // Same interface, same UI
}

// Factory:
function createMindsAdapter(): MindsAdapter {
  if (process.env.MINDS_MODE === 'simulate') {
    return new SimulatorMindsAdapter();
  }
  return new LiveMindsAdapter();
}
```

### 12.2 Latency Mitigation

```
User sends message →
  Immediate: "Muse is thinking..." →
  2s: "Checking memory..." →
  5s: "Analyzing performance..." →
  10s: "Delegating to Maker..." →
  Final: Actual response
```

This makes 30s-3min waits feel informative, not broken.

### 12.3 Demo Contingency Ladder

| Tier | Condition | What Shows |
|------|-----------|-----------|
| Tier 0 (ideal) | Minds API live + fast | Live Mind + live UI + pre-recorded overnight + live approval |
| Tier 1 | Minds slow (>15s) | Holding-reply skill masks latency; informative loading states |
| Tier 2 | Minds down (5xx) | Full simulator replay; architecture diagram + Bazaar Skill carry submission |
| Tier 3 | Catastrophic failure | Pre-recorded demo video is the canonical artifact |

---

## 13. API ROUTES — COMPLETE MAP

### 13.1 Frontend API Routes (Next.js App Router)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/minds` | GET | List all Minds and their status |
| `/api/minds/message` | POST | Send message to a Mind |
| `/api/minds/history` | GET | Get conversation history |
| `/api/minds/events` | GET | SSE stream proxy |
| `/api/memory` | GET/POST | Get/update creator memory |
| `/api/memory/insights` | GET | Get learning insights |
| `/api/creator` | GET/PUT | Creator profile CRUD |
| `/api/creator/content` | POST | Ingest content + metrics |
| `/api/learning` | POST | Trigger learning engine |
| `/api/learning/hooks` | GET | Get hook analysis results |
| `/api/autonomy` | GET/POST | Get/set autonomy schedule |
| `/api/autonomy/status` | GET | Get current overnight status |
| `/api/autonomy/approve` | POST | Approve/reject pending action |
| `/api/dashboard` | GET | Aggregate data for current screen |

### 13.2 Broker Service Routes (Fastify on port 3030)

| Route | Method | Purpose |
|-------|--------|---------|
| `/health` | GET | Health check |
| `/api/minds/setup` | POST | Initialize all 3 Minds + Circles |
| `/api/minds/circle/introduce` | POST | Introduce Minds to each other |
| `/api/memory/ingest` | POST | Bulk ingest creator content |
| `/api/memory/domains` | GET | Get all 4 memory domains |
| `/api/learning/run` | POST | Run learning engine on content |
| `/api/learning/hooks/analyze` | POST | Analyze hooks for content |
| `/api/autonomy/schedule` | POST | Set overnight schedule |
| `/api/autonomy/run` | POST | Trigger overnight run manually |
| `/api/autonomy/approval/:id` | PATCH | Resolve approval |
| `/api/audit` | GET | Get audit log |
| `/api/skills/publish` | POST | Publish custom Skill to Bazaar |

---

## 14. 20-DAY EXECUTION TIMELINE

### Phase 1: VALIDATE (Days 1-2) — GO/NO-GO GATE

| Day | Task | Deliverable | Gate |
|-----|------|-------------|------|
| 1 | **Minds Platform Validation** | Create Muse + Maker Minds via Builder Hub | Mind creation works |
| 1 | Test persistence: send message → close → reopen → memory persists | Persistence verified | |
| 1 | Test LTM: store fact → recall in new session | LTM works | |
| 1 | Test Skill equipping: equip a Bazaar Skill | Skills work | |
| 2 | Test Circle: introduce Muse ↔ Maker | Delegation works | |
| 2 | Test autonomous wake-up (Alarm Clock) | Autonomy works | |
| 2 | Measure latency: sendMessage → reply timing | Latency baselined | |
| 2 | **Recruit real creator** | One creator with 5k-20k followers secured | Creator onboarded |
| 2 | Test SSE events stream | Events stream works | **GO/NO-GO DECISION** |

**GO/NO-GO:** If ≥4 of 6 gates pass → proceed. If not → pivot per contingency ladder.

### Phase 2: MEMORY (Days 3-5)

| Day | Task | Deliverable |
|-----|------|-------------|
| 3 | Set up PostgreSQL + Prisma schema | Database running |
| 3 | Implement Creator model + identity domain | Identity CRUD |
| 4 | Implement Voice profile domain | Voice profiler works |
| 4 | Implement Performance domain | Metrics ingestion works |
| 5 | Implement Creator Decisions domain | Decision logging works |
| 5 | Build content ingestion pipeline | 20-50 items ingested from real creator |
| 5 | **Freeze memory schema** | No more schema changes |

### Phase 3: LEARNING (Days 6-8) — SCOPE FREEZE

| Day | Task | Deliverable |
|-----|------|-------------|
| 6 | Build Hook classifier (8 pattern taxonomy) | Hook extraction works |
| 6 | Build Hook comparison engine | Historical comparison works |
| 7 | Build Learning Engine (observe→compare→infer→update→recommend) | Core loop runs |
| 7 | Implement statistical honesty (confidence levels, evidence types) | Honesty framework works |
| 8 | Build "Why Muse chose this" explanation system | Evidence chain works |
| 8 | Run 7-day proof experiment on real creator content | ≥3 genuine insights |
| 8 | **SCOPE FREEZE** | No new Minds, no new integrations, no new features |

### Phase 4: DELEGATION (Days 9-11)

| Day | Task | Deliverable |
|-----|------|-------------|
| 9 | Implement Muse→Maker structured instruction | Delegation message works |
| 10 | Implement Maker output evaluation (voice match, hook compat) | Evaluation scores work |
| 10 | Store Maker output as Draft | Draft pipeline works |
| 11 | Demo the full delegation beat | Muse→Maker→evaluate→store |

### Phase 5: DASHBOARD (Days 12-13)

| Day | Task | Deliverable |
|-----|------|-------------|
| 12 | Screen 1: Today (home + morning brief) | Today screen works |
| 12 | Screen 2: Memory (4 domains + voice radar) | Memory screen works |
| 13 | Screen 3: Learning (timeline + insights) | Learning screen works |
| 13 | Screen 4: Overnight (Mind Theatre) | Overnight screen works |
| 13 | Screen 5: Control (autonomy + approvals) | Control screen works |

### Phase 6: AUTONOMY (Days 14-15)

| Day | Task | Deliverable |
|-----|------|-------------|
| 14 | Implement overnight scheduler (BullMQ + Alarm Clock) | Scheduling works |
| 14 | Implement full overnight loop (review→delegate→evaluate→store→brief) | Overnight runs |
| 15 | Implement approval gate | Approval required before publish |
| 15 | Implement audit logging | Every autonomous action logged |

### Phase 7: VALIDATION (Days 16-17)

| Day | Task | Deliverable |
|-----|------|-------------|
| 16 | Run real creator through full flow | Creator uses Muse |
| 16 | Verify insights are genuine, not fabricated | Statistical honesty verified |
| 17 | Collect creator feedback | Creator corrections logged |
| 17 | Refine based on feedback | Memory updated from real feedback |

### Phase 8: POLISH (Days 18-19) — NO NEW FEATURES

| Day | Task | Deliverable |
|-----|------|-------------|
| 18 | Typography, spacing, hierarchy, animations | Beautiful UI |
| 18 | Loading states, error states, empty states | Graceful degradation |
| 18 | Mobile responsive | Works on phone |
| 19 | Demo reliability: simulator fallback, pre-recorded turns | Demo survives |
| 19 | README, architecture diagram, product narrative | Submission docs |

### Phase 9: REHEARSAL (Day 20)

| Hour | Task |
|------|------|
| 09:00 | Full demo run #1 |
| 10:00 | Full demo run #2 |
| 11:00 | Full demo run #3 |
| 12:00 | Fix any issues from runs 1-3 |
| 13:00 | Full demo run #4 |
| 14:00 | Full demo run #5 |
| 15:00 | Full demo run #6 |
| 16:00 | Full demo run #7 |
| 17:00 | Full demo run #8 |
| 18:00 | Full demo run #9 |
| 19:00 | Full demo run #10 (FINAL) |
| 20:00 | **If demo failed twice → simplify** |
| 21:00 | Submit to DoraHacks |

---

## 15. DEMO SCRIPT (90 SECONDS)

| Time | Scene | What Happens | Emotional Arc |
|------|-------|--------------|---------------|
| 0-5s | Scene 1 | Jules opens Muse on phone | Calm |
| 5-15s | Scene 2 | Memory screen: voice, audience, winning hooks | Curiosity |
| 15-20s | Scene 3 | Jules: "I'm going offline." | Setup |
| 20-25s | Scene 4 | Clock 22:00 → Mind Theatre begins | Tension |
| 25-35s | Scene 5 | Muse delegates to Maker (shows structured instruction) | Intelligence |
| 35-45s | Scene 6 | Maker returns; Muse evaluates (Voice 94%, Hook 91%) | Competence |
| 45-55s | Scene 7 | 06:00 → "Good morning. I worked while you were offline." | **EMOTIONAL PEAK** |
| 55-70s | Scene 8 | Persistence beat: "Why this hook?" → cites 8 posts, 72% retention, 2 approvals | Proof |
| 70-80s | Scene 9 | Learning beat: Mark underperforming → Muse adjusts confidence | Wisdom |
| 80-90s | Scene 10 | Black screen. "A chatbot gives you an answer. Muse gets to know how you work." Logo. MUSE. | **IMPACT** |

---

## 16. SUBMISSION PACKAGE CHECKLIST

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Working product (Muse running on Minds) | ☐ | Must be live and accessible |
| 2 | Demo video (90-120s) | ☐ | Follow 10-scene script |
| 3 | GitHub repo (extremely clean) | ☐ | https://github.com/sodiq-code |
| 4 | README (architecture + setup + evidence + limitations) | ☐ | "Why Minds is indispensable" section |
| 5 | Technical diagram (1 page) | ☐ | Architecture diagram |
| 6 | Product narrative (1 page) | ☐ | "The product is accumulated creative intelligence" |
| 7 | Creator evidence | ☐ | Real creator OR disclosed simulation |
| 8 | Metrics (real / simulated / derived clearly distinguished) | ☐ | Statistical honesty |
| 9 | Bazaar Skill published | ☐ | "Creator Memory Engine" on Bazaar |

---

## 17. 12 NON-NEGOTIABLE RULES

1. **Minds must be visibly indispensable** — Remove Minds, product breaks
2. **Persistence must be demonstrated, not claimed** — Show memory across sessions
3. **Learning must be demonstrated with before/after evidence** — Show the loop working
4. **Use one real creator** — Even 5k-20k followers is enough
5. **Every major recommendation must have evidence** — "Why Muse chose this"
6. **Autonomy must be visible** — Mind Theatre shows overnight work
7. **Don't build unnecessary Web3** — Wallet is Tier 3
8. **Don't build five mediocre agents** — Three focused Minds beat five scattered ones
9. **One extraordinary learning loop beats ten features** — Loop IS the product
10. **Never fake metrics** — Statistical honesty is the credibility moat
11. **Have a simulator fallback** — Demo must survive Minds API failure
12. **The demo is the product story, not a feature tour** — 10 scenes, not a walkthrough

---

## 18. RISK REGISTER & MITIGATIONS

| Risk | Severity | Trigger | Mitigation |
|------|----------|---------|------------|
| Minds API instability (6-week-old) | Med-High | Breaking change or 5xx during demo | Simulator fallback + pre-recorded turns |
| Live demo latency (30s-3min) | High | Multi-tool turn in demo | Holding-reply skill; live only snappy turns |
| Single Mind → per-user isolation | Med-High | Broker mixes user context | Strict per-alias scoping; leak test |
| Real creator not secured | Med-High | No creator by day 3 | Open Campus community + Discord/Reddit |
| Wallet/NFT unsupported | Med | Day-1 validation fails | Tier 3; graceful drop; Web3 optional |
| Track-1 saturation | Med | Judges see "another growth tool" | Innovation opens on learning loop |
| Circle setup flaky | Med | Introduction fails | Introduce Minds early (day 1); verify daily |
| 20 days tight for Tier-1+2 | Med | Day-1-2 validation slips | Tier system; Tier-2 cuttable |
| Cognition credit exhaustion | Med | Mind pauses mid-demo | Hourly balance monitor; 10x reserve |
| Scope creep | Med | New feature ideas after day 8 | SCOPE FREEZE at day 8 |

---

## 19. TIER SYSTEM (SCOPE DISCIPLINE)

| Tier | Items | Can Cut? |
|------|-------|----------|
| **Tier 1 (Must have)** | Muse Mind, persistent memory, creator profile, performance data, learning loop, Maker Mind, 5-screen dashboard, morning brief, approval system, audit log, "Why Muse chose this" evidence | ❌ NEVER |
| **Tier 2 (Strong bonus)** | Guardian Mind, Circle collaboration, Bazaar Skill published, real social API data, real creator onboarded | ✅ If day-8 pressure mounts |
| **Tier 3 (Only if finished)** | Wallet/loyalty credential, NFT, autonomous publishing, Scout Mind, multiple platform integrations | ✅ Cut without hesitation |

**Cut priority:** Tier 3 → Tier 2 Guardian → Tier 2 Bazaar → Tier 2 real API → NEVER cut Tier 1

---

## 20. WHAT NOT TO BUILD

❌ Full TikTok/Instagram/YouTube/X integration suite  
❌ NFT marketplace, token, or DAO  
❌ Sponsorship negotiation engine  
❌ Autonomous financial transactions  
❌ Ten-agent swarm  
❌ Generic chatbot  
❌ Giant analytics suite  
❌ 40-page architecture document  
❌ Fake AI-generated metrics  
❌ Fake creator data  
❌ Unnecessary blockchain  
❌ Scout Mind (research) — demoted to Tier 3  

---

## 21. BUSINESS MODEL & INVESTMENT STORY

### Business Model

| Tier | Price | Target |
|------|-------|--------|
| Free | $0 | Try Muse with 1 creator, limited memory |
| Creator | $19-29/mo | Solo creators, full memory + learning |
| Pro | $49/mo | Creators with teams, Guardian included |
| Studio | $99+/mo | Agencies, multi-creator management |

### Investment Story (For Minds Investment Programme)

> **"We're not building another AI content generator. We're building the persistent intelligence layer between a creator and their audience."**

### Ecosystem Story

> **"We didn't just build on Minds. We built a reusable creator-memory capability for Minds."**

---

## 22. OPEN-SOURCE STRATEGY

| Open-Source (MIT) | Keep Proprietary |
|-------------------|------------------|
| muse-broker | Product UX |
| muse-simulator | Creator scoring algorithm |
| creator-memory-schema | Recommendation strategy |
| hook-performance-skill | Proprietary datasets |
| | Future learning algorithms |

---

## 23. SECURITY ARCHITECTURE

1. **Minds never receives unnecessary secrets** — Only what's needed for the task
2. **Public actions require approval** — Nothing publishes without human gate
3. **Every autonomous action gets an audit event** — Full traceability
4. **Creator data is isolated** — Strict per-creator scoping

---

## 24. GO/NO-GO GATES

### Day 2 — Platform Validation Gate

| Test | Pass Condition |
|------|---------------|
| Mind creation | Muse + Maker created and responding |
| Persistence | Message → close → reopen → memory persists |
| LTM | Store fact → recall in new session |
| Circle/Delegation | Muse → Maker instruction → Maker responds |
| Autonomous wake-up | Alarm Clock → Mind wakes at scheduled time |
| SSE Events | Real-time event stream connects |
| Latency baseline | Average response time measured |

**≥4/7 pass → GO. <4 → Pivot to simulator-first build.**

### Day 8 — Scope Freeze Gate

After day 8, NO new Minds, NO new integrations, NO new features. Only polish and reliability.

### Day 17 — Real Creator Gate

If no real creator secured by day 17, pivot to disclosed simulation with methodological rigor.

---

## APPENDIX: MINDS CLI QUICK REFERENCE

```bash
# Setup
npm install -g @animocabrands/minds-cli
minds doctor  # Verify API key & connectivity

# Create Minds (do on Day 1)
minds list                           # See existing Minds
minds chat create                    # Create conversation

# Test Persistence
minds send --wait                    # Send & wait for reply
minds history <alias>                # Check memory persists

# Manage Circle
minds circle show --mind <muse-id>
minds circle add --mind <muse-id>   # Add Maker & Guardian

# Equip Skills
minds mind skills list --mind <muse-id>
minds mind skills equip --mind <muse-id> --id <skill-uuid>

# Monitor
minds usage show --mind <muse-id>
minds cognition balance --mind <muse-id>
minds events                        # Live SSE stream

# Bazaar
minds bazaar search                 # Find Skills
minds bazaar skills                 # Browse catalog
```

---

**REMEMBER: The single most important sentence in this entire plan:**

> ### *"The product isn't AI-generated content. The product is accumulated creative intelligence."*

Build that. Ship that. Win.
