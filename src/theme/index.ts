import { createTheme } from '@mantine/core';
import { baseTheme } from './tokens';
import { actionsComponents } from './components/actions';
import { inputsComponents } from './components/inputs';
import { dataDisplayComponents } from './components/dataDisplay';
import { feedbackComponents } from './components/feedback';
import { navigationComponents } from './components/navigation';

export { cssVariablesResolver } from './tokens';

/**
 * The single theme. Base tokens + per-group component overrides.
 * Each group is styled in its own file under ./components/ so work
 * can happen in parallel without collisions.
 */
export const theme = createTheme({
  ...baseTheme,
  components: {
    ...actionsComponents,
    ...inputsComponents,
    ...dataDisplayComponents,
    ...feedbackComponents,
    ...navigationComponents,
  },
});
