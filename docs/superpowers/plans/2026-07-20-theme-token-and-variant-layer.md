# Theme Token & Variant Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `src/theme` the single source of truth for every design decision, by adding a typed token layer in `theme.other` emitted as `--app-*` CSS variables, named component variants, and fixing three defects found during the audit.

**Architecture:** Tokens are declared once as typed TS objects on `theme.other`, then emitted as CSS custom properties by `cssVariablesResolver`. TS consumers (component `styles`, `vars`, `transitionProps`) read `theme.other.*`; CSS modules read `var(--app-*)`. Component "looks" become named variants implemented as `classNames` functions keyed on `props.variant`, composing with Mantine's built-ins rather than replacing them.

**Tech Stack:** React 19, Mantine 9, TypeScript 5.9, Vite (rolldown), PostCSS with `postcss-preset-mantine`, oxlint. Package manager: **pnpm**.

**Source spec:** `docs/superpowers/specs/2026-07-20-theme-token-and-variant-layer-design.md`

## Global Constraints

- **No test framework exists in this repo.** `package.json` defines `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `format:check` — no test runner, no test files. Do not add one; that is out of scope. Every task below uses a **grep-count assertion** as its red→green check, plus the build and lint commands. Run the grep BEFORE the change to confirm the stated "before" count, and AFTER to confirm the "after" count.
- **Verification commands** (exact):
  - `pnpm build` — runs `tsc -b && vite build`. Must exit 0.
  - `pnpm lint` — runs `oxlint`. Must exit 0.
  - `pnpm format:check` — runs `oxfmt --check .`. Must exit 0.
- **No screenshot baseline was authorized.** Visual checking is by `pnpm dev` and eyeballing in the browser, in **both** color schemes (the app boots in light; use the scheme toggle in the header). When reporting, say "the routes I checked looked correct" — never "no visual regressions", which cannot be evidenced without a baseline.
- **Branch:** `theme/token-and-variant-layer`, already created and holding the spec commit.
- **Naming:** all new CSS custom properties use the existing `--app-*` prefix. No new prefixes.
- **Do not reformat unrelated lines.** These diffs are reviewed for visual risk; incidental whitespace churn makes that harder.
- **Commit after every task.** Layer 3 tasks must be separately committed so a regression is bisectable.

## File Structure

**Created:**
- `src/theme/tokens.types.ts` — the `AppTokens` interface and the Mantine `MantineThemeOther` module augmentation. Separate from `tokens.ts` so the type can be imported by component files without pulling in the values.
- `src/theme/components/text.ts` + `text.module.css` — `Text` and `UnstyledButton` variants. New group file, matching the existing per-group convention.

**Modified:**
- `src/theme/tokens.ts` — `theme.other` values; `cssVariablesResolver` signature change and all new var emission.
- `src/theme/index.ts` — register the new `text` group.
- `src/theme/components/{actions,inputs,dataDisplay,feedback,navigation}.ts` + their `.module.css` — defect fixes, variant `classNames`, token consumption.
- `src/theme.css` — remove the 13 global `.mantine-*` rules; keep reset, `code, kbd`.
- ~38 `*.module.css` and their `.tsx` call sites under `src/gallery`, `src/components`, `src/templates` — Layer 3 migration.

---

## LAYER 0 — Defect fixes

These land first and alone. They change what "correct" looks like, so any visual comparison taken before them measures against a bug.

### Task 1: Make the shadow scale scheme-aware

`tokens.ts:89-95` defines `shadows.xs`–`xl` as light-only literals built from `rgba(9,9,11, 0.03–0.08)`, inside `baseTheme` rather than in the resolver's `light`/`dark` branches. In dark mode `--mantine-shadow-md` is therefore a ~5%-opacity near-black shadow cast onto a `#141417` surface — invisible. Affects Modal, Drawer, Popover, HoverCard, Tooltip, Notification, Dialog, every dropdown, Card hover and `.bento-card` hover.

**Files:**
- Modify: `src/theme/tokens.ts:89-95` (remove `shadows` from `baseTheme`), `src/theme/tokens.ts:110-157` (add to resolver branches)

**Interfaces:**
- Produces: `--mantine-shadow-{xs,sm,md,lg,xl}` now defined per scheme. No TS surface change; consumers keep using `shadow="md"` / `var(--mantine-shadow-md)`.

- [ ] **Step 1: Confirm the defect exists**

Run: `grep -n "rgba(9,9,11,0.0" src/theme/tokens.ts | head`
Expected: 5 matching lines (the shadow scale), all inside the `shadows:` block at 89-95.

Run: `grep -c "mantine-shadow" src/theme/tokens.ts`
Expected: `0` — proving the scale is nowhere in the resolver.

- [ ] **Step 2: Delete the `shadows` block from `baseTheme`**

Remove lines 87-95 of `src/theme/tokens.ts` entirely (the comment and the `shadows: {...},` object).

- [ ] **Step 3: Emit the scale per scheme in `cssVariablesResolver`**

In the `light:` branch of `cssVariablesResolver`, add — these values are byte-identical to the deleted ones, so light mode must not change at all:

```ts
    '--mantine-shadow-xs': '0 1px 2px rgba(9,9,11,0.05), 0 1px 1px rgba(9,9,11,0.04)',
    '--mantine-shadow-sm':
      '0 1px 2px rgba(9,9,11,0.05), 0 2px 4px rgba(9,9,11,0.05), 0 4px 8px rgba(9,9,11,0.03)',
    '--mantine-shadow-md':
      '0 2px 4px rgba(9,9,11,0.04), 0 4px 8px rgba(9,9,11,0.05), 0 8px 16px rgba(9,9,11,0.05)',
    '--mantine-shadow-lg':
      '0 4px 8px rgba(9,9,11,0.04), 0 8px 20px rgba(9,9,11,0.06), 0 16px 32px rgba(9,9,11,0.06)',
    '--mantine-shadow-xl':
      '0 8px 24px rgba(9,9,11,0.08), 0 16px 40px rgba(9,9,11,0.08), 0 32px 64px rgba(9,9,11,0.06)',
```

In the `dark:` branch, add the following. The opacity ratio follows the precedent already set by `--app-shadow-raised`, which is `0.06` light / `0.40` dark — roughly 6×. Dark shadows also drop the layered mid-tones in favour of a deeper single spread, because layered low-alpha shadows are invisible on near-black:

```ts
    '--mantine-shadow-xs': '0 1px 2px rgba(0,0,0,0.40), 0 1px 1px rgba(0,0,0,0.30)',
    '--mantine-shadow-sm':
      '0 1px 2px rgba(0,0,0,0.44), 0 2px 4px rgba(0,0,0,0.36), 0 4px 8px rgba(0,0,0,0.28)',
    '--mantine-shadow-md':
      '0 2px 4px rgba(0,0,0,0.44), 0 4px 8px rgba(0,0,0,0.40), 0 8px 16px rgba(0,0,0,0.34)',
    '--mantine-shadow-lg':
      '0 4px 8px rgba(0,0,0,0.46), 0 8px 20px rgba(0,0,0,0.44), 0 16px 32px rgba(0,0,0,0.38)',
    '--mantine-shadow-xl':
      '0 8px 24px rgba(0,0,0,0.52), 0 16px 40px rgba(0,0,0,0.48), 0 32px 64px rgba(0,0,0,0.42)',
```

- [ ] **Step 4: Verify the change**

Run: `grep -c "mantine-shadow" src/theme/tokens.ts`
Expected: `10` (5 light + 5 dark).

Run: `pnpm build`
Expected: exit 0. If `tsc` complains that `shadows` is missing from `MantineThemeOverride`, that is expected to NOT happen — `shadows` is optional. If it does error, stop and report.

- [ ] **Step 5: Eyeball both schemes**

Run: `pnpm dev`, open the gallery. Check a Modal, a Menu dropdown, and a Card hover in **dark** mode — all three should now have visible depth where before they were flat. Then switch to **light** and confirm nothing changed (values are identical).

- [ ] **Step 6: Commit**

```bash
git add src/theme/tokens.ts
git commit -m "fix(theme): make shadow scale scheme-aware

The xs-xl scale lived in baseTheme as light-only rgba(9,9,11,0.03-0.08)
literals, so in dark mode every floating surface cast a ~5%-opacity
near-black shadow onto a near-black background and lost all depth.
Move it into the resolver's light/dark branches; light values unchanged."
```

---

### Task 2: Delete the dead duplicate SegmentedControl

`SegmentedControl` is registered twice: `inputs.ts:242-249` and `navigation.ts:115-123`. `index.ts` spreads `navigationComponents` last, so the `inputs.ts` block is dead code that reads as live — including a materially different indicator recipe (`light-dark(white, dark-4)` vs navigation's `--app-surface`).

**Files:**
- Modify: `src/theme/components/inputs.ts:242-249` (delete), `src/theme/components/inputs.ts:11` (drop the now-unused import)
- Modify: `src/theme/components/inputs.module.css:198-236` (delete the three dead classes)
- Modify: `src/theme.css:150-152` (move the orphan fragment), `src/theme/components/navigation.module.css` (receive it)

**Interfaces:**
- Consumes: nothing.
- Produces: exactly one `SegmentedControl` registration, in `navigation.ts`.

- [ ] **Step 1: Confirm the duplication**

Run: `grep -rn "SegmentedControl:" src/theme/components/`
Expected: exactly 2 lines — `inputs.ts:242` and `navigation.ts:115`.

- [ ] **Step 2: Delete the `inputs.ts` registration**

Remove the `SegmentedControl: SegmentedControl.extend({...}),` block (lines 242-249). Then remove `SegmentedControl,` from the import list at the top of the file (it is line 11 in the `@mantine/core` import).

- [ ] **Step 3: Delete the dead CSS**

In `src/theme/components/inputs.module.css`, delete the `.segmented`, `.segmentedIndicator` and `.segmentedLabel` rules (lines 198-236). Verify no other file references them first:

Run: `grep -rn "segmented" src/ --include='*.ts' --include='*.tsx'`
Expected: no output. If anything matches, stop and report — the class is in use and this is not dead code.

- [ ] **Step 4: Move the orphan label padding into the live module**

`src/theme.css:150-152` sets `.mantine-SegmentedControl-label { padding-inline: 20px; }` globally. Delete that rule and add the declaration to the live `.segmentLabel` class in `src/theme/components/navigation.module.css`:

```css
  padding-inline: 20px;
```

- [ ] **Step 5: Verify**

Run: `grep -rn "SegmentedControl:" src/theme/components/`
Expected: exactly 1 line — `navigation.ts:115`.

Run: `grep -c "SegmentedControl" src/theme.css`
Expected: `0`.

Run: `pnpm build && pnpm lint`
Expected: both exit 0. `tsc` will catch the import if you forgot Step 2's second half.

- [ ] **Step 6: Eyeball**

Run `pnpm dev` and find a SegmentedControl in the gallery (the inputs section, and `SiteNav.tsx:36`). It should look **unchanged** — navigation's version was already the one rendering. Segment labels keep their 20px inline padding. Check both schemes.

- [ ] **Step 7: Commit**

```bash
git add src/theme/components/inputs.ts src/theme/components/inputs.module.css src/theme.css src/theme/components/navigation.module.css
git commit -m "fix(theme): remove dead duplicate SegmentedControl registration

inputs.ts and navigation.ts both registered SegmentedControl; navigation
spreads last in createTheme so the inputs.ts block and its CSS were dead
code that read as live, carrying a different indicator recipe. Keep
navigation's, and fold the orphan label-padding rule out of theme.css."
```

---

### Task 3: Add the missing `Pill` and `Combobox` theme entries

`theme.css:112-147` styles Pill parts globally — including reaching into rendered SVG internals (`.mantine-Pill-remove svg`) — purely because `Pill` has no entry in `inputs.ts`. Same reason for `Combobox`. Adding the entries is what makes Task 4 possible.

**Files:**
- Modify: `src/theme/components/inputs.ts` (add `Pill` and `Combobox` registrations, extend the import)
- Modify: `src/theme/components/inputs.module.css` (add the classes)
- Modify: `src/theme.css:112-147` (delete the Pill globals)

**Interfaces:**
- Produces: `classes.pill`, `classes.pillLabel`, `classes.pillRemove`, `classes.comboboxDropdown`, `classes.comboboxOption` — consumed by Task 4.

- [ ] **Step 1: Confirm the gap**

Run: `grep -cn "Pill:\|Combobox:" src/theme/components/inputs.ts`
Expected: `0`.

- [ ] **Step 2: Port the Pill rules into the module**

Add to `src/theme/components/inputs.module.css`, transcribing `theme.css:112-147` verbatim (only the selector changes):

```css
.pill {
  display: inline-flex;
  align-items: center;
  background-color: var(--app-surface);
  border: 1px solid var(--mantine-color-default-border);
  font-weight: 500;
}

.pillLabel {
  height: inherit;
  display: inline-flex;
  align-items: center;
}

.pillRemove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-muted);
  border-radius: 999px;
  margin-inline-start: 1px;
  transition: color 120ms ease, background-color 120ms ease;
}
.pillRemove:hover {
  color: var(--mantine-color-text);
  background-color: var(--mantine-color-default-hover);
}
.pillRemove svg {
  display: block;
  stroke-width: 1.5;
  width: 0.72em;
  height: 0.72em;
}
```

- [ ] **Step 3: Register the components**

Add `Pill` and `Combobox` to the `@mantine/core` import in `inputs.ts`, then add to the exported object:

```ts
  Pill: Pill.extend({
    classNames: {
      root: classes.pill,
      label: classes.pillLabel,
      remove: classes.pillRemove,
    },
  }),

  Combobox: Combobox.extend({
    classNames: {
      dropdown: classes.dropdown,
      option: classes.option,
    },
  }),
```

Note it reuses the **existing** `classes.dropdown` / `classes.option` that `dropdownClassNames` (`inputs.ts:73`) already points at — that is deliberate, and it is what lets Task 4 delete the global copies.

- [ ] **Step 4: Delete the Pill globals**

Remove `src/theme.css:112-147` (the whole Pill block including its comment header).

- [ ] **Step 5: Verify**

Run: `grep -c "mantine-Pill" src/theme.css`
Expected: `0`.

Run: `pnpm build && pnpm lint`
Expected: both exit 0.

- [ ] **Step 6: Eyeball**

Run `pnpm dev`, open a MultiSelect / TagsInput in the gallery inputs section. Pills should look unchanged: surface background, hairline border, 500 weight, thin X that firms up on hover. Check both schemes.

- [ ] **Step 7: Commit**

```bash
git add src/theme/components/inputs.ts src/theme/components/inputs.module.css src/theme.css
git commit -m "refactor(theme): add Pill and Combobox theme entries

Both were styled via global .mantine-* selectors in theme.css only
because they had no theme registration; the Pill rules reached into
rendered SVG internals. Register them properly and move the CSS into
the module."
```

---

### Task 4: Resolve the three global-vs-module conflicts, empty `theme.css`

`theme.css:62-105` and the module files style the same parts at **identical specificity**. The winner is bundle import order (`main.tsx` imports `theme.css` at line 8, before `./theme` at line 10), which is incidental, not designed. Three pairs genuinely disagree.

**⚠️ DECISION GATE — do not guess.** The combobox-selected-option conflict is a visible design choice, not a cleanup. Ask the user which side survives before implementing, and record the answer in the commit message:

| Conflict | `theme.css` says | module says |
|---|---|---|
| `theme.css:87-90` vs `inputs.module.css:266-270` | selected option = **filled primary** (`--mantine-primary-color-filled` bg, contrast text) | selected option = **quiet** (`--mantine-color-default-hover` bg) |
| `theme.css:74-79` vs `inputs.module.css:251` | row inset `padding-block: 6px; padding-inline: 9px` | row inset `padding: 7px 10px` |
| `theme.css:92-95` vs `navigation.ts:108` | divider `--mantine-color-default-border` | divider `--app-border` |

Because `theme.css` currently wins on all three, **the globals are what you see today**. Keeping current appearance means porting the `theme.css` values into the modules and deleting the module's competing declaration.

**Files:**
- Modify: `src/theme.css:56-105` (delete), `src/theme/components/inputs.module.css`, `src/theme/components/navigation.ts`, `src/theme/components/navigation.module.css`

- [ ] **Step 1: Get the decision**

Ask the user for each of the three rows above. Do not proceed without an answer on row 1.

- [ ] **Step 2: Reconcile the modules**

Apply the decided values to `inputs.module.css` (`.option`, `.option[data-combobox-selected]`) and `navigation.ts` / `navigation.module.css` (divider). The dropdown *surface* rules (`theme.css:62-71`) need no reconciliation — they are byte-identical to the module versions; just delete the globals.

- [ ] **Step 3: Move the reduced-motion dropdown transition**

`theme.css:98-105` adds a transition to all four dropdown types under `prefers-reduced-motion: no-preference`. Add the same declaration to `.dropdown` in `inputs.module.css` and `.menuDropdown` in `navigation.module.css`, each inside its own `@media (prefers-reduced-motion: no-preference)` block.

- [ ] **Step 4: Delete `theme.css:56-105`**

Everything from the dropdown-surfaces comment header through the reduced-motion block. Leave `theme.css:1-53` (import, reset, body, `.bento-card`, `.eyebrow`, `code, kbd`) intact.

- [ ] **Step 5: Move the Timeline bullet width**

`theme.css:155-157` sets `.mantine-Timeline-itemBullet { border-width: 1px }` while its colour lives in `dataDisplay.module.css:65-69` — split brain. Delete the global and add `border-width: 1px;` to `.timelineBullet` in `dataDisplay.module.css`.

- [ ] **Step 6: Verify**

Run: `grep -c "mantine-" src/theme.css`
Expected: `0`. (Only `--mantine-*` *variable* references should remain, so if this returns non-zero, check they are `var(--mantine-…)` usages and not `.mantine-X-Y` selectors: `grep -n '\.mantine-' src/theme.css` must return nothing.)

Run: `pnpm build && pnpm lint`
Expected: both exit 0.

- [ ] **Step 7: Eyeball carefully — this is the highest-risk task in Layer 0**

Run `pnpm dev`. Check in **both schemes**: every Select / Autocomplete / MultiSelect dropdown (option hover, option selected, group separators), every Menu (item hover, dividers, label), Popover, HoverCard, and a Timeline. The selected-option state is the one to scrutinise — it is the decision from Step 1 made visible.

- [ ] **Step 8: Commit**

```bash
git add src/theme.css src/theme/components/
git commit -m "refactor(theme): move global .mantine-* rules into component classNames

theme.css targeted Mantine internal class names at the same specificity
as the component modules, so three genuinely-conflicting rules were
resolved by bundle import order rather than by design. Reconcile each
explicitly and move all 13 rules into classNames.

Decisions: <record the Step 1 answers here>"
```

---

## LAYER 1 — Token layer

Purely additive: every task here introduces variables that nothing reads yet. Layer 1 alone cannot cause a visual regression, which is why it is safe to land in larger steps than Layer 3.

### Task 5: `AppTokens` type, `theme.other`, and the motion family

**Files:**
- Create: `src/theme/tokens.types.ts`
- Modify: `src/theme/tokens.ts` (add `other`, change resolver signature)

**Interfaces:**
- Produces: `AppTokens` interface; `theme.other.motion.{ease,duration}`; CSS vars `--app-ease-{out,spring,in-out}` and `--app-duration-{instant,fast,base,slow}`. Every later task extends `AppTokens` and the resolver the same way.

- [ ] **Step 1: Confirm `other` is unused**

Run: `grep -rn "theme.other\|other:" src/ --include='*.ts' --include='*.tsx'`
Expected: no output.

- [ ] **Step 2: Create the type file**

Create `src/theme/tokens.types.ts`:

```ts
/**
 * The app's design tokens, carried on `theme.other` and emitted as `--app-*`
 * custom properties by `cssVariablesResolver`. TS consumers read
 * `theme.other.*`; CSS modules read `var(--app-*)`. One source, two readers.
 */
export interface AppTokens {
  motion: {
    ease: { out: string; spring: string; inOut: string };
    duration: { instant: number; fast: number; base: number; slow: number };
  };
}

declare module '@mantine/core' {
  export interface MantineThemeOther extends AppTokens {}
}
```

- [ ] **Step 3: Add the values to `tokens.ts`**

Import the type and add an `other` key to `baseTheme`, immediately after `colors`:

```ts
  other: {
    motion: {
      ease: {
        // The house curve. 81 hand-written copies of this existed before it
        // had a name; four near-identical variants had drifted alongside it.
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      duration: { instant: 120, fast: 160, base: 220, slow: 420 },
    },
  } satisfies AppTokens,
```

- [ ] **Step 4: Change the resolver signature and emit**

`cssVariablesResolver` is currently `() => ({...})` at `tokens.ts:110`. Change it to take the theme:

```ts
export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
```

Then in the scheme-invariant `variables:` block, add:

```ts
    '--app-ease-out': theme.other.motion.ease.out,
    '--app-ease-spring': theme.other.motion.ease.spring,
    '--app-ease-in-out': theme.other.motion.ease.inOut,
    '--app-duration-instant': `${theme.other.motion.duration.instant}ms`,
    '--app-duration-fast': `${theme.other.motion.duration.fast}ms`,
    '--app-duration-base': `${theme.other.motion.duration.base}ms`,
    '--app-duration-slow': `${theme.other.motion.duration.slow}ms`,
```

- [ ] **Step 5: Verify**

Run: `pnpm build`
Expected: exit 0. If `theme.other.motion` errors as `unknown`, the module augmentation in Step 2 is not being picked up — confirm `tokens.types.ts` is imported by `tokens.ts`.

Run: `pnpm dev`, then in the browser devtools console:
`getComputedStyle(document.body).getPropertyValue('--app-ease-out')`
Expected: `cubic-bezier(0.22, 1, 0.36, 1)`.

- [ ] **Step 6: Commit**

```bash
git add src/theme/tokens.types.ts src/theme/tokens.ts
git commit -m "feat(theme): add typed theme.other token layer with motion family

theme.other was unused, so no design decision outside colour had a home
in TS and all of them leaked into CSS strings. Introduce AppTokens with
module augmentation, and the motion family as the first member."
```

---

### Task 6: Consume the motion tokens inside the theme

Do the theme's own 48 copies first, separately from the app's 33 — the theme is where the JS/CSS drift lives (`feedback.ts:28` `EASE`, re-typed at `navigation.ts:94` and `inputs.ts:75`).

**Files:**
- Modify: `src/theme/components/{inputs,navigation,actions,feedback,dataDisplay}.module.css`, `src/theme/components/{feedback,navigation,inputs}.ts`, `src/theme.css`

- [ ] **Step 1: Baseline count**

Run: `grep -rho 'cubic-bezier(0.22, *1, *0.36, *1)' src/theme src/theme.css --include='*.css' | wc -l`
Expected: `49` (inputs 21, navigation 18, actions 6, feedback 1, dataDisplay 1, theme.css 2).

- [ ] **Step 2: Replace in the theme's CSS modules**

```bash
grep -rl 'cubic-bezier(0.22, 1, 0.36, 1)' src/theme src/theme.css --include='*.css' \
  | xargs sed -i '' 's/cubic-bezier(0\.22, 1, 0\.36, 1)/var(--app-ease-out)/g'
```

- [ ] **Step 3: Collapse the three JS copies of "pop 150ms"**

In `feedback.ts`, the `EASE` constant at line 28 and the `transitionProps` at `navigation.ts:94` and `inputs.ts:75` are three independent spellings of one recipe. Replace each `duration: 150` with `duration: 160` sourced from the token — Mantine's `transitionProps.duration` takes a number, so read it from the theme where the component has access, or import the value:

```ts
import { baseTheme } from '../tokens';
const POP = { transition: 'pop', duration: baseTheme.other.motion.duration.fast } as const;
```

and use `POP` in all three places. Note this changes 150ms → 160ms; that is intentional consolidation onto the scale, and is the one place in Task 6 where behaviour changes.

- [ ] **Step 4: Verify**

Run: `grep -rho 'cubic-bezier(0.22, *1, *0.36, *1)' src/theme src/theme.css --include='*.css' | wc -l`
Expected: `0`.

Run: `pnpm build && pnpm lint && pnpm format:check`
Expected: all exit 0.

- [ ] **Step 5: Eyeball**

Run `pnpm dev`. Hover buttons, focus inputs, open menus and modals. Motion should feel identical except dropdowns, which now open over 160ms instead of 150ms — imperceptible, but confirm nothing stutters or jumps.

- [ ] **Step 6: Commit**

```bash
git add src/theme src/theme.css
git commit -m "refactor(theme): consume motion tokens inside the theme

Replaces 49 literal easing copies with var(--app-ease-out) and collapses
the three independent JS spellings of the pop-150ms recipe onto
motion.duration.fast (160ms)."
```

---

### Task 7: Radius, elevation and surface families

**Files:**
- Modify: `src/theme/tokens.types.ts`, `src/theme/tokens.ts`

**Interfaces:**
- Produces: `--app-radius-{pill,nub,hairline}`; `--app-elevation-{flat,raised,overlay,modal}`; `--app-surface-{inverted-bg,inverted-text,scrim,punchout-ring,pulse-ring,active-press,on-fill,focus-ring-error}`.

- [ ] **Step 1: Extend `AppTokens`**

```ts
  radius: { pill: string; nub: string; hairline: string };
  elevation: { flat: string; raised: string; overlay: string; modal: string };
  surface: {
    invertedBg: string;
    invertedText: string;
    scrim: string;
    punchoutRing: string;
    pulseRing: string;
    activePress: string;
    onFill: string;
    focusRingError: string;
  };
```

- [ ] **Step 2: Add scheme-invariant values to `baseTheme.other`**

```ts
    // The three the Mantine radius scale cannot express (it starts at xs: 5px
    // and stops at xl: 16px). 41 hardcoded `999px` existed before this.
    radius: { pill: '999px', nub: '2px', hairline: '1px' },
```

- [ ] **Step 3: Emit radius in `variables:`, elevation and surface per scheme**

In `variables:`:
```ts
    '--app-radius-pill': theme.other.radius.pill,
    '--app-radius-nub': theme.other.radius.nub,
    '--app-radius-hairline': theme.other.radius.hairline,
```

In `light:` — elevation names the *role*, so changing overlay depth becomes one edit instead of six files:
```ts
    '--app-elevation-flat': 'none',
    '--app-elevation-raised': 'var(--app-shadow-raised)',
    '--app-elevation-overlay': 'var(--mantine-shadow-md)',
    '--app-elevation-modal': 'var(--mantine-shadow-lg)',
    '--app-surface-inverted-bg': 'var(--mantine-color-dark-6)',
    '--app-surface-inverted-text': 'rgba(255,255,255,0.86)',
    '--app-surface-scrim': 'rgba(9,9,11,0.35)',
    '--app-surface-punchout-ring': 'var(--app-bg)',
    '--app-surface-pulse-ring': 'color-mix(in srgb, var(--mantine-color-text) 35%, transparent)',
    '--app-surface-active-press': 'var(--app-border)',
    '--app-surface-on-fill': 'var(--mantine-primary-color-contrast)',
    '--app-surface-focus-ring-error': '0 0 0 3px rgba(224,49,49,0.16)',
```

In `dark:` — the elevation aliases are identical (they resolve through already-scheme-aware vars after Task 1), but the literals differ:
```ts
    '--app-elevation-flat': 'none',
    '--app-elevation-raised': 'var(--app-shadow-raised)',
    '--app-elevation-overlay': 'var(--mantine-shadow-md)',
    '--app-elevation-modal': 'var(--mantine-shadow-lg)',
    '--app-surface-inverted-bg': 'var(--mantine-color-dark-4)',
    '--app-surface-inverted-text': 'var(--mantine-color-dark-0)',
    // Pure black over a #0a0a0b body gives no separation; lift the scrim.
    '--app-surface-scrim': 'rgba(0,0,0,0.62)',
    '--app-surface-punchout-ring': 'var(--app-bg)',
    '--app-surface-pulse-ring': 'color-mix(in srgb, var(--mantine-color-text) 30%, transparent)',
    '--app-surface-active-press': 'var(--app-border)',
    '--app-surface-on-fill': 'var(--mantine-primary-color-contrast)',
    '--app-surface-focus-ring-error': '0 0 0 3px rgba(255,120,120,0.20)',
```

- [ ] **Step 4: Verify**

Run: `pnpm build`
Expected: exit 0.

Run in devtools: `getComputedStyle(document.body).getPropertyValue('--app-radius-pill')`
Expected: `999px`.

- [ ] **Step 5: Commit**

```bash
git add src/theme/tokens.types.ts src/theme/tokens.ts
git commit -m "feat(theme): add radius, elevation and surface token families

Purely additive. elevation names the role (flat/raised/overlay/modal)
over the shadow scale; surface names the eight one-off recipes the audit
found duplicated, including a dark scrim that actually separates from a
near-black body."
```

---

### Task 8: Type, space, state and z families

**Files:**
- Modify: `src/theme/tokens.types.ts`, `src/theme/tokens.ts`

**Interfaces:**
- Produces: `--app-tracking-{tight,snug,normal,label}`, `--app-eyebrow-*`, `--app-row-inset`, `--app-state-{success,warning,danger,info}-{surface,border,text}`, `--app-z-{base,sticky,dropdown,overlay,modal,toast}`.

- [ ] **Step 1: Extend `AppTokens`**

```ts
  type: {
    tracking: { tight: string; snug: string; normal: string; label: string };
    eyebrow: { fontSize: string; letterSpacing: string; textTransform: string };
  };
  space: { rowInset: string };
  state: Record<
    'success' | 'warning' | 'danger' | 'info',
    { surface: string; border: string; text: string }
  >;
  z: Record<'base' | 'sticky' | 'dropdown' | 'overlay' | 'modal' | 'toast', number>;
```

- [ ] **Step 2: Add values**

The audit found five conflicting letter-spacings (`-0.025em` Title, `-0.011em` body, `-0.01em` Modal/Drawer title, `-0.006em` controls, `-0.003em` Badge) and the reference theme explicitly groups Title + Modal.title + Drawer.title at `-0.025em`. The scale below encodes that:

```ts
    type: {
      tracking: { tight: '-0.025em', snug: '-0.011em', normal: '-0.006em', label: '0.04em' },
      // Written by hand three times before this, with 0.06em vs 0.04em drift.
      eyebrow: { fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' },
    },
    // The shared menu / combobox-option / tree-label inset, previously three
    // different values (6px/9px, 7px/10px, 4px/8px).
    space: { rowInset: '7px 10px' },
    z: { base: 1, sticky: 100, dropdown: 300, overlay: 400, modal: 500, toast: 600 },
```

- [ ] **Step 3: Emit — `type`, `space`, `z` in `variables:`; `state` per scheme**

```ts
    '--app-tracking-tight': theme.other.type.tracking.tight,
    '--app-tracking-snug': theme.other.type.tracking.snug,
    '--app-tracking-normal': theme.other.type.tracking.normal,
    '--app-tracking-label': theme.other.type.tracking.label,
    '--app-eyebrow-font-size': theme.other.type.eyebrow.fontSize,
    '--app-eyebrow-letter-spacing': theme.other.type.eyebrow.letterSpacing,
    '--app-row-inset': theme.other.space.rowInset,
    '--app-z-sticky': String(theme.other.z.sticky),
    '--app-z-dropdown': String(theme.other.z.dropdown),
    '--app-z-overlay': String(theme.other.z.overlay),
    '--app-z-modal': String(theme.other.z.modal),
    '--app-z-toast': String(theme.other.z.toast),
```

For `state`, emit a `surface`/`border`/`text` trio per key in each scheme, built from Mantine's palette so they track the colour scheme — e.g. light `--app-state-danger-surface: var(--mantine-color-red-0)`, `--app-state-danger-border: var(--mantine-color-red-3)`, `--app-state-danger-text: var(--mantine-color-red-8)`; dark uses `red-9` / `red-7` / `red-3`. Repeat for `success` (teal, matching the app's existing undocumented convention), `warning` (yellow), `info` (accent).

- [ ] **Step 4: Add `headings.sizes.h4/h5/h6`**

`tokens.ts:78-80` stops at h3, so h4-h6 fall back to Mantine defaults that don't match the tightened rhythm. Add:

```ts
      h4: { fontSize: rem(17), lineHeight: '1.35', fontWeight: '600' },
      h5: { fontSize: rem(15), lineHeight: '1.4', fontWeight: '600' },
      h6: { fontSize: rem(13), lineHeight: '1.45', fontWeight: '600' },
```

- [ ] **Step 5: Verify**

Run: `pnpm build`
Expected: exit 0.

Run `pnpm dev` and render an `<Title order={4}>` — it should now sit visually between h3 and body rather than at Mantine's default proportions.

- [ ] **Step 6: Commit**

```bash
git add src/theme/tokens.types.ts src/theme/tokens.ts
git commit -m "feat(theme): add type, space, state and z token families

Also fills headings.sizes h4-h6, which fell back to Mantine defaults that
did not match the tightened h1-h3 rhythm. state/* replaces the
undocumented 'teal means success' convention repeated across five files."
```

---

### Task 9: The `ai` family

The most-copied literal set in the repo. Keep this task separate — it is the one Layer 1 family whose consumers (Task 16) need judgement calls.

**Files:**
- Modify: `src/theme/tokens.types.ts`, `src/theme/tokens.ts`

**Interfaces:**
- Produces: `--app-ai-{1..6}`, `--app-ai-orb-gradient`, `--app-ai-dot-gradient`, `--app-ai-specular`, `--app-ai-sheen`, `--app-grain-image`, `--app-grain-opacity`, `--app-gloss-ring`.

- [ ] **Step 1: Confirm the duplication baseline**

Run: `grep -rho '#b3bbee' src --include='*.css' | wc -l`
Expected: `8`.

- [ ] **Step 2: Extend `AppTokens` and add values**

```ts
  ai: {
    palette: { 1: string; 2: string; 3: string; 4: string; 5: string; 6: string };
    orbGradient: string;
    dotGradient: string;
    specular: string;
    sheen: string;
    glossRing: string;
    grain: { image: string; opacity: number };
  };
```

Values — the palette names the six pastels the audit found copy-pasted:

```ts
    ai: {
      palette: {
        1: '#b3bbee', // periwinkle — the anchor, 8 hardcoded copies
        2: '#a2a8e2', // periwinkle deep
        3: '#d6e4ff', // sky
        4: '#e0d3fb', // lilac
        5: '#f9dcf1', // blush
        6: '#cef1f6', // mint
      },
      dotGradient:
        'radial-gradient(120% 120% at 35% 30%, #e6ecff 0%, #b3bbee 60%, #a2a8e2 100%)',
      specular:
        'radial-gradient(56% 52% at 32% 26%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0) 70%)',
      glossRing: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
      orbGradient: '<transcribe verbatim from VoiceOrb.module.css:64-70>',
      sheen: '<transcribe verbatim from AskAiBar.module.css:216-224>',
      grain: { image: '<transcribe the data-URI from GradientMark.module.css:57>', opacity: 0.07 },
    },
```

Transcribe the three marked values **exactly** from the cited lines — do not retype them by hand, copy the strings, and confirm with a diff against the source file before committing.

- [ ] **Step 3: Emit — palette/gradients in `variables:`, grain opacity per scheme**

Grain opacity is the one scheme-sensitive member: `0.07` light, `0.13` dark (matching what `AgentAvatar.module.css:78` and `AgentPicker.module.css:195` already do, and which `GradientMark.module.css` is missing entirely).

- [ ] **Step 4: Verify**

Run: `pnpm build`
Expected: exit 0.

Run in devtools: `getComputedStyle(document.body).getPropertyValue('--app-ai-1')`
Expected: `#b3bbee`.

- [ ] **Step 5: Commit**

```bash
git add src/theme/tokens.types.ts src/theme/tokens.ts
git commit -m "feat(theme): add the ai token family

Names the six-pastel AI palette (8 hardcoded copies of #b3bbee alone),
the orb/dot/specular/sheen gradients, the gloss ring and the grain
data-URI that appeared byte-identical in four files."
```

---

## LAYER 2 — Variants

### Task 10: `Paper` / `Card` variants

The surface-panel recipe is re-authored ~32 times, several of them fighting `Paper`'s own themed defaults (`dataDisplay.ts:39-42`).

**Files:**
- Modify: `src/theme/components/dataDisplay.ts`, `src/theme/components/dataDisplay.module.css`

**Interfaces:**
- Produces: `<Paper variant="panel">`, `variant="glass"`, `<Card variant="sectioned">`, `variant="roomy"`. Consumed by Task 14.

- [ ] **Step 1: Add the classes**

In `dataDisplay.module.css`:

```css
.panel {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--mantine-radius-md);
  box-shadow: var(--app-elevation-raised);
}

.glass {
  background: color-mix(in srgb, var(--app-surface) 72%, transparent);
  backdrop-filter: saturate(140%) blur(6px);
  border: 1px solid var(--app-border);
  border-radius: var(--mantine-radius-md);
}

.sectioned {
  padding: 0;
  overflow: hidden;
}
.roomy { padding: var(--mantine-spacing-lg); }
```

- [ ] **Step 2: Wire the variants**

`classNames` as a function receives `(theme, props)`, so key on `props.variant`:

```ts
  Paper: Paper.extend({
    defaultProps: { withBorder: true, shadow: 'xs', radius: 'md' },
    classNames: (_theme, props) => ({
      root:
        props.variant === 'panel' ? classes.panel
        : props.variant === 'glass' ? classes.glass
        : undefined,
    }),
  }),
```

Preserve the existing `defaultProps` exactly as they are at `dataDisplay.ts:39-42`; do not change them. Apply the same pattern to `Card` for `sectioned` / `roomy`.

- [ ] **Step 3: Verify the variant reaches the DOM**

Run `pnpm dev`, render `<Paper variant="panel">test</Paper>` temporarily in any gallery route, and inspect: the root element must carry both the Mantine Paper class and the hashed `.panel` class. Remove the temporary markup before committing.

Run: `pnpm build && pnpm lint`
Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/theme/components/dataDisplay.ts src/theme/components/dataDisplay.module.css
git commit -m "feat(theme): add Paper panel/glass and Card sectioned/roomy variants"
```

---

### Task 11: `Text` variants (new group file)

`Text` is absent from the theme across 249 usages. `fz="xs" c="dimmed"` appears 30×, `fz="sm" c="dimmed"` 26×, and `.eyebrow` is applied 26 times as a raw global string.

**Files:**
- Create: `src/theme/components/text.ts`, `src/theme/components/text.module.css`
- Modify: `src/theme/index.ts`

**Interfaces:**
- Produces: `<Text variant="eyebrow|meta|secondary|label|numeric|body">`, `<UnstyledButton variant="row">`. Consumed by Task 15.

- [ ] **Step 1: Create `text.module.css`**

```css
.eyebrow {
  font-family: var(--mantine-font-family-monospace);
  font-size: var(--app-eyebrow-font-size);
  letter-spacing: var(--app-eyebrow-letter-spacing);
  text-transform: uppercase;
  color: var(--app-muted);
}
.meta { font-size: var(--mantine-font-size-xs); color: var(--mantine-color-dimmed); }
.secondary { font-size: var(--mantine-font-size-sm); color: var(--mantine-color-dimmed); }
.label { font-size: var(--mantine-font-size-sm); font-weight: 600; }
.numeric { font-variant-numeric: tabular-nums; font-feature-settings: 'tnum'; }
.body { font-size: 14px; line-height: 1.65; color: var(--mantine-color-text); }

.row {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--app-row-inset);
  border-radius: var(--mantine-radius-sm);
  transition: background-color var(--app-duration-instant) var(--app-ease-out);
}
.row:hover { background-color: var(--mantine-color-default-hover); }
.row:active { background-color: var(--app-surface-active-press); }
```

Note `.eyebrow` uses `0.04em` via the token, where the global `theme.css` version used `0.06em`. That is the drift the audit flagged; converging on the token value is intentional and will make eyebrow labels very slightly tighter. If that reads wrong in Step 4, change the *token* in `tokens.ts`, not this class.

- [ ] **Step 2: Create `text.ts`**

```ts
import { Text, UnstyledButton } from '@mantine/core';
import classes from './text.module.css';

/**
 * GROUP: Typography & bare interactives
 * Text carried 249 usages with zero theme coverage; these variants name the
 * six recurring treatments the audit found re-authored by hand.
 */
const TEXT_VARIANTS: Record<string, string> = {
  eyebrow: classes.eyebrow,
  meta: classes.meta,
  secondary: classes.secondary,
  label: classes.label,
  numeric: classes.numeric,
  body: classes.body,
};

export const textComponents = {
  Text: Text.extend({
    classNames: (_theme, props) => ({
      root: TEXT_VARIANTS[props.variant as string] ?? undefined,
    }),
  }),

  UnstyledButton: UnstyledButton.extend({
    classNames: (_theme, props) => ({
      root: props.variant === 'row' ? classes.row : undefined,
    }),
  }),
};
```

- [ ] **Step 3: Register the group**

In `src/theme/index.ts`, import `textComponents` and spread it into `components`. Place it **first** in the spread order so later groups can still override — and note the ordering hazard Task 2 fixed: whichever group spreads last wins for a duplicated key.

- [ ] **Step 4: Verify**

Run: `pnpm build && pnpm lint`
Expected: both exit 0.

Run `pnpm dev`, temporarily render each of the six variants side by side, and compare `variant="eyebrow"` against an existing `className="eyebrow"` element. They should look near-identical (modulo the intentional `0.06em → 0.04em` change). Remove the temporary markup.

- [ ] **Step 5: Commit**

```bash
git add src/theme/components/text.ts src/theme/components/text.module.css src/theme/index.ts
git commit -m "feat(theme): add Text variants and UnstyledButton row variant"
```

---

### Task 12: `ActionIcon`, `Button`, `Badge`, input `composer` variants

**Files:**
- Modify: `src/theme/components/actions.ts` + `actions.module.css`, `dataDisplay.ts` + `.module.css`, `inputs.ts` + `.module.css`

**Interfaces:**
- Produces: `<ActionIcon variant="quiet|raised">`, `<Button variant="raised">`, `<Badge variant="chip">`, `<TextInput|Textarea variant="composer">`.

- [ ] **Step 1: Add the classes**

`actions.module.css`:
```css
.quiet { color: var(--app-muted); }
.quiet:hover { color: var(--mantine-color-text); background-color: var(--mantine-color-default-hover); }
.raised {
  box-shadow: var(--app-elevation-raised), var(--app-inset-highlight);
  border: 1px solid var(--app-border-strong);
}
```

`dataDisplay.module.css`:
```css
.chip {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--mantine-radius-sm);
  font-weight: 500;
  text-transform: none;
}
```

`inputs.module.css`:
```css
.composer {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}
.composer:focus, .composer:focus-within { outline: none; box-shadow: none; }
```

- [ ] **Step 2: Wire each variant** using the same `classNames: (_theme, props) => ({...})` pattern as Task 10. Merge with the existing `classNames` objects rather than replacing them — `ActionIcon` already maps `root: classes.actionIcon` (`actions.ts:40`), and that must survive.

- [ ] **Step 3: Verify**

Run: `pnpm build && pnpm lint`
Expected: both exit 0. Render one of each temporarily and confirm the base theme class is still applied alongside the variant class.

- [ ] **Step 4: Commit**

```bash
git add src/theme/components/
git commit -m "feat(theme): add ActionIcon quiet/raised, Button raised, Badge chip, input composer variants"
```

---

### Task 13: Fix the `NavLink` radius gap

`navigation.ts:65-68` sets `styles.root` padding and letter-spacing but no `borderRadius`, so every consumer patches it inline (`GalleryShell.tsx:66`, `SiteNav.tsx:52`).

**Files:**
- Modify: `src/theme/components/navigation.ts:65-68`, `src/gallery/GalleryShell.tsx:66`, `src/components/SiteNav.tsx:52`

- [ ] **Step 1: Confirm**

Run: `grep -rn "borderRadius: 'var(--mantine-radius-md)'" src/gallery/GalleryShell.tsx src/components/SiteNav.tsx`
Expected: 2 matches.

- [ ] **Step 2: Add the radius to the theme**

Add `borderRadius: 'var(--mantine-radius-md)',` to the `styles.root` object in `navigation.ts`.

- [ ] **Step 3: Delete both inline patches**

Remove the whole `styles={{ root: { borderRadius: ... } }}` prop from both call sites.

- [ ] **Step 4: Verify**

Run: `grep -rn "borderRadius" src/gallery/GalleryShell.tsx src/components/SiteNav.tsx`
Expected: no output.

Run: `pnpm build && pnpm lint`
Expected: both exit 0.

Run `pnpm dev` — the sidebar nav links must look unchanged, still with md-rounded hover.

- [ ] **Step 5: Commit**

```bash
git add src/theme/components/navigation.ts src/gallery/GalleryShell.tsx src/components/SiteNav.tsx
git commit -m "fix(theme): give NavLink a radius so consumers stop patching it inline"
```

---

## LAYER 3 — Migration

Four sub-steps, separately committed, ordered by descending mechanical safety so risk concentrates late and bisect stays useful.

### Task 14: Mechanical string swaps across the app

**Files:** ~30 `*.module.css` under `src/gallery`, `src/components`, `src/templates`.

- [ ] **Step 1: Baseline counts**

```bash
echo "ease:  $(grep -rho 'cubic-bezier(0.22, *1, *0.36, *1)' src --include='*.css' | wc -l)"
echo "pill:  $(grep -rho 'border-radius: 999px' src --include='*.css' | wc -l)"
echo "spring: $(grep -rho 'cubic-bezier(0.34, *1.56, *0.64, *1)' src --include='*.css' | wc -l)"
```
Expected after Task 6: ease `32`, pill `41`, spring `11`.

- [ ] **Step 2: Swap easings and pill radii**

```bash
grep -rl 'cubic-bezier(0.22, 1, 0.36, 1)' src --include='*.css' \
  | xargs sed -i '' 's/cubic-bezier(0\.22, 1, 0\.36, 1)/var(--app-ease-out)/g'
grep -rl 'cubic-bezier(0.34, 1.56, 0.64, 1)' src --include='*.css' \
  | xargs sed -i '' 's/cubic-bezier(0\.34, 1\.56, 0\.64, 1)/var(--app-ease-spring)/g'
grep -rl 'border-radius: 999px' src --include='*.css' \
  | xargs sed -i '' 's/border-radius: 999px/border-radius: var(--app-radius-pill)/g'
```

- [ ] **Step 3: Delete the private easing fork**

`src/gallery/collections/askanything/AskAnything.module.css:9-10` declares local `--ease-out` / `--ease-in-out`. Delete both declarations and repoint the 13 consumers in that file at `var(--app-ease-out)` / `var(--app-ease-in-out)`.

- [ ] **Step 4: Remove redundant no-op props**

These restate theme defaults; consumers added them because they could not tell the theme already did it. `tt="none"` and `fw={500}` on `Badge` duplicate `dataDisplay.ts:49`; `shadow="xs"` on `Card` duplicates `dataDisplay.ts:36` (e.g. `EmptyState.tsx:12,41,63`). Remove them; verify each affected element still renders identically.

- [ ] **Step 5: Verify**

```bash
grep -rho 'cubic-bezier(0.22, *1, *0.36, *1)\|border-radius: 999px' src --include='*.css' | wc -l
```
Expected: `0`.

Run: `pnpm build && pnpm lint && pnpm format:check`
Expected: all exit 0.

- [ ] **Step 6: Eyeball**

Run `pnpm dev` and walk **every** gallery route in both schemes. This diff touches ~30 files; a bad `sed` shows up as an unanimated or square-cornered element.

- [ ] **Step 7: Commit**

```bash
git add src/
git commit -m "refactor: migrate app CSS onto motion and radius tokens

Replaces the remaining 32 easing copies, 11 spring copies and 41 pill
radii with tokens, deletes the private --ease-out fork in AskAnything,
and drops props that merely restate theme defaults."
```

---

### Task 15: Panel recipe and Text variants

- [ ] **Step 1: Migrate the panel sites**

Replace the hand-authored surface+border+shadow blocks with `variant="panel"` at the ~22 CSS-module sites and the 3 inline `styles` props (`CommandPalette.tsx:89-96`, `GhostCompletion.tsx:100-108`, `AgentRunTimeline.tsx:126-133`). Work **one file at a time**, checking each in the browser before moving on — several of these sites currently fight `Paper`'s defaults, so removing the override can change the result in ways the CSS alone doesn't predict.

- [ ] **Step 2: Migrate `className="eyebrow"` → `variant="eyebrow"`**

26 occurrences. Five are bare `<span className="eyebrow">` and must become `<Text variant="eyebrow" span>`. Once all are converted, delete `.eyebrow` from `src/theme.css:36-43`.

Run: `grep -rc 'className="eyebrow"' src --include='*.tsx' | grep -v ':0'`
Expected: no output.

- [ ] **Step 3: Migrate the Text prop-combos**

`fz="xs" c="dimmed"` → `variant="meta"` (30 sites), `fz="sm" c="dimmed"` → `variant="secondary"` (26), `fz="sm" fw={600}` → `variant="label"` (9), the tabular-numeral sites → `variant="numeric"` (16, including the hand-rolled local `tnum` const at `Checkout.tsx:19`). Note the prop order varies (`c="dimmed" fz="xs"` etc.), so grep for both orders.

- [ ] **Step 4: Verify**

Run: `pnpm build && pnpm lint && pnpm format:check`
Expected: all exit 0.

- [ ] **Step 5: Eyeball every route in both schemes.** This is the largest-surface task in the plan.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "refactor: migrate panel recipe and Text treatments onto variants"
```

---

### Task 16: Gradient, orb and grain dedupe

**⚠️ DECISION GATE.** This is where the audit found *intentional-looking* drift. A find-replace would silently flatten it. Each item below needs a converge-or-keep decision from the user before you touch it:

| Drift | Values |
|---|---|
| Specular highlight | `0.6 / 0.14 / 0` in `GradientMark.module.css:46-51` and `AgentPicker.module.css:157-162`, but `0.55 / 0.12 / 0` in `AgentAvatar.module.css:60-65` |
| Mesh white percentages | `32/30/26/40` in GradientMark and AgentPicker, `14/12/10/20` in AgentAvatar |
| Mesh alpha pair | `0.92/0.80` vs `0.92/0.78` vs `0.85/0.60` |
| Gloss ring alpha | `0.5` (3 sites) vs `0.55` (2 sites) |
| Grain opacity | `0.07` / `0.1` / `0.13` across five files |

- [ ] **Step 1: Present the table above to the user and get a decision per row.** Where they choose "keep the variance", add a named token for the variant rather than collapsing it.

- [ ] **Step 2: Migrate the AI palette** — the 8 `#b3bbee` and siblings → `var(--app-ai-1..6)`.

- [ ] **Step 3: Migrate the grain data-URI** — 4 byte-identical copies → `var(--app-grain-image)` + `var(--app-grain-opacity)`. This also fixes `GradientMark.module.css`, which has no dark block while both siblings flip grain to `soft-light` in dark.

- [ ] **Step 4: Migrate the orb and dot gradients** — `VoiceOrb.module.css:64-70` / `AmbientOrb.module.css:97-101` → `var(--app-ai-orb-gradient)`; `SelectionSpark.module.css:156-158` / `AmbientOrb.module.css:177-179` → `var(--app-ai-dot-gradient)`.

- [ ] **Step 5: Fix the light-only orb shadows** — `VoiceOrb.module.css:71-85` uses `rgba(9,9,11,0.16)`, so the orb's depth vanishes in dark. Repoint at `var(--app-elevation-raised)`. Same at `AgentAvatar.module.css:28` and `AgentPicker.module.css:148`.

- [ ] **Step 6: Fix the inverted toolbar** — `SelectionSpark.module.css:39,75` hardcodes `#17151f`, matching no token, plus four dependent literals. Repoint at `var(--app-surface-inverted-bg)` / `var(--app-surface-inverted-text)`.

- [ ] **Step 7: Verify**

Run: `grep -rho '#b3bbee\|#a2a8e2\|#17151f' src --include='*.css' | wc -l`
Expected: `0`.

Run: `pnpm build && pnpm lint && pnpm format:check`
Expected: all exit 0.

- [ ] **Step 8: Eyeball the AI routes specifically** — VoiceOrb, AmbientOrb, SelectionSpark, AgentPicker, ThinkingCloud, GradientMark, AgentAvatar, in **both** schemes. Dark mode is the point of several of these fixes, so check it first.

- [ ] **Step 9: Commit**

```bash
git add src/
git commit -m "refactor: dedupe AI gradients, orbs and grain onto tokens

Also fixes three dark-mode bugs surfaced by the dedupe: VoiceOrb's
light-only depth ink, GradientMark's missing dark grain block, and
SelectionSpark's untokenised inverted toolbar.

Drift decisions: <record the Step 1 answers here>"
```

---

## Self-Review Notes

**Spec coverage.** Layer 0 §0.1→Task 1, §0.2→Task 2, §0.3→Tasks 3-4. Layer 1's nine families→Tasks 5,7,8,9 (motion, radius/elevation/surface, type/space/state/z, ai). Layer 2's seven components→Tasks 10-13. Layer 3's four sub-steps→Tasks 14-16 (steps 1-2 merged into Task 14 as both are string-level). Spec's `headings.sizes h4-h6` gap→Task 8 Step 4. Spec's NavLink and redundant-props items→Tasks 13, 14 Step 4.

**Known gaps, deliberately not tasked** (all listed under Deferred in the spec): `spacing`/`fontSizes` overrides, the styleguide route, the unported `reference-theme.css` items, and the six duplicated agent gradient palettes in TS data.

**Two decision gates** requiring the user mid-execution: Task 4 Step 1 (combobox selected-option, plus row inset and divider colour) and Task 16 Step 1 (five rows of gradient drift). Neither should be resolved by guessing.

**Verification honesty.** No test framework exists and no screenshot baseline was authorized. Grep counts prove the *mechanical* change landed; they prove nothing about appearance. Every eyeball step should be reported as "the routes I checked looked correct", never as "no visual regressions".
