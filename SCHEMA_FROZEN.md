# Schema Frozen — Day 5

> **FROZEN as of Day 5.** No more schema changes without explicit approval.
> This is the Phase 2 MEMORY freeze gate from the blueprint.

## Status: ❄️ FROZEN

## Models (12 total)

| Model | Purpose | Domain |
|-------|---------|--------|
| Creator | Human creator identity | Identity |
| ContentItem | Content (video, post, thread) | Performance |
| ContentMetric | Performance metrics | Performance |
| Hook | Opening hook text | Performance |
| HookPattern | Hook pattern classification | Performance |
| CreatorDecision | Accept/modify/reject decisions | Decisions |
| MemoryEvent | Long-term memory store | All domains |
| Recommendation | Muse/Maker recommendations | Learning |
| Draft | Working draft content | Delegation |
| AutonomousRun | Overnight autonomous work | Autonomy |
| Approval | Approval gate | Autonomy |
| AuditEvent | Audit trail | All domains |

## Four Memory Domains

1. **IDENTITY** — Creator, MemoryEvent (category: "identity")
2. **VOICE** — Creator.voiceProfile, MemoryEvent (category: "identity", key: "voice_*")
3. **PERFORMANCE** — ContentItem, ContentMetric, Hook, HookPattern, MemoryEvent (category: "performance")
4. **DECISIONS** — CreatorDecision, MemoryEvent (category: "feedback")

## Change Policy

- **NO new models** without blueprint revision
- **NO field removals** — only additions via migration
- **NO type changes** on existing fields
- Schema changes require: (1) written justification (2) impact analysis (3) approval

## Last Modified

- Day 5: Schema frozen
- All 12 models stable and in production use
