import type { ComponentType } from 'react';
import * as collections from './sections/collections';
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

export const groups: SectionGroup[] = [
  { label: 'Collections', sections: [collections] },
  { label: 'Components', sections: [actions, inputs, dataDisplay, feedback, navigation] },
];

/** Flat order = order on the page and in the sidebar. */
export const sections: SectionModule[] = groups.flatMap((g) => g.sections);
