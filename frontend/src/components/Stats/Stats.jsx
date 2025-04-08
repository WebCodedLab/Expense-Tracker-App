
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import classes from './Stats.module.css';
import {
  ShoppingCart,
  Croissant,
  Pizza,
  Home,
  Bus,
  Dumbbell,
  HeartPulse,
  Shirt,
} from 'lucide-react';
import React from 'react';

const icons = {
  groceries: ShoppingCart,
  bakery: Croissant,
  fastFood: Pizza,
  housing: Home,
  transport: Bus,
  fitness: Dumbbell,
  health: HeartPulse,
  clothing: Shirt,
};

const data = [
  { title: 'Groceries', icon: 'groceries', value: '$350', diff: -8 },
  { title: 'Bakery', icon: 'bakery', value: '$80', diff: 5 },
  { title: 'Fast Food', icon: 'fastFood', value: '$120', diff: 12 },
  { title: 'Housing', icon: 'housing', value: '$1,200', diff: 0 },
  { title: 'Total', icon: 'transport', value: '$150', diff: -3 },
];

export function Stats() {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? ArrowUpRight : ArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="sm" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            c={stat.diff > 0 ? 'teal' : 'red'}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size={16} stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Compared to previous month
        </Text>
      </Paper>
    );
  });

  return (
    <div className={`${classes.root} mt-0`}>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 5 }}>{stats}</SimpleGrid>
    </div>
  );
}