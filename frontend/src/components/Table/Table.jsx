import React, { useState } from "react";
import { ArrowUp, ArrowDown, Search, Edit, Trash, Plus } from "lucide-react";
import {
  Group,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  ScrollArea,
  Center,
  Button,
} from "@mantine/core";
import classes from "./Table.module.css";
import { AddExpense } from '../../components/AddExpense/AddExpense.jsx';

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? (reversed ? ArrowUp : ArrowDown) : ArrowUp;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.keys(item).some((key) =>
      String(item[key]).toLowerCase().includes(query)
    )
  );
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (sortBy === "amount") {
        const amountA = parseFloat(a.amount.replace("$", ""));
        const amountB = parseFloat(b.amount.replace("$", ""));
        return payload.reversed ? amountB - amountA : amountA - amountB;
      } else if (sortBy === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return payload.reversed
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      } else {
        return payload.reversed
          ? String(b[sortBy]).localeCompare(String(a[sortBy]))
          : String(a[sortBy]).localeCompare(String(b[sortBy]));
      }
    }),
    payload.search
  );
}

const data = [
  {
    title: "Burgers",
    category: "Dining",
    date: "2023-10-15",
    amount: "120",
    paidBy: "Zohiab",
    status: "Completed",
  },
  {
    title: "Taxi Ride",
    category: "Transport",
    date: "2023-10-14",
    amount: "50",
    paidBy: "Shoaib",
    status: "Completed",
  },
  {
    title: "Pizza Night",
    category: "Dining",
    date: "2023-10-13",
    amount: "75",
    paidBy: "Sohaib",
    status: "Pending",
  },
  {
    title: "Electric Bill",
    category: "Utilities",
    date: "2023-10-12",
    amount: "200",
    paidBy: "Zohiab",
    status: "Completed",
  },
  {
    title: "Movie Tickets",
    category: "Entertainment",
    date: "2023-10-11",
    amount: "45",
    paidBy: "Shoaib",
    status: "Completed",
  },
];

export function TableReviews() {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const handleAddExpense = (newExpense) => {
    // Add logic to handle the new expense (e.g., update state or API call)
    console.log('New Expense:', newExpense);
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.title}>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>{row.category}</Table.Td>
      <Table.Td>
        {new Date(row.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </Table.Td>
      <Table.Td>Rs. {row.amount}</Table.Td>
      <Table.Td>{row.paidBy}</Table.Td>
      <Table.Td>
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            row.status === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status}
        </span>
      </Table.Td>
      <Table.Td>
        <Group gap="">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <Edit size={16} />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
            <Trash size={16} />
          </button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <div className="flex justify-between items-center mx-auto max-w-7xl mb-4">
        <TextInput
          placeholder="Search by any field"
          leftSection={<Search size={16} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
          className="flex-1 mr-4"
        />
        <Button leftSection={<Plus size={16} />} color="blue" onClick={() => setShowAddExpense(true)}>
          New Expense
        </Button>
      </div>
     
      <div className="mx-auto max-w-7xl">
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={800}
          layout="fixed"
        >
          
          <Table.Tbody>
            <Table.Tr>
              <Th
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                Expense Title
              </Th>
              <Th
                sorted={sortBy === "category"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("category")}
              >
                Category
              </Th>
              <Th
                sorted={sortBy === "date"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("date")}
              >
                Date
              </Th>
              <Th
                sorted={sortBy === "amount"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("amount")}
              >
                Amount
              </Th>
              <Th
                sorted={sortBy === "paymentMethod"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("paymentMethod")}
              >
                Paid by
              </Th>
              <Th
                sorted={sortBy === "status"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("status")}
              >
                Status
              </Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={Object.keys(data[0]).length + 1}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
      <AddExpense
        opened={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSubmit={handleAddExpense}
      />
    </ScrollArea>
  );
}
