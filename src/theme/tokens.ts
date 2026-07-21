import {
  rem,
  defaultVariantColorsResolver,
  type MantineColorsTuple,
  type CSSVariablesResolver,
  type MantineThemeOverride,
  type VariantColorsResolver,
} from '@mantine/core';

import type { AppTokens } from './tokens.types';

/**
 * ─────────────────────────────────────────────────────────────
 *  BASE TOKENS — colors, type, radius.
 *  (Shadows are NOT here: they must flip per color scheme, so they live in
 *  the light/dark branches of `cssVariablesResolver` below.)
 *  Aesthetic target: Attio / Linear / Vercel — refined monochrome,
 *  hairline borders, small radii, quiet shadows, crisp typography,
 *  subtle motion. Per-component styling lives in ./components/*.
 * ─────────────────────────────────────────────────────────────
 */

// Zinc-like neutral scale (0 lightest → 9 darkest).
const neutral: MantineColorsTuple = [
  '#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa',
  '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b',
];

// Dark-scheme surfaces — a true near-black.
// Index roles: 0-1 text · 2 dimmed · 3-4 borders · 6 surface · 7 body.
const dark: MantineColorsTuple = [
  '#ededef', '#c8c8cd', '#8f8f99', '#5c5c66', '#27272a',
  '#1f1f23', '#141417', '#0a0a0b', '#050506', '#000000',
];

// One restrained accent for links / focus / the rare highlight.
const accent: MantineColorsTuple = [
  '#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8',
  '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81',
];

/**
 * Mantine's default filled-variant contrast resolver decides black-vs-white
 * text by parsing the color WITHOUT knowing the active color scheme — it
 * always evaluates against `primaryShade.light`. That's invisible for a
 * theme with a normal (scheme-agnostic) primaryShade, but ours deliberately
 * inverts shade per scheme (light: 9 near-black, dark: 0 near-white) so the
 * filled control's *background* flips — and Mantine picks white text for
 * both, because it thinks it's still looking at the light shade. Fix it
 * once, here: for the primary color's filled/light/subtle variants, use our
 * own scheme-aware `--mantine-primary-color-contrast` var (set per scheme in
 * the CSS variables resolver below) instead of Mantine's miscomputed guess.
 */
const variantColorResolver: VariantColorsResolver = (input) => {
  const base = defaultVariantColorsResolver(input);
  const isPrimary = !input.color || input.color === input.theme.primaryColor;
  if (isPrimary && (input.variant ?? 'filled') === 'filled') {
    return { ...base, color: 'var(--mantine-primary-color-contrast)' };
  }
  return base;
};

export const baseTheme = {
  colors: { neutral, dark, accent },

  other: {
    // The six-pastel AI palette + gradients — the most-copied literal set in
    // the repo (8 hardcoded copies of #b3bbee alone). grain.opacity is the one
    // scheme-sensitive member here (matches AgentAvatar.module.css:78 and
    // AgentPicker.module.css:195); everything else is scheme-invariant.
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
      // Stops are 42%/66% — matching what GradientMark, AgentPicker and
      // AgentAvatar all actually render. (The first draft of this token said
      // 45%/70%, which matched no call site.)
      specular:
        'radial-gradient(56% 52% at 32% 26%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.14) 42%, rgba(255,255,255,0) 66%)',
      // Small marks (~30px) blow out at full strength, so the avatar runs a
      // softer gloss. Kept as its own token rather than collapsed.
      specularSoft:
        'radial-gradient(56% 52% at 32% 26%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0) 66%)',
      glossRing: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
      // The five-stop mesh recipe is shared by GradientMark and AgentPicker;
      // only the blob positions differ between them. AgentAvatar renders the
      // same recipe with far less white so it stays legible at avatar size.
      mesh: {
        whiteBase: '32%',
        whiteA: '30%',
        whiteB: '26%',
        whiteC: '40%',
        bloom1: '0.92',
        bloom2: '0.8',
      },
      meshSoft: {
        whiteBase: '14%',
        whiteA: '12%',
        whiteB: '10%',
        whiteC: '20%',
        bloom1: '0.85',
        bloom2: '0.6',
      },
      // Transcribed verbatim from VoiceOrb.module.css:65-70 (the `.orb`
      // background's multi-layer radial stack).
      orbGradient:
        'radial-gradient(58% 56% at 30% 26%, rgba(255, 255, 255, 0.92) 0%, transparent 54%), radial-gradient(60% 60% at 34% 28%, #d6e4ff 0%, transparent 60%), radial-gradient(52% 52% at 72% 30%, #cef1f6 0%, transparent 58%), radial-gradient(58% 58% at 70% 74%, #e0d3fb 0%, transparent 62%), radial-gradient(55% 55% at 30% 72%, #f9dcf1 0%, transparent 58%), radial-gradient(120% 120% at 50% 42%, #d5ddf8 0%, #b3bbee 70%, #a2a8e2 100%)',
      // Transcribed verbatim from AskAiBar.module.css:217-222 (the
      // `.shimmerLine::after` sweep gradient).
      sheen:
        'linear-gradient(90deg, transparent 0%, var(--mantine-color-default-border) 50%, transparent 100%)',
      grain: {
        // Transcribed verbatim from GradientMark.module.css:57 — byte-identical
        // across GradientMark/AgentAvatar/AgentPicker/VoiceOrb.
        image:
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        opacity: { light: '0.07', dark: '0.13' },
      },
    },
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
    // The three the Mantine radius scale cannot express (it starts at xs: 5px
    // and stops at xl: 16px). 41 hardcoded `999px` existed before this.
    radius: { pill: '999px', nub: '2px', hairline: '1px' },
    // elevation/surface are scheme-sensitive: each token carries its light and
    // dark value here, and `cssVariablesResolver` below just reads through
    // into the matching branch. theme.other is the single source of truth
    // for every family — including these two.
    elevation: {
      flat: { light: 'none', dark: 'none' },
      raised: { light: 'var(--app-shadow-raised)', dark: 'var(--app-shadow-raised)' },
      overlay: { light: 'var(--mantine-shadow-md)', dark: 'var(--mantine-shadow-md)' },
      modal: { light: 'var(--mantine-shadow-lg)', dark: 'var(--mantine-shadow-lg)' },
      // The ink the voice orb casts. Light-only values were the reason the
      // orb read as flat on dark; these are the same colours re-weighted for
      // a dark backdrop (same ratio the raised shadows use).
      orbInkFar: { light: 'rgba(9,9,11,0.16)', dark: 'rgba(0,0,0,0.55)' },
      orbInkNear: { light: 'rgba(9,9,11,0.1)', dark: 'rgba(0,0,0,0.40)' },
    },
    surface: {
      invertedBg: { light: 'var(--mantine-color-dark-6)', dark: 'var(--mantine-color-dark-4)' },
      invertedText: { light: 'rgba(255,255,255,0.86)', dark: 'var(--mantine-color-dark-0)' },
      scrim: { light: 'rgba(9,9,11,0.35)', dark: 'rgba(0,0,0,0.62)' },
      punchoutRing: { light: 'var(--app-bg)', dark: 'var(--app-bg)' },
      pulseRing: {
        light: 'color-mix(in srgb, var(--mantine-color-text) 35%, transparent)',
        dark: 'color-mix(in srgb, var(--mantine-color-text) 30%, transparent)',
      },
      activePress: { light: 'var(--app-border)', dark: 'var(--app-border)' },
      onFill: {
        light: 'var(--mantine-primary-color-contrast)',
        dark: 'var(--mantine-primary-color-contrast)',
      },
      focusRingError: {
        light: '0 0 0 3px rgba(224,49,49,0.16)',
        dark: '0 0 0 3px rgba(255,120,120,0.20)',
      },
    },
    type: {
      tracking: { tight: '-0.025em', snug: '-0.011em', normal: '-0.006em', label: '0.04em' },
      // Written by hand three times before this, with 0.06em vs 0.04em drift.
      eyebrow: { fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' },
    },
    // The shared menu / combobox-option / tree-label inset, previously three
    // different values (6px/9px, 7px/10px, 4px/8px). 6px/9px chosen to match
    // .option (inputs.module.css) and .menuItem (navigation.module.css),
    // which already ship padding-block: 6px; padding-inline: 9px.
    space: { rowInset: '6px 9px' },
    // state is scheme-sensitive (each slot flips with the color scheme), so —
    // like elevation/surface above — it carries light/dark pairs here and
    // cssVariablesResolver just reads through into the matching branch.
    state: {
      success: {
        surface: { light: 'var(--mantine-color-teal-0)', dark: 'var(--mantine-color-teal-9)' },
        border: { light: 'var(--mantine-color-teal-3)', dark: 'var(--mantine-color-teal-7)' },
        text: { light: 'var(--mantine-color-teal-8)', dark: 'var(--mantine-color-teal-3)' },
      },
      warning: {
        surface: {
          light: 'var(--mantine-color-yellow-0)',
          dark: 'var(--mantine-color-yellow-9)',
        },
        border: {
          light: 'var(--mantine-color-yellow-3)',
          dark: 'var(--mantine-color-yellow-7)',
        },
        text: { light: 'var(--mantine-color-yellow-8)', dark: 'var(--mantine-color-yellow-3)' },
      },
      danger: {
        surface: { light: 'var(--mantine-color-red-0)', dark: 'var(--mantine-color-red-9)' },
        border: { light: 'var(--mantine-color-red-3)', dark: 'var(--mantine-color-red-7)' },
        text: { light: 'var(--mantine-color-red-8)', dark: 'var(--mantine-color-red-3)' },
      },
      info: {
        surface: { light: 'var(--mantine-color-accent-0)', dark: 'var(--mantine-color-accent-9)' },
        border: { light: 'var(--mantine-color-accent-3)', dark: 'var(--mantine-color-accent-7)' },
        text: { light: 'var(--mantine-color-accent-8)', dark: 'var(--mantine-color-accent-3)' },
      },
    },
    z: { base: 1, sticky: 100, dropdown: 300, overlay: 400, modal: 500, toast: 600 },
  } satisfies AppTokens,

  // Filled controls: near-black (light) / near-white (dark).
  primaryColor: 'neutral',
  primaryShade: { light: 9, dark: 0 },
  autoContrast: true,
  luminanceThreshold: 0.4,
  variantColorResolver,

  white: '#ffffff',
  black: '#09090b',

  fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFamilyMonospace: "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
  headings: {
    fontFamily: "'Geist', sans-serif",
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(34), lineHeight: '1.15', fontWeight: '600' },
      h2: { fontSize: rem(26), lineHeight: '1.2', fontWeight: '600' },
      h3: { fontSize: rem(20), lineHeight: '1.3', fontWeight: '600' },
      h4: { fontSize: rem(17), lineHeight: '1.35', fontWeight: '600' },
      h5: { fontSize: rem(15), lineHeight: '1.4', fontWeight: '600' },
      h6: { fontSize: rem(13), lineHeight: '1.45', fontWeight: '600' },
    },
  },

  defaultRadius: 'md',
  radius: { xs: rem(5), sm: rem(6), md: rem(8), lg: rem(12), xl: rem(16) },

  cursorType: 'pointer',
  focusRing: 'auto',
} satisfies MantineThemeOverride;

/**
 * Page-level tokens, per scheme. Includes the "chewy" reusable primitives:
 * - --app-shadow-raised / -hover : tactile button & input depth (border + shadow)
 * - --app-inset-highlight        : faint top highlight so filled controls "lift"
 * - --app-control-height-*        : consistent control heights across the set
 * - --app-focus-ring              : a calm, crisp focus halo
 */
export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    // Consistent base heights — inputs & buttons share these.
    // Sized to comfortably fit content (never clip the label).
    '--app-control-height-xs': '30px',
    '--app-control-height-sm': '36px',
    '--app-control-height-md': '42px',
    '--app-control-height-lg': '48px',
    '--app-control-height-xl': '58px',

    '--app-ease-out': theme.other.motion.ease.out,
    '--app-ease-spring': theme.other.motion.ease.spring,
    '--app-ease-in-out': theme.other.motion.ease.inOut,
    '--app-duration-instant': `${theme.other.motion.duration.instant}ms`,
    '--app-duration-fast': `${theme.other.motion.duration.fast}ms`,
    '--app-duration-base': `${theme.other.motion.duration.base}ms`,
    '--app-duration-slow': `${theme.other.motion.duration.slow}ms`,

    '--app-radius-pill': theme.other.radius.pill,
    '--app-radius-nub': theme.other.radius.nub,
    '--app-radius-hairline': theme.other.radius.hairline,

    '--app-tracking-tight': theme.other.type.tracking.tight,
    '--app-tracking-snug': theme.other.type.tracking.snug,
    '--app-tracking-normal': theme.other.type.tracking.normal,
    '--app-tracking-label': theme.other.type.tracking.label,
    '--app-eyebrow-font-size': theme.other.type.eyebrow.fontSize,
    '--app-eyebrow-letter-spacing': theme.other.type.eyebrow.letterSpacing,
    '--app-eyebrow-text-transform': theme.other.type.eyebrow.textTransform,

    '--app-row-inset': theme.other.space.rowInset,

    '--app-ai-1': theme.other.ai.palette[1],
    '--app-ai-2': theme.other.ai.palette[2],
    '--app-ai-3': theme.other.ai.palette[3],
    '--app-ai-4': theme.other.ai.palette[4],
    '--app-ai-5': theme.other.ai.palette[5],
    '--app-ai-6': theme.other.ai.palette[6],
    '--app-ai-orb-gradient': theme.other.ai.orbGradient,
    '--app-ai-dot-gradient': theme.other.ai.dotGradient,
    '--app-ai-specular': theme.other.ai.specular,
    '--app-ai-specular-soft': theme.other.ai.specularSoft,
    '--app-ai-sheen': theme.other.ai.sheen,

    '--app-ai-mesh-white-base': theme.other.ai.mesh.whiteBase,
    '--app-ai-mesh-white-a': theme.other.ai.mesh.whiteA,
    '--app-ai-mesh-white-b': theme.other.ai.mesh.whiteB,
    '--app-ai-mesh-white-c': theme.other.ai.mesh.whiteC,
    '--app-ai-mesh-bloom-1': theme.other.ai.mesh.bloom1,
    '--app-ai-mesh-bloom-2': theme.other.ai.mesh.bloom2,
    '--app-ai-mesh-soft-white-base': theme.other.ai.meshSoft.whiteBase,
    '--app-ai-mesh-soft-white-a': theme.other.ai.meshSoft.whiteA,
    '--app-ai-mesh-soft-white-b': theme.other.ai.meshSoft.whiteB,
    '--app-ai-mesh-soft-white-c': theme.other.ai.meshSoft.whiteC,
    '--app-ai-mesh-soft-bloom-1': theme.other.ai.meshSoft.bloom1,
    '--app-ai-mesh-soft-bloom-2': theme.other.ai.meshSoft.bloom2,
    '--app-gloss-ring': theme.other.ai.glossRing,
    '--app-grain-image': theme.other.ai.grain.image,

    '--app-z-base': String(theme.other.z.base),
    '--app-z-sticky': String(theme.other.z.sticky),
    '--app-z-dropdown': String(theme.other.z.dropdown),
    '--app-z-overlay': String(theme.other.z.overlay),
    '--app-z-modal': String(theme.other.z.modal),
    '--app-z-toast': String(theme.other.z.toast),
  },
  light: {
    /* Filled primary is near-black in light → its text/icon must be light. */
    '--mantine-primary-color-contrast': '#ffffff',
    '--app-bg': '#fafafa',
    '--app-surface': '#ffffff',
    '--app-border': 'var(--mantine-color-neutral-2)',
    '--app-border-strong': 'var(--mantine-color-neutral-3)',
    '--app-muted': 'var(--mantine-color-neutral-5)',
    '--app-grid-line': 'rgba(9,9,11,0.045)',
    // Chewy tactile depth for raised controls (default/outline buttons, inputs).
    '--app-orb-ink-far': theme.other.elevation.orbInkFar.light,
    '--app-orb-ink-near': theme.other.elevation.orbInkNear.light,
    '--app-shadow-raised': '0 1px 2px rgba(9,9,11,0.06), 0 1px 1px rgba(9,9,11,0.04)',
    '--app-shadow-raised-hover': '0 2px 4px rgba(9,9,11,0.08), 0 1px 2px rgba(9,9,11,0.05)',
    '--app-inset-highlight': 'inset 0 1px 0 rgba(255,255,255,0.10)',
    '--app-focus-ring': '0 0 0 3px rgba(9,9,11,0.10)',
    '--app-grain-opacity': theme.other.ai.grain.opacity.light,
    // Chewy, layered shadows — border + soft depth. Multi-layer so surfaces
    // feel tactile and substantial (the Vercel / Linear / Attio signature).
    '--mantine-shadow-xs': '0 1px 2px rgba(9,9,11,0.05), 0 1px 1px rgba(9,9,11,0.04)',
    '--mantine-shadow-sm':
      '0 1px 2px rgba(9,9,11,0.05), 0 2px 4px rgba(9,9,11,0.05), 0 4px 8px rgba(9,9,11,0.03)',
    '--mantine-shadow-md':
      '0 2px 4px rgba(9,9,11,0.04), 0 4px 8px rgba(9,9,11,0.05), 0 8px 16px rgba(9,9,11,0.05)',
    '--mantine-shadow-lg':
      '0 4px 8px rgba(9,9,11,0.04), 0 8px 20px rgba(9,9,11,0.06), 0 16px 32px rgba(9,9,11,0.06)',
    '--mantine-shadow-xl':
      '0 8px 24px rgba(9,9,11,0.08), 0 16px 40px rgba(9,9,11,0.08), 0 32px 64px rgba(9,9,11,0.06)',

    // Names the *role* over the shadow scale, so changing overlay depth
    // becomes one edit instead of six files. Values live on theme.other —
    // this just reads through into the light branch.
    '--app-elevation-flat': theme.other.elevation.flat.light,
    '--app-elevation-raised': theme.other.elevation.raised.light,
    '--app-elevation-overlay': theme.other.elevation.overlay.light,
    '--app-elevation-modal': theme.other.elevation.modal.light,
    '--app-surface-inverted-bg': theme.other.surface.invertedBg.light,
    '--app-surface-inverted-text': theme.other.surface.invertedText.light,
    '--app-surface-scrim': theme.other.surface.scrim.light,
    '--app-surface-punchout-ring': theme.other.surface.punchoutRing.light,
    '--app-surface-pulse-ring': theme.other.surface.pulseRing.light,
    '--app-surface-active-press': theme.other.surface.activePress.light,
    '--app-surface-on-fill': theme.other.surface.onFill.light,
    '--app-surface-focus-ring-error': theme.other.surface.focusRingError.light,

    '--app-state-success-surface': theme.other.state.success.surface.light,
    '--app-state-success-border': theme.other.state.success.border.light,
    '--app-state-success-text': theme.other.state.success.text.light,
    '--app-state-warning-surface': theme.other.state.warning.surface.light,
    '--app-state-warning-border': theme.other.state.warning.border.light,
    '--app-state-warning-text': theme.other.state.warning.text.light,
    '--app-state-danger-surface': theme.other.state.danger.surface.light,
    '--app-state-danger-border': theme.other.state.danger.border.light,
    '--app-state-danger-text': theme.other.state.danger.text.light,
    '--app-state-info-surface': theme.other.state.info.surface.light,
    '--app-state-info-border': theme.other.state.info.border.light,
    '--app-state-info-text': theme.other.state.info.text.light,
  },
  dark: {
    /* Filled primary is near-white in dark → its text/icon must be dark. */
    '--mantine-primary-color-contrast': '#09090b',
    '--app-bg': 'var(--mantine-color-dark-7)',
    '--app-surface': 'var(--mantine-color-dark-6)',
    '--app-border': 'var(--mantine-color-dark-4)',
    '--app-border-strong': 'var(--mantine-color-dark-3)',
    '--app-muted': 'var(--mantine-color-dark-2)',
    '--app-grid-line': 'rgba(255,255,255,0.04)',
    '--app-orb-ink-far': theme.other.elevation.orbInkFar.dark,
    '--app-orb-ink-near': theme.other.elevation.orbInkNear.dark,
    '--app-shadow-raised': '0 1px 2px rgba(0,0,0,0.40), 0 1px 1px rgba(0,0,0,0.30)',
    '--app-shadow-raised-hover': '0 2px 6px rgba(0,0,0,0.50), 0 1px 2px rgba(0,0,0,0.35)',
    '--app-inset-highlight': 'inset 0 1px 0 rgba(255,255,255,0.06)',
    '--app-focus-ring': '0 0 0 3px rgba(255,255,255,0.14)',
    '--app-grain-opacity': theme.other.ai.grain.opacity.dark,
    '--mantine-shadow-xs': '0 1px 2px rgba(0,0,0,0.40), 0 1px 1px rgba(0,0,0,0.30)',
    '--mantine-shadow-sm':
      '0 1px 2px rgba(0,0,0,0.44), 0 2px 4px rgba(0,0,0,0.36), 0 4px 8px rgba(0,0,0,0.28)',
    '--mantine-shadow-md':
      '0 2px 4px rgba(0,0,0,0.44), 0 4px 8px rgba(0,0,0,0.40), 0 8px 16px rgba(0,0,0,0.34)',
    '--mantine-shadow-lg':
      '0 4px 8px rgba(0,0,0,0.46), 0 8px 20px rgba(0,0,0,0.44), 0 16px 32px rgba(0,0,0,0.38)',
    '--mantine-shadow-xl':
      '0 8px 24px rgba(0,0,0,0.52), 0 16px 40px rgba(0,0,0,0.48), 0 32px 64px rgba(0,0,0,0.42)',

    // The elevation aliases below are identical text to the light branch —
    // they resolve through already-scheme-aware vars (--app-shadow-raised,
    // --mantine-shadow-md/lg), so they stay per-scheme on purpose: a future
    // divergence becomes a one-line change instead of a restructure.
    '--app-elevation-flat': theme.other.elevation.flat.dark,
    '--app-elevation-raised': theme.other.elevation.raised.dark,
    '--app-elevation-overlay': theme.other.elevation.overlay.dark,
    '--app-elevation-modal': theme.other.elevation.modal.dark,
    '--app-surface-inverted-bg': theme.other.surface.invertedBg.dark,
    '--app-surface-inverted-text': theme.other.surface.invertedText.dark,
    // Pure black over a #0a0a0b body gives no separation; lift the scrim.
    '--app-surface-scrim': theme.other.surface.scrim.dark,
    '--app-surface-punchout-ring': theme.other.surface.punchoutRing.dark,
    '--app-surface-pulse-ring': theme.other.surface.pulseRing.dark,
    '--app-surface-active-press': theme.other.surface.activePress.dark,
    '--app-surface-on-fill': theme.other.surface.onFill.dark,
    '--app-surface-focus-ring-error': theme.other.surface.focusRingError.dark,

    '--app-state-success-surface': theme.other.state.success.surface.dark,
    '--app-state-success-border': theme.other.state.success.border.dark,
    '--app-state-success-text': theme.other.state.success.text.dark,
    '--app-state-warning-surface': theme.other.state.warning.surface.dark,
    '--app-state-warning-border': theme.other.state.warning.border.dark,
    '--app-state-warning-text': theme.other.state.warning.text.dark,
    '--app-state-danger-surface': theme.other.state.danger.surface.dark,
    '--app-state-danger-border': theme.other.state.danger.border.dark,
    '--app-state-danger-text': theme.other.state.danger.text.dark,
    '--app-state-info-surface': theme.other.state.info.surface.dark,
    '--app-state-info-border': theme.other.state.info.border.dark,
    '--app-state-info-text': theme.other.state.info.text.dark,
  },
});
