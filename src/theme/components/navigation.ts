import {
  Tabs,
  Accordion,
  Pagination,
  Breadcrumbs,
  NavLink,
  Divider,
  Stepper,
  Menu,
  SegmentedControl,
  Tree,
  ScrollArea,
  Burger,
} from '@mantine/core';
import type { CSSProperties } from 'react';
import classes from './navigation.module.css';

/**
 * GROUP: Navigation & Layout
 * Aesthetic: Attio/Linear/Vercel — understated wayfinding: active/raised
 * controls read as solid, tactile chips via --app-shadow-raised +
 * --app-inset-highlight, hairline rails, crisp active indicators.
 * Pseudo-states (:hover / :active / [data-active]) live in the CSS module;
 * flat props here, autoContrast drives active colours in both schemes.
 */
export const navigationComponents = {
  Tabs: Tabs.extend({
    defaultProps: { color: 'neutral' },
    classNames: {
      root: classes.tabsRoot,
      list: classes.tabsList,
      tab: classes.tabsTab,
    },
    // Neutralise Mantine's built-in tab/list borders so the module owns every
    // line — a subtle 1px rail with a crisp 2px active indicator, no washed
    // full-width underline and no wrapping box on the vertical active tab.
    styles: {
      root: { '--tabs-list-border-width': '0', '--tab-border-color': 'transparent' } as CSSProperties,
    },
  }),

  Accordion: Accordion.extend({
    defaultProps: { radius: 'md', variant: 'separated', chevronPosition: 'right' },
    classNames: {
      control: classes.accordionControl,
      chevron: classes.accordionChevron,
    },
    styles: {
      item: { border: '1px solid var(--app-border)', background: 'var(--app-surface)' },
      panel: { color: 'var(--mantine-color-dimmed)' },
      content: { fontSize: 'var(--mantine-font-size-sm)', paddingTop: 4 },
    },
  }),

  Pagination: Pagination.extend({
    defaultProps: { radius: 'md', color: 'neutral' },
    classNames: { control: classes.paginationControl },
  }),

  Breadcrumbs: Breadcrumbs.extend({
    classNames: { root: classes.breadcrumbsRoot },
    styles: { separator: { color: 'var(--app-muted)' } },
  }),

  NavLink: NavLink.extend({
    classNames: { root: classes.navLink },
    styles: { root: { padding: '8px 12px', letterSpacing: '-0.006em' } },
  }),

  Divider: Divider.extend({
    defaultProps: { color: 'var(--app-border)' },
    styles: { label: { color: 'var(--mantine-color-dimmed)', fontWeight: 500 } },
  }),

  Stepper: Stepper.extend({
    defaultProps: { color: 'neutral', radius: 'xl', size: 'sm', iconSize: 30 },
    classNames: {
      step: classes.stepperStep,
      stepIcon: classes.stepperIcon,
      separator: classes.stepperSeparator,
    },
    styles: {
      verticalSeparator: { borderColor: 'var(--app-border)' },
      stepLabel: { fontWeight: 500, letterSpacing: '-0.006em' },
      stepDescription: { color: 'var(--mantine-color-dimmed)' },
    },
  }),

  Menu: Menu.extend({
    defaultProps: {
      radius: 'md',
      shadow: 'md',
      withArrow: false,
      transitionProps: { transition: 'pop', duration: 150 },
    },
    classNames: {
      dropdown: classes.menuDropdown,
      item: classes.menuItem,
    },
    styles: {
      dropdown: { padding: 4 },
      label: {
        fontSize: 11,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--app-muted)',
      },
      divider: { borderColor: 'var(--mantine-color-default-border)' },
    },
  }),

  // Segmented control — the archetypal "chewy" control: a recessed track with
  // a raised active chip (shadow + inset highlight). Styling lives in the CSS
  // module so the [data-active] indicator can carry pseudo depth.
  SegmentedControl: SegmentedControl.extend({
    defaultProps: { radius: 'md', color: 'neutral' },
    classNames: {
      root: classes.segmentRoot,
      indicator: classes.segmentIndicator,
      control: classes.segmentControl,
      label: classes.segmentLabel,
    },
  }),

  // File tree — hairline guides, satisfying row hover + press.
  Tree: Tree.extend({
    classNames: {
      root: classes.treeRoot,
      label: classes.treeLabel,
    },
  }),

  // Compact, quiet scroller — thin monochrome thumb.
  ScrollArea: ScrollArea.extend({
    defaultProps: { scrollbarSize: 8, type: 'hover' },
    classNames: { thumb: classes.scrollThumb },
  }),

  Burger: Burger.extend({
    defaultProps: { size: 'sm' },
    classNames: { root: classes.burger },
  }),
};
