# Ask anything Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `ask-anything` specimen to the gallery's AI Patterns where holding ⌘ over a small dashboard orbitises it, the cursor becomes a gradient agent orb, and clicking a tile docks a scoped composer that streams an answer in place.

**Architecture:** One stateful container (`AskAnything`) owns a four-state machine extracted into `useOrbitMode`, and renders four `<button>` targets plus two presentational children — `AgentCursor` (rAF spring following the pointer, writing `transform` straight to the element) and `TileComposer` (chips, input, word-by-word stream). All motion is CSS transitions driven by `data-` attributes on the root, so states can interrupt each other mid-flight.

**Tech Stack:** React 19, Mantine 9, TypeScript, CSS Modules, `lucide-react`, Vite.

## Global Constraints

- **No test runner exists in this repo** (`package.json` has `dev`, `build`, `preview`, `lint`, `format` — no vitest, no jest). Do not add one; this is a visual specimen gallery and the repo has deliberately stayed test-free. Every task is verified by `pnpm build` (which runs `tsc -b`, so it is a real type gate), `pnpm lint`, and the **explicit manual browser checks written into each task**. Treat a failed manual check exactly as you would a failed test: stop, fix, re-verify.
- Dev server: `pnpm dev` → http://localhost:5180. The specimen lives under the **Patterns** tab.
- Only `transform`, `opacity`, and `filter` may be animated. Never animate `width`, `height`, `padding`, `margin`, or `top`/`left`.
- Use CSS **transitions**, never `@keyframes`, for anything the user can re-trigger rapidly (arming, docking, chips).
- Custom easing curves only. Declare once on `.root` and reuse:
  `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);` and `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);`
- Never `ease-in` on a UI transition. Never animate from `scale(0)`.
- Exit transitions are faster than enter transitions (120ms vs 180ms) and carry no stagger.
- Colors come from theme tokens: `var(--app-border)`, `var(--app-border-strong)`, `var(--app-surface)`, `var(--app-muted)`, `var(--app-focus-ring)`, `var(--mantine-color-text)`, `var(--mantine-color-dimmed)`. The **only** raw color in the feature is the orb's gradient, which comes from `GradientMark`'s own defaults.
- Every file starts with a `/* CONTRACT: ... */` comment describing its export, matching the convention in `src/gallery/collections/*.tsx`.
- Both color schemes must be checked on every visual task. The scheme toggle is in the app header.

---

## File Structure

All new files live in a new folder, `src/gallery/collections/askanything/`:

| File | Responsibility |
| --- | --- |
| `data.ts` | Static targets (label, scope, value, spark, canned answer) and the sparkline path builder. No React. |
| `useOrbitMode.ts` | The `idle → peeking → docked → answering` state machine, plus every global listener (keydown, keyup, blur, scroll). No DOM rendering. |
| `AgentCursor.tsx` | The orb. rAF spring, pointer follow, dock travel. Driven entirely by props. |
| `TileComposer.tsx` | Docked composer: chips, input, send, word-by-word stream. |
| `AskAnything.tsx` | Container. Renders the dashboard, wires the hook, owns pointer tracking and proximity warmth. |
| `AskAnything.module.css` | Root, chrome dimming, target lift/stagger/warmth. |
| `AgentCursor.module.css` | Orb positioning, visibility, blur handoff. |
| `TileComposer.module.css` | Composer surface, chips, answer. |

Modified: `src/gallery/collections/registry.ts` (one import + one array entry).

The spec named three components; this adds `data.ts` and `useOrbitMode.ts` so the container stays readable — the state machine is the subtlest part of the feature and deserves to be inspectable on its own.

---

### Task 1: Static dashboard + registry entry

The specimen appears in the gallery and looks like a normal dashboard. No mode, no orb, no interactivity. This exists first so every later task has something real to arm.

**Files:**
- Create: `src/gallery/collections/askanything/data.ts`
- Create: `src/gallery/collections/askanything/AskAnything.tsx`
- Create: `src/gallery/collections/askanything/AskAnything.module.css`
- Modify: `src/gallery/collections/registry.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Target = { id: string; label: string; scope: string; value: string; delta: string; up: boolean; spark: number[]; answer: string }`
  - `const TARGETS: Target[]` — exactly 4 entries with ids `revenue`, `users`, `conversion`, `trend`
  - `function buildSpark(values: number[]): { line: string; area: string }`
  - `export function AskAnything(): JSX.Element`

- [ ] **Step 1: Create the data module**

Create `src/gallery/collections/askanything/data.ts`:

```ts
/* CONTRACT: export TARGETS, buildSpark — static content for the Ask anything
   specimen. The KPI numbers deliberately match StatsDashboard so the gallery
   tells one consistent story. */

export type Target = {
  id: string;
  label: string;
  /** Short scope shown in the composer chip, e.g. "Revenue · Q3". */
  scope: string;
  value: string;
  delta: string;
  up: boolean;
  spark: number[];
  /** Canned answer streamed when this target is asked about alone. */
  answer: string;
};

export const TARGETS: Target[] = [
  {
    id: 'revenue',
    label: 'Recurring revenue',
    scope: 'Revenue · Q3',
    value: '$128.4k',
    delta: '12.4%',
    up: true,
    spark: [42, 40, 45, 44, 52, 55, 61, 60, 68, 74, 79, 88],
    answer:
      'Revenue is up 12.4% on the quarter, and almost all of it is expansion rather ' +
      'than new logos — EMEA seats grew 19% while the account count barely moved. ' +
      'The one soft spot is Team-tier upgrades, which have flattened since June.',
  },
  {
    id: 'users',
    label: 'Active users',
    scope: 'Active users · 30d',
    value: '8,942',
    delta: '4.1%',
    up: true,
    spark: [58, 60, 57, 63, 62, 66, 65, 70, 69, 73, 76, 79],
    answer:
      'Weekly actives climbed 4.1%, led by the refreshed onboarding — day-7 activation ' +
      'is up roughly nine points on cohorts that saw it. Weekend usage is flat, which ' +
      'is normal for this account mix.',
  },
  {
    id: 'conversion',
    label: 'Conversion',
    scope: 'Conversion · 30d',
    value: '3.8%',
    delta: '0.6pp',
    up: false,
    spark: [70, 68, 71, 66, 64, 65, 60, 58, 59, 54, 52, 49],
    answer:
      'Conversion slipped 0.6pp, concentrated entirely in enterprise trials after ' +
      "Tuesday's release. Self-serve held steady, which points at the new invite flow " +
      'rather than at demand.',
  },
  {
    id: 'trend',
    label: 'Signups',
    scope: 'Signups · 12 weeks',
    value: '2,410',
    delta: '8.2%',
    up: true,
    spark: [30, 34, 33, 39, 44, 42, 51, 55, 54, 62, 68, 74],
    answer:
      'Signups have compounded steadily for twelve weeks with no single spike, which ' +
      'usually means the channel mix is healthy rather than one campaign carrying it. ' +
      'Paid share actually fell over the period.',
  },
];

/** Normalized sparkline (line + soft area) inside a 100×30 viewBox.
    preserveAspectRatio="none" stretches it to the tile width; strokes stay
    uniform via vectorEffect on the rendered elements. */
export function buildSpark(values: number[]) {
  const w = 100;
  const h = 30;
  const pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = pad + (h - pad * 2) * (1 - (v - min) / range);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const area = `${pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ')} L${w},${h} L0,${h} Z`;
  return { line, area };
}
```

- [ ] **Step 2: Create the stylesheet**

Create `src/gallery/collections/askanything/AskAnything.module.css`:

```css
/*
 * Ask anything — hold ⌘ and the dashboard orbitises. This file owns the two
 * global state changes (chrome dimming, target lift) plus the per-target
 * proximity warmth. All of it is driven by data- attributes on .root so the
 * transitions stay interruptible.
 */

.root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  position: relative;
  padding: 24px;
  /* Clips the orb to the specimen so it never escapes into the gallery. */
  overflow: hidden;
  isolation: isolate;
}

@media (max-width: 36em) {
  .root {
    padding: 16px 12px;
  }
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 48em) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.wide {
  grid-column: 1 / -1;
}

/* A target is a real <button> so keyboard users reach it without ⌘. */
.target {
  position: relative;
  display: block;
  width: 100%;
  padding: 14px;
  text-align: left;
  border: 1px solid var(--app-border);
  border-radius: var(--mantine-radius-md);
  background: var(--app-surface);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.target:focus-visible {
  outline: none;
  border-color: var(--app-border-strong);
  box-shadow: var(--app-focus-ring);
}

.label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--app-muted);
}

.value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.spark {
  display: block;
  width: 100%;
  height: 32px;
  margin-top: 10px;
  overflow: visible;
}

.wide .spark {
  height: 56px;
}
```

- [ ] **Step 3: Create the container**

Create `src/gallery/collections/askanything/AskAnything.tsx`:

```tsx
/* CONTRACT: export function AskAnything() — a small dashboard that orbitises
   when ⌘ is held, turning the cursor into an agent orb you can point at any
   tile to ask about it. */
import { Text, Title } from '@mantine/core';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { buildSpark, TARGETS, type Target } from './data';
import classes from './AskAnything.module.css';

function Tile({ target, wide }: { target: Target; wide?: boolean }) {
  const { line, area } = buildSpark(target.spark);
  const tone = target.up ? 'teal' : 'red';
  const Arrow = target.up ? ArrowUpRight : ArrowDownRight;

  return (
    <button
      type="button"
      className={wide ? `${classes.target} ${classes.wide}` : classes.target}
    >
      <span className={classes.label}>{target.label}</span>
      <span className={classes.value}>{target.value}</span>
      <Text component="span" size="xs" c={tone} fw={600} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
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
  const [a, b, c, wide] = TARGETS;

  return (
    <div className={classes.root}>
      <div className={classes.head}>
        <div>
          <span className="eyebrow">Overview</span>
          <Title order={3} mt={4}>
            Dashboard
          </Title>
        </div>
        <Text size="sm" c="dimmed">
          Last 30 days
        </Text>
      </div>

      <div className={classes.grid}>
        <Tile target={a} />
        <Tile target={b} />
        <Tile target={c} />
        <Tile target={wide} wide />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Register the specimen**

In `src/gallery/collections/registry.ts`, add the import after the `AgentMentionComposer` import (currently line 23):

```ts
import { AskAnything } from './askanything/AskAnything';
```

And add this as the **last** entry of the `AI_PATTERNS` array, immediately after the `agent-mention` entry:

```ts
  { id: 'ask-anything', title: 'Ask anything', description: 'Hold ⌘ and the dashboard orbitises — point the agent orb at any tile to ask about it.', Component: AskAnything },
```

- [ ] **Step 5: Verify the build and lint pass**

Run: `pnpm build && pnpm lint`
Expected: `tsc -b` emits nothing, vite prints `✓ built in …`, oxlint reports `Found 0 warnings and 0 errors`.

- [ ] **Step 6: Verify in the browser**

Run: `pnpm dev`, open http://localhost:5180, go to the **Patterns** tab, scroll to "Ask anything".
Expected: four tiles — three in a row, one full width below — each showing a label, a number, a colored delta, and a sparkline. Tiles look like the rest of the gallery (hairline border, surface background). Nothing moves on ⌘. Check both color schemes; the sparklines and borders must read correctly in dark mode.

- [ ] **Step 7: Commit**

```bash
git add src/gallery/collections/askanything src/gallery/collections/registry.ts
git commit -m "Add static Ask anything dashboard specimen"
```

---

### Task 2: The mode state machine

The dashboard now arms and disarms. Still no orb, no composer — this task is about the state transitions and the two global visual changes being correct and interruptible.

**Files:**
- Create: `src/gallery/collections/askanything/useOrbitMode.ts`
- Modify: `src/gallery/collections/askanything/AskAnything.tsx`
- Modify: `src/gallery/collections/askanything/AskAnything.module.css`

**Interfaces:**
- Consumes: `TARGETS` from `./data`.
- Produces:
  - `type Mode = 'idle' | 'peeking' | 'docked' | 'answering'`
  - `function useOrbitMode(): { mode: Mode; chips: string[]; armed: boolean; dock(id: string, additive: boolean): void; ask(): void; reset(): void; onPointerEnter(): void; onPointerLeave(): void }`
  - `armed` is `true` for `peeking`, `docked`, and `answering` — i.e. any state where the chrome is dimmed.

- [ ] **Step 1: Write the hook**

Create `src/gallery/collections/askanything/useOrbitMode.ts`:

```ts
/* CONTRACT: export useOrbitMode() — the Ask anything state machine.
   idle → peeking (⌘ held 250ms while hovered) → docked (click latches, ⌘ may
   be released) → answering. Esc returns to idle from anywhere. Owns every
   global listener so the other twenty specimens never see the key. */
import { useCallback, useEffect, useRef, useState } from 'react';

export type Mode = 'idle' | 'peeking' | 'docked' | 'answering';

/** Hold threshold — long enough that a ⌘-Tab flicker never arms the mode. */
const HOLD_MS = 250;
/** Chips cap: "compare these two" is the real use case. */
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
    ask,
    reset,
    onPointerEnter,
    onPointerLeave,
  };
}
```

- [ ] **Step 2: Add the armed visuals to the stylesheet**

Append to `src/gallery/collections/askanything/AskAnything.module.css`:

```css
/* ── Armed state ──────────────────────────────────────────────────
   Non-target chrome desaturates rather than greying out, so the dashboard
   still reads as itself while you aim at it. */
.chrome {
  transition:
    filter 180ms var(--ease-out),
    opacity 180ms var(--ease-out);
}

.root[data-armed='true'] .chrome {
  filter: saturate(0.35);
  opacity: 0.55;
}

/* Enter: 180ms + a 30ms per-tile stagger set inline as --stagger.
   Exit: 120ms, no stagger — a reversed stagger reads as sloppy, not
   symmetric, and exits should always be quicker than entrances. */
.target {
  transition:
    transform 180ms var(--ease-out),
    border-color 180ms var(--ease-out),
    filter 180ms var(--ease-out),
    opacity 180ms var(--ease-out);
  transition-delay: var(--stagger, 0ms);
}

.root[data-armed='false'] .target {
  transition-duration: 120ms;
  transition-delay: 0ms;
}

.root[data-armed='true'] .target {
  transform: translateY(-2px);
  border-color: var(--app-border-strong);
}

/* Press feedback — instant confirmation the interface heard the click.
   Repeats the lift so the press composes with it instead of cancelling it. */
.root[data-armed='true'] .target:active {
  transform: translateY(-2px) scale(0.985);
  transition-duration: 120ms;
  transition-delay: 0ms;
}

/* Docked: the asked tile stays lit, everything else falls back further. */
.root[data-mode='docked'] .target[data-active='false'],
.root[data-mode='answering'] .target[data-active='false'] {
  transform: none;
  filter: saturate(0.35);
  opacity: 0.4;
}

/* Keyboard arrives without the ⌘ peek, so it must not wait on decoration. */
.root[data-keyboard='true'] .target {
  transition-delay: 0ms;
}

@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not zero: opacity still carries the state change. */
  .target,
  .root[data-armed='true'] .target {
    transform: none;
    transition-delay: 0ms;
    transition-duration: 120ms;
  }
}
```

- [ ] **Step 3: Wire the hook into the container**

Rewrite `src/gallery/collections/askanything/AskAnything.tsx`. The `Tile` function gains props and the container gains the hook:

```tsx
/* CONTRACT: export function AskAnything() — a small dashboard that orbitises
   when ⌘ is held, turning the cursor into an agent orb you can point at any
   tile to ask about it. */
import { Text, Title } from '@mantine/core';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { buildSpark, TARGETS, type Target } from './data';
import { useOrbitMode } from './useOrbitMode';
import classes from './AskAnything.module.css';

/** 30ms between tiles — short enough that the mode never feels slow to arm. */
const STAGGER_MS = 30;

function Tile({
  target,
  index,
  wide,
  active,
  onPick,
}: {
  target: Target;
  index: number;
  wide?: boolean;
  active: boolean;
  onPick: (id: string, additive: boolean) => void;
}) {
  const { line, area } = buildSpark(target.spark);
  const tone = target.up ? 'teal' : 'red';
  const Arrow = target.up ? ArrowUpRight : ArrowDownRight;

  return (
    <button
      type="button"
      className={wide ? `${classes.target} ${classes.wide}` : classes.target}
      style={{ '--stagger': `${index * STAGGER_MS}ms` } as React.CSSProperties}
      data-active={active}
      aria-label={`Ask about ${target.label}`}
      onClick={(e) => onPick(target.id, e.metaKey || e.ctrlKey)}
    >
      <span className={classes.label}>{target.label}</span>
      <span className={classes.value}>{target.value}</span>
      <Text component="span" size="xs" c={tone} fw={600} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
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
  const orbit = useOrbitMode();
  const [a, b, c, wide] = TARGETS;

  const pick = (id: string, additive: boolean) => {
    // A click while idle is an ordinary click on an ordinary dashboard.
    if (orbit.mode === 'idle') return;
    orbit.dock(id, additive);
  };

  return (
    <div
      className={classes.root}
      data-mode={orbit.mode}
      data-armed={orbit.armed}
      onPointerEnter={orbit.onPointerEnter}
      onPointerLeave={orbit.onPointerLeave}
    >
      <div className={`${classes.head} ${classes.chrome}`}>
        <div>
          <span className="eyebrow">Overview</span>
          <Title order={3} mt={4}>
            Dashboard
          </Title>
        </div>
        <Text size="sm" c="dimmed">
          Last 30 days
        </Text>
      </div>

      <div className={classes.grid}>
        {[a, b, c].map((t, i) => (
          <Tile
            key={t.id}
            target={t}
            index={i}
            active={orbit.chips.includes(t.id)}
            onPick={pick}
          />
        ))}
        <Tile
          target={wide}
          index={3}
          wide
          active={orbit.chips.includes(wide.id)}
          onPick={pick}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify the build and lint pass**

Run: `pnpm build && pnpm lint`
Expected: clean, as in Task 1.

- [ ] **Step 5: Verify every transition by hand**

With `pnpm dev` running, on the "Ask anything" specimen:

| Action | Expected |
| --- | --- |
| Hover the card, hold ⌘ | After a beat, header desaturates and the four tiles lift 2px in sequence |
| Tap ⌘ quickly | Nothing arms |
| Hold ⌘, move pointer off the card | Instantly disarms |
| Hold ⌘, scroll | Instantly disarms |
| Hold ⌘, then ⌘-Tab to another app and back | Disarmed, not stuck |
| Hold ⌘, click a tile, release ⌘ | Stays armed; clicked tile lit, other three dim further |
| While docked, ⌘-click a second tile | Both lit |
| While docked, ⌘-click a third | The first falls off; two lit |
| Press Esc | Everything returns to idle |
| Click a tile without ⌘ | Nothing happens |
| Hold ⌘ over a *different* specimen | The Ask anything specimen does not arm |

Also confirm in DevTools → Rendering → "Emulate prefers-reduced-motion: reduce": arming still dims, but no tile lifts.

- [ ] **Step 6: Commit**

```bash
git add src/gallery/collections/askanything
git commit -m "Add Ask anything orbit-mode state machine"
```

---

### Task 3: The agent cursor

**Files:**
- Create: `src/gallery/collections/askanything/AgentCursor.tsx`
- Create: `src/gallery/collections/askanything/AgentCursor.module.css`
- Modify: `src/gallery/collections/askanything/AskAnything.tsx`
- Modify: `src/gallery/collections/askanything/AskAnything.module.css`

**Interfaces:**
- Consumes: `Mode` from `./useOrbitMode`; `GradientMark` from `../../../components/GradientMark`.
- Produces: `function AgentCursor(props: { rootRef: RefObject<HTMLDivElement | null>; pointerRef: RefObject<{ x: number; y: number }>; dockRef: RefObject<HTMLElement | null>; mode: Mode; reduceMotion: boolean }): JSX.Element`

- [ ] **Step 1: Write the orb stylesheet**

Create `src/gallery/collections/askanything/AgentCursor.module.css`:

```css
/*
 * The agent cursor. Position is written to .orb's transform every frame by
 * rAF — never by a CSS transition, because a transitioned cursor lags the
 * pointer and reads as broken. Only opacity and blur are transitioned here.
 */

.orb {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  pointer-events: none;
  opacity: 0;
  will-change: transform;
  transition:
    opacity 140ms var(--ease-out),
    filter 200ms var(--ease-out);
}

.orb[data-visible='true'] {
  opacity: 1;
}

/* Blur bridges the orb → composer handoff. Without it the eye sees two
   objects crossfading; with it, one thing becoming another. Kept at 2px —
   heavy blur is expensive, especially in Safari. */
.orb[data-handoff='true'] {
  filter: blur(2px);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .orb {
    transition-duration: 100ms;
  }
  .orb[data-handoff='true'] {
    filter: none;
  }
}
```

- [ ] **Step 2: Write the orb component**

Create `src/gallery/collections/askanything/AgentCursor.tsx`:

```tsx
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
  dockRef,
  mode,
  reduceMotion,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  pointerRef: RefObject<{ x: number; y: number }>;
  dockRef: RefObject<HTMLElement | null>;
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
      const rootRect = root.getBoundingClientRect();
      let tx = pointerRef.current.x;
      let ty = pointerRef.current.y;

      const dockEl = dockRef.current;
      if ((mode === 'docked' || mode === 'answering') && dockEl) {
        const d = dockEl.getBoundingClientRect();
        tx = d.left - rootRect.left + 14;
        ty = d.top - rootRect.top + 14;
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
  }, [mode, reduceMotion, rootRef, pointerRef, dockRef]);

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
```

- [ ] **Step 3: Add proximity warmth to the stylesheet**

Append to `src/gallery/collections/askanything/AskAnything.module.css`:

```css
/* Proximity light. --warm / --wx / --wy are written directly onto the nearest
   target element (never onto .root — an inherited variable would recalc every
   child on every pointer move). Reads as light rather than as a hover state. */
.target::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;
  opacity: var(--warm, 0);
  background: radial-gradient(
    140px 140px at var(--wx, 50%) var(--wy, 50%),
    color-mix(in oklab, var(--mantine-color-pink-4) 24%, transparent),
    transparent 70%
  );
  transition: opacity 220ms var(--ease-out);
}

/* Native cursor gives way to the orb while armed. */
.root[data-armed='true'] {
  cursor: none;
}

/* Touch and coarse pointers never get the orb, so they keep their cursor. */
@media not all and (hover: hover) and (pointer: fine) {
  .root[data-armed='true'] {
    cursor: auto;
  }
}
```

- [ ] **Step 4: Track the pointer and mount the orb**

In `src/gallery/collections/askanything/AskAnything.tsx`, add these imports:

```tsx
import { useCallback, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { AgentCursor } from './AgentCursor';
```

Change the `style` cast in `Tile` from `React.CSSProperties` to `CSSProperties`, and add a `refCallback` prop so the container can measure each tile:

```tsx
function Tile({
  target,
  index,
  wide,
  active,
  onPick,
  registerRef,
}: {
  target: Target;
  index: number;
  wide?: boolean;
  active: boolean;
  onPick: (id: string, additive: boolean) => void;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
}) {
```

and on the `<button>`:

```tsx
      ref={(el) => registerRef(target.id, el)}
```

Then in `AskAnything`, above the `pick` handler:

```tsx
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)') ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const tileRefs = useRef(new Map<string, HTMLButtonElement>());
  const dockRef = useRef<HTMLElement | null>(null);

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
```

Extend `pick` so it records the docking element:

```tsx
  const pick = (id: string, additive: boolean) => {
    if (orbit.mode === 'idle') return;
    dockRef.current = tileRefs.current.get(id) ?? null;
    orbit.dock(id, additive);
  };
```

And update the root element and the tile calls:

```tsx
    <div
      ref={rootRef}
      className={classes.root}
      data-mode={orbit.mode}
      data-armed={orbit.armed}
      onPointerEnter={orbit.onPointerEnter}
      onPointerLeave={orbit.onPointerLeave}
      onPointerMove={handlePointerMove}
    >
```

Pass `registerRef={registerRef}` to all four `<Tile>` calls, and render the orb as the last child inside the root, after `</div>` of `classes.grid`:

```tsx
      <AgentCursor
        rootRef={rootRef}
        pointerRef={pointerRef}
        dockRef={dockRef}
        mode={orbit.mode}
        reduceMotion={reduceMotion}
      />
```

- [ ] **Step 5: Verify the build and lint pass**

Run: `pnpm build && pnpm lint`
Expected: clean.

- [ ] **Step 6: Verify the orb by hand**

| Action | Expected |
| --- | --- |
| Arm the mode | Native cursor disappears; a small gradient orb appears **at the pointer**, not flying in from a corner |
| Move the pointer around | The orb trails slightly behind with weight — it should never feel rubber-banded or laggy |
| Move between tiles | The nearest tile takes a soft pink glow that follows the pointer within it; the others cool off |
| Move to the card's edge | The orb clips at the border and never escapes into the gallery |
| Click a tile | The orb springs to that tile's top-left corner and settles with a slight overshoot |
| Click a second tile mid-flight | It retargets smoothly from where it was — no jump back to the pointer |
| Emulate reduced motion | The orb snaps to the pointer with no trail |

Open DevTools → Performance, record while moving the pointer for three seconds: the orb must not appear in the "Recalculate Style" rows for the tile subtree.

- [ ] **Step 7: Commit**

```bash
git add src/gallery/collections/askanything
git commit -m "Add Ask anything agent cursor with spring follow and proximity light"
```

---

### Task 4: The docked composer

**Files:**
- Create: `src/gallery/collections/askanything/TileComposer.tsx`
- Create: `src/gallery/collections/askanything/TileComposer.module.css`
- Modify: `src/gallery/collections/askanything/AskAnything.tsx`

**Interfaces:**
- Consumes: `Target` from `./data`; `orbit.ask` and `orbit.reset` from `./useOrbitMode`.
- Produces: `function TileComposer(props: { targets: Target[]; anchorRect: { top: number; left: number; width: number } | null; onAsk: () => void; onDismiss: () => void; reduceMotion: boolean }): JSX.Element | null`

- [ ] **Step 1: Write the composer stylesheet**

Create `src/gallery/collections/askanything/TileComposer.module.css`:

```css
/*
 * The docked composer. It grows out of the orb's landing corner rather than
 * out of its own centre — an origin-aware unfurl is the difference between
 * "the orb became this" and "a box appeared".
 */

.wrap {
  position: absolute;
  z-index: 6;
  transform-origin: top left;
  transform: scale(0.96);
  opacity: 0;
  /* Never scale(0): nothing in the real world appears from nothing. */
  transition:
    transform 200ms var(--ease-out),
    opacity 200ms var(--ease-out);
}

.wrap[data-open='true'] {
  transform: scale(1);
  opacity: 1;
}

.panel {
  padding: 10px;
  border: 1px solid var(--app-border-strong);
  border-radius: var(--mantine-radius-md);
  background: var(--app-surface);
  box-shadow: var(--mantine-shadow-md);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--mantine-color-default-hover);
  font-size: 12px;
  font-weight: 600;
  color: var(--mantine-color-text);
  white-space: nowrap;
  transform: translateY(3px);
  opacity: 0;
  transition:
    transform 140ms var(--ease-out),
    opacity 140ms var(--ease-out);
}

.chip[data-in='true'] {
  transform: translateY(0);
  opacity: 1;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  font-size: 13px;
  color: var(--mantine-color-text);
}

.input::placeholder {
  color: var(--app-muted);
}

.answer {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--mantine-color-text);
}

.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: currentColor;
  animation: blink 1s linear infinite;
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wrap,
  .wrap[data-open='true'] {
    transform: none;
  }
  .chip {
    transform: none;
  }
  .caret {
    animation: none;
  }
}
```

- [ ] **Step 2: Write the composer component**

Create `src/gallery/collections/askanything/TileComposer.tsx`:

```tsx
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
    `Comparing ${targets[0].label.toLowerCase()} and ${targets[1].label.toLowerCase()}: ` +
    'the two move together up to the release, then diverge — the first keeps ' +
    'compounding while the second flattens. That gap is almost entirely enterprise ' +
    'trials, so it is a funnel problem rather than a demand one.'
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

  const clearTimers = () => {
    if (thinkTimer.current) clearTimeout(thinkTimer.current);
    if (streamTimer.current) clearInterval(streamTimer.current);
    thinkTimer.current = null;
    streamTimer.current = null;
  };

  useEffect(() => clearTimers, []);

  // Unfurl on the frame after mount so the enter transition has a start value.
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    inputRef.current?.focus();
    return () => cancelAnimationFrame(id);
  }, []);

  // Changing the chip set invalidates whatever was on screen.
  useEffect(() => {
    clearTimers();
    setRevealed(0);
    setStreaming(false);
  }, [targets.map((t) => t.id).join(',')]);

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
        top: anchorRect.top + 10,
        left: anchorRect.left + 10,
        width: Math.max(anchorRect.width - 20, 220),
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
```

- [ ] **Step 3: Mount the composer from the container**

In `src/gallery/collections/askanything/AskAnything.tsx`, add the imports:

```tsx
import { useLayoutEffect, useState } from 'react';
import { TileComposer } from './TileComposer';
```

Add anchor state next to the other refs in `AskAnything`:

```tsx
  const [anchor, setAnchor] = useState<{ top: number; left: number; width: number } | null>(null);
```

Measure the docked tile whenever the chips change — layout effect so the composer never paints at the wrong place first:

```tsx
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
    setAnchor({ top: r.top - rootRect.top, left: r.left - rootRect.left, width: r.width });
  }, [orbit.chips]);
```

Clear the warmth when the mode drops to idle, so a cooled tile never keeps its glow:

```tsx
  useLayoutEffect(() => {
    if (orbit.armed) return;
    tileRefs.current.forEach((el) => el.style.setProperty('--warm', '0'));
  }, [orbit.armed]);
```

Render the composer immediately before `<AgentCursor …>`:

```tsx
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
```

- [ ] **Step 4: Verify the build and lint pass**

Run: `pnpm build && pnpm lint`
Expected: clean.

- [ ] **Step 5: Verify the composer by hand**

| Action | Expected |
| --- | --- |
| Arm, click a tile | Orb springs to the corner, fades out under a 2px blur while the panel scales up **from that same corner** — not from its own centre |
| Look at the panel | One chip with a small gradient dot and the scope text, e.g. "Revenue · Q3"; the input is already focused |
| Press Enter | Brief pause, then the answer streams in word by word with a blinking caret, landing under the number you clicked |
| ⌘-click a second tile | A second chip animates in, the answer resets, and asking again gives the comparison text |
| Press Esc in the input | Everything returns to idle |
| Emulate reduced motion | The panel appears without scaling and the answer arrives complete, no caret |

Slow the transitions to 25% in DevTools → Animations and watch the orb→panel handoff specifically: you should never see the orb and the panel as two distinct objects overlapping.

- [ ] **Step 6: Commit**

```bash
git add src/gallery/collections/askanything
git commit -m "Add docked composer with scoped chips and in-place streaming"
```

---

### Task 5: Keyboard and touch

The pattern currently requires a mouse and a ⌘ key. This task makes it reachable without either.

**Files:**
- Modify: `src/gallery/collections/askanything/useOrbitMode.ts`
- Modify: `src/gallery/collections/askanything/AskAnything.tsx`
- Modify: `src/gallery/collections/askanything/AskAnything.module.css`

**Interfaces:**
- Consumes: everything from Tasks 2–4.
- Produces: `useOrbitMode` gains `dockDirect(id: string): void` — enters `docked` from `idle` in one step, skipping `peeking`. Used by both the keyboard and long-press paths.

- [ ] **Step 1: Add the direct-dock transition to the hook**

In `src/gallery/collections/askanything/useOrbitMode.ts`, add after the `dock` callback:

```ts
  /** Enter docked straight from idle — the keyboard and long-press paths never
      peek, because there is no pointer to aim with. */
  const dockDirect = useCallback((id: string) => {
    clearHold();
    setChips([id]);
    setMode('docked');
  }, []);
```

and include `dockDirect` in the returned object.

- [ ] **Step 2: Wire the keyboard path**

In `src/gallery/collections/askanything/AskAnything.tsx`, add a `keyboard` flag so the arm stagger can be skipped for keyboard entry:

```tsx
  const [keyboard, setKeyboard] = useState(false);
```

Give `Tile` an `onKeyPick` prop and add the handler to the `<button>`:

```tsx
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onKeyPick(target.id);
        }
      }}
```

In `AskAnything`, define it and pass it to all four tiles:

```tsx
  const keyPick = (id: string) => {
    setKeyboard(true);
    dockRef.current = tileRefs.current.get(id) ?? null;
    orbit.dockDirect(id);
  };
```

Reset the flag when the mode returns to idle, and return focus to the tile that was asked about:

```tsx
  useLayoutEffect(() => {
    if (orbit.armed) return;
    if (!keyboard) return;
    setKeyboard(false);
    (dockRef.current as HTMLButtonElement | null)?.focus();
  }, [orbit.armed, keyboard]);
```

Add `data-keyboard={keyboard}` to the root element — the stylesheet rule added in Task 2 already zeroes the stagger for it.

- [ ] **Step 3: Wire the long-press path**

Still in `AskAnything.tsx`, add a press timer ref:

```tsx
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
```

Give `Tile` two more props, `onPressStart` and `onPressEnd`, bound on the `<button>` as:

```tsx
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') onPressStart(target.id);
      }}
      onPointerUp={onPressEnd}
      onPointerCancel={onPressEnd}
      onContextMenu={(e) => {
        // iOS raises the callout menu on long-press; it would eat the gesture.
        if (pressActive) e.preventDefault();
      }}
```

where `pressActive` is a boolean prop the container passes as `pressActiveRef.current`. Simplest correct form — define in `AskAnything`:

```tsx
  const [pressing, setPressing] = useState(false);

  /* 400ms long-press goes straight to docked, skipping the peek: there is no
     pointer to aim with on touch, so peeking would show nothing useful. */
  const pressStart = (id: string) => {
    setPressing(true);
    pressTimer.current = setTimeout(() => {
      dockRef.current = tileRefs.current.get(id) ?? null;
      orbit.dockDirect(id);
      setPressing(false);
    }, 400);
  };

  const pressEnd = () => {
    setPressing(false);
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  useEffect(() => () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }, []);
```

Pass `onPressStart={pressStart}`, `onPressEnd={pressEnd}`, and `pressActive={pressing}` to all four tiles.

- [ ] **Step 4: Gate the hover-only styling**

Append to `src/gallery/collections/askanything/AskAnything.module.css`:

```css
/* Proximity warmth is meaningless without a fine pointer, and touch devices
   fire hover on tap — which would light a tile the user only meant to press. */
@media not all and (hover: hover) and (pointer: fine) {
  .target::after {
    display: none;
  }
  /* Long-press needs the browser's own selection/callout out of the way. */
  .target {
    -webkit-touch-callout: none;
    user-select: none;
  }
}
```

- [ ] **Step 5: Verify the build and lint pass**

Run: `pnpm build && pnpm lint`
Expected: clean.

- [ ] **Step 6: Verify both paths by hand**

Keyboard, with the mouse untouched: Tab until a tile has a focus ring, press Enter. Expected: the mode docks straight to that tile with **no stagger and no orb**, focus lands in the composer input, Enter streams the answer, Esc returns to idle and focus returns to the tile you started on.

Touch: with `pnpm dev` running, open the site on a phone on the same network (`http://<your-lan-ip>:5180`). Press and hold a tile for about half a second. Expected: it docks directly, no orb appears, no iOS text-selection callout appears, and the composer is usable with the on-screen keyboard. A quick tap does nothing.

- [ ] **Step 7: Commit**

```bash
git add src/gallery/collections/askanything
git commit -m "Make Ask anything reachable by keyboard and touch"
```

---

### Task 6: Discovery hint and final polish

**Files:**
- Modify: `src/gallery/collections/askanything/AskAnything.tsx`
- Modify: `src/gallery/collections/askanything/AskAnything.module.css`
- Modify: `README.md`

- [ ] **Step 1: Add the hint line**

The pattern is invisible until you know the key. Add a quiet hint in the header, in the `classes.chrome` block, replacing the "Last 30 days" `<Text>`:

```tsx
        <Text size="sm" c="dimmed">
          Hold <kbd className={classes.kbd}>⌘</kbd> and point at a tile
        </Text>
```

And the style, appended to `AskAnything.module.css`:

```css
.kbd {
  padding: 1px 5px;
  border: 1px solid var(--app-border);
  border-radius: 4px;
  background: var(--mantine-color-default-hover);
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
}
```

- [ ] **Step 2: Document the pattern in the README**

In `README.md`, the "What is inside" section describes the views. After the paragraph mentioning the AI patterns, add one sentence:

```markdown
Ask anything is the newest of them: hold ⌘ over a dashboard and it orbitises, the cursor becomes an agent orb, and clicking any tile docks a composer scoped to what you clicked.
```

- [ ] **Step 3: Full verification sweep**

Run: `pnpm build && pnpm lint && pnpm format:check`
Expected: all clean. If `format:check` fails, run `pnpm format` and re-run.

Then, in the browser, walk the whole matrix once more:

- Light scheme and dark scheme
- Desktop width and a 360px viewport (the tiles stack; the composer must not overflow the card)
- Reduced motion on and off
- Mouse, keyboard, and touch entry
- Esc from `peeking`, from `docked`, and mid-stream from `answering`
- Arm the mode, then scroll the gallery fast — nothing should be left lit or stuck

Finally, review the arm and the orb→panel handoff at 25% speed in the DevTools Animations panel one more time. Emil's rule applies: look at it again with fresh eyes before calling it done.

- [ ] **Step 4: Commit**

```bash
git add src/gallery/collections/askanything README.md
git commit -m "Add Ask anything discovery hint and document the pattern"
```

---

## Self-Review

**Spec coverage:** Placement → Task 1. Anatomy (four targets, three components) → Tasks 1, 3, 4; the spec's three components became five files, documented under File Structure above. State machine (all four states, Esc, pointer-leave, scroll, latching, two-chip cap) → Task 2. Visual treatment (desaturate, 2px lift, hairline ring, proximity warmth) → Tasks 2 and 3. Motion table — every row has a home: arm/disarm and press feedback in Task 2, orb follow and dock spring in Task 3, composer unfurl, blur handoff, chip enter, and answer stream in Task 4. Reduced motion, keyboard, touch, and card clipping → Tasks 3 and 5. Testing section → Task 6's sweep.

**Placeholders:** none — every code step carries complete code, and every verification step names the exact command or the exact observation.

**Type consistency:** `Target`, `Mode`, `TARGETS`, `buildSpark`, `useOrbitMode`, `dock`, `dockDirect`, `ask`, `reset`, `armed`, `chips`, `registerRef`, `pointerRef`, `dockRef`, and `anchorRect` are each defined once and used with the same name and shape throughout.

**Known deviation from the skill's default:** the TDD red-green loop is replaced by a type-check plus scripted manual verification, because this repo has no test runner and adding one for a visual specimen would be scope creep. Each task still ends with an independently verifiable deliverable and its own commit.
