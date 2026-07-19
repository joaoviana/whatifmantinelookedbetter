/* CONTRACT: export function AgentRunTimeline() — a live multi-step agent run:
   steps complete sequentially (spinner → check morph), a progress line fills, live pulse. */
import { useEffect, useRef, useState } from 'react';
import { Box, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  Check,
  Code2,
  FileText,
  Globe,
  LoaderCircle,
  RotateCcw,
  Route,
  ShieldCheck,
  Square,
  type LucideIcon,
} from 'lucide-react';
import classes from './AgentRunTimeline.module.css';

interface Step {
  label: string;
  detail: string;
  icon: LucideIcon;
  duration: number;
}

/* A believable coding-agent run. Durations stagger so the timeline feels
   organic rather than metronomic. */
const STEPS: Step[] = [
  { label: 'Plan', detail: 'Break the task into steps', icon: Route, duration: 900 },
  { label: 'Search web', detail: 'Query 3 sources', icon: Globe, duration: 1100 },
  { label: 'Read 4 pages', detail: '4 pages · 6.2k tokens', icon: FileText, duration: 1300 },
  { label: 'Write code', detail: 'Edit AgentRunTimeline.tsx', icon: Code2, duration: 1500 },
  { label: 'Verify', detail: 'Type-check & lint', icon: ShieldCheck, duration: 1000 },
  { label: 'Done', detail: 'Ship the changes', icon: Check, duration: 650 },
];

const TOTAL_MS = STEPS.reduce((sum, step) => sum + step.duration, 0);

type Phase = 'running' | 'done' | 'stopped';
type Status = 'pending' | 'active' | 'done';

export function AgentRunTimeline() {
  // useMediaQuery reads synchronously on the client, so the very first render
  // is already correct: reduced motion mounts a finished run, no timers.
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', false, {
    getInitialValueInEffect: false,
  });

  const [phase, setPhase] = useState<Phase>(reduced ? 'done' : 'running');
  // Number of completed steps == index of the currently-running step.
  const [completed, setCompleted] = useState(reduced ? STEPS.length : 0);
  const [elapsed, setElapsed] = useState(reduced ? TOTAL_MS : 0);
  const startRef = useRef<number>(Date.now());

  // Honour a reduced-motion preference that resolves (or flips) after mount.
  useEffect(() => {
    if (reduced) {
      setPhase('done');
      setCompleted(STEPS.length);
      setElapsed(TOTAL_MS);
    }
  }, [reduced]);

  // Sequential engine: schedule the current step, then advance. When the last
  // step lands, flip to done. Cleanup cancels the timer on stop / replay.
  useEffect(() => {
    if (phase !== 'running') return;
    if (completed >= STEPS.length) {
      setPhase('done');
      return;
    }
    const id = window.setTimeout(() => {
      setCompleted((c) => c + 1);
    }, STEPS[completed].duration);
    return () => window.clearTimeout(id);
  }, [phase, completed]);

  // Elapsed clock — ticks only while running, frozen once stopped or done.
  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 80);
    return () => window.clearInterval(id);
  }, [phase]);

  const runAgain = () => {
    startRef.current = Date.now();
    setElapsed(0);
    setCompleted(0);
    setPhase('running');
  };

  const stop = () => setPhase('stopped');

  const isRunning = phase === 'running';
  const statusOf = (index: number): Status => {
    if (index < completed) return 'done';
    if (index === completed && isRunning) return 'active';
    return 'pending';
  };

  // The bar fills toward the *next* boundary across the running step's duration,
  // so it advances continuously rather than in visible jumps.
  const targetFraction = isRunning
    ? Math.min((completed + 1) / STEPS.length, 1)
    : completed / STEPS.length;
  const barDuration = isRunning && completed < STEPS.length ? STEPS[completed].duration : 260;

  const heading =
    phase === 'done' ? 'Task complete' : phase === 'stopped' ? 'Run stopped' : 'Running task';
  const statusLine =
    phase === 'done'
      ? `Finished ${STEPS.length} steps`
      : phase === 'stopped'
        ? `Stopped at step ${Math.min(completed + 1, STEPS.length)} of ${STEPS.length}`
        : `Step ${completed + 1} of ${STEPS.length}`;

  return (
    <Box className={classes.frame}>
      <Paper
        radius="lg"
        shadow="md"
        w="100%"
        styles={{
          root: {
            maxWidth: 600,
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            overflow: 'hidden',
          },
        }}
      >
        {/* Top progress bar. */}
        <div className={classes.progressTrack}>
          <div
            className={classes.progressFill}
            style={{
              width: `${targetFraction * 100}%`,
              transition: `width ${barDuration}ms ${isRunning ? 'linear' : 'ease'}`,
            }}
          />
        </div>

        {/* Header — live dot + title on the left, elapsed clock on the right. */}
        <Group justify="space-between" align="flex-start" px="lg" pt="md" pb="sm">
          <Group gap={10} align="center" wrap="nowrap">
            <span className={classes.dot} data-live={isRunning} />
            <Stack gap={1}>
              <Text className="eyebrow">Agent run</Text>
              <Text fz="sm" fw={600} lh={1.2}>
                {heading}
              </Text>
            </Stack>
          </Group>
          <Text
            fz="sm"
            fw={500}
            c="dimmed"
            style={{
              fontFamily: 'var(--mantine-font-family-monospace)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {(elapsed / 1000).toFixed(1)}s
          </Text>
        </Group>

        {/* Ordered step list. */}
        <Box px="lg" pt={4}>
          <div className={classes.list}>
            {STEPS.map((step, index) => {
              const status = statusOf(index);
              const isLast = index === STEPS.length - 1;
              const StepIcon = step.icon;
              return (
                <div className={classes.row} data-status={status} key={step.label}>
                  <div className={classes.rail}>
                    <div className={classes.node} data-status={status}>
                      {status === 'done' ? (
                        <Check size={14} strokeWidth={2.5} className={classes.checkPop} />
                      ) : status === 'active' ? (
                        <span className={classes.spinner}>
                          <LoaderCircle size={15} strokeWidth={2.25} />
                        </span>
                      ) : (
                        <StepIcon size={14} strokeWidth={2} />
                      )}
                    </div>
                    {!isLast && (
                      <div className={classes.connector}>
                        <div className={classes.connectorFill} data-filled={index < completed} />
                      </div>
                    )}
                  </div>
                  <div className={classes.body}>
                    <span className={classes.label}>{step.label}</span>
                    <span className={classes.detail}>{step.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Box>

        {/* Footer — status text + replay / stop controls. */}
        <Group
          justify="space-between"
          px="lg"
          py="md"
          mt={4}
          style={{ borderTop: '1px solid var(--app-border)' }}
        >
          <Text fz="xs" c="dimmed">
            {statusLine}
          </Text>
          <Group gap={8}>
            {isRunning && (
              <Button
                size="xs"
                variant="default"
                onClick={stop}
                leftSection={<Square size={13} strokeWidth={2.25} />}
              >
                Stop
              </Button>
            )}
            <Button
              size="xs"
              variant={isRunning ? 'default' : 'filled'}
              onClick={runAgain}
              leftSection={<RotateCcw size={13} strokeWidth={2.25} />}
            >
              Run again
            </Button>
          </Group>
        </Group>
      </Paper>
    </Box>
  );
}
