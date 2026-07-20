/* CONTRACT: export function VoiceOrb() — an immersive voice conversation: a
   big breathing gradient orb that listens, thinks behind a soft nebula halo,
   then speaks — building a real back-and-forth transcript underneath, not
   just one line of captions. Press the orb to advance the conversation. */
import { useEffect, useState } from 'react';
import { ActionIcon, ScrollArea, Text } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { Mic } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './VoiceOrb.module.css';

type Status = 'idle' | 'listening' | 'thinking' | 'speaking';
type Turn = { role: 'user' | 'assistant'; text: string };

const BARS = [0, 1, 2, 3, 4, 5, 6];

const EXCHANGES: { question: string; answer: string }[] = [
  {
    question: 'Summarize the design review and draft a follow-up for the team.',
    answer:
      'Three open threads: the empty-state copy, aside collapse timing, and who owns the ' +
      'onboarding illustrations. I drafted a follow-up assigning each to an owner with a Friday check-in.',
  },
  {
    question: "What's still blocking the release?",
    answer:
      'Just one thing now — the migration script needs a dry run against staging data before ' +
      "it's safe to ship. I can kick that off and ping you when it's clean.",
  },
];

const LABELS: Record<Status, string> = {
  idle: 'Tap the orb to speak',
  listening: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Responding…',
};

export function VoiceOrb() {
  const [status, setStatus] = useState<Status>('idle');
  const [typed, setTyped] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [exchangeIndex, setExchangeIndex] = useState(0);
  const reduced = useReducedMotion();

  const exchange = EXCHANGES[exchangeIndex % EXCHANGES.length];

  // Type the live line in while listening or speaking; show it whole under reduced motion.
  useEffect(() => {
    const source = status === 'listening' ? exchange.question : status === 'speaking' ? exchange.answer : '';
    if (!source) return;
    if (reduced) {
      setTyped(source);
      return;
    }
    setTyped('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(source.slice(0, i));
      if (i >= source.length) window.clearInterval(id);
    }, status === 'listening' ? 42 : 26);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, reduced]);

  // Thinking is transient — it settles into the spoken reply on its own.
  useEffect(() => {
    if (status !== 'thinking') return;
    const id = window.setTimeout(() => setStatus('speaking'), 1400);
    return () => window.clearTimeout(id);
  }, [status]);

  // Once the reply has fully typed, land it in the transcript and go idle.
  useEffect(() => {
    if (status !== 'speaking') return;
    if (typed.length < exchange.answer.length) return;
    const id = window.setTimeout(() => {
      setTurns((t) => [...t, { role: 'user', text: exchange.question }, { role: 'assistant', text: exchange.answer }]);
      setExchangeIndex((i) => i + 1);
      setStatus('idle');
      setTyped('');
    }, 900);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, typed]);

  function advance() {
    if (status !== 'idle') return;
    setStatus('listening');
    window.setTimeout(() => setStatus((s) => (s === 'listening' ? 'thinking' : s)), 1500);
  }

  const listening = status === 'listening';
  const speaking = status === 'speaking';
  const live = listening || status === 'thinking' || speaking;

  return (
    <div className={classes.frame}>
      <div className={classes.shell}>
        <div className={classes.stage} data-thinking={status === 'thinking'}>
          {!reduced && listening && (
            <>
              <span className={classes.ripple} aria-hidden />
              <span className={classes.ripple} aria-hidden />
              <span className={classes.ripple} aria-hidden />
            </>
          )}
          {!reduced && status === 'thinking' && <span className={classes.halo} aria-hidden />}

          <button
            type="button"
            className={classes.orb}
            data-state={status}
            onClick={advance}
            aria-label={status === 'idle' ? 'Start voice input' : LABELS[status]}
          >
            <svg className={classes.grain} aria-hidden xmlns="http://www.w3.org/2000/svg">
              <filter id="voiceOrbGrain">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
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
              <span className={`${classes.pip} ${listening || speaking ? classes.pipLive : ''}`} aria-hidden />
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

          {live && (
            <div className={classes.transcript} data-role={speaking ? 'assistant' : 'user'}>
              {typed}
              {!reduced && status !== 'thinking' && typed.length < (listening ? exchange.question : exchange.answer).length && (
                <span className={classes.caret} aria-hidden />
              )}
            </div>
          )}
        </div>

        {turns.length > 0 && (
          <ScrollArea.Autosize mah={140} className={classes.history} type="hover">
            <div className={classes.historyInner}>
              {turns.map((turn, i) => (
                <div key={i} className={classes.historyTurn} data-role={turn.role}>
                  <Text fz={11} fw={600} c="dimmed" tt="uppercase" lts="0.02em">
                    {turn.role === 'user' ? 'You' : 'Assistant'}
                  </Text>
                  <Text fz={13} lh={1.4}>
                    {turn.text}
                  </Text>
                </div>
              ))}
            </div>
          </ScrollArea.Autosize>
        )}

        <ActionIcon
          onClick={advance}
          size={42}
          radius="xl"
          variant={listening ? 'filled' : 'default'}
          disabled={status !== 'idle'}
          aria-label={listening ? 'Listening' : 'Start listening'}
        >
          <Mic size={18} strokeWidth={1.75} />
        </ActionIcon>
      </div>
    </div>
  );
}
