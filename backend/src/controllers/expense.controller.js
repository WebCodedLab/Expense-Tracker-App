import Expense from '../models/expense.model.js';
import {redis} from '../utils/redisClient.js';

// Helper function to cache expenses
const cacheExpenses = async (key, data, ttl = 600) => {
    if (redis.isReady) {
        await redis.setex(key, ttl, JSON.stringify(data));
    }
};

// Helper function to get cached expenses
const getCachedExpenses = async (key) => {
    if (redis.isReady) {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    }
    return null;
};

const clearInsightsCache = async (userId) => {
    await redis.del(`compare:${userId}`);
    await redis.del(`category-spending:${userId}`);
    await redis.del(`daily-trend:${userId}`);
};

// Create Expense
const createExpense = async (req, res) => {
    const { amount, category, description, date, isPlanned, isRecurring, recurrenceInterval, spentBy } = req.body;
    try {
        const expense = await Expense.create({
            user: req.user._id,
            amount,
            category,
            description,
            date,
            isPlanned,
            isRecurring,
            recurrenceInterval,
            spentBy
        });
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get All Expenses
const getExpenses = async (req, res) => {
    try {
        const cacheKey = `expenses:${req.user._id}`;
        const cachedExpenses = await getCachedExpenses(cacheKey);

        if (cachedExpenses) {
            return res.status(200).json(cachedExpenses);
        }

        const expenses = await Expense.find({ user: req.user._id })
            .sort({ date: -1 })
            .lean();

        await cacheExpenses(cacheKey, expenses);
        res.status(200).json(expenses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Expense by ID
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Expense
const updateExpense = async (req, res) => {
    const { amount, category, description, date, isPlanned, isRecurring, recurrenceInterval, spentBy } = req.body;
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // Check if the user is the owner
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this expense" });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            {
                amount,
                category,
                description,
                date,
                isPlanned,
                isRecurring,
                recurrenceInterval,
                spentBy
            },
            { new: true }
        );

        res.json(updatedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete Expense
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // Check if the user is the owner
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this expense" });
        }

        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
};
