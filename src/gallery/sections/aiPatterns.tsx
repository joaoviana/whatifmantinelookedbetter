import { AI_PATTERNS } from '../collections/registry';
import { CollectionsList } from './collectionsList';

export const meta = {
  id: 'ai-patterns',
  label: 'AI Patterns',
  description: 'The animation-forward patterns that make an AI product feel alive — composer, streaming, agent runs, tool calls.',
};

export function Section() {
  return <CollectionsList items={AI_PATTERNS} />;
}
