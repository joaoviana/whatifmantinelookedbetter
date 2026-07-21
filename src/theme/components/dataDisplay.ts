import type { CSSProperties } from 'react';
import {
  rem,
  Card,
  Paper,
  Badge,
  Avatar,
  Table,
  ThemeIcon,
  Code,
  List,
  Timeline,
  Blockquote,
  Spoiler,
  Image,
  Mark,
  Title,
} from '@mantine/core';
import classes from './dataDisplay.module.css';

/**
 * GROUP: Data Display
 * Aesthetic: Attio / Linear / Vercel — tactile bordered surfaces on a hairline
 * (var(--app-border)): cards pair the hairline with a LAYERED shadow
 * (--mantine-shadow-xs) and lift on hover; table headers get a stronger
 * separator (--app-border-strong); filled badges catch a faint
 * --app-inset-highlight so they read as solid pills.
 * autoContrast + primaryShade do the black/white work — never hardcode them.
 */
const cx = (...names: (string | undefined)[]) => names.filter(Boolean).join(' ');

const PAPER_VARIANTS: Record<string, string> = {
  panel: classes.panel,
  glass: classes.glass,
};

const CARD_VARIANTS: Record<string, string> = {
  sectioned: classes.sectioned,
};

export const dataDisplayComponents = {
  // Surfaces: hairline border + layered shadow-xs. Generous default padding so
  // compositions breathe; bg = var(--mantine-color-default) (reference token).
  // Hover lifts to shadow-sm + translateY(-2px) with border→--app-muted
  // (module, behind reduced-motion). Card.Section borders → default-border.
  // `variant="sectioned"` zeroes the gutter so Card.Section owns all spacing;
  // `variant="roomy"` is the airier card. Both stack on top of .card.
  Card: Card.extend({
    defaultProps: { radius: 'lg', padding: 'md', withBorder: true, shadow: 'xs' },
    classNames: (_theme, props) => ({
      root: cx(classes.card, CARD_VARIANTS[props.variant as string]),
      section: classes.cardSection,
    }),
    // Mantine writes --card-padding into the root's inline style from the
    // `padding` prop, so a CSS class can't move it — the gutter variants have
    // to override the variable here. Going through --card-padding (rather than
    // `padding`) keeps Card.Section's negative-margin math correct.
    vars: (_theme, props) => ({
      root:
        props.variant === 'sectioned' ? { '--card-padding': '0px' }
        : props.variant === 'roomy' ? { '--card-padding': 'var(--mantine-spacing-lg)' }
        : {},
    }),
  }),
  // `variant="panel"` is the bordered surface recipe the app hand-rolls ~32×;
  // `variant="glass"` is the same hairline over a translucent blurred backdrop.
  Paper: Paper.extend({
    defaultProps: { radius: 'lg', p: 'md', withBorder: true, shadow: 'xs' },
    classNames: (_theme, props) => ({
      root: cx(classes.paper, PAPER_VARIANTS[props.variant as string]),
    }),
  }),

  // Light by default, medium weight, no shouting. Filled variant gets a faint
  // inset top-highlight (module) so the pill reads as solid, not flat.
  Badge: Badge.extend({
    defaultProps: { variant: 'light', radius: 'sm' },
    classNames: (_theme, props) => ({
      root: cx(classes.badge, props.variant === 'chip' ? classes.chip : undefined),
    }),
    styles: { root: { fontWeight: 500, textTransform: 'none', letterSpacing: '-0.003em' } },
  }),

  // Circular, medium-weight initials; a hairline ring when overlapped (module).
  Avatar: Avatar.extend({
    defaultProps: { radius: 'xl' },
    classNames: { root: classes.avatarRoot },
    styles: { placeholder: { fontWeight: 500 } },
  }),

  // Hairline row separators, mono-uppercase dimmed header labels, a comfortable
  // (dense-but-airy) row height, and a stronger header separator (module).
  Table: Table.extend({
    defaultProps: {
      highlightOnHover: true,
      highlightOnHoverColor: 'var(--mantine-color-default-hover)',
      verticalSpacing: 'sm',
      horizontalSpacing: 'md',
      withColumnBorders: false,
      striped: false,
    },
    classNames: { table: classes.table },
    styles: {
      table: { '--table-border-color': 'var(--app-border)' } as CSSProperties,
      th: {
        fontFamily: 'var(--mantine-font-family-monospace)',
        fontSize: rem(11),
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--mantine-color-dimmed)',
      },
    },
  }),

  ThemeIcon: ThemeIcon.extend({ defaultProps: { radius: 'md' } }),

  // Crisp, tightly-tracked headings — the reference `letter-spacing: -0.025em`
  // applied uniformly so every Title reads as one typographic system.
  Title: Title.extend({
    styles: { root: { letterSpacing: '-0.025em' } },
  }),

  // Inline + block code: subtle fill, hairline border, small radius, mono.
  Code: Code.extend({
    styles: {
      root: {
        fontFamily: 'var(--mantine-font-family-monospace)',
        background: 'var(--mantine-color-default-hover)',
        border: '1px solid var(--app-border)',
        borderRadius: rem(6),
      },
    },
  }),

  List: List.extend({ defaultProps: { spacing: 'xs' } }),

  // Activity feed: thin hairline line, calm bullets that sit on the surface.
  Timeline: Timeline.extend({
    defaultProps: { bulletSize: 22, lineWidth: 2, color: 'neutral' },
    classNames: { itemBullet: classes.timelineBullet },
    styles: {
      root: { '--tl-color': 'var(--app-border-strong)' } as CSSProperties,
      itemTitle: { fontWeight: 600, fontSize: rem(13) },
    },
  }),

  // Quiet, bordered quote card — no loud colored bar, just the system hairline.
  Blockquote: Blockquote.extend({
    defaultProps: { radius: 'md', color: 'neutral', iconSize: 30 },
    classNames: { root: classes.blockquote },
  }),

  // Reveal control uses the restrained accent link tone.
  Spoiler: Spoiler.extend({
    classNames: { control: classes.spoilerControl },
  }),

  // Media inherits the system radius by default.
  Image: Image.extend({ defaultProps: { radius: 'md' } }),

  // Highlight/Mark: soft, rounded highlight instead of a harsh block of color.
  Mark: Mark.extend({ classNames: { root: classes.mark } }),
};
