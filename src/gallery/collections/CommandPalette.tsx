/* CONTRACT: export function CommandPalette() — a composed block from the themed components.
   A ⌘K command menu: search field, grouped commands with icons + kbd shortcuts. */
import { useMemo, useState } from 'react';
import { Box, Group, Kbd, Paper, ScrollArea, Text, TextInput } from '@mantine/core';
import {
  ArrowRight,
  Clock,
  CornerDownLeft,
  Download,
  FileText,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Share2,
  Trash2,
  User,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import classes from './CommandPalette.module.css';

interface Command {
  id: string;
  label: string;
  icon: LucideIcon;
  keys: string[];
}

interface CommandGroup {
  label: string;
  items: Command[];
}

const GROUPS: CommandGroup[] = [
  {
    label: 'Navigation',
    items: [
      { id: 'nav-projects', label: 'Go to Projects', icon: LayoutGrid, keys: ['G', 'P'] },
      { id: 'nav-docs', label: 'Go to Documents', icon: FileText, keys: ['G', 'D'] },
      { id: 'nav-profile', label: 'Go to Profile', icon: User, keys: ['G', 'U'] },
      { id: 'nav-settings', label: 'Open Settings', icon: Settings, keys: ['⌘', ','] },
    ],
  },
  {
    label: 'Actions',
    items: [
      { id: 'act-new', label: 'Create new file', icon: Plus, keys: ['⌘', 'N'] },
      { id: 'act-invite', label: 'Invite teammate', icon: UserPlus, keys: ['⌘', 'I'] },
      { id: 'act-share', label: 'Copy share link', icon: Share2, keys: ['⌘', 'L'] },
      { id: 'act-export', label: 'Export as CSV', icon: Download, keys: ['⌘', 'E'] },
      { id: 'act-delete', label: 'Delete selection', icon: Trash2, keys: ['⌫'] },
    ],
  },
  {
    label: 'Recent',
    items: [
      { id: 'rec-q3', label: 'Q3 Revenue Report', icon: Clock, keys: ['↵'] },
      { id: 'rec-onboarding', label: 'Onboarding checklist', icon: Clock, keys: ['↵'] },
      { id: 'rec-roadmap', label: 'Product roadmap', icon: Clock, keys: ['↵'] },
    ],
  },
];

export function CommandPalette() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('nav-projects');

  // Live-filter every group by the query; drop groups that end up empty.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(q)),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  // The highlighted row must always be one that is currently visible.
  const visibleIds = filtered.flatMap((group) => group.items.map((item) => item.id));
  const active = visibleIds.includes(activeId) ? activeId : visibleIds[0];

  return (
    <Box className={classes.wrap}>
      <Paper
        radius="lg"
        shadow="lg"
        w="100%"
        styles={{
          root: {
            maxWidth: 560,
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            overflow: 'hidden',
          },
        }}
      >
        {/* Search header — borderless input, Search glyph, Esc affordance. */}
        <Box
          px="md"
          style={{ borderBottom: '1px solid var(--app-border)' }}
        >
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Type a command or search…"
            variant="unstyled"
            size="md"
            aria-label="Command search"
            leftSection={<Search size={17} />}
            leftSectionPointerEvents="none"
            rightSection={<Kbd>Esc</Kbd>}
            rightSectionWidth={54}
            styles={{
              input: { fontSize: 'var(--mantine-font-size-md)' },
              section: { color: 'var(--app-muted)' },
            }}
          />
        </Box>

        {/* Grouped, scrollable command list. */}
        <ScrollArea.Autosize mah={330} type="hover" scrollbarSize={8}>
          <Box p={8}>
            {filtered.length === 0 ? (
              <Text c="dimmed" fz="sm" ta="center" py={28}>
                No commands match “{query.trim()}”
              </Text>
            ) : (
              filtered.map((group, groupIndex) => (
                <Box key={group.label} mt={groupIndex === 0 ? 0 : 10}>
                  <Text className="eyebrow" px={12} pt={6} pb={4}>
                    {group.label}
                  </Text>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setActiveId(item.id)}
                        onFocus={() => setActiveId(item.id)}
                        className={
                          item.id === active
                            ? `${classes.row} ${classes.rowActive}`
                            : classes.row
                        }
                      >
                        <span className={classes.icon}>
                          <Icon size={16} strokeWidth={1.75} />
                        </span>
                        <span className={classes.label}>{item.label}</span>
                        <Group gap={4} wrap="nowrap">
                          {item.keys.map((key, keyIndex) => (
                            <Kbd key={keyIndex}>{key}</Kbd>
                          ))}
                        </Group>
                      </button>
                    );
                  })}
                </Box>
              ))
            )}
          </Box>
        </ScrollArea.Autosize>

        {/* Footer hint bar. */}
        <Group
          justify="space-between"
          px="md"
          py={8}
          style={{ borderTop: '1px solid var(--app-border)' }}
        >
          <Group gap={14}>
            <Group gap={6} wrap="nowrap">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <Text c="dimmed" fz="xs">
                to navigate
              </Text>
            </Group>
            <Group gap={6} wrap="nowrap">
              <Kbd>
                <CornerDownLeft size={11} style={{ display: 'block' }} />
              </Kbd>
              <Text c="dimmed" fz="xs">
                to select
              </Text>
            </Group>
          </Group>
          <Group gap={6} wrap="nowrap" c="dimmed">
            <Text fz="xs">Open command</Text>
            <ArrowRight size={13} />
          </Group>
        </Group>
      </Paper>
    </Box>
  );
}
