# Theme token & variant layer — design

Date: 2026-07-20
Status: approved, pending implementation plan

## Problem

`src/theme` is a **color and component-recipe layer only**. It customizes colors,
type family, radius, shadows and 68 `Component.extend` entries — but it has no
token layer for motion, elevation semantics, typography scale, state colors, or
z-index, and `theme.other` is never used (zero hits repo-wide).

With no home in TS for non-color decisions, every such decision leaked into CSS
strings. Measured across `src/`:

- `cubic-bezier(0.22, 1, 0.36, 1)` — **84 copies**, plus 3 near-identical
  ease-out curves and a private `--ease-out` fork at
  `src/gallery/collections/askanything/AskAnything.module.css:9`.
- `border-radius: 999px` — **40 copies** in 19 files. The Mantine radius scale
  stops at `xl: 16px`, so pills have no token to reach for.
- The AI pastel palette (`#b3bbee` ×8, `#a2a8e2`, `#d6e4ff`, `#e0d3fb`,
  `#f9dcf1`) is copy-pasted, and the full orb gradient stack is duplicated
  verbatim between `VoiceOrb.module.css:64-70` and `AmbientOrb.module.css:97-101`.
- The same 400-character grain SVG data-URI appears in **4** files.
- The surface-panel recipe (`--app-surface` + `--app-border` + `--app-shadow-raised`)
  is re-authored in **~32** places — several of which are *fighting* `Paper`'s own
  themed defaults (`dataDisplay.ts:39-42`).
- **Zero custom variants exist.** Every "look" is re-authored per component
  instead of being addressable as `variant="…"`.

Three of the findings are outright defects, not untidiness — see Layer 0.

## Goals

Make the theme the single source of truth for design decisions, so a look is
named once and reachable from both TS and CSS.

**Non-goals.** No new UI, no styleguide route, no extraction of gallery patterns
into reusable components under `src/components`. `spacing` and `fontSizes`
overrides are explicitly deferred (see Deferred).

## Layer 0 — Defect fixes

These land first and alone, because they change what "correct" looks like; any
screenshot or eyeball comparison taken before them is measuring against a bug.

### 0.1 Scheme-aware shadows

`tokens.ts:89-95` defines `shadows.xs`–`xl` as light-only literals built from
`rgba(9,9,11, 0.03–0.08)`. They live in `baseTheme`, **not** in the
`light`/`dark` branches of `cssVariablesResolver`, so in dark mode
`--mantine-shadow-md` is a ~5%-opacity near-black shadow cast onto `#141417` /
`#0a0a0b` surfaces — effectively invisible.

Everything that floats loses its depth in dark mode: Modal (`feedback.ts:112`),
Drawer (`:128`), Popover (`:149`), HoverCard (`:170`), Tooltip (`:65`),
Notification (`:95`), Dialog (`:196`), every dropdown (`theme.css:69`,
`inputs.module.css:245`), Card hover (`dataDisplay.module.css:46`) and
`.bento-card` hover (`theme.css:32`).

**Fix.** Move the scale into scheme-branched entries in `cssVariablesResolver`.
Keep the light values byte-identical; derive dark equivalents on
`rgba(0,0,0,0.4–0.6)`, matching the light:dark opacity ratio that
`--app-shadow-raised` already uses (`tokens.ts:128-129` vs `142-143`). The theme
already proves it knows the right pattern — the main scale just never got it.

### 0.2 Delete the duplicate SegmentedControl

`SegmentedControl` is themed twice, in two groups:
`inputs.ts:242-249` (→ `inputs.module.css:198-236`) and
`navigation.ts:115-123` (→ `navigation.module.css:160-191`).

Both are spread into `createTheme` (`index.ts:20,23`); `navigationComponents`
spreads last, so **the entire `inputs.ts` block is dead code that reads as
live** — including its materially different indicator recipe
(`light-dark(white, dark-4)` + `neutral-2/dark-3` border, vs navigation's
`--app-surface` + `--app-border-strong`).

**Fix.** Delete the `inputs.ts` block and its CSS. Navigation's is the keeper.
Fold the third orphan fragment (`theme.css:150-152`, segment label padding) into
`navigation.module.css`.

### 0.3 Empty the global `.mantine-*` selectors out of `theme.css`

`theme.css:62-157` contains 13 rules targeting Mantine internal class names.
Beyond version fragility, three of them are **live conflicts** with the component
modules, resolved only by bundle import order (`main.tsx` imports `theme.css` at
line 8, before `./theme` at line 10):

| Conflict | Global says | Module says |
|---|---|---|
| `theme.css:87-90` vs `inputs.module.css:266-270` | selected combobox option = filled primary | selected combobox option = quiet `default-hover` |
| `theme.css:74-79` vs `inputs.module.css:251` | row inset `6px / 9px` | row inset `7px 10px` |
| `theme.css:92-95` vs `navigation.ts:108` | divider `--mantine-color-default-border` | divider `--app-border` |

Identical specificity in each case. One side of each pair is dead and no reader
can tell which.

**Fix.** Move all 13 rules into per-component `classNames`, adding the two
missing theme entries that forced them global in the first place: `Pill` (absent
from `inputs.ts` entirely — which is why `theme.css:112-147` reaches into
rendered SVG internals) and `Combobox`. Each conflict above gets an explicit
recorded decision rather than an import-order accident.

Rules that legitimately stay global: the reset/body block (`theme.css:3-19`),
`code, kbd` (`:45-53`), and `.eyebrow` (`:37-43`) until Layer 2 replaces it.

## Layer 1 — `theme.other`, emitted as `--app-*`

The structural fix. Tokens are defined once as typed TS objects in
`theme.other`, then emitted as CSS custom properties by
`cssVariablesResolver`. TS consumers (component `styles`, `transitionProps`,
`vars` resolvers) read `theme.other.*`; CSS modules read `var(--app-*)`.

Typed via a `satisfies AppTokens` interface plus module augmentation of
Mantine's `MantineThemeOther`, so `theme.other.ease.out` autocompletes.

### Families

| Family | Contents | Replaces |
|---|---|---|
| `motion` | `ease.{out,spring,inOut}`, `duration.{instant,fast,base,slow}` | 84 easing copies; 12 ad-hoc durations; the `EASE` const at `feedback.ts:28` and its two hand-retyped twins at `navigation.ts:94` / `inputs.ts:75` |
| `elevation` | `flat`, `raised`, `overlay`, `modal` | Semantic names over the shadow scale, so "overlay depth" is one edit not six files |
| `radius` | `pill: 999px`, `nub: 2px`, `hairline: 1px` | The three values the Mantine scale cannot express (40 + 7 + 5 sites) |
| `type` | `letterSpacing.*`, `headings.sizes.h4-h6`, the `eyebrow` recipe | 5 conflicting letter-spacing values; the eyebrow recipe written 3× with drift (`0.06em` vs `0.04em`) |
| `space` | `rowInset` | The shared menu / combobox-option / tree-label row padding, currently 3 different values |
| `state` | `success` / `warning` / `danger` / `info`, each a surface/border/text trio | The undocumented "teal means success" convention repeated across 5 files; the hand-mixed `rgba(224,49,49,…)` error ring at `inputs.module.css:59` |
| `z` | named scale | `2000` ×2 plus `1..6` scattered, uncoordinated with Mantine's `zIndex` |
| `ai` | `palette.1-6`, `orbGradient`, `dotGradient`, `specular`, `sheen`, `mesh`, `grain.{image,opacity}` | The copy-pasted pastel palette, the duplicated orb stacks, the 4× grain data-URI |
| `surface` | `inverted{Bg,Text}`, `scrim`, `punchoutRing`, `pulseRing`, `activePress`, `onFill`, `focusRingError` | `#17151f` matching no token; the 3 pulse-ring formulas; `--app-border` misused as a background |

Scheme-sensitive members (`elevation`, `state`, `ai.grain.opacity`,
`surface.*`) are emitted into the resolver's `light`/`dark` branches. Everything
else is scheme-invariant and goes in `variables`.

### Dark-mode bugs this closes

- `GradientMark.module.css` has no `[data-mantine-color-scheme='dark']` block
  while both its siblings (`AgentAvatar.module.css:77`, `AgentPicker.module.css:194`)
  flip grain to `soft-light`. Tokenising grain fixes all three at once.
- `VoiceOrb.module.css:71-85` uses light-only `rgba(9,9,11,0.16)` ink, so the
  orb's depth vanishes in dark. Same miss at `AgentAvatar.module.css:28` and
  `AgentPicker.module.css:148` — both files *have* dark blocks, but only for grain.
- `feedback.module.css:44-50` builds the backdrop scrim from
  `--mantine-color-black` (`#09090b`) in both schemes; against a `#0a0a0b` dark
  body that is near-zero separation. Becomes `surface.scrim`.

### Known trap to preserve

`--app-inset-highlight` is `rgba(255,255,255,0.10)` — correct for the near-black
primary fill, but `dataDisplay.module.css:52-54` applies it to *every*
`[data-variant='filled']` Badge, including teal and yellow ones. The token's
name promises "inset highlight"; its value assumes "the fill is dark". Layer 1
introduces `surface.onFill` to state that assumption explicitly rather than
leaving it implicit, as `inputs.module.css:179-190` already had to patch by hand
for the switch thumb.

## Layer 2 — Variants

Implemented as `classNames` functions keyed on `props.variant`, so they compose
with Mantine's built-in variants rather than replacing them.

| Component | Variants | Call sites collapsed |
|---|---|---|
| `Paper` / `Card` | `panel`, `glass`, `sectioned`, `roomy` | ~32 (+3 inline `styles` props at `CommandPalette.tsx:89`, `GhostCompletion.tsx:100`, `AgentRunTimeline.tsx:126`) |
| `Text` | `eyebrow`, `meta`, `secondary`, `label`, `numeric`, `body` | ~80 prop-combos; `Text` is absent from the theme today across 249 usages |
| `ActionIcon` | `quiet`, `raised` | 13 |
| `Button` | `raised` | 3 inline `styles` immediately |
| `Badge` | `chip` | 5 bespoke chip definitions |
| `TextInput` / `Textarea` | `composer` | 3 |
| `UnstyledButton` | `row` | 3 (no theme entry today) |

`.eyebrow` is the clearest case: it is already a named design token, applied 16
times as a raw global string — 11 as `<Text className="eyebrow">`, 5 as a bare
`<span>`. It becomes `<Text variant="eyebrow">` and the global rule is deleted.

Also fixed here, both pure theme bugs found alongside: `NavLink` has no radius
(`navigation.ts:65-68` sets padding and letter-spacing but not `borderRadius`),
so every consumer patches it inline — `GalleryShell.tsx:66`, `SiteNav.tsx:52`.
And several props in the gallery are redundant no-ops: `tt="none" fw={500}` on
Badge is already the theme default (`dataDisplay.ts:49`), `shadow="xs"` on Card
is already the default (`dataDisplay.ts:36`) — consumers restate them because
they can't tell the theme already does it.

## Layer 3 — Migration

~38 CSS modules plus their `.tsx` call sites, ordered by descending
mechanical-safety so that risk concentrates late and reviewably:

1. **Exact string swaps** — easings, durations, `999px`/`2px`/`1px` radii,
   redundant no-op props. Verifiable by grep; zero judgement.
2. **Panel recipe** → `Paper variant="panel"`.
3. **Text variants** across the prop-combo sites.
4. **Gradient / orb / grain dedupe** — last, because this is where the audit
   found *intentional-looking* drift that a find-replace would silently
   flatten. Specifically: the specular highlight is `0.6 / 0.14 / 0` in
   `GradientMark.module.css:46-51` and `AgentPicker.module.css:157-162` but
   `0.55 / 0.12 / 0` in `AgentAvatar.module.css:60-65`; the mesh recipe's white
   percentages differ (32/30/26/40 vs 14/12/10/20). Each needs a decision —
   converge or keep the variance as a named token — not a substitution.

Out of scope, flagged so it isn't re-audited: the six agent gradient palettes are
duplicated across `agents.ts:54-58`, `AgentMentionComposer.tsx:19-23`,
`AgentPicker.tsx:31-71`, `ToolCalling.tsx:28-44`, `AgentHandoff.tsx:14-15`. Same
tokenisation problem one layer up, in TS data rather than CSS. Separate pass.

## Verification

**Decided: no screenshot baseline.** Verification is by running the dev server
and eyeballing affected routes in both schemes as each layer lands.

This is a deliberate trade and the spec records its cost: with a full-gallery
migration and no baseline, a regression in a less-visited gallery route can pass
unnoticed, and **"no visual regressions" is not a claim that can be
evidenced** — only "the routes I looked at looked right". Implementation reports
should say the latter, not the former.

Mitigations, given no baseline:
- Layer 0 lands and is reviewed alone, before any migration.
- Layer 1 is purely additive — new vars nothing reads yet — so it cannot regress
  anything on its own.
- Layer 3 lands in its four sub-steps as separate commits, so a regression is
  attributable by bisect.
- `tsc -b` and `oxlint` must pass at every step.

## Deferred

- **`spacing` and `fontSizes` overrides.** The app is inventing both by hand
  (`13px` ×9, `15px` ×7, `12.5px` ×6; `padding: 12px` ×14, `gap: 8px` ×14), so
  the cleanup value is real — but overriding these reflows every component in
  the app at once. Landing that inside the same diff as the panel/Text migration
  would make any regression unattributable. Own pass, after this one settles.
- Styleguide route documenting the tokens and variants.
- The `reference-theme.css` items never ported: disabled-input tokens, input
  `filled`/`unstyled` variant branching, Slider label, `RingProgress` track,
  `Skeleton` shimmer, Accordion CSS-var theming.
- Agent gradient palette dedupe (TS-layer, see Layer 3).
