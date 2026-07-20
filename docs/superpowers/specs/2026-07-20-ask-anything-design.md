# Ask anything — agent cursor over a dashboard

Date: 2026-07-20
Status: approved, ready for implementation plan

## The idea

Hold ⌘ over a dashboard and it orbitises: the surface dims, every tile lifts into a
target, and the cursor grows a grainy gradient orb. Click any tile or datapoint and the
orb docks there, unfurls into a composer scoped to what you clicked, and streams the
answer in place — under the number you asked about.

It completes a trilogy already in `AI_PATTERNS`: **Agent picker** (choose an agent),
**Agent anywhere** (call one in text), **Ask anything** (call one onto a thing).

## Placement

A new specimen in `AI_PATTERNS` (`src/gallery/collections/registry.ts`), id
`ask-anything`, placed immediately after `agent-mention`.

Not a top-level view, not a retrofit of `StatsDashboard`. The gallery catalogues
patterns, not apps, and the idea reads at specimen scale.

## Anatomy

The specimen is a small dashboard: three KPI tiles in a row (revenue, active users,
conversion — reusing `StatsDashboard`'s numbers so the gallery stays internally
consistent) over one wider chart tile with a handful of addressable datapoints. Four
targets. Enough to prove the pattern, few enough that the stagger doesn't become a light
show.

Three components in `src/gallery/collections/askanything/`:

| File | Responsibility |
| --- | --- |
| `AskAnything.tsx` | Mode state machine, target registry, pointer/keyboard listeners. The only stateful piece. |
| `AgentCursor.tsx` | The orb. Pure — driven by `x`, `y`, `state` props. Owns the spring follow and the proximity light. |
| `TileComposer.tsx` | Docked input, scoped chips, streaming answer. |

`AgentCursor` borrows the grainy mesh treatment from `src/templates/agentchat/AgentAvatar.tsx`,
deliberately **not** the breathing pulse from `VoiceOrb` — this orb is alert, not idling.
`TileComposer` reuses `AskAiBar`'s stream cadence and `AgentMentionComposer`'s chip.

## State machine

`idle → peeking → docked → answering`. Any state drops to `idle` on `Esc`.

**idle** — a plain dashboard. No hint badge, no armed button. Discovery is the ⌘ hint
line under the specimen, the same way every other pattern documents its keys.

**peeking** — ⌘ held for 250ms while the pointer is inside the card. The hold threshold
exists so a ⌘-Tab flicker doesn't arm the mode. Listeners attach on pointer-enter and
detach on leave, so the other twenty specimens in the gallery never see the key.

**docked** — a click latches the mode. ⌘ can be released. The clicked target stays lit,
everything else stays dim, the orb travels to the target's corner and unfurls the
composer with a scope chip (`Revenue · Q3`).

**answering** — the answer streams in place beneath the number. The composer stays
docked; ⌘-clicking a second target adds a second chip and re-asks across both. Chips cap
at two — "compare these two" is the real use case, "compare these six" is a spreadsheet.

Pointer-leave or scroll during `peeking` drops to `idle`. Neither does anything once
`docked` — latched means latched.

## Visual treatment

Global lift announces the mode; proximity light rewards aiming.

Non-target chrome desaturates (`filter: saturate(0.35)`) rather than greying out, so the
dashboard still reads as itself. Targets lift 2px with a hairline ring — borders over
shadows, per the repo's house style. The nearest target to the orb takes an extra warmth,
driven by pointer distance, that reads as light rather than as a hover state.

## Motion

Curves, declared once in the module CSS:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

| Moment | Treatment | Why |
| --- | --- | --- |
| Arm (`idle → peeking`) | Dim 180ms `--ease-out`; targets lift on a 30ms stagger | Entering → ease-out. Stagger stays under 80ms/item or the mode feels slow to arm. |
| Disarm | 120ms, no stagger | Exit is always faster than enter; reversed stagger reads as sloppy, not symmetric. |
| Orb follow | rAF lerp (~0.18) writing `element.style.transform` directly | A CSS transition on a cursor feels laggy; a lerp feels weighted. Written to the element, never to a parent CSS var — an inherited var recalcs every child each frame. |
| Orb dock | Spring, `duration 0.35, bounce 0.15` | Interruptible: click a second tile mid-flight and it retargets from current velocity instead of restarting. |
| Composer unfurl | `scale(0.96) → 1` + opacity, 200ms `--ease-out`, `transform-origin` at the docking corner | Never `scale(0)` — nothing appears from nothing. Origin-aware so it grows out of the orb, not out of its own centre. |
| Orb → composer handoff | `filter: blur(2px)` crossfade over 200ms | Bridges the two shapes so the eye sees one transformation, not two overlapping objects. |
| Chip enter | 140ms `--ease-out`, slight `translateY` | Small element, short duration. |
| Target press | `scale(0.985)` on `:active`, 120ms | Instant confirmation the interface heard the click. |
| Answer stream | Opacity only; caret blinks `linear` | The content is the animation. Anything more competes with reading. |

Implementation constraints: transitions, not keyframes, everywhere state can be
re-triggered rapidly (arming, docking, chips) — keyframes restart from zero on
interruption. Only `transform`, `opacity`, and `filter` animate.

## The unglamorous parts

**Reduced motion.** `prefers-reduced-motion` removes the stagger, the trail, and the
lift. The orb snaps to the pointer, the dim is instant, opacity transitions stay. Fewer
and gentler, not zero.

**Keyboard.** Targets are real `<button>`s. Tab focuses, Enter docks, and a keyboard user
reaches `answering` without ever touching ⌘. Focus moves into the composer on dock and
returns to the target on `Esc`. The keyboard path skips the arm stagger entirely — a
keyboard-initiated action should never wait on decoration.

**Touch.** 400ms long-press on a target goes straight to `docked`, skipping `peeking`.
No cursor orb; the orb scales up out of the touch point instead. Hover-dependent styling
gated behind `@media (hover: hover) and (pointer: fine)`.

**Card boundaries.** The orb is clipped to the specimen card, so it never escapes into
the gallery. Releasing ⌘ during `peeking` returns to `idle`; releasing it during `docked`
does nothing.

## Testing

Manual, matching the rest of the gallery — there is no test harness here. The checks that
matter: arm/disarm at 4x slow motion in the DevTools animation panel (looking for the two
states overlapping during the orb→composer handoff), keyboard-only traversal to a
streamed answer, a real phone for the long-press, both colour schemes, and `Esc` from
every state.
