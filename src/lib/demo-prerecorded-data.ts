// ============================================================================
// Demo Pre-Recorded Data — Day 19
// Complete pre-recorded data for all 10 demo scenes from the 90-second demo script.
// ALL data is clearly labeled isSimulation: true and source: 'prerecorded'.
// This is NEVER hidden from the user.
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConversationTurn {
  role: 'user' | 'muse' | 'maker' | 'narrator';
  message: string;
  timestamp: string;         // ISO string relative to scene start
  source: 'prerecorded';
  isSimulation: true;
}

export interface DataSnapshot {
  memoryEvents: number;
  recommendations: number;
  draftsCompleted: number;
  voiceScore: number;        // 0-100
  hookScore: number;         // 0-100
  learningCycles: number;
  overnightRuns: number;
  approvalRate: number;      // 0-100
  isSimulation: true;
  source: 'prerecorded';
}

export interface DemoScene {
  sceneId: string;
  sceneName: string;
  sceneNumber: number;       // 1-10
  durationMs: number;        // How long this scene plays
  emotionalArc: 'neutral' | 'curious' | 'hopeful' | 'tense' | 'triumphant' | 'reflective' | 'inspiring';
  narration: string;         // What happens (voiceover text)
  conversationTurns: ConversationTurn[];
  dataSnapshot: DataSnapshot;
  isSimulation: true;
  source: 'prerecorded';
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function ts(seconds: number): string {
  return new Date(seconds * 1000).toISOString().replace(/.*T/, '').replace(/Z/, '');
}

function turn(
  role: ConversationTurn['role'],
  message: string,
  seconds: number,
): ConversationTurn {
  return { role, message, timestamp: ts(seconds), source: 'prerecorded', isSimulation: true };
}

function snapshot(overrides: Partial<DataSnapshot> = {}): DataSnapshot {
  return {
    memoryEvents: 0,
    recommendations: 0,
    draftsCompleted: 0,
    voiceScore: 0,
    hookScore: 0,
    learningCycles: 0,
    overnightRuns: 0,
    approvalRate: 0,
    isSimulation: true,
    source: 'prerecorded',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Scene 1: Jules opens Muse on phone
// ---------------------------------------------------------------------------

const SCENE_1: DemoScene = {
  sceneId: 'demo-scene-1',
  sceneName: 'Opening — Jules opens Muse',
  sceneNumber: 1,
  durationMs: 8000,
  emotionalArc: 'neutral',
  narration: 'It\'s 6 PM. Jules has just finished recording a video. He opens Muse on his phone to check in before going offline for the night.',
  conversationTurns: [
    turn('narrator', 'Jules finishes recording. Opens Muse.', 0),
    turn('user', 'Hey Muse, just wrapped up today\'s video. What do you have for me?', 2),
    turn('muse', 'Welcome back, Jules. I\'ve been tracking your content patterns while you were creating. Here\'s your evening briefing.', 4),
    turn('muse', 'Your last 3 videos averaged 12% better retention than the week before. The "direct contrarian" hook pattern continues to outperform. Ready to plan tonight\'s offline session?', 6),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 47,
    recommendations: 5,
    draftsCompleted: 12,
    voiceScore: 88,
    hookScore: 82,
    learningCycles: 6,
    overnightRuns: 3,
    approvalRate: 85,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// Scene 2: Memory screen (voice, audience, winning hooks)
// ---------------------------------------------------------------------------

const SCENE_2: DemoScene = {
  sceneId: 'demo-scene-2',
  sceneName: 'Memory — What Muse knows about Jules',
  sceneNumber: 2,
  durationMs: 10000,
  emotionalArc: 'curious',
  narration: 'Muse shows Jules the Memory screen — everything it has learned about his voice, audience, and winning content patterns. This is the foundation that makes Muse different from a chatbot.',
  conversationTurns: [
    turn('narrator', 'Muse displays the Memory screen.', 0),
    turn('muse', 'Here\'s what I know about you, Jules:', 1),
    turn('muse', '🎙️ Voice: Direct, technical, no fluff. You lead with evidence, not hype.', 2.5),
    turn('muse', '👥 Audience: 73% technical creators, 27% curious beginners. They value depth over breadth.', 4),
    turn('muse', '🏆 Winning Hooks: "Contrarian claim" pattern — 72% retention rate across 8 posts. Your audience loves when you challenge conventional wisdom.', 6),
    turn('muse', '📈 Top performers: "Why X is wrong" format (91% hook score), tutorial deep-dives (84%), architecture breakdowns (79%).', 8),
    turn('user', 'That hook pattern is spot on. It\'s what I naturally gravitate toward.', 9),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 47,
    recommendations: 5,
    draftsCompleted: 12,
    voiceScore: 88,
    hookScore: 82,
    learningCycles: 6,
    overnightRuns: 3,
    approvalRate: 85,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// Scene 3: Jules says "I'm going offline"
// ---------------------------------------------------------------------------

const SCENE_3: DemoScene = {
  sceneId: 'demo-scene-3',
  sceneName: 'Going Offline — Jules sets the boundary',
  sceneNumber: 3,
  durationMs: 7000,
  emotionalArc: 'hopeful',
  narration: 'Jules tells Muse he\'s going offline for the night. This is the key moment — Muse doesn\'t just say goodbye. It prepares to work while Jules rests.',
  conversationTurns: [
    turn('user', 'I\'m going offline now. See you tomorrow.', 0),
    turn('muse', 'Got it, Jules. I\'ll be here while you rest.', 2),
    turn('muse', 'Tonight I\'ll: draft tomorrow\'s content, test 3 hook variations, and refine your voice model based on the latest performance data. Everything will be ready for your morning review.', 4),
    turn('narrator', 'Jules closes his phone. Muse enters autonomous mode.', 6),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 48,
    recommendations: 6,
    draftsCompleted: 12,
    voiceScore: 88,
    hookScore: 82,
    learningCycles: 6,
    overnightRuns: 3,
    approvalRate: 85,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// Scene 4: Clock 22:00 → Mind Theatre begins
// ---------------------------------------------------------------------------

const SCENE_4: DemoScene = {
  sceneId: 'demo-scene-4',
  sceneName: 'Mind Theatre — 22:00, Muse goes to work',
  sceneNumber: 4,
  durationMs: 9000,
  emotionalArc: 'tense',
  narration: 'The clock strikes 22:00. Mind Theatre begins. Muse and Maker collaborate autonomously — Muse orchestrates, Maker executes. This is the overnight loop that produces real creative work while Jules sleeps.',
  conversationTurns: [
    turn('narrator', 'Clock: 22:00. Mind Theatre begins.', 0),
    turn('muse', '[Autonomous] Initiating overnight session. Topic: "Why your CI/CD pipeline is lying to you". Audience: technical creators. Objective: maximum retention.', 2),
    turn('muse', '[Autonomous → Maker] Generate structured instruction: voice=direct, pace=fast, hook=contrarian_claim, historicalWinners=["Why X is wrong", "debugging strategies", "architecture decisions"]', 4),
    turn('maker', '[Autonomous] Instruction received. Generating draft with contrarian hook, evidence-first body, direct CTA. Voice match target: 94%.', 6),
    turn('narrator', 'Muse and Maker cycle through 3 iterations, refining each time. All drafts queued for morning review.', 8),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 48,
    recommendations: 6,
    draftsCompleted: 12,
    voiceScore: 88,
    hookScore: 82,
    learningCycles: 6,
    overnightRuns: 4,
    approvalRate: 85,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// Scene 5: Muse delegates to Maker (structured instruction)
// ---------------------------------------------------------------------------

const SCENE_5: DemoScene = {
  sceneId: 'demo-scene-5',
  sceneName: 'Delegation — Muse instructs Maker with precision',
  sceneNumber: 5,
  durationMs: 8000,
  emotionalArc: 'curious',
  narration: 'Close-up on the delegation. Muse doesn\'t just say "make content" — it sends a structured instruction with voice, audience, winning hooks, and constraints. Maker receives this like a creative brief.',
  conversationTurns: [
    turn('muse', '[Delegation] Structured instruction to Maker:', 0),
    turn('muse', '  creator: Jules\n  topic: "CI/CD pipeline reliability"\n  objective: "Build trust through contrarian insight"\n  audience: "technical creators and developers"\n  voice: { tone: direct, pace: fast, vocabulary: technical }\n  historicalWinners: ["Why X is wrong" (91% hook), "debugging strategies" (84%), "architecture decisions" (79%)]\n  constraint: "No hype. Lead with evidence."', 3),
    turn('maker', 'Instruction parsed. Running content generation with:\n  - Primary hook: contrarian_claim\n  - Voice alignment: targeting 94%\n  - Hook compatibility: 91% (based on 8 historical winners)\n  - Generating full script + caption + title + CTA', 6),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 48,
    recommendations: 7,
    draftsCompleted: 12,
    voiceScore: 88,
    hookScore: 82,
    learningCycles: 6,
    overnightRuns: 4,
    approvalRate: 85,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// Scene 6: Maker returns; Muse evaluates (Voice 94%, Hook 91%)
// ---------------------------------------------------------------------------

const SCENE_6: DemoScene = {
  sceneId: 'demo-scene-6',
  sceneName: 'Evaluation — Muse quality-checks Maker\'s output',
  sceneNumber: 6,
  durationMs: 9000,
  emotionalArc: 'triumphant',
  narration: 'Maker returns the draft. Muse evaluates it rigorously — checking voice alignment, hook quality, and content structure. The scores: Voice 94%, Hook 91%. This isn\'t blind delegation. Muse holds the standard.',
  conversationTurns: [
    turn('maker', 'Draft complete:\n  Title: "Why Your CI/CD Pipeline Is Lying To You"\n  Hook: "Everyone says their CI/CD is automated. 73% of pipelines have a manual gate nobody talks about."\n  Script: [full script with hook → context → proof → framework → CTA]\n  Voice match: 94% | Hook compatibility: 91%', 0),
    turn('muse', '[Evaluation] Running quality assessment...', 3),
    turn('muse', '[Evaluation] Voice alignment: 94% ✅ — Direct tone, technical vocabulary, no fluff detected.\nHook quality: 91% ✅ — Contrarian claim pattern, evidence-backed, matches historical winners.\nStructure: PASS ✅ — Hook → Context → Proof → Framework → CTA intact.\nAudience fit: PASS ✅ — Technical depth appropriate.', 5),
    turn('muse', '[Evaluation] Draft approved for morning review. Queued.', 7),
    turn('narrator', 'The draft passes Muse\'s quality gate. It\'s not just "good enough" — it meets Jules\' standards.', 8),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 48,
    recommendations: 7,
    draftsCompleted: 13,
    voiceScore: 94,
    hookScore: 91,
    learningCycles: 6,
    overnightRuns: 4,
    approvalRate: 85,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// Scene 7: 06:00 → "Good morning. I worked while you were offline."
// ---------------------------------------------------------------------------

const SCENE_7: DemoScene = {
  sceneId: 'demo-scene-7',
  sceneName: 'Morning — Muse delivers the overnight results',
  sceneNumber: 7,
  durationMs: 9000,
  emotionalArc: 'hopeful',
  narration: '6 AM. Jules opens his phone. Muse greets him with the results of the overnight session — a draft ready to review, refined hooks, and updated voice model. This is the magic moment.',
  conversationTurns: [
    turn('narrator', 'Clock: 06:00. Jules opens Muse.', 0),
    turn('muse', 'Good morning, Jules. I worked while you were offline.', 2),
    turn('muse', 'Here\'s what I accomplished overnight:', 3),
    turn('muse', '📝 1 draft ready for review: "Why Your CI/CD Pipeline Is Lying To You"\n🪝 3 hook variations tested — contrarian claim won at 91%\n🎙️ Voice model refined — your "direct + technical" pattern is now 94% consistent\n📊 Performance from yesterday: 12% retention improvement', 5),
    turn('muse', 'The draft is in your Control screen. Approve, edit, or reject — your call.', 7),
    turn('user', 'Let me check it out.', 8),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 52,
    recommendations: 7,
    draftsCompleted: 13,
    voiceScore: 94,
    hookScore: 91,
    learningCycles: 7,
    overnightRuns: 4,
    approvalRate: 85,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// Scene 8: Persistence beat — "Why this hook?" → cites 8 posts, 72% retention, 2 approvals
// ---------------------------------------------------------------------------

const SCENE_8: DemoScene = {
  sceneId: 'demo-scene-8',
  sceneName: 'Persistence — "Why this hook?" Muse explains its reasoning',
  sceneNumber: 8,
  durationMs: 10000,
  emotionalArc: 'reflective',
  narration: 'Jules asks "Why this hook?" — and Muse doesn\'t just answer. It cites 8 posts, 72% average retention, and 2 explicit approvals from Jules. This is persistence: Muse remembers, and proves it.',
  conversationTurns: [
    turn('user', 'Why this hook? "Everyone says their CI/CD is automated" — what makes you think this will work?', 0),
    turn('muse', 'Good question. Here\'s my evidence:', 2),
    turn('muse', '📊 8 posts using the "contrarian claim" pattern:\n   - "Why your microservices aren\'t" → 74% retention\n   - "Everyone talks about DX" → 71% retention\n   - "Stop using X for Y" → 75% retention\n   - ...5 more posts averaging 70% retention', 4),
    turn('muse', '📈 Average retention for this pattern: 72% — 19 points above your baseline.\n✅ You explicitly approved 2 drafts with this exact hook structure.\n🎯 Your audience (73% technical creators) consistently engages with contrarian openings.', 6),
    turn('muse', 'I\'m not guessing. This is pattern recognition from your own data.', 8),
    turn('user', 'OK, I trust the data. Approved.', 9),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 52,
    recommendations: 7,
    draftsCompleted: 14,
    voiceScore: 94,
    hookScore: 91,
    learningCycles: 7,
    overnightRuns: 4,
    approvalRate: 87,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// Scene 9: Learning beat — Mark underperforming → Muse adjusts confidence
// ---------------------------------------------------------------------------

const SCENE_9: DemoScene = {
  sceneId: 'demo-scene-9',
  sceneName: 'Learning — Jules corrects, Muse adapts',
  sceneNumber: 9,
  durationMs: 9000,
  emotionalArc: 'curious',
  narration: 'Jules marks a recommendation as underperforming. Muse doesn\'t get defensive — it adjusts. Confidence drops, the learning engine updates, and future recommendations will be better. This is the feedback loop.',
  conversationTurns: [
    turn('user', 'That thread you suggested last week — "5 things wrong with Docker" — it underperformed. Only 45% retention.', 0),
    turn('muse', 'Noted. Let me update my model.', 2),
    turn('muse', '📉 Updating: "listicle" hook pattern for Docker topic → 45% retention (down from predicted 68%).\n🔄 Adjusting confidence for "listicle + infrastructure" combination: 0.82 → 0.61.\n📝 Learning event logged: "Listicle format underperforms for infra topics with Jules\' audience."', 4),
    turn('muse', 'My bad on that one. The data said listicle should work, but your audience clearly prefers contrarian or tutorial depth for infrastructure topics. I\'ll adjust.', 6),
    turn('muse', 'Updated recommendation: For infrastructure topics → prioritize contrarian_claim (72% retention) and tutorial (68% retention). Deprioritize listicle.', 8),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 54,
    recommendations: 7,
    draftsCompleted: 14,
    voiceScore: 94,
    hookScore: 91,
    learningCycles: 8,
    overnightRuns: 4,
    approvalRate: 87,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// Scene 10: Closing — "A chatbot gives you an answer. Muse gets to know how you work."
// ---------------------------------------------------------------------------

const SCENE_10: DemoScene = {
  sceneId: 'demo-scene-10',
  sceneName: 'Closing — What makes Muse different',
  sceneNumber: 10,
  durationMs: 10000,
  emotionalArc: 'inspiring',
  narration: 'The demo closes with the core thesis. A chatbot gives you an answer. Muse gets to know how you work — your voice, your audience, your patterns. And it works while you rest.',
  conversationTurns: [
    turn('narrator', 'The screen shows the full journey: Memory → Delegation → Evaluation → Persistence → Learning.', 0),
    turn('muse', 'Jules, here\'s what our 3 weeks together look like:', 2),
    turn('muse', '🗓️ 47 memories stored — your voice, your audience, your wins\n📝 14 drafts created — all aligned to your standards\n🪝 91% hook quality — because I learned what works for YOU\n🎙️ 94% voice consistency — I sound like you, not a template\n🔄 8 learning cycles — every correction makes me better\n✅ 87% approval rate — and climbing', 4),
    turn('narrator', 'Fade to black.', 7),
    turn('narrator', 'A chatbot gives you an answer.\nMuse gets to know how you work.', 8),
  ],
  dataSnapshot: snapshot({
    memoryEvents: 54,
    recommendations: 7,
    draftsCompleted: 14,
    voiceScore: 94,
    hookScore: 91,
    learningCycles: 8,
    overnightRuns: 4,
    approvalRate: 87,
  }),
  isSimulation: true,
  source: 'prerecorded',
};

// ---------------------------------------------------------------------------
// All scenes
// ---------------------------------------------------------------------------

export const DEMO_SCENES: DemoScene[] = [
  SCENE_1,
  SCENE_2,
  SCENE_3,
  SCENE_4,
  SCENE_5,
  SCENE_6,
  SCENE_7,
  SCENE_8,
  SCENE_9,
  SCENE_10,
];

export const TOTAL_DEMO_DURATION_MS = DEMO_SCENES.reduce((sum, s) => sum + s.durationMs, 0);

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getPrerecordedScene(sceneNumber: number): DemoScene | undefined {
  return DEMO_SCENES.find((s) => s.sceneNumber === sceneNumber);
}

export function getPrerecordedSceneById(sceneId: string): DemoScene | undefined {
  return DEMO_SCENES.find((s) => s.sceneId === sceneId);
}

export function getPrerecordedTurn(sceneId: string): ConversationTurn[] {
  const scene = getPrerecordedSceneById(sceneId);
  return scene?.conversationTurns ?? [];
}
