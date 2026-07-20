/* CONTRACT: export function ToolCalling() — a chat message where the assistant
   invokes tools in sequence: each call chip runs (spinner → check morph),
   then reveals its result; click a chip to expand/collapse its raw args + output. */
import { useEffect, useState, type CSSProperties } from 'react';
import { Box, Group, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ChevronRight, Database, FileSearch, LoaderCircle, PenLine, Check } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './ToolCalling.module.css';

interface ToolCall {
  id: string;
  name: string;
  icon: typeof FileSearch;
  args: string;
  result: string;
  duration: number;
}

const CALLS: ToolCall[] = [
  {
    id: 'search',
    name: 'search_codebase',
    icon: FileSearch,
    args: '{ "query": "rate limit middleware", "top_k": 5 }',
    result: '3 matches — src/middleware/rateLimit.ts, src/config/limits.ts, tests/rateLimit.test.ts',
    duration: 1100,
  },
  {
    id: 'query',
    name: 'run_query',
    icon: Database,
    args: '{ "sql": "select count(*) from requests where status = 429" }',
    result: '412 throttled requests in the last 24h',
    duration: 1300,
  },
  {
    id: 'write',
    name: 'write_file',
    icon: PenLine,
    args: '{ "path": "src/config/limits.ts", "change": "windowMs 60000 → 30000" }',
    result: 'Patched — window halved, limit unchanged',
    duration: 900,
  },
];

type Status = 'pending' | 'active' | 'done';

export function ToolCalling() {
  // As in the other AI-run patterns: reduced motion mounts the finished state
  // directly, no timers, no motion.
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', false, {
    getInitialValueInEffect: false,
  });

  const [completed, setCompleted] = useState(reduced ? CALLS.length : 0);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (reduced) {
      setCompleted(CALLS.length);
      return;
    }
    if (completed >= CALLS.length) return;
    const id = window.setTimeout(() => setCompleted((c) => c + 1), CALLS[completed].duration);
    return () => window.clearTimeout(id);
  }, [completed, reduced]);

  const statusOf = (index: number): Status => {
    if (index < completed) return 'done';
    if (index === completed) return 'active';
    return 'pending';
  };

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

            <Stack gap={6}>
              {CALLS.map((call, index) => {
                const status = statusOf(index);
                const isOpen = expanded.has(call.id);
                const Icon = call.icon;
                return (
                  <Box
                    key={call.id}
                    className={classes.chip}
                    data-status={status}
                    style={{ '--stagger': `${index * 90}ms` } as CSSProperties}
                  >
                    <button
                      type="button"
                      className={classes.chipHead}
                      onClick={() => toggle(call.id)}
                      aria-expanded={isOpen}
                      disabled={status === 'pending'}
                    >
                      <span className={classes.icon} data-status={status}>
                        {status === 'active' ? (
                          <span className={classes.spinner}>
                            <LoaderCircle size={13} strokeWidth={2.25} />
                          </span>
                        ) : status === 'done' ? (
                          <Check size={13} strokeWidth={2.5} className={classes.checkPop} />
                        ) : (
                          <Icon size={13} strokeWidth={2} />
                        )}
                      </span>
                      <span className={classes.name}>{call.name}</span>
                      <span className={classes.statusText}>
                        {status === 'pending' ? 'queued' : status === 'active' ? 'running…' : 'done'}
                      </span>
                      <ChevronRight size={14} className={classes.chevron} data-open={isOpen} />
                    </button>

                    <div className={classes.collapse} data-open={isOpen && status !== 'pending'}>
                      <div className={classes.collapseInner}>
                        <Text className={classes.args}>{call.args}</Text>
                        {status === 'done' && <Text className={classes.result}>{call.result}</Text>}
                      </div>
                    </div>
                  </Box>
                );
              })}
            </Stack>

            {allDone && (
              <Text fz={15} lh={1.6} className={classes.summary}>
                Found it — the rate limiter's window was too wide for the new traffic pattern. I
                halved <code>windowMs</code> in <code>limits.ts</code>, so the same request volume
                now spreads across more windows instead of tripping the 429 threshold.
              </Text>
            )}
          </Stack>
        </Group>
      </Stack>
    </Box>
  );
}
