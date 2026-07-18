import type { CSSProperties } from 'react';
import type { Agent } from './agents';
import classes from './AgentAvatar.module.css';

/* CONTRACT: export function AgentAvatar({ agent, size }) — the BEAUTIFUL gradient avatar.
   A per-agent MESH gradient (overlapping radial blobs + white blooms) is woven from
   agent.gradient, lit by a specular highlight, dusted with fine printed grain, and
   framed by a hairline theme ring. Gradients are the ONLY color; the rest is tokens. */

/** Tiny deterministic PRNG so each agent gets a unique-but-stable mesh layout. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/** Base blob anchors (percent). Each is jittered per-agent for organic variety. */
const ANCHORS: ReadonlyArray<readonly [number, number]> = [
  [26, 24], // c0
  [74, 72], // c2
  [70, 26], // c0 accent
  [30, 70], // white bloom
  [56, 46], // white bloom (small)
];

export function AgentAvatar({ agent, size = 32 }: { agent: Agent; size?: number }) {
  const rand = mulberry32(hashId(agent.id));
  const [c0, c1 = agent.gradient[0], c2 = c1] = agent.gradient;

  // Jitter each anchor by ±11% → a mesh that flows differently per agent.
  const blobVars: Record<string, string> = {};
  ANCHORS.forEach(([x, y], i) => {
    const jx = Math.round((x + (rand() - 0.5) * 22) * 10) / 10;
    const jy = Math.round((y + (rand() - 0.5) * 22) * 10) / 10;
    blobVars[`--b${i}`] = `${jx}% ${jy}%`;
  });

  const style = {
    width: size,
    height: size,
    '--sz': `${size}px`,
    '--c0': c0,
    '--c1': c1,
    '--c2': c2,
    ...blobVars,
  } as CSSProperties;

  return (
    <div className={classes.root} style={style} role="img" aria-label={agent.name}>
      <div className={classes.mesh} />
      <div className={classes.specular} />
      <div className={classes.grain} />
    </div>
  );
}
