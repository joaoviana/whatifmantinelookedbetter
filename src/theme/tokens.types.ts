/**
 * The app's design tokens, carried on `theme.other` and emitted as `--app-*`
 * custom properties by `cssVariablesResolver`. TS consumers read
 * `theme.other.*`; CSS modules read `var(--app-*)`. One source, two readers.
 */
/** White-mix percentages and bloom alphas for one agent-mesh treatment. */
export interface MeshScalars {
  whiteBase: string;
  whiteA: string;
  whiteB: string;
  whiteC: string;
  bloom1: string;
  bloom2: string;
}

export interface AppTokens {
  ai: {
    palette: { 1: string; 2: string; 3: string; 4: string; 5: string; 6: string };
    orbGradient: string;
    dotGradient: string;
    specular: string;
    /** The same gloss, softened for small marks (~30px avatars) where the
     *  full-strength highlight blows out. Deliberate variance, not drift. */
    specularSoft: string;
    sheen: string;
    glossRing: string;
    /** Scalars for the five-stop agent mesh. `mesh` is the large-mark set;
     *  `meshSoft` is the small-avatar set — less white, lower blooms. */
    mesh: MeshScalars;
    meshSoft: MeshScalars;
    grain: { image: string; opacity: { light: string; dark: string } };
  };
  motion: {
    ease: { out: string; spring: string; inOut: string };
    duration: { instant: number; fast: number; base: number; slow: number };
  };
  radius: { pill: string; nub: string; hairline: string };
  elevation: Record<
    'flat' | 'raised' | 'overlay' | 'modal' | 'orbInkFar' | 'orbInkNear',
    { light: string; dark: string }
  >;
  surface: Record<
    | 'invertedBg'
    | 'invertedText'
    | 'scrim'
    | 'punchoutRing'
    | 'pulseRing'
    | 'activePress'
    | 'onFill'
    | 'focusRingError',
    { light: string; dark: string }
  >;
  type: {
    tracking: { tight: string; snug: string; normal: string; label: string };
    eyebrow: { fontSize: string; letterSpacing: string; textTransform: string };
  };
  space: { rowInset: string };
  state: Record<
    'success' | 'warning' | 'danger' | 'info',
    {
      surface: { light: string; dark: string };
      border: { light: string; dark: string };
      text: { light: string; dark: string };
    }
  >;
  z: Record<'base' | 'sticky' | 'dropdown' | 'overlay' | 'modal' | 'toast', number>;
}

declare module '@mantine/core' {
  export interface MantineThemeOther extends AppTokens {}
}
