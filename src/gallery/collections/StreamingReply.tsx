/* CONTRACT: export function StreamingReply() — AI reply streaming in token-by-token
   (typewriter/opacity stagger) with a blinking caret + copy-morph-to-check. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActionIcon, Box, Button, Group, Paper, Text } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { Check, Copy, RefreshCw, Search } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './StreamingReply.module.css';

/* ── Fictional reply copy ─────────────────────────────────────────────── */
const PROSE =
  'Great question — the theme resolves tokens at the root, so every surface reads ' +
  'from the same palette. Flip the scheme and borders, shadows and the single ' +
  'accent all re-derive automatically. Here is the resolver those variables come from:';

const CODE_LINES: { text: string; kind: 'plain' | 'str' }[] = [
  { text: 'export const resolver = () => ({', kind: 'plain' },
  { text: "  light: { '--app-bg': '#fafafa' },", kind: 'str' },
  { text: "  dark:  { '--app-bg': 'var(--dark-7)' },", kind: 'str' },
  { text: '});', kind: 'plain' },
];

const WORDS = PROSE.split(' ');

/* Cadence tuned to feel like a real token stream, not a metronome. */
const TOOL_MS = 620; // chip settles before prose starts
const WORD_MS = 34; // per-word reveal
const CODE_DELAY_MS = 260; // beat after prose before code fades in

type Phase = 'tool' | 'streaming' | 'code' | 'done';

export function StreamingReply() {
  const reduced = useReducedMotion();
  const [runId, setRunId] = useState(0);
  const [phase, setPhase] = useState<Phase>('tool');
  const [shown, setShown] = useState(0);
  const [copied, setCopied] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* The stream itself — replays whenever runId changes. */
  useEffect(() => {
    // Reduced motion: no theatre, the whole answer is simply present.
    if (reduced) {
      setPhase('done');
      setShown(WORDS.length);
      return;
    }

    setPhase('tool');
    setShown(0);
    const t = timers.current;

    t.push(
      setTimeout(() => {
        setPhase('streaming');
        let i = 0;
        const tick = () => {
          i += 1;
          setShown(i);
          if (i < WORDS.length) {
            t.push(setTimeout(tick, WORD_MS));
          } else {
            t.push(
              setTimeout(() => {
                setPhase('code');
                t.push(setTimeout(() => setPhase('done'), 380));
              }, CODE_DELAY_MS),
            );
          }
        };
        tick();
      }, TOOL_MS),
    );

    return () => {
      t.forEach(clearTimeout);
      t.length = 0;
    };
  }, [runId, reduced]);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const regenerate = useCallback(() => {
    setCopied(false);
    setRunId((n) => n + 1);
  }, []);

  const onCopy = useCallback(() => {
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1600);
  }, []);

  const streaming = phase === 'tool' || phase === 'streaming';
  const showCode = phase === 'code' || phase === 'done';
  const done = phase === 'done';

  return (
    <Box className={classes.wrap}>
      <Paper className={classes.card} radius="lg" p="lg">
        {/* Identity row */}
        <Group gap="sm" className={classes.head}>
          <GradientMark size={30} className={classes.avatar} />
          <div>
            <Text fz="sm" fw={600} lh={1.15}>
              Atlas
            </Text>
            <Text className="eyebrow" component="span">
              Assistant
            </Text>
          </div>
          {streaming && (
            <Group gap={6} ml="auto" className={classes.status}>
              <span className={classes.pulse} />
              <Text fz="xs" c="dimmed">
                {phase === 'tool' ? 'Working' : 'Writing'}
              </Text>
            </Group>
          )}
        </Group>

        {/* Tool-call chip — lands first, then holds as context. */}
        <Group
          gap={7}
          className={classes.tool}
          data-visible={reduced || phase !== 'tool' ? true : undefined}
        >
          <Search size={13} strokeWidth={2} className={classes.toolIcon} />
          <Text fz="xs" fw={500}>
            Searched the docs
          </Text>
          <Text fz="xs" c="dimmed">
            · 3 sources
          </Text>
        </Group>

        {/* Streaming prose */}
        <Text className={classes.body} fz="sm">
          {reduced ? (
            PROSE
          ) : (
            <>
              {WORDS.slice(0, shown).map((w, i) => (
                <span key={i} className={classes.word}>
                  {w}{' '}
                </span>
              ))}
              {streaming && <span className={classes.caret} aria-hidden />}
            </>
          )}
        </Text>

        {/* Code block fades in once the prose lands. */}
        {showCode && (
          <Box className={classes.code} data-in={done || reduced ? true : undefined}>
            <div className={classes.codeBar}>
              <span className={classes.dot} />
              <Text className="eyebrow" component="span">
                resolver.ts
              </Text>
            </div>
            <pre className={classes.pre}>
              {CODE_LINES.map((l, i) => (
                <div key={i} className={classes.codeLine} data-kind={l.kind}>
                  {l.text}
                </div>
              ))}
            </pre>
          </Box>
        )}

        {/* Actions — active only when the stream settles. */}
        <Group gap="xs" mt="md" className={classes.actions} data-ready={done ? true : undefined}>
          <Button
            size="xs"
            variant="default"
            onClick={onCopy}
            disabled={!done}
            leftSection={
              <span className={classes.morph} data-copied={copied ? true : undefined}>
                <Copy size={13} strokeWidth={2} className={classes.mCopy} />
                <Check size={13} strokeWidth={2.4} className={classes.mCheck} />
              </span>
            }
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            size="xs"
            variant="subtle"
            color="gray"
            onClick={regenerate}
            leftSection={<RefreshCw size={13} strokeWidth={2} className={classes.regen} />}
          >
            Regenerate
          </Button>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="md"
            ml="auto"
            aria-label="Sources"
            disabled={!done}
          >
            <Search size={14} strokeWidth={2} />
          </ActionIcon>
        </Group>
      </Paper>
    </Box>
  );
}
