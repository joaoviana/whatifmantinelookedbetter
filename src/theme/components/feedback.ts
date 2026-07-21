import {
  Alert,
  Tooltip,
  Progress,
  RingProgress,
  Loader,
  Notification,
  Modal,
  Popover,
  Skeleton,
  Drawer,
  HoverCard,
  LoadingOverlay,
  Overlay,
  Dialog,
} from '@mantine/core';
import classes from './feedback.module.css';
import { baseTheme } from '../tokens';

/**
 * GROUP: Feedback & Overlays
 * Aesthetic: Attio/Linear/Vercel — soft dark tooltips, hairline-bordered
 * overlays that float on REAL layered depth, quiet monochrome progress,
 * small radii, tasteful ~160ms motion. Overlays feel substantial and lifted;
 * alerts carry a whisper of depth but never shout.
 */

// Shared refined easing — everything opens/closes on the same calm curve.
const EASE = baseTheme.other.motion.ease.out;
const softFade = { transition: 'fade-down', duration: 160, timingFunction: EASE } as const;
const popIn = { transition: 'pop', duration: 170, timingFunction: EASE } as const;
const fade = { transition: 'fade', duration: 150, timingFunction: EASE } as const;

// Backdrop shared by Modal & Drawer — low-opacity wash + a slight blur so the
// page recedes without going dark. Feels like frosted glass, not a curtain.
const backdrop = { backgroundOpacity: 0.35, blur: 3 } as const;

export const feedbackComponents = {
  // Faint semantic wash (mixed ~9% into the body), hairline border, colored
  // icon + title kept — the fill is calmed right down. Bg lives in the CSS
  // module so it can color-mix off the runtime --alert-color.
  Alert: Alert.extend({
    defaultProps: { radius: 'md', variant: 'light' },
    classNames: { root: classes.alertRoot },
    styles: {
      root: { paddingBlock: 'var(--mantine-spacing-sm)' },
      title: { fontWeight: 600, fontSize: 'var(--mantine-font-size-sm)', letterSpacing: '-0.006em' },
      message: { fontSize: 'var(--mantine-font-size-sm)', color: 'var(--mantine-color-dimmed)' },
      icon: { marginTop: 1 },
    },
  }),

  // Dark solid in light mode, near-white text; inverted in dark. Small arrow.
  Tooltip: Tooltip.extend({
    defaultProps: { radius: 'sm', withArrow: true, arrowSize: 5, openDelay: 120, transitionProps: softFade },
    classNames: { tooltip: classes.tooltip },
    styles: {
      tooltip: {
        background: 'light-dark(var(--mantine-color-neutral-9), var(--mantine-color-neutral-0))',
        color: 'light-dark(var(--mantine-color-neutral-0), var(--mantine-color-neutral-9))',
        fontSize: 'var(--mantine-font-size-xs)',
        fontWeight: 500,
        letterSpacing: '-0.006em',
        paddingBlock: 3,
        paddingInline: 8,
        boxShadow: 'var(--mantine-shadow-md)',
      },
    },
  }),

  // Thin track, monochrome fill, rounded caps, quiet.
  Progress: Progress.extend({
    defaultProps: { radius: 'xl', size: 'sm', color: 'neutral' },
    styles: {
      root: { background: 'light-dark(var(--mantine-color-neutral-2), var(--mantine-color-dark-4))' },
    },
  }),

  RingProgress: RingProgress.extend({
    defaultProps: { roundCaps: true, thickness: 8 },
  }),

  // Monochrome, refined default type. Mantine's oval ring hardcodes its
  // stroke to size/8 with no exposed var — a touch thick for our taste, so
  // we thin it to size/12 via a classNames override.
  Loader: Loader.extend({
    defaultProps: { type: 'oval', color: 'neutral', size: 'sm' },
    classNames: { root: classes.loader },
  }),

  // Hairline border, radius 8, gentle depth, crisp title/description hierarchy.
  Notification: Notification.extend({
    defaultProps: { radius: 'md', withBorder: true, color: 'neutral' },
    classNames: { root: classes.notification },
    styles: {
      root: { boxShadow: 'var(--mantine-shadow-sm)', background: 'var(--app-surface)', paddingBlock: 'var(--mantine-spacing-sm)' },
      title: { fontWeight: 600, fontSize: 'var(--mantine-font-size-sm)', letterSpacing: '-0.006em' },
      description: { fontSize: 'var(--mantine-font-size-xs)', color: 'var(--mantine-color-dimmed)' },
    },
  }),

  // Radius 12, centered. Strong hairline + REAL layered shadow (shadow-lg) so
  // it floats above a frosted backdrop. Hairline header divider.
  Modal: Modal.extend({
    defaultProps: {
      radius: 'lg',
      centered: true,
      overlayProps: backdrop,
      transitionProps: fade,
    },
    classNames: { content: classes.modalContent, header: classes.overlayHeader, overlay: classes.backdrop },
    styles: {
      content: { border: '1px solid var(--app-border-strong)', boxShadow: 'var(--mantine-shadow-lg)' },
      header: { paddingBlock: 'var(--mantine-spacing-md)' },
      title: { fontWeight: 600, fontSize: 'var(--mantine-font-size-md)', letterSpacing: '-0.01em' },
      body: { paddingBlock: 'var(--mantine-spacing-md)' },
    },
  }),

  // Slide-in panel. Same substantial treatment as Modal — strong hairline +
  // shadow-lg + frosted backdrop — so it reads as a real layer, not a flap.
  Drawer: Drawer.extend({
    defaultProps: {
      overlayProps: backdrop,
      transitionProps: { duration: 180, timingFunction: EASE },
    },
    classNames: { content: classes.drawerContent, header: classes.overlayHeader, overlay: classes.backdrop },
    styles: {
      content: { boxShadow: 'var(--mantine-shadow-lg)' },
      header: { paddingBlock: 'var(--mantine-spacing-md)', borderBottom: '1px solid var(--app-border)' },
      title: { fontWeight: 600, fontSize: 'var(--mantine-font-size-md)', letterSpacing: '-0.01em' },
      body: { paddingBlock: 'var(--mantine-spacing-md)' },
    },
  }),

  // No arrow. Beautiful floating card — body bg, hairline default-border,
  // radius md, generous padding, layered shadow-md, smooth pop.
  Popover: Popover.extend({
    defaultProps: {
      radius: 'md',
      shadow: 'md',
      withArrow: false,
      transitionProps: popIn,
    },
    classNames: { dropdown: classes.popoverDropdown },
    styles: {
      dropdown: {
        border: '1px solid var(--mantine-color-default-border)',
        background: 'var(--mantine-color-body)',
        boxShadow: 'var(--mantine-shadow-md)',
        padding: 'var(--mantine-spacing-md)',
      },
    },
  }),

  // Preview-on-hover card — same arrowless floating treatment as Popover.
  HoverCard: HoverCard.extend({
    defaultProps: {
      radius: 'md',
      shadow: 'md',
      withArrow: false,
      openDelay: 160,
      closeDelay: 120,
      transitionProps: popIn,
    },
    classNames: { dropdown: classes.popoverDropdown },
    styles: {
      dropdown: {
        border: '1px solid var(--mantine-color-default-border)',
        background: 'var(--mantine-color-body)',
        boxShadow: 'var(--mantine-shadow-md)',
        padding: 'var(--mantine-spacing-md)',
      },
    },
  }),

  // Frosted, low-opacity wash matching the overlay backdrop language.
  LoadingOverlay: LoadingOverlay.extend({
    defaultProps: {
      overlayProps: { blur: 2, backgroundOpacity: 0.55, radius: 'lg' },
      loaderProps: { type: 'oval', color: 'neutral', size: 'sm' },
      transitionProps: { duration: 160 },
    },
  }),

  // The raw scrim primitive — frosted, restrained.
  Overlay: Overlay.extend({
    defaultProps: { backgroundOpacity: 0.4, blur: 2 },
  }),

  // Corner toast-style dialog — hairline + real depth so it lifts off the page.
  Dialog: Dialog.extend({
    defaultProps: {
      radius: 'lg',
      withBorder: true,
      shadow: 'lg',
      transitionProps: popIn,
    },
    classNames: { root: classes.dialogRoot },
    styles: {
      root: { border: '1px solid var(--app-border-strong)', background: 'var(--app-surface)' },
    },
  }),

  Skeleton: Skeleton.extend({
    defaultProps: { radius: 'md' },
  }),
};
