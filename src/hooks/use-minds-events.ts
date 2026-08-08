// ============================================================================
// SSE Events Hook — Day 2
// Real-time SSE streaming from Minds with reconnection and simulated fallback
// ============================================================================

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { isLiveMode } from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MindsEventType =
  | 'message'
  | 'thinking'
  | 'skill_used'
  | 'delegation'
  | 'memory_update'
  | 'draft_ready'
  | 'recommendation'
  | 'approval_needed'
  | 'autonomous_action';

export interface MindsEvent {
  id: string;
  type: MindsEventType;
  source: string;    // mind name or 'system'
  data: Record<string, unknown>;
  timestamp: string;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

export interface UseMindsEventsReturn {
  events: MindsEvent[];
  connectionState: ConnectionState;
  lastEvent: MindsEvent | null;
  reconnect: () => void;
  clear: () => void;
  isSimulated: boolean;
}

// ---------------------------------------------------------------------------
// Simulated event generator (for when SSE isn't available)
// ---------------------------------------------------------------------------

const SIMULATED_EVENT_TYPES: MindsEventType[] = [
  'thinking',
  'message',
  'skill_used',
  'recommendation',
  'memory_update',
];

const SIMULATED_MESSAGES: Record<MindsEventType, string[]> = {
  message: [
    'Analyzing your latest content performance data...',
    'I noticed a pattern in your hook effectiveness — let me check something.',
    'Your contrarian claim hooks are outperforming questions by 23%.',
  ],
  thinking: [
    'Processing creator memory graph...',
    'Cross-referencing hook patterns with engagement data...',
    'Evaluating timing optimization for next post...',
  ],
  skill_used: [
    'DeepResearch skill activated — pulling latest AI/ML trends',
    'Passive Autonomous Soul — background analysis running',
  ],
  delegation: [
    'Delegating draft creation to Maker...',
    'Maker is generating hook alternatives...',
  ],
  memory_update: [
    'Memory updated: hook_pattern.contrarian_claim → 0.72 effectiveness',
    'Memory updated: audience_preference → technical deep-dives',
  ],
  draft_ready: [
    'Draft ready for review: "AI Agents: The Framework Nobody Talks About"',
  ],
  recommendation: [
    'Recommendation: Try a story hook for your next tutorial — your audience responds 15% better to narrative framing',
  ],
  approval_needed: [
    'Overnight draft awaiting approval: "5 AI Coding Tools That Actually Ship"',
  ],
  autonomous_action: [
    'Autonomous research completed — 3 signal summaries generated',
  ],
};

let simEventCounter = 0;

function generateSimulatedEvent(): MindsEvent {
  const type = SIMULATED_EVENT_TYPES[Math.floor(Math.random() * SIMULATED_EVENT_TYPES.length)];
  const messages = SIMULATED_MESSAGES[type];
  const message = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: `sim-${++simEventCounter}`,
    type,
    source: Math.random() > 0.5 ? 'Muse01' : 'muse_1',
    data: { message },
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const MAX_EVENTS = 100;
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;
const SIMULATED_INTERVAL = 4000;

// Compute initial mode once
function getInitialSimulated(): boolean {
  if (typeof window === 'undefined') return true;
  return !isLiveMode();
}

export function useMindsEvents(): UseMindsEventsReturn {
  const [events, setEvents] = useState<MindsEvent[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    getInitialSimulated() ? 'connected' : 'connecting'
  );
  const [isSimulated, setIsSimulated] = useState(getInitialSimulated());
  const [reconnectTrigger, setReconnectTrigger] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const simulatedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const addEvent = useCallback((event: MindsEvent) => {
    if (!mountedRef.current) return;
    setEvents((prev) => {
      const next = [...prev, event];
      return next.length > MAX_EVENTS ? next.slice(-MAX_EVENTS) : next;
    });
  }, []);

  const clear = useCallback(() => {
    setEvents([]);
  }, []);

  const reconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (simulatedIntervalRef.current) {
      clearInterval(simulatedIntervalRef.current);
      simulatedIntervalRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
    setReconnectTrigger((n) => n + 1);
  }, []);

  // Main connection effect
  useEffect(() => {
    mountedRef.current = true;
    const live = isLiveMode();

    if (!live) {
      // Simulated mode — start the interval
      simulatedIntervalRef.current = setInterval(() => {
        if (mountedRef.current) {
          addEvent(generateSimulatedEvent());
        }
      }, SIMULATED_INTERVAL);
    } else {
      // Try real SSE connection
      try {
        const config = getMindsConfig();
        const url = `https://api.build.hellominds.ai/v1/minds/${config.museId}/events`;
        const es = new EventSource(url, { withCredentials: true });

        es.onopen = () => {
          if (!mountedRef.current) { es.close(); return; }
          setConnectionState('connected');
          setIsSimulated(false);
          reconnectAttemptsRef.current = 0;
        };

        es.onmessage = (e) => {
          if (!mountedRef.current) return;
          try {
            const parsed = JSON.parse(e.data);
            addEvent({
              id: parsed.id ?? `evt-${Date.now()}`,
              type: parsed.type ?? 'message',
              source: parsed.source ?? 'Muse01',
              data: parsed.data ?? {},
              timestamp: parsed.timestamp ?? new Date().toISOString(),
            });
          } catch {
            addEvent({
              id: `evt-${Date.now()}`,
              type: 'message',
              source: 'Muse01',
              data: { message: e.data },
              timestamp: new Date().toISOString(),
            });
          }
        };

        es.onerror = () => {
          if (!mountedRef.current) { es.close(); return; }
          es.close();
          eventSourceRef.current = null;

          if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
            // Fall back to simulated
            setConnectionState('connected');
            setIsSimulated(true);
            simulatedIntervalRef.current = setInterval(() => {
              if (mountedRef.current) {
                addEvent(generateSimulatedEvent());
              }
            }, SIMULATED_INTERVAL);
            return;
          }

          reconnectAttemptsRef.current += 1;
          setConnectionState('reconnecting');
          setTimeout(() => {
            if (mountedRef.current) {
              setReconnectTrigger((n) => n + 1);
            }
          }, RECONNECT_DELAY);
        };

        eventSourceRef.current = es;
      } catch {
        // SSE not available — schedule fallback to simulated mode asynchronously
        // to avoid synchronous setState in effect body
        queueMicrotask(() => {
          if (!mountedRef.current) return;
          setConnectionState('connected');
          setIsSimulated(true);
          simulatedIntervalRef.current = setInterval(() => {
            if (mountedRef.current) {
              addEvent(generateSimulatedEvent());
            }
          }, SIMULATED_INTERVAL);
        });
      }
    }

    return () => {
      mountedRef.current = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (simulatedIntervalRef.current) {
        clearInterval(simulatedIntervalRef.current);
        simulatedIntervalRef.current = null;
      }
    };
  }, [addEvent, reconnectTrigger]);

  return {
    events,
    connectionState,
    lastEvent: events.length > 0 ? events[events.length - 1] : null,
    reconnect,
    clear,
    isSimulated,
  };
}
