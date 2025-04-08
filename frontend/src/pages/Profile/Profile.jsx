import React, { useState } from 'react';
import { Avatar, TextInput, Button, Card, Group, Text, Center, Stack, FileInput } from '@mantine/core';
import { User, Mail, Phone, Edit, Camera } from 'lucide-react';
import SEO from '../../components/SEO/SEO.jsx'

export function Profile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1234567890');
  const [profilePic, setProfilePic] = useState('https://thumbs.dreamstime.com/b/generative-ai-young-smiling-man-avatar-man-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-d-vector-people-279560903.jpg');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile updated:', { name, email, phone, profilePic });
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePic(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
    <SEO 
    title="Profile - Expense Tracker"
    description="Manage your personal information, settings, and preferences on your Expense Tracker profile."  />
        <Center>
      <Card shadow="sm" padding="lg" radius="md" withBorder className="w-full max-w-2xl">
        <Group justify="space-between" mb="md">
          <Text size="xl" fw={500}>Profile</Text>
          <Button
            leftSection={<Edit size={16} />}
            onClick={() => setIsEditing(!isEditing)}
            variant="subtle"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </Group>

        <Center>
          <Stack align="center">
            <Avatar size="xl" radius="xl" src={profilePic} alt="Profile" mb="md" />
            {isEditing && (
              <Button component="label" leftSection={<Camera size={16} />}> 
                Change Picture
                <input type="file" accept="image/*" hidden onChange={handleProfilePicChange} />
              </Button>
            )}
          </Stack>
        </Center>

        <Stack gap="sm">
          <TextInput
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftSection={<User size={16} />}
            disabled={!isEditing}
            mb="sm"
          />
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftSection={<Mail size={16} />}
            disabled={!isEditing}
            mb="sm"
          />
          <TextInput
            label="Phone"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftSection={<Phone size={16} />}
            disabled={!isEditing}
            mb="sm"
          />
        </Stack>

        {isEditing && (
          <Group justify="flex-end" mt="md">
            <Button onClick={handleSave}>Save Changes</Button>
          </Group>
        )}
      </Card>
    </Center>
    </>
  );
}