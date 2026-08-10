// ============================================================================
// API Route: /api/minds/chat
// Live Chat with Muse Mind — send a message and get a real reply
//
// POST: Sends user message to Muse and waits for response
// This is the core demo feature: talking directly to your AI creative teammate
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { adapterSendMessage, adapterGetHistory, isLiveMode } from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';

export const dynamic = 'force-dynamic';

function extractMessageText(record: Record<string, unknown>): string {
  // Minds SDK history records have messageText field
  if (typeof record.messageText === 'string') return record.messageText;
  // Some records wrap in reply
  if (record.reply && typeof (record.reply as any).messageText === 'string') return (record.reply as any).messageText;
  return JSON.stringify(record);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, alias = 'creator-chat' } = body as { message?: string; alias?: string };

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      );
    }

    const config = getMindsConfig();
    const startTime = Date.now();

    if (isLiveMode()) {
      // LIVE: Send message to Muse, then poll history for reply
      try {
        // Send the message
        const sendResult = await adapterSendMessage(alias, message, config.museId);

        if (sendResult.success) {
          // Poll for the reply (check history 3 times with 5s delays)
          for (let attempt = 0; attempt < 6; attempt++) {
            await new Promise((r) => setTimeout(r, 3000)); // 3s between polls

            try {
              const history = await adapterGetHistory(alias, 5);
              // Find the latest reply from the Mind (senderType 0 = Mind)
              const mindReply = history.find(
                (msg: any) =>
                  msg.senderType === 0 &&
                  msg.senderEmail?.includes('muse01') &&
                  new Date(msg.createdAt).getTime() > startTime - 5000
              );

              if (mindReply) {
                const replyText = extractMessageText(mindReply as unknown as Record<string, unknown>);
                return NextResponse.json({
                  success: true,
                  reply: replyText,
                  mode: 'live',
                  mindId: config.museId,
                  mindName: 'Muse01',
                  responseTime: Date.now() - startTime,
                  timestamp: new Date().toISOString(),
                });
              }
            } catch {
              // History poll failed, continue trying
            }
          }

          // No reply found after polling — return "thinking" status
          return NextResponse.json({
            success: true,
            reply: 'Muse received your message and is thinking... Check back in a moment for the response.',
            mode: 'live',
            mindId: config.museId,
            mindName: 'Muse01',
            responseTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            pending: true,
          });
        }

        // Send failed
        return NextResponse.json({
          success: false,
          reply: null,
          error: 'Failed to send message to Muse',
          mode: 'live',
          mindId: config.museId,
          responseTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('[api/minds/chat] Live chat failed, using simulator:', err);
      }
    }

    // SIMULATED: Generate a context-aware simulated response
    const simulatedReply = generateSimulatedResponse(message);

    return NextResponse.json({
      success: true,
      reply: simulatedReply,
      error: null,
      mode: 'simulate',
      mindId: config.museId,
      mindName: 'Muse01 (simulated)',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

function generateSimulatedResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('hook') || lower.includes('recommend')) {
    return `Based on your 8 most recent posts, contrarian hooks are performing at 72% average retention vs your 61% baseline. I'd recommend leading with "Most [topic] advice is wrong — here's what actually works" for your next piece. (Medium confidence, 8 data points)`;
  }

  if (lower.includes('memory') || lower.includes('remember')) {
    return `I have 47 memory events stored across 4 domains: Identity (your direct, technical voice), Voice (91 directness, 88 technical depth), Performance (28 content items analyzed), and Decisions (3 creator approvals, 1 rejection). Your contrarian hooks outperform by 11pp.`;
  }

  if (lower.includes('overnight') || lower.includes('tonight') || lower.includes('autonomous')) {
    return `I'm configured to run an overnight cycle at 23:00. During the last cycle, I: 1) Reviewed 3 new audience signals, 2) Generated a content draft (score: 0.91), 3) Updated hook performance data. The draft is pending your approval in the Control tab.`;
  }

  if (lower.includes('maker') || lower.includes('draft') || lower.includes('create')) {
    return `I can delegate to Maker (muse02) via our Circle to produce a voice-aligned draft. Based on your profile — direct tone, technical vocabulary, contrarian hook preference — I'd instruct Maker to lead with a contrarian claim and keep the CTA low-intensity. Want me to generate a draft now?`;
  }

  if (lower.includes('performance') || lower.includes('analytics') || lower.includes('stats')) {
    return `Your latest 5 posts: avg 14.2K views, 8.4% engagement rate. Top performer: "Most AI agents aren't really agents" with 18.4K views and 71% retention (contrarian_claim hook). Your question hooks are underperforming at 54% retention — I'd deprioritize those for now.`;
  }

  return `I'm Muse, your persistent creative teammate. I've been learning your voice and what works for your audience. Ask me about hook recommendations, your memory profile, overnight cycles, or performance analysis — I have evidence for everything I say.`;
}
