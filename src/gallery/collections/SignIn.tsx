/* CONTRACT: export function SignIn() — a composed block from the themed components.
   A sign-in card: email/password, social buttons, divider, footer link. Theme tokens, lucide. */
import {
  Anchor,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Wind } from 'lucide-react';
import classes from './SignIn.module.css';

/* lucide-react dropped its brand marks, so the two providers use compact
   monochrome inline glyphs (currentColor) — no extra packages, on-theme. */
function GithubMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function GoogleMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
    </svg>
  );
}

export function SignIn() {
  return (
    <Box
      className={classes.outer}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 560,
        backgroundColor: 'var(--app-bg)',
      }}
    >
      <Card padding="xl" radius="lg" style={{ width: '100%', maxWidth: 380 }}>
        <Stack gap="lg">
          {/* Brand + heading */}
          <Stack gap="xs" align="center">
            <span className={classes.brand} aria-hidden>
              <Wind />
            </span>
            <Title order={3} ta="center" style={{ marginTop: 4 }}>
              Sign in to Northwind
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Welcome back — enter your details to continue.
            </Text>
          </Stack>

          {/* Credentials */}
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="you@company.com"
              type="email"
              autoComplete="email"
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <Group justify="space-between" align="center" wrap="nowrap">
              <Checkbox label="Remember me" size="sm" />
              <Anchor href="#" size="sm" c="dimmed">
                Forgot password?
              </Anchor>
            </Group>

            <Button fullWidth>Sign in</Button>
          </Stack>

          <Divider label="or continue with" labelPosition="center" />

          {/* Social auth */}
          <Group grow gap="sm">
            <Button
              variant="default"
              leftSection={<span className={classes.social}><GithubMark /></span>}
            >
              GitHub
            </Button>
            <Button
              variant="default"
              leftSection={<span className={classes.social}><GoogleMark /></span>}
            >
              Google
            </Button>
          </Group>

          {/* Footer */}
          <Text size="sm" c="dimmed" ta="center">
            New here?{' '}
            <Anchor href="#" size="sm">
              Create an account
            </Anchor>
          </Text>
        </Stack>
      </Card>
    </Box>
  );
}
