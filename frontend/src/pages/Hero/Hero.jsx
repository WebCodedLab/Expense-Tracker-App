import { Button, Container, Group, Text } from '@mantine/core';
import classes from './Hero.module.css';
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO.jsx'

export function Hero() {
  return (
    <div className={classes.wrapper}>
        <SEO 
  title="Home - Expense Tracker" 
  description="Welcome to Expense Tracker - Your one-stop solution for all your needs. Explore our features and services."
/>
      <Container size={1000} className={classes.inner}>
        <h1 className={classes.title}>
          Take control of your{' '}
          <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
            finances
          </Text>{' '}
          with ease
        </h1>

        <Text className={classes.description} color="dimmed">
          Track your expenses, manage budgets, and gain insights into your spending habits. 
          Our intuitive tools help you stay on top of your financial goals.
        </Text>

        <Group className={classes.controls}>
          <Link
            to="/login"
            className={`${classes.control} bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200`}
          >
            Start Tracking
          </Link>
        </Group>
      </Container>
    </div>
  );
}