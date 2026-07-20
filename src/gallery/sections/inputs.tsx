import {
  TextInput,
  Textarea,
  PasswordInput,
  NumberInput,
  Select,
  Autocomplete,
  MultiSelect,
  TagsInput,
  PillsInput,
  Pill,
  PinInput,
  JsonInput,
  NativeSelect,
  FileInput,
  ColorInput,
  ColorPicker,
  Rating,
  Fieldset,
  Checkbox,
  Radio,
  Switch,
  Slider,
  RangeSlider,
  SegmentedControl,
  Stack,
  Group,
  SimpleGrid,
  Text,
} from '@mantine/core';
import {
  Mail,
  Search,
  DollarSign,
  Check,
  Sun,
  Moon,
  Monitor,
  Upload,
  GitBranch,
} from 'lucide-react';
import { useMediaQuery } from '@mantine/hooks';
import { Specimen, SpecimenGrid } from '../parts';

export const meta = {
  id: 'inputs',
  label: 'Inputs & Forms',
  description: 'Fields, toggles and controls — where users enter and choose.',
};

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export function Section() {
  const wide = useMediaQuery('(min-width: 53em)', true, { getInitialValueInEffect: false });

  return (
    <>
      <SpecimenGrid>
        {/* ── Text fields ─────────────────────────────────────────── */}
        <Specimen name="TextInput" hint="default · leftSection">
          <Stack gap="md" w="100%">
            <TextInput label="Email" placeholder="you@example.com" />
            <TextInput
              label="Search"
              placeholder="Find anything"
              leftSection={<Search size={16} strokeWidth={1.6} />}
            />
          </Stack>
        </Specimen>

        <Specimen name="TextInput" hint="description · states">
          <Stack gap="md" w="100%">
            <TextInput
              label="Workspace URL"
              description="Lowercase letters and dashes only."
              placeholder="acme"
              leftSection={<Mail size={16} strokeWidth={1.6} />}
            />
            <TextInput
              label="Email"
              placeholder="you@example.com"
              defaultValue="not-an-email"
              error="Enter a valid email address."
            />
          </Stack>
        </Specimen>

        <Specimen name="TextInput" hint="focus ring · disabled">
          <Stack gap="md" w="100%">
            <TextInput
              label="Focused"
              placeholder="Click to see the ring"
              description="Focus shifts the border and adds a faint monochrome halo."
            />
            <TextInput label="Disabled" placeholder="Read only" defaultValue="Locked field" disabled />
          </Stack>
        </Specimen>

        <Specimen name="TextInput" hint="sizes xs → xl" span={1}>
          <Stack gap="sm" w="100%">
            {sizes.map((s) => (
              <TextInput key={s} size={s} placeholder={`Size ${s}`} aria-label={`Size ${s}`} />
            ))}
          </Stack>
        </Specimen>

        <Specimen name="Textarea">
          <Textarea
            label="Notes"
            description="Autosizes as you type."
            placeholder="Add a short note about this record…"
            w="100%"
          />
        </Specimen>

        <Specimen name="PasswordInput" hint="toggle visibility">
          <Stack gap="md" w="100%">
            <PasswordInput label="Password" placeholder="Enter password" defaultValue="hunter2" />
            <PasswordInput
              label="Confirm"
              placeholder="Repeat password"
              error="Passwords do not match."
            />
          </Stack>
        </Specimen>

        <Specimen name="NumberInput">
          <Stack gap="md" w="100%">
            <NumberInput label="Seats" description="Billed per seat." defaultValue={12} min={1} />
            <NumberInput
              label="Amount"
              leftSection={<DollarSign size={16} strokeWidth={1.6} />}
              defaultValue={49}
              thousandSeparator=","
            />
          </Stack>
        </Specimen>

        <Specimen name="Select">
          <Stack gap="md" w="100%">
            <Select
              label="Role"
              placeholder="Pick one"
              defaultValue="Admin"
              data={['Owner', 'Admin', 'Member', 'Guest']}
            />
            <Select
              label="Region"
              placeholder="Searchable"
              searchable
              data={['us-east', 'us-west', 'eu-central', 'ap-south']}
            />
          </Stack>
        </Specimen>

        {/* ── Autocomplete / NativeSelect ─────────────────────────── */}
        <Specimen name="Autocomplete" hint="suggest as you type">
          <Stack gap="md" w="100%">
            <Autocomplete
              label="Framework"
              placeholder="Start typing…"
              leftSection={<Search size={16} strokeWidth={1.6} />}
              data={['React', 'Vue', 'Svelte', 'Solid', 'Angular']}
            />
            <NativeSelect
              label="Timezone"
              data={['UTC', 'America/New_York', 'Europe/Lisbon', 'Asia/Tokyo']}
            />
          </Stack>
        </Specimen>

        {/* ── MultiSelect / TagsInput ─────────────────────────────── */}
        <Specimen name="MultiSelect" hint="multiple · pills">
          <MultiSelect
            label="Members"
            placeholder="Add people"
            defaultValue={['Casey', 'Riley']}
            data={['Casey', 'Riley', 'Jordan', 'Avery', 'Quinn']}
            w="100%"
          />
        </Specimen>

        <Specimen name="TagsInput" hint="free-form tags">
          <TagsInput
            label="Labels"
            placeholder="Type and press Enter"
            defaultValue={['bug', 'priority']}
            data={['bug', 'feature', 'priority', 'backlog']}
            w="100%"
          />
        </Specimen>

        {/* ── PillsInput / Pill ───────────────────────────────────── */}
        <Specimen name="PillsInput" hint="Pill · composed field">
          <PillsInput label="Recipients" w="100%">
            <Pill.Group>
              <Pill withRemoveButton>design@acme.com</Pill>
              <Pill withRemoveButton>eng@acme.com</Pill>
              <PillsInput.Field placeholder="Add email" />
            </Pill.Group>
          </PillsInput>
        </Specimen>

        {/* ── PinInput ────────────────────────────────────────────── */}
        <Specimen name="PinInput" hint="one-time code">
          <Stack gap="md" align="center">
            <PinInput length={5} defaultValue="12" aria-label="Verification code" />
            <PinInput type="number" mask aria-label="PIN" />
          </Stack>
        </Specimen>

        {/* ── FileInput ───────────────────────────────────────────── */}
        <Specimen name="FileInput" hint="upload · clearable">
          <Stack gap="md" w="100%">
            <FileInput
              label="Attachment"
              placeholder="Choose a file"
              leftSection={<Upload size={16} strokeWidth={1.6} />}
              clearable
            />
            <FileInput
              label="Assets"
              placeholder="Upload images"
              description="PNG or JPG, multiple allowed."
              multiple
            />
          </Stack>
        </Specimen>

        {/* ── JsonInput ───────────────────────────────────────────── */}
        <Specimen name="JsonInput" hint="monospace · validated" span={1}>
          <JsonInput
            label="Metadata"
            description="Formats and validates on blur."
            placeholder='{ "role": "admin" }'
            defaultValue={'{\n  "role": "admin",\n  "seats": 12\n}'}
            formatOnBlur
            validationError="Invalid JSON"
            minRows={5}
            w="100%"
          />
        </Specimen>

        {/* ── ColorInput / ColorPicker ────────────────────────────── */}
        <Specimen name="ColorInput" hint="swatches · eye dropper">
          <ColorInput
            label="Brand color"
            placeholder="Pick a color"
            defaultValue="#6366f1"
            swatches={['#6366f1', '#18181b', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']}
            w="100%"
          />
        </Specimen>

        <Specimen name="ColorPicker" hint="inline picker" minH={220}>
          <ColorPicker
            format="hex"
            defaultValue="#6366f1"
            swatches={['#6366f1', '#18181b', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']}
          />
        </Specimen>

        {/* ── Rating ──────────────────────────────────────────────── */}
        <Specimen name="Rating" hint="whole · fractions">
          <Stack gap="md" align="center">
            <Rating defaultValue={3} />
            <Rating defaultValue={3.5} fractions={2} size="lg" />
            <Rating defaultValue={4} readOnly color="yellow" />
          </Stack>
        </Specimen>

        {/* ── Checkbox ────────────────────────────────────────────── */}
        <Specimen name="Checkbox" hint="all states">
          <Stack gap="sm" w="100%">
            <Checkbox label="Default (off)" />
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox
              label="With description"
              description="Send me product updates."
              defaultChecked
            />
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
          </Stack>
        </Specimen>

        {/* ── Radio ───────────────────────────────────────────────── */}
        <Specimen name="Radio.Group">
          <Radio.Group
            label="Plan"
            description="Choose a billing cadence."
            defaultValue="annual"
            w="100%"
          >
            <Stack gap="sm" mt="xs">
              <Radio value="monthly" label="Monthly" />
              <Radio value="annual" label="Annual — save 20%" />
              <Radio value="custom" label="Custom" disabled />
            </Stack>
          </Radio.Group>
        </Specimen>

        {/* ── Switch ──────────────────────────────────────────────── */}
        <Specimen name="Switch" hint="states · thumb icon">
          <Stack gap="sm" w="100%">
            <Switch label="Off" />
            <Switch label="On" defaultChecked />
            <Switch
              label="With thumb icon"
              defaultChecked
              thumbIcon={<Check size={12} strokeWidth={2.4} color="var(--mantine-color-text)" />}
            />
            <Switch label="Disabled" disabled />
          </Stack>
        </Specimen>

        <Specimen name="Switch" hint="sizes sm → xl">
          <Stack gap="sm" w="100%">
            {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
              <Switch key={s} size={s} label={`Size ${s}`} defaultChecked />
            ))}
          </Stack>
        </Specimen>

        {/* ── Slider ──────────────────────────────────────────────── */}
        <Specimen name="Slider" hint="with marks" span={wide ? 2 : 1}>
          <Stack gap="xl" w="100%" py="xs">
            <Slider
              defaultValue={40}
              marks={[
                { value: 0, label: '0' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 75, label: '75' },
                { value: 100, label: '100' },
              ]}
            />
            <RangeSlider
              defaultValue={[20, 70]}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
            />
          </Stack>
        </Specimen>

        {/* ── SegmentedControl ────────────────────────────────────── */}
        <Specimen name="SegmentedControl" hint="text · icons" span={wide ? 2 : 1}>
          <Stack gap="md" align="center">
            <SegmentedControl data={['Overview', 'Activity', 'Settings']} defaultValue="Activity" />
            <SegmentedControl
              defaultValue="system"
              data={[
                {
                  value: 'light',
                  label: (
                    <Group gap={6} justify="center">
                      <Sun size={15} strokeWidth={1.6} />
                      <Text fz="sm">Light</Text>
                    </Group>
                  ),
                },
                {
                  value: 'dark',
                  label: (
                    <Group gap={6} justify="center">
                      <Moon size={15} strokeWidth={1.6} />
                      <Text fz="sm">Dark</Text>
                    </Group>
                  ),
                },
                {
                  value: 'system',
                  label: (
                    <Group gap={6} justify="center">
                      <Monitor size={15} strokeWidth={1.6} />
                      <Text fz="sm">System</Text>
                    </Group>
                  ),
                },
              ]}
            />
            <SegmentedControl data={['Day', 'Week', 'Month']} defaultValue="Week" disabled />
          </Stack>
        </Specimen>

        {/* ── Fieldset — a realistic grouped form ──────────────────── */}
        <Specimen name="Fieldset" hint="grouped form" span={wide ? 2 : 1} minH={260}>
          <Fieldset legend="Connect a repository" w="100%">
            <Stack gap="md">
              <TextInput
                label="Repository"
                placeholder="acme/app"
                leftSection={<GitBranch size={16} strokeWidth={1.6} />}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Select
                  label="Branch"
                  defaultValue="main"
                  data={['main', 'develop', 'staging']}
                />
                <NativeSelect
                  label="Framework"
                  data={['Next.js', 'Vite', 'Remix', 'Astro']}
                />
              </SimpleGrid>
              <MultiSelect
                label="Environments"
                placeholder="Add"
                defaultValue={['Production']}
                data={['Production', 'Preview', 'Development']}
              />
              <Group justify="space-between" mt={4}>
                <Switch label="Auto-deploy on push" defaultChecked />
                <Rating defaultValue={0} count={3} aria-label="Priority" />
              </Group>
            </Stack>
          </Fieldset>
        </Specimen>
      </SpecimenGrid>
    </>
  );
}
