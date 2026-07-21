import type { CSSProperties } from 'react';
import { Text } from '@mantine/core';
import { CornerDownRight } from 'lucide-react';
import { AGENTS_BY_ID, CONVERSATION, type Message } from './agents';
import { MessageBubble } from './MessageBubble';
import { AgentAvatar } from './AgentAvatar';
import classes from './Thread.module.css';

/* CONTRACT: export function Thread() — the conversation thread / orchestration flow.
   Renders CONVERSATION from './agents' via <MessageBubble>, with the multi-agent
   choreography (delegation, tool chips, code, streaming). This teammate owns it. */
export function Thread({ messages = CONVERSATION }: { messages?: Message[] }) {
  // The thread reads as a run: a user ask, the orchestrator's plan, then a
  // delegated fan-out. Split on the orchestrator (Atlas) so the hand-off is explicit.
  const orchestratorIndex = messages.findIndex((m) => m.authorId === 'atlas');
  const lead = orchestratorIndex >= 0 ? messages.slice(0, orchestratorIndex + 1) : messages;
  const delegated = orchestratorIndex >= 0 ? messages.slice(orchestratorIndex + 1) : [];

  const orchestrator = orchestratorIndex >= 0 ? AGENTS_BY_ID[messages[orchestratorIndex].authorId] : undefined;
  // Unique delegated agents, in first-appearance order — powers the header cluster + dots.
  const delegatedAgents = Array.from(
    new Map(delegated.map((m) => [m.authorId, AGENTS_BY_ID[m.authorId]])).values(),
  );

  return (
    <div className={classes.thread}>
      <div className={classes.column}>
        {/* Orchestration header — the run's framing. */}
        {orchestrator && delegatedAgents.length > 0 && (
          <div className={classes.orchestration}>
            <div className={classes.cluster}>
              {delegatedAgents.map((a) => (
                <div key={a.id} className={classes.clusterItem}>
                  <AgentAvatar agent={a} size={26} />
                </div>
              ))}
            </div>
            <div className={classes.orchText}>
              <Text variant="eyebrow" span>Orchestration</Text>
              <div className={classes.orchTitle}>
                <strong>{orchestrator.name}</strong> is coordinating {delegatedAgents.length} agents
              </div>
            </div>
          </div>
        )}

        {/* User ask + orchestrator plan. */}
        {lead.map((m) => (
          <div key={m.id} className={classes.turn}>
            <MessageBubble message={m} />
          </div>
        ))}

        {/* Hand-off divider — the orchestrator delegates. */}
        {delegatedAgents.length > 0 && (
          <div className={classes.handoff}>
            <span className={classes.handoffLine} />
            <span className={classes.handoffLabel}>
              <CornerDownRight size={12} />
              {orchestrator?.name ?? 'Orchestrator'} delegated to {delegatedAgents.length} agents
              <span className={classes.handoffDots}>
                {delegatedAgents.map((a) => (
                  <span key={a.id} className={classes.handoffDot} style={{ '--dot': a.accent } as CSSProperties} />
                ))}
              </span>
            </span>
            <span className={classes.handoffLine} />
          </div>
        )}

        {/* Delegated fan-out on a thin timeline rail. */}
        {delegated.length > 0 && (
          <div className={classes.delegatedGroup}>
            {delegated.map((m) => {
              const agent = AGENTS_BY_ID[m.authorId];
              const streaming = m.kind === 'streaming';
              return (
                <div
                  key={m.id}
                  className={streaming ? `${classes.step} ${classes.stepLive}` : classes.step}
                  style={{ '--step-accent': agent.accent } as CSSProperties}
                >
                  <MessageBubble message={m} />
                  {streaming && (
                    <div className={classes.live}>
                      <span className={classes.liveDots}>
                        <span className={classes.liveDot} />
                        <span className={classes.liveDot} />
                        <span className={classes.liveDot} />
                      </span>
                      <span className={classes.liveLabel}>Streaming response</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
