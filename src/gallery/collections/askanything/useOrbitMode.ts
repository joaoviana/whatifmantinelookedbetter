/* CONTRACT: export useOrbitMode() — the Ask anything state machine.
   idle → peeking (⌘ held 250ms while hovered) → docked (click latches, ⌘ may
   be released) → answering. Esc returns to idle from anywhere. Owns every
   global listener so the other twenty specimens never see the key. */
import { useCallback, useEffect, useRef, useState } from 'react';

export type Mode = 'idle' | 'peeking' | 'docked' | 'answering';

/** Hold threshold — long enough that a ⌘-Tab flicker never arms the mode. */
const HOLD_MS = 250;
/** Chips cap: 'compare these two' is the real use case. */
const MAX_CHIPS = 2;

export function useOrbitMode() {
  const [mode, setMode] = useState<Mode>('idle');
  const [chips, setChips] = useState<string[]>([]);

  const insideRef = useRef(false);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Listeners are registered once and read the live mode through this ref, so
  // they never need to re-bind on every state change.
  const modeRef = useRef<Mode>('idle');
  modeRef.current = mode;

  const clearHold = () => {
    if (holdRef.current) clearTimeout(holdRef.current);
    holdRef.current = null;
  };

  const reset = useCallback(() => {
    clearHold();
    setChips([]);
    setMode('idle');
  }, []);

  const dock = useCallback((id: string, additive: boolean) => {
    clearHold();
    setChips((prev) => {
      if (!additive) return [id];
      if (prev.includes(id)) return prev;
      // At the cap, the oldest chip falls off rather than the click doing nothing.
      return prev.length >= MAX_CHIPS ? [...prev.slice(1), id] : [...prev, id];
    });
    setMode('docked');
  }, []);

  /** Enter docked straight from idle — the keyboard and long-press paths never
      peek, because there is no pointer to aim with. */
  const dockDirect = useCallback((id: string) => {
    clearHold();
    setChips([id]);
    setMode('docked');
  }, []);

  const ask = useCallback(() => setMode('answering'), []);

  const onPointerEnter = useCallback(() => {
    insideRef.current = true;
  }, []);

  const onPointerLeave = useCallback(() => {
    insideRef.current = false;
    clearHold();
    // Leaving only disarms a peek. Docked means latched.
    if (modeRef.current === 'peeking') setMode('idle');
  }, []);

  useEffect(() => {
    const disarmPeek = () => {
      clearHold();
      if (modeRef.current === 'peeking') setMode('idle');
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        reset();
        return;
      }
      if (!(e.metaKey || e.ctrlKey)) return;
      if (!insideRef.current) return;
      if (modeRef.current !== 'idle') return;
      if (holdRef.current) return;
      holdRef.current = setTimeout(() => {
        holdRef.current = null;
        if (insideRef.current && modeRef.current === 'idle') setMode('peeking');
      }, HOLD_MS);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') disarmPeek();
    };

    // ⌘-Tab away from the window never delivers a keyup, so the mode would
    // stick armed until the next pointer move. Blur closes that hole.
    const onBlur = () => disarmPeek();
    const onScroll = () => disarmPeek();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('scroll', onScroll);
      clearHold();
    };
  }, [reset]);

  return {
    mode,
    chips,
    armed: mode !== 'idle',
    dock,
    dockDirect,
    ask,
    reset,
    onPointerEnter,
    onPointerLeave,
  };
}
