import type { CSSProperties } from 'react';
import classes from './GradientMark.module.css';

const DEFAULT_ANCHORS: readonly [string, string, string, string, string] = [
  '30% 26%',
  '72% 32%',
  '66% 74%',
  '28% 72%',
  '52% 46%',
];

/** Tiny deterministic hash so a `seed` reliably nudges the mesh anchors. */
function jitterAnchors(seed: string): [string, string, string, string, string] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  h >>>= 0;
  const rand = () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const base: [number, number][] = [
    [30, 26],
    [72, 32],
    [66, 74],
    [28, 72],
    [52, 46],
  ];
  return base.map(([x, y]) => {
    const jx = Math.round((x + (rand() - 0.5) * 24) * 10) / 10;
    const jy = Math.round((y + (rand() - 0.5) * 24) * 10) / 10;
    return `${jx}% ${jy}%`;
  }) as [string, string, string, string, string];
}

/**
 * GradientMark — the AI identity glyph. A small mesh-gradient circle that
 * reuses the multi-agent avatar technique (src/templates/agentchat/AgentAvatar),
 * lightened and cloudier for a dreamy feel. Presentational.
 * Use this anywhere an "AI" mark is needed (replaces sparkle icons).
 *
 * Defaults to the pink brand family; pass `colors` to tint it for a specific
 * agent/tool identity (e.g. a per-tool orb in a tool-calling pattern), and
 * `seed` to give that identity its own stable, non-identical mesh layout.
 */
export function GradientMark({
  size = 18,
  className,
  colors,
  seed,
}: {
  size?: number;
  className?: string;
  colors?: [string, string, string];
  seed?: string;
}) {
  const [c0, c1, c2] = colors ?? ['#f9a8d4', '#f5b8e6', '#e9d5ff'];
  const [b0, b1, b2, b3, b4] = seed ? jitterAnchors(seed) : DEFAULT_ANCHORS;

  const style = {
    width: size,
    height: size,
    '--sz': `${size}px`,
    '--c0': c0,
    '--c1': c1,
    '--c2': c2,
    '--b0': b0,
    '--b1': b1,
    '--b2': b2,
    '--b3': b3,
    '--b4': b4,
  } as CSSProperties;

  return (
    <span className={className ? `${classes.root} ${className}` : classes.root} style={style} aria-hidden>
      <span className={classes.mesh} />
      <span className={classes.specular} />
      <span className={classes.grain} />
    </span>
  );
}
