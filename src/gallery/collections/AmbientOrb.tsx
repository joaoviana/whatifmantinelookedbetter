/* CONTRACT: export function AmbientOrb() — a persistent floating assistant
   launcher: a small breathing gradient orb docked in the corner of any
   surface, that expands into a scoped quick-composer on click and collapses
   back when done. The "always one tap away" pattern — necessity over
   novelty: the orb is never in the way, and never more than a click deep. */
import { useEffect, useRef, useState } from 'react';
import { ActionIcon, Box, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ArrowUp, X } from 'lucide-react';
import classes from './AmbientOrb.module.css';

type Phase = 'idle' | 'open' | 'streaming' | 'done';

const SUGGESTIONS = ['Summarize this page', 'Draft a reply', 'Find related docs'];

const ANSWER =
  "This page covers Q3 planning — three workstreams are behind schedule, and the " +
  'infra migration is the one blocking the other two.';

export function AmbientOrb() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', false, {
    getInitialValueInEffect: false,
  });
  const [phase, setPhase] = useState<Phase>('idle');
  const [value, setValue] = useState('');
  const [shown, setShown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const words = ANSWER.split(' ');

  useEffect(() => {
    if (phase === 'open') window.setTimeout(() => inputRef.current?.focus(), 220);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'streaming') return;
    if (reduced) {
      setShown(words.length);
      setPhase('done');
      return;
    }
    setShown(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= words.length) {
        window.clearInterval(id);
        setPhase('done');
      }
    }, 32);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduced]);

  function ask(prompt: string) {
    setValue(prompt);
    setPhase('streaming');
  }

  function close() {
    setPhase('idle');
    setValue('');
    setShown(0);
  }

  const open = phase !== 'idle';

  return (
    <Box className={classes.frame}>
      {/* A believable "app surface" backdrop so the orb reads as docked onto
          something, not floating in a void. */}
      <div className={classes.backdrop} aria-hidden>
        <div className={classes.backdropLine} style={{ width: '62%' }} />
        <div className={classes.backdropLine} style={{ width: '84%' }} />
        <div className={classes.backdropLine} style={{ width: '40%' }} />
        <div className={classes.backdropCard} />
      </div>

      <div className={classes.dock} data-open={open}>
        {open && (
          <div className={classes.panel} role="dialog" aria-label="Ask the assistant">
            <div className={classes.panelHead}>
              <span className={classes.panelOrb} aria-hidden />
              <Text fz={13} fw={600}>
                Ask anything
              </Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                radius="md"
                onClick={close}
                aria-label="Close"
                ml="auto"
              >
                <X size={14} />
              </ActionIcon>
            </div>

            {phase === 'open' && (
              <>
                <div className={classes.chips}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" className={classes.chip} onClick={() => ask(s)}>
                      {s}
                    </button>
                  ))}
                </div>
                <form
                  className={classes.form}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (value.trim()) ask(value.trim());
                  }}
                >
                  <input
                    ref={inputRef}
                    className={classes.input}
                    placeholder="Ask about this page…"
                    value={value}
                    onChange={(e) => setValue(e.currentTarget.value)}
                  />
                  <ActionIcon type="submit" size={30} radius="xl" variant="filled" aria-label="Send">
                    <ArrowUp size={14} strokeWidth={2.5} />
                  </ActionIcon>
                </form>
              </>
            )}

            {(phase === 'streaming' || phase === 'done') && (
              <div className={classes.answer}>
                <Text fz={12.5} c="dimmed" mb={6}>
                  {value}
                </Text>
                <Text fz={13.5} lh={1.55}>
                  {words.slice(0, shown).join(' ')}
                  {phase === 'streaming' && <span className={classes.caret} />}
                </Text>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className={classes.launcher}
          data-open={open}
          onClick={() => setPhase((p) => (p === 'idle' ? 'open' : p))}
          aria-label={open ? 'Assistant panel open' : 'Open assistant'}
        >
          <span className={classes.launcherGlow} aria-hidden />
          <span className={classes.launcherOrb} aria-hidden />
        </button>
      </div>
    </Box>
  );
}
