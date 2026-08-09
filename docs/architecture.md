# MUSE Architecture

## System Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend (Next.js 16 + React 19)"]
        Dashboard["Dashboard<br/>6 Tabs"]
        DemoTab["Demo Tab<br/>10 Scenes"]
        UI["shadcn/ui<br/>Components"]
    end

    subgraph API["API Layer (34 Routes)"]
        DashboardAPI["Dashboard API<br/>5 routes"]
        CreatorAPI["Creator API<br/>7 routes"]
        ContentAPI["Content API<br/>4 routes"]
        LearningAPI["Learning API<br/>10 routes"]
        MindsAPI["Minds API<br/>6 routes"]
        DelegationAPI["Delegation API<br/>3 routes"]
        AutonomyAPI["Autonomy API<br/>6 routes"]
        OtherAPI["Feedback + Audit<br/>+ Validation + Demo"]
    end

    subgraph Services["Service Layer (33 Modules)"]
        CreatorSvc["Creator Service"]
        LearningEngine["Learning Engine"]
        DelegationSvc["Delegation Service"]
        EvaluationSvc["Evaluation Service"]
        VoiceProfiler["Voice Profiler"]
        HookClassifier["Hook Classifier"]
        HonestyVerifier["Honesty Verifier"]
        OvernightScheduler["Overnight Scheduler"]
        AutonomyScheduler["Autonomy Scheduler"]
        DemoReliability["Demo Reliability"]
    end

    subgraph Minds["Minds Platform"]
        MuseMind["Muse Mind<br/>(Orchestrator)"]
        MakerMind["Maker Mind<br/>(Creative)"]
        GuardianMind["Guardian Mind<br/>(Community)"]
        Soul["Soul"]
        LTM["LTM"]
        STM["STM"]
        Circles["Circles"]
        Skills["Skills"]
        AlarmClock["Alarm Clock"]
    end

    subgraph Data["Data Layer"]
        SQLite["SQLite<br/>(Prisma ORM)"]
        MemoryCache["Memory Cache"]
    end

    Dashboard --> DashboardAPI
    DemoTab --> OtherAPI
    UI --> Dashboard

    DashboardAPI --> CreatorSvc
    CreatorAPI --> CreatorSvc
    ContentAPI --> LearningEngine
    LearningAPI --> LearningEngine
    MindsAPI --> MuseMind
    DelegationAPI --> DelegationSvc
    AutonomyAPI --> AutonomyScheduler

    CreatorSvc --> SQLite
    LearningEngine --> SQLite
    DelegationSvc --> EvaluationSvc
    LearningEngine --> VoiceProfiler
    LearningEngine --> HookClassifier
    LearningEngine --> HonestyVerifier
    OvernightScheduler --> AutonomyScheduler
    DemoReliability --> MuseMind

    MuseMind --> Soul & LTM & STM & Circles & AlarmClock
    MakerMind --> Skills & STM & Circles
    GuardianMind --> Circles & LTM

    CreatorSvc --> SQLite
    LearningEngine --> MemoryCache
```

## Data Flow: Creator to Memory and Back

```
1. Creator speaks to Muse
   Creator --> Muse Mind (STM: conversation context)
   Muse loads creator context --> Creator Memory Graph (LTM)

2. Muse delegates to Maker
   Muse --> Maker Mind (Circles: structured instruction)
   Maker --> Skills (draft, hook, content)
   Maker returns output --> Muse

3. Muse evaluates and presents
   Muse --> Evaluation Service (voice match, hook score)
   Muse presents to Creator --> Creator decides

4. Creator decision feeds learning
   Creator Decision --> Learning Engine
   Content Metrics --> Learning Engine
   Learning Engine --> Observe --> Compare --> Infer --> Update

5. Update writes to memory
   Learning Engine --> Creator Memory Graph
   Memory Graph --> Minds LTM (persistent)
   Memory Graph --> SQLite (local copy)

6. Next session loads richer context
   Creator --> Muse --> LTM --> Creator Memory Graph (now larger)
```

## Minds Platform Integration Points

| Minds Feature | Integration Point | Used By |
|---|---|---|
| **Soul** | Persistent mind identity -- Muse remembers who it is across sessions | Muse |
| **LTM** | Long-term memory -- stores accumulated creative intelligence | Muse, Guardian |
| **STM** | Short-term memory -- active conversation context | Muse, Maker |
| **Circles** | Multi-mind coordination -- Muse delegates to Maker, Maker reports back | Muse, Maker, Guardian |
| **Skills** | Tool equipping -- Maker can draft, publish, fetch analytics | Maker |
| **Alarm Clock** | Scheduled actions -- overnight work triggers, follow-up reminders | Muse |

## Database Schema Overview

```
Creator (1) ---> (N) ContentItem
Creator (1) ---> (N) CreatorDecision
Creator (1) ---> (N) MemoryEvent
Creator (1) ---> (N) Recommendation
Creator (1) ---> (N) Draft
Creator (1) ---> (N) Approval
Creator (1) ---> (N) AuditEvent

ContentItem (1) ---> (N) ContentMetric
ContentItem (1) ---> (N) Hook
ContentItem (1) ---> (N) CreatorDecision
ContentItem (1) ---> (N) Draft
ContentItem (1) ---> (N) AutonomousRun

Hook (1) ---> (N) HookPattern
```

**12 models total**. Schema is frozen (no changes without explicit approval).

## Key API Route Groups

| Group | Count | Purpose |
|---|---|---|
| Dashboard | 5 | Screen data for Today, Memory, Learning, Overnight, Control |
| Creator | 7 | Profile, voice, memory, decisions, audit |
| Content | 4 | CRUD, ingestion, performance, metrics |
| Learning | 10 | Full cycle: run, analyze, compare, predict, explain, honesty |
| Minds | 6 | SDK proxy: message, history, circle, skills, draft, status |
| Delegation | 3 | Send task, evaluate output, get story beat |
| Autonomy | 6 | Approve, reject, expire, status, history, overnight run |
| Feedback | 5 | Submit, summarize, refine, gate, simulate |
| Audit | 3 | Stats, filtered, export |
| Validation | 3 | Day 1 check, full run, honesty report |
| Demo | 3 | Health, scene, rehearsal |
| Drafts | 1 | CRUD |

**34 routes total**.
