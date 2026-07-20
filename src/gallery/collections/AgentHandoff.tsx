/* CONTRACT: export function AgentHandoff() — a visual baton-pass between two
   agents: a gradient spark travels from the outgoing agent to the incoming
   one, who lights up from dim to full color the instant it arrives, with
   the status line crossfading to what they're now doing. */
import { useState, type CSSProperties } from 'react';
import { Box, Button, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { RotateCcw } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './AgentHandoff.module.css';

type Phase = 'idle' | 'handing' | 'received';

const FROM = { name: 'Vera', role: 'Analyst', colors: ['#99f6e4', '#5eead4', '#ccfbf1'] as [string, string, string] };
const TO = { name: 'Kilo', role: 'Analytics Engineer', colors: ['#fde68a', '#fca5a5', '#fee2e2'] as [string, string, string] };

const STATUS: Record<Phase, string> = {
  idle: 'Vera traced the metric back to a duplicated join.',
  handing: 'Handing off to Kilo…',
  received: 'Kilo is patching the model to dedupe the join.',
};

export function AgentHandoff() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', false, {
    getInitialValueInEffect: false,
  });
  const [phase, setPhase] = useState<Phase>(reduced ? 'received' : 'idle');
  const [runId, setRunId] = useState(0);

  function handOff() {
    if (phase !== 'idle') return;
    if (reduced) return setPhase('received');
    setPhase('handing');
    window.setTimeout(() => setPhase('received'), 900);
  }

  function replay() {
    setPhase('idle');
    setRunId((r) => r + 1);
  }

  return (
    <Box className={classes.frame}>
      <Stack gap={20} align="center" className={classes.column}>
        <div className={classes.row}>
          <div className={classes.agent}>
            <GradientMark size={44} colors={FROM.colors} seed="vera" className={classes.orb} />
            <Text fz={13} fw={600} mt={8}>
              {FROM.name}
            </Text>
            <Text fz={11.5} c="dimmed">
              {FROM.role}
            </Text>
          </div>

          <div className={classes.track}>
            <div className={classes.trackLine} />
            {phase === 'handing' && (
              <span key={runId} className={classes.baton} style={{ '--c0': FROM.colors[1], '--c1': TO.colors[1] } as CSSProperties} />
            )}
          </div>

          <div className={classes.agent} data-lit={phase === 'received'}>
            <GradientMark size={44} colors={TO.colors} seed="kilo" className={classes.orb} />
            <Text fz={13} fw={600} mt={8}>
              {TO.name}
            </Text>
            <Text fz={11.5} c="dimmed">
              {TO.role}
            </Text>
          </div>
        </div>

        <Text key={phase} fz={13.5} ta="center" className={classes.status}>
          {STATUS[phase]}
        </Text>

        {phase === 'idle' ? (
          <Button size="xs" variant="default" onClick={handOff}>
            Hand off
          </Button>
        ) : (
          phase === 'received' && (
            <Button size="xs" variant="default" onClick={replay} leftSection={<RotateCcw size={13} strokeWidth={2.25} />}>
              Replay
            </Button>
          )
        )}
      </Stack>
    </Box>
  );
}
