/* CONTRACT: export function Pricing() — a composed block from the themed components.
   Three-tier pricing cards (features + CTA, one highlighted). Theme tokens, lucide-react. */
import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  List,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { Check } from 'lucide-react';
import classes from './Pricing.module.css';

type Billing = 'monthly' | 'annual';

interface Plan {
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'Starter',
    tagline: 'For individuals shipping their first ideas.',
    monthly: 0,
    annual: 0,
    features: ['1 project', 'Up to 3 seats', 'Community support', '7-day history', 'Basic analytics'],
    cta: 'Get started',
  },
  {
    name: 'Pro',
    tagline: 'For growing teams that need more power.',
    monthly: 24,
    annual: 19,
    features: [
      'Unlimited projects',
      'Up to 20 seats',
      'Priority support',
      'Unlimited history',
      'Advanced analytics',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    tagline: 'For organizations with advanced needs.',
    monthly: 60,
    annual: 49,
    features: ['Everything in Pro', 'SSO & SAML', 'Dedicated manager', 'Audit logs', '99.99% uptime SLA'],
    cta: 'Contact sales',
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <div className={classes.wrap}>
      <Stack gap={28} align="center">
        <Stack gap={6} align="center" ta="center" maw={520}>
          <Title order={2}>Pricing that scales with you</Title>
          <Text c="dimmed" size="sm">
            Start free, upgrade when you are ready. No hidden fees, cancel anytime.
          </Text>
        </Stack>

        <Group gap="sm" justify="center">
          <SegmentedControl
            value={billing}
            onChange={(v) => setBilling(v as Billing)}
            data={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Annual', value: 'annual' },
            ]}
          />
          <Badge variant="light" radius="sm" className={classes.saveHint}>
            Save 20%
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" w="100%" verticalSpacing="lg">
          {PLANS.map((plan) => {
            const price = billing === 'monthly' ? plan.monthly : plan.annual;
            return (
              <Card
                key={plan.name}
                shadow={plan.highlighted ? 'md' : 'xs'}
                data-highlighted={plan.highlighted || undefined}
                className={classes.card}
              >
                <Stack gap="md" h="100%">
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Text fw={600} fz="lg">
                      {plan.name}
                    </Text>
                    {plan.highlighted && (
                      <Badge variant="filled" radius="sm">
                        Most popular
                      </Badge>
                    )}
                  </Group>

                  <Group gap={6} align="baseline">
                    <Text className={classes.price}>${price}</Text>
                    <Text c="dimmed" size="sm">
                      / user / mo
                    </Text>
                  </Group>

                  <Text c="dimmed" size="sm" className={classes.tagline}>
                    {plan.tagline}
                  </Text>

                  <List
                    spacing="sm"
                    size="sm"
                    center
                    icon={
                      <ThemeIcon variant="light" size={20} radius="xl">
                        <Check size={13} strokeWidth={2.5} />
                      </ThemeIcon>
                    }
                  >
                    {plan.features.map((feature) => (
                      <List.Item key={feature}>{feature}</List.Item>
                    ))}
                  </List>

                  <Button
                    mt="auto"
                    fullWidth
                    variant={plan.highlighted ? 'filled' : 'default'}
                  >
                    {plan.cta}
                  </Button>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Stack>
    </div>
  );
}
