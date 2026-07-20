/* CONTRACT: export function AgentMentionComposer() — "call an agent from anywhere":
   a plain comment box where typing @ opens a caret-anchored picker of gradient-orb
   agent identities; picking one drops an inline, atomic mention chip into the text.
   Self-contained roster — not imported from templates/agentchat. */
import { useRef, useState, type KeyboardEvent, type FormEvent } from 'react';
import { Box, Button, Group, Portal, Stack, Text } from '@mantine/core';
import { Send } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './AgentMentionComposer.module.css';

interface Agent {
  id: string;
  name: string;
  role: string;
  colors: [string, string, string];
}

const AGENTS: Agent[] = [
  { id: 'atlas', name: 'Atlas', role: 'Orchestrator', colors: ['#c7d2fe', '#a5b4fc', '#e0e7ff'] },
  { id: 'vera', name: 'Vera', role: 'Analyst', colors: ['#99f6e4', '#5eead4', '#ccfbf1'] },
  { id: 'kilo', name: 'Kilo', role: 'Analytics Engineer', colors: ['#fde68a', '#fca5a5', '#fee2e2'] },
  { id: 'nadia', name: 'Nadia', role: 'Data QA', colors: ['#f9a8d4', '#f0abfc', '#fce7f3'] },
  { id: 'sol', name: 'Sol', role: 'Planner', colors: ['#bae6fd', '#a5b4fc', '#e0f2fe'] },
];

interface MentionRange {
  node: Text;
  start: number;
}

/** One rendered segment of a posted comment: plain text, or a resolved mention. */
type Segment = { kind: 'text'; value: string } | { kind: 'mention'; agent: Agent };

function parseContent(root: HTMLElement): Segment[] {
  const segments: Segment[] = [];
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.textContent ?? '';
      if (value) segments.push({ kind: 'text', value });
    } else if (node instanceof HTMLElement && node.dataset.agentId) {
      const agent = AGENTS.find((a) => a.id === node.dataset.agentId);
      if (agent) segments.push({ kind: 'mention', agent });
    }
  });
  return segments;
}

export function AgentMentionComposer() {
  const editorRef = useRef<HTMLDivElement>(null);
  const mentionRangeRef = useRef<MentionRange | null>(null);

  const [query, setQuery] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [highlight, setHighlight] = useState(0);
  const [isEmpty, setIsEmpty] = useState(true);
  const [posted, setPosted] = useState<Segment[] | null>(null);

  const matches = query === null ? [] : AGENTS.filter((a) => a.name.toLowerCase().startsWith(query.toLowerCase()));

  function closeDropdown() {
    setQuery(null);
    mentionRangeRef.current = null;
  }

  // Detect an in-progress "@query" right before the caret, in the current text
  // node only — mentions never span across an existing chip.
  function detectTrigger() {
    const editor = editorRef.current;
    const sel = window.getSelection();
    if (!editor || !sel || sel.rangeCount === 0 || !sel.isCollapsed) return closeDropdown();

    const { anchorNode, anchorOffset } = sel;
    if (!anchorNode || anchorNode.nodeType !== Node.TEXT_NODE || !editor.contains(anchorNode)) {
      return closeDropdown();
    }

    const text = anchorNode.textContent ?? '';
    const at = text.lastIndexOf('@', anchorOffset - 1);
    if (at === -1) return closeDropdown();

    const between = text.slice(at + 1, anchorOffset);
    if (/\s/.test(between)) return closeDropdown();

    mentionRangeRef.current = { node: anchorNode as Text, start: at };
    setQuery(between);
    setHighlight(0);

    // Anchor the dropdown under the caret itself, in viewport space — it's
    // portaled to <body> (see render) so it can escape the collection
    // card's `overflow: hidden`, which would otherwise clip it.
    const caretRange = document.createRange();
    caretRange.setStart(anchorNode, anchorOffset);
    caretRange.collapse(true);
    const rect = caretRange.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 6, left: rect.left });
  }

  function handleInput() {
    setIsEmpty(!editorRef.current?.textContent?.trim());
    detectTrigger();
  }

  function insertMention(agent: Agent) {
    const editor = editorRef.current;
    const range = mentionRangeRef.current;
    if (!editor || !range) return;

    const sel = window.getSelection();
    const end = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).endOffset : range.node.length;

    const domRange = document.createRange();
    domRange.setStart(range.node, range.start);
    domRange.setEnd(range.node, Math.max(end, range.start));
    domRange.deleteContents();

    const chip = document.createElement('span');
    chip.contentEditable = 'false';
    chip.className = classes.chip;
    chip.dataset.agentId = agent.id;
    const [c0, c1] = agent.colors;
    chip.innerHTML = `<span class="${classes.chipDot}" style="background:linear-gradient(135deg, ${c0}, ${c1})"></span><span>${agent.name}</span>`;

    const space = document.createTextNode(' ');
    const frag = document.createDocumentFragment();
    frag.appendChild(chip);
    frag.appendChild(space);
    domRange.insertNode(frag);

    // Land the caret right after the trailing space.
    const after = document.createRange();
    after.setStartAfter(space);
    after.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(after);

    editor.focus();
    setIsEmpty(!editor.textContent?.trim());
    closeDropdown();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (query === null || matches.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      insertMention(matches[highlight]);
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  }

  function handlePost(e: FormEvent) {
    e.preventDefault();
    const editor = editorRef.current;
    if (!editor || !editor.textContent?.trim()) return;
    setPosted(parseContent(editor));
    editor.innerHTML = '';
    setIsEmpty(true);
    closeDropdown();
  }

  return (
    <Box className={classes.frame}>
      <Stack gap="md" className={classes.column}>
        <div>
          <Text className="eyebrow" mb={4}>
            Anywhere you can leave a note
          </Text>
          <Text fz={13} c="dimmed">
            Type <code>@</code> to call in an agent — the mention drops in inline, just like tagging a
            teammate.
          </Text>
        </div>

        <form onSubmit={handlePost}>
          <Box className={classes.editorWrap}>
            <div
              ref={editorRef}
              className={classes.editor}
              contentEditable
              suppressContentEditableWarning
              data-empty={isEmpty}
              data-placeholder="Leave a comment… type @ to tag an agent"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onBlur={() => window.setTimeout(closeDropdown, 120)}
              role="textbox"
              aria-multiline="true"
              aria-label="Comment"
            />

            {query !== null && matches.length > 0 && (
              <Portal>
                <div className={classes.dropdown} style={{ top: dropdownPos.top, left: dropdownPos.left }}>
                  {matches.map((agent, index) => (
                    <button
                      type="button"
                      key={agent.id}
                      className={classes.option}
                      data-active={index === highlight}
                      onMouseEnter={() => setHighlight(index)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertMention(agent);
                      }}
                    >
                      <GradientMark size={22} colors={agent.colors} seed={agent.id} />
                      <span className={classes.optionText}>
                        <span className={classes.optionName}>{agent.name}</span>
                        <span className={classes.optionRole}>{agent.role}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Portal>
            )}
          </Box>

          <Group justify="flex-end" mt={8}>
            <Button type="submit" size="xs" leftSection={<Send size={13} strokeWidth={2.25} />}>
              Post
            </Button>
          </Group>
        </form>

        {posted && (
          <Box className={classes.posted}>
            <Group gap={8} mb={6} align="center">
              <Box className={classes.userAvatar}>MC</Box>
              <Text fz={13} fw={600}>
                You
              </Text>
              <Text fz={12} c="dimmed">
                just now
              </Text>
            </Group>
            <Text fz={14} lh={1.6} className={classes.postedBody}>
              {posted.map((seg, i) =>
                seg.kind === 'text' ? (
                  <span key={i}>{seg.value}</span>
                ) : (
                  <span key={i} className={classes.postedMention}>
                    <GradientMark size={16} colors={seg.agent.colors} seed={seg.agent.id} />
                    {seg.agent.name}
                  </span>
                ),
              )}
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
