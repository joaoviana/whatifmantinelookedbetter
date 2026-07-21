import { useState } from 'react';
import {
  Tabs,
  Accordion,
  Pagination,
  Breadcrumbs,
  Anchor,
  NavLink,
  Divider,
  Stepper,
  Menu,
  SegmentedControl,
  Burger,
  ScrollArea,
  Tree,
  Button,
  Group,
  Stack,
  Flex,
  SimpleGrid,
  Grid,
  Center,
  Text,
  Box,
  type TreeNodeData,
  type RenderTreeNodePayload,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  LayoutDashboard,
  Activity,
  Settings,
  ChevronRight,
  Folder,
  FileText,
  User,
  LogOut,
  Copy,
  Trash2,
  Bell,
  Lock,
  Palette,
} from 'lucide-react';
import { Specimen, SpecimenGrid } from '../parts';

export const meta = {
  id: 'navigation',
  label: 'Navigation & Layout',
  description:
    'Tabs, accordion, pagination, breadcrumbs, nav links, steppers, menus, tree, scroll areas and the layout primitives — calm, tactile, monochrome wayfinding.',
};

/* Small labeled box so the layout primitives are actually visible. */
function LBox({ children, grow = false }: { children: React.ReactNode; grow?: boolean }) {
  return (
    <Center
      style={{
        flexGrow: grow ? 1 : 0,
        minWidth: 44,
        height: 40,
        padding: '0 10px',
        border: '1px solid var(--app-border)',
        borderRadius: 'var(--mantine-radius-sm)',
        background: 'var(--mantine-color-default-hover)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--mantine-color-dimmed)',
        letterSpacing: '-0.006em',
      }}
    >
      {children}
    </Center>
  );
}

/* File tree data + custom node rendering (folder / file icons + chevron). */
const treeData: TreeNodeData[] = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'src/theme',
        label: 'theme',
        children: [
          { value: 'src/theme/tokens.ts', label: 'tokens.ts' },
          { value: 'src/theme/navigation.ts', label: 'navigation.ts' },
        ],
      },
      { value: 'src/App.tsx', label: 'App.tsx' },
      { value: 'src/main.tsx', label: 'main.tsx' },
    ],
  },
  { value: 'package.json', label: 'package.json' },
];

function TreeNode({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) {
  return (
    <Group gap={6} wrap="nowrap" {...elementProps}>
      {hasChildren ? (
        <ChevronRight
          size={13}
          style={{
            color: 'var(--mantine-color-dimmed)',
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 150ms var(--app-ease-out)',
          }}
        />
      ) : (
        <Box w={13} />
      )}
      {hasChildren ? (
        <Folder size={15} style={{ color: 'var(--mantine-color-dimmed)' }} />
      ) : (
        <FileText size={15} style={{ color: 'var(--mantine-color-dimmed)' }} />
      )}
      <span>{node.label}</span>
    </Group>
  );
}

export function Section() {
  const [burgerOpen, setBurgerOpen] = useState(false);
  // Wide specimens drop to a single column on a phone; the horizontal stepper
  // goes vertical so its steps stay legible instead of overflowing.
  const wide = useMediaQuery('(min-width: 53em)', true, { getInitialValueInEffect: false });

  return (
    <Stack gap={40}>
      <SpecimenGrid>
        {/* Tabs — default underline variant */}
        <Specimen name="Tabs" hint="default · underline" span={wide ? 2 : 1}>
          <Tabs defaultValue="overview" w="100%">
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<LayoutDashboard size={15} />}>
                Overview
              </Tabs.Tab>
              <Tabs.Tab value="activity" leftSection={<Activity size={15} />}>
                Activity
              </Tabs.Tab>
              <Tabs.Tab value="settings" leftSection={<Settings size={15} />}>
                Settings
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Specimen>

        {/* Tabs — pills variant (raised active chip) */}
        <Specimen name="Tabs" hint="pills · raised chip" span={wide ? 2 : 1}>
          <Tabs variant="pills" defaultValue="all" w="100%">
            <Tabs.List>
              <Tabs.Tab value="all">All</Tabs.Tab>
              <Tabs.Tab value="open">Open</Tabs.Tab>
              <Tabs.Tab value="closed">Closed</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Specimen>

        {/* SegmentedControl — the archetypal chewy control */}
        <Specimen name="SegmentedControl" hint="recessed track · raised chip" span={wide ? 2 : 1}>
          <SegmentedControl fullWidth data={['Preview', 'Code', 'Blame']} defaultValue="Preview" />
        </Specimen>

        {/* Tabs — vertical orientation */}
        <Specimen name="Tabs" hint="vertical · orientation" span={wide ? 2 : 1} minH={180}>
          <Tabs orientation="vertical" defaultValue="general" w="100%" h="100%">
            <Tabs.List>
              <Tabs.Tab value="general" leftSection={<Settings size={15} />}>
                General
              </Tabs.Tab>
              <Tabs.Tab value="notifs" leftSection={<Bell size={15} />}>
                Notifications
              </Tabs.Tab>
              <Tabs.Tab value="security" leftSection={<Lock size={15} />}>
                Security
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="general" px="md" pt={2}>
              <Text variant="secondary">
                Workspace name, locale and defaults.
              </Text>
            </Tabs.Panel>
            <Tabs.Panel value="notifs" px="md" pt={2}>
              <Text variant="secondary">
                Email and in-app notification rules.
              </Text>
            </Tabs.Panel>
            <Tabs.Panel value="security" px="md" pt={2}>
              <Text variant="secondary">
                Sessions, 2FA and access tokens.
              </Text>
            </Tabs.Panel>
          </Tabs>
        </Specimen>

        {/* Accordion — separated / bordered */}
        <Specimen name="Accordion" hint="separated · hairline" span={wide ? 2 : 1} minH={180}>
          <Accordion defaultValue="a" w="100%">
            <Accordion.Item value="a">
              <Accordion.Control>What is a theme lab?</Accordion.Control>
              <Accordion.Panel>
                A single monochrome theme, styled group by group — hairline borders, small radii,
                quiet shadows.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="b">
              <Accordion.Control>How do I theme it?</Accordion.Control>
              <Accordion.Panel>Edit the navigation group and its CSS module.</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="c">
              <Accordion.Control>Does it support dark mode?</Accordion.Control>
              <Accordion.Panel>Yes — autoContrast keeps active states crisp in both schemes.</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Specimen>

        {/* Menu */}
        <Specimen name="Menu" hint="dropdown · sections" span={wide ? 2 : 1} minH={180}>
          <Menu width={220} position="bottom-start" withinPortal={false}>
            <Menu.Target>
              <Button variant="default">Open menu</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item leftSection={<User size={15} />}>Profile</Menu.Item>
              <Menu.Item leftSection={<Settings size={15} />}>Settings</Menu.Item>
              <Menu.Divider />
              <Menu.Label>Actions</Menu.Label>
              <Menu.Item leftSection={<Copy size={15} />}>Duplicate</Menu.Item>
              <Menu.Item color="red" leftSection={<Trash2 size={15} />}>
                Delete
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<LogOut size={15} />}>Sign out</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Specimen>

        {/* Tree — file tree */}
        <Specimen name="Tree" hint="file tree · hairline guides" span={wide ? 2 : 1} minH={180}>
          <Box w="100%">
            <Tree data={treeData} levelOffset={22} renderNode={(payload) => <TreeNode {...payload} />} />
          </Box>
        </Specimen>

        {/* ScrollArea — a scrolling list */}
        <Specimen name="ScrollArea" hint="scrolling list · thin thumb" span={wide ? 2 : 1} minH={180}>
          <ScrollArea h={148} w="100%" px="xs">
            <Stack gap={2}>
              {[
                'Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Hooli',
                'Vehement', 'Massive Dynamic', 'Stark Industries', 'Wayne Enterprises',
              ].map((name, i) => (
                <Group key={name} justify="space-between" px="sm" py={6}>
                  <Text fz="sm">{name}</Text>
                  <Text variant="meta">
                    #{String(i + 1).padStart(2, '0')}
                  </Text>
                </Group>
              ))}
            </Stack>
          </ScrollArea>
        </Specimen>

        {/* Breadcrumbs */}
        <Specimen name="Breadcrumbs" hint="dimmed → full" span={wide ? 2 : 1}>
          <Breadcrumbs separator={<ChevronRight size={13} />}>
            <Anchor href="#" fz="sm">
              Home
            </Anchor>
            <Anchor href="#" fz="sm">
              Workspace
            </Anchor>
            <Anchor href="#" fz="sm">
              Settings
            </Anchor>
          </Breadcrumbs>
        </Specimen>

        {/* Burger — toggle */}
        <Specimen name="Burger" hint="menu toggle" span={wide ? 2 : 1}>
          <Group gap="md">
            <Burger
              opened={burgerOpen}
              onClick={() => setBurgerOpen((o) => !o)}
              aria-label="Toggle navigation"
            />
            <Text variant="secondary">
              {burgerOpen ? 'Menu open' : 'Menu closed'}
            </Text>
          </Group>
        </Specimen>

        {/* Stepper — horizontal */}
        <Specimen name="Stepper" hint="horizontal · active" span={wide ? 2 : 1} minH={120}>
          <Box w="100%">
            <Stepper active={1} orientation={wide ? 'horizontal' : 'vertical'}>
              <Stepper.Step label="Account" description="Create profile" />
              <Stepper.Step label="Verify" description="Confirm email" />
              <Stepper.Step label="Done" description="Get started" />
            </Stepper>
          </Box>
        </Specimen>

        {/* Stepper — vertical */}
        <Specimen name="Stepper" hint="vertical · orientation" span={wide ? 2 : 1} minH={180}>
          <Box w="100%">
            <Stepper active={1} orientation="vertical" size="sm">
              <Stepper.Step label="Account" description="Create profile" />
              <Stepper.Step label="Verify" description="Confirm email" />
              <Stepper.Step label="Done" description="Get started" />
            </Stepper>
          </Box>
        </Specimen>

        {/* NavLink — active + nested */}
        <Specimen name="NavLink" hint="active · nested" span={wide ? 2 : 1} minH={180}>
          <Stack gap={4} w="100%">
            <NavLink label="Dashboard" leftSection={<LayoutDashboard size={16} />} active />
            <NavLink
              label="Projects"
              leftSection={<Folder size={16} />}
              defaultOpened
              childrenOffset={28}
            >
              <NavLink label="Overview" leftSection={<FileText size={16} />} />
              <NavLink label="Reports" leftSection={<FileText size={16} />} />
            </NavLink>
            <NavLink label="Settings" leftSection={<Settings size={16} />} />
          </Stack>
        </Specimen>

        {/* Pagination */}
        <Specimen name="Pagination" hint="raised active control">
          <Pagination total={8} defaultValue={2} />
        </Specimen>

        {/* Divider */}
        <Specimen name="Divider" hint="hairline · label">
          <Stack gap="lg" w="100%">
            <Divider label="or continue with" labelPosition="center" />
            <Divider />
          </Stack>
        </Specimen>
      </SpecimenGrid>

      {/* ── Layout primitives ─────────────────────────────────────────── */}
      <Stack gap={4}>
        <Text variant="eyebrow">
          <Palette size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Layout primitives
        </Text>
        <Text variant="secondary" maw={620}>
          The spacing and grid system made visible — the scaffolding every screen is composed from.
        </Text>
      </Stack>

      <SpecimenGrid>
        <Specimen name="Group" hint="horizontal · gap" span={wide ? 2 : 1}>
          <Group gap="sm" w="100%">
            <LBox>A</LBox>
            <LBox>B</LBox>
            <LBox>C</LBox>
          </Group>
        </Specimen>

        <Specimen name="Stack" hint="vertical · gap" minH={140}>
          <Stack gap="xs" w="100%">
            <LBox grow>1</LBox>
            <LBox grow>2</LBox>
            <LBox grow>3</LBox>
          </Stack>
        </Specimen>

        <Specimen name="Center" hint="both axes">
          <Center h={100} w="100%" style={{ border: '1px dashed var(--app-border)', borderRadius: 'var(--mantine-radius-sm)' }}>
            <LBox>centered</LBox>
          </Center>
        </Specimen>

        <Specimen name="Flex" hint="wrap · justify" span={wide ? 2 : 1}>
          <Flex gap="sm" wrap="wrap" justify="space-between" w="100%">
            <LBox grow>flex</LBox>
            <LBox grow>grow</LBox>
            <LBox grow>wrap</LBox>
            <LBox grow>space</LBox>
          </Flex>
        </Specimen>

        <Specimen name="SimpleGrid" hint="equal cols" span={wide ? 2 : 1}>
          <SimpleGrid cols={3} spacing="sm" w="100%">
            <LBox grow>1</LBox>
            <LBox grow>2</LBox>
            <LBox grow>3</LBox>
            <LBox grow>4</LBox>
            <LBox grow>5</LBox>
            <LBox grow>6</LBox>
          </SimpleGrid>
        </Specimen>

        <Specimen name="Grid" hint="12-col spans" span={wide ? 2 : 1}>
          <Grid gap="sm" w="100%">
            <Grid.Col span={6}>
              <LBox grow>span 6</LBox>
            </Grid.Col>
            <Grid.Col span={6}>
              <LBox grow>span 6</LBox>
            </Grid.Col>
            <Grid.Col span={4}>
              <LBox grow>4</LBox>
            </Grid.Col>
            <Grid.Col span={8}>
              <LBox grow>span 8</LBox>
            </Grid.Col>
          </Grid>
        </Specimen>
      </SpecimenGrid>
    </Stack>
  );
}
