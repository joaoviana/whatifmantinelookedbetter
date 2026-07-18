/* CONTRACT: export function TeamMembers() — a composed block from the themed components.
   A members management list: avatars, role selects, status, invite row. Theme tokens, lucide-react. */
import { useMemo, useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Group,
  Menu,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { MoreHorizontal, Trash2, UserCog, UserPlus, Mail } from 'lucide-react';
import classes from './TeamMembers.module.css';

type Status = 'active' | 'invited';

interface Member {
  name: string;
  email: string;
  role: string;
  status: Status;
}

const ROLES = ['Owner', 'Admin', 'Member', 'Viewer'];

const MEMBERS: Member[] = [
  { name: 'Maya Chen', email: 'maya.chen@northwind.io', role: 'Owner', status: 'active' },
  { name: 'Leo Almeida', email: 'leo.almeida@northwind.io', role: 'Admin', status: 'active' },
  { name: 'Ada Park', email: 'ada.park@northwind.io', role: 'Member', status: 'active' },
  { name: 'Noah Kim', email: 'noah.kim@northwind.io', role: 'Member', status: 'active' },
  { name: 'Sofia Rossi', email: 'sofia.rossi@northwind.io', role: 'Viewer', status: 'active' },
  { name: 'Ivan Novak', email: 'ivan.novak@northwind.io', role: 'Member', status: 'invited' },
];

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const roleData = ROLES.map((role) => ({ value: role, label: role }));

export function TeamMembers() {
  const [roles, setRoles] = useState<Record<string, string>>(() =>
    Object.fromEntries(MEMBERS.map((m) => [m.email, m.role])),
  );
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string | null>('Member');

  const activeCount = useMemo(
    () => MEMBERS.filter((m) => m.status === 'active').length,
    [],
  );

  return (
    <div className={classes.wrap}>
      <Card className={classes.card} padding={0} radius="lg">
        <Group className={classes.header} justify="space-between" wrap="nowrap">
          <Group gap={10} align="baseline" wrap="nowrap">
            <Title order={3} fz="lg">
              Members
            </Title>
            <Text className={classes.count}>{MEMBERS.length}</Text>
          </Group>
          <Button size="sm" leftSection={<UserPlus size={15} strokeWidth={2} />}>
            Invite
          </Button>
        </Group>

        <div>
          {MEMBERS.map((member) => {
            const pending = member.status === 'invited';
            return (
              <div
                key={member.email}
                className={classes.row}
                data-pending={pending || undefined}
              >
                <Group className={classes.identity} gap={12} wrap="nowrap">
                  <Avatar size={38} radius="xl" color="neutral">
                    {initials(member.name)}
                  </Avatar>
                  <div className={classes.person}>
                    <Group gap={8} wrap="nowrap" align="center">
                      <Text className={classes.name}>{member.name}</Text>
                      <span className={classes.dot} data-status={member.status} />
                    </Group>
                    <Text className={classes.email}>
                      {pending ? 'Pending invite' : member.email}
                    </Text>
                  </div>
                </Group>

                <Group gap={4} wrap="nowrap">
                  <Select
                    size="sm"
                    w={128}
                    variant="default"
                    data={roleData}
                    value={roles[member.email]}
                    onChange={(value) =>
                      value &&
                      setRoles((prev) => ({ ...prev, [member.email]: value }))
                    }
                    allowDeselect={false}
                    comboboxProps={{ width: 160, position: 'bottom-end' }}
                    aria-label={`Role for ${member.name}`}
                  />
                  <Menu position="bottom-end" width={172} withinPortal>
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="lg"
                        aria-label={`Actions for ${member.name}`}
                      >
                        <MoreHorizontal size={17} strokeWidth={2} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<UserCog size={15} strokeWidth={2} />}>
                        Change role
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<Trash2 size={15} strokeWidth={2} />}
                      >
                        Remove
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </div>
            );
          })}
        </div>

        <div className={classes.invite}>
          <TextInput
            className={classes.inviteEmail}
            size="sm"
            label="Invite by email"
            placeholder="name@company.com"
            leftSection={<Mail size={15} strokeWidth={2} />}
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.currentTarget.value)}
          />
          <Select
            size="sm"
            w={128}
            variant="default"
            data={roleData}
            value={inviteRole}
            onChange={setInviteRole}
            allowDeselect={false}
            comboboxProps={{ width: 160, position: 'bottom-end' }}
            aria-label="Role for invited member"
          />
          <Button size="sm" variant="default" disabled={!inviteEmail.trim()}>
            Send invite
          </Button>
        </div>
      </Card>

      <Text ta="center" size="xs" c="dimmed" mt={12}>
        {activeCount} active · {MEMBERS.length - activeCount} pending
      </Text>
    </div>
  );
}
