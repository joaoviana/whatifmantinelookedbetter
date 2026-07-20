/* CONTRACT: export function ThinkingCloud() — an ambient "the agent is
   thinking deeply" surface: a drifting, blurred gradient nebula fills the
   answer area while the elapsed clock ticks, then dissolves to reveal the
   answer underneath. Necessity (long reasoning needs an honest, calming
   wait state) meets wow factor (it's not a spinner, it's weather). */
import { useEffect, useRef, useState } from 'react';
import { Box, Button, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { RotateCcw } from 'lucide-react';
import classes from './ThinkingCloud.module.css';

type Phase = 'thinking' | 'resolving' | 'done';

const QUESTION = 'Plan a two-week revamp of new-hire onboarding — what changes first?';
const ANSWER =
  'Start with day one: replace the slide deck with a working sandbox account so new ' +
  'hires ship something real before lunch. Everything else — buddy pairing, the reading ' +
  'list, access requests — can move to week two without losing momentum.';

const THINK_MS = 2600;

export function ThinkingCloud() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', false, {
    getInitialValueInEffect: false,
  });
  const [phase, setPhase] = useState<Phase>(reduced ? 'done' : 'thinking');
  const [elapsed, setElapsed] = useState(0);
  const [runId, setRunId] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (reduced) return;
    startRef.current = Date.now();
    setPhase('thinking');
    setElapsed(0);

    const tick = window.setInterval(() => setElapsed(Date.now() - startRef.current), 80);
    const resolve = window.setTimeout(() => setPhase('resolving'), THINK_MS);
    const done = window.setTimeout(() => setPhase('done'), THINK_MS + 500);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(resolve);
      window.clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, reduced]);

  return (
    <Box className={classes.frame}>
      <div className={classes.card}>
        <Text fz={13} fw={600} mb={12}>
          {QUESTION}
        </Text>

        <div className={classes.stage} data-phase={phase}>
          {phase !== 'done' && (
            <div className={classes.cloud} data-resolving={phase === 'resolving'}>
              <span className={classes.blob} data-n="1" />
              <span className={classes.blob} data-n="2" />
              <span className={classes.blob} data-n="3" />
              <span className={classes.blob} data-n="4" />
              <span className={classes.grain} aria-hidden />
            </div>
          )}

          {phase !== 'done' && (
            <div className={classes.thinkingLabel}>
              <Text fz={12.5} fw={500}>
                Thinking deeply
              </Text>
              <Text fz={12} c="dimmed" ff="var(--mantine-font-family-monospace)">
                {(elapsed / 1000).toFixed(1)}s
              </Text>
            </div>
          )}

          {phase === 'done' && (
            <Text fz={13.5} lh={1.6} className={classes.answer}>
              {ANSWER}
            </Text>
          )}
        </div>

        {phase === 'done' && (
          <Button
            size="xs"
            variant="default"
            mt={12}
            onClick={() => setRunId((r) => r + 1)}
            leftSection={<RotateCcw size={13} strokeWidth={2.25} />}
          >
            Ask again
          </Button>
        )}
      </div>
    </Box>
  );
}
