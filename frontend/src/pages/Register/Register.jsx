import {
    Anchor,
    Button,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import classes from './Register.module.css';
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO.jsx'

export function Register() {
    return (
        <Container size={420} my={40}>
            <SEO 
                title="Register - Expense Tracker" 
                description="Create a new account on Expense Tracker. Join our community and start using our services today."
            />
            <Title ta="center" className={classes.title}>
                Create Account
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Already have an account?{' '}
                <Link to="/login" size="sm" component="button" className="text-blue-400 hover:text-blue-500">
                    Login
                </Link>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Name" placeholder="Your name" required />
                <TextInput label="Email" placeholder="you@mantine.dev" required mt="md" />
                <PasswordInput label="Password" placeholder="Your password" required mt="md" />
                <PasswordInput label="Confirm Password" placeholder="Confirm password" required mt="md" />
                <Button fullWidth mt="xl">
                    Register
                </Button>
            </Paper>
        </Container>
    );
}
