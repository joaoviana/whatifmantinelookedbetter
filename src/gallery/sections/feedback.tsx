import { useState } from 'react';
import {
  Alert,
  Progress,
  RingProgress,
  Loader,
  Tooltip,
  Button,
  Text,
  Stack,
  Group,
  Skeleton,
  Notification,
  Modal,
  Popover,
  Divider,
  Drawer,
  HoverCard,
  LoadingOverlay,
  Overlay,
  Dialog,
  Collapse,
  Avatar,
  Box,
  Badge,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  Info,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  Settings,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { Specimen, SpecimenGrid, Row } from '../parts';

export const meta = {
  id: 'feedback',
  label: 'Feedback & Overlays',
  description: 'Alerts, progress, tooltips and overlays — the system talking back, quietly.',
};

const noop = () => {};

export function Section() {
  const [modalOpened, modal] = useDisclosure(false);
  const [drawerOpened, drawer] = useDisclosure(false);
  const [dialogOpened, dialog] = useDisclosure(false);
  const [collapseOpened, collapse] = useDisclosure(false);
  const [loading, loadingCtl] = useDisclosure(false);
  const [scrim, setScrim] = useState(false);
  // Full-width specimens drop to one column on a phone; overlays go full-width too.
  const wide = useMediaQuery('(min-width: 53em)', true, { getInitialValueInEffect: false });

  return (
    <SpecimenGrid>
      {/* ── ALERTS ─────────────────────────────────────────── */}
      <Specimen name="Alert" hint="semantic + titles" span={wide ? 2 : 1} minH={0}>
        <Stack gap="sm" w="100%">
          <Alert color="neutral" icon={<Info size={16} />} title="Heads up">
            A calm, monochrome alert that never shouts.
          </Alert>
          <Alert color="teal" icon={<CircleCheck size={16} />} title="Deploy succeeded">
            Your changes are live on production.
          </Alert>
          <Alert color="yellow" icon={<TriangleAlert size={16} />} title="Approaching limit">
            You have used 82% of your monthly quota.
          </Alert>
          <Alert color="red" icon={<CircleAlert size={16} />} title="Payment failed">
            We could not charge the card on file.
          </Alert>
        </Stack>
      </Specimen>

      <Specimen name="Alert" hint="no title · closable" span={wide ? 2 : 1} minH={0}>
        <Stack gap="sm" w="100%">
          <Alert color="neutral" icon={<Info size={16} />}>
            A titleless note — just an icon and a line of context.
          </Alert>
          <Alert color="neutral" title="Dismissable" withCloseButton onClose={noop}>
            Close it and it stays gone. Hairline border, soft tint.
          </Alert>
          <Alert color="red" icon={<CircleAlert size={16} />} withCloseButton onClose={noop}>
            An error you can wave away.
          </Alert>
        </Stack>
      </Specimen>

      {/* ── PROGRESS ───────────────────────────────────────── */}
      <Specimen name="Progress" hint="sizes">
        <Stack gap="md" w="100%">
          <Stack gap={6}>
            <Progress value={38} size="xs" />
            <Progress value={64} size="sm" />
            <Progress value={82} size="md" />
          </Stack>
          <Text variant="meta" ta="center">
            xs · sm · md — thin monochrome track
          </Text>
        </Stack>
      </Specimen>

      <Specimen name="Progress.Root" hint="sections">
        <Stack gap="xs" w="100%">
          <Progress.Root size="lg">
            <Progress.Section value={46} color="neutral" />
            <Progress.Section value={24} color="neutral.5" />
            <Progress.Section value={14} color="neutral.3" />
          </Progress.Root>
          <Group justify="space-between">
            <Text variant="meta">Used 70%</Text>
            <Text variant="meta">30% free</Text>
          </Group>
        </Stack>
      </Specimen>

      <Specimen name="RingProgress">
        <Group gap="lg">
          <RingProgress
            size={92}
            sections={[{ value: 72, color: 'neutral' }]}
            label={<Text variant="label" ta="center">72%</Text>}
          />
          <RingProgress
            size={64}
            thickness={6}
            sections={[{ value: 40, color: 'neutral' }]}
            label={<Text variant="meta" ta="center">40%</Text>}
          />
        </Group>
      </Specimen>

      {/* ── LOADERS ────────────────────────────────────────── */}
      <Specimen name="Loader" hint="types">
        <Row>
          <Loader type="oval" />
          <Loader type="bars" />
          <Loader type="dots" />
        </Row>
      </Specimen>

      <Specimen name="Loader" hint="sizes">
        <Row>
          <Loader size="xs" />
          <Loader size="sm" />
          <Loader size="md" />
          <Loader size="lg" />
        </Row>
      </Specimen>

      {/* ── TOOLTIP ────────────────────────────────────────── */}
      <Specimen name="Tooltip" hint="dark · arrow">
        <Row>
          <Tooltip label="A quiet, precise tooltip">
            <Button variant="default">Hover me</Button>
          </Tooltip>
          <Tooltip label="⌘K to search" position="bottom">
            <Button variant="light">Shortcut</Button>
          </Tooltip>
        </Row>
      </Specimen>

      <Specimen name="Tooltip.Group" hint="positions">
        <Tooltip.Group openDelay={100} closeDelay={80}>
          <Row>
            <Tooltip label="Top" position="top">
              <Button variant="default" size="xs">Top</Button>
            </Tooltip>
            <Tooltip label="Right" position="right">
              <Button variant="default" size="xs">Right</Button>
            </Tooltip>
            <Tooltip label="Bottom" position="bottom">
              <Button variant="default" size="xs">Bottom</Button>
            </Tooltip>
            <Tooltip label="Left" position="left">
              <Button variant="default" size="xs">Left</Button>
            </Tooltip>
          </Row>
        </Tooltip.Group>
      </Specimen>

      {/* ── SKELETON ───────────────────────────────────────── */}
      <Specimen name="Skeleton" hint="loading placeholder">
        <Group gap="sm" w="100%" wrap="nowrap" align="flex-start">
          <Skeleton height={40} circle />
          <Stack gap={8} style={{ flex: 1 }}>
            <Skeleton height={9} width="55%" />
            <Skeleton height={9} />
            <Skeleton height={9} width="80%" />
          </Stack>
        </Group>
      </Specimen>

      {/* ── NOTIFICATIONS ──────────────────────────────────── */}
      <Specimen name="Notification" hint="states" span={wide ? 2 : 1} minH={0}>
        <Stack gap="sm" w="100%">
          <Notification title="Workspace updated" onClose={noop} withCloseButton={false}>
            Your settings were saved a moment ago.
          </Notification>
          <Notification loading title="Syncing changes" onClose={noop} withCloseButton={false}>
            Uploading 3 files to the server…
          </Notification>
          <Notification
            color="teal"
            icon={<CircleCheck size={18} />}
            title="Export complete"
            onClose={noop}
          >
            Your CSV is ready to download.
          </Notification>
        </Stack>
      </Specimen>

      {/* ── OVERLAYS ───────────────────────────────────────── */}
      <Specimen name="Modal" hint="useDisclosure">
        <>
          <Button variant="default" onClick={modal.open}>
            Open modal
          </Button>
          <Modal opened={modalOpened} onClose={modal.close} title="Invite teammate">
            <Stack gap="md">
              <Text variant="secondary">
                Send an invitation to join this workspace. They will get access to all shared projects.
              </Text>
              <Divider />
              <Group justify="flex-end" gap="sm">
                <Button variant="default" onClick={modal.close}>
                  Cancel
                </Button>
                <Button onClick={modal.close}>Send invite</Button>
              </Group>
            </Stack>
          </Modal>
        </>
      </Specimen>

      <Specimen name="Drawer" hint="slide-in panel">
        <>
          <Button variant="default" onClick={drawer.open}>
            Open drawer
          </Button>
          <Drawer opened={drawerOpened} onClose={drawer.close} position="right" title="Panel settings" size={wide ? 'sm' : '100%'}>
            <Stack gap="md">
              <Text variant="secondary">
                A slide-in panel on a frosted backdrop — strong hairline edge and real layered depth.
              </Text>
              <Divider />
              <Stack gap="xs">
                <Group gap="xs">
                  <Settings size={16} />
                  <Text fz="sm">Workspace preferences</Text>
                </Group>
                <Group gap="xs">
                  <RefreshCw size={16} />
                  <Text fz="sm">Sync frequency</Text>
                </Group>
              </Stack>
              <Button variant="default" onClick={drawer.close}>
                Done
              </Button>
            </Stack>
          </Drawer>
        </>
      </Specimen>

      <Specimen name="Popover" hint="trigger + dropdown">
        <Popover width={240} position="bottom">
          <Popover.Target>
            <Button variant="default">Open popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack gap={6}>
              <Text variant="label">
                Keyboard shortcuts
              </Text>
              <Text variant="meta">
                A clean, arrowless dropdown on the body surface — hairline border, layered shadow.
              </Text>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Specimen>

      <Specimen name="HoverCard" hint="profile preview">
        <HoverCard width={260} position="top">
          <HoverCard.Target>
            <Group gap="xs" style={{ cursor: 'default' }}>
              <Avatar radius="xl" size={32} color="neutral">JV</Avatar>
              <Text fz="sm" fw={500}>@joana.v</Text>
            </Group>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Group gap="sm" wrap="nowrap">
              <Avatar radius="xl" size={44} color="neutral">JV</Avatar>
              <Stack gap={2}>
                <Text variant="label">Joana Viana</Text>
                <Text variant="meta">Product Engineer · Lisbon</Text>
                <Group gap={6} mt={4}>
                  <Badge size="xs" variant="light" color="neutral">248 commits</Badge>
                  <Badge size="xs" variant="light" color="neutral">12 repos</Badge>
                </Group>
              </Stack>
            </Group>
          </HoverCard.Dropdown>
        </HoverCard>
      </Specimen>

      <Specimen name="LoadingOverlay" hint="toggle over a card">
        <Stack gap="sm" w="100%" align="center">
          <Box
            style={{
              position: 'relative',
              width: '100%',
              border: '1px solid var(--app-border)',
              borderRadius: 'var(--mantine-radius-lg)',
              background: 'var(--app-surface)',
              padding: 'var(--mantine-spacing-md)',
            }}
          >
            <LoadingOverlay visible={loading} />
            <Stack gap={6}>
              <Text variant="label">Monthly report</Text>
              <Text variant="meta">Revenue is up 12% versus the prior period.</Text>
              <Progress value={62} mt={4} />
            </Stack>
          </Box>
          <Button variant="default" size="xs" onClick={loadingCtl.toggle}>
            {loading ? 'Hide' : 'Show'} loading overlay
          </Button>
        </Stack>
      </Specimen>

      <Specimen name="Overlay" hint="scrim primitive">
        <Box
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 120,
            border: '1px solid var(--app-border)',
            borderRadius: 'var(--mantine-radius-lg)',
            background: 'var(--app-surface)',
            padding: 'var(--mantine-spacing-md)',
            overflow: 'hidden',
          }}
        >
          <Stack gap={6}>
            <Text variant="label">Premium template</Text>
            <Text variant="meta">Unlock to edit this layout and export assets.</Text>
          </Stack>
          {scrim && (
            <Overlay center backgroundOpacity={0.4} blur={2} radius="lg">
              <Button size="xs" onClick={() => setScrim(false)}>
                Dismiss overlay
              </Button>
            </Overlay>
          )}
          {!scrim && (
            <Button variant="default" size="xs" mt="md" onClick={() => setScrim(true)}>
              Show overlay
            </Button>
          )}
        </Box>
      </Specimen>

      <Specimen name="Dialog" hint="corner toast">
        <>
          <Button variant="default" onClick={dialog.toggle}>
            {dialogOpened ? 'Close' : 'Open'} dialog
          </Button>
          <Dialog
            opened={dialogOpened}
            onClose={dialog.close}
            withCloseButton
            size="lg"
            position={{ bottom: 20, right: 20 }}
          >
            <Text variant="label" mb={4}>Subscribe to updates</Text>
            <Text variant="meta" mb="sm">
              A floating corner dialog with a hairline edge and real depth.
            </Text>
            <Group gap="xs" justify="flex-end">
              <Button variant="default" size="xs" onClick={dialog.close}>Later</Button>
              <Button size="xs" onClick={dialog.close}>Subscribe</Button>
            </Group>
          </Dialog>
        </>
      </Specimen>

      <Specimen name="Collapse" hint="toggle open/close">
        <Stack gap="sm" w="100%">
          <Group justify="space-between">
            <Text fz="sm" fw={500}>Advanced options</Text>
            <ActionIcon variant="default" size="sm" onClick={collapse.toggle} aria-label="Toggle">
              <ChevronDown
                size={15}
                style={{
                  transform: collapseOpened ? 'rotate(180deg)' : 'none',
                  transition: 'transform 160ms var(--app-ease-out)',
                }}
              />
            </ActionIcon>
          </Group>
          <Collapse expanded={collapseOpened}>
            <Stack
              gap="xs"
              p="sm"
              style={{
                border: '1px solid var(--app-border)',
                borderRadius: 'var(--mantine-radius-md)',
                background: 'var(--app-bg)',
              }}
            >
              <Text variant="meta">Rate limit, retries and webhook secrets live here.</Text>
              <Progress value={30} size="xs" />
            </Stack>
          </Collapse>
        </Stack>
      </Specimen>
    </SpecimenGrid>
  );
}
