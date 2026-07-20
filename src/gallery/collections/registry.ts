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
import { PromptComposer } from './PromptComposer';
import { AskAiBar } from './AskAiBar';
import { GhostCompletion } from './GhostCompletion';
import { StreamingReply } from './StreamingReply';
import { ReasoningTrace } from './ReasoningTrace';
import { AgentRunTimeline } from './AgentRunTimeline';
import { ResponseActions } from './ResponseActions';
import { SourceCitations } from './SourceCitations';
import { VoiceOrb } from './VoiceOrb';
import { AgentPicker } from './AgentPicker';
import { ToolCalling } from './ToolCalling';
import { AgentMentionComposer } from './AgentMentionComposer';
import { AskAnything } from './askanything/AskAnything';
import { AmbientOrb } from './AmbientOrb';
import { SelectionSpark } from './SelectionSpark';
import { AgentHandoff } from './AgentHandoff';
import { ThinkingCloud } from './ThinkingCloud';

export interface Collection {
  id: string;
  title: string;
  description: string;
  Component: ComponentType;
}

/** AI-product patterns — animation-forward, the "how AI feels" showcase. */
export const AI_PATTERNS: Collection[] = [
  { id: 'prompt-composer', title: 'AI composer', description: 'A prompt composer with slash commands and an animated send.', Component: PromptComposer },
  { id: 'ask-ai-bar', title: 'Ask AI', description: 'An omni bar with a cycling prompt and a streaming answer.', Component: AskAiBar },
  { id: 'ghost-completion', title: 'Ghost completion', description: 'Inline AI autocomplete with Tab to accept.', Component: GhostCompletion },
  { id: 'streaming-reply', title: 'Streaming reply', description: 'An assistant response streaming in token by token.', Component: StreamingReply },
  { id: 'reasoning-trace', title: 'Reasoning trace', description: 'A collapsible chain-of-thought that reveals as it thinks.', Component: ReasoningTrace },
  { id: 'agent-run', title: 'Agent run', description: 'A live multi-step agent run completing in real time.', Component: AgentRunTimeline },
  { id: 'tool-calling', title: 'Tool calling', description: 'Sequential tool calls that run, morph to a check, and expand to reveal args + result.', Component: ToolCalling },
  { id: 'response-actions', title: 'Response actions', description: 'Copy, rate and regenerate with tactile micro-feedback.', Component: ResponseActions },
  { id: 'source-citations', title: 'Citations', description: 'Sources that reveal on a stagger and preview on hover.', Component: SourceCitations },
  { id: 'voice-orb', title: 'Voice input', description: 'A breathing gradient orb that listens.', Component: VoiceOrb },
  { id: 'agent-picker', title: 'Agent picker', description: 'Choose an agent, each a grainy gradient identity.', Component: AgentPicker },
  { id: 'agent-mention', title: 'Agent anywhere', description: 'Call an agent from any text box — type @ to tag one inline, gradient orb and all.', Component: AgentMentionComposer },
  { id: 'ask-anything', title: 'Ask anything', description: 'Hold ⌘ and the dashboard orbitises — point the agent orb at any tile to ask about it.', Component: AskAnything },
  { id: 'ambient-orb', title: 'Ambient orb', description: 'A docked assistant that breathes quietly in the corner and unfurls into a scoped composer on click.', Component: AmbientOrb },
  { id: 'selection-spark', title: 'Selection spark', description: 'Select any text and a gradient-orb toolbar sparks up with quick, scoped AI actions.', Component: SelectionSpark },
  { id: 'agent-handoff', title: 'Agent handoff', description: 'A gradient baton passes between agents — the incoming one lights up the instant it lands.', Component: AgentHandoff },
  { id: 'thinking-cloud', title: 'Thinking cloud', description: 'A drifting gradient nebula instead of a spinner — it dissolves to reveal the answer once the agent resolves.', Component: ThinkingCloud },
];

/** Product blocks — everyday building blocks, not AI-specific. */
export const PRODUCT_BLOCKS: Collection[] = [
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
