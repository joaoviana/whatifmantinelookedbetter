import { useState } from 'react';
import { Box, SegmentedControl } from '@mantine/core';
import { GalleryShell } from './gallery/GalleryShell';
import { AgentStudio } from './templates/AgentStudio';
import { AgentChat } from './templates/agentchat/AgentChat';

const VIEWS: Record<string, () => React.JSX.Element> = {
  gallery: GalleryShell,
  studio: AgentStudio,
  multiagent: AgentChat,
};

export function App() {
  const [view, setView] = useState('gallery');
  const View = VIEWS[view] ?? GalleryShell;

  return (
    <>
      <View />

      {/* Floating view switcher — always on top of whichever full-page shell. */}
      <Box
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        <SegmentedControl
          value={view}
          onChange={setView}
          radius="xl"
          data={[
            { label: 'Components', value: 'gallery' },
            { label: 'Agent', value: 'studio' },
            { label: 'Multi-agent', value: 'multiagent' },
          ]}
          styles={{
            root: {
              boxShadow: 'var(--mantine-shadow-lg)',
              border: '1px solid var(--app-border)',
              background: 'var(--app-surface)',
            },
          }}
        />
      </Box>
    </>
  );
}
