import { useState } from 'react';
import { Box, Button, Flex, SegmentedControl } from '@mantine/core';
import { Plus } from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
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

  return (
    <Flex direction="column" h="100vh" style={{ background: 'var(--app-bg)' }}>
      {/* Header */}
      <AppHeader>
        <SegmentedControl
          size="xs"
          value={threadId}
          onChange={setThreadId}
          data={THREADS.map((t) => ({ label: t.title, value: t.id }))}
          visibleFrom="sm"
        />
        <Button variant="default" size="xs" leftSection={<Plus size={14} />}>New run</Button>
      </AppHeader>

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
