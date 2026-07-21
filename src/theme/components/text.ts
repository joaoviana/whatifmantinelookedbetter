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
