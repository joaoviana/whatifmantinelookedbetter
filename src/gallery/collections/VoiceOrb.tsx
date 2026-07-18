/* CONTRACT: export function VoiceOrb() — an animated voice-input orb: a breathing
   gradient orb with a live waveform/ripple while "listening"; press to toggle. */
import { useEffect, useState } from 'react';
import { ActionIcon, Text } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { Mic } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './VoiceOrb.module.css';

type Status = 'idle' | 'listening' | 'thinking';

const TRANSCRIPT = 'Summarize the design review and draft a follow-up for the team.';
const BARS = [0, 1, 2, 3, 4, 5, 6];

const LABELS: Record<Status, string> = {
  idle: 'Tap the orb to speak',
  listening: 'Listening…',
  thinking: 'Thinking…',
};

export function VoiceOrb() {
  const [status, setStatus] = useState<Status>('idle');
  const [typed, setTyped] = useState('');
  const reduced = useReducedMotion();

  // Type the transcript in while listening; show it whole under reduced motion.
  useEffect(() => {
    if (status !== 'listening') return;
    if (reduced) {
      setTyped(TRANSCRIPT);
      return;
    }
    setTyped('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(TRANSCRIPT.slice(0, i));
      if (i >= TRANSCRIPT.length) window.clearInterval(id);
    }, 42);
    return () => window.clearInterval(id);
  }, [status, reduced]);

  // Thinking is transient — it settles back to idle on its own.
  useEffect(() => {
    if (status !== 'thinking') return;
    const id = window.setTimeout(() => setStatus('idle'), 2200);
    return () => window.clearTimeout(id);
  }, [status]);

  // Reset the transcript once we're back at rest.
  useEffect(() => {
    if (status === 'idle') setTyped('');
  }, [status]);

  const cycle = () =>
    setStatus((s) => (s === 'idle' ? 'listening' : s === 'listening' ? 'thinking' : 'idle'));

  const listening = status === 'listening';

  return (
    <div className={classes.frame}>
      <div className={classes.shell}>
        <div className={classes.stage}>
          {!reduced && listening && (
            <>
              <span className={classes.ripple} aria-hidden />
              <span className={classes.ripple} aria-hidden />
              <span className={classes.ripple} aria-hidden />
            </>
          )}

          <button
            type="button"
            className={classes.orb}
            data-state={status}
            onClick={cycle}
            aria-label={
              status === 'idle'
                ? 'Start voice input'
                : status === 'listening'
                  ? 'Stop and process'
                  : 'Processing'
            }
          >
            {/* Fine grain via feTurbulence, kept at very low opacity. */}
            <svg className={classes.grain} aria-hidden xmlns="http://www.w3.org/2000/svg">
              <filter id="voiceOrbGrain">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.85"
                  numOctaves="2"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#voiceOrbGrain)" />
            </svg>
          </button>
        </div>

        <div className={classes.readout}>
          <div className={classes.statusRow}>
            {status === 'thinking' ? (
              <span className={classes.spinner}>
                <GradientMark size={14} />
              </span>
            ) : (
              <span className={`${classes.pip} ${listening ? classes.pipLive : ''}`} aria-hidden />
            )}
            <Text size="sm" fw={550}>
              {LABELS[status]}
            </Text>
          </div>

          {listening && (
            <div className={classes.waveform} aria-hidden>
              {BARS.map((b) => (
                <span key={b} className={classes.bar} />
              ))}
            </div>
          )}

          {(listening || status === 'thinking') && (
            <div className={classes.transcript}>
              {typed}
              {listening && !reduced && typed.length < TRANSCRIPT.length && (
                <span className={classes.caret} aria-hidden />
              )}
            </div>
          )}
        </div>

        <ActionIcon
          onClick={cycle}
          size={42}
          radius="xl"
          variant={listening ? 'filled' : 'default'}
          aria-label={listening ? 'Stop listening' : 'Start listening'}
        >
          <Mic size={18} strokeWidth={1.75} />
        </ActionIcon>
      </div>
    </div>
  );
}
