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
        <Text className="eyebrow">{name}</Text>
        {hint && (
          <Text fz={11} c="dimmed">
            {hint}
          </Text>
        )}
      </Group>
      <Box
        px="md"
        py="lg"
        style={{ minHeight: minH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {children}
      </Box>
    </Box>
  );
}

/** Responsive grid the Specimens sit in. Uses raw CSS grid so `span` works. */
export function SpecimenGrid({ children, min = 260 }: { children: ReactNode; min?: number }) {
  return (
    <Box style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 14 }}>
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
      <Text className="eyebrow">{label}</Text>
      <Text fz={22} fw={600} lts="-0.02em">
        {title}
      </Text>
      <Text c="dimmed" fz="sm" maw={620}>
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
