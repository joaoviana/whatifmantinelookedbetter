/* CONTRACT: export TARGETS, buildSpark — static content for the Ask anything
   specimen. The KPI numbers deliberately match StatsDashboard so the gallery
   tells one consistent story. */

export type Target = {
  id: string;
  label: string;
  /** Short scope shown in the composer chip, e.g. 'Revenue · Q3'. */
  scope: string;
  value: string;
  delta: string;
  up: boolean;
  spark: number[];
  /** Canned answer streamed when this target is asked about alone. */
  answer: string;
};

export const TARGETS: Target[] = [
  {
    id: 'revenue',
    label: 'Recurring revenue',
    scope: 'Revenue · Q3',
    value: '$128.4k',
    delta: '12.4%',
    up: true,
    spark: [42, 40, 45, 44, 52, 55, 61, 60, 68, 74, 79, 88],
    answer:
      'Up 12.4%, and almost all of it expansion rather than new logos — EMEA seats ' +
      'grew 19% while the account count barely moved.',
  },
  {
    id: 'users',
    label: 'Active users',
    scope: 'Active users · 30d',
    value: '8,942',
    delta: '4.1%',
    up: true,
    spark: [58, 60, 57, 63, 62, 66, 65, 70, 69, 73, 76, 79],
    answer:
      'Climbed 4.1%, led by the refreshed onboarding — day-7 activation is up about ' +
      'nine points on the cohorts that saw it.',
  },
  {
    id: 'conversion',
    label: 'Conversion',
    scope: 'Conversion · 30d',
    value: '3.8%',
    delta: '0.6pp',
    up: false,
    spark: [70, 68, 71, 66, 64, 65, 60, 58, 59, 54, 52, 49],
    answer:
      "Slipped 0.6pp, all of it enterprise trials after Tuesday's release. Self-serve " +
      'held steady, so this is the invite flow rather than demand.',
  },
  {
    id: 'trend',
    label: 'Signups',
    scope: 'Signups · 12 weeks',
    value: '2,410',
    delta: '8.2%',
    up: true,
    spark: [30, 34, 33, 39, 44, 42, 51, 55, 54, 62, 68, 74],
    answer:
      'Twelve weeks of steady compounding with no single spike, and paid share ' +
      'actually fell — the channel mix is carrying this, not one campaign.',
  },
];

/** Normalized sparkline (line + soft area) inside a 100×30 viewBox.
    preserveAspectRatio="none" stretches it to the tile width; strokes stay
    uniform via vectorEffect on the rendered elements. */
export function buildSpark(values: number[]) {
  const w = 100;
  const h = 30;
  const pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = pad + (h - pad * 2) * (1 - (v - min) / range);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const area = `${pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ')} L${w},${h} L0,${h} Z`;
  return { line, area };
}
