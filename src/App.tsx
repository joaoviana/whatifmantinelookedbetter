import { Navigate, Route, Routes } from 'react-router-dom';
import { GalleryShell } from './gallery/GalleryShell';
import { patternsRegistry, glossaryRegistry } from './gallery/registry';
import { AgentStudio } from './templates/AgentStudio';
import { AgentChat } from './templates/agentchat/AgentChat';

export function App() {
  return (
    <Routes>
      <Route path="/patterns" element={<GalleryShell registry={patternsRegistry} />} />
      <Route path="/glossary" element={<GalleryShell registry={glossaryRegistry} />} />
      <Route path="/agent" element={<AgentStudio />} />
      <Route path="/multi-agent" element={<AgentChat />} />
      <Route path="/" element={<Navigate to="/patterns" replace />} />
      <Route path="*" element={<Navigate to="/patterns" replace />} />
    </Routes>
  );
}
