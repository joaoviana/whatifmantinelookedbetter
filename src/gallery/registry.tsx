import type { ComponentType } from 'react';
import { Box } from '@mantine/core';
import { AI_PATTERNS, type Collection } from './collections/registry';
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

/** Each AI pattern becomes its own left-nav entry — the title/description
    already come from SectionIntro, so the framed demo is all this renders. */
function toSectionModule({ id, title, description, Component }: Collection): SectionModule {
  return {
    meta: { id, label: title, description },
    Section: () => (
      <Box
        style={{
          border: '1px solid var(--app-border)',
          borderRadius: 'var(--mantine-radius-lg)',
          background: 'var(--app-bg)',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <Component />
      </Box>
    ),
  };
}

/** /patterns — the AI-forward showcase: composer, streaming, agent runs, tool calls. */
export const patternsRegistry: GalleryRegistry = toRegistry([
  { label: 'AI Patterns', sections: AI_PATTERNS.map(toSectionModule) },
]);

/** /glossary — the raw component building blocks: Mantine primitives + composed product blocks. */
export const glossaryRegistry: GalleryRegistry = toRegistry([
  { label: 'Components', sections: [actions, inputs, dataDisplay, feedback, navigation] },
  { label: 'Building Blocks', sections: [blocks] },
]);
