/* CONTRACT: export function TileComposer({ targets, anchorRect, onAsk,
   onDismiss, reduceMotion }) — the composer that unfurls from the docked orb.
   Chips name what you're asking about; the answer streams in place. */
import { useEffect, useRef, useState } from 'react';
import { ActionIcon } from '@mantine/core';
import { ArrowUp } from 'lucide-react';
import { GradientMark } from '../../../components/GradientMark';
import type { Target } from './data';
import classes from './TileComposer.module.css';

/* Matches AskAiBar's cadence so every AI pattern in the gallery streams at the
   same speed. */
const THINK_MS = 720;
const WORD_MS = 58;

function answerFor(targets: Target[]) {
  if (targets.length === 0) return '';
  if (targets.length === 1) return targets[0].answer;
  return (
    `${targets[0].label} and ${targets[1].label.toLowerCase()} move together until ` +
    'the release, then diverge — and that gap is almost all enterprise trials.'
  );
}

export function TileComposer({
  targets,
  anchorRect,
  onAsk,
  onDismiss,
  reduceMotion,
}: {
  targets: Target[];
  anchorRect: { top: number; left: number; width: number } | null;
  onAsk: () => void;
  onDismiss: () => void;
  reduceMotion: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const thinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const words = answerFor(targets).split(' ');
  const scopeKey = targets.map((t) => t.id).join(',');

  const clearTimers = () => {
    if (thinkTimer.current) clearTimeout(thinkTimer.current);
    if (streamTimer.current) clearInterval(streamTimer.current);
    thinkTimer.current = null;
    streamTimer.current = null;
  };

  useEffect(() => clearTimers, []);

  // Unfurl on the frame after the anchor lands, so the enter transition has a
  // start value. Keyed on the anchor rather than on mount: the first render
  // happens before the docked tile has been measured, and at that point there
  // is no input in the DOM to hand focus to.
  const hasAnchor = anchorRect !== null;
  useEffect(() => {
    if (!hasAnchor) return;
    const id = requestAnimationFrame(() => setOpen(true));
    inputRef.current?.focus({ preventScroll: true });
    return () => cancelAnimationFrame(id);
  }, [hasAnchor]);

  // Changing the chip set invalidates whatever was on screen.
  useEffect(() => {
    clearTimers();
    setRevealed(0);
    setStreaming(false);
  }, [scopeKey]);

  const submit = () => {
    clearTimers();
    onAsk();
    if (reduceMotion) {
      setRevealed(words.length);
      return;
    }
    setRevealed(0);
    setStreaming(true);
    thinkTimer.current = setTimeout(() => {
      streamTimer.current = setInterval(() => {
        setRevealed((n) => {
          const next = n + 1;
          if (next >= words.length) {
            if (streamTimer.current) clearInterval(streamTimer.current);
            streamTimer.current = null;
            setStreaming(false);
          }
          return next;
        });
      }, WORD_MS);
    }, THINK_MS);
  };

  if (!anchorRect) return null;

  return (
    <div
      className={classes.wrap}
      data-open={open}
      style={{
        top: anchorRect.top,
        left: anchorRect.left,
        width: anchorRect.width,
      }}
    >
      <div className={classes.panel}>
        <div className={classes.chips}>
          {targets.map((t) => (
            <span key={t.id} className={classes.chip} data-in={open}>
              <GradientMark size={12} seed={t.id} />
              {t.scope}
            </span>
          ))}
        </div>

        <div className={classes.row}>
          <input
            ref={inputRef}
            className={classes.input}
            value={value}
            placeholder="Ask about this…"
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                onDismiss();
              }
            }}
          />
          <ActionIcon variant="filled" size="sm" radius="xl" aria-label="Ask" onClick={submit}>
            <ArrowUp size={14} strokeWidth={2.4} />
          </ActionIcon>
        </div>

        {revealed > 0 && (
          <p className={classes.answer}>
            {words.slice(0, revealed).join(' ')}
            {streaming && <span className={classes.caret} />}
          </p>
        )}
      </div>
    </div>
  );
}
