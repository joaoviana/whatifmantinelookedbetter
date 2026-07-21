/* CONTRACT: export function SettingsPanel() — a composed block from the themed components.
   A settings form: avatar, profile fields, preference switches, a sticky save bar. */
import {
  Avatar,
  Button,
  Card,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { Camera } from 'lucide-react';
import classes from './SettingsPanel.module.css';

// Section header — the monospace eyebrow signature (see theme.css .eyebrow).
function SectionHeader({ label }: { label: string }) {
  return (
    <Text component="span" variant="eyebrow">
      {label}
    </Text>
  );
}

// A preference toggle row: title + description on the left, Switch on the right.
function ToggleRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className={classes.switchRow}>
      <div>
        <Text fw={500} size="sm">
          {title}
        </Text>
        <Text c="dimmed" size="xs" mt={2}>
          {description}
        </Text>
      </div>
      <Switch defaultChecked={defaultChecked} aria-label={title} />
    </div>
  );
}

export function SettingsPanel() {
  return (
    <div className={classes.root}>
      <div className={classes.panel}>
        <header>
          <Title order={3}>Settings</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Manage your profile details and workspace preferences.
          </Text>
        </header>

        {/* ── Profile ─────────────────────────────────────────── */}
        <Card padding="lg">
          <Stack gap="md">
            <SectionHeader label="Profile" />

            <Group gap="md" wrap="nowrap">
              <Avatar size={64} name="Maya Chen" color="neutral" />
              <div>
                <Button
                  variant="default"
                  size="xs"
                  leftSection={<Camera size={14} strokeWidth={1.75} />}
                >
                  Change
                </Button>
                <Text c="dimmed" size="xs" mt={6}>
                  JPG or PNG, up to 2&nbsp;MB.
                </Text>
              </div>
            </Group>

            <TextInput label="Full name" defaultValue="Maya Chen" />
            <TextInput
              label="Email"
              type="email"
              defaultValue="maya@northwind.io"
              description="Used for sign-in and notifications."
            />
            <Textarea
              label="Bio"
              minRows={3}
              defaultValue="Product designer at Northwind. Building calm, considered interfaces."
            />
          </Stack>
        </Card>

        {/* ── Preferences ─────────────────────────────────────── */}
        <Card padding="lg">
          <Stack gap="md">
            <SectionHeader label="Preferences" />

            <Stack gap="sm">
              <ToggleRow
                title="Email notifications"
                description="Activity summaries and mentions from your workspace."
                defaultChecked
              />
              <div className={classes.rowDivider} />
              <ToggleRow
                title="Two-factor authentication"
                description="Require a verification code at sign-in."
                defaultChecked
              />
              <div className={classes.rowDivider} />
              <ToggleRow
                title="Product updates"
                description="Occasional emails about new features."
              />
            </Stack>

            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md" verticalSpacing="md">
              <Select
                label="Theme"
                defaultValue="system"
                allowDeselect={false}
                data={[
                  { value: 'system', label: 'System' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
              <Select
                label="Language"
                defaultValue="en"
                allowDeselect={false}
                data={[
                  { value: 'en', label: 'English' },
                  { value: 'fr', label: 'Français' },
                  { value: 'de', label: 'Deutsch' },
                  { value: 'ja', label: '日本語' },
                ]}
              />
            </SimpleGrid>
          </Stack>
        </Card>

        {/* ── Sticky save bar ─────────────────────────────────── */}
        <div className={classes.footer}>
          <span className={classes.unsaved}>
            <span className={classes.dot} />
            <Text c="dimmed" size="sm">
              Unsaved changes
            </Text>
          </span>
          <Group gap="sm">
            <Button variant="default">Cancel</Button>
            <Button>Save changes</Button>
          </Group>
        </div>
      </div>
    </div>
  );
}
