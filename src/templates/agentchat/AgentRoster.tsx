/* CONTRACT: export function AgentRoster() — the agent team strip/header.
   Row of AgentAvatar gradient circles + name/role + live status. This teammate owns it. */
import { Box, Group, Stack, Text } from '@mantine/core';
import { AGENTS, type Agent } from './agents';
import { AgentAvatar } from './AgentAvatar';
import classes from './AgentRoster.module.css';

const STATUS_LABEL: Record<Agent['status'], string> = {
  online: 'Online',
  thinking: 'Thinking',
  idle: 'Idle',
};

function RosterMember({ agent }: { agent: Agent }) {
  const live = agent.status !== 'idle';
  return (
    <Group
      className={classes.card}
      gap={10}
      wrap="nowrap"
      title={`${agent.name} · ${agent.role} · ${STATUS_LABEL[agent.status]}`}
      style={{
        flex: '0 0 auto',
        padding: '6px 12px 6px 8px',
        borderRadius: 'var(--mantine-radius-lg)',
      }}
    >
      <Box style={{ position: 'relative', width: 38, height: 38, flex: '0 0 auto' }}>
        <AgentAvatar agent={agent} size={38} />
        <span
          className={`${classes.dot} ${agent.status === 'thinking' ? classes.thinking : ''}`}
          style={{
            color: agent.accent,
            backgroundColor: live ? agent.accent : 'var(--app-muted)',
          }}
        />
      </Box>

      <Stack gap={0} style={{ minWidth: 0 }}>
        <Text
          fw={550}
          fz={13}
          lh={1.25}
          c="var(--mantine-color-text)"
          style={{ whiteSpace: 'nowrap' }}
        >
          {agent.name}
        </Text>
        <Text fz={11.5} lh={1.3} c="var(--app-muted)" style={{ whiteSpace: 'nowrap' }}>
          {agent.role}
        </Text>
      </Stack>
    </Group>
  );
}

export function AgentRoster() {
  const activeCount = AGENTS.filter((a) => a.status !== 'idle').length;

  return (
    <Group
      wrap="nowrap"
      align="center"
      gap={20}
      style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--app-border)',
        backgroundColor: 'var(--app-bg)',
      }}
    >
      <Stack gap={2} style={{ flex: '0 0 auto' }}>
        <Text className="eyebrow">Team</Text>
        <Text fz={12.5} fw={500} c="var(--app-muted)" style={{ whiteSpace: 'nowrap' }}>
          {activeCount} agents collaborating
        </Text>
      </Stack>

      <Box
        aria-hidden
        style={{
          flex: '0 0 auto',
          width: 1,
          alignSelf: 'stretch',
          backgroundColor: 'var(--app-border)',
        }}
      />

      <div className={classes.strip} style={{ flex: 1, minWidth: 0 }}>
        {AGENTS.map((agent) => (
          <RosterMember key={agent.id} agent={agent} />
        ))}
      </div>
    </Group>
  );
}
