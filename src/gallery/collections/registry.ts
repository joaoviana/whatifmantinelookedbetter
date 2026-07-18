import type { ComponentType } from 'react';
import { Pricing } from './Pricing';
import { SignIn } from './SignIn';
import { SettingsPanel } from './SettingsPanel';
import { StatsDashboard } from './StatsDashboard';
import { DataTableToolbar } from './DataTableToolbar';
import { CommandPalette } from './CommandPalette';
import { EmptyState } from './EmptyState';
import { TeamMembers } from './TeamMembers';
import { Checkout } from './Checkout';
import { Onboarding } from './Onboarding';

export interface Collection {
  id: string;
  title: string;
  description: string;
  Component: ComponentType;
}

/** Curated blocks composed from the themed components. */
export const COLLECTIONS: Collection[] = [
  { id: 'stats-dashboard', title: 'Stats dashboard', description: 'A KPI row with sparklines and a compact table.', Component: StatsDashboard },
  { id: 'data-table', title: 'Data table + toolbar', description: 'Search, filter, selection, row actions and pagination.', Component: DataTableToolbar },
  { id: 'pricing', title: 'Pricing', description: 'Three tiers with feature lists and a highlighted plan.', Component: Pricing },
  { id: 'sign-in', title: 'Sign in', description: 'Email, password, social auth and a clean divider.', Component: SignIn },
  { id: 'settings', title: 'Settings panel', description: 'Profile fields, preference switches and a save bar.', Component: SettingsPanel },
  { id: 'command-palette', title: 'Command palette', description: 'A ⌘K menu with grouped, keyboard-driven commands.', Component: CommandPalette },
  { id: 'team-members', title: 'Team members', description: 'Roster with roles, status and an invite row.', Component: TeamMembers },
  { id: 'checkout', title: 'Checkout', description: 'Order summary paired with a payment form.', Component: Checkout },
  { id: 'onboarding', title: 'Onboarding', description: 'A multi-step flow with a stepper and progress.', Component: Onboarding },
  { id: 'empty-state', title: 'Empty states', description: 'Polished zero-data states with clear next actions.', Component: EmptyState },
];
