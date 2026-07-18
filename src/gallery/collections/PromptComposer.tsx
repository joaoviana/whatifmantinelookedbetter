/* CONTRACT: export function PromptComposer() — a premium AI composer: animated send
   button, a slash-command menu that springs open, and an attachment-chip add animation. */
import { useMemo, useRef, useState } from 'react';
import { ActionIcon, Box, Group, Menu, Text, Textarea } from '@mantine/core';
import {
  ArrowUp,
  Check,
  ChevronDown,
  Code2,
  Command,
  FileText,
  Image as ImageIcon,
  Languages,
  List,
  Mic,
  PenLine,
  Plus,
  Quote,
  X,
  type LucideIcon,
} from 'lucide-react';
import classes from './PromptComposer.module.css';

interface SlashCommand {
  cmd: string;
  desc: string;
  icon: LucideIcon;
  insert: string;
}

const SLASH_COMMANDS: SlashCommand[] = [
  { cmd: 'summarize', desc: 'Condense the thread into key points', icon: List, insert: 'Summarize this in five bullet points' },
  { cmd: 'rewrite', desc: 'Refine the tone and clarity', icon: PenLine, insert: 'Rewrite this to be warmer and clearer' },
  { cmd: 'translate', desc: 'Convert between languages', icon: Languages, insert: 'Translate the following into French' },
  { cmd: 'image', desc: 'Generate an illustration', icon: ImageIcon, insert: 'Generate an image of ' },
  { cmd: 'code', desc: 'Write or explain a snippet', icon: Code2, insert: 'Write a function that ' },
  { cmd: 'cite', desc: 'Add supporting sources', icon: Quote, insert: 'Find three sources that back ' },
];

interface Model {
  id: string;
  name: string;
  detail: string;
}

const MODELS: Model[] = [
  { id: 'atlas-pro', name: 'Atlas Pro', detail: 'Deepest reasoning' },
  { id: 'atlas-flash', name: 'Atlas Flash', detail: 'Fast, everyday tasks' },
  { id: 'atlas-nano', name: 'Atlas Nano', detail: 'Lightweight & cheap' },
];

interface Attachment {
  id: number;
  name: string;
  size: string;
}

const SAMPLE_FILES: Omit<Attachment, 'id'>[] = [
  { name: 'research-brief.pdf', size: '2.4 MB' },
  { name: 'q3-dashboard.png', size: '840 KB' },
  { name: 'meeting-notes.md', size: '12 KB' },
  { name: 'signups.csv', size: '156 KB' },
];

export function PromptComposer() {
  const [value, setValue] = useState('');
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [modelOpen, setModelOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [slashActive, setSlashActive] = useState(0);
  const nextId = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeModel = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const hasContent = value.trim().length > 0 || attachments.length > 0;

  // Detect a trailing "/command" token — this is what opens the slash menu.
  const slash = useMemo(() => value.match(/(^|\s)\/(\w*)$/), [value]);
  const slashResults = useMemo(() => {
    if (!slash) return [];
    const q = slash[2].toLowerCase();
    return SLASH_COMMANDS.filter((c) => c.cmd.startsWith(q));
  }, [slash]);
  const slashOpen = slash !== null && slashResults.length > 0;

  const applyCommand = (command: SlashCommand) => {
    // Replace the trailing "/token" (keeping any leading space) with the insert.
    const next = value.replace(/(^|\s)\/(\w*)$/, (_full, lead: string) => `${lead}${command.insert}`);
    setValue(next);
    setSlashActive(0);
    textareaRef.current?.focus();
  };

  const addAttachment = () => {
    const file = SAMPLE_FILES[attachments.length % SAMPLE_FILES.length];
    setAttachments((prev) => [...prev, { id: nextId.current++, ...file }]);
  };

  const removeAttachment = (id: number) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const send = () => {
    if (!hasContent) return;
    setValue('');
    setAttachments([]);
    setSlashActive(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (slashOpen) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSlashActive((i) => (i + 1) % slashResults.length);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSlashActive((i) => (i - 1 + slashResults.length) % slashResults.length);
        return;
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        applyCommand(slashResults[Math.min(slashActive, slashResults.length - 1)]);
        return;
      }
      if (event.key === 'Escape') {
        // Drop the trailing "/" so the menu closes without losing the message.
        setValue((v) => v.replace(/(^|\s)\/(\w*)$/, '$1'));
        return;
      }
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <Box style={{ display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
      <Box w="100%" maw={640}>
        <Box
          className={classes.shell}
          style={{
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            borderRadius: 22,
            boxShadow: 'var(--mantine-shadow-sm)',
            padding: '6px 6px 8px',
          }}
        >
          {/* Slash-command menu — springs in when a trailing "/token" is typed. */}
          {slashOpen && (
            <Box className={classes.slashMenu} role="listbox" aria-label="Slash commands">
              <Text className={`${classes.slashHint} eyebrow`}>Commands</Text>
              {slashResults.map((command, index) => {
                const Icon = command.icon;
                const isActive = index === Math.min(slashActive, slashResults.length - 1);
                return (
                  <button
                    key={command.cmd}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={isActive ? `${classes.slashItem} ${classes.slashItemActive}` : classes.slashItem}
                    onMouseEnter={() => setSlashActive(index)}
                    onMouseDown={(e) => {
                      // Keep focus in the textarea through the click.
                      e.preventDefault();
                      applyCommand(command);
                    }}
                  >
                    <span className={classes.slashIcon}>
                      <Icon size={16} strokeWidth={1.75} />
                    </span>
                    <span>
                      <Text className={classes.slashName}>/{command.cmd}</Text>
                      <Text className={classes.slashDesc}>{command.desc}</Text>
                    </span>
                  </button>
                );
              })}
            </Box>
          )}

          {/* Attachment chips — each pops in on mount, removable. */}
          {attachments.length > 0 && (
            <Group gap={7} px={8} pt={8} pb={2}>
              {attachments.map((att) => (
                <span key={att.id} className={classes.chip}>
                  <span className={classes.chipIcon}>
                    <FileText size={13} strokeWidth={1.75} />
                  </span>
                  <span className={classes.chipName}>{att.name}</span>
                  <span className={classes.chipSize}>{att.size}</span>
                  <button
                    type="button"
                    className={classes.chipRemove}
                    aria-label={`Remove ${att.name}`}
                    onClick={() => removeAttachment(att.id)}
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                </span>
              ))}
            </Group>
          )}

          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
            variant="unstyled"
            autosize
            minRows={2}
            maxRows={8}
            placeholder="Send a message…  (@ to mention, / for commands)"
            aria-label="Send a message"
            styles={{
              input: {
                fontSize: 'var(--mantine-font-size-md)',
                lineHeight: 1.5,
                paddingInline: 10,
                paddingBlock: 8,
                color: 'var(--mantine-color-text)',
              },
            }}
          />

          {/* Bottom control row: attach + model pill (Menu), then send. */}
          <Group justify="space-between" align="center" px={6} pt={2}>
            <Group gap={6}>
              <ActionIcon
                variant="subtle"
                color="gray"
                radius="xl"
                size={30}
                aria-label="Attach a file"
                onClick={addAttachment}
                styles={{ root: { color: 'var(--app-muted)' } }}
              >
                <Plus size={18} strokeWidth={1.75} />
              </ActionIcon>

              <Menu
                position="bottom-start"
                offset={8}
                width={220}
                radius="md"
                opened={modelOpen}
                onChange={setModelOpen}
                withArrow={false}
              >
                <Menu.Target>
                  <button
                    type="button"
                    className={modelOpen ? `${classes.modelPill} ${classes.modelPillOpen}` : classes.modelPill}
                    aria-label={`Model: ${activeModel.name}`}
                  >
                    <span className={classes.modelGlyph}>
                      <Command size={13} strokeWidth={1.75} />
                    </span>
                    {activeModel.name}
                    <span className={classes.modelChevron}>
                      <ChevronDown size={13} strokeWidth={2} />
                    </span>
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Model</Menu.Label>
                  {MODELS.map((model) => (
                    <Menu.Item
                      key={model.id}
                      onClick={() => setModelId(model.id)}
                      rightSection={
                        model.id === modelId ? <Check size={15} strokeWidth={2.25} /> : null
                      }
                    >
                      <Text fz="sm" fw={500} lh={1.2}>
                        {model.name}
                      </Text>
                      <Text fz="xs" c="dimmed" lh={1.2}>
                        {model.detail}
                      </Text>
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>

            <Group gap={6}>
              <ActionIcon
                variant="subtle"
                color="gray"
                radius="xl"
                size={30}
                aria-label="Dictate"
                styles={{ root: { color: 'var(--app-muted)' } }}
              >
                <Mic size={17} strokeWidth={1.75} />
              </ActionIcon>

              <ActionIcon
                variant="filled"
                color="neutral"
                radius="xl"
                size={34}
                disabled={!hasContent}
                onClick={send}
                aria-label="Send message"
                className={hasContent ? classes.sendActive : undefined}
                styles={{ root: { opacity: hasContent ? 1 : 0.4 } }}
              >
                <ArrowUp size={18} strokeWidth={2.25} className={classes.sendArrow} />
              </ActionIcon>
            </Group>
          </Group>
        </Box>

        <Text ta="center" fz="xs" c="dimmed" mt={12}>
          Atlas can make mistakes. Press{' '}
          <Text span fz="xs" fw={600} c="var(--mantine-color-text)">
            Enter
          </Text>{' '}
          to send,{' '}
          <Text span fz="xs" fw={600} c="var(--mantine-color-text)">
            Shift + Enter
          </Text>{' '}
          for a new line.
        </Text>
      </Box>
    </Box>
  );
}
