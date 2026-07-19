/* CONTRACT: export function GhostCompletion() — a field with inline ghost-text AI
   autocomplete; Tab-to-accept slides the suggestion into place with a Tab kbd hint. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Box, Button, Group, Kbd, Paper, Stack, Text } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { Check } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './GhostCompletion.module.css';

/* A scripted "session": the user types a fragment, then the model proposes a
   completion. Fragments accumulate into one flowing paragraph. Fictional copy. */
interface Step {
  typed: string;
  ghost: string;
}

const STEPS: Step[] = [
  { typed: 'Draft the release notes for ', ghost: 'Northwind Analytics 3.2 — our fastest dashboard yet.' },
  { typed: ' Call out the ', ghost: 'new natural-language query bar and shareable saved views.' },
  { typed: ' Close with a ', ghost: 'warm note inviting the team to send feedback.' },
];

type Phase = 'type' | 'pause' | 'ghost' | 'ready' | 'settle';

const TYPE_MS = 40;
const GHOST_MS = 17;

export function GhostCompletion() {
  const reduced = useReducedMotion();

  const [stepIndex, setStepIndex] = useState(0);
  const [base, setBase] = useState('');
  const [typed, setTyped] = useState(0);
  const [ghost, setGhost] = useState(0);
  const [phase, setPhase] = useState<Phase>('type');
  const editorRef = useRef<HTMLDivElement>(null);

  const step = STEPS[stepIndex];
  const canAccept = phase === 'ghost' || phase === 'ready';

  // Fold the accepted suggestion into the real text and queue the next step.
  const advance = useCallback(() => {
    setStepIndex((prev) => {
      const next = (prev + 1) % STEPS.length;
      // Reset the paragraph when the loop restarts so the field stays legible.
      setBase(next === 0 ? '' : (b) => b + STEPS[prev].typed + STEPS[prev].ghost);
      return next;
    });
    setTyped(0);
    setGhost(0);
    setPhase('type');
  }, []);

  const accept = useCallback(() => {
    if (reduced) return;
    setPhase((p) => (p === 'ghost' || p === 'ready' ? 'settle' : p));
  }, [reduced]);

  // Single self-scheduling driver: each state change queues the next beat.
  useEffect(() => {
    if (reduced) return;
    let id: number;
    if (phase === 'type') {
      id = window.setTimeout(
        () => (typed < step.typed.length ? setTyped((n) => n + 1) : setPhase('pause')),
        typed < step.typed.length ? TYPE_MS : 480,
      );
    } else if (phase === 'pause') {
      id = window.setTimeout(() => setPhase('ghost'), 700);
    } else if (phase === 'ghost') {
      id = window.setTimeout(
        () => (ghost < step.ghost.length ? setGhost((n) => n + 1) : setPhase('ready')),
        ghost < step.ghost.length ? GHOST_MS : 260,
      );
    } else if (phase === 'ready') {
      id = window.setTimeout(accept, 1700);
    } else if (phase === 'settle') {
      id = window.setTimeout(advance, 470);
    }
    return () => window.clearTimeout(id);
  }, [phase, typed, ghost, step, reduced, accept, advance]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && canAccept) {
      e.preventDefault();
      accept();
    }
  };

  const typedText = reduced ? step.typed : step.typed.slice(0, typed);
  const ghostText = reduced ? step.ghost : step.ghost.slice(0, ghost);
  const settling = phase === 'settle';
  const showHint = reduced || phase === 'ready';

  return (
    <Box className={classes.wrap}>
      <Paper
        radius="lg"
        w="100%"
        styles={{
          root: {
            maxWidth: 620,
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            boxShadow: 'var(--app-shadow-raised)',
            overflow: 'hidden',
          },
        }}
      >
        <Stack gap={0}>
          {/* Header — product identity + a live "AI on" marker. */}
          <Group
            justify="space-between"
            px="lg"
            py="sm"
            style={{ borderBottom: '1px solid var(--app-border)' }}
          >
            <Group gap={9}>
              <GradientMark size={15} />
              <Text fz="sm" fw={600}>
                Northwind Composer
              </Text>
            </Group>
            <Badge
              variant="default"
              radius="sm"
              size="sm"
              styles={{
                root: {
                  textTransform: 'none',
                  fontWeight: 500,
                  color: 'var(--app-muted)',
                  background: 'var(--app-bg)',
                  border: '1px solid var(--app-border)',
                },
              }}
            >
              AI autocomplete
            </Badge>
          </Group>

          <Box p="lg">
            <Text className="eyebrow" mb={8}>
              Release notes · draft
            </Text>

            {/* The editable surface. Real text, blinking caret, dimmed ghost. */}
            <div
              ref={editorRef}
              className={classes.editor}
              tabIndex={0}
              role="textbox"
              aria-label="AI composer with inline suggestions"
              aria-readonly="true"
              onKeyDown={onKeyDown}
              onClick={() => editorRef.current?.focus()}
            >
              <span>
                {base}
                {typedText}
              </span>

              {settling ? (
                <span className={classes.settle}>{step.ghost}</span>
              ) : (
                <>
                  {!reduced && <span className={classes.caret} aria-hidden />}
                  {!reduced && phase === 'pause' && (
                    <span className={classes.thinking}>
                      <span className={classes.thinkingDot} aria-hidden />
                      <Text component="span" fz="xs" c="dimmed">
                        thinking
                      </Text>
                    </span>
                  )}
                  {ghostText && (
                    <span className={reduced ? classes.ghost : `${classes.ghost} ${classes.ghostIn}`}>
                      {ghostText}
                    </span>
                  )}
                  {showHint && ghostText && (
                    <span className={classes.hint} aria-hidden>
                      <Kbd>Tab</Kbd> to accept
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Footer — status line + explicit accept affordance. */}
            <Group justify="space-between" mt="md">
              <Text fz="xs" c="dimmed">
                {reduced
                  ? 'Suggestion ready'
                  : phase === 'pause'
                    ? 'Generating a suggestion…'
                    : canAccept
                      ? 'Suggestion ready'
                      : 'Keep typing…'}
              </Text>
              <Button
                size="xs"
                variant="default"
                leftSection={<Check size={14} strokeWidth={2} />}
                onClick={accept}
                disabled={!reduced && !canAccept}
                styles={{ root: { fontWeight: 500 } }}
              >
                Accept
              </Button>
            </Group>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
