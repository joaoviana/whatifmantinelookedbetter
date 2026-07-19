import type { ReactNode } from 'react';
import {
  Card,
  Paper,
  Badge,
  Avatar,
  Table,
  ThemeIcon,
  Code,
  List,
  Indicator,
  Timeline,
  Blockquote,
  Highlight,
  Mark,
  Spoiler,
  Image,
  AspectRatio,
  BackgroundImage,
  NumberFormatter,
  Title,
  Group,
  Stack,
  Text,
  Divider,
  Anchor,
  Center,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  Zap,
  Mail,
  Building2,
  MapPin,
  CircleCheck,
  ArrowUpRight,
  Users,
  Activity,
  ShieldCheck,
  Star,
  Quote,
  GitCommitHorizontal,
  GitPullRequest,
  GitBranch,
  Rocket,
  MessageCircleMore,
  Bell,
  Image as ImageIcon,
} from 'lucide-react';
import { Specimen, SpecimenGrid, Row } from '../parts';

export const meta = {
  id: 'data-display',
  label: 'Data Display',
  description: 'Cards, tables, badges, timelines, media and typography — how information is presented.',
};

/** A member row reused across the table + directory demos. */
const members = [
  { name: 'Maya Chen', email: 'maya@northwind.io', role: 'Owner', color: 'neutral', status: 'active' },
  { name: 'Leo Almeida', email: 'leo@northwind.io', role: 'Admin', color: 'grape', status: 'active' },
  { name: 'Ada Lovelace', email: 'ada@analytic.co', role: 'Editor', color: 'teal', status: 'pending' },
  { name: 'Grace Hopper', email: 'grace@navy.mil', role: 'Viewer', color: 'indigo', status: 'invited' },
] as const;

const statusBadge: Record<string, ReactNode> = {
  active: <Badge size="sm" color="teal" leftSection={<CircleCheck size={12} />}>Active</Badge>,
  pending: <Badge size="sm" color="yellow" variant="light">Pending</Badge>,
  invited: <Badge size="sm" variant="default">Invited</Badge>,
};

export function Section() {
  // Wide specimens span 2 columns on desktop; on a phone the grid is a single
  // column, so drop them to full width to avoid an implicit second track (page overflow).
  const wide = useMediaQuery('(min-width: 53em)', true, { getInitialValueInEffect: false });
  return (
    <SpecimenGrid>
      {/* ── Contact card — the Attio-spirit composition ─────────────── */}
      <Specimen name="Card" hint="contact" span={wide ? 2 : 1} minH={260}>
        <Card w="100%">
          <Card.Section inheritPadding py="md">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <Indicator inline size={10} offset={5} color="teal" withBorder position="bottom-end">
                  <Avatar name="Maya Chen" color="neutral" size="md" radius="xl" />
                </Indicator>
                <Stack gap={0}>
                  <Text fw={600} fz="sm" lh={1.2}>Maya Chen</Text>
                  <Text c="dimmed" fz="xs">Founder · Northwind</Text>
                </Stack>
              </Group>
              <Badge color="teal" leftSection={<CircleCheck size={12} />}>Active</Badge>
            </Group>
          </Card.Section>

          <Divider color="var(--mantine-color-default-border)" />

          <Card.Section inheritPadding py="md">
            <List spacing={8} center fz="sm" c="dimmed">
              <List.Item icon={<ThemeIcon size="sm" variant="default" radius="sm"><Mail size={13} /></ThemeIcon>}>
                maya@northwind.io
              </List.Item>
              <List.Item icon={<ThemeIcon size="sm" variant="default" radius="sm"><Building2 size={13} /></ThemeIcon>}>
                Northwind · Analytics
              </List.Item>
              <List.Item icon={<ThemeIcon size="sm" variant="default" radius="sm"><MapPin size={13} /></ThemeIcon>}>
                Lisbon, Portugal
              </List.Item>
            </List>
          </Card.Section>

          <Divider color="var(--mantine-color-default-border)" />

          <Card.Section inheritPadding py="sm">
            <Group justify="space-between">
              <Group gap="lg">
                <Text fz="xs" c="dimmed"><Text span fw={600} c="var(--mantine-color-text)">128</Text> deals</Text>
                <Text fz="xs" c="dimmed"><Text span fw={600} c="var(--mantine-color-text)">£2.4M</Text> pipeline</Text>
              </Group>
              <Anchor fz="xs" fw={500}>
                <Group gap={3}>Open<ArrowUpRight size={13} /></Group>
              </Anchor>
            </Group>
          </Card.Section>
        </Card>
      </Specimen>

      {/* ── Member table ────────────────────────────────────────────── */}
      <Specimen name="Table" hint="hairline · hover" span={wide ? 2 : 1} minH={260}>
        <Table.ScrollContainer minWidth={360} w="100%">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Member</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {members.map((m) => (
              <Table.Tr key={m.email}>
                <Table.Td>
                  <Group gap="sm" wrap="nowrap">
                    <Avatar name={m.name} color={m.color} size={28} radius="xl" />
                    <Stack gap={0}>
                      <Text fz="sm" fw={500} lh={1.2}>{m.name}</Text>
                      <Text c="dimmed" fz="xs">{m.email}</Text>
                    </Stack>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge size="sm" variant={m.role === 'Owner' ? 'filled' : 'default'}>{m.role}</Badge>
                </Table.Td>
                <Table.Td>{statusBadge[m.status]}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        </Table.ScrollContainer>
      </Specimen>

      {/* ── Activity feed ───────────────────────────────────────────── */}
      <Specimen name="Timeline" hint="activity feed" span={wide ? 2 : 1} minH={260}>
        <Timeline active={2} w="100%">
          <Timeline.Item bullet={<GitBranch size={12} />} title="Branch created">
            <Text c="dimmed" fz="xs">Ada opened <Code>feat/chewy-cards</Code></Text>
            <Text c="dimmed" fz="xs" mt={2}>2 days ago</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<GitCommitHorizontal size={12} />} title="14 commits pushed">
            <Text c="dimmed" fz="xs">Layered shadows + hover lift wired up</Text>
            <Text c="dimmed" fz="xs" mt={2}>yesterday</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<GitPullRequest size={12} />} title="Pull request opened">
            <Text c="dimmed" fz="xs">Review requested from <Text span fw={500} c="var(--mantine-color-text)">Leo</Text></Text>
            <Text c="dimmed" fz="xs" mt={2}>3 hours ago</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<Rocket size={12} />} title="Deploy queued" lineVariant="dashed">
            <Text c="dimmed" fz="xs">Waiting on CI checks</Text>
          </Timeline.Item>
        </Timeline>
      </Specimen>

      {/* ── Badges ──────────────────────────────────────────────────── */}
      <Specimen name="Badge" hint="variants · filled highlight" span={wide ? 2 : 1} minH={120}>
        <Stack gap="sm" w="100%">
          <Row>
            <Badge>Default</Badge>
            <Badge variant="filled">Filled</Badge>
            <Badge variant="default">Neutral</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="dot">Live</Badge>
          </Row>
          <Row>
            <Badge color="teal">Active</Badge>
            <Badge color="yellow">Pending</Badge>
            <Badge color="red">Overdue</Badge>
            <Badge color="indigo">Beta</Badge>
            <Badge size="lg" leftSection={<Star size={12} />}>Featured</Badge>
          </Row>
        </Stack>
      </Specimen>

      {/* ── Blockquote ──────────────────────────────────────────────── */}
      <Specimen name="Blockquote" hint="cited" span={wide ? 2 : 1} minH={120}>
        <Blockquote
          w="100%"
          icon={<Quote size={20} />}
          cite="— Dieter Rams, Ten Principles"
        >
          <Text fz="sm">Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects.</Text>
        </Blockquote>
      </Specimen>

      {/* ── Avatars ─────────────────────────────────────────────────── */}
      <Specimen name="Avatar" hint="group · ring" minH={120}>
        <Stack align="center" gap="md">
          <Avatar.Group>
            <Avatar name="Maya Chen" color="neutral" />
            <Avatar name="Leo Almeida" color="grape" />
            <Avatar name="Ada Lovelace" color="teal" />
            <Avatar>+4</Avatar>
          </Avatar.Group>
          <Row>
            <Avatar name="A B" size="sm" color="indigo" />
            <Avatar name="C D" size="md" color="teal" />
            <Avatar src="https://i.pravatar.cc/80?img=5" size="md" />
          </Row>
        </Stack>
      </Specimen>

      {/* ── Indicator variants ──────────────────────────────────────── */}
      <Specimen name="Indicator" hint="dot · count · pulse" minH={120}>
        <Row>
          <Indicator color="teal" size={10} offset={5} withBorder>
            <Avatar name="J V" color="neutral" radius="xl" />
          </Indicator>
          <Indicator label="4" size={16} color="red" offset={4}>
            <ThemeIcon variant="default" size="lg"><Bell size={18} /></ThemeIcon>
          </Indicator>
          <Indicator processing color="indigo" size={10} offset={5}>
            <ThemeIcon variant="light" size="lg"><Activity size={18} /></ThemeIcon>
          </Indicator>
          <Indicator disabled>
            <Avatar name="A D" color="grape" radius="xl" />
          </Indicator>
        </Row>
      </Specimen>

      {/* ── ThemeIcon ───────────────────────────────────────────────── */}
      <Specimen name="ThemeIcon" hint="variants" minH={120}>
        <Stack align="center" gap="md">
          <Row>
            <ThemeIcon variant="light"><Zap size={18} /></ThemeIcon>
            <ThemeIcon variant="default"><Users size={18} /></ThemeIcon>
            <ThemeIcon variant="filled"><Activity size={18} /></ThemeIcon>
            <ThemeIcon variant="light" color="teal"><ShieldCheck size={18} /></ThemeIcon>
          </Row>
          <Row>
            <ThemeIcon size="sm" variant="light"><Zap size={13} /></ThemeIcon>
            <ThemeIcon size="md" variant="light"><Zap size={16} /></ThemeIcon>
            <ThemeIcon size="lg" variant="light"><Zap size={20} /></ThemeIcon>
            <ThemeIcon size="xl" variant="light"><Zap size={24} /></ThemeIcon>
          </Row>
        </Stack>
      </Specimen>

      {/* ── Typography scale ────────────────────────────────────────── */}
      <Specimen name="Typography" hint="titles · text" span={wide ? 2 : 1} minH={260}>
        <Stack gap="md" w="100%">
          <Stack gap={4}>
            <Title order={1}>Refined by default</Title>
            <Title order={2}>A monochrome system</Title>
            <Title order={3}>Hairline borders, quiet depth</Title>
            <Title order={4}>Crisp, tactile typography</Title>
          </Stack>
          <Divider color="var(--mantine-color-default-border)" />
          <Group gap="lg" align="baseline" wrap="wrap">
            <Text fz="xl">Extra large</Text>
            <Text fz="lg">Large</Text>
            <Text fz="md">Medium</Text>
            <Text fz="sm">Small</Text>
            <Text fz="xs">Extra small</Text>
          </Group>
          <Group gap="lg" wrap="wrap">
            <Text fw={700}>Bold</Text>
            <Text fw={600}>Semibold</Text>
            <Text fw={500}>Medium</Text>
            <Text fw={400}>Regular</Text>
            <Text c="dimmed">Dimmed</Text>
          </Group>
        </Stack>
      </Specimen>

      {/* ── Highlight & Mark ────────────────────────────────────────── */}
      <Specimen name="Highlight · Mark" hint="emphasis" span={wide ? 2 : 1} minH={120}>
        <Stack gap="sm" w="100%">
          <Highlight fz="sm" highlight={['refined monochrome', 'tactile']}>
            A refined monochrome palette with tactile, layered depth — Attio meets Linear.
          </Highlight>
          <Text fz="sm">
            Built on <Mark>hairline borders</Mark> and <Mark color="teal">quiet shadows</Mark> that lift on hover.
          </Text>
        </Stack>
      </Specimen>

      {/* ── Spoiler ─────────────────────────────────────────────────── */}
      <Specimen name="Spoiler" hint="expand" minH={120}>
        <Spoiler maxHeight={44} showLabel="Show more" hideLabel="Show less" w="100%">
          <Text fz="sm" c="dimmed">
            The design language leans on restraint: a single accent reserved for links and focus,
            near-black filled controls, and shadows that stay quiet until you interact. Everything
            else is left to breathe on a hairline grid.
          </Text>
        </Spoiler>
      </Specimen>

      {/* ── NumberFormatter ─────────────────────────────────────────── */}
      <Specimen name="NumberFormatter" hint="currency · number" minH={120}>
        <Stack gap="xs" align="center">
          <Text fz={28} fw={600} lts="-0.02em">
            <NumberFormatter prefix="£" value={2412500} thousandSeparator />
          </Text>
          <Group gap="lg">
            <Text fz="sm" c="dimmed">
              <NumberFormatter value={1284567} thousandSeparator /> rows
            </Text>
            <Text fz="sm" c="dimmed">
              <NumberFormatter value={98.6} decimalScale={1} suffix="%" /> uptime
            </Text>
          </Group>
        </Stack>
      </Specimen>

      {/* ── Image + AspectRatio ─────────────────────────────────────── */}
      <Specimen name="Image · AspectRatio" hint="16 : 9 · radius" minH={160}>
        <AspectRatio ratio={16 / 9} w="100%">
          <Image
            radius="md"
            src="https://picsum.photos/seed/mantine-lab/640/360"
            alt="Placeholder scenery"
          />
        </AspectRatio>
      </Specimen>

      {/* ── BackgroundImage ─────────────────────────────────────────── */}
      <Specimen name="BackgroundImage" hint="overlay label" minH={160}>
        <BackgroundImage
          src="https://picsum.photos/seed/attio-bg/640/360"
          radius="md"
          w="100%"
          h={132}
        >
          <Center h="100%">
            <Badge variant="filled" leftSection={<ImageIcon size={12} />}>Cover</Badge>
          </Center>
        </BackgroundImage>
      </Specimen>

      {/* ── Code ────────────────────────────────────────────────────── */}
      <Specimen name="Code" hint="inline · block" span={wide ? 2 : 1} minH={120}>
        <Stack gap="sm" w="100%">
          <Text fz="sm">
            Install with <Code>pnpm add @mantine/core</Code> then import the theme.
          </Text>
          <Code block>{`import { theme } from './theme';\n\n<MantineProvider theme={theme}>\n  <App />\n</MantineProvider>`}</Code>
        </Stack>
      </Specimen>

      {/* ── List ────────────────────────────────────────────────────── */}
      <Specimen name="List" hint="with icons" minH={120}>
        <List
          spacing="xs"
          fz="sm"
          center
          icon={<ThemeIcon size="sm" radius="xl" color="teal" variant="light"><CircleCheck size={13} /></ThemeIcon>}
        >
          <List.Item>Hairline borders</List.Item>
          <List.Item>Quiet shadows</List.Item>
          <List.Item>Crisp typography</List.Item>
        </List>
      </Specimen>

      {/* ── Paper ───────────────────────────────────────────────────── */}
      <Specimen name="Paper" hint="hover lift" minH={120}>
        <Paper p="lg" w="100%">
          <Stack gap={4}>
            <Group gap={6}>
              <ThemeIcon size="sm" variant="default" radius="sm"><MessageCircleMore size={13} /></ThemeIcon>
              <Text className="eyebrow">Surface</Text>
            </Group>
            <Text fz="sm" c="dimmed">
              A bordered Paper — the base panel every card is built on. Hover to feel it lift.
            </Text>
          </Stack>
        </Paper>
      </Specimen>
    </SpecimenGrid>
  );
}
