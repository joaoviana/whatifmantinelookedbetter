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
    '--app-shadow-raised': '0 1px 2px rgba(9,9,11,0.06), 0 1px 1px rgba(9,9,11,0.04)',
    '--app-shadow-raised-hover': '0 2px 4px rgba(9,9,11,0.08), 0 1px 2px rgba(9,9,11,0.05)',
    '--app-inset-highlight': 'inset 0 1px 0 rgba(255,255,255,0.10)',
    '--app-focus-ring': '0 0 0 3px rgba(9,9,11,0.10)',
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
    '--app-shadow-raised': '0 1px 2px rgba(0,0,0,0.40), 0 1px 1px rgba(0,0,0,0.30)',
    '--app-shadow-raised-hover': '0 2px 6px rgba(0,0,0,0.50), 0 1px 2px rgba(0,0,0,0.35)',
    '--app-inset-highlight': 'inset 0 1px 0 rgba(255,255,255,0.06)',
    '--app-focus-ring': '0 0 0 3px rgba(255,255,255,0.14)',
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
  },
});
