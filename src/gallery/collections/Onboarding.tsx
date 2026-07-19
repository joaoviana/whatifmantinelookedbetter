/* CONTRACT: export function Onboarding() — a composed block from the themed components.
   A multi-step onboarding card: stepper, step content, progress, back/next actions. */
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Stepper,
  TagsInput,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Building2,
  Check,
  CircleDollarSign,
  Database,
  GitBranch,
  PartyPopper,
  Table2,
  Users,
} from 'lucide-react';
import classes from './Onboarding.module.css';

const STEP_COUNT = 4;

const SLUG_PREFIX = 'app.acme.com/';

const DATA_SOURCES = [
  { id: 'postgres', label: 'PostgreSQL', hint: 'Production database', Icon: Database },
  { id: 'snowflake', label: 'Snowflake', hint: 'Warehouse', Icon: Boxes },
  { id: 'bigquery', label: 'BigQuery', hint: 'Warehouse', Icon: Table2 },
  { id: 'stripe', label: 'Stripe', hint: 'Billing & revenue', Icon: CircleDollarSign },
  { id: 'github', label: 'GitHub', hint: 'Repos & activity', Icon: GitBranch },
  { id: 'segment', label: 'Segment', hint: 'Product events', Icon: Users },
] as const;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function Onboarding() {
  const [active, setActive] = useState(0);
  const [workspace, setWorkspace] = useState('Acme Analytics');
  const [slug, setSlug] = useState('acme-analytics');
  const [slugEdited, setSlugEdited] = useState(false);
  const [emails, setEmails] = useState<string[]>(['maria@acme.com', 'devon@acme.com']);
  const [sources, setSources] = useState<string[]>(['postgres', 'stripe']);

  const clamp = (value: number) => Math.max(0, Math.min(STEP_COUNT - 1, value));
  const next = () => setActive((current) => clamp(current + 1));
  const back = () => setActive((current) => clamp(current - 1));

  const onWorkspaceChange = (value: string) => {
    setWorkspace(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const toggleSource = (id: string) =>
    setSources((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );

  const progress = Math.round(((active + 1) / STEP_COUNT) * 100);
  const isLast = active === STEP_COUNT - 1;

  return (
    <Box p={{ base: 'md', sm: 'xl' }} style={{ display: 'flex', justifyContent: 'center' }}>
      <Card padding={0} style={{ width: '100%', maxWidth: 640 }}>
        {/* Header — eyebrow + progress meter */}
        <Stack gap={4} p="lg" pb="md">
          <Group justify="space-between" align="center">
            <span className="eyebrow">Get started</span>
            <Text size="xs" c="dimmed" fw={500} style={{ fontVariantNumeric: 'tabular-nums' }}>
              Step {active + 1} of {STEP_COUNT}
            </Text>
          </Group>
          <Title order={3}>Set up your workspace</Title>
          <Text size="sm" c="dimmed">
            A few quick steps and your team is ready to explore data together.
          </Text>
          <Progress
            value={progress}
            size="xs"
            color="neutral"
            radius="xl"
            mt="xs"
            aria-label={`Onboarding progress: ${progress}%`}
          />
        </Stack>

        <Box px="lg" className={classes.stepperBox}>
          <Stepper
            active={active}
            onStepClick={(index) => setActive(clamp(index))}
            size="sm"
          >
            <Stepper.Step
              label="Create workspace"
              icon={<Building2 size={16} strokeWidth={1.75} />}
            />
            <Stepper.Step
              label="Invite team"
              icon={<Users size={16} strokeWidth={1.75} />}
            />
            <Stepper.Step
              label="Connect data"
              icon={<Database size={16} strokeWidth={1.75} />}
            />
            <Stepper.Step
              label="Finish"
              icon={<PartyPopper size={16} strokeWidth={1.75} />}
            />
          </Stepper>
        </Box>

        {/* Step content */}
        <Box px="lg" py="lg" mih={260}>
          {active === 0 && (
            <Stack gap="md">
              <div>
                <Text fw={600} size="sm">
                  Name your workspace
                </Text>
                <Text size="sm" c="dimmed">
                  This is how your team will recognize the space. You can change it later.
                </Text>
              </div>
              <TextInput
                label="Workspace name"
                placeholder="Acme Analytics"
                value={workspace}
                onChange={(e) => onWorkspaceChange(e.currentTarget.value)}
              />
              <TextInput
                label="Workspace URL"
                description="Lowercase letters, numbers and dashes."
                leftSection={
                  <Text size="sm" c="dimmed" pl={4}>
                    {SLUG_PREFIX}
                  </Text>
                }
                leftSectionWidth={112}
                placeholder="acme-analytics"
                value={slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setSlug(slugify(e.currentTarget.value));
                }}
              />
            </Stack>
          )}

          {active === 1 && (
            <Stack gap="md">
              <div>
                <Text fw={600} size="sm">
                  Invite your teammates
                </Text>
                <Text size="sm" c="dimmed">
                  Add a few email addresses — we&apos;ll send each of them an invite to join.
                </Text>
              </div>
              <TagsInput
                label="Team emails"
                description="Press Enter to add each address."
                placeholder={emails.length ? undefined : 'name@acme.com'}
                value={emails}
                onChange={setEmails}
                clearable
              />
              <Text size="xs" c="dimmed">
                {emails.length
                  ? `${emails.length} teammate${emails.length > 1 ? 's' : ''} will be invited.`
                  : 'No invites yet — you can always add people later from Settings.'}
              </Text>
            </Stack>
          )}

          {active === 2 && (
            <Stack gap="md">
              <div>
                <Text fw={600} size="sm">
                  Connect your data
                </Text>
                <Text size="sm" c="dimmed">
                  Pick the sources you want to sync. Choose as many as you like.
                </Text>
              </div>
              <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
                {DATA_SOURCES.map(({ id, label, hint, Icon }) => {
                  const selected = sources.includes(id);
                  return (
                    <UnstyledButton
                      key={id}
                      className={classes.source}
                      data-selected={selected || undefined}
                      onClick={() => toggleSource(id)}
                      aria-pressed={selected}
                    >
                      <span className={classes.sourceIcon}>
                        <Icon size={17} strokeWidth={1.75} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <Text size="sm" fw={500} lh={1.3}>
                          {label}
                        </Text>
                        <Text size="xs" c="dimmed" lh={1.3}>
                          {hint}
                        </Text>
                      </div>
                      {selected && <Check size={16} strokeWidth={2.25} className={classes.sourceCheck} />}
                    </UnstyledButton>
                  );
                })}
              </SimpleGrid>
            </Stack>
          )}

          {active === 3 && (
            <Stack gap="md" align="center" ta="center" py="sm">
              <ThemeIcon size={54} radius="xl" variant="filled" color="neutral">
                <Check size={26} strokeWidth={2.25} />
              </ThemeIcon>
              <div>
                <Title order={4}>You&apos;re all set</Title>
                <Text size="sm" c="dimmed" mt={4}>
                  {workspace || 'Your workspace'} is ready to go. Here&apos;s what we set up.
                </Text>
              </div>
              <Stack gap={0} w="100%" ta="left" mt="xs">
                <div className={classes.summaryRow}>
                  <ThemeIcon size={32} radius="md" variant="default">
                    <Building2 size={16} strokeWidth={1.75} />
                  </ThemeIcon>
                  <div style={{ minWidth: 0 }}>
                    <Text size="sm" fw={500}>
                      {workspace || 'Untitled workspace'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {SLUG_PREFIX}
                      {slug || 'workspace'}
                    </Text>
                  </div>
                </div>
                <div className={classes.summaryRow}>
                  <ThemeIcon size={32} radius="md" variant="default">
                    <Users size={16} strokeWidth={1.75} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={500}>
                      {emails.length} teammate{emails.length === 1 ? '' : 's'} invited
                    </Text>
                    <Text size="xs" c="dimmed">
                      {emails.length ? emails.join(', ') : 'Invite people anytime from Settings'}
                    </Text>
                  </div>
                </div>
                <div className={classes.summaryRow}>
                  <ThemeIcon size={32} radius="md" variant="default">
                    <Database size={16} strokeWidth={1.75} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={500}>
                      {sources.length} data source{sources.length === 1 ? '' : 's'} connected
                    </Text>
                    <Text size="xs" c="dimmed">
                      {sources.length
                        ? DATA_SOURCES.filter((s) => sources.includes(s.id))
                            .map((s) => s.label)
                            .join(', ')
                        : 'Connect sources anytime'}
                    </Text>
                  </div>
                </div>
              </Stack>
            </Stack>
          )}
        </Box>

        {/* Actions */}
        <Group
          justify="space-between"
          p="lg"
          style={{ borderTop: '1px solid var(--app-border)' }}
        >
          <Button
            variant="default"
            leftSection={<ArrowLeft size={16} strokeWidth={1.75} />}
            onClick={back}
            disabled={active === 0}
          >
            Back
          </Button>
          {isLast ? (
            <Button rightSection={<ArrowRight size={16} strokeWidth={1.75} />}>
              Go to dashboard
            </Button>
          ) : (
            <Button
              rightSection={<ArrowRight size={16} strokeWidth={1.75} />}
              onClick={next}
            >
              Continue
            </Button>
          )}
        </Group>
      </Card>
    </Box>
  );
}
