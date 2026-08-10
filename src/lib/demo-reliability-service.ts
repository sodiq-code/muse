// ============================================================================
// Demo Reliability Service — Day 19
// "Demo survives" — Ensures the demo works even when the Minds API is down.
//
// Features:
//   - checkMindsApiHealth() — Pings API, returns health status + latency
//   - getDemoFallbackMode() — Auto-detects live vs fallback (5s latency threshold)
//   - DemoFallbackProvider — Wraps all Minds calls with automatic fallback
//   - getPrerecordedTurn() — Returns pre-recorded data for demo scenes
//   - runDemoRehearsal() — Auto-plays all 10 scenes, returns rehearsal result
//
// Health check is cached for 30s (non-blocking).
// All fallback data is clearly labeled isSimulation: true, source: 'prerecorded'.
// ============================================================================

import { isLiveMode, adapterListMinds } from './minds-adapter';
import {
  DEMO_SCENES,
  getPrerecordedScene,
  getPrerecordedTurn as getPrerecordedTurnData,
  TOTAL_DEMO_DURATION_MS,
  type DemoScene,
  type ConversationTurn,
} from './demo-prerecorded-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HealthStatus = 'healthy' | 'degraded' | 'down';

export interface MindsApiHealthResult {
  status: HealthStatus;
  latencyMs: number;
  checkedAt: string;
  error?: string;
  cached: boolean;
}

export type FallbackMode = 'live' | 'simulated' | 'prerecorded';

export interface FallbackDecision {
  mode: FallbackMode;
  reason: string;
  healthStatus: HealthStatus;
  latencyMs: number;
  timestamp: string;
}

export interface RehearsalSceneResult {
  sceneId: string;
  sceneName: string;
  sceneNumber: number;
  durationMs: number;
  turnsPlayed: number;
  completedAt: string;
  isSimulation: true;
  source: 'prerecorded';
}

export interface RehearsalResult {
  totalScenes: number;
  completedScenes: number;
  totalDurationMs: number;
  actualDurationMs: number;
  sceneResults: RehearsalSceneResult[];
  fallbackMode: FallbackMode;
  allSimulated: true;
  isSimulation: true;
  source: 'prerecorded';
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Health Check — with 30s cache
// ---------------------------------------------------------------------------

const HEALTH_CACHE_TTL_MS = 30_000;
let cachedHealth: MindsApiHealthResult | null = null;
let lastHealthCheckTime = 0;

export async function checkMindsApiHealth(): Promise<MindsApiHealthResult> {
  const now = Date.now();

  // Return cached result if fresh
  if (cachedHealth && now - lastHealthCheckTime < HEALTH_CACHE_TTL_MS) {
    return { ...cachedHealth, cached: true };
  }

  // If not in live mode, no need to check — we're always simulated
  if (!isLiveMode()) {
    const result: MindsApiHealthResult = {
      status: 'degraded',
      latencyMs: 0,
      checkedAt: new Date(now).toISOString(),
      error: 'MINDS_MODE=simulate — API not checked',
      cached: false,
    };
    cachedHealth = result;
    lastHealthCheckTime = now;
    return result;
  }

  // Live mode — actually ping the API
  const startTime = Date.now();
  try {
    await adapterListMinds();
    const latency = Date.now() - startTime;

    let status: HealthStatus = 'healthy';
    if (latency > 5000) status = 'down';
    else if (latency > 2000) status = 'degraded';

    const result: MindsApiHealthResult = {
      status,
      latencyMs: latency,
      checkedAt: new Date(now).toISOString(),
      cached: false,
    };
    cachedHealth = result;
    lastHealthCheckTime = now;
    return result;
  } catch (err) {
    const latency = Date.now() - startTime;
    const result: MindsApiHealthResult = {
      status: 'down',
      latencyMs: latency,
      checkedAt: new Date(now).toISOString(),
      error: String(err),
      cached: false,
    };
    cachedHealth = result;
    lastHealthCheckTime = now;
    return result;
  }
}

// ---------------------------------------------------------------------------
// Fallback Mode Decision
// ---------------------------------------------------------------------------

const LATENCY_THRESHOLD_MS = 5_000;

export async function getDemoFallbackMode(): Promise<FallbackDecision> {
  const health = await checkMindsApiHealth();

  // If simulate mode, always use prerecorded for demo
  if (!isLiveMode()) {
    return {
      mode: 'prerecorded',
      reason: 'MINDS_MODE=simulate — using pre-recorded demo data',
      healthStatus: health.status,
      latencyMs: health.latencyMs,
      timestamp: new Date().toISOString(),
    };
  }

  // Live mode — check health
  if (health.status === 'down' || health.latencyMs > LATENCY_THRESHOLD_MS) {
    return {
      mode: 'prerecorded',
      reason: health.status === 'down'
        ? 'Minds API is down — falling back to pre-recorded demo data'
        : `Minds API latency ${health.latencyMs}ms exceeds ${LATENCY_THRESHOLD_MS}ms threshold — using pre-recorded data`,
      healthStatus: health.status,
      latencyMs: health.latencyMs,
      timestamp: new Date().toISOString(),
    };
  }

  if (health.status === 'degraded') {
    return {
      mode: 'simulated',
      reason: 'Minds API is degraded — using simulated mode with local fallback',
      healthStatus: health.status,
      latencyMs: health.latencyMs,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    mode: 'live',
    reason: 'Minds API is healthy — using live API',
    healthStatus: health.status,
    latencyMs: health.latencyMs,
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// DemoFallbackProvider — Wraps Minds calls with automatic fallback
// ---------------------------------------------------------------------------

export class DemoFallbackProvider {
  private fallbackMode: FallbackMode = 'prerecorded';
  private decision: FallbackDecision | null = null;

  async initialize(): Promise<void> {
    this.decision = await getDemoFallbackMode();
    this.fallbackMode = this.decision.mode;
  }

  getMode(): FallbackMode {
    return this.fallbackMode;
  }

  getDecision(): FallbackDecision | null {
    return this.decision;
  }

  /**
   * Get conversation turns for a demo scene.
   * Always returns pre-recorded data (clearly labeled).
   * In live mode with healthy API, could interleave live data —
   * but for demo reliability, pre-recorded is the safe path.
   */
  getSceneTurns(sceneId: string): ConversationTurn[] {
    return getPrerecordedTurnData(sceneId);
  }

  /**
   * Get a complete scene by scene number.
   */
  getScene(sceneNumber: number): DemoScene | undefined {
    return getPrerecordedScene(sceneNumber);
  }

  /**
   * Get all scenes.
   */
  getAllScenes(): DemoScene[] {
    return DEMO_SCENES;
  }

  /**
   * Whether the current session is using fallback data.
   */
  isUsingFallback(): boolean {
    return this.fallbackMode !== 'live';
  }
}

// ---------------------------------------------------------------------------
// getPrerecordedTurn — Public helper
// ---------------------------------------------------------------------------

export function getPrerecordedTurn(sceneId: string): ConversationTurn[] {
  return getPrerecordedTurnData(sceneId);
}

// ---------------------------------------------------------------------------
// Demo Rehearsal — Auto-play through all 10 scenes
// ---------------------------------------------------------------------------

let rehearsalInProgress = false;

export function isRehearsalRunning(): boolean {
  return rehearsalInProgress;
}

export async function runDemoRehearsal(
  onSceneComplete?: (result: RehearsalSceneResult, index: number) => void,
): Promise<RehearsalResult> {
  if (rehearsalInProgress) {
    throw new Error('Rehearsal already in progress');
  }

  rehearsalInProgress = true;
  const overallStart = Date.now();
  const sceneResults: RehearsalSceneResult[] = [];

  try {
    for (let i = 0; i < DEMO_SCENES.length; i++) {
      const scene = DEMO_SCENES[i];
      const sceneStart = Date.now();

      // Simulate scene playback with realistic timing
      // Use a reduced duration for rehearsal (3x speed) to keep it practical
      const playbackDuration = Math.max(500, scene.durationMs / 3);
      await sleep(playbackDuration);

      const result: RehearsalSceneResult = {
        sceneId: scene.sceneId,
        sceneName: scene.sceneName,
        sceneNumber: scene.sceneNumber,
        durationMs: Date.now() - sceneStart,
        turnsPlayed: scene.conversationTurns.length,
        completedAt: new Date().toISOString(),
        isSimulation: true,
        source: 'prerecorded',
      };

      sceneResults.push(result);

      if (onSceneComplete) {
        onSceneComplete(result, i);
      }
    }

    const totalActualDuration = Date.now() - overallStart;
    const fallbackDecision = await getDemoFallbackMode();

    return {
      totalScenes: DEMO_SCENES.length,
      completedScenes: sceneResults.length,
      totalDurationMs: TOTAL_DEMO_DURATION_MS,
      actualDurationMs: totalActualDuration,
      sceneResults,
      fallbackMode: fallbackDecision.mode,
      allSimulated: true,
      isSimulation: true,
      source: 'prerecorded',
      timestamp: new Date().toISOString(),
    };
  } finally {
    rehearsalInProgress = false;
  }
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
