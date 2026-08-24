// ============================================================================
// API Route: /api/minds/events
// SSE Proxy — Streams real-time Mind activity events to the frontend
//
// In live mode: Polls real Minds conversation history and emits new messages
//   as they arrive. Also emits periodic system status events (cognition
//   balance, connection state). No cognition is consumed — getHistory is a
//   read-only operation.
// In simulate mode: Generates periodic simulated events for local dev.
// ============================================================================

import { isLiveMode, adapterGetHistory, adapterGetCognitionBalance } from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';

export const dynamic = 'force-dynamic';

// Conversations to monitor for real Mind activity
const MONITORED_ALIASES = ['creator-chat', 'muse-to-maker', 'dashboard-activity'];

// Event types for simulate mode (local dev only)
const SIM_EVENT_TYPES = [
  { type: 'mind-thinking', mind: 'Muse01', detail: 'Analyzing creator memory…' },
  { type: 'memory-update', mind: 'Muse01', detail: 'Voice profile confidence updated to 0.87' },
  { type: 'recommendation', mind: 'Muse01', detail: 'New hook recommendation: contrarian_claim (72% avg retention)' },
  { type: 'mind-thinking', mind: 'muse02', detail: 'Generating content draft…' },
  { type: 'circle-delegation', mind: 'Muse01', detail: 'Delegating to muse02 via Circle' },
  { type: 'draft-complete', mind: 'muse02', detail: 'Voice-aligned draft ready (score: 0.91)' },
  { type: 'learning-update', mind: 'Muse01', detail: 'Hook pattern sample size: 9 (+1 new)' },
  { type: 'approval-request', mind: 'Muse01', detail: 'Overnight draft awaiting approval' },
];

export async function GET() {
  const encoder = new TextEncoder();
  const config = getMindsConfig();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const seenMessageIds = new Set<string>();

      const enqueue = (data: Record<string, unknown>) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          closed = true;
        }
      };

      if (isLiveMode()) {
        // ====================================================================
        // LIVE MODE — Poll real Minds conversation history
        // getHistory is read-only and does NOT consume cognition credits.
        // ====================================================================

        // Send an initial connection-confirmed event
        enqueue({
          type: 'connection-established',
          mind: 'Muse01',
          detail: `Connected to Minds Platform — Muse01${config.isDualAccount ? ' + muse02' : ''} (Dual Account)`,
          source: 'live',
          dualAccount: config.isDualAccount,
          timestamp: new Date().toISOString(),
          id: `evt-conn-${Date.now()}`,
        });

        // Fetch and emit new messages from monitored conversations
        const pollConversations = async () => {
          if (closed) return;

          for (const alias of MONITORED_ALIASES) {
            try {
              const history = await adapterGetHistory(alias, 10);

              for (const msg of history) {
                const record = msg as Record<string, unknown>;
                const msgId =
                  (record.fingerprint as string) ??
                  (record.messageId as string) ??
                  `${alias}-${record.createdAt as string}`;
                const senderType = record.senderType as number;

                // Only emit messages we haven't seen, and only from the Mind (senderType === 0)
                if (!seenMessageIds.has(msgId) && senderType === 0) {
                  seenMessageIds.add(msgId);
                  const text = (record.messageText as string) ?? '';
                  if (text && text.length > 0) {
                    const mindName =
                      (record.mindName as string) ??
                      (record.senderName as string) ??
                      (alias === 'muse-to-maker' ? 'muse02' : 'Muse01');

                    // Classify the event type based on content and alias
                    let eventType = 'mind-message';
                    let detail = text.slice(0, 200);
                    if (alias === 'muse-to-maker') {
                      eventType = 'delegation-response';
                    } else if (text.toLowerCase().includes('hook')) {
                      eventType = 'recommendation';
                    } else if (text.toLowerCase().includes('draft')) {
                      eventType = 'draft-complete';
                    }

                    enqueue({
                      type: eventType,
                      mind: mindName,
                      detail,
                      source: 'live',
                      dualAccount: config.isDualAccount,
                      timestamp: (record.createdAt as string) ?? new Date().toISOString(),
                      id: `evt-${msgId}`,
                      messageId: msgId,
                      conversationAlias: alias,
                    });
                  }
                }
              }
            } catch {
              // History poll failed for this alias — continue to next
            }
          }
        };

        // Periodic status event (cognition balance, connection state)
        const pollStatus = async () => {
          if (closed) return;
          try {
            const balance = await adapterGetCognitionBalance(config.museId);
            const cognition = (balance as unknown as Record<string, unknown>).cognition as number;
            const cognitionStr =
              typeof cognition === 'number' ? cognition.toFixed(2) : String(cognition);

            enqueue({
              type: 'cognition-update',
              mind: 'Muse01',
              detail: `Cognition balance: ${cognitionStr} — dual account: ${config.isDualAccount ? 'yes' : 'no'}`,
              source: 'live',
              dualAccount: config.isDualAccount,
              timestamp: new Date().toISOString(),
              id: `evt-cog-${Date.now()}`,
            });
          } catch {
            // Status poll failed — skip silently
          }
        };

        // Initial poll
        await pollConversations();
        await pollStatus();

        // Poll conversations every 10 seconds
        const conversationInterval = setInterval(pollConversations, 10_000);

        // Poll status every 45 seconds
        const statusInterval = setInterval(pollStatus, 45_000);

        // Keepalive every 25 seconds to maintain connection
        const keepaliveInterval = setInterval(() => {
          if (closed) return;
          enqueue({
            type: 'keepalive',
            timestamp: new Date().toISOString(),
            id: `evt-keep-${Date.now()}`,
          });
        }, 25_000);

        // Clean up after 5 minutes
        setTimeout(() => {
          if (closed) return;
          closed = true;
          clearInterval(conversationInterval);
          clearInterval(statusInterval);
          clearInterval(keepaliveInterval);
          try {
            controller.close();
          } catch {
            // Already closed
          }
        }, 300_000);
      } else {
        // ====================================================================
        // SIMULATE MODE — Local development only
        // ====================================================================

        let index = 0;
        const sendSimEvent = () => {
          if (closed) return;
          const event = SIM_EVENT_TYPES[index % SIM_EVENT_TYPES.length];
          enqueue({
            ...event,
            source: 'simulated',
            dualAccount: config.isDualAccount,
            timestamp: new Date().toISOString(),
            id: `evt-${Date.now()}-${index}`,
          });
          index++;
        };

        sendSimEvent();
        const interval = setInterval(sendSimEvent, 4000);

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
      }
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
