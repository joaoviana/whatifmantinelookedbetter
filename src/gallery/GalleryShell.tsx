import {
  AppShell,
  Box,
  Container,
  NavLink,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { AppHeader } from '../components/AppHeader';
import { sections, groups } from './registry';
import { SectionIntro } from './parts';

export function GalleryShell() {
  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 244, breakpoint: 'sm', collapsed: { mobile: true } }}
      padding={0}
    >
      <AppShell.Header withBorder={false}>
        <AppHeader />
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
