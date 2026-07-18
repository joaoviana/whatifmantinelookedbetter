/* CONTRACT: export function SourceCitations() — citation chips revealing with a
   stagger; hovering a chip pops a source-preview card (HoverCard) with a scale-in. */
import { Fragment, type CSSProperties, useState } from 'react';
import { Box, Button, Group, HoverCard, Stack, Text } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { ChevronDown } from 'lucide-react';
import { GradientMark } from '../../components/GradientMark';
import classes from './SourceCitations.module.css';

type Source = {
  id: number;
  title: string;
  domain: string;
  favicon: string;
  snippet: string;
};

/* Fictional, believable sources — no real personal data. */
const SOURCES: Source[] = [
  {
    id: 1,
    title: 'The economics of retrieval-augmented generation',
    domain: 'northwind-labs.ai',
    favicon: 'NL',
    snippet:
      'Grounding responses in a curated index cuts hallucination rates while keeping inference cost roughly flat versus a larger base model.',
  },
  {
    id: 2,
    title: 'Latency budgets for real-time answer synthesis',
    domain: 'signalfoundry.dev',
    favicon: 'SF',
    snippet:
      'Streaming the first token under 300ms is the threshold where users perceive an assistant as instant rather than thinking.',
  },
  {
    id: 3,
    title: 'Citation-first UX patterns for AI answers',
    domain: 'wavelength.design',
    favicon: 'WD',
    snippet:
      'Inline markers linked to a visible source list raise trust measurably — people verify roughly 3x more often when sources are one glance away.',
  },
];

/* The answer, authored as segments so numbered markers sit inline mid-sentence
   and stay linked to the matching source below. */
const ANSWER: Array<string | number> = [
  'Retrieval-augmented answers stay grounded by pulling from a curated index at query time',
  1,
  ', which holds hallucination down without inflating inference cost',
  1,
  '. To feel instant, the system streams its first token in well under a third of a second',
  2,
  '. Surfacing sources inline — a small marker beside each claim, linked to a visible list — is what turns a plausible paragraph into one people actually trust',
  3,
  '.',
];

export function SourceCitations() {
  const reducedMotion = useReducedMotion();
  // Reduced motion → sources present immediately; otherwise gated behind a toggle.
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const sourcesById = new Map(SOURCES.map((s) => [s.id, s]));
  const revealed = reducedMotion || shown;

  const renderMarker = (id: number) => {
    const source = sourcesById.get(id);
    if (!source) return null;
    return (
      <HoverCard
        key={`m-${id}`}
        width={264}
        shadow="md"
        radius="md"
        openDelay={80}
        closeDelay={60}
        withArrow
        position="top"
        transitionProps={{ transition: 'pop', duration: 160 }}
      >
        <HoverCard.Target>
          <sup
            className={classes.marker}
            tabIndex={0}
            role="button"
            aria-label={`Citation ${id}: ${source.title}`}
            data-linked={active === id || undefined}
            onMouseEnter={() => setActive(id)}
            onMouseLeave={() => setActive((cur) => (cur === id ? null : cur))}
            onFocus={() => setActive(id)}
            onBlur={() => setActive((cur) => (cur === id ? null : cur))}
          >
            {id}
          </sup>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <SourcePreview source={source} />
        </HoverCard.Dropdown>
      </HoverCard>
    );
  };

  return (
    <div className={classes.wrap}>
      <Box className={classes.panel}>
        <div className={classes.eyebrowRow}>
          <GradientMark size={14} />
          <span className="eyebrow">Answer</span>
        </div>

        <p className={classes.answer}>
          {ANSWER.map((seg, i) =>
            typeof seg === 'number' ? (
              renderMarker(seg)
            ) : (
              <Fragment key={`t-${i}`}>{seg}</Fragment>
            ),
          )}
        </p>

        <div className={classes.sourcesHead}>
          <span className="eyebrow">Sources · {SOURCES.length}</span>
          {!reducedMotion && (
            <Button
              size="compact-sm"
              variant="subtle"
              color="gray"
              rightSection={
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  style={{
                    transition: 'transform 200ms ease',
                    transform: shown ? 'rotate(180deg)' : 'none',
                  }}
                />
              }
              onClick={() => setShown((v) => !v)}
            >
              {shown ? 'Hide sources' : 'Show sources'}
            </Button>
          )}
        </div>

        {revealed && (
          <div className={classes.sourcesGrid}>
            {SOURCES.map((source, i) => (
              <HoverCard
                key={source.id}
                width={264}
                shadow="md"
                radius="md"
                openDelay={80}
                closeDelay={60}
                withArrow
                position="top"
                transitionProps={{ transition: 'pop', duration: 160 }}
              >
                <HoverCard.Target>
                  <button
                    type="button"
                    className={`${classes.chip} ${reducedMotion ? '' : classes.chipReveal}`}
                    style={{ '--i': i } as CSSProperties}
                    data-linked={active === source.id || undefined}
                    onMouseEnter={() => setActive(source.id)}
                    onMouseLeave={() => setActive((cur) => (cur === source.id ? null : cur))}
                    onFocus={() => setActive(source.id)}
                    onBlur={() => setActive((cur) => (cur === source.id ? null : cur))}
                  >
                    <span className={classes.chipIndex}>{source.id}</span>
                    <span className={classes.favicon} aria-hidden>
                      {source.favicon}
                    </span>
                    <span className={classes.chipBody}>
                      <span className={classes.chipTitle}>{source.title}</span>
                      <span className={classes.chipDomain}>{source.domain}</span>
                    </span>
                  </button>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <SourcePreview source={source} />
                </HoverCard.Dropdown>
              </HoverCard>
            ))}
          </div>
        )}
      </Box>
    </div>
  );
}

function SourcePreview({ source }: { source: Source }) {
  return (
    <Stack gap={8}>
      <Group gap={9} className={classes.previewHead} wrap="nowrap">
        <span className={classes.favicon} aria-hidden>
          {source.favicon}
        </span>
        <Text fw={600} fz={13} lh={1.3} style={{ letterSpacing: '-0.006em' }}>
          {source.title}
        </Text>
      </Group>
      <Text className={classes.previewSnippet}>{source.snippet}</Text>
      <Text fz={11.5} c="dimmed" ff="var(--mantine-font-family-monospace)">
        {source.domain}
      </Text>
    </Stack>
  );
}
