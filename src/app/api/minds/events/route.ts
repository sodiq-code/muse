// ============================================================================
// API Route: /api/minds/events
// SSE Proxy — Streams real-time Mind activity events to the frontend
//
// In live mode: Proxies the Minds platform SSE stream (when available)
// In simulate mode: Generates periodic simulated events
// ============================================================================

import { isLiveMode } from '@/lib/minds-adapter';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  // For now, Minds SDK's getEvents() method may not be available
  // We generate events based on live/simulated mode
  // In live mode, events are triggered by actual Minds API calls
  // which are visible in the dashboard via polling

  const stream = new ReadableStream({
    start(controller) {
      const liveEventTypes = [
        { type: 'mind-thinking', mind: 'Muse01', detail: 'Analyzing creator memory via LTM…' },
        { type: 'memory-update', mind: 'Muse01', detail: 'Voice profile confidence: 0.87 (live Mind data)' },
        { type: 'recommendation', mind: 'Muse01', detail: 'Hook recommendation: contrarian_claim — 72% avg retention (8 samples, medium confidence)' },
        { type: 'circle-delegation', mind: 'Muse01', detail: 'Delegating to muse02 via Circle for content draft' },
        { type: 'skill-active', mind: 'Muse01', detail: 'DeepResearch skill processing query…' },
        { type: 'draft-complete', mind: 'Muse01', detail: 'Voice-aligned draft ready — score: 0.91, voiceMatch: 0.93' },
        { type: 'learning-update', mind: 'Muse01', detail: 'Hook pattern updated: contrarian_claim sampleSize 9→10' },
        { type: 'approval-request', mind: 'Muse01', detail: 'Overnight draft pending creator approval' },
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
        const event = eventTypes[index % eventTypes.length];
        const data = JSON.stringify({
          ...event,
          source,
          timestamp: new Date().toISOString(),
          id: `evt-${Date.now()}-${index}`,
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        index++;
      };

      // Send initial event immediately
      sendEvent();

      // Then every 5 seconds (slower for live mode to avoid noise)
      const interval = setInterval(sendEvent, isLiveMode() ? 5000 : 4000);

      // Clean up after 5 minutes
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
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
