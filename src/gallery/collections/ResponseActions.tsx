/* CONTRACT: export function ResponseActions() — the action bar under an AI reply:
   copy (icon morph copy→check + "Copied"), thumbs up/down (pop), regenerate (spin), share. */
import { useState } from 'react';
import { ActionIcon, Box, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import {
  Check,
  Copy,
  RotateCw,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './ResponseActions.module.css';

const REPLY_TEXT = `Migrating to the new pipeline should be low-risk. Your ingest jobs already write to the staging table, so you can run both writers in parallel for a release, compare row counts, then cut over once they match.

If anything drifts, the old path stays intact — nothing here is destructive.`;

const [REPLY_LEAD, REPLY_TAIL] = REPLY_TEXT.split('\n\n');

type Rating = 'up' | 'down' | null;

export function ResponseActions() {
  const clipboard = useClipboard({ timeout: 1600 });
  const [rating, setRating] = useState<Rating>(null);
  const [pulse, setPulse] = useState<Rating>(null);
  const [spins, setSpins] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  // Thumbs are mutually exclusive; each click also fires a one-shot pop.
  function rate(value: Exclude<Rating, null>) {
    setRating((current) => (current === value ? null : value));
    setPulse(value);
    window.setTimeout(() => setPulse(null), 380);
  }

  return (
    <Box className={classes.wrap}>
      <Box className={classes.reply}>
        {/* Assistant identity */}
        <Box className={classes.head}>
          <GradientMark size={26} />
          <span className={classes.who}>Assistant</span>
          <span className={classes.dot}>·</span>
          <span className={classes.meta}>just now</span>
        </Box>

        {/* The reply copy */}
        <Box className={classes.body}>
          <p>{REPLY_LEAD}</p>
          <p>{REPLY_TAIL}</p>
        </Box>

        {/* Action bar */}
        <Box className={classes.bar}>
          {/* Copy — morphs copy → check with a floating "Copied" tag. */}
          <span className={classes.copyWrap}>
            <Tooltip label="Copy" withArrow openDelay={200} fz="xs">
              <ActionIcon
                className={classes.btn}
                variant="subtle"
                size="lg"
                radius="md"
                aria-label="Copy response"
                onClick={() => clipboard.copy(REPLY_TEXT)}
              >
                <span className={classes.swap} data-copied={clipboard.copied}>
                  <span className={classes.copyIcon}>
                    <Copy size={16} strokeWidth={1.75} />
                  </span>
                  <span className={classes.checkIcon}>
                    <Check size={16} strokeWidth={2.25} />
                  </span>
                </span>
              </ActionIcon>
            </Tooltip>
            <span className={classes.copiedTag} data-show={clipboard.copied} aria-hidden>
              Copied
            </span>
          </span>

          <span className={classes.divider} />

          {/* Thumbs up — pops on click, locks into a tinted, filled state. */}
          <Tooltip label="Good response" withArrow openDelay={200} fz="xs">
            <ActionIcon
              className={`${classes.btn}${rating === 'up' ? ` ${classes.selected}` : ''}`}
              variant="subtle"
              size="lg"
              radius="md"
              aria-label="Good response"
              aria-pressed={rating === 'up'}
              onClick={() => rate('up')}
            >
              <span className={classes.pop} data-pop={pulse === 'up'}>
                <ThumbsUp size={16} strokeWidth={1.75} fill={rating === 'up' ? 'currentColor' : 'none'} />
              </span>
            </ActionIcon>
          </Tooltip>

          {/* Thumbs down — same behaviour, mutually exclusive with up. */}
          <Tooltip label="Bad response" withArrow openDelay={200} fz="xs">
            <ActionIcon
              className={`${classes.btn}${rating === 'down' ? ` ${classes.selected}` : ''}`}
              variant="subtle"
              size="lg"
              radius="md"
              aria-label="Bad response"
              aria-pressed={rating === 'down'}
              onClick={() => rate('down')}
            >
              <span className={classes.pop} data-pop={pulse === 'down'}>
                <ThumbsDown size={16} strokeWidth={1.75} fill={rating === 'down' ? 'currentColor' : 'none'} />
              </span>
            </ActionIcon>
          </Tooltip>

          <span className={classes.divider} />

          {/* Regenerate — spins a full turn on each click. */}
          <Tooltip label="Regenerate" withArrow openDelay={200} fz="xs">
            <ActionIcon
              className={classes.btn}
              variant="subtle"
              size="lg"
              radius="md"
              aria-label="Regenerate response"
              onClick={() => setSpins((s) => s + 1)}
            >
              <span className={classes.spin} style={{ transform: `rotate(${spins * 360}deg)` }}>
                <RotateCw size={16} strokeWidth={1.75} />
              </span>
            </ActionIcon>
          </Tooltip>

          {/* Read aloud — toggles a tinted "speaking" state. */}
          <Tooltip label={speaking ? 'Stop reading' : 'Read aloud'} withArrow openDelay={200} fz="xs">
            <ActionIcon
              className={`${classes.btn}${speaking ? ` ${classes.selected}` : ''}`}
              variant="subtle"
              size="lg"
              radius="md"
              aria-label={speaking ? 'Stop reading aloud' : 'Read aloud'}
              aria-pressed={speaking}
              onClick={() => setSpeaking((s) => !s)}
            >
              <Volume2 size={16} strokeWidth={1.75} />
            </ActionIcon>
          </Tooltip>

          {/* Share */}
          <Tooltip label="Share" withArrow openDelay={200} fz="xs">
            <ActionIcon
              className={classes.btn}
              variant="subtle"
              size="lg"
              radius="md"
              aria-label="Share response"
            >
              <Share2 size={16} strokeWidth={1.75} />
            </ActionIcon>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
