import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import './theme.css';

import { theme, cssVariablesResolver } from './theme';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorSchemeScript defaultColorScheme="light" />
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver} defaultColorScheme="light">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
