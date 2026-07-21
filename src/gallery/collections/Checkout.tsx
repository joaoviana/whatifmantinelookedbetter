/* CONTRACT: export function Checkout() — a composed block from the themed components.
   An order summary + payment form: line items, totals, card fields, pay button. */
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { CreditCard, Lock } from 'lucide-react';

// Tabular, right-aligned money — keeps the totals column pixel-aligned.
const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// Believable SaaS order — sums to the emphasized total below.
const ITEMS = [
  { name: 'Linear — Business', qty: 1, price: 79 },
  { name: 'Additional member seat', qty: 3, price: 45 },
  { name: 'Priority support add-on', qty: 1, price: 13 },
];
const SUBTOTAL = ITEMS.reduce((sum, i) => sum + i.price, 0); // 137
const TAX = 11;
const TOTAL = SUBTOTAL + TAX; // 148

export function Checkout() {
  return (
    <Box p={{ base: 16, sm: 32 }} style={{ maxWidth: 960, marginInline: 'auto' }}>
      <Stack gap={4} mb={24}>
        <Text variant="eyebrow" span>Secure checkout</Text>
        <Title order={3}>Complete your order</Title>
      </Stack>

      <Grid gap={20} align="stretch">
        {/* ── LEFT · Order summary ─────────────────────────────── */}
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <Card padding="lg" h="100%">
            <Text variant="label" mb="md">
              Order summary
            </Text>

            <Stack gap="sm">
              {ITEMS.map((item) => (
                <Group key={item.name} justify="space-between" align="flex-start" wrap="nowrap" gap="md">
                  <div>
                    <Text fz="sm" fw={500} lh={1.3}>
                      {item.name}
                    </Text>
                    <Text variant="meta">
                      Qty {item.qty}
                    </Text>
                  </div>
                  <Text variant="numeric" fz="sm" fw={500}>
                    {usd(item.price)}
                  </Text>
                </Group>
              ))}
            </Stack>

            <Divider my="md" color="var(--mantine-color-default-border)" />

            <Group gap="xs" align="flex-end" wrap="nowrap">
              <TextInput
                placeholder="Promo code"
                aria-label="Promo code"
                style={{ flex: 1 }}
              />
              <Button variant="default">Apply</Button>
            </Group>

            <Divider my="md" color="var(--mantine-color-default-border)" />

            <Stack gap={8}>
              <Group justify="space-between">
                <Text variant="secondary">
                  Subtotal
                </Text>
                <Text variant="numeric" fz="sm">
                  {usd(SUBTOTAL)}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text variant="secondary">
                  Tax (est.)
                </Text>
                <Text variant="numeric" fz="sm">
                  {usd(TAX)}
                </Text>
              </Group>
              <Divider my={4} color="var(--mantine-color-default-border)" />
              <Group justify="space-between" align="baseline">
                <Text fw={600}>Total</Text>
                <Text variant="numeric" fw={700} fz={20}>
                  {usd(TOTAL)}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        {/* ── RIGHT · Payment ──────────────────────────────────── */}
        <Grid.Col span={{ base: 12, sm: 7 }}>
          <Card padding="lg" h="100%">
            <Text variant="label" mb="md">
              Payment details
            </Text>

            <Stack gap="md">
              <TextInput
                label="Cardholder name"
                placeholder="Jane Appleseed"
                autoComplete="cc-name"
              />

              <TextInput
                label="Card number"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
                leftSection={<CreditCard size={16} strokeWidth={1.75} />}
              />

              <Grid gap="sm">
                <Grid.Col span={6}>
                  <TextInput
                    label="Expiry"
                    placeholder="MM / YY"
                    autoComplete="cc-exp"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput label="CVC" placeholder="123" autoComplete="cc-csc" />
                </Grid.Col>
              </Grid>

              <Select
                label="Billing country"
                defaultValue="United States"
                data={[
                  'United States',
                  'United Kingdom',
                  'Germany',
                  'Portugal',
                  'Canada',
                  'Australia',
                ]}
              />

              <Button fullWidth size="md" mt={4}>
                Pay {usd(TOTAL)}
              </Button>

              <Group gap={6} justify="center" c="dimmed">
                <Lock size={13} strokeWidth={1.75} />
                <Text variant="meta">
                  Secure checkout · encrypted end-to-end
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
