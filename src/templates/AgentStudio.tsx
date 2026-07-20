import { useState } from 'react';
import {
  Accordion,
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Code,
  Divider,
  Group,
  Kbd,
  Loader,
  Menu,
  NumberInput,
  Paper,
  ScrollArea,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  SlidersHorizontal,
  Brain,
  ChartBar,
  ChevronDown,
  Circle,
  Code as CodeIcon,
  Ellipsis,
  FileText,
  PanelLeft,
  PanelRight,
  LogOut,
  Lightbulb,
  Pencil,
  Image as ImageIcon,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Command,
  CircleUser,
  Globe,
  Upload,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { AiComposer } from '../components/AiComposer';
import { SiteNav } from '../components/SiteNav';
import classes from './AgentStudio.module.css';

/* ─────────────────────────────────────────────────────────────
 *  Believable data
 * ───────────────────────────────────────────────────────────── */

const MODELS = [
  { value: 'opus-4.8', label: 'Claude Opus 4.8' },
  { value: 'sonnet-4.5', label: 'Claude Sonnet 4.5' },
  { value: 'haiku-4.5', label: 'Claude Haiku 4.5' },
];

const CONVERSATIONS: { group: string; items: { title: string; when: string }[] }[] = [
  {
    group: 'Today',
    items: [
      { title: 'Collapsible AppShell aside in Mantine 9', when: '2m' },
      { title: 'Refactor billing webhook handler', when: '1h' },
      { title: 'Q3 revenue breakdown by region', when: '3h' },
    ],
  },
  {
    group: 'Yesterday',
    items: [
      { title: 'Draft launch email for v2 API', when: 'Wed' },
      { title: 'Postgres index tuning strategy', when: 'Wed' },
    ],
  },
  {
    group: 'Previous 7 days',
    items: [
      { title: 'Onboarding flow copy review', when: 'Mon' },
      { title: 'Kubernetes cost optimization', when: 'Sun' },
      { title: 'Compare vector DB options', when: 'Sat' },
    ],
  },
];

const SUGGESTIONS = [
  { icon: Pencil, label: 'Draft' },
  { icon: CodeIcon, label: 'Code' },
  { icon: ChartBar, label: 'Analyze' },
  { icon: FileText, label: 'Summarize' },
  { icon: Lightbulb, label: 'Brainstorm' },
];

const TOOLS = [
  { key: 'web', icon: Globe, label: 'Web search', desc: 'Browse and cite live sources', on: true },
  { key: 'code', icon: CodeIcon, label: 'Code interpreter', desc: 'Run Python in a sandbox', on: true },
  { key: 'files', icon: FileText, label: 'File search', desc: 'Retrieve from uploaded docs', on: false },
  { key: 'memory', icon: Brain, label: 'Memory', desc: 'Recall facts across chats', on: true },
  { key: 'image', icon: ImageIcon, label: 'Image generation', desc: 'Create and edit visuals', on: false },
];

const CODE_SAMPLE = `<AppShell
  header={{ height: 56 }}
  navbar={{ width: 280, breakpoint: 'sm' }}
  aside={{
    width: 320,
    breakpoint: 'md',
    collapsed: { desktop: !panelOpen },
  }}
>
  <AppShell.Aside p="md">{/* config */}</AppShell.Aside>
</AppShell>`;

/* ─────────────────────────────────────────────────────────────
 *  Small building blocks
 * ───────────────────────────────────────────────────────────── */

function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <ThemeIcon size={size} radius="md" variant="filled" color="neutral" className={classes.brandMark}>
      <Command size={Math.round(size * 0.55)} />
    </ThemeIcon>
  );
}

function MessageRow({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <Group align="flex-start" gap="md" wrap="nowrap">
      {isUser ? (
        <Avatar size={30} radius="md" color="neutral" variant="filled" className={classes.msgAvatar}>
          MC
        </Avatar>
      ) : (
        <ThemeIcon size={30} radius="md" variant="default" className={classes.msgAvatar}>
          <Command size={16} />
        </ThemeIcon>
      )}
      <Box style={{ flex: 1, minWidth: 0, paddingTop: 3 }}>
        <Text fz={12} fw={600} mb={6} c={isUser ? undefined : 'dimmed'}>
          {isUser ? 'You' : 'Claude Opus 4.8'}
        </Text>
        {children}
      </Box>
    </Group>
  );
}

function ToolChip({ icon, label, meta }: { icon: React.ReactNode; label: string; meta: string }) {
  return (
    <Group className={classes.toolChip} gap={8} wrap="nowrap" w="fit-content" mb="sm">
      <ThemeIcon size={18} radius="sm" variant="light" color="neutral">
        {icon}
      </ThemeIcon>
      <Text fz={12.5} fw={500}>
        {label}
      </Text>
      <Text fz={11} c="dimmed" ff="var(--mantine-font-family-monospace)">
        {meta}
      </Text>
    </Group>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  Left navbar
 * ───────────────────────────────────────────────────────────── */

function Navbar({ onNavigate }: { onNavigate?: () => void }) {
  const [active, setActive] = useState('Collapsible AppShell aside in Mantine 9');
  const [search, setSearch] = useState('');

  return (
    <Stack h="100%" gap={0}>
      {/* Site-level nav lives in the header on desktop; below `sm` it rides
          along in this same mobile drawer, above the page's own nav. */}
      <Box hiddenFrom="sm" p="md" pb={0}>
        <Stack gap={2}>
          <SiteNav variant="list" onNavigate={onNavigate} />
        </Stack>
        <Divider mt="md" />
      </Box>

      {/* Brand + workspace */}
      <Box p="md" pb="xs">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <BrandMark />
            <Box>
              <Text fz={14} fw={600} lh={1.1}>
                Agent Studio
              </Text>
              <Text fz={11} c="dimmed" lh={1.2}>
                Playground
              </Text>
            </Box>
          </Group>
          <Badge size="xs" variant="default" radius="sm" tt="none" fw={500}>
            Pro
          </Badge>
        </Group>

        <Button
          fullWidth
          justify="flex-start"
          variant="filled"
          color="neutral"
          radius="md"
          leftSection={<Plus size={16} />}
          styles={{ root: { boxShadow: 'var(--app-shadow-raised), var(--app-inset-highlight)' } }}
        >
          New chat
        </Button>

        <TextInput
          mt="sm"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Search conversations"
          leftSection={<Search size={15} />}
          rightSection={
            <Kbd size="xs" style={{ marginRight: 6 }}>
              /
            </Kbd>
          }
          radius="md"
          styles={{ input: { background: 'var(--app-surface)' } }}
        />
      </Box>

      {/* History */}
      <ScrollArea type="hover" style={{ flex: 1 }} px="md">
        <Stack gap="lg" pb="md">
          {CONVERSATIONS.map((section) => (
            <Box key={section.group}>
              <Text className="eyebrow" mb={6} px={4}>
                {section.group}
              </Text>
              <Stack gap={2}>
                {section.items.map((c) => {
                  const isActive = c.title === active;
                  return (
                    <button
                      key={c.title}
                      type="button"
                      onClick={() => setActive(c.title)}
                      className={`${classes.convoRow} ${isActive ? classes.convoRowActive : ''}`}
                    >
                      <Group justify="space-between" wrap="nowrap" gap="xs">
                        <Text fz={13} fw={isActive ? 600 : 500} truncate style={{ flex: 1 }}>
                          {c.title}
                        </Text>
                        <Text fz={11} c="dimmed" style={{ flexShrink: 0 }}>
                          {c.when}
                        </Text>
                      </Group>
                    </button>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      </ScrollArea>

      <Divider />

      {/* Footer user */}
      <Group justify="space-between" wrap="nowrap" p="sm" px="md">
        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
          <Avatar size={30} radius="xl" color="neutral" variant="filled" className={classes.msgAvatar}>
            MC
          </Avatar>
          <Box style={{ minWidth: 0 }}>
            <Text fz={13} fw={600} truncate lh={1.15}>
              Maya Chen
            </Text>
            <Text fz={11} c="dimmed" truncate lh={1.2}>
              maya@northwind.io
            </Text>
          </Box>
        </Group>
        <Menu position="top-end" width={190} radius="md" shadow="md">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" radius="md" aria-label="Account menu">
              <Ellipsis size={17} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<CircleUser size={15} />}>Profile</Menu.Item>
            <Menu.Item leftSection={<Settings size={15} />}>Settings</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<LogOut size={15} />}>
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Stack>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  Header
 * ───────────────────────────────────────────────────────────── */

function Header({
  navMobileOpened,
  toggleNavMobile,
  toggleNavDesktop,
  panelOpen,
  togglePanel,
  model,
  setModel,
}: {
  navMobileOpened: boolean;
  toggleNavMobile: () => void;
  toggleNavDesktop: () => void;
  panelOpen: boolean;
  togglePanel: () => void;
  model: string;
  setModel: (v: string) => void;
}) {
  return (
    <AppHeader
      leftSection={
        <>
          <Burger opened={navMobileOpened} onClick={toggleNavMobile} hiddenFrom="sm" size="sm" />
          <Tooltip label="Toggle sidebar" withArrow visibleFrom="sm">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              radius="md"
              onClick={toggleNavDesktop}
              aria-label="Toggle sidebar"
              visibleFrom="sm"
            >
              <PanelLeft size={18} />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <Menu position="bottom-start" width={230} radius="md" shadow="md">
        <Menu.Target>
          <Button
            variant="subtle"
            color="gray"
            radius="md"
            size="sm"
            leftSection={<Command size={15} />}
            rightSection={<ChevronDown size={14} style={{ color: 'var(--app-muted)' }} />}
            styles={{ root: { fontWeight: 600 } }}
          >
            {MODELS.find((m) => m.value === model)?.label}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Model</Menu.Label>
          {MODELS.map((m) => (
            <Menu.Item
              key={m.value}
              onClick={() => setModel(m.value)}
              leftSection={<Command size={15} />}
              rightSection={
                m.value === model ? (
                  <Circle size={8} fill="currentColor" style={{ color: 'var(--app-muted)' }} />
                ) : null
              }
            >
              {m.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Tooltip label="Share chat" withArrow>
        <ActionIcon variant="subtle" color="gray" size="lg" radius="md" aria-label="Share chat">
          <Upload size={17} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={panelOpen ? 'Hide configuration' : 'Show configuration'} withArrow>
        <ActionIcon
          variant={panelOpen ? 'filled' : 'subtle'}
          color={panelOpen ? 'neutral' : 'gray'}
          size="lg"
          radius="md"
          onClick={togglePanel}
          aria-label="Toggle configuration panel"
        >
          <PanelRight size={18} />
        </ActionIcon>
      </Tooltip>
    </AppHeader>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  Main — calm empty state, the composer is the centerpiece
 * ───────────────────────────────────────────────────────────── */

function ExampleConversation() {
  return (
    <Stack gap={28}>
      <MessageRow role="user">
        <Text fz={15} lh={1.55}>
          Can you check the latest Mantine 9 AppShell API and show me how to make the right aside collapsible with a
          header toggle?
        </Text>
      </MessageRow>

      <MessageRow role="assistant">
        <ToolChip icon={<Globe size={12} />} label="Searched the docs" meta="mantine.dev · 3 results" />
        <Text fz={15} lh={1.6} mb="md">
          Yes — <Code>AppShell.Aside</Code> takes an <Code>aside</Code> prop with a <Code>collapsed</Code> object keyed
          by breakpoint. Drive it from a <Code>useDisclosure</Code> toggle in your header. Here's the minimal setup:
        </Text>
        <Code block>{CODE_SAMPLE}</Code>
        <Text fz={15} lh={1.6} mt="md">
          The <Code>breakpoint</Code> controls when it auto-hides on smaller screens, while{' '}
          <Code>collapsed.desktop</Code> gives you manual control from the toggle.
        </Text>
      </MessageRow>

      <MessageRow role="user">
        <Text fz={15} lh={1.55}>
          Nice. Can you also estimate how much of my monthly token budget that panel of settings would use per request?
        </Text>
      </MessageRow>

      <MessageRow role="assistant">
        <ToolChip icon={<CodeIcon size={12} />} label="Ran code" meta="python · 0.4s" />
        <Group gap={8} align="center">
          <Loader size="xs" type="dots" />
          <Text fz={14} c="dimmed">
            Calculating token usage
          </Text>
          <span className={classes.streamCaret} />
        </Group>
      </MessageRow>
    </Stack>
  );
}

function Main({ model }: { model: string }) {
  return (
    <Box className={classes.mainColumn}>
      <ScrollArea style={{ flex: 1 }} type="hover">
        <Box className={classes.thread}>
          <Text className={classes.greeting} mb={28}>
            How can I help you today?
          </Text>
          <ExampleConversation />
        </Box>
      </ScrollArea>

      <Box className={classes.composerDock}>
        <Box className={classes.dockInner}>
          <AiComposer models={MODELS} defaultModel={model} />
          <Group justify="center" gap="xs" wrap="wrap" mt="sm">
            {SUGGESTIONS.map((s) => (
              <Button
                key={s.label}
                variant="default"
                radius="xl"
                size="xs"
                leftSection={<s.icon size={14} />}
                className={classes.chip}
              >
                {s.label}
              </Button>
            ))}
          </Group>
        </Box>
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  Right config panel
 * ───────────────────────────────────────────────────────────── */

function ConfigPanel({ model, setModel }: { model: string; setModel: (v: string) => void }) {
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState<number | string>(4096);
  const [topP, setTopP] = useState(0.9);
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a precise, senior engineering assistant. Prefer runnable examples, cite sources when you browse, and keep answers tight.',
  );
  const [format, setFormat] = useState('markdown');
  const [stops, setStops] = useState<string[]>(['</output>', 'END']);
  const [safety, setSafety] = useState(true);
  const [tools, setTools] = useState<Record<string, boolean>>(
    Object.fromEntries(TOOLS.map((t) => [t.key, t.on])),
  );

  return (
    <Stack h="100%" gap={0}>
      <Group justify="space-between" px="md" py="sm" wrap="nowrap">
        <Group gap="xs">
          <SlidersHorizontal size={17} />
          <Text fz={14} fw={600}>
            Configuration
          </Text>
        </Group>
        <Badge variant="default" radius="sm" size="sm" tt="none" fw={500}>
          Unsaved
        </Badge>
      </Group>
      <Divider />

      <ScrollArea style={{ flex: 1 }} type="hover">
        <Accordion
          multiple
          defaultValue={['generation', 'tools']}
          radius="md"
          chevronPosition="right"
          styles={{
            control: { paddingInline: 'var(--mantine-spacing-md)' },
            content: { paddingInline: 'var(--mantine-spacing-md)' },
            label: { fontSize: 13, fontWeight: 600 },
            item: { borderColor: 'var(--app-border)' },
          }}
        >
          <Accordion.Item value="model">
            <Accordion.Control icon={<Command size={16} />}>Model</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md" pb="xs">
                <Select
                  label="Active model"
                  data={MODELS}
                  value={model}
                  onChange={(v) => v && setModel(v)}
                  radius="md"
                  allowDeselect={false}
                  comboboxProps={{ radius: 'md' }}
                />
                <Box>
                  <Text fz="sm" fw={500} mb={4}>
                    Response format
                  </Text>
                  <SegmentedControl
                    fullWidth
                    radius="md"
                    size="xs"
                    value={format}
                    onChange={setFormat}
                    data={[
                      { label: 'Text', value: 'text' },
                      { label: 'JSON', value: 'json' },
                      { label: 'Markdown', value: 'markdown' },
                    ]}
                  />
                </Box>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="generation">
            <Accordion.Control icon={<SlidersHorizontal size={16} />}>Generation</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="lg" pb="xs">
                <Box>
                  <Group justify="space-between" mb={6}>
                    <Text fz="sm" fw={500}>
                      Temperature
                    </Text>
                    <Code>{temperature.toFixed(2)}</Code>
                  </Group>
                  <Slider
                    value={temperature}
                    onChange={setTemperature}
                    min={0}
                    max={1}
                    step={0.01}
                    label={null}
                    color="neutral"
                    marks={[
                      { value: 0, label: 'Precise' },
                      { value: 1, label: 'Creative' },
                    ]}
                  />
                </Box>

                <Box>
                  <Group justify="space-between" mb={6}>
                    <Text fz="sm" fw={500}>
                      Top P
                    </Text>
                    <Code>{topP.toFixed(2)}</Code>
                  </Group>
                  <Slider
                    value={topP}
                    onChange={setTopP}
                    min={0}
                    max={1}
                    step={0.01}
                    label={null}
                    color="neutral"
                  />
                </Box>

                <NumberInput
                  label="Max tokens"
                  description="Upper bound on the response length"
                  value={maxTokens}
                  onChange={setMaxTokens}
                  min={256}
                  max={200000}
                  step={256}
                  radius="md"
                  thousandSeparator=","
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="system">
            <Accordion.Control icon={<Pencil size={16} />}>System prompt</Accordion.Control>
            <Accordion.Panel>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.currentTarget.value)}
                autosize
                minRows={4}
                maxRows={10}
                radius="md"
                pb="xs"
                styles={{ input: { fontSize: 13, lineHeight: 1.5 } }}
              />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="tools">
            <Accordion.Control icon={<CodeIcon size={16} />}>Tools</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs" pb="xs">
                {TOOLS.map((t) => (
                  <Paper
                    key={t.key}
                    radius="md"
                    p="xs"
                    px="sm"
                    style={{ border: '1px solid var(--app-border)', background: 'var(--app-surface)' }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <ThemeIcon size={26} radius="sm" variant="default">
                          <t.icon size={15} />
                        </ThemeIcon>
                        <Box>
                          <Text fz="sm" fw={500} lh={1.2}>
                            {t.label}
                          </Text>
                          <Text fz={11} c="dimmed" lh={1.25}>
                            {t.desc}
                          </Text>
                        </Box>
                      </Group>
                      <Switch
                        checked={tools[t.key]}
                        onChange={(e) => setTools((prev) => ({ ...prev, [t.key]: e.currentTarget.checked }))}
                        color="neutral"
                        size="sm"
                      />
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="advanced">
            <Accordion.Control icon={<ShieldCheck size={16} />}>Advanced</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="lg" pb="xs">
                <TagsInput
                  label="Stop sequences"
                  description="Generation halts when any of these appear"
                  value={stops}
                  onChange={setStops}
                  radius="md"
                  clearable
                />
                <Group
                  justify="space-between"
                  wrap="nowrap"
                  style={{
                    border: '1px solid var(--app-border)',
                    borderRadius: 'var(--mantine-radius-md)',
                    background: 'var(--app-surface)',
                    padding: '10px 12px',
                  }}
                >
                  <Box>
                    <Text fz="sm" fw={500} lh={1.2}>
                      Safety filters
                    </Text>
                    <Text fz={11} c="dimmed" lh={1.25}>
                      Screen inputs and outputs for policy
                    </Text>
                  </Box>
                  <Switch
                    checked={safety}
                    onChange={(e) => setSafety(e.currentTarget.checked)}
                    color="neutral"
                    size="sm"
                  />
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </ScrollArea>

      <Divider />
      <Group p="sm" px="md" grow>
        <Button variant="default" radius="md" size="sm">
          Reset
        </Button>
        <Button
          variant="filled"
          color="neutral"
          radius="md"
          size="sm"
          styles={{ root: { boxShadow: 'var(--app-shadow-raised), var(--app-inset-highlight)' } }}
        >
          Save preset
        </Button>
      </Group>
    </Stack>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  Full-page shell
 * ───────────────────────────────────────────────────────────── */

export function AgentStudio() {
  const [navMobileOpened, { toggle: toggleNavMobile, close: closeNavMobile }] = useDisclosure(false);
  const [navDesktopOpened, { toggle: toggleNavDesktop }] = useDisclosure(true);
  const [panelOpen, { toggle: togglePanel }] = useDisclosure(false);
  const [model, setModel] = useState('opus-4.8');

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !navMobileOpened, desktop: !navDesktopOpened },
      }}
      aside={{ width: 320, breakpoint: 'md', collapsed: { desktop: !panelOpen, mobile: !panelOpen } }}
      padding={0}
      style={{ height: '100dvh' }}
    >
      <AppShell.Header withBorder={false}>
        <Header
          navMobileOpened={navMobileOpened}
          toggleNavMobile={toggleNavMobile}
          toggleNavDesktop={toggleNavDesktop}
          panelOpen={panelOpen}
          togglePanel={togglePanel}
          model={model}
          setModel={setModel}
        />
      </AppShell.Header>

      <AppShell.Navbar style={{ background: 'var(--app-bg)' }}>
        <Navbar onNavigate={closeNavMobile} />
      </AppShell.Navbar>

      <AppShell.Main style={{ height: '100dvh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <Main model={model} />
      </AppShell.Main>

      <AppShell.Aside style={{ background: 'var(--app-bg)' }}>
        <ConfigPanel model={model} setModel={setModel} />
      </AppShell.Aside>
    </AppShell>
  );
}
