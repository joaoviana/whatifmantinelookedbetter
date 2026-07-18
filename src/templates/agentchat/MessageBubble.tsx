import { Box, Code, Group, Stack, Text } from '@mantine/core';
import { FileText, Wrench } from 'lucide-react';
import type { Message } from './agents';
import { AGENTS_BY_ID } from './agents';
import { AgentAvatar } from './AgentAvatar';
import { MessageChart } from './MessageChart';
import classes from './MessageBubble.module.css';

/* CONTRACT: export function MessageBubble({ message }) — the user-vs-assistant bubble.
   Subtle, polished, monochrome (Attio / Linear / Vercel). Colour comes only from the
   agent gradient avatar; everything else is hairline neutral surface & muted text. */

const AVATAR_SIZE = 26;
/* Body indents to align under the agent name (avatar + gap). */
const BODY_INDENT = AVATAR_SIZE + 10;

/** Refined inline tool chip + quiet source tokens. */
function ToolBlock({ message }: { message: Message }) {
  return (
    <Stack gap={8}>
      {message.tool && (
        <Group
          className={classes.toolChip}
          gap={8}
          wrap="nowrap"
          w="fit-content"
          px={10}
          py={5}
        >
          <Wrench size={13} strokeWidth={1.75} style={{ color: 'var(--app-muted)', flexShrink: 0 }} />
          <Text fz={12.5} fw={500} c="var(--mantine-color-text)" lh={1.2}>
            {message.tool.label}
          </Text>
          {message.tool.meta && (
            <Text fz={12} c="var(--app-muted)" lh={1.2}>
              {message.tool.meta}
            </Text>
          )}
        </Group>
      )}

      {message.text && (
        <Text fz={14} lh={1.65} c="var(--mantine-color-text)">
          {message.text}
        </Text>
      )}

      {message.sources && message.sources.length > 0 && (
        <Group gap={6}>
          {message.sources.map((s) => (
            <Group key={s.label} className={classes.sourceChip} gap={5} wrap="nowrap" px={8} py={3}>
              <FileText size={11} strokeWidth={1.75} style={{ flexShrink: 0 }} />
              <Text fz={11.5} lh={1.2} c="inherit">
                {s.label}
              </Text>
              {s.meta && (
                <Text fz={11} lh={1.2} c="var(--app-muted)">
                  {s.meta}
                </Text>
              )}
            </Group>
          ))}
        </Group>
      )}
    </Stack>
  );
}

/** Tasteful block code with an intro line above. */
function CodeBlock({ message }: { message: Message }) {
  return (
    <Stack gap={8}>
      {message.text && (
        <Text fz={14} lh={1.65} c="var(--mantine-color-text)">
          {message.text}
        </Text>
      )}
      <Code
        block
        style={{
          background: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          borderRadius: 'var(--mantine-radius-md)',
          fontSize: 12.5,
          lineHeight: 1.6,
          boxShadow: 'var(--app-shadow-raised)',
        }}
      >
        {message.code}
      </Code>
    </Stack>
  );
}

/** Streamed text with breathing dots + a blinking caret. */
function StreamingBlock({ message }: { message: Message }) {
  return (
    <Group gap={10} align="center" wrap="nowrap">
      <Text fz={14} lh={1.65} c="var(--mantine-color-text)">
        {message.text}
        <span className={classes.caret} />
      </Text>
      <span className={classes.dots} aria-hidden>
        <span className={classes.dot} />
        <span className={classes.dot} />
        <span className={classes.dot} />
      </span>
    </Group>
  );
}

/** Intro text + the rendered in-message chart. */
function ChartBlock({ message }: { message: Message }) {
  return (
    <Stack gap={8}>
      {message.text && (
        <Text fz={14} lh={1.65} c="var(--mantine-color-text)">
          {message.text}
        </Text>
      )}
      {message.chart && <MessageChart spec={message.chart} />}
    </Stack>
  );
}

/** Body switch shared by every agent message kind. */
function AgentBody({ message }: { message: Message }) {
  switch (message.kind) {
    case 'tool':
      return <ToolBlock message={message} />;
    case 'code':
      return <CodeBlock message={message} />;
    case 'chart':
      return <ChartBlock message={message} />;
    case 'streaming':
      return <StreamingBlock message={message} />;
    default:
      return (
        <Text fz={14} lh={1.65} c="var(--mantine-color-text)">
          {message.text}
        </Text>
      );
  }
}

export function MessageBubble({ message }: { message: Message }) {
  const author = AGENTS_BY_ID[message.authorId];

  /* USER — right-aligned, subtle surface chip with a hairline. Understated. */
  if (message.role === 'user') {
    return (
      <Group justify="flex-end" px="md" py={6}>
        <Box className={classes.userChip} px={14} py={10} maw="76%">
          <Text fz={14} lh={1.6} c="var(--mantine-color-text)">
            {message.text}
          </Text>
        </Box>
      </Group>
    );
  }

  /* AGENT — airy, borderless left-aligned row: avatar + name + muted role, then body. */
  return (
    <Box px="md" py={10}>
      <Group gap={10} align="center" mb={6} wrap="nowrap">
        {author && <AgentAvatar agent={author} size={AVATAR_SIZE} />}
        <Group gap={7} align="baseline" wrap="nowrap">
          <Text fz={13} fw={600} lh={1.2} c="var(--mantine-color-text)">
            {author?.name ?? 'Agent'}
          </Text>
          {author?.role && (
            <Text fz={12} lh={1.2} c="var(--app-muted)">
              {author.role}
            </Text>
          )}
        </Group>
      </Group>
      <Box pl={BODY_INDENT}>
        <AgentBody message={message} />
      </Box>
    </Box>
  );
}
