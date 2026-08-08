// ============================================================================
// Creator Recruitment — Day 2
// Outreach templates for recruiting a real creator (5k-20k followers)
// Target: Open Campus community, AI/tech YouTubers
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OutreachTemplate {
  id: string;
  type: 'email' | 'dm_twitter' | 'dm_linkedin' | 'dm_discord';
  name: string;
  subject?: string;
  body: string;
  targetAudience: string;
  useCase: string;
}

export interface OnboardingConversation {
  step: number;
  musePrompt: string;
  expectedResponse: string;
  memoryKey: string;
}

export interface RecruitmentPackage {
  templates: OutreachTemplate[];
  onboardingConversation: OnboardingConversation[];
  valueProposition: string;
  faq: { question: string; answer: string }[];
}

// ---------------------------------------------------------------------------
// Value Proposition
// ---------------------------------------------------------------------------

const VALUE_PROPOSITION = `MUSE is your AI creative team that learns your unique voice and style.

Instead of generic AI content tools, MUSE builds a Creator Memory Graph — a persistent understanding of:
• Your voice, tone, and vocabulary
• What hooks work for YOUR audience
• Your content performance patterns over time
• Your creative decisions (and why you made them)

The result? Every recommendation is grounded in YOUR data, not generic best practices.

MUSE works as two AI minds:
• Muse (Orchestrator) — learns you, manages memory, orchestrates workflow
• Maker (Creative) — generates drafts, hooks, and content aligned to your style

Nothing publishes without your approval. Every AI action is audited. You stay in control.

Built on the Minds platform — your data stays yours, on-chain, portable.`;

// ---------------------------------------------------------------------------
// Email Templates
// ---------------------------------------------------------------------------

const EMAIL_TEMPLATES: OutreachTemplate[] = [
  {
    id: 'email-1-initial',
    type: 'email',
    name: 'Initial Outreach — AI/Tech YouTuber',
    subject: 'Your content deserves an AI team that actually learns you',
    body: `Hi [Creator Name],

I've been watching your channel — your approach to [specific topic/video] really resonates. The way you [specific thing they do well] is exactly the kind of creator voice we built MUSE for.

I'm reaching out from the MUSE project — we're building an AI creative team that doesn't just generate generic content. It builds a persistent memory of YOUR voice, YOUR audience patterns, and YOUR creative decisions.

Here's what makes it different:
• It learns your hook patterns and tells you which ones work (with real data, not vibes)
• It generates draft content aligned to your style — not a generic AI voice
• Nothing publishes without your explicit approval
• Every action is audited — full transparency

We're looking for 3-5 creators in the 5k-20k range to co-design this with us. Your technical audience and direct style are exactly what we want to optimize for.

Would you be open to a 20-minute call to see if it's a fit?

Best,
[MUSE Team]

P.S. — We're built on the Minds platform, so your data stays yours. No lock-in, no training on your content without consent.`,
    targetAudience: 'AI/tech YouTubers, 5k-20k subscribers',
    useCase: 'First touch — introduce MUSE and request a call',
  },
  {
    id: 'email-2-followup',
    type: 'email',
    name: 'Follow-Up — After Initial Interest',
    subject: 'Re: MUSE — next steps for your creative team',
    body: `Hi [Creator Name],

Thanks for expressing interest! Let me share what onboarding looks like:

1. **Conversation with Muse** (~15 min) — You chat with our AI orchestrator about your content style, audience, and goals. It builds your initial Creator Memory Graph.

2. **Hook Analysis** — Muse analyzes your past content to identify which hook patterns resonate with your audience. Real data, not guesses.

3. **First Draft** — Maker (our creative AI) generates a draft aligned to your voice. You review, edit, approve (or reject).

4. **Learning Loop** — As you create more, Muse learns from your decisions and content performance. Recommendations get sharper over time.

The whole process is credit-free during our co-design phase — we want your feedback, not your money.

What day works for a quick setup call?

Best,
[MUSE Team]`,
    targetAudience: 'Creators who responded to initial outreach',
    useCase: 'Follow-up after positive response',
  },
];

// ---------------------------------------------------------------------------
// DM Templates
// ---------------------------------------------------------------------------

const DM_TEMPLATES: OutreachTemplate[] = [
  {
    id: 'dm-twitter-1',
    type: 'dm_twitter',
    name: 'Twitter DM — Short Pitch',
    body: `Hey [Creator Name] 👋

Saw your [recent video/tweet] on [topic] — the way you [specific thing] is exactly what we're optimizing for with MUSE.

We built an AI creative team that actually learns your voice (not generic AI slop). It remembers your hook patterns, audience preferences, and content decisions.

Looking for creators in your range to co-design with us. 0 cost, full transparency, you stay in control.

Open to a quick chat? 🎯`,
    targetAudience: 'AI/tech Twitter creators',
    useCase: 'Short-form initial outreach on Twitter',
  },
  {
    id: 'dm-linkedin-1',
    type: 'dm_linkedin',
    name: 'LinkedIn DM — Professional Pitch',
    body: `Hi [Creator Name],

I've been following your content on [topic] — your [specific approach] is exactly the creator profile we designed MUSE for.

MUSE is an AI creative team that builds a persistent memory of your voice and style. Unlike generic AI tools, it:
• Learns which hooks work for YOUR audience (with data)
• Generates drafts in YOUR voice, not a robot's
• Never publishes without your approval

We're onboarding 3-5 creators in the 5k-20k range for co-design. Would you be interested in exploring this?

Best regards,
[MUSE Team]`,
    targetAudience: 'AI/tech professionals on LinkedIn',
    useCase: 'Professional outreach on LinkedIn',
  },
  {
    id: 'dm-discord-1',
    type: 'dm_discord',
    name: 'Discord DM — Open Campus Community',
    body: `Hey [Creator Name]! 

Saw you in the Open Campus community — your takes on [topic] are 🔥

Quick pitch: we're building MUSE, an AI creative team that actually learns your unique voice (not generic AI). It remembers your patterns, generates aligned drafts, and never auto-publishes.

Looking for creators like you to co-design with us. Zero cost during beta. Full audit trail, you stay in control.

Wanna hear more? Can share a demo or just chat about it 🤙`,
    targetAudience: 'Open Campus Discord members, AI/tech creators',
    useCase: 'Casual outreach in Open Campus Discord',
  },
];

// ---------------------------------------------------------------------------
// Onboarding Conversation with Muse
// ---------------------------------------------------------------------------

const ONBOARDING_CONVERSATION: OnboardingConversation[] = [
  {
    step: 1,
    musePrompt: 'Let\'s get to know you. What\'s your name, and what platform do you create content on?',
    expectedResponse: 'Creator provides name and primary platform',
    memoryKey: 'identity',
  },
  {
    step: 2,
    musePrompt: 'What\'s your content niche? Who is your audience — be specific (e.g., "mid-level developers interested in AI engineering")',
    expectedResponse: 'Creator describes niche and audience',
    memoryKey: 'niche_audience',
  },
  {
    step: 3,
    musePrompt: 'How would you describe your voice? Direct? Witty? Educational? And what do you avoid saying or doing?',
    expectedResponse: 'Creator describes tone, voice, and topics to avoid',
    memoryKey: 'voice_profile',
  },
  {
    step: 4,
    musePrompt: 'Share 2-3 of your best-performing pieces. What hooks or openings did you use? Why do you think they worked?',
    expectedResponse: 'Creator shares examples of successful content and hooks',
    memoryKey: 'historical_winners',
  },
  {
    step: 5,
    musePrompt: 'What\'s your biggest content challenge right now? What would help you most — ideas, hooks, scripts, scheduling?',
    expectedResponse: 'Creator shares current pain points and desired help',
    memoryKey: 'challenges_goals',
  },
  {
    step: 6,
    musePrompt: 'Perfect. I\'m locking all of this into your Creator Memory Graph. From now on, every recommendation I make will be grounded in YOUR data. Ready to create?',
    expectedResponse: 'Creator confirms — onboarding complete',
    memoryKey: 'onboarding_complete',
  },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

const FAQ = [
  {
    question: 'Does MUSE auto-publish my content?',
    answer: 'Never. Every draft requires your explicit approval before publishing. This is non-negotiable — it\'s built into the architecture with an approval gate.',
  },
  {
    question: 'Does MUSE train on my content?',
    answer: 'No. MUSE builds a Creator Memory Graph specific to you — it\'s your data, stored on-chain via the Minds platform. We don\'t use it to train models or share it with others.',
  },
  {
    question: 'What if the AI produces bad content?',
    answer: 'You can reject, modify, or ignore any recommendation. MUSE learns from your decisions — if you modify a draft, it learns WHY and adjusts future outputs. That\'s the learning loop.',
  },
  {
    question: 'How is this different from ChatGPT or Claude for content?',
    answer: 'Generic AI has no memory of YOU. Every session starts from zero. MUSE builds persistent memory — it knows your voice, your audience, your patterns. It gets better over time because it learns from your specific data.',
  },
  {
    question: 'Is there a cost during co-design?',
    answer: 'No. During our co-design phase, everything is credit-free. We want your feedback and input to shape the product. The simulator produces real output at zero cost.',
  },
  {
    question: 'Can I use my own AI models with MUSE?',
    answer: 'MUSE is built on the Minds platform, which supports different model providers. As we expand, you\'ll be able to bring your own models or configure preferred ones.',
  },
];

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function getRecruitmentPackage(): RecruitmentPackage {
  return {
    templates: [...EMAIL_TEMPLATES, ...DM_TEMPLATES],
    onboardingConversation: ONBOARDING_CONVERSATION,
    valueProposition: VALUE_PROPOSITION,
    faq: FAQ,
  };
}

export function getTemplatesByType(type: OutreachTemplate['type']): OutreachTemplate[] {
  return [...EMAIL_TEMPLATES, ...DM_TEMPLATES].filter((t) => t.type === type);
}

export function getValueProposition(): string {
  return VALUE_PROPOSITION;
}

export function getOnboardingConversation(): OnboardingConversation[] {
  return ONBOARDING_CONVERSATION;
}

export function getFAQ(): { question: string; answer: string }[] {
  return FAQ;
}
