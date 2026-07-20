/* CONTRACT: export function AgentCursor({ rootRef, pointerRef, dockRef, mode,
   reduceMotion }) — the gradient orb that follows the pointer while peeking and
   springs to the docked tile's corner. Pure: it renders no state of its own. */
import { useEffect, useRef, type RefObject } from 'react';
import { GradientMark } from '../../../components/GradientMark';
import type { Mode } from './useOrbitMode';
import classes from './AgentCursor.module.css';

const SIZE = 18;

/* Spring constants. stiffness pulls toward the target, damping bleeds
   velocity. 0.22 / 0.72 lands at roughly Apple's { duration: 0.35, bounce:
   0.15 } — settled fast, a hint of overshoot, never wobbly. Integrating a
   spring (rather than transitioning) means a second click mid-flight retargets
   from the current velocity instead of restarting from zero. */
const STIFFNESS = 0.22;
const DAMPING = 0.72;

export function AgentCursor({
  rootRef,
  pointerRef,
  dockPointRef,
  mode,
  reduceMotion,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  pointerRef: RefObject<{ x: number; y: number }>;
  /** Where the composer will unfurl from, in root-relative pixels. The orb
      lands exactly there so the panel appears to grow out of it. */
  dockPointRef: RefObject<{ x: number; y: number } | null>;
  mode: Mode;
  reduceMotion: boolean;
}) {
  const orbRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const prevMode = useRef<Mode>('idle');

  useEffect(() => {
    // Arming from idle: start at the pointer, not at (0,0), or the orb flies
    // in from the card's top-left corner on every peek.
    if (prevMode.current === 'idle' && mode !== 'idle') {
      pos.current = { ...pointerRef.current };
      vel.current = { x: 0, y: 0 };
    }
    prevMode.current = mode;

    const orb = orbRef.current;
    const root = rootRef.current;
    if (!orb || !root || mode === 'idle') return;

    const tick = () => {
      let tx = pointerRef.current.x;
      let ty = pointerRef.current.y;

      const dockPoint = dockPointRef.current;
      if ((mode === 'docked' || mode === 'answering') && dockPoint) {
        tx = dockPoint.x;
        ty = dockPoint.y;
      }

      if (reduceMotion) {
        pos.current.x = tx;
        pos.current.y = ty;
      } else {
        vel.current.x = (vel.current.x + (tx - pos.current.x) * STIFFNESS) * DAMPING;
        vel.current.y = (vel.current.y + (ty - pos.current.y) * STIFFNESS) * DAMPING;
        pos.current.x += vel.current.x;
        pos.current.y += vel.current.y;
      }

      // Written straight to the element. Setting a CSS variable on the root
      // instead would recalculate styles for every child, sixty times a second.
      orb.style.transform = `translate3d(${pos.current.x - SIZE / 2}px, ${pos.current.y - SIZE / 2}px, 0)`;
      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [mode, reduceMotion, rootRef, pointerRef, dockPointRef]);

  return (
    <span
      ref={orbRef}
      className={classes.orb}
      data-visible={mode === 'peeking' || mode === 'docked'}
      data-handoff={mode === 'answering'}
      aria-hidden
    >
      <GradientMark size={SIZE} seed="ask-anything" />
    </span>
  );
}
