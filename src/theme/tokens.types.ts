/**
 * The app's design tokens, carried on `theme.other` and emitted as `--app-*`
 * custom properties by `cssVariablesResolver`. TS consumers read
 * `theme.other.*`; CSS modules read `var(--app-*)`. One source, two readers.
 */
export interface AppTokens {
  motion: {
    ease: { out: string; spring: string; inOut: string };
    duration: { instant: number; fast: number; base: number; slow: number };
  };
  radius: { pill: string; nub: string; hairline: string };
  elevation: { flat: string; raised: string; overlay: string; modal: string };
  surface: {
    invertedBg: string;
    invertedText: string;
    scrim: string;
    punchoutRing: string;
    pulseRing: string;
    activePress: string;
    onFill: string;
    focusRingError: string;
  };
}

declare module '@mantine/core' {
  export interface MantineThemeOther extends AppTokens {}
}
