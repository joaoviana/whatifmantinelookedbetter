/* CONTRACT: export function StatsDashboard() — a composed block from the themed components.
   A KPI row (stat cards + sparklines + trend deltas) over a compact table. */
import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import classes from './StatsDashboard.module.css';

/* Build a normalized sparkline (line + soft area) inside a 100×30 viewBox.
   preserveAspectRatio="none" stretches it to the card width; strokes stay
   uniform via vectorEffect on the elements below. */
function buildSpark(values: number[]) {
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

type Kpi = {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  spark: number[];
};

const KPIS: Kpi[] = [
  {
    label: 'Recurring revenue',
    value: '$128.4k',
    delta: '12.4%',
    up: true,
    spark: [42, 40, 45, 44, 52, 55, 61, 60, 68, 74, 79, 88],
  },
  {
    label: 'Active users',
    value: '8,942',
    delta: '4.1%',
    up: true,
    spark: [58, 60, 57, 63, 62, 66, 65, 70, 69, 73, 76, 79],
  },
  {
    label: 'Conversion',
    value: '3.8%',
    delta: '0.6pp',
    up: false,
    spark: [70, 68, 71, 66, 64, 65, 60, 58, 59, 54, 52, 49],
  },
  {
    label: 'Churn',
    value: '1.9%',
    delta: '0.4pp',
    up: false,
    spark: [52, 55, 50, 48, 49, 44, 45, 41, 39, 40, 35, 33],
  },
];

type Row = {
  name: string;
  owner: string;
  plan: string;
  seats: number;
  mrr: string;
};

const ROWS: Row[] = [
  { name: 'Northwind Labs', owner: 'maya.chen@northwind.io', plan: 'Enterprise', seats: 148, mrr: '$4,820' },
  { name: 'Atlas Studio', owner: 'leo.almeida@atlasstudio.co', plan: 'Business', seats: 62, mrr: '$2,140' },
  { name: 'Vela Collective', owner: 'aisha.bello@vela.design', plan: 'Business', seats: 41, mrr: '$1,560' },
  { name: 'Kestrel Analytics', owner: 'tomas.novak@kestrel.ai', plan: 'Team', seats: 18, mrr: '$720' },
  { name: 'Ember & Oak', owner: 'priya.nair@emberoak.com', plan: 'Team', seats: 11, mrr: '$430' },
];

function KpiCard({ item }: { item: Kpi }) {
  const { line, area } = buildSpark(item.spark);
  const tone = item.up ? 'teal' : 'red';
  const Arrow = item.up ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={classes.kpi} padding="md">
      <Stack gap="xs" h="100%">
        <span className="eyebrow">{item.label}</span>

        <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
          <Text
            fw={600}
            style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}
          >
            {item.value}
          </Text>
          <Badge
            color={tone}
            variant="light"
            radius="sm"
            leftSection={<Arrow size={12} strokeWidth={2.4} />}
          >
            {item.up ? '+' : '−'}
            {item.delta}
          </Badge>
        </Group>

        <svg
          className={classes.spark}
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${item.label} trend`}
          style={{ color: `var(--mantine-color-${tone}-6)`, marginTop: 'auto' }}
        >
          <path d={area} fill="currentColor" opacity={0.1} />
          <polyline
            points={line}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </Stack>
    </Card>
  );
}

export function StatsDashboard() {
  return (
    <div className={classes.root}>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end">
          <div>
            <span className="eyebrow">Overview</span>
            <Title order={3} mt={4}>
              Dashboard
            </Title>
          </div>
          <Text size="sm" c="dimmed">
            Last 30 days
          </Text>
        </Group>

        <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
          {KPIS.map((item) => (
            <KpiCard key={item.label} item={item} />
          ))}
        </SimpleGrid>

        <Card padding={0}>
          <Group justify="space-between" px="md" py="sm">
            <Text fw={600} size="sm">
              Top workspaces
            </Text>
            <span className="eyebrow">By MRR</span>
          </Group>
          <Table.ScrollContainer minWidth={520}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Workspace</Table.Th>
                  <Table.Th>Plan</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Seats</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>MRR</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {ROWS.map((row) => (
                  <Table.Tr key={row.name}>
                    <Table.Td>
                      <Text className={classes.nameCell} size="sm">
                        {row.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {row.owner}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="neutral" radius="sm">
                        {row.plan}
                      </Badge>
                    </Table.Td>
                    <Table.Td className={classes.numCell}>{row.seats}</Table.Td>
                    <Table.Td className={classes.numCell}>{row.mrr}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Stack>
    </div>
  );
}
