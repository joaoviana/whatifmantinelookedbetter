import { useState } from 'react';
import { Box, Burger, Button, Drawer, Flex, SegmentedControl, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
import { SiteNav } from '../../components/SiteNav';
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
  const [threadId, setThreadId] = useState(THREADS[0].id);
  const active = THREADS.find((t) => t.id === threadId) ?? THREADS[0];
  // This page has no persistent sidebar of its own, so the site nav gets a
  // dedicated mobile drawer rather than riding along in someone else's.
  const [navOpened, { toggle: toggleNav, close: closeNav }] = useDisclosure(false);

  return (
    <Flex direction="column" h="100dvh" style={{ background: 'var(--app-bg)' }}>
      {/* Header */}
      <AppHeader leftSection={<Burger opened={navOpened} onClick={toggleNav} hiddenFrom="sm" size="sm" aria-label="Toggle navigation" />}>
        <SegmentedControl
          size="xs"
          value={threadId}
          onChange={setThreadId}
          data={THREADS.map((t) => ({ label: t.title, value: t.id }))}
          visibleFrom="sm"
        />
        <Button variant="default" size="xs" leftSection={<Plus size={14} />}>New run</Button>
      </AppHeader>

      <Drawer opened={navOpened} onClose={closeNav} position="left" size={240} title="Navigate" hiddenFrom="sm">
        <Stack gap={2}>
          <SiteNav variant="list" onNavigate={closeNav} />
        </Stack>
      </Drawer>

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
