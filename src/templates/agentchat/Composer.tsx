/* CONTRACT: export function Composer() — the multi-agent chat composer.
   Rounded, light, flowing input + a "Route to: [All agents ▾]" control + circular send.
   This teammate owns it. Optional co-located Composer.module.css. */
import { useState } from 'react';
import { ActionIcon, Menu, Textarea } from '@mantine/core';
import { ArrowUp, ChevronDown } from 'lucide-react';
import { AGENTS } from './agents';
import classes from './Composer.module.css';

const ALL = 'All agents';

export function Composer() {
  const [value, setValue] = useState('');
  const [route, setRoute] = useState(ALL);

  const routed = AGENTS.find((a) => a.name === route);
  const empty = value.trim().length === 0;

  return (
    <div className={classes.shell}>
      <div className={classes.surface}>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder="Message the team…  (@ to mention an agent)"
          autosize
          minRows={1}
          maxRows={8}
          variant="unstyled"
          classNames={{ input: classes.field }}
        />

        <div className={classes.controls}>
          <Menu position="top-start" offset={8} radius="md" width={200} withinPortal>
            <Menu.Target>
              <button type="button" className={classes.routePill}>
                {routed && (
                  <span
                    className={classes.routeDot}
                    style={{ backgroundColor: routed.accent }}
                  />
                )}
                {route}
                <ChevronDown className={classes.routeChevron} size={13} strokeWidth={2} />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Route to</Menu.Label>
              <Menu.Item onClick={() => setRoute(ALL)}>{ALL}</Menu.Item>
              <Menu.Divider />
              {AGENTS.map((a) => (
                <Menu.Item
                  key={a.id}
                  onClick={() => setRoute(a.name)}
                  leftSection={
                    <span className={classes.optionDot} style={{ backgroundColor: a.accent }} />
                  }
                >
                  {a.name}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          <ActionIcon
            variant="filled"
            color="neutral"
            radius="xl"
            size={32}
            disabled={empty}
            aria-label="Send message"
          >
            <ArrowUp size={17} strokeWidth={2.4} />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
}
