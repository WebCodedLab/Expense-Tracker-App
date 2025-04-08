import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
  } from '@mantine/core';
  import classes from './Login.module.css';
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO.jsx'

  export function Login() {
    return (
      <Container size={420} my={40}>
        <SEO 
          title="Login - Expense Tracker" 
          description="Access your account on Expense Tracker. Sign in to manage your profile and access exclusive features."
        />
        <Title ta="center" className={classes.title}>
          Welcome back!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{' '}
          <Link to="/register" size="sm" component="button" className="text-blue-400 hover:text-blue-500">
            Create account
          </Link>
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@mantine.dev" required />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" />
          <Group justify="space-between" mt="lg">
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl">
            Sign in
          </Button>
        </Paper>
      </Container>
    );
  }