/* CONTRACT: export function SelectionSpark() — select any word in the passage
   and a small gradient-orb toolbar sparks up right above it, offering
   quick AI actions scoped to exactly what was selected. */
import { useEffect, useRef, useState } from 'react';
import { Box, Portal, Text } from '@mantine/core';
import { Lightbulb, PenLine, MessageCircleQuestion } from 'lucide-react';
import classes from './SelectionSpark.module.css';

const PASSAGE =
  'The migration moves write traffic to the new event bus before the read path changes, ' +
  'so a rollback never has to reconcile two sources of truth. Latency stays flat because ' +
  'the bus batches acknowledgements instead of confirming every message individually.';

type ActionKey = 'explain' | 'rewrite' | 'ask';

const ACTIONS: { key: ActionKey; label: string; icon: typeof Lightbulb }[] = [
  { key: 'explain', label: 'Explain', icon: Lightbulb },
  { key: 'rewrite', label: 'Rewrite', icon: PenLine },
  { key: 'ask', label: 'Ask about this', icon: MessageCircleQuestion },
];

const RESULTS: Record<ActionKey, (text: string) => string> = {
  explain: (t) => `In short: ${t.length > 40 ? 'this describes a write-then-read ordering that keeps rollback safe.' : `"${t}" refers to the order writes and reads settle in.`}`,
  rewrite: () => 'Writes land on the new bus first; reads only move once that\'s proven safe — so undoing it never means untangling two sources of truth.',
  ask: () => 'Good question — the bus batches acks instead of confirming per-message, which is what keeps latency flat under load.',
};

export function SelectionSpark() {
  const passageRef = useRef<HTMLParagraphElement>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [result, setResult] = useState<{ action: ActionKey; text: string; source: string } | null>(null);

  useEffect(() => {
    function onSelectionChange() {
      const sel = window.getSelection();
      const passage = passageRef.current;
      if (!sel || sel.isCollapsed || !passage) return setToolbarPos(null);

      const text = sel.toString().trim();
      if (!text) return setToolbarPos(null);

      const anchor = sel.anchorNode;
      const focus = sel.focusNode;
      if (!anchor || !focus || !passage.contains(anchor) || !passage.contains(focus)) {
        return setToolbarPos(null);
      }

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return setToolbarPos(null);

      setSelectedText(text);
      setResult(null);
      setToolbarPos({ top: rect.top - 10, left: rect.left + rect.width / 2 });
    }

    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);

  function runAction(action: ActionKey) {
    setResult({ action, text: RESULTS[action](selectedText), source: selectedText });
    setToolbarPos(null);
    window.getSelection()?.removeAllRanges();
  }

  return (
    <Box className={classes.frame}>
      <div className={classes.column}>
        <Text className="eyebrow" mb={6}>
          Select any part of this
        </Text>
        <Text ref={passageRef} className={classes.passage} component="p">
          {PASSAGE}
        </Text>

        {toolbarPos && (
          <Portal>
            <div
              className={classes.toolbar}
              style={{ top: toolbarPos.top, left: toolbarPos.left }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {ACTIONS.map(({ key, label, icon: Icon }) => (
                <button key={key} type="button" className={classes.action} onClick={() => runAction(key)}>
                  <Icon size={13} strokeWidth={2} />
                  {label}
                </button>
              ))}
              <span className={classes.toolbarTail} aria-hidden />
            </div>
          </Portal>
        )}

        {result && (
          <div className={classes.result}>
            <div className={classes.resultHead}>
              <span className={classes.resultOrb} aria-hidden />
              <Text fz={12} c="dimmed">
                {ACTIONS.find((a) => a.key === result.action)?.label} · “{result.source.slice(0, 36)}
                {result.source.length > 36 ? '…' : ''}”
              </Text>
            </div>
            <Text fz={13.5} lh={1.55} className={classes.resultBody}>
              {result.text}
            </Text>
          </div>
        )}
      </div>
    </Box>
  );
}
