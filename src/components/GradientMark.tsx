import type { CSSProperties } from 'react';
import classes from './GradientMark.module.css';

/**
 * GradientMark — the AI identity glyph. A small mesh-gradient circle that
 * reuses the multi-agent avatar technique (src/templates/agentchat/AgentAvatar),
 * in the pink family, lightened and cloudier for a dreamy feel. Presentational.
 * Use this anywhere an "AI" mark is needed (replaces sparkle icons).
 */
export function GradientMark({ size = 18, className }: { size?: number; className?: string }) {
  const style = {
    width: size,
    height: size,
    '--sz': `${size}px`,
    // Reused from the multi-agent pink agent, softened toward white in the CSS.
    '--c0': '#f9a8d4',
    '--c1': '#f5b8e6',
    '--c2': '#e9d5ff',
    '--b0': '30% 26%',
    '--b1': '72% 32%',
    '--b2': '66% 74%',
    '--b3': '28% 72%',
    '--b4': '52% 46%',
  } as CSSProperties;

  return (
    <span className={className ? `${classes.root} ${className}` : classes.root} style={style} aria-hidden>
      <span className={classes.mesh} />
      <span className={classes.specular} />
      <span className={classes.grain} />
    </span>
  );
}
