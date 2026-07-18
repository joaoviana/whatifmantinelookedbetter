import { useState } from 'react';
import { ActionIcon, Badge, Box, Button, Flex, Group, SegmentedControl, Text, ThemeIcon, useMantineColorScheme } from '@mantine/core';
import { Moon, Plus, Sun, Workflow } from 'lucide-react';
import { THREADS } from './agents';
import { AgentRoster } from './AgentRoster';
import { Thread } from './Thread';
import { Composer } from './Composer';

/**
 * Multi-agent chat — modular. Shell (orchestrator-owned) composes five teammate panels:
 * AgentAvatar (gradient identity) · MessageBubble · AgentRoster · Thread · Composer.
 * Shared data/types live in ./agents. Two example threads switch in the header.
 */
export function AgentChat() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const [threadId, setThreadId] = useState(THREADS[0].id);
  const active = THREADS.find((t) => t.id === threadId) ?? THREADS[0];

  return (
    <Flex direction="column" h="100vh" style={{ background: 'var(--app-bg)' }}>
      {/* Header */}
      <Group h={54} px="md" justify="space-between" style={{ borderBottom: '1px solid var(--app-border)', flexShrink: 0 }}>
        <Group gap="sm">
          <ThemeIcon size={28} radius="md" variant="filled" color="neutral">
            <Workflow size={15} />
          </ThemeIcon>
          <Box visibleFrom="sm">
            <Text fz={13} fw={600} lh={1.15}>
              {active.title}
            </Text>
            <Text className="eyebrow" lh={1.2}>Multi-agent</Text>
          </Box>
          <Badge variant="light" radius="sm" size="sm">5 agents · live</Badge>
        </Group>
        <Group gap="xs">
          <SegmentedControl
            size="xs"
            value={threadId}
            onChange={setThreadId}
            data={THREADS.map((t) => ({ label: t.title, value: t.id }))}
            visibleFrom="sm"
          />
          <Button variant="default" size="xs" leftSection={<Plus size={14} />}>New run</Button>
          <ActionIcon variant="default" size="lg" onClick={toggleColorScheme} aria-label="Toggle color scheme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </ActionIcon>
        </Group>
      </Group>

      {/* Agent roster strip */}
      <Box style={{ borderBottom: '1px solid var(--app-border)', flexShrink: 0 }}>
        <AgentRoster />
      </Box>

      {/* Conversation */}
      <Box style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Thread key={active.id} messages={active.messages} />
      </Box>

      {/* Composer */}
      <Box style={{ borderTop: '1px solid var(--app-border)', flexShrink: 0 }}>
        <Composer />
      </Box>
    </Flex>
  );
}
