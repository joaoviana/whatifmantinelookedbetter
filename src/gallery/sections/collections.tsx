import { Box, Stack, Text } from '@mantine/core';
import { COLLECTIONS } from '../collections/registry';

export const meta = {
  id: 'collections',
  label: 'Collections',
  description: 'Real-world blocks composed from the themed components — copy-ready patterns.',
};

export function Section() {
  return (
    <Stack gap={44}>
      {COLLECTIONS.map(({ id, title, description, Component }) => (
        <Box key={id} id={`collection-${id}`} style={{ scrollMarginTop: 80 }}>
          <Stack gap={2} mb="sm">
            <Text fw={600} fz={16} lts="-0.01em">
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
              overflow: 'hidden',
            }}
          >
            <Component />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
