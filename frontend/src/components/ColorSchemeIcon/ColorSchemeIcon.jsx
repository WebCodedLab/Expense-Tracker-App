import React from 'react';
import cx from 'clsx';
import { ActionIcon, Group, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import classes from './ColorSchemeIcon.module.css';
import { Moon, Sun } from 'lucide-react';

export function ColorSchemeIcon() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant="default"
        size="xl"
        aria-label="Toggle color scheme"
      >
        <Sun className={cx(classes.icon, classes.light)} strokeWidth={1.5} />
        <Moon className={cx(classes.icon, classes.dark)} strokeWidth={1.5} />
      </ActionIcon>
    </Group>
  );
}