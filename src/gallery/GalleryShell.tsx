import {
  AppShell,
  Box,
  Burger,
  Container,
  NavLink,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppHeader } from '../components/AppHeader';
import type { GalleryRegistry } from './registry';
import { SectionIntro } from './parts';

export function GalleryShell({ registry }: { registry: GalleryRegistry }) {
  const { groups, sections } = registry;
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 244, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={0}
    >
      <AppShell.Header withBorder={false}>
        <AppHeader
          leftSection={
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
          }
        />
      </AppShell.Header>

      {/* Opaque body colour: seamless beside content on desktop, and a solid
          surface (not see-through) when it slides over content as a mobile overlay. */}
      <AppShell.Navbar p="md" style={{ background: 'var(--mantine-color-body)' }}>
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
                    onClick={close}
                    styles={{ root: { borderRadius: 'var(--mantine-radius-md)' } }}
                  />
                ))}
              </Stack>
            ))}
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size={980} px={{ base: 'md', sm: 'xl' }} pb={96} pt={{ base: 28, sm: 48 }}>
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
