import { BarChart, LineChart } from '@mantine/charts';
import type { ChartSpec } from './agents';
import classes from './MessageChart.module.css';

/* A small, themed in-message chart rendered with @mantine/charts.
   Monochrome series (var(--mantine-color-text)) so it reads in light & dark. */

/** Format a value using the spec's unit ('$M' → "$2.61M", '$k' → "$204k", '%' → "72%", '' → "1,360"). */
function formatValue(v: number, unit?: string): string {
  const n = Math.round(v * 100) / 100;
  switch (unit) {
    case '$M':
      return `$${n}M`;
    case '$k':
      return `$${n}k`;
    case '%':
      return `${n}%`;
    default:
      return new Intl.NumberFormat('en-US').format(n);
  }
}

const SERIES_COLOR = 'var(--mantine-color-text)';

export function MessageChart({ spec }: { spec: ChartSpec }) {
  const data = spec.categories.map((c, i) => {
    const row: Record<string, string | number> = { category: c };
    for (const s of spec.series) row[s.name] = s.values[i];
    return row;
  });
  const series = spec.series.map((s) => ({ name: s.name, color: SERIES_COLOR }));
  const valueFormatter = (v: number) => formatValue(v, spec.unit);

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <div className={classes.title}>{spec.title}</div>
        {spec.caption && <div className={`eyebrow ${classes.caption}`}>{spec.caption}</div>}
      </div>
      {spec.type === 'line' ? (
        <LineChart
          h={160}
          data={data}
          dataKey="category"
          series={series}
          curveType="natural"
          withDots
          withLegend={false}
          gridAxis="y"
          tickLine="none"
          valueFormatter={valueFormatter}
          strokeWidth={2}
        />
      ) : (
        <BarChart
          h={160}
          data={data}
          dataKey="category"
          series={series}
          withLegend={false}
          gridAxis="y"
          tickLine="none"
          valueFormatter={valueFormatter}
          barProps={{ radius: 4 }}
        />
      )}
    </div>
  );
}
