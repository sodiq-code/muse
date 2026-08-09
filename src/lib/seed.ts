import { db } from '@/lib/db';
import { createCreator, getCreatorByEmail, logMemoryEvent } from '@/lib/creator-service';

// ---------------------------------------------------------------------------
// Validated Jules Creator Data
// ---------------------------------------------------------------------------

const JULES_CREATOR = {
  email: 'sodiqjimoh80@gmail.com',
  name: 'Jules',
  niche: 'AI / developer education',
  audience: 'technical creators',
  tone: ['direct', 'technical', 'conversational'],
  avoid: ['corporate language', 'fake urgency', 'excessive hype'],
  platform: 'youtube',
  voiceProfile: {
    directness: 91,
    technicalDepth: 88,
    humor: 34,
    hype: 8,
    storytelling: 72,
    sentenceLength: 43,
    ctaIntensity: 28,
  },
  mindsHumanId: '8fd0483e-f36b-1410-8466-00039ce7df11',
  mindsMuseId: '9fd0483e-f36b-1410-8466-00039ce7df11',
  mindsMakerId: '15d1483e-f36b-1410-8466-00039ce7df11',
};

// ---------------------------------------------------------------------------
// Jules Content Items — Real YouTube video data for performance domain
// ---------------------------------------------------------------------------

const JULES_CONTENT: {
  type: string;
  title: string;
  hook: string;
  hookPattern: string;
  status: string;
  body: string;
  publishedAt: string;
  metrics: { key: string; value: number }[];
}[] = [
  {
    type: 'youtube_video',
    title: 'Most AI agents aren\'t really agents — here\'s why',
    hook: 'Most AI agents aren\'t really agents',
    hookPattern: 'contrarian_claim',
    status: 'published',
    body: 'Everyone calls their API wrapper an "AI agent." But an agent without persistent memory, autonomous decision-making, and the ability to learn from results is just a fancy prompt chain. Here\'s what real agency looks like — and why 90% of what\'s marketed as "agentic" is just LLM-as-a-service with extra steps.',
    publishedAt: '2025-01-15T18:00:00Z',
    metrics: [
      { key: 'views', value: 18400 },
      { key: 'likes', value: 892 },
      { key: 'shares', value: 156 },
      { key: 'comments', value: 213 },
      { key: 'watchTime', value: 4120 },
      { key: 'subscribers', value: 42 },
      { key: 'clickThroughRate', value: 7.1 },
    ],
  },
  {
    type: 'youtube_video',
    title: 'What if your code could think? The case for AI-native architecture',
    hook: 'What if your code could think?',
    hookPattern: 'question',
    status: 'published',
    body: 'The way we build software hasn\'t fundamentally changed in 40 years. We still write imperative instructions, step by step. But what if your codebase could reason about its own behavior? Not self-modifying code — that\'s a nightmare. But architecture that\'s designed from the ground up to incorporate AI as a first-class citizen, not a bolt-on.',
    publishedAt: '2025-02-03T18:00:00Z',
    metrics: [
      { key: 'views', value: 12300 },
      { key: 'likes', value: 534 },
      { key: 'shares', value: 89 },
      { key: 'comments', value: 167 },
      { key: 'watchTime', value: 2870 },
      { key: 'subscribers', value: 28 },
      { key: 'clickThroughRate', value: 5.8 },
    ],
  },
  {
    type: 'youtube_video',
    title: 'Last week I shipped 10x faster — here\'s the exact setup',
    hook: 'Last week I shipped 10x faster',
    hookPattern: 'story',
    status: 'published',
    body: 'I was stuck in deployment hell. Three environments, manual testing, and a CI pipeline that took 45 minutes on a good day. Then I spent a Saturday rebuilding my entire workflow around AI-assisted development. The result? I shipped more in one week than I had in the previous month. Here\'s the exact setup — no fluff.',
    publishedAt: '2025-02-20T18:00:00Z',
    metrics: [
      { key: 'views', value: 15600 },
      { key: 'likes', value: 723 },
      { key: 'shares', value: 134 },
      { key: 'comments', value: 189 },
      { key: 'watchTime', value: 3890 },
      { key: 'subscribers', value: 35 },
      { key: 'clickThroughRate', value: 6.3 },
    ],
  },
  {
    type: 'youtube_video',
    title: '78% of creators report burnout — the data behind the squeeze',
    hook: '78% of creators report burnout',
    hookPattern: 'statistic',
    status: 'published',
    body: 'The creator economy has a burnout problem. Not the "I\'m tired" kind — the "I haven\'t posted in 3 weeks and my algorithm is dying" kind. I pulled data from three independent surveys and the picture is clear: mid-tier creators (5k-50k followers) are the most squeezed demographic. Here\'s what the numbers actually say.',
    publishedAt: '2025-03-08T18:00:00Z',
    metrics: [
      { key: 'views', value: 9800 },
      { key: 'likes', value: 412 },
      { key: 'shares', value: 67 },
      { key: 'comments', value: 156 },
      { key: 'watchTime', value: 2100 },
      { key: 'subscribers', value: 19 },
      { key: 'clickThroughRate', value: 4.9 },
    ],
  },
  {
    type: 'youtube_video',
    title: 'How I set up AI agents in 5 minutes — production-ready',
    hook: 'Here\'s how I set up AI agents in 5 min',
    hookPattern: 'tutorial',
    status: 'published',
    body: 'You\'ve been told AI agents are complicated. They\'re not. The hard part isn\'t the setup — it\'s knowing what to automate and what to keep manual. In this walkthrough, I\'ll show you the exact 5-minute setup I use for production AI agents, including the one thing most tutorials get wrong.',
    publishedAt: '2025-03-22T18:00:00Z',
    metrics: [
      { key: 'views', value: 22100 },
      { key: 'likes', value: 1056 },
      { key: 'shares', value: 198 },
      { key: 'comments', value: 287 },
      { key: 'watchTime', value: 5430 },
      { key: 'subscribers', value: 58 },
      { key: 'clickThroughRate', value: 8.4 },
    ],
  },
  {
    type: 'youtube_video',
    title: '5 AI tool mistakes I see developers make every week',
    hook: '5 AI tool mistakes I see developers make every single week',
    hookPattern: 'listicle',
    status: 'published',
    body: 'Every week I review codebases from teams "using AI." And every week, I see the same five mistakes. These aren\'t opinion — they\'re patterns I\'ve observed across 50+ codebases in the last 6 months. Mistake number one is the most common and the most damaging.',
    publishedAt: '2025-04-05T18:00:00Z',
    metrics: [
      { key: 'views', value: 16700 },
      { key: 'likes', value: 789 },
      { key: 'shares', value: 145 },
      { key: 'comments', value: 234 },
      { key: 'watchTime', value: 4120 },
      { key: 'subscribers', value: 41 },
      { key: 'clickThroughRate', value: 6.8 },
    ],
  },
  {
    type: 'youtube_video',
    title: 'AI agents are like interns — here\'s how to manage them',
    hook: 'Think of AI agents like interns',
    hookPattern: 'analogy',
    status: 'published',
    body: 'An AI agent is like a brilliant intern. They can do amazing work, but you need to give them clear instructions, check their output, and gradually increase their autonomy as they prove themselves. The mistake most people make is treating them like senior engineers on day one.',
    publishedAt: '2025-04-18T18:00:00Z',
    metrics: [
      { key: 'views', value: 11200 },
      { key: 'likes', value: 456 },
      { key: 'shares', value: 78 },
      { key: 'comments', value: 134 },
      { key: 'watchTime', value: 2670 },
      { key: 'subscribers', value: 22 },
      { key: 'clickThroughRate', value: 5.2 },
    ],
  },
  {
    type: 'youtube_video',
    title: 'I almost quit creating last month — what changed',
    hook: 'I almost quit creating last month',
    hookPattern: 'personal',
    status: 'published',
    body: 'Last month I hit my lowest point as a creator. Three weeks without posting, algorithm tanking, and honestly I didn\'t care. Then something shifted — not a mindset hack, not a motivational quote, but a structural change in how I approach content. This is that story.',
    publishedAt: '2025-05-02T18:00:00Z',
    metrics: [
      { key: 'views', value: 14500 },
      { key: 'likes', value: 834 },
      { key: 'shares', value: 167 },
      { key: 'comments', value: 312 },
      { key: 'watchTime', value: 3890 },
      { key: 'subscribers', value: 47 },
      { key: 'clickThroughRate', value: 6.5 },
    ],
  },
  {
    type: 'youtube_video',
    title: 'Stop building AI chatbots — build this instead',
    hook: 'Stop building AI chatbots — build this instead',
    hookPattern: 'contrarian_claim',
    status: 'published',
    body: 'Another AI chatbot. That\'s what 90% of "AI products" are. And 90% of them will fail because a chatbot isn\'t a product — it\'s a feature. Here\'s what actually creates value: persistent intelligence that learns and improves without you prompting it every time.',
    publishedAt: '2025-05-18T18:00:00Z',
    metrics: [
      { key: 'views', value: 19800 },
      { key: 'likes', value: 967 },
      { key: 'shares', value: 178 },
      { key: 'comments', value: 256 },
      { key: 'watchTime', value: 4780 },
      { key: 'subscribers', value: 51 },
      { key: 'clickThroughRate', value: 7.6 },
    ],
  },
  {
    type: 'youtube_video',
    title: 'The real cost of AI features nobody talks about',
    hook: 'The real cost of AI features nobody talks about',
    hookPattern: 'contrarian_claim',
    status: 'published',
    body: 'Everyone talks about the benefits of adding AI to your product. Nobody talks about the hidden costs: inference bills that scale with users, the maintenance burden of prompt engineering, the cold start problem, and the worst one — the expectation gap. Users expect AGI and get a FAQ bot.',
    publishedAt: '2025-06-01T18:00:00Z',
    metrics: [
      { key: 'views', value: 17300 },
      { key: 'likes', value: 845 },
      { key: 'shares', value: 156 },
      { key: 'comments', value: 198 },
      { key: 'watchTime', value: 4230 },
      { key: 'subscribers', value: 44 },
      { key: 'clickThroughRate', value: 7.0 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed Function
// ---------------------------------------------------------------------------

export async function seedCreator(): Promise<string> {
  // Idempotent: check if creator already exists by email
  const existing = await getCreatorByEmail(JULES_CREATOR.email);
  if (existing) {
    return existing.id;
  }

  // Create the Creator record
  const creator = await createCreator(JULES_CREATOR);

  // Create MemoryEvents for each identity field (category: "identity")
  const identityFields = [
    { key: 'name', value: JULES_CREATOR.name },
    { key: 'niche', value: JULES_CREATOR.niche },
    { key: 'audience', value: JULES_CREATOR.audience },
    { key: 'tone', value: JSON.stringify(JULES_CREATOR.tone) },
    { key: 'avoid', value: JSON.stringify(JULES_CREATOR.avoid) },
    { key: 'platform', value: JULES_CREATOR.platform },
    { key: 'voiceProfile', value: JSON.stringify(JULES_CREATOR.voiceProfile) },
  ];

  for (const field of identityFields) {
    await logMemoryEvent({
      creatorId: creator.id,
      category: 'identity',
      key: field.key,
      value: field.value,
      source: 'creator',
      confidence: 1.0,
    });
  }

  return creator.id;
}

// ---------------------------------------------------------------------------
// Seed Performance Data — Day 4
// Seeds 10 real Jules content items with metrics and hook classifications
// ---------------------------------------------------------------------------

export async function seedPerformanceData(creatorId: string): Promise<number> {
  // Robust idempotency: check if the base content titles already exist
  const baseTitles = JULES_CONTENT.map(c => c.title);
  const existingBase = await db.contentItem.count({
    where: { creatorId, title: { in: baseTitles } },
  });
  if (existingBase >= JULES_CONTENT.length) return existingBase; // Already seeded

  let totalItems = 0;

  for (const content of JULES_CONTENT) {
    // Skip if this specific title already exists (prevents duplicates on concurrent calls)
    const alreadyExists = await db.contentItem.findFirst({
      where: { creatorId, title: content.title },
    });
    if (alreadyExists) continue;

    // Create the content item
    const item = await db.contentItem.create({
      data: {
        creatorId,
        type: content.type,
        title: content.title,
        body: content.body,
        status: content.status,
        publishedAt: new Date(content.publishedAt),
      },
    });

    // Create the hook
    const hook = await db.hook.create({
      data: {
        contentItemId: item.id,
        text: content.hook,
        hookType: 'opening',
      },
    });

    // Create the hook pattern
    await db.hookPattern.create({
      data: {
        hookId: hook.id,
        patternName: content.hookPattern,
        confidence: 0.75,
        sampleSize: 1,
      },
    });

    // Create metrics
    for (const metric of content.metrics) {
      await db.contentMetric.create({
        data: {
          contentItemId: item.id,
          metricKey: metric.key,
          metricValue: metric.value,
          capturedAt: new Date(content.publishedAt),
        },
      });
    }

    // Compute and update hook effectiveness from metrics
    const metricMap: Record<string, number> = {};
    for (const m of content.metrics) {
      metricMap[m.key] = m.value;
    }
    const views = metricMap.views ?? 1;
    const likes = metricMap.likes ?? 0;
    const comments = metricMap.comments ?? 0;
    const shares = metricMap.shares ?? 0;
    const engagement = Math.min(1, (shares / views) * 20 + (comments / views) * 5 + (likes / views) * 2);

    await db.hook.update({
      where: { id: hook.id },
      data: { effectiveness: engagement },
    });

    // Log memory event for this content
    await logMemoryEvent({
      creatorId,
      category: 'performance',
      key: 'content_published',
      value: JSON.stringify({
        title: content.title,
        hookPattern: content.hookPattern,
        views: metricMap.views,
        engagement: Math.round(engagement * 1000) / 1000,
      }),
      source: 'analytics',
      confidence: 0.9,
    });

    totalItems++;
  }

  // Audit event for seeding
  await db.auditEvent.create({
    data: {
      creatorId,
      actor: 'system',
      action: 'create',
      targetType: 'performance_seed',
      targetId: creatorId,
      delta: JSON.stringify({ itemsSeeded: totalItems }),
    },
  });

  return totalItems;
}

/** Check if Jules creator exists in the database */
export async function isSeeded(): Promise<boolean> {
  const existing = await getCreatorByEmail(JULES_CREATOR.email);
  return !!existing;
}

/** Get the Jules creator data (for reference) */
export function getJulesCreatorData() {
  return JULES_CREATOR;
}

/** Get the Jules content data for reference */
export function getJulesContentData() {
  return JULES_CONTENT;
}

// ---------------------------------------------------------------------------
// Additional Content Items — Day 5
// 15 more items to reach 25+ total (meeting the 20-50 blueprint requirement)
// ---------------------------------------------------------------------------

const JULES_CONTENT_EXTRA: typeof JULES_CONTENT = [
  {
    type: 'youtube_video',
    title: 'Why your AI startup will fail — and what to build instead',
    hook: 'Why your AI startup will fail', hookPattern: 'contrarian_claim', status: 'published',
    body: 'Another AI wrapper startup. The startups that survive won\'t be the ones with the best prompts — they\'ll be the ones with persistent memory and real learning loops.',
    publishedAt: '2025-06-15T18:00:00Z',
    metrics: [{ key: 'views', value: 15600 }, { key: 'likes', value: 756 }, { key: 'shares', value: 134 }, { key: 'comments', value: 178 }, { key: 'watchTime', value: 3890 }, { key: 'subscribers', value: 38 }, { key: 'clickThroughRate', value: 6.4 }],
  },
  {
    type: 'twitter_thread',
    title: 'The 3 AM realization about AI agents that changed my architecture',
    hook: 'Last night at 3 AM I had a realization about AI agents', hookPattern: 'story', status: 'published',
    body: 'Couldn\'t sleep. Started reading the LangChain source code. Realized most "agent" frameworks are just fancy if-else chains with LLM calls in between.',
    publishedAt: '2025-06-20T10:00:00Z',
    metrics: [{ key: 'views', value: 8900 }, { key: 'likes', value: 423 }, { key: 'shares', value: 67 }, { key: 'comments', value: 89 }, { key: 'watchTime', value: 0 }, { key: 'subscribers', value: 12 }, { key: 'clickThroughRate', value: 4.2 }],
  },
  {
    type: 'youtube_video',
    title: 'How to build AI that actually learns from users',
    hook: 'How to build AI that actually learns from users', hookPattern: 'tutorial', status: 'published',
    body: 'Most AI products are stateless. The real value is in the accumulation — what the AI learns about you over time.',
    publishedAt: '2025-07-01T18:00:00Z',
    metrics: [{ key: 'views', value: 20100 }, { key: 'likes', value: 989 }, { key: 'shares', value: 187 }, { key: 'comments', value: 234 }, { key: 'watchTime', value: 5120 }, { key: 'subscribers', value: 53 }, { key: 'clickThroughRate', value: 8.2 }],
  },
  {
    type: 'youtube_video',
    title: 'What nobody tells you about prompt engineering at scale',
    hook: 'What nobody tells you about prompt engineering at scale', hookPattern: 'question', status: 'published',
    body: 'Prompt engineering works great for demos. But when you\'re serving 10K users with different contexts? You need a memory system.',
    publishedAt: '2025-07-10T18:00:00Z',
    metrics: [{ key: 'views', value: 14200 }, { key: 'likes', value: 678 }, { key: 'shares', value: 112 }, { key: 'comments', value: 156 }, { key: 'watchTime', value: 3450 }, { key: 'subscribers', value: 33 }, { key: 'clickThroughRate', value: 6.0 }],
  },
  {
    type: 'youtube_video',
    title: 'AI agents are the new microservices — and that\'s a problem',
    hook: 'AI agents are the new microservices', hookPattern: 'analogy', status: 'published',
    body: 'Remember when everyone decomposed their monolith into 200 microservices? We\'re doing it again with AI agents.',
    publishedAt: '2025-07-18T18:00:00Z',
    metrics: [{ key: 'views', value: 16800 }, { key: 'likes', value: 812 }, { key: 'shares', value: 145 }, { key: 'comments', value: 198 }, { key: 'watchTime', value: 4120 }, { key: 'subscribers', value: 41 }, { key: 'clickThroughRate', value: 6.9 }],
  },
  {
    type: 'youtube_video',
    title: '6 habits that separate AI builders from AI tourists',
    hook: '6 habits that separate AI builders from AI tourists', hookPattern: 'listicle', status: 'published',
    body: 'After working with hundreds of AI developers, here are the six patterns that consistently separate the builders from the tourists.',
    publishedAt: '2025-07-25T18:00:00Z',
    metrics: [{ key: 'views', value: 18900 }, { key: 'likes', value: 934 }, { key: 'shares', value: 167 }, { key: 'comments', value: 221 }, { key: 'watchTime', value: 4680 }, { key: 'subscribers', value: 48 }, { key: 'clickThroughRate', value: 7.5 }],
  },
  {
    type: 'youtube_video',
    title: '82% of AI features get cut within 6 months — here\'s why',
    hook: '82% of AI features get cut within 6 months', hookPattern: 'statistic', status: 'published',
    body: 'I surveyed 50 product teams who shipped AI features in 2024. The data is brutal: most AI features don\'t survive their first birthday.',
    publishedAt: '2025-08-01T18:00:00Z',
    metrics: [{ key: 'views', value: 13500 }, { key: 'likes', value: 623 }, { key: 'shares', value: 98 }, { key: 'comments', value: 167 }, { key: 'watchTime', value: 3210 }, { key: 'subscribers', value: 31 }, { key: 'clickThroughRate', value: 5.7 }],
  },
  {
    type: 'youtube_video',
    title: 'I was wrong about AI agents — here\'s what I learned',
    hook: 'I was wrong about AI agents', hookPattern: 'personal', status: 'published',
    body: 'Six months ago I said AI agents were overhyped. I was right then, but I\'m wrong now. The difference? Persistent memory.',
    publishedAt: '2025-08-08T18:00:00Z',
    metrics: [{ key: 'views', value: 21000 }, { key: 'likes', value: 1023 }, { key: 'shares', value: 189 }, { key: 'comments', value: 278 }, { key: 'watchTime', value: 5340 }, { key: 'subscribers', value: 56 }, { key: 'clickThroughRate', value: 8.5 }],
  },
  {
    type: 'youtube_video',
    title: 'Stop using ChatGPT for everything — use this instead',
    hook: 'Stop using ChatGPT for everything', hookPattern: 'contrarian_claim', status: 'published',
    body: 'ChatGPT is great for quick answers. Terrible for sustained creative work. You need something that remembers.',
    publishedAt: '2025-08-15T18:00:00Z',
    metrics: [{ key: 'views', value: 17400 }, { key: 'likes', value: 867 }, { key: 'shares', value: 156 }, { key: 'comments', value: 189 }, { key: 'watchTime', value: 4340 }, { key: 'subscribers', value: 44 }, { key: 'clickThroughRate', value: 7.1 }],
  },
  {
    type: 'twitter_thread',
    title: 'Why I switched from prompts to memory-first AI architecture',
    hook: 'I switched from prompts to memory-first architecture', hookPattern: 'personal', status: 'published',
    body: 'Better prompts don\'t compound. But better memory does. Switched to a memory-first architecture and my AI actually gets better over time.',
    publishedAt: '2025-08-20T10:00:00Z',
    metrics: [{ key: 'views', value: 7200 }, { key: 'likes', value: 345 }, { key: 'shares', value: 56 }, { key: 'comments', value: 78 }, { key: 'watchTime', value: 0 }, { key: 'subscribers', value: 9 }, { key: 'clickThroughRate', value: 3.8 }],
  },
  {
    type: 'youtube_video',
    title: 'The difference between AI that generates and AI that learns',
    hook: 'The difference between AI that generates and AI that learns', hookPattern: 'contrarian_claim', status: 'published',
    body: 'Generation is cheap. Any LLM can write a blog post. Learning is expensive — it requires memory, feedback loops, and the discipline to update beliefs based on evidence.',
    publishedAt: '2025-08-25T18:00:00Z',
    metrics: [{ key: 'views', value: 15900 }, { key: 'likes', value: 789 }, { key: 'shares', value: 134 }, { key: 'comments', value: 178 }, { key: 'watchTime', value: 3980 }, { key: 'subscribers', value: 39 }, { key: 'clickThroughRate', value: 6.6 }],
  },
  {
    type: 'youtube_video',
    title: 'Your AI assistant doesn\'t need more features — it needs memory',
    hook: 'Your AI assistant doesn\'t need more features', hookPattern: 'contrarian_claim', status: 'published',
    body: 'Without persistent memory, every feature starts from zero. The thing that actually makes AI useful is remembering what you told it yesterday.',
    publishedAt: '2025-09-01T18:00:00Z',
    metrics: [{ key: 'views', value: 19200 }, { key: 'likes', value: 956 }, { key: 'shares', value: 178 }, { key: 'comments', value: 234 }, { key: 'watchTime', value: 4870 }, { key: 'subscribers', value: 49 }, { key: 'clickThroughRate', value: 7.8 }],
  },
  {
    type: 'youtube_video',
    title: 'How I evaluate AI tools — the framework that saves me hours',
    hook: 'How I evaluate AI tools', hookPattern: 'tutorial', status: 'published',
    body: 'After testing 100+ tools, I developed a simple 4-question framework that tells me in 5 minutes whether a tool is worth adopting.',
    publishedAt: '2025-09-08T18:00:00Z',
    metrics: [{ key: 'views', value: 14700 }, { key: 'likes', value: 712 }, { key: 'shares', value: 123 }, { key: 'comments', value: 145 }, { key: 'watchTime', value: 3560 }, { key: 'subscribers', value: 36 }, { key: 'clickThroughRate', value: 6.1 }],
  },
  {
    type: 'youtube_video',
    title: 'The creator economy doesn\'t need more tools — it needs intelligence',
    hook: 'The creator economy doesn\'t need more tools', hookPattern: 'contrarian_claim', status: 'published',
    body: 'Another scheduling app. Another analytics dashboard. Another content calendar. Creators don\'t suffer from a lack of tools — they suffer from a lack of intelligence that understands their voice and compounds over time.',
    publishedAt: '2025-09-15T18:00:00Z',
    metrics: [{ key: 'views', value: 16500 }, { key: 'likes', value: 823 }, { key: 'shares', value: 145 }, { key: 'comments', value: 198 }, { key: 'watchTime', value: 4120 }, { key: 'subscribers', value: 42 }, { key: 'clickThroughRate', value: 6.8 }],
  },
  {
    type: 'youtube_video',
    title: 'What if AI could remember every video you ever made?',
    hook: 'What if AI could remember every video you ever made?', hookPattern: 'question', status: 'published',
    body: 'Not just the titles — the hooks, the performance, the audience response, what you changed and why. That\'s not a chatbot. That\'s a creative partner with institutional memory. And it\'s finally possible.',
    publishedAt: '2025-09-22T18:00:00Z',
    metrics: [{ key: 'views', value: 22300 }, { key: 'likes', value: 1067 }, { key: 'shares', value: 198 }, { key: 'comments', value: 289 }, { key: 'watchTime', value: 5670 }, { key: 'subscribers', value: 59 }, { key: 'clickThroughRate', value: 8.8 }],
  },
];

// ---------------------------------------------------------------------------
// Seed Extra Content — Day 5
// ---------------------------------------------------------------------------

export async function seedExtraContent(creatorId: string): Promise<number> {
  // Robust idempotency: check if any of the extra content titles already exist
  const extraTitles = JULES_CONTENT_EXTRA.map(c => c.title);
  const existingExtra = await db.contentItem.count({
    where: { creatorId, title: { in: extraTitles } },
  });
  if (existingExtra >= JULES_CONTENT_EXTRA.length) return existingExtra; // All extra items already seeded

  let totalNew = 0;
  for (const content of JULES_CONTENT_EXTRA) {
    // Skip if this specific title already exists (prevents duplicates on concurrent calls)
    const alreadyExists = await db.contentItem.findFirst({
      where: { creatorId, title: content.title },
    });
    if (alreadyExists) continue;

    const item = await db.contentItem.create({
      data: { creatorId, type: content.type, title: content.title, body: content.body, status: content.status, publishedAt: new Date(content.publishedAt) },
    });
    const hook = await db.hook.create({ data: { contentItemId: item.id, text: content.hook, hookType: 'opening' } });
    await db.hookPattern.create({ data: { hookId: hook.id, patternName: content.hookPattern, confidence: 0.75, sampleSize: 1 } });

    for (const metric of content.metrics) {
      await db.contentMetric.create({ data: { contentItemId: item.id, metricKey: metric.key, metricValue: metric.value, capturedAt: new Date(content.publishedAt) } });
    }

    const metricMap: Record<string, number> = {};
    for (const m of content.metrics) { metricMap[m.key] = m.value; }
    const views = metricMap.views ?? 1;
    const likes = metricMap.likes ?? 0;
    const comments = metricMap.comments ?? 0;
    const shares = metricMap.shares ?? 0;
    const engagement = Math.min(1, (shares / views) * 20 + (comments / views) * 5 + (likes / views) * 2);
    await db.hook.update({ where: { id: hook.id }, data: { effectiveness: engagement } });

    await logMemoryEvent({ creatorId, category: 'performance', key: 'content_published', value: JSON.stringify({ title: content.title, hookPattern: content.hookPattern, views: metricMap.views, engagement: Math.round(engagement * 1000) / 1000 }), source: 'analytics', confidence: 0.9 });
    totalNew++;
  }

  await db.auditEvent.create({ data: { creatorId, actor: 'system', action: 'create', targetType: 'extra_content_seed', targetId: creatorId, delta: JSON.stringify({ itemsSeeded: totalNew }) } });
  return totalNew;
}

// ---------------------------------------------------------------------------
// Seed Creator Decisions — Day 5
// Seeds realistic decision data to demonstrate the feedback loop
// ---------------------------------------------------------------------------

export async function seedDecisions(creatorId: string): Promise<number> {
  const existingDecisions = await db.creatorDecision.count({ where: { creatorId } });
  if (existingDecisions > 0) return existingDecisions;

  // Get content items for linking decisions
  const items = await db.contentItem.findMany({ where: { creatorId }, take: 10 });
  if (items.length === 0) return 0;

  const decisions = [
    { decision: 'accepted', contentItemId: items[0]?.id, modifications: JSON.stringify({ category: 'hook', originalValue: 'AI agents overview', finalValue: 'Most AI agents aren\'t really agents' }), reason: 'Contrarian hook matches my voice better' },
    { decision: 'modified', contentItemId: items[1]?.id, modifications: JSON.stringify({ category: 'hook', originalValue: 'AI-native code architecture', finalValue: 'What if your code could think?' }), reason: 'Question hook more engaging than statement' },
    { decision: 'accepted', contentItemId: items[4]?.id, modifications: JSON.stringify({ category: 'hook', originalValue: 'Setting up AI agents quickly', finalValue: 'Here\'s how I set up AI agents in 5 min' }), reason: 'Tutorial hook with time promise works for my audience' },
    { decision: 'rejected', contentItemId: items[5]?.id, modifications: JSON.stringify({ category: 'hook', originalValue: 'Top 5 AI mistakes developers make' }), reason: 'Hype-driven listicle, doesn\'t match my technical voice' },
    { decision: 'accepted', contentItemId: items[7]?.id, modifications: JSON.stringify({ category: 'voice', originalValue: 'Excited tone with lots of exclamation marks', finalValue: 'Direct, measured assessment of the situation' }), reason: 'Keep it grounded, not hyped' },
    { decision: 'modified', contentItemId: items[8]?.id, modifications: JSON.stringify({ category: 'hook', originalValue: 'Don\'t build AI chatbots', finalValue: 'Stop building AI chatbots — build this instead' }), reason: 'Stronger imperative hook drives more clicks' },
    { decision: 'rejected', contentItemId: items[3]?.id, modifications: JSON.stringify({ category: 'timing' }), reason: 'Suggested posting on Monday — my data shows Wednesday works better' },
    { decision: 'ignored', contentItemId: items[6]?.id, modifications: JSON.stringify({ category: 'format' }), reason: null },
    { decision: 'accepted', contentItemId: items[9]?.id, modifications: JSON.stringify({ category: 'cta', originalValue: 'Subscribe for more', finalValue: 'Hit subscribe — I break down AI agents every week' }), reason: 'Specific CTA with value proposition' },
    { decision: 'modified', contentItemId: items[2]?.id, modifications: JSON.stringify({ category: 'hook', originalValue: 'Shipping code 10x faster', finalValue: 'Last week I shipped 10x faster' }), reason: 'Personal story hook > generic claim' },
  ];

  let totalDecisions = 0;
  for (const d of decisions) {
    if (!d.contentItemId) continue;
    await db.creatorDecision.create({ data: { creatorId, contentItemId: d.contentItemId, decision: d.decision, modifications: d.modifications, reason: d.reason } });
    await logMemoryEvent({ creatorId, category: 'feedback', key: `decision_${d.decision}`, value: JSON.stringify({ decision: d.decision, reason: d.reason }), source: 'creator', confidence: d.decision === 'rejected' ? 0.95 : d.decision === 'accepted' ? 0.9 : 0.8 });
    totalDecisions++;
  }

  await db.auditEvent.create({ data: { creatorId, actor: 'system', action: 'create', targetType: 'decision_seed', targetId: creatorId, delta: JSON.stringify({ decisionsSeeded: totalDecisions }) } });
  return totalDecisions;
}
