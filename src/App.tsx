import { Box, SegmentedControl } from '@mantine/core';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { GalleryShell } from './gallery/GalleryShell';
import { AgentStudio } from './templates/AgentStudio';
import { AgentChat } from './templates/agentchat/AgentChat';

/** Top-level views are real routes now — deep-linkable, not just state. */
const NAV = [
  { label: 'Components', value: '/' },
  { label: 'Agent', value: '/agent' },
  { label: 'Multi-agent', value: '/multi-agent' },
];

function ViewSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const value = NAV.some((n) => n.value === pathname) ? pathname : '/';

  return (
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
        value={value}
        onChange={(v) => navigate(v)}
        radius="xl"
        data={NAV}
        styles={{
          root: {
            boxShadow: 'var(--mantine-shadow-lg)',
            border: '1px solid var(--app-border)',
            background: 'var(--app-surface)',
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
        <Route path="/" element={<GalleryShell />} />
        <Route path="/agent" element={<AgentStudio />} />
        <Route path="/multi-agent" element={<AgentChat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ViewSwitcher />
    </>
  );
}
