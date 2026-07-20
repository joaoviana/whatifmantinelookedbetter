import type { ComponentType } from 'react';
import * as aiPatterns from './sections/aiPatterns';
import * as blocks from './sections/blocks';
import * as actions from './sections/actions';
import * as inputs from './sections/inputs';
import * as dataDisplay from './sections/dataDisplay';
import * as feedback from './sections/feedback';
import * as navigation from './sections/navigation';

export interface SectionModule {
  meta: { id: string; label: string; description: string };
  Section: ComponentType;
}

/** Nav groups for a clearer structure. */
export interface SectionGroup {
  label: string;
  sections: SectionModule[];
}

export interface GalleryRegistry {
  groups: SectionGroup[];
  sections: SectionModule[];
}

function toRegistry(groups: SectionGroup[]): GalleryRegistry {
  return { groups, sections: groups.flatMap((g) => g.sections) };
}

/** /patterns — the AI-forward showcase: composer, streaming, agent runs, tool calls. */
export const patternsRegistry: GalleryRegistry = toRegistry([
  { label: 'AI Patterns', sections: [aiPatterns] },
]);

/** /glossary — the raw component building blocks: Mantine primitives + composed product blocks. */
export const glossaryRegistry: GalleryRegistry = toRegistry([
  { label: 'Components', sections: [actions, inputs, dataDisplay, feedback, navigation] },
  { label: 'Building Blocks', sections: [blocks] },
]);
