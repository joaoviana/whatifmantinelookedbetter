import { Box, Stack, Text } from '@mantine/core';
import type { Collection } from '../collections/registry';

/** Shared renderer for a list of curated collection blocks. */
export function CollectionsList({ items }: { items: Collection[] }) {
  return (
    <Stack gap={44}>
      {items.map(({ id, title, description, Component }) => (
        <Box key={id} id={`collection-${id}`} style={{ scrollMarginTop: 80 }}>
          <Stack gap={2} mb="sm">
            <Text fw={600} lts="-0.01em" style={{ fontSize: 'clamp(15px, 4vw, 16px)' }}>
              {title}
            </Text>
            <Text c="dimmed" fz="sm">
              {description}
            </Text>
          </Stack>
          <Box
            style={{
              border: '1px solid var(--app-border)',
              borderRadius: 'var(--mantine-radius-lg)',
              background: 'var(--app-bg)',
              // clip + min-width:0 keep wide inner blocks from forcing page-level
              // horizontal scroll on narrow (~360px) screens.
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            <Component />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
