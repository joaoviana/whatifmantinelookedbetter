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

export const actionsComponents = {
  Button: Button.extend({
    defaultProps: { radius: 'md' },
    classNames: { root: classes.button },
    // Pin the control height per named size (compact-* pass through untouched).
    vars: (_theme, props) => {
      const h = CONTROL_HEIGHTS[(props.size as string) ?? 'sm'];
      return { root: h ? { '--button-height': h } : {} };
    },
    styles: {
      root: { fontWeight: 500, letterSpacing: '-0.006em' },
      section: { opacity: 0.9 },
    },
  }),

  ActionIcon: ActionIcon.extend({
    defaultProps: { radius: 'md' },
    classNames: { root: classes.actionIcon },
    vars: (_theme, props) => {
      const h = CONTROL_HEIGHTS[(props.size as string) ?? 'md'];
      return { root: h ? { '--ai-size': h } : {} };
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
