/* CONTRACT: export function ToolCalling() — a chat message where the assistant
   invokes tools in sequence: each is a gradient-orb identity that spins up while
   running, types its own args out live, reveals a result, then settles — the
   whole run reads as one continuous, living thread rather than a static list. */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './ToolCalling.module.css';

interface ToolCall {
  id: string;
  name: string;
  colors: [string, string, string];
  args: string;
  result: string;
  duration: number;
}

/* Each tool gets its own gradient identity, drawn from the same soft palette
   family as the multi-agent roster — tool calls read as part of the same
   visual language as the agents making them. */
const CALLS: ToolCall[] = [
  {
    id: 'search',
    name: 'search_codebase',
    colors: ['#c7d2fe', '#a5b4fc', '#e0e7ff'],
    args: '{ "query": "rate limit middleware", "top_k": 5 }',
    result: '3 matches — rateLimit.ts, limits.ts, rateLimit.test.ts',
    duration: 1500,
  },
  {
    id: 'query',
    name: 'run_query',
    colors: ['#99f6e4', '#5eead4', '#ccfbf1'],
    args: '{ "sql": "select count(*) from requests where status = 429" }',
    result: '412 throttled requests in the last 24h',
    duration: 1700,
  },
  {
    id: 'write',
    name: 'write_file',
    colors: ['#fde68a', '#fca5a5', '#fee2e2'],
    args: '{ "path": "src/config/limits.ts", "change": "windowMs 60000 → 30000" }',
    result: 'Patched — window halved, limit unchanged',
    duration: 1300,
  },
];

type Status = 'pending' | 'active' | 'done';
type Beat = 'typing' | 'result';

const COLLAPSE_AFTER_MS = 1000;

export function ToolCalling() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', false, {
    getInitialValueInEffect: false,
  });

  const [completed, setCompleted] = useState(reduced ? CALLS.length : 0);
  const [beat, setBeat] = useState<Beat>('typing');
  const [argsChars, setArgsChars] = useState(reduced ? Infinity : 0);
  // Manual overrides always win; auto-open/auto-collapse only apply to ids absent here.
  const [manual, setManual] = useState<Map<string, boolean>>(new Map());
  const collapseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const statusOf = (index: number): Status => {
    if (index < completed) return 'done';
    if (index === completed && completed < CALLS.length) return 'active';
    return 'pending';
  };

  // The typewriter: types the active call's args out, then holds for a beat
  // before its result appears, then advances the run to the next call.
  useEffect(() => {
    if (reduced || completed >= CALLS.length) return;
    const call = CALLS[completed];
    setBeat('typing');
    setArgsChars(0);

    const perChar = Math.max(10, (call.duration * 0.55) / call.args.length);
    let i = 0;
    const typeId = window.setInterval(() => {
      i += 1;
      setArgsChars(i);
      if (i >= call.args.length) window.clearInterval(typeId);
    }, perChar);

    const resultId = window.setTimeout(() => setBeat('result'), call.duration * 0.65);
    const advanceId = window.setTimeout(() => setCompleted((c) => c + 1), call.duration);

    return () => {
      window.clearInterval(typeId);
      window.clearTimeout(resultId);
      window.clearTimeout(advanceId);
    };
  }, [completed, reduced]);

  // Auto-collapse a call shortly after it settles, unless the visitor already
  // touched it (manual override) or it's about to be superseded anyway.
  useEffect(() => {
    if (reduced || completed === 0 || completed > CALLS.length) return;
    const settledId = CALLS[completed - 1].id;
    if (manual.has(settledId)) return;
    window.clearTimeout(collapseTimer.current);
    collapseTimer.current = window.setTimeout(() => {
      setManual((prev) => (prev.has(settledId) ? prev : new Map(prev).set(settledId, false)));
    }, COLLAPSE_AFTER_MS);
    return () => window.clearTimeout(collapseTimer.current);
  }, [completed, manual, reduced]);

  function toggle(id: string, autoValue: boolean) {
    setManual((prev) => new Map(prev).set(id, !(prev.get(id) ?? autoValue)));
  }

  function runAgain() {
    setManual(new Map());
    setBeat('typing');
    setArgsChars(0);
    setCompleted(0);
  }

  const allDone = completed >= CALLS.length;

  return (
    <Box className={classes.frame}>
      <Stack gap="md" className={classes.column}>
        {/* User ask */}
        <Group gap={10} align="flex-start" wrap="nowrap">
          <Box className={classes.userAvatar}>MC</Box>
          <Text fz={15} lh={1.5} pt={4}>
            Requests are getting 429s under load — can you find why and fix the limiter?
          </Text>
        </Group>

        {/* Assistant turn: identity + sequential tool calls */}
        <Group gap={10} align="flex-start" wrap="nowrap">
          <GradientMark size={28} />
          <Stack gap={8} style={{ flex: 1, minWidth: 0 }} pt={2}>
            <Text fz={12} fw={600} c="dimmed">
              Assistant
            </Text>

            <div className={classes.list}>
              {CALLS.map((call, index) => {
                const status = statusOf(index);
                const isActive = status === 'active';
                const isLast = index === CALLS.length - 1;
                const defaultOpen = isActive;
                const isOpen = manual.has(call.id) ? manual.get(call.id)! : defaultOpen;
                const shownArgs = status === 'done' ? call.args : call.args.slice(0, argsChars);
                const showResult = status === 'done' || (isActive && beat === 'result');

                return (
                  <div
                    key={call.id}
                    className={classes.row}
                    data-status={status}
                    style={{ '--stagger': `${index * 100}ms` } as CSSProperties}
                  >
                    <div className={classes.rail}>
                      <span className={classes.orbWrap} data-status={status}>
                        <GradientMark size={22} colors={call.colors} seed={call.id} className={classes.orb} />
                        {status === 'done' && (
                          <span className={classes.checkBadge}>
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                      </span>
                      {!isLast && (
                        <div className={classes.connector}>
                          <div className={classes.connectorFill} data-filled={index < completed} />
                        </div>
                      )}
                    </div>

                    <div className={classes.chip} data-status={status}>
                      <button
                        type="button"
                        className={classes.chipHead}
                        onClick={() => toggle(call.id, defaultOpen)}
                        aria-expanded={isOpen}
                        disabled={status === 'pending'}
                      >
                        <span className={classes.name}>{call.name}</span>
                        <span className={classes.statusText} data-status={status}>
                          {status === 'pending' ? 'queued' : status === 'active' ? 'running' : 'done'}
                        </span>
                        <ChevronRight size={14} className={classes.chevron} data-open={isOpen} />
                      </button>

                      <div className={classes.collapse} data-open={isOpen && status !== 'pending'}>
                        <div className={classes.collapseInner}>
                          <Text className={classes.args}>
                            {shownArgs}
                            {isActive && beat === 'typing' && <span className={classes.caret} />}
                          </Text>
                          <div className={classes.resultRow} data-show={showResult}>
                            <span className={classes.resultDot} />
                            <Text className={classes.result}>{call.result}</Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {allDone && (
              <>
                <Text fz={15} lh={1.6} className={classes.summary}>
                  Found it — the rate limiter's window was too wide for the new traffic pattern. I
                  halved <code>windowMs</code> in <code>limits.ts</code>, so the same request volume
                  now spreads across more windows instead of tripping the 429 threshold.
                </Text>
                <Button
                  size="xs"
                  variant="default"
                  onClick={runAgain}
                  leftSection={<RotateCcw size={13} strokeWidth={2.25} />}
                  className={classes.replay}
                >
                  Run again
                </Button>
              </>
            )}
          </Stack>
        </Group>
      </Stack>
    </Box>
  );
}
