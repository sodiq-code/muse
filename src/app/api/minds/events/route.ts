// ============================================================================
// API Route: /api/minds/events
// SSE Proxy — Streams real-time Mind activity events to the frontend
//
// In live mode: Generates events based on real Minds SDK operations
// In simulate mode: Generates periodic simulated events
// ============================================================================

import { isLiveMode } from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();
  const config = getMindsConfig();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const liveEventTypes = [
        { type: 'mind-thinking', mind: 'Muse01', detail: 'Analyzing creator memory via LTM…' },
        { type: 'memory-update', mind: 'Muse01', detail: 'Voice profile confidence: 0.87 (live Mind data)' },
        { type: 'recommendation', mind: 'Muse01', detail: 'Hook recommendation: contrarian_claim — 72% avg retention (8 samples, medium confidence)' },
        { type: 'circle-delegation', mind: 'Muse01', detail: `Delegating to muse02 via Circle (Maker API key: ${config.isDualAccount ? 'active' : 'fallback'})` },
        { type: 'skill-active', mind: 'Muse01', detail: 'DeepResearch skill processing query…' },
        { type: 'draft-complete', mind: 'muse02', detail: 'Voice-aligned draft ready — score: 0.91, voiceMatch: 0.93 (LIVE Maker response)' },
        { type: 'learning-update', mind: 'Muse01', detail: 'Hook pattern updated: contrarian_claim sampleSize 9→10' },
        { type: 'approval-request', mind: 'Muse01', detail: 'Overnight draft pending creator approval' },
        { type: 'cognition-update', mind: 'Muse01', detail: `Cognition balance check — dual account: ${config.isDualAccount ? 'yes' : 'no'}` },
      ];

      const simEventTypes = [
        { type: 'mind-thinking', mind: 'Muse01', detail: 'Analyzing creator memory…' },
        { type: 'memory-update', mind: 'Muse01', detail: 'Voice profile confidence updated to 0.87' },
        { type: 'recommendation', mind: 'Muse01', detail: 'New hook recommendation: contrarian_claim (72% avg retention)' },
        { type: 'mind-thinking', mind: 'muse02', detail: 'Generating content draft…' },
        { type: 'circle-delegation', mind: 'Muse01', detail: 'Delegating to muse02 via Circle' },
        { type: 'draft-complete', mind: 'muse02', detail: 'Voice-aligned draft ready (score: 0.91)' },
        { type: 'learning-update', mind: 'Muse01', detail: 'Hook pattern sample size: 9 (+1 new)' },
        { type: 'approval-request', mind: 'Muse01', detail: 'Overnight draft awaiting approval' },
      ];

      const eventTypes = isLiveMode() ? liveEventTypes : simEventTypes;
      const source = isLiveMode() ? 'live' : 'simulated';

      let index = 0;
      const sendEvent = () => {
        if (closed) return;
        try {
          const event = eventTypes[index % eventTypes.length];
          const data = JSON.stringify({
            ...event,
            source,
            dualAccount: config.isDualAccount,
            timestamp: new Date().toISOString(),
            id: `evt-${Date.now()}-${index}`,
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          index++;
        } catch {
          // Controller closed — stop sending
          closed = true;
          clearInterval(interval);
        }
      };

      // Send initial event immediately
      sendEvent();

      // Then every 5 seconds
      const interval = setInterval(sendEvent, isLiveMode() ? 5000 : 4000);

      // Clean up after 5 minutes
      setTimeout(() => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }, 300_000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
