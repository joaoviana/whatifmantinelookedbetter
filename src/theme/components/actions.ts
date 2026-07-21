import type { MantineTheme } from '@mantine/core';
import { Button, ActionIcon, Anchor, Chip, CloseButton, Kbd } from '@mantine/core';
import classes from './actions.module.css';

/**
 * GROUP: Buttons & Actions
 * Owned by one agent. Export a flat object of Component.extend(...) entries.
 * Aesthetic: Attio / Linear / Vercel — refined monochrome, now CHEWIER:
 * filled controls lift out of the surface (inset highlight + raised shadow),
 * default/outline carry a tactile raised depth with a strong hairline, and
 * every control shares a height with inputs. Press feels satisfying — a 1px
 * settle that removes the hover lift. State/motion lives in actions.module.css.
 */

// Consistent control heights so Buttons / ActionIcons line up with inputs.
const CONTROL_HEIGHTS: Record<string, string> = {
  xs: 'var(--app-control-height-xs)',
  sm: 'var(--app-control-height-sm)',
  md: 'var(--app-control-height-md)',
  lg: 'var(--app-control-height-lg)',
  xl: 'var(--app-control-height-xl)',
};

const cx = (...names: (string | undefined)[]) => names.filter(Boolean).join(' ');

// Variants Mantine doesn't know about: defaultVariantColorsResolver returns an
// empty object for any variant it doesn't recognise, which would leave the
// control with no background/color/border at all. So each custom variant
// borrows the palette of a real one and the module class layers depth on top.
const CUSTOM_VARIANT_BASE: Record<string, string> = { quiet: 'subtle', raised: 'default' };

const ACTION_ICON_VARIANTS: Record<string, string> = {
  quiet: classes.quiet,
  raised: classes.raised,
};

const customVariantVars = (
  prefix: string,
  theme: MantineTheme,
  variant: string | undefined,
  color: string | undefined,
) => {
  const base = CUSTOM_VARIANT_BASE[variant as string];
  if (!base) return {};
  const c = theme.variantColorResolver({ color: color || theme.primaryColor, theme, variant: base });
  return {
    [`--${prefix}-bg`]: c.background,
    [`--${prefix}-hover`]: c.hover,
    [`--${prefix}-color`]: c.color,
    [`--${prefix}-bd`]: c.border,
  };
};

export const actionsComponents = {
  Button: Button.extend({
    defaultProps: { radius: 'md' },
    classNames: (_theme, props) => ({
      root: cx(classes.button, props.variant === 'raised' ? classes.raised : undefined),
    }),
    // Pin the control height per named size (compact-* pass through untouched).
    vars: (theme, props) => {
      const h = CONTROL_HEIGHTS[(props.size as string) ?? 'sm'];
      return {
        root: {
          ...(h ? { '--button-height': h } : {}),
          ...customVariantVars('button', theme, props.variant as string, props.color as string),
        },
      };
    },
    styles: {
      root: { fontWeight: 500, letterSpacing: '-0.006em' },
      section: { opacity: 0.9 },
    },
  }),

  // `quiet` is the muted inline/toolbar icon; `raised` is the default control
  // with real depth. Both keep the base .actionIcon class.
  ActionIcon: ActionIcon.extend({
    defaultProps: { radius: 'md' },
    classNames: (_theme, props) => ({
      root: cx(classes.actionIcon, ACTION_ICON_VARIANTS[props.variant as string]),
    }),
    vars: (theme, props) => {
      const h = CONTROL_HEIGHTS[(props.size as string) ?? 'md'];
      return {
        root: {
          ...(h ? { '--ai-size': h } : {}),
          ...customVariantVars('ai', theme, props.variant as string, props.color as string),
        },
      };
    },
  }),

  Anchor: Anchor.extend({
    defaultProps: { underline: 'not-hover' },
    classNames: { root: classes.anchor },
    styles: { root: { fontWeight: 500, letterSpacing: '-0.006em' } },
  }),

  // Mantine's own Chip stylesheet hardcodes the checked state's text to
  // `--mantine-color-white` unless a `color`/`variant` prop is explicitly
  // passed (only then does it run `theme.variantColorResolver`, which we've
  // already fixed above). Force that resolver to run unconditionally so a
  // plain, propless <Chip> also gets scheme-correct contrast.
  Chip: Chip.extend({
    defaultProps: { radius: 'sm' },
    classNames: { label: classes.chipLabel },
    styles: { label: { fontWeight: 500, letterSpacing: '-0.006em' } },
    vars: (theme, { color, variant, autoContrast }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        variant: variant || 'filled',
        autoContrast,
      });
      return { root: { '--chip-bg': colors.background, '--chip-hover': colors.hover, '--chip-color': colors.color, '--chip-bd': colors.border } };
    },
  }),

  CloseButton: CloseButton.extend({
    defaultProps: { radius: 'md' },
    classNames: { root: classes.closeButton },
  }),

  // Chewy keycap — a hairline border, an inset highlight and a hint of raise
  // so it reads as a physical key rather than a flat pill.
  Kbd: Kbd.extend({
    classNames: { root: classes.kbd },
  }),
};
