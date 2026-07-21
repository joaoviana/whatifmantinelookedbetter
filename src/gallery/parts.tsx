import type { ReactNode } from 'react';
import { Box, Group, Stack, Text, SimpleGrid } from '@mantine/core';

/**
 * Shared display primitives for the component gallery.
 * Every component demo is wrapped in a <Specimen> so the whole
 * gallery reads as one system. Agents: compose these, don't restyle them.
 */

/** One labeled panel showing a single component (or a small variant set). */
export function Specimen({
  name,
  hint,
  children,
  minH = 96,
  span = 1,
}: {
  name: string;
  hint?: string;
  children: ReactNode;
  minH?: number;
  span?: number;
}) {
  return (
    <Box
      style={{
        gridColumn: `span ${span}`,
        border: '1px solid var(--app-border)',
        borderRadius: 'var(--mantine-radius-lg)',
        background: 'var(--app-surface)',
        overflow: 'hidden',
      }}
    >
      <Group justify="space-between" px="md" py={8} style={{ borderBottom: '1px solid var(--app-border)' }}>
        <Text variant="eyebrow">{name}</Text>
        {hint && (
          <Text fz={11} c="dimmed">
            {hint}
          </Text>
        )}
      </Group>
      <Box
        style={{
          minHeight: minH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Padding eases off on phones so specimens don't feel cramped at ~360px.
          padding: 'clamp(14px, 4vw, var(--mantine-spacing-lg)) clamp(12px, 3vw, var(--mantine-spacing-md))',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/** Responsive grid the Specimens sit in. Uses raw CSS grid so `span` works. */
export function SpecimenGrid({ children, min = 260 }: { children: ReactNode; min?: number }) {
  return (
    <Box
      style={{
        display: 'grid',
        // min(100%, …) lets the min track collapse below its px floor so a single
        // column shows cleanly on phones instead of overflowing horizontally.
        gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`,
        gap: 14,
      }}
    >
      {children}
    </Box>
  );
}

/** Simple two-up grid for when you don't need auto-fill. */
export function TwoUp({ children }: { children: ReactNode }) {
  return <SimpleGrid cols={{ base: 1, md: 2 }} spacing={14}>{children}</SimpleGrid>;
}

/** The heading that opens each section. */
export function SectionIntro({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <Stack gap={4} mb="lg">
      <Text variant="eyebrow">{label}</Text>
      <Text fw={600} lts="-0.02em" style={{ fontSize: 'clamp(18px, 5vw, 22px)' }}>
        {title}
      </Text>
      <Text variant="secondary" maw={620}>
        {description}
      </Text>
    </Stack>
  );
}

/** A horizontal row for variant swatches inside a Specimen. */
export function Row({ children }: { children: ReactNode }) {
  return (
    <Group gap="sm" justify="center" wrap="wrap">
      {children}
    </Group>
  );
}
