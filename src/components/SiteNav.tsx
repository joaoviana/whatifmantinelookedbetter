import { NavLink, SegmentedControl } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

/** The four top-level views — deep-linkable routes, not just state. */
export const NAV = [
  { label: 'Patterns', value: '/patterns' },
  { label: 'Glossary', value: '/glossary' },
  { label: 'Agent', value: '/agent' },
  { label: 'Multi-agent', value: '/multi-agent' },
];

function useActiveNav() {
  const { pathname } = useLocation();
  return NAV.some((n) => n.value === pathname) ? pathname : '/patterns';
}

/**
 * SiteNav — the app's top-level view switcher. Two variants sharing one
 * source of truth (NAV): `inline` is a compact segmented control that lives
 * in the desktop header in place of the brand wordmark; `list` is a stack of
 * NavLinks for the mobile burger drawers, where a segmented control would be
 * too cramped next to each page's own navigation.
 */
export function SiteNav({ variant, onNavigate }: { variant: 'inline' | 'list'; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const active = useActiveNav();

  if (variant === 'inline') {
    return (
      <SegmentedControl
        value={active}
        onChange={(v) => navigate(v)}
        radius="xl"
        size="xs"
        data={NAV}
        styles={{ root: { background: 'var(--mantine-color-default-hover)' } }}
      />
    );
  }

  return (
    <>
      {NAV.map((n) => (
        <NavLink
          key={n.value}
          label={n.label}
          active={n.value === active}
          onClick={() => {
            navigate(n.value);
            onNavigate?.();
          }}
          styles={{ root: { borderRadius: 'var(--mantine-radius-md)' } }}
        />
      ))}
    </>
  );
}
