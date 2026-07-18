/* CONTRACT: export function AskAiBar() — an omni "Ask AI" bar with a cycling
   placeholder (rotating prompts), a soft focus glow, and results streaming in. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActionIcon, Box, Group, Text, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ArrowUp, RotateCcw } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './AskAiBar.module.css';

const PROMPTS = [
  'How did activation trend this week?',
  'Summarize the latest deploy in three lines',
  'Which cohorts are churning fastest?',
  'Draft a release note for v2.4',
  'What should I look into today?',
];

const ANSWER =
  'Weekly active users climbed 12.4%, led by the EMEA cohort, while retention held ' +
  'steady near 68%. The refreshed onboarding lifted day-7 activation by roughly nine ' +
  'points. One thing worth a look: enterprise trial conversions dipped slightly after ' +
  "Tuesday's release — likely the new invite flow.";

type Status = 'idle' | 'thinking' | 'streaming' | 'done';

export function AskAiBar() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)') ?? false;
  const words = useMemo(() => ANSWER.split(' '), []);

  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [revealed, setRevealed] = useState(0);

  const thinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const idle = status === 'idle';
  const empty = value.trim() === '';
  const cyclePlaceholder = idle && empty && !focused;

  // (1) Cycle the placeholder while idle + empty + unfocused.
  useEffect(() => {
    if (!cyclePlaceholder || reduceMotion) return;
    const id = setInterval(() => {
      setPromptIndex((i) => (i + 1) % PROMPTS.length);
    }, 2500);
    return () => clearInterval(id);
  }, [cyclePlaceholder, reduceMotion]);

  const clearTimers = () => {
    if (thinkTimer.current) clearTimeout(thinkTimer.current);
    if (streamTimer.current) clearInterval(streamTimer.current);
    thinkTimer.current = null;
    streamTimer.current = null;
  };

  useEffect(() => clearTimers, []);

  // (2) Run the answer: brief thinking shimmer, then stream word-by-word.
  const run = () => {
    clearTimers();
    if (reduceMotion) {
      setRevealed(words.length);
      setStatus('done');
      return;
    }
    setRevealed(0);
    setStatus('thinking');
    thinkTimer.current = setTimeout(() => {
      setStatus('streaming');
      streamTimer.current = setInterval(() => {
        setRevealed((n) => {
          const next = n + 1;
          if (next >= words.length) {
            if (streamTimer.current) clearInterval(streamTimer.current);
            streamTimer.current = null;
            setStatus('done');
          }
          return next;
        });
      }, 58);
    }, 720);
  };

  const submit = () => {
    if (empty) return;
    run();
  };

  const showAnswer = status !== 'idle';
  const streaming = status === 'streaming';

  return (
    <div className={classes.wrap}>
      <div className={classes.inner}>
        <div className={`${classes.bar} ${focused ? classes.barFocused : ''}`}>
          <span
            className={[
              classes.glyph,
              focused || !empty ? classes.glyphActive : '',
              cyclePlaceholder ? classes.glyphBreathing : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <GradientMark size={18} />
          </span>

          <div className={classes.field}>
            <input
              className={classes.input}
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              aria-label="Ask AI anything"
            />
            {empty && !focused && (
              <div className={classes.placeholder} aria-hidden>
                <span key={promptIndex} className={reduceMotion ? '' : classes.placeholderRoll}>
                  {PROMPTS[promptIndex]}
                </span>
              </div>
            )}
          </div>

          <ActionIcon
            className={classes.submit}
            onClick={submit}
            disabled={empty}
            variant="filled"
            color="neutral"
            radius="xl"
            size={36}
            loading={status === 'thinking'}
            aria-label="Ask"
          >
            <ArrowUp size={17} strokeWidth={2} />
          </ActionIcon>
        </div>

        {showAnswer && (
          <Box className={`${classes.answer} ${reduceMotion ? '' : classes.answerEnter}`}>
            <Group justify="space-between" mb={10} align="center">
              <Text className="eyebrow" component="span">
                Answer
              </Text>
              {status === 'done' && (
                <UnstyledButton onClick={run} aria-label="Regenerate answer">
                  <Group gap={6} align="center">
                    <RotateCcw size={13} strokeWidth={1.75} style={{ color: 'var(--app-muted)' }} />
                    <Text size="xs" c="dimmed" fw={500}>
                      Regenerate
                    </Text>
                  </Group>
                </UnstyledButton>
              )}
            </Group>

            {status === 'thinking' ? (
              <div>
                <div className={classes.shimmerLine} style={{ width: '92%' }} />
                <div className={classes.shimmerLine} style={{ width: '78%' }} />
                <div className={classes.shimmerLine} style={{ width: '54%' }} />
              </div>
            ) : (
              <p className={classes.body}>
                {words.slice(0, revealed).map((w, i) => (
                  <span key={i} className={classes.word}>
                    {w}{' '}
                  </span>
                ))}
                {streaming && <span className={classes.caret} aria-hidden />}
              </p>
            )}
          </Box>
        )}
      </div>
    </div>
  );
}
