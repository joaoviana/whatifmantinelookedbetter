/* CONTRACT: export function DataTableToolbar() — a composed block from the themed components.
   A data table with a search/filter toolbar, row selection, row actions and pagination. */
import { useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Group,
  Menu,
  Pagination,
  Paper,
  Table,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import {
  Search,
  ListFilter,
  Columns3,
  Plus,
  EllipsisVertical,
  Pencil,
  Copy,
  Trash2,
  Check,
} from 'lucide-react';
import classes from './DataTableToolbar.module.css';

type Status = 'Active' | 'Invited' | 'Suspended';

interface Member {
  id: string;
  name: string;
  email: string;
  status: Status;
  role: string;
  lastActive: string;
}

const MEMBERS: Member[] = [
  { id: 'm1', name: 'Maya Chen', email: 'maya.chen@northwind.io', status: 'Active', role: 'Admin', lastActive: 'Jul 18, 2026' },
  { id: 'm2', name: 'Leo Almeida', email: 'leo@almeida.dev', status: 'Active', role: 'Member', lastActive: 'Jul 17, 2026' },
  { id: 'm3', name: 'Ada Park', email: 'ada.park@lumen.co', status: 'Invited', role: 'Member', lastActive: '—' },
  { id: 'm4', name: 'Idris Okoro', email: 'idris@okoro.studio', status: 'Active', role: 'Billing', lastActive: 'Jul 15, 2026' },
  { id: 'm5', name: 'Sofia Rossi', email: 'sofia.rossi@atlas.eu', status: 'Suspended', role: 'Member', lastActive: 'Jun 30, 2026' },
  { id: 'm6', name: 'Kenji Watanabe', email: 'kenji@watanabe.jp', status: 'Active', role: 'Developer', lastActive: 'Jul 18, 2026' },
  { id: 'm7', name: 'Nora Haddad', email: 'nora.haddad@meridian.app', status: 'Invited', role: 'Viewer', lastActive: '—' },
];

const STATUS_COLOR: Record<Status, string> = {
  Active: 'teal',
  Invited: 'neutral',
  Suspended: 'red',
};

const FILTERS = ['All members', 'Active', 'Invited', 'Suspended'] as const;
const COLUMNS = ['Name', 'Status', 'Role', 'Last active'] as const;

export function DataTableToolbar() {
  const [selected, setSelected] = useState<string[]>(['m2', 'm4']);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All members');
  const [hidden, setHidden] = useState<string[]>([]);

  const allChecked = selected.length === MEMBERS.length;
  const someChecked = selected.length > 0 && !allChecked;

  const toggleAll = () =>
    setSelected(allChecked ? [] : MEMBERS.map((m) => m.id));
  const toggleRow = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const toggleColumn = (col: string) =>
    setHidden((cur) => (cur.includes(col) ? cur.filter((x) => x !== col) : [...cur, col]));

  const shown = (col: string) => !hidden.includes(col);

  return (
    <div className={classes.wrap}>
      <Paper variant="panel" className={classes.panel} p={0} radius="lg">
        {/* ── Toolbar ─────────────────────────────────────────── */}
        <Group className={classes.toolbar} justify="space-between" wrap="wrap" gap="sm">
          <TextInput
            className={classes.search}
            placeholder="Search members…"
            size="sm"
            leftSection={<Search size={15} strokeWidth={1.75} />}
            aria-label="Search members"
          />
          <Group className={classes.toolbarActions} gap="xs" wrap="wrap">
            <Menu position="bottom-end" width={190} withinPortal>
              <Menu.Target>
                <Button
                  variant="default"
                  size="sm"
                  leftSection={<ListFilter size={15} strokeWidth={1.75} />}
                >
                  {filter}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Filter by status</Menu.Label>
                {FILTERS.map((f) => (
                  <Menu.Item
                    key={f}
                    onClick={() => setFilter(f)}
                    rightSection={
                      filter === f ? <Check size={14} strokeWidth={2} /> : null
                    }
                  >
                    {f}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            <Menu position="bottom-end" width={190} withinPortal closeOnItemClick={false}>
              <Menu.Target>
                <Button
                  variant="default"
                  size="sm"
                  leftSection={<Columns3 size={15} strokeWidth={1.75} />}
                >
                  Columns
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Toggle columns</Menu.Label>
                {COLUMNS.map((col) => (
                  <Menu.Item
                    key={col}
                    onClick={() => toggleColumn(col)}
                    rightSection={
                      shown(col) ? <Check size={14} strokeWidth={2} /> : null
                    }
                  >
                    {col}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            <Button size="sm" leftSection={<Plus size={15} strokeWidth={2} />}>
              Add member
            </Button>
          </Group>
        </Group>

        {/* ── Table ───────────────────────────────────────────── */}
        <Table.ScrollContainer minWidth={640} className={classes.scroll}>
          <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={classes.checkCol}>
                  <Checkbox
                    aria-label="Select all rows"
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={toggleAll}
                    size="xs"
                  />
                </Table.Th>
                {shown('Name') && <Table.Th>Name</Table.Th>}
                {shown('Status') && <Table.Th>Status</Table.Th>}
                {shown('Role') && <Table.Th>Role</Table.Th>}
                {shown('Last active') && <Table.Th>Last active</Table.Th>}
                <Table.Th className={classes.actionCol} aria-label="Actions" />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {MEMBERS.map((m) => {
                const isSelected = selected.includes(m.id);
                return (
                  <Table.Tr
                    key={m.id}
                    data-selected={isSelected || undefined}
                    className={classes.row}
                  >
                    <Table.Td className={classes.checkCol}>
                      <Checkbox
                        aria-label={`Select ${m.name}`}
                        checked={isSelected}
                        onChange={() => toggleRow(m.id)}
                        size="xs"
                      />
                    </Table.Td>
                    {shown('Name') && (
                      <Table.Td>
                        <Text size="sm" fw={500} className={classes.name}>
                          {m.name}
                        </Text>
                        <Text size="xs" c="dimmed" className={classes.email}>
                          {m.email}
                        </Text>
                      </Table.Td>
                    )}
                    {shown('Status') && (
                      <Table.Td>
                        <Badge
                          color={STATUS_COLOR[m.status]}
                          variant="light"
                          size="sm"
                          className={classes.statusBadge}
                        >
                          {m.status}
                        </Badge>
                      </Table.Td>
                    )}
                    {shown('Role') && (
                      <Table.Td>
                        <Text size="sm">{m.role}</Text>
                      </Table.Td>
                    )}
                    {shown('Last active') && (
                      <Table.Td>
                        <Text size="sm" c="dimmed" className={classes.tabular}>
                          {m.lastActive}
                        </Text>
                      </Table.Td>
                    )}
                    <Table.Td className={classes.actionCol}>
                      <Menu position="bottom-end" width={168} withinPortal>
                        <Menu.Target>
                          <button
                            type="button"
                            className={classes.rowAction}
                            aria-label={`Actions for ${m.name}`}
                          >
                            <EllipsisVertical size={16} strokeWidth={1.75} />
                          </button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<Pencil size={14} strokeWidth={1.75} />}>
                            Edit
                          </Menu.Item>
                          <Menu.Item leftSection={<Copy size={14} strokeWidth={1.75} />}>
                            Duplicate
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<Trash2 size={14} strokeWidth={1.75} />}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {/* ── Footer ──────────────────────────────────────────── */}
        <Group className={classes.footer} justify="space-between" wrap="wrap" gap="sm">
          <Group gap={6} wrap="nowrap">
            {selected.length > 0 && (
              <ThemeIcon size={18} radius="sm" variant="light" color="neutral">
                <Check size={12} strokeWidth={2.5} />
              </ThemeIcon>
            )}
            <Text size="xs" c="dimmed" className={classes.tabular}>
              <Text span fw={500} c={selected.length > 0 ? undefined : 'dimmed'} inherit>
                {selected.length} selected
              </Text>
              {' · 7 of 128'}
            </Text>
          </Group>
          <Pagination total={19} value={1} size="sm" radius="md" withEdges={false} />
        </Group>
      </Paper>
    </div>
  );
}
