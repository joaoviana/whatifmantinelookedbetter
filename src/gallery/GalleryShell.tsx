import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Container,
  Group,
  Kbd,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { Bell, Moon, Search, Sun } from 'lucide-react';
import { sections, groups } from './registry';
import { SectionIntro } from './parts';

function HeaderBar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <Group h="100%" px="lg" justify="space-between">
      <ThemeIcon size={30} radius="md" variant="filled" color="neutral">
        <Text fw={700} fz={14} ff="var(--mantine-font-family-monospace)">M</Text>
      </ThemeIcon>
      <Group gap="xs">
        <Button visibleFrom="sm" variant="default" size="xs" leftSection={<Search size={14} />} rightSection={<Kbd size="xs">⌘K</Kbd>}>
          Search
        </Button>
        <ActionIcon variant="default" size="lg" aria-label="Notifications"><Bell size={17} /></ActionIcon>
        <ActionIcon variant="default" size="lg" onClick={toggleColorScheme} aria-label="Toggle color scheme">
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}

export function GalleryShell() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 244, breakpoint: 'sm', collapsed: { mobile: true } }}
      padding={0}
    >
      <AppShell.Header
        style={{ backdropFilter: 'blur(8px)', background: 'color-mix(in srgb, var(--app-bg) 82%, transparent)' }}
      >
        <HeaderBar />
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ background: 'transparent' }}>
        <ScrollArea type="hover">
          <Stack gap="lg">
            {groups.map((g) => (
              <Stack key={g.label} gap={2}>
                <Text className="eyebrow" mb={4} px="sm">
                  {g.label}
                </Text>
                {g.sections.map((s) => (
                  <NavLink
                    key={s.meta.id}
                    label={s.meta.label}
                    href={`#${s.meta.id}`}
                    styles={{ root: { borderRadius: 'var(--mantine-radius-md)' } }}
                  />
                ))}
              </Stack>
            ))}
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size={980} px="xl" pb={96} pt={48}>
          <Stack gap={72}>
            {sections.map(({ meta, Section }) => (
              <Box key={meta.id} id={meta.id} style={{ scrollMarginTop: 80 }}>
                <SectionIntro label={`§ ${meta.label}`} title={meta.label} description={meta.description} />
                <Section />
              </Box>
            ))}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
