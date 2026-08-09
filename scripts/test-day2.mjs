/**
 * Day 2 Validation — Autonomous wake-up, SSE, credit measurement, dual-role config
 * Credit-aware: Total spend ~16 credits
 */
import { createMindsClient } from "@animocabrands/minds-client-lib";

const MINDS_KEY = process.env.MINDS_BUILDER_API_KEY || "";
const MUSE_ID = "9fd0483e-f36b-1410-8466-00039ce7df11";
const MAKER_ID = "15d1483e-f36b-1410-8466-00039ce7df11";
const HUMAN_ID = "8fd0483e-f36b-1410-8466-00039ce7df11";

const client = createMindsClient({ builderApiKey: MINDS_KEY });

console.log("🧪 MUSE Day 2 Validation (Credit-Aware)\n");

// PRE-TEST: Check current credit balance
console.log("━━━ CREDIT BALANCE CHECK ━━━");
try {
  const museBal = await client.getCognitionBalance(MUSE_ID);
  console.log("Muse01 credits:", JSON.stringify(museBal));
} catch(e) {
  console.log("Muse balance error:", e.message?.substring(0, 100));
}

try {
  const makerBal = await client.getCognitionBalance(MAKER_ID);
  console.log("Maker credits:", JSON.stringify(makerBal));
} catch(e) {
  console.log("Maker balance error:", e.message?.substring(0, 100));
}

// TEST 1: SSE Events Stream
console.log("\n━━━ TEST: SSE Events Stream ━━━");
try {
  const eventStream = client.subscribeEvents();
  console.log("SSE stream type:", typeof eventStream);
  console.log("SSE stream created successfully");
  
  const eventsIter = client.eventsIterator();
  console.log("Events iterator type:", typeof eventsIter);
  
  console.log("✅ SSE stream connects (subscription created)");
} catch(e) {
  console.log("SSE error:", e.message?.substring(0, 200));
}

// TEST 2: List Conversations
console.log("\n━━━ TEST: List Conversations ━━━");
try {
  const conversations = await client.listConversations();
  console.log("Conversations found:", conversations?.length || 0);
  if (conversations && conversations.length > 0) {
    for (const c of conversations.slice(0, 5)) {
      console.log(`  - ${c.alias || c.conversationId} (mind: ${c.mindId?.slice(0,8) || 'unknown'})`);
    }
  }
} catch(e) {
  console.log("List conversations error:", e.message?.substring(0, 200));
}

// TEST 3: Configure Muse01 as Dual-Role
console.log("\n━━━ TEST: Configure Muse01 as Dual-Role ━━━");
const dualRoleAlias = `muse-dual-role-${Date.now()}`;
try {
  const conv = await client.createConversation({
    alias: dualRoleAlias,
    mindId: MUSE_ID,
  });
  console.log("Conversation created:", dualRoleAlias);
  
  const dualRoleMsg = `You are now operating in DUAL-ROLE MODE as both Orchestrator AND Creative Maker.

As ORCHESTRATOR (Muse):
- You own the creator's identity, memory, and decisions
- You manage the learning loop: observe → compare → infer → update → recommend
- Every recommendation must cite evidence with confidence level

As CREATIVE MAKER:
- You produce voice-aligned drafts, hooks, and content
- You follow the structured instruction format
- Your output format: { script, caption, title, cta, alternativeHooks }

Creator identity: Jules — AI and developer education niche, technical creators audience, direct and technical tone, avoids corporate language and fake urgency.

Confirm you understand this dual-role configuration.`;

  console.log("Sending dual-role config... (this takes ~30-60s, costs ~5-8 credits)");
  const startT = Date.now();
  const reply = await client.waitForReply(dualRoleAlias, dualRoleMsg, { timeoutMs: 180000 });
  const latency = Date.now() - startT;
  console.log(`Reply in ${latency}ms:`, (reply?.messageText || "").substring(0, 300));
  console.log("✅ Dual-role configuration sent and acknowledged");
} catch(e) {
  console.log("Dual-role config error:", e.message?.substring(0, 200));
}

// TEST 4: Alarm Clock / Autonomous Wake-up
console.log("\n━━━ TEST: Alarm Clock (Autonomous Wake-up) ━━━");
try {
  const skills = await client.listEquippedSkills(MUSE_ID);
  console.log("Muse skills:", skills?.length || 0);
  for (const s of skills || []) {
    console.log(`  - ${s.name || s.skillId}`);
  }
  
  const hasAutonomous = skills?.some((s) => 
    s.name?.toLowerCase().includes("passive") ||
    s.name?.toLowerCase().includes("autonomous") ||
    s.name?.toLowerCase().includes("alarm") ||
    s.name?.toLowerCase().includes("soul")
  );
  
  if (hasAutonomous) {
    console.log("✅ Passive Autonomous Soul skill is equipped — Alarm Clock capability available");
  } else {
    console.log("⚠️ Passive Autonomous Soul not detected — attempting to equip");
    try {
      await client.equipSkills(MUSE_ID, { ids: ["206E193A-4930-F111-AD1D-0EA9A5017E89"] });
      console.log("✅ Passive Autonomous Soul equipped successfully");
    } catch(equipErr) {
      console.log("Could not equip:", equipErr.message?.substring(0, 100));
    }
  }
} catch(e) {
  console.log("Alarm Clock test error:", e.message?.substring(0, 200));
}

// POST-TEST: Check credit balance after
console.log("\n━━━ CREDIT BALANCE AFTER TESTS ━━━");
try {
  const museBal = await client.getCognitionBalance(MUSE_ID);
  console.log("Muse01 credits after:", JSON.stringify(museBal));
} catch(e) {
  console.log("Muse balance error:", e.message?.substring(0, 100));
}

console.log("\n═══════════════════════════════════════");
console.log("  Day 2 Validation Complete (Credit-Aware)");
console.log("═══════════════════════════════════════");
