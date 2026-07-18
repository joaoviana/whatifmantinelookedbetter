/* CONTRACT: export function AgentPicker() — selectable agent cards, each with a grainy
   gradient avatar, hover lift, an animated selection ring, and a subtle "online" pulse.

   Aesthetic: Attio / Linear / Vercel refined monochrome surfaces (theme tokens);
   the ONLY color is the grainy mesh-gradient avatar per agent. Self-contained — the
   avatar technique (layered radial blobs + white bloom + feTurbulence grain) is
   rebuilt in AgentPicker.module.css, not imported from templates. */
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Badge, Group, SimpleGrid, Text, Title, UnstyledButton } from '@mantine/core';
import { Check } from 'lucide-react';
import classes from './AgentPicker.module.css';

interface Agent {
  id: string;
  name: string;
  specialty: string;
  capabilities: string[];
  /** Three gradient stops — the agent's only color. */
  stops: [string, string, string];
  /** Stagger the slow avatar drift so the grid never pulses in lockstep. */
  drift: number;
}

const AGENTS: Agent[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    specialty: 'Full-stack architecture & refactors',
    capabilities: ['Code', 'Refactor'],
    stops: ['#c7d2fe', '#a5b4fc', '#e0e7ff'],
    drift: 0,
  },
  {
    id: 'lyra',
    name: 'Lyra',
    specialty: 'Data analysis & SQL insight',
    capabilities: ['SQL', 'Charts'],
    stops: ['#99f6e4', '#5eead4', '#ccfbf1'],
    drift: -3.5,
  },
  {
    id: 'nova',
    name: 'Nova',
    specialty: 'Creative copy & storytelling',
    capabilities: ['Writing', 'Ideation'],
    stops: ['#f9a8d4', '#f0abfc', '#fce7f3'],
    drift: -7,
  },
  {
    id: 'orion',
    name: 'Orion',
    specialty: 'Research & web synthesis',
    capabilities: ['Research', 'Web'],
    stops: ['#bae6fd', '#a5b4fc', '#e0f2fe'],
    drift: -10.5,
  },
  {
    id: 'sage',
    name: 'Sage',
    specialty: 'Support triage & fast replies',
    capabilities: ['Support', 'Triage'],
    stops: ['#fde68a', '#fca5a5', '#fee2e2'],
    drift: -14,
  },
  {
    id: 'vega',
    name: 'Vega',
    specialty: 'Design systems & UI polish',
    capabilities: ['Design', 'UI'],
    stops: ['#ddd6fe', '#c4b5fd', '#ede9fe'],
    drift: -17.5,
  },
];

function AgentAvatar({ agent }: { agent: Agent }) {
  const [c0, c1, c2] = agent.stops;
  return (
    <div
      className={classes.avatar}
      style={
        {
          '--c0': c0,
          '--c1': c1,
          '--c2': c2,
        } as CSSProperties
      }
    >
      <div className={classes.mesh} style={{ animationDelay: `${agent.drift}s` }} />
      <div className={classes.specular} />
      <div className={classes.grain} />
    </div>
  );
}

export function AgentPicker() {
  const [selected, setSelected] = useState<string>('atlas');

  return (
    <div className={classes.wrap}>
      <div className={classes.head}>
        <Text className="eyebrow" component="p">
          Agents
        </Text>
        <Title order={3} className={classes.title} mt={6}>
          Choose your agent
        </Title>
        <Text className={classes.subtitle}>
          Six specialists, ready to jump in. Pick one to start a session.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md" verticalSpacing="md">
        {AGENTS.map((agent) => {
          const isSelected = selected === agent.id;
          return (
            <UnstyledButton
              key={agent.id}
              className={classes.card}
              data-selected={isSelected || undefined}
              aria-pressed={isSelected}
              aria-label={`Select ${agent.name} — ${agent.specialty}`}
              onClick={() => setSelected(agent.id)}
            >
              <span className={classes.ring} aria-hidden />
              <span className={classes.check} aria-hidden>
                <Check size={14} strokeWidth={3} />
              </span>

              <AgentAvatar agent={agent} />

              <div>
                <Group gap={7} align="center" wrap="nowrap">
                  <Text className={classes.name}>{agent.name}</Text>
                  <span className={classes.status} aria-hidden title="Online" />
                </Group>
                <Text className={classes.specialty} mt={3}>
                  {agent.specialty}
                </Text>
              </div>

              <Group gap={6} className={classes.chips}>
                {agent.capabilities.map((cap) => (
                  <Badge key={cap} variant="default" size="sm" radius="sm" fw={500}>
                    {cap}
                  </Badge>
                ))}
              </Group>
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
