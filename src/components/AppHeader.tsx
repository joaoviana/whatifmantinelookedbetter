import type { ReactNode } from 'react';
import { ActionIcon, Box, Group, useMantineColorScheme } from '@mantine/core';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GradientMark } from './GradientMark';
import { SiteNav } from './SiteNav';
import classes from './AppHeader.module.css';

/**
 * AppHeader — the single shared top bar used on every top-level page.
 * A 56px monochrome bar: brand mark + the site's top-level nav on the left
 * (nav collapses into each page's own mobile burger drawer below `sm`),
 * page actions + color-scheme toggle on the right. Themed via tokens, works
 * in light and dark.
 */
export function AppHeader({
  leftSection,
  children,
}: {
  leftSection?: ReactNode;
  children?: ReactNode;
}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
      <Group gap="md" wrap="nowrap">
        {leftSection}
        <Link
          to="/patterns"
          aria-label="whatifmantinelookedbetter home"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <GradientMark size={24} />
        </Link>
        <Box visibleFrom="sm">
          <SiteNav variant="inline" />
        </Box>
      </Group>

      <Group gap={6} wrap="nowrap">
        {children}
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          radius="md"
          onClick={toggleColorScheme}
          aria-label="Toggle color scheme"
          className={classes.themeToggle}
          data-scheme={colorScheme}
        >
          <span className={`${classes.themeIcon} ${classes.themeIconSun}`}>
            <Sun size={16} strokeWidth={1.75} />
          </span>
          <span className={`${classes.themeIcon} ${classes.themeIconMoon}`}>
            <Moon size={16} strokeWidth={1.75} />
          </span>
        </ActionIcon>
      </Group>
    </Group>
  );
}
