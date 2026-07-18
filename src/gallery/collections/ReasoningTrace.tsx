/* CONTRACT: export function ReasoningTrace() — a collapsible chain-of-thought:
   "Thinking…" breathing dots, steps revealing one-by-one with a staggered slide/fade. */
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@mantine/hooks';
import { Check, ChevronDown } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './ReasoningTrace.module.css';

type Step = { title: string; detail: string };

const STEPS: Step[] = [
  {
    title: 'Parsing the request',
    detail: 'User wants a monthly revenue trend, broken out by plan tier.',
  },
  {
    title: 'Locating the right tables',
    detail: 'subscriptions and invoices join on account_id; charges holds amounts.',
  },
  {
    title: 'Choosing a grain',
    detail: 'Aggregating to calendar month keeps the series readable across a year.',
  },
  {
    title: 'Handling refunds',
    detail: 'Netting credited invoices so churned upgrades don’t double-count.',
  },
  {
    title: 'Composing the query',
    detail: 'Grouping by month and tier, ordered chronologically for the chart.',
  },
];

const REVEAL_MS = 620;
const THINK_SECONDS = 4;

export function ReasoningTrace() {
  const reduceMotion = useReducedMotion();

  // Reduced motion: everything is present and settled from the first frame.
  const [visible, setVisible] = useState(reduceMotion ? STEPS.length : 0);
  const [done, setDone] = useState(reduceMotion);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (reduceMotion) return;

    // Reveal steps one-by-one, then settle into the "Thought for Ns" state.
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= STEPS.length; i += 1) {
      timers.push(setTimeout(() => setVisible(i), REVEAL_MS * i));
    }
    timers.push(setTimeout(() => setDone(true), REVEAL_MS * STEPS.length + 500));
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  return (
    <div className={classes.wrap}>
      <div className={classes.panel}>
        <button
          type="button"
          className={classes.header}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <GradientMark size={22} />

          {done ? (
            <span className={classes.headerLabel}>Thought for {THINK_SECONDS}s</span>
          ) : (
            <span className={classes.headerLabel}>Thinking</span>
          )}

          {!done && (
            <span className={classes.dots} aria-hidden>
              <span className={classes.dot} />
              <span className={classes.dot} />
              <span className={classes.dot} />
            </span>
          )}

          <span className={classes.headerMeta}>
            {done && <span className={classes.duration}>{visible} steps</span>}
            <span
              className={classes.chevron}
              style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
            >
              <ChevronDown size={16} strokeWidth={2} />
            </span>
          </span>
        </button>

        <div className={classes.bodyGrid} data-collapsed={!expanded}>
          <div className={classes.bodyClip}>
            <div className={classes.steps}>
              {STEPS.slice(0, visible).map((step, i) => {
                const isComplete = done || i < visible - 1;
                const isActive = !done && i === visible - 1;
                return (
                  <div
                    key={step.title}
                    className={`${classes.step} ${reduceMotion ? '' : classes.stepReveal}`}
                  >
                    <span className={classes.marker}>
                      {isComplete ? (
                        <span className={classes.check}>
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                      ) : isActive ? (
                        <span className={classes.dotActive} />
                      ) : (
                        <span className={classes.dotPending} />
                      )}
                    </span>

                    <div className={classes.stepBody}>
                      <div className={classes.stepTitle}>{step.title}</div>
                      <div className={classes.stepDetail}>{step.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
