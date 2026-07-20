import { createElement } from 'react';
import {
  rem,
  Input,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Slider,
  SegmentedControl,
  NumberInput,
  PasswordInput,
  Autocomplete,
  MultiSelect,
  TagsInput,
  PillsInput,
  PinInput,
  JsonInput,
  NativeSelect,
  FileInput,
  Rating,
  ColorInput,
  ColorPicker,
  Fieldset,
} from '@mantine/core';
import classes from './inputs.module.css';

/**
 * GROUP: Inputs & Forms
 * Aesthetic: Attio/Linear — 1px hairline borders, 8px radius, calm monochrome
 * focus ring, comfortable density. Wave 2: CHEWIER — tactile input depth
 * (raised/inset shadow), a strong hairline, consistent heights wired to the
 * shared --app-control-height-* tokens so fields line up with buttons exactly.
 * Pseudo-state styling (hover/focus/checked/motion) lives in ./inputs.module.css.
 */

// Consistent heights — map each named size onto the shared control-height token
// so text fields, selects, etc. match buttons to the pixel (md = 38px).
const NAMED_SIZES = new Set(['xs', 'sm', 'md', 'lg', 'xl']);
const controlHeight = (size: unknown) =>
  `var(--app-control-height-${typeof size === 'string' && NAMED_SIZES.has(size) ? size : 'sm'})`;

// Wire the field height onto the InputBase `wrapper` part (drives padding +
// line-height too). Shared across every Input-based component below. Returns
// `any` so the one resolver satisfies each component's strict CssVariables type.
const heightVars = (_theme: unknown, props: { size?: unknown }): any => ({
  wrapper: { '--input-height': controlHeight(props.size) },
});

// Shared field chrome — text-like inputs (depth/border/focus in the CSS module).
const fieldClassNames = { input: classes.input };

// Label 13px / 500, muted description, small gap. Flat props only (no pseudo).
const fieldStyles = {
  label: {
    fontSize: rem(13),
    fontWeight: 500,
    letterSpacing: '-0.006em',
    marginBottom: rem(6),
  },
  description: { fontSize: rem(12) },
} as const;

// Choice controls (Checkbox/Radio/Switch) share a lighter label treatment.
const choiceLabelStyles = {
  label: { fontSize: rem(14), fontWeight: 500 },
  description: { fontSize: rem(12) },
} as const;

// Combobox dropdowns (Select/Autocomplete/MultiSelect/TagsInput): refined
// surface via the CSS module + a smooth ~150ms pop-in on open.
const dropdownClassNames = { dropdown: classes.dropdown, option: classes.option };
const comboboxProps = { transitionProps: { transition: 'pop', duration: 150 } } as const;

// A chic, thin-stroked check / indeterminate tick. Rendered a touch inset in
// its viewBox so it reads slightly smaller than Mantine's default glyph.
// Built with createElement so this stays a .ts module (no JSX).
type CheckboxIconProps = { indeterminate?: boolean; className?: string };
const CheckboxIcon = ({ indeterminate, ...others }: CheckboxIconProps) =>
  createElement(
    'svg',
    { viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', ...others },
    indeterminate
      ? createElement('path', {
          d: 'M4 8h8',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
        })
      : createElement('path', {
          d: 'M3.6 8.4 6.6 11.4 12.4 4.6',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
  );

export const inputsComponents = {
  Input: Input.extend({
    defaultProps: { radius: 'md' },
    classNames: fieldClassNames,
    vars: heightVars,
  }),
  TextInput: TextInput.extend({
    defaultProps: { radius: 'md' },
    classNames: fieldClassNames,
    styles: fieldStyles,
    vars: heightVars,
  }),
  Textarea: Textarea.extend({
    defaultProps: { radius: 'md', autosize: true, minRows: 3 },
    classNames: fieldClassNames,
    styles: fieldStyles,
    vars: heightVars,
  }),
  Select: Select.extend({
    defaultProps: { radius: 'md', checkIconPosition: 'right', comboboxProps },
    classNames: { ...fieldClassNames, ...dropdownClassNames },
    styles: fieldStyles,
    vars: heightVars,
  }),
  NumberInput: NumberInput.extend({
    defaultProps: { radius: 'md' },
    classNames: fieldClassNames,
    styles: fieldStyles,
    vars: heightVars,
  }),
  PasswordInput: PasswordInput.extend({
    defaultProps: { radius: 'md' },
    classNames: fieldClassNames,
    styles: fieldStyles,
    vars: heightVars,
  }),

  // ── Wave 2: richer text-like inputs (all InputBase, so they inherit the
  // chewy depth + consistent heights automatically) ──────────────────────
  Autocomplete: Autocomplete.extend({
    defaultProps: { radius: 'md', comboboxProps },
    classNames: { ...fieldClassNames, ...dropdownClassNames },
    styles: fieldStyles,
    vars: heightVars,
  }),
  MultiSelect: MultiSelect.extend({
    defaultProps: { radius: 'md', checkIconPosition: 'right', comboboxProps },
    classNames: { ...fieldClassNames, ...dropdownClassNames },
    styles: fieldStyles,
    vars: heightVars,
  }),
  TagsInput: TagsInput.extend({
    defaultProps: { radius: 'md', comboboxProps },
    classNames: { ...fieldClassNames, ...dropdownClassNames },
    styles: fieldStyles,
    vars: heightVars,
  }),
  PillsInput: PillsInput.extend({
    defaultProps: { radius: 'md' },
    classNames: fieldClassNames,
    styles: fieldStyles,
    vars: heightVars,
  }),
  PinInput: PinInput.extend({
    defaultProps: { radius: 'md' },
    classNames: fieldClassNames,
  }),
  JsonInput: JsonInput.extend({
    defaultProps: { radius: 'md', autosize: true, minRows: 4 },
    classNames: fieldClassNames,
    styles: {
      ...fieldStyles,
      input: { fontFamily: 'var(--mantine-font-family-monospace)', fontSize: rem(13) },
    },
    vars: heightVars,
  }),
  NativeSelect: NativeSelect.extend({
    defaultProps: { radius: 'md' },
    classNames: fieldClassNames,
    styles: fieldStyles,
    vars: heightVars,
  }),
  FileInput: FileInput.extend({
    defaultProps: { radius: 'md' },
    classNames: fieldClassNames,
    styles: fieldStyles,
    vars: heightVars,
  }),
  ColorInput: ColorInput.extend({
    defaultProps: { radius: 'md' },
    classNames: fieldClassNames,
    styles: fieldStyles,
    vars: heightVars,
  }),

  ColorPicker: ColorPicker.extend({
    defaultProps: { format: 'hex' },
  }),
  Rating: Rating.extend({
    classNames: { starSymbol: classes.ratingStar },
  }),

  Fieldset: Fieldset.extend({
    defaultProps: { radius: 'md', variant: 'default' },
    classNames: { root: classes.fieldset, legend: classes.fieldsetLegend },
  }),

  // Mantine computes the check icon's contrast without knowing the active
  // color scheme (see actions.ts's variantColorResolver comment for the full
  // story) — it always guesses white. Point it at our own scheme-aware
  // contrast var instead of leaving it to that broken guess.
  Checkbox: Checkbox.extend({
    defaultProps: { radius: 'sm', icon: CheckboxIcon, iconColor: 'var(--mantine-primary-color-contrast)' },
    classNames: {
      input: classes.checkbox,
      icon: classes.checkboxIcon,
      label: classes.checkboxLabel,
    },
    styles: choiceLabelStyles,
  }),
  Radio: Radio.extend({
    classNames: { radio: classes.radio },
    styles: choiceLabelStyles,
  }),
  Switch: Switch.extend({
    defaultProps: { radius: 'xl' },
    classNames: {
      input: classes.switchInput,
      track: classes.switchTrack,
      thumb: classes.switchThumb,
    },
    styles: choiceLabelStyles,
  }),

  Slider: Slider.extend({
    defaultProps: { size: 'sm', radius: 'xl' },
    classNames: {
      thumb: classes.sliderThumb,
      mark: classes.sliderMark,
    },
  }),
  SegmentedControl: SegmentedControl.extend({
    defaultProps: { radius: 'md' },
    classNames: {
      root: classes.segmented,
      indicator: classes.segmentedIndicator,
      label: classes.segmentedLabel,
    },
  }),
};
