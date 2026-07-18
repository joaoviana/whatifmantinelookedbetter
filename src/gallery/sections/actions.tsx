import { useState } from 'react';
import {
  Button,
  ActionIcon,
  Anchor,
  Chip,
  CloseButton,
  CopyButton,
  FileButton,
  Kbd,
  Tooltip,
  UnstyledButton,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  ArrowUpRight,
  Plus,
  Trash2,
  Download,
  Settings,
  Ellipsis,
  ChevronDown,
  ChevronRight,
  Check,
  Zap,
  Star,
  Copy,
  Upload,
  Rocket,
  Bell,
} from 'lucide-react';
import { Specimen, SpecimenGrid, Row } from '../parts';
import classes from '../../theme/components/actions.module.css';

export const meta = {
  id: 'actions',
  label: 'Buttons & Actions',
  description: 'Buttons, icon buttons, links and chips — the primitives users click.',
};

const VARIANTS = ['filled', 'default', 'light', 'subtle', 'outline'] as const;
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export function Section() {
  const [chips, setChips] = useState<string[]>(['ready']);
  const [file, setFile] = useState<File | null>(null);

  return (
    <SpecimenGrid>
      {/* ── Button: the five variants ───────────────────────────── */}
      <Specimen name="Button" hint="variants" span={2}>
        <Row>
          {VARIANTS.map((v) => (
            <Button key={v} variant={v}>
              {v[0].toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </Row>
      </Specimen>

      {/* ── Button: sizes ───────────────────────────────────────── */}
      <Specimen name="Button" hint="sizes xs–xl" span={2} minH={110}>
        <Group gap="sm" align="center" justify="center" wrap="wrap">
          {SIZES.map((s) => (
            <Button key={s} size={s} variant="default">
              Size {s}
            </Button>
          ))}
        </Group>
      </Specimen>

      {/* ── Button: with icons ──────────────────────────────────── */}
      <Specimen name="Button" hint="icons + sections">
        <Stack gap="sm" align="center">
          <Button leftSection={<Plus size={15} />}>New record</Button>
          <Button variant="default" rightSection={<ArrowUpRight size={15} />}>
            Open in app
          </Button>
          <Button variant="light" leftSection={<Download size={15} />}>
            Export
          </Button>
        </Stack>
      </Specimen>

      {/* ── Button: states ──────────────────────────────────────── */}
      <Specimen name="Button" hint="loading · disabled">
        <Stack gap="sm" align="center">
          <Group gap="sm">
            <Button loading>Saving</Button>
            <Button variant="default" loading>
              Syncing
            </Button>
          </Group>
          <Group gap="sm">
            <Button disabled>Disabled</Button>
            <Button variant="default" disabled>
              Disabled
            </Button>
          </Group>
        </Stack>
      </Specimen>

      {/* ── Button: compact ─────────────────────────────────────── */}
      <Specimen name="Button" hint="compact sizes">
        <Row>
          <Button size="compact-xs" variant="default">
            Compact xs
          </Button>
          <Button size="compact-sm" variant="light">
            Compact sm
          </Button>
          <Button size="compact-md">Compact md</Button>
        </Row>
      </Specimen>

      {/* ── Button: fullWidth ───────────────────────────────────── */}
      <Specimen name="Button" hint="fullWidth">
        <Stack gap="sm" style={{ width: '100%' }}>
          <Button fullWidth leftSection={<Check size={15} />}>
            Confirm & continue
          </Button>
          <Button fullWidth variant="default">
            Cancel
          </Button>
        </Stack>
      </Specimen>

      {/* ── Button.Group ────────────────────────────────────────── */}
      <Specimen name="Button.Group" hint="segmented">
        <Stack gap="sm" align="center">
          <Button.Group>
            <Button variant="default">Day</Button>
            <Button variant="default">Week</Button>
            <Button variant="default">Month</Button>
          </Button.Group>
          <Button.Group>
            <Button variant="default" leftSection={<Star size={15} />}>
              Star
            </Button>
            <Button variant="default" rightSection={<ChevronDown size={15} />}>
              More
            </Button>
          </Button.Group>
        </Stack>
      </Specimen>

      {/* ── Button.Group: split button ──────────────────────────── */}
      {/* Split button = one cohesive unit. The trailing ActionIcon MUST share
          the Button's size + variant so heights, radius and fill match and the
          seam collapses (see the grouped-controls rules in actions.module.css). */}
      <Specimen name="Button.Group" hint="split action">
        <Stack gap="sm" align="center">
          <Button.Group>
            <Button size="md" variant="filled" leftSection={<Rocket size={15} />}>
              Deploy
            </Button>
            <ActionIcon size="md" variant="filled" aria-label="More deploy options">
              <ChevronDown size={16} />
            </ActionIcon>
          </Button.Group>
          <Button.Group>
            <Button size="md" variant="default" leftSection={<Download size={15} />}>
              Export
            </Button>
            <ActionIcon size="md" variant="default" aria-label="More export options">
              <ChevronDown size={16} />
            </ActionIcon>
          </Button.Group>
        </Stack>
      </Specimen>

      {/* ── Button.Group: vertical orientation ──────────────────── */}
      <Specimen name="Button.Group" hint="vertical orientation">
        <Button.Group orientation="vertical">
          <Button variant="default" leftSection={<ArrowUpRight size={15} />}>
            Move up
          </Button>
          <Button variant="default" leftSection={<Settings size={15} />}>
            Configure
          </Button>
          <Button variant="default" leftSection={<Trash2 size={15} />}>
            Remove
          </Button>
        </Button.Group>
      </Specimen>

      {/* ── ActionIcon: variants ────────────────────────────────── */}
      <Specimen name="ActionIcon" hint="variants">
        <Row>
          <ActionIcon variant="filled" aria-label="Add">
            <Plus size={17} />
          </ActionIcon>
          <ActionIcon variant="default" aria-label="Settings">
            <Settings size={17} />
          </ActionIcon>
          <ActionIcon variant="light" aria-label="Copy">
            <Copy size={17} />
          </ActionIcon>
          <ActionIcon variant="subtle" aria-label="More">
            <Ellipsis size={17} />
          </ActionIcon>
          <ActionIcon variant="outline" aria-label="Delete">
            <Trash2 size={17} />
          </ActionIcon>
        </Row>
      </Specimen>

      {/* ── ActionIcon: sizes & states ──────────────────────────── */}
      <Specimen name="ActionIcon" hint="sizes · states">
        <Stack gap="sm" align="center">
          <Group gap="sm" align="center">
            {SIZES.map((s) => (
              <ActionIcon key={s} size={s} variant="default" aria-label={`Bolt ${s}`}>
                <Zap size={17} />
              </ActionIcon>
            ))}
          </Group>
          <Group gap="sm">
            <ActionIcon variant="light" loading aria-label="Loading" />
            <ActionIcon variant="default" disabled aria-label="Disabled">
              <Settings size={17} />
            </ActionIcon>
          </Group>
        </Stack>
      </Specimen>

      {/* ── ActionIcon.Group ────────────────────────────────────── */}
      <Specimen name="ActionIcon.Group" hint="segmented">
        <ActionIcon.Group>
          <ActionIcon variant="default" aria-label="Copy">
            <Copy size={17} />
          </ActionIcon>
          <ActionIcon variant="default" aria-label="Download">
            <Download size={17} />
          </ActionIcon>
          <ActionIcon variant="default" aria-label="Delete">
            <Trash2 size={17} />
          </ActionIcon>
        </ActionIcon.Group>
      </Specimen>

      {/* ── CopyButton ──────────────────────────────────────────── */}
      <Specimen name="CopyButton" hint="tooltip · check state">
        <CopyButton value="npm i @mantine/core" timeout={1600}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy command'} withArrow position="top">
              <Button
                variant={copied ? 'filled' : 'default'}
                onClick={copy}
                leftSection={copied ? <Check size={15} /> : <Copy size={15} />}
              >
                {copied ? 'Copied' : 'npm i @mantine/core'}
              </Button>
            </Tooltip>
          )}
        </CopyButton>
      </Specimen>

      {/* ── FileButton ──────────────────────────────────────────── */}
      <Specimen name="FileButton" hint="upload trigger">
        <Stack gap="sm" align="center">
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => (
              <Button {...props} variant="default" leftSection={<Upload size={15} />}>
                Upload image
              </Button>
            )}
          </FileButton>
          <Text fz="xs" c="dimmed">
            {file ? file.name : 'PNG or JPEG · none selected'}
          </Text>
        </Stack>
      </Specimen>

      {/* ── CloseButton ─────────────────────────────────────────── */}
      <Specimen name="CloseButton" hint="sizes">
        <Row>
          <CloseButton size="sm" />
          <CloseButton />
          <CloseButton size="lg" />
          <CloseButton variant="filled" />
        </Row>
      </Specimen>

      {/* ── Kbd ─────────────────────────────────────────────────── */}
      <Specimen name="Kbd" hint="keys · ⌘K combo">
        <Stack gap="md" align="center">
          <Group gap={6}>
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>P</Kbd>
          </Group>
          <Group gap={8} align="center">
            <Text fz="sm" c="dimmed">
              Command menu
            </Text>
            <Group gap={4}>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </Group>
          </Group>
        </Stack>
      </Specimen>

      {/* ── UnstyledButton: clickable card row ──────────────────── */}
      <Specimen name="UnstyledButton" hint="clickable row" span={2}>
        <Stack gap="sm" style={{ width: '100%' }}>
          {[
            { icon: <Bell size={17} />, title: 'Notifications', desc: 'Manage alerts & digests' },
            { icon: <Settings size={17} />, title: 'Workspace settings', desc: 'Members, roles, billing' },
          ].map((item) => (
            <UnstyledButton
              key={item.title}
              className={classes.cardRow}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--mantine-radius-md)',
                background: 'var(--app-surface)',
              }}
            >
              <ActionIcon component="div" variant="light" size="md" aria-hidden>
                {item.icon}
              </ActionIcon>
              <Stack gap={0} style={{ flex: 1 }}>
                <Text fz="sm" fw={500} lts="-0.006em">
                  {item.title}
                </Text>
                <Text fz="xs" c="dimmed">
                  {item.desc}
                </Text>
              </Stack>
              <ChevronRight size={16} style={{ color: 'var(--app-muted)' }} />
            </UnstyledButton>
          ))}
        </Stack>
      </Specimen>

      {/* ── Anchor ──────────────────────────────────────────────── */}
      <Specimen name="Anchor" hint="links">
        <Stack gap={8} align="center">
          <Anchor href="#" onClick={(e) => e.preventDefault()}>
            Refined, quiet link
          </Anchor>
          <Text fz="sm" c="dimmed">
            Inline within a{' '}
            <Anchor href="#" onClick={(e) => e.preventDefault()}>
              sentence
            </Anchor>{' '}
            of text.
          </Text>
          <Anchor href="#" onClick={(e) => e.preventDefault()} fz="sm">
            Learn more <ArrowUpRight size={13} style={{ verticalAlign: '-1px' }} />
          </Anchor>
        </Stack>
      </Specimen>

      {/* ── Chip: single · filled vs outline ────────────────────── */}
      <Specimen name="Chip" hint="filled vs outline">
        <Row>
          <Chip defaultChecked>Filled</Chip>
          <Chip defaultChecked variant="light">
            Light
          </Chip>
          <Chip defaultChecked variant="outline">
            Outline
          </Chip>
          <Chip variant="outline">Off</Chip>
        </Row>
      </Specimen>

      {/* ── Chip.Group ──────────────────────────────────────────── */}
      <Specimen name="Chip.Group" hint="multiple selection">
        <Chip.Group multiple value={chips} onChange={setChips}>
          <Row>
            <Chip value="ready">Ready</Chip>
            <Chip value="in-progress">In progress</Chip>
            <Chip value="blocked">Blocked</Chip>
            <Chip value="done">Done</Chip>
          </Row>
        </Chip.Group>
      </Specimen>
    </SpecimenGrid>
  );
}
