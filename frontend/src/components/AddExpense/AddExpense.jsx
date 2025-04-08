import React, { useState } from 'react';
import { TextInput, Button, Select, Modal, Group } from '@mantine/core';
import { Plus } from 'lucide-react';

export function AddExpense({ opened, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [status, setStatus] = useState('Pending');

  const handleSubmit = () => {
    const newExpense = {
      title,
      category,
      date, // Use the date directly (already in YYYY-MM-DD format)
      amount: `$${amount}`,
      paidBy,
      status,
    };
    onSubmit(newExpense);
    // Reset form fields
    setTitle('');
    setCategory('');
    setDate('');
    setAmount('');
    setPaidBy('');
    setStatus('Pending');
    onClose(); // Close the modal after submission
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add New Expense"
      size="md"
      centered
    >
      <TextInput
        label="Expense Title"
        placeholder="Enter expense title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        mb="md"
      />
      <Select
        label="Category"
        placeholder="Select category"
        data={['Dining', 'Transport', 'Utilities', 'Entertainment', 'Other']}
        value={category}
        onChange={setCategory}
        required
        mb="md"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="w-full p-2 border-zinc-300 border rounded mb-4" // Add Tailwind classes for styling
      />
      <TextInput
        label="Amount"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        mb="md"
      />
      <Select
        label="Paid By"
        placeholder="Select payer"
        data={['Zohiab', 'Shoaib', 'Sohaib']}
        value={paidBy}
        onChange={setPaidBy}
        required
        mb="md"
      />
      <Select
        label="Status"
        placeholder="Select status"
        data={['Pending', 'Completed']}
        value={status}
        onChange={setStatus}
        required
        mb="md"
      />
      <Group justify="flex-end" mt="md">
        <Button leftSection={<Plus size={16} />} onClick={handleSubmit}>
          Add Expense
        </Button>
      </Group>
    </Modal>
  );
} 