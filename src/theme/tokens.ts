import {
  rem,
  defaultVariantColorsResolver,
  type MantineColorsTuple,
  type CSSVariablesResolver,
  type MantineThemeOverride,
  type VariantColorsResolver,
} from '@mantine/core';

/**
 * ─────────────────────────────────────────────────────────────
 *  BASE TOKENS — colors, type, radius, shadows.
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

  // Chewy, layered shadows — border + soft depth. Multi-layer so surfaces
  // feel tactile and substantial (the Vercel / Linear / Attio signature).
  shadows: {
    xs: '0 1px 2px rgba(9,9,11,0.05), 0 1px 1px rgba(9,9,11,0.04)',
    sm: '0 1px 2px rgba(9,9,11,0.05), 0 2px 4px rgba(9,9,11,0.05), 0 4px 8px rgba(9,9,11,0.03)',
    md: '0 2px 4px rgba(9,9,11,0.04), 0 4px 8px rgba(9,9,11,0.05), 0 8px 16px rgba(9,9,11,0.05)',
    lg: '0 4px 8px rgba(9,9,11,0.04), 0 8px 20px rgba(9,9,11,0.06), 0 16px 32px rgba(9,9,11,0.06)',
    xl: '0 8px 24px rgba(9,9,11,0.08), 0 16px 40px rgba(9,9,11,0.08), 0 32px 64px rgba(9,9,11,0.06)',
  },

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
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    // Consistent base heights — inputs & buttons share these.
    // Sized to comfortably fit content (never clip the label).
    '--app-control-height-xs': '30px',
    '--app-control-height-sm': '36px',
    '--app-control-height-md': '42px',
    '--app-control-height-lg': '48px',
    '--app-control-height-xl': '58px',
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
  },
});
