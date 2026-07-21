/* CONTRACT: export function EmptyState() — a composed block from the themed components.
   Polished empty states: icon, heading, description, primary + secondary CTA. */
import { Button, Card, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { CheckCheck, FolderPlus, Plus, SearchX, Upload } from 'lucide-react';
import classes from './EmptyState.module.css';

export function EmptyState() {
  return (
    <div className={classes.wrap}>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" verticalSpacing="lg">
        {/* (1) No projects yet — dashed-ring medallion + dual CTA. */}
        <Card className={classes.card}>
          <Stack gap="lg" align="center" ta="center" h="100%" justify="center">
            <div className={classes.medallion}>
              <ThemeIcon variant="default" size={44} radius="xl" className={classes.icon}>
                <FolderPlus size={20} strokeWidth={1.75} />
              </ThemeIcon>
            </div>

            <Stack gap={6} align="center" maw={260}>
              <Text fw={600} fz="lg">
                No projects yet
              </Text>
              <Text c="dimmed" size="sm">
                Create your first project to start organizing work, or import an existing one.
              </Text>
            </Stack>

            <Group gap="sm" justify="center">
              <Button variant="filled" leftSection={<Plus size={15} strokeWidth={2} />}>
                New project
              </Button>
              <Button variant="default" leftSection={<Upload size={15} strokeWidth={1.75} />}>
                Import
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* (2) No results — search-off medallion + clear filters. */}
        <Card className={classes.card}>
          <Stack gap="lg" align="center" ta="center" h="100%" justify="center">
            <div className={`${classes.medallion} ${classes.medallionDotted}`}>
              <ThemeIcon variant="default" size={44} radius="xl" className={classes.icon}>
                <SearchX size={20} strokeWidth={1.75} />
              </ThemeIcon>
            </div>

            <Stack gap={6} align="center" maw={260}>
              <Text fw={600} fz="lg">
                No results found
              </Text>
              <Text c="dimmed" size="sm">
                We couldn&apos;t find anything matching your filters. Try broadening your search.
              </Text>
            </Stack>

            <Button variant="default">Clear filters</Button>
          </Stack>
        </Card>

        {/* (3) All caught up — celebratory check medallion, muted line. */}
        <Card className={classes.card}>
          <Stack gap="lg" align="center" ta="center" h="100%" justify="center">
            <div className={classes.medallion}>
              <ThemeIcon variant="filled" size={44} radius="xl" className={classes.icon}>
                <CheckCheck size={20} strokeWidth={2} />
              </ThemeIcon>
            </div>

            <Stack gap={6} align="center" maw={260}>
              <Text fw={600} fz="lg">
                You&apos;re all caught up
              </Text>
              <Text c="dimmed" size="sm">
                Nothing needs your attention right now. Enjoy the quiet.
              </Text>
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>
    </div>
  );
}
