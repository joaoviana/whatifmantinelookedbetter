/**
 * Shared contract for the multi-agent chat (orchestrator-owned, read-only for panel agents).
 * Panel components import these types + data so the whole experience stays coherent.
 */

export type AgentStatus = 'online' | 'thinking' | 'idle';

export interface Agent {
  id: string;
  name: string;
  role: string;
  /** Soft, desaturated color seeds the AgentAvatar builds a mesh gradient from. */
  gradient: string[];
  accent: string;
  status: AgentStatus;
}

export type MessageKind = 'text' | 'tool' | 'code' | 'streaming' | 'chart';

/** A tiny, theme-rendered chart spec (bar or line), 1–2 series. */
export interface ChartSpec {
  type: 'bar' | 'line';
  title: string;
  caption?: string;
  unit?: string;
  categories: string[];
  series: { name: string; values: number[] }[];
}

export interface Message {
  id: string;
  /** Agent id, or 'user'. */
  authorId: string;
  role: 'user' | 'agent';
  text: string;
  kind?: MessageKind;
  tool?: { label: string; meta?: string };
  code?: string;
  language?: string;
  sources?: { label: string; meta?: string }[];
  chart?: ChartSpec;
}

export const USER: Agent = {
  id: 'user',
  name: 'You',
  role: 'You',
  gradient: ['#e4e4e7', '#d4d4d8', '#f4f4f5'],
  accent: '#71717a',
  status: 'online',
};

export const AGENTS: Agent[] = [
  { id: 'atlas', name: 'Atlas', role: 'Orchestrator', gradient: ['#c7d2fe', '#a5b4fc', '#e0e7ff'], accent: '#6366f1', status: 'online' },
  { id: 'vera', name: 'Vera', role: 'Analyst', gradient: ['#99f6e4', '#5eead4', '#ccfbf1'], accent: '#14b8a6', status: 'online' },
  { id: 'kilo', name: 'Kilo', role: 'Analytics Engineer', gradient: ['#fde68a', '#fca5a5', '#fee2e2'], accent: '#f59e0b', status: 'online' },
  { id: 'nadia', name: 'Nadia', role: 'Data QA', gradient: ['#f9a8d4', '#f0abfc', '#fce7f3'], accent: '#ec4899', status: 'online' },
  { id: 'sol', name: 'Sol', role: 'Planner', gradient: ['#bae6fd', '#a5b4fc', '#e0f2fe'], accent: '#0ea5e9', status: 'thinking' },
];

export const AGENTS_BY_ID: Record<string, Agent> = Object.fromEntries(
  [USER, ...AGENTS].map((a) => [a.id, a]),
);

/** THREAD 1 — a revenue reconciliation, closed out with a chart of the fix. */
const RECONCILIATION: Message[] = [
  {
    id: 'r1',
    authorId: 'user',
    role: 'user',
    text: 'Finance closed Q4 revenue at $2.41M, but our BI dashboard shows $2.61M for the same period. Can the team find why they diverge and fix the model?',
  },
  {
    id: 'r2',
    authorId: 'atlas',
    role: 'agent',
    text: 'On it. Vera will trace the revenue metric’s lineage against the finance definition, Kilo will patch the model, and Nadia will validate before Sol plans the rollout.',
  },
  {
    id: 'r3',
    authorId: 'vera',
    role: 'agent',
    kind: 'tool',
    tool: { label: 'Traced metric lineage', meta: '3 sources' },
    text: 'Found it. The dashboard metric sums orders.amount for all orders, while finance excludes refunded and internal test accounts. The $200K gap is $172K in refunds plus $28K from test workspaces still flagged as paying.',
    sources: [{ label: 'metrics/total_revenue.yml' }, { label: 'fct_orders.sql' }, { label: 'finance_close_q4.csv' }],
  },
  {
    id: 'r4',
    authorId: 'vera',
    role: 'agent',
    kind: 'chart',
    text: 'Here’s the gap broken down against the finance close:',
    chart: {
      type: 'bar',
      title: 'Q4 revenue by definition',
      caption: 'USD millions',
      unit: '$M',
      categories: ['BI dashboard', 'Reconciled', 'Finance close'],
      series: [{ name: 'Revenue', values: [2.61, 2.41, 2.41] }],
    },
  },
  {
    id: 'r5',
    authorId: 'kilo',
    role: 'agent',
    kind: 'code',
    language: 'sql',
    text: 'Aligning total_revenue with the finance definition — exclude refunds and test accounts:',
    code: "sum(case\n  when o.status = 'refunded' then 0\n  when c.is_internal then 0\n  else o.amount\nend) as total_revenue",
  },
  {
    id: 'r6',
    authorId: 'nadia',
    role: 'agent',
    text: 'Recomputed against the finance close — lands at $2.41M, exact match. Add a not-null test on order status and an accepted-values test on is_internal so this can’t drift again. Approved.',
  },
  {
    id: 'r7',
    authorId: 'sol',
    role: 'agent',
    kind: 'streaming',
    text: 'Planning the rollout — ship the fct_orders change behind a staging build, backfill 18 months, then reconcile the dashboard and notify Finance…',
  },
];

/** THREAD 2 — a weekly growth review, presented with several charts. */
const GROWTH_REVIEW: Message[] = [
  {
    id: 'g1',
    authorId: 'user',
    role: 'user',
    text: 'Put together this week’s growth review — where are we up, where are we soft, and what should we act on?',
  },
  {
    id: 'g2',
    authorId: 'atlas',
    role: 'agent',
    text: 'On it. Vera will pull the top-line trend, Kilo the revenue mix, and Sol the activation read. I’ll stitch it into a recommendation.',
  },
  {
    id: 'g3',
    authorId: 'vera',
    role: 'agent',
    kind: 'chart',
    text: 'New signups climbed for the fourth straight week — up 34% over the window.',
    chart: {
      type: 'line',
      title: 'Weekly signups',
      caption: 'Last 8 weeks',
      unit: '',
      categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      series: [{ name: 'Signups', values: [820, 910, 875, 1040, 1120, 1180, 1240, 1360] }],
    },
  },
  {
    id: 'g4',
    authorId: 'kilo',
    role: 'agent',
    kind: 'chart',
    text: 'Revenue mix is tilting to Pro — it just overtook Starter for the first time.',
    chart: {
      type: 'bar',
      title: 'Revenue by plan',
      caption: 'This month · USD thousands',
      unit: '$k',
      categories: ['Starter', 'Pro', 'Enterprise'],
      series: [{ name: 'Revenue', values: [128, 204, 312] }],
    },
  },
  {
    id: 'g5',
    authorId: 'sol',
    role: 'agent',
    kind: 'chart',
    text: 'Activation is the soft spot — we lose the most people between signup and first query.',
    chart: {
      type: 'bar',
      title: 'Activation funnel',
      caption: 'Conversion by step',
      unit: '%',
      categories: ['Signup', 'Invite', 'Connect', 'First query'],
      series: [{ name: 'Reached', values: [100, 72, 51, 38] }],
    },
  },
  {
    id: 'g6',
    authorId: 'atlas',
    role: 'agent',
    text: 'Recommendation: signups and Pro revenue are healthy — protect them. The lever this week is activation; a guided “connect your data” step should recover much of the 51%→38% drop. Shall I open a ticket?',
  },
];

export const THREADS: { id: string; title: string; messages: Message[] }[] = [
  { id: 'reconciliation', title: 'Revenue reconciliation', messages: RECONCILIATION },
  { id: 'growth', title: 'Weekly growth review', messages: GROWTH_REVIEW },
];

/** Back-compat: the primary thread's messages. */
export const CONVERSATION: Message[] = RECONCILIATION;
