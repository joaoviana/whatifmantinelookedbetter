/* CONTRACT: export function AskAnything() — a small dashboard that orbitises
   when ⌘ is held, turning the cursor into an agent orb you can point at any
   tile to ask about it. Click a tile and a scoped composer unfurls in place. */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { AgentCursor } from './AgentCursor';
import { buildSpark, TARGETS, type Target } from './data';
import { TileComposer } from './TileComposer';
import { useOrbitMode } from './useOrbitMode';
import classes from './AskAnything.module.css';

/** 30ms between tiles — short enough that the mode never feels slow to arm. */
const STAGGER_MS = 30;
/** Long-press threshold on touch, where there is no ⌘ to hold. */
const PRESS_MS = 400;
/** Room a fully-streamed composer needs, used to keep it inside the clipped
    card. Measured against the longest canned answer at the narrowest width. */
const PANEL_H = 210;
/** A tile-width panel is too cramped to read an answer in — and, on the full
    width tile, far too wide. Keep the measure in a comfortable band. */
const PANEL_MIN_W = 300;
const PANEL_MAX_W = 420;
/** Label + value + delta: the part of a tile the panel must never cover. */
const VALUE_H = 62;

function Tile({
  target,
  index,
  wide,
  active,
  pressActive,
  onPick,
  onKeyPick,
  onPressStart,
  onPressEnd,
  registerRef,
}: {
  target: Target;
  index: number;
  wide?: boolean;
  active: boolean;
  pressActive: boolean;
  onPick: (id: string, additive: boolean) => void;
  onKeyPick: (id: string) => void;
  onPressStart: (id: string) => void;
  onPressEnd: () => void;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
}) {
  const { line, area } = buildSpark(target.spark);
  const tone = target.up ? 'teal' : 'red';
  const Arrow = target.up ? ArrowUpRight : ArrowDownRight;

  return (
    <button
      type="button"
      ref={(el) => registerRef(target.id, el)}
      className={wide ? `${classes.target} ${classes.wide}` : classes.target}
      style={{ '--stagger': `${index * STAGGER_MS}ms` } as CSSProperties}
      data-active={active}
      aria-label={`Ask about ${target.label}`}
      onClick={(e) => onPick(target.id, e.metaKey || e.ctrlKey)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onKeyPick(target.id);
        }
      }}
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') onPressStart(target.id);
      }}
      onPointerUp={onPressEnd}
      onPointerCancel={onPressEnd}
      onContextMenu={(e) => {
        // iOS raises the callout menu on long-press; it would eat the gesture.
        if (pressActive) e.preventDefault();
      }}
    >
      <span className={classes.label}>{target.label}</span>
      <span className={classes.value}>{target.value}</span>
      <Text
        component="span"
        size="xs"
        c={tone}
        fw={600}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 4 }}
      >
        <Arrow size={12} strokeWidth={2.4} />
        {target.delta}
      </Text>
      <svg
        className={classes.spark}
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        aria-hidden
        style={{ color: `var(--mantine-color-${tone}-6)` }}
      >
        <path d={area} fill="currentColor" opacity={0.1} />
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </button>
  );
}

export function AskAnything() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)') ?? false;
  // No ⌘ to hold on a touch device, so the hint has to name the other gesture.
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)') ?? true;
  const orbit = useOrbitMode();

  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const tileRefs = useRef(new Map<string, HTMLButtonElement>());
  const dockRef = useRef<HTMLElement | null>(null);
  const dockPointRef = useRef<{ x: number; y: number } | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [anchor, setAnchor] = useState<{ top: number; left: number; width: number } | null>(null);
  const [keyboard, setKeyboard] = useState(false);
  const [pressing, setPressing] = useState(false);

  const registerRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) tileRefs.current.set(id, el);
    else tileRefs.current.delete(id);
  }, []);

  // Pointer position is kept in a ref, not in state — this fires on every
  // mouse move and must never trigger a React render.
  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (!orbit.armed) return;

    // Warm the nearest tile, cool the rest.
    let nearestId: string | null = null;
    let nearestDist = Infinity;
    tileRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - rect.left;
      const cy = r.top + r.height / 2 - rect.top;
      const d = Math.hypot(cx - pointerRef.current.x, cy - pointerRef.current.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearestId = id;
      }
    });
    tileRefs.current.forEach((el, id) => {
      if (id !== nearestId) {
        el.style.setProperty('--warm', '0');
        return;
      }
      const r = el.getBoundingClientRect();
      el.style.setProperty('--warm', '1');
      el.style.setProperty('--wx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--wy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  };

  const pick = (id: string, additive: boolean) => {
    // A click while idle is an ordinary click on an ordinary dashboard.
    if (orbit.mode === 'idle') return;
    dockRef.current = tileRefs.current.get(id) ?? null;
    orbit.dock(id, additive);
  };

  const keyPick = (id: string) => {
    setKeyboard(true);
    dockRef.current = tileRefs.current.get(id) ?? null;
    orbit.dockDirect(id);
  };

  /* Long-press goes straight to docked, skipping the peek: there is no pointer
     to aim with on touch, so peeking would show nothing useful. */
  const pressStart = (id: string) => {
    setPressing(true);
    pressTimer.current = setTimeout(() => {
      dockRef.current = tileRefs.current.get(id) ?? null;
      orbit.dockDirect(id);
      setPressing(false);
    }, PRESS_MS);
  };

  const pressEnd = () => {
    setPressing(false);
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  useEffect(
    () => () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
    },
    [],
  );

  // Measure the docked tile before paint, so the composer never lands wrong
  // for a frame and then corrects itself.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const last = orbit.chips[orbit.chips.length - 1];
    if (!root || !last) {
      setAnchor(null);
      return;
    }
    const el = tileRefs.current.get(last);
    if (!el) return;
    const rootRect = root.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    // Hang the composer off the tile's bottom edge so the number you asked
    // about stays visible above it — the answer belongs under the number, not
    // on top of it. Clamped so a bottom-row tile doesn't push the panel out of
    // the clipped card.
    // Hang off the tile's bottom edge, pulled up only as far as the card floor
    // requires — and never so far that it swallows the number itself. That
    // lower bound is why .root reserves room beneath the last row.
    const tileTop = r.top - rootRect.top;
    const floor = Math.min(r.bottom - rootRect.top - 10, rootRect.height - PANEL_H);
    const top = Math.max(8, tileTop + VALUE_H, floor);
    const width = Math.min(Math.max(r.width, PANEL_MIN_W), PANEL_MAX_W, rootRect.width - 16);
    const left = Math.max(8, Math.min(r.left - rootRect.left, rootRect.width - width - 8));
    setAnchor({ top, left, width });
    // The orb flies to the panel's own origin, so the unfurl reads as the orb
    // becoming the panel rather than as two things happening near each other.
    dockPointRef.current = { x: left + 12, y: top + 12 };
  }, [orbit.chips]);

  // Returning to idle cools every tile and hands focus back to whoever asked.
  useLayoutEffect(() => {
    if (orbit.armed) return;
    tileRefs.current.forEach((el) => el.style.setProperty('--warm', '0'));
    if (!keyboard) return;
    setKeyboard(false);
    (dockRef.current as HTMLButtonElement | null)?.focus();
  }, [orbit.armed, keyboard]);

  const [a, b, c, wide] = TARGETS;
  const tileProps = {
    pressActive: pressing,
    onPick: pick,
    onKeyPick: keyPick,
    onPressStart: pressStart,
    onPressEnd: pressEnd,
    registerRef,
  };

  return (
    <div
      ref={rootRef}
      className={classes.root}
      data-mode={orbit.mode}
      data-armed={orbit.armed}
      data-keyboard={keyboard}
      onPointerEnter={orbit.onPointerEnter}
      onPointerLeave={orbit.onPointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div className={`${classes.head} ${classes.chrome}`}>
        <div>
          <span className="eyebrow">Overview</span>
          <Title order={3} mt={4}>
            Dashboard
          </Title>
        </div>
        <Text size="sm" c="dimmed">
          {finePointer ? (
            <>
              Hold <kbd className={classes.kbd}>⌘</kbd> and point at a tile
            </>
          ) : (
            'Press and hold a tile'
          )}
        </Text>
      </div>

      <div className={classes.grid}>
        {[a, b, c].map((t, i) => (
          <Tile
            key={t.id}
            target={t}
            index={i}
            active={orbit.chips.includes(t.id)}
            {...tileProps}
          />
        ))}
        <Tile target={wide} index={3} wide active={orbit.chips.includes(wide.id)} {...tileProps} />
      </div>

      {(orbit.mode === 'docked' || orbit.mode === 'answering') && (
        <TileComposer
          key={orbit.chips.join(',')}
          targets={TARGETS.filter((t) => orbit.chips.includes(t.id))}
          anchorRect={anchor}
          onAsk={orbit.ask}
          onDismiss={orbit.reset}
          reduceMotion={reduceMotion}
        />
      )}

      <AgentCursor
        rootRef={rootRef}
        pointerRef={pointerRef}
        dockPointRef={dockPointRef}
        mode={orbit.mode}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}
