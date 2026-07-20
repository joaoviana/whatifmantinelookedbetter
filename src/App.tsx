import { Box, SegmentedControl } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { GalleryShell } from './gallery/GalleryShell';
import { patternsRegistry, glossaryRegistry } from './gallery/registry';
import { AgentStudio } from './templates/AgentStudio';
import { AgentChat } from './templates/agentchat/AgentChat';

/** Top-level views are real routes now — deep-linkable, not just state. */
const NAV = [
  { label: 'Patterns', value: '/patterns' },
  { label: 'Glossary', value: '/glossary' },
  { label: 'Agent', value: '/agent' },
  { label: 'Multi-agent', value: '/multi-agent' },
];

function ViewSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const value = NAV.some((n) => n.value === pathname) ? pathname : '/patterns';
  // Synchronous first read keeps the very first paint correct (no size flash).
  const isMobile = useMediaQuery('(max-width: 36em)', false, { getInitialValueInEffect: false });

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        // Never wider than the viewport — guards against horizontal page scroll.
        maxWidth: 'calc(100vw - 24px)',
      }}
    >
      <SegmentedControl
        value={value}
        onChange={(v) => navigate(v)}
        radius="xl"
        size={isMobile ? 'xs' : 'sm'}
        data={NAV}
        styles={{
          root: {
            boxShadow: 'var(--mantine-shadow-lg)',
            border: '1px solid var(--app-border)',
            background: 'var(--app-surface)',
            maxWidth: '100%',
          },
        }}
      />
    </Box>
  );
}

export function App() {
  return (
    <>
      <Routes>
        <Route path="/patterns" element={<GalleryShell registry={patternsRegistry} />} />
        <Route path="/glossary" element={<GalleryShell registry={glossaryRegistry} />} />
        <Route path="/agent" element={<AgentStudio />} />
        <Route path="/multi-agent" element={<AgentChat />} />
        <Route path="/" element={<Navigate to="/patterns" replace />} />
        <Route path="*" element={<Navigate to="/patterns" replace />} />
      </Routes>
      <ViewSwitcher />
    </>
  );
}
