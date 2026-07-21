/* CONTRACT: export function AiComposer(props) — the single shared AI composer.
   Extracted verbatim from the Agent Studio composer (the good one): a borderless
   flowing autosize Textarea, a bottom row with a subtle "+" and a model-pill Menu
   on the left, and a subtle Mic + a circular filled Send (dim/disabled when empty)
   on the right. Monochrome only, theme tokens, light AND dark. */
import { useState, type ReactNode } from 'react';
import { ActionIcon, Box, Button, Group, Menu, Text, Textarea, Tooltip } from '@mantine/core';
import { ArrowUp, ChevronDown, Circle, Command, Mic, Plus } from 'lucide-react';
import classes from './AiComposer.module.css';

export interface AiComposerModel {
  value: string;
  label: string;
}

export interface AiComposerProps {
  models?: AiComposerModel[];
  defaultModel?: string;
  placeholder?: string;
  helperText?: ReactNode;
  maxWidth?: number | string;
}

const DEFAULT_MODELS: AiComposerModel[] = [
  { value: 'opus-4.8', label: 'Claude Opus 4.8' },
  { value: 'sonnet-4.5', label: 'Claude Sonnet 4.5' },
  { value: 'haiku-4.5', label: 'Claude Haiku 4.5' },
];

const DEFAULT_PLACEHOLDER = 'Send a message…  (@ to mention, / for commands)';

export function AiComposer({
  models = DEFAULT_MODELS,
  defaultModel,
  placeholder = DEFAULT_PLACEHOLDER,
  helperText,
  maxWidth,
}: AiComposerProps) {
  const [value, setValue] = useState('');
  const [model, setModel] = useState(defaultModel ?? models[0]?.value ?? '');

  const modelLabel = models.find((m) => m.value === model)?.label ?? '';
  const canSend = value.trim().length > 0;

  return (
    <Box
      className={classes.root}
      style={
        maxWidth
          ? {
              // Cap at the caller's width but never exceed the viewport, so the
              // composer goes edge-to-edge on phones instead of overflowing.
              maxWidth: `min(100%, ${typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth})`,
              marginInline: 'auto',
            }
          : undefined
      }
    >
      <Box className={classes.composer}>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder={placeholder}
          autosize
          minRows={2}
          maxRows={10}
          variant="unstyled"
          className={classes.composerInput}
          styles={{
            input: {
              fontSize: 15,
              lineHeight: 1.6,
              padding: '2px 6px',
              border: 'none',
              background: 'transparent',
              minHeight: 0,
            },
          }}
        />

        <Group justify="space-between" mt={6} gap={8} wrap="wrap">
          <Group gap={4} wrap="nowrap">
            <Tooltip label="Add attachment" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                radius="xl"
                size="sm"
                aria-label="Add attachment"
                style={{ color: 'var(--app-muted)' }}
              >
                <Plus size={16} />
              </ActionIcon>
            </Tooltip>

            <Menu position="bottom-start" width={230} radius="md" shadow="md">
              <Menu.Target>
                <Button
                  className={classes.modelPill}
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="xs"
                  leftSection={<Command size={13} />}
                  rightSection={<ChevronDown size={13} style={{ color: 'var(--app-muted)' }} />}
                >
                  {modelLabel}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Model</Menu.Label>
                {models.map((m) => (
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
          </Group>

          <Group gap={4} wrap="nowrap">
            <Tooltip label="Dictate" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                radius="xl"
                size="sm"
                aria-label="Dictate"
                style={{ color: 'var(--app-muted)' }}
              >
                <Mic size={16} />
              </ActionIcon>
            </Tooltip>
            <ActionIcon
              className={classes.sendBtn}
              variant="filled"
              color="neutral"
              radius="xl"
              size={30}
              disabled={!canSend}
              aria-label="Send message"
              style={{ boxShadow: 'var(--app-shadow-raised), var(--app-inset-highlight)' }}
            >
              <ArrowUp size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      {helperText != null && (
        <Text variant="meta" className={classes.helper} ta="center" mt={12}>
          {helperText}
        </Text>
      )}
    </Box>
  );
}
