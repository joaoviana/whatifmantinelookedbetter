import type { ReactNode } from 'react';
import { ActionIcon, Group, Text, useMantineColorScheme } from '@mantine/core';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GradientMark } from './GradientMark';

/**
 * AppHeader — the single shared top bar used on every top-level page.
 * A 56px monochrome bar: brand on the left, page actions + color-scheme
 * toggle on the right. Themed via tokens, works in light and dark.
 */
export function AppHeader({
  leftSection,
  children,
}: {
  leftSection?: ReactNode;
  children?: ReactNode;
}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Group
      h={56}
      px="md"
      justify="space-between"
      wrap="nowrap"
      style={{
        flexShrink: 0,
        borderBottom: '1px solid var(--app-border)',
        backdropFilter: 'blur(8px)',
        background: 'color-mix(in srgb, var(--app-bg) 82%, transparent)',
      }}
    >
      <Group gap="xs" wrap="nowrap">
        {leftSection}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
          }}
        >
          <GradientMark size={24} />
          <Text fw={600} fz={14} visibleFrom="xs">
            whatifmantinelookedbetter
          </Text>
        </Link>
      </Group>

      <Group gap={6} wrap="nowrap">
        {children}
        <ActionIcon
          variant="default"
          size="lg"
          onClick={toggleColorScheme}
          aria-label="Toggle color scheme"
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
