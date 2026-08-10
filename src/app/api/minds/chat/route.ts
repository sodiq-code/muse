// ============================================================================
// API Route: /api/minds/chat
// Live Chat with Muse Mind — send a message and get a real reply
//
// POST: Sends user message to Muse and waits for response
// This is the core demo feature: talking directly to your AI creative teammate
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { adapterSendMessage, adapterGetHistory, adapterSendMessageAndWait, isLiveMode } from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';

export const dynamic = 'force-dynamic';

function extractMessageText(record: Record<string, unknown>): string {
  // Minds SDK response formats:
  // 1. Direct messageText: { messageText: "..." }
  // 2. Wrapped in reply: { reply: { messageText: "..." } }
  // 3. waitForReply returns: { reply: { messageText: "..." }, ... }

  if (typeof record.messageText === 'string') return record.messageText;

  // Check for reply wrapper
  const reply = record.reply as Record<string, unknown> | undefined;
  if (reply) {
    if (typeof reply.messageText === 'string') return reply.messageText;
    // Sometimes reply has nested content
    if (typeof reply.content === 'string') return reply.content;
    if (typeof reply.text === 'string') return reply.text;
  }

  // Check for content field
  if (typeof record.content === 'string') return record.content;
  if (typeof record.text === 'string') return record.text;

  // Last resort: try to parse if it's a JSON string
  const str = JSON.stringify(record);
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed === 'string') return parsed;
  } catch {
    // not a string
  }

  return str;
}

/**
 * Extract message text from a Minds SDK waitForReply response.
 * The waitForReply returns a complex object that needs careful parsing.
 */
function extractReplyFromWaitForReply(replyStr: string): string {
  try {
    const parsed = JSON.parse(replyStr);

    // waitForReply format: { reply: { messageText: "..." }, ... }
    if (parsed.reply) {
      if (typeof parsed.reply.messageText === 'string') return parsed.reply.messageText;
      if (typeof parsed.reply.content === 'string') return parsed.reply.content;
      if (typeof parsed.reply.text === 'string') return parsed.reply.text;
    }

    // Direct messageText
    if (typeof parsed.messageText === 'string') return parsed.messageText;
    if (typeof parsed.content === 'string') return parsed.content;
    if (typeof parsed.text === 'string') return parsed.text;

    // If it's still a complex object, try one more level
    if (parsed.reply && typeof parsed.reply === 'object') {
      const replyStr2 = JSON.stringify(parsed.reply);
      if (replyStr2.length > 2 && replyStr2.length < replyStr.length * 0.5) {
        // The reply object is significantly smaller than the full response
        // Try to extract something meaningful
        for (const key of ['messageText', 'content', 'text', 'body', 'response']) {
          if (typeof parsed.reply[key] === 'string') return parsed.reply[key];
        }
      }
    }

    // Return the full JSON as fallback (it's still a valid response)
    return replyStr;
  } catch {
    return replyStr;
  }
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
      // LIVE: Send message to Muse, then wait for reply using Minds SDK
      try {
        // Use sendMessageAndWait for reliable response
        const result = await adapterSendMessageAndWait(
          alias,
          message,
          config.museId,
          60_000 // 60 second timeout for chat
        );

        if (result.success && result.reply) {
          const extractedReply = extractReplyFromWaitForReply(result.reply);
          return NextResponse.json({
            success: true,
            reply: extractedReply,
            mode: 'live',
            mindId: config.museId,
            mindName: 'Muse01',
            responseTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
          });
        }

        // If waitForReply didn't get a response, try polling history
        const sendResult = await adapterSendMessage(alias, message, config.museId);
        if (sendResult.success) {
          // Poll for the reply (check history up to 6 times with 3s delays)
          for (let attempt = 0; attempt < 6; attempt++) {
            await new Promise((r) => setTimeout(r, 3000));

            try {
              const history = await adapterGetHistory(alias, 5);
              const mindReply = history.find(
                (msg: Record<string, unknown>) =>
                  msg.senderType === 0 &&
                  new Date(msg.createdAt as string).getTime() > startTime - 5000
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
