/* CONTRACT: export function PromptComposer() — the AI composer collection entry.
   Now a thin wrapper around the shared <AiComposer/> (the Agent-view composer,
   the single source of truth), centered inside a bordered frame with a helper line. */
import { Box, Text } from '@mantine/core';
import { AiComposer } from '../../components/AiComposer';
import classes from './PromptComposer.module.css';

const MODELS = [
  { value: 'opus-4.8', label: 'Claude Opus 4.8' },
  { value: 'sonnet-4.5', label: 'Claude Sonnet 4.5' },
  { value: 'haiku-4.5', label: 'Claude Haiku 4.5' },
];

export function PromptComposer() {
  return (
    <Box className={classes.frame}>
      <AiComposer
        models={MODELS}
        maxWidth={640}
        helperText={
          <>
            Atlas can make mistakes. Press{' '}
            <Text span fz="xs" fw={600} c="var(--mantine-color-text)">
              Enter
            </Text>{' '}
            to send,{' '}
            <Text span fz="xs" fw={600} c="var(--mantine-color-text)">
              Shift + Enter
            </Text>{' '}
            for a new line.
          </>
        }
      />
    </Box>
  );
}
