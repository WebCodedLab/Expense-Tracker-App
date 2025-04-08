import Expense from "../models/expense.model.js";
import { redis } from "../utils/redisClient.js";

const getMonthlyComparison = async (req, res) => {
  const cacheKey = `compare:${req.user._id}`;
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    console.log(startOfCurrentMonth, startOfLastMonth);

    const [currentMonth, lastMonth] = await Promise.all([
      Expense.aggregate([
        { $match: { user: req.user._id, date: { $gte: startOfCurrentMonth } } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        {
          $match: {
            user: req.user._id,
            date: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
          },
        },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
    ]);

    const response = {
      currentMonthTotal: currentMonth[0]?.totalAmount || 0,
      lastMonthTotal: lastMonth[0]?.totalAmount || 0,
    };

    await redis.setex(cacheKey, 3600, JSON.stringify(response));
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategorySpending = async (req, res) => {
  const cacheKey = `category-spending:${req.user._id}`;
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const result = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth }, // Filter for current month
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    await redis.setex(cacheKey, 3600, JSON.stringify(result));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDailyTrend = async (req, res) => {
  const cacheKey = `daily-trend:${req.user._id}`;
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the week (Sunday)
    const endOfWeek = new Date(now.setDate(now.getDate() + 6)); // End of the week (Saturday)

    const result = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: {
            dayOfMonth: { $dayOfMonth: "$date" },
            dayOfWeek: { $dayOfWeek: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.dayOfMonth": 1 } },
    ]);

    // Map dayOfWeek to day name
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const formattedResult = result.map((item) => ({
      dayOfMonth: item._id.dayOfMonth,
      dayName: dayNames[item._id.dayOfWeek - 1], // dayOfWeek is 1-indexed
      totalAmount: item.totalAmount,
    }));

    await redis.setex(cacheKey, 1800, JSON.stringify(formattedResult));
    res.json(formattedResult);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMonthlySummary = async (req, res) => {
  const cacheKey = `monthly-summary:${req.user._id}`;
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }, // Optional: Count of expenses in this category
        },
      },
      {
        $sort: { totalAmount: -1 }, // Sort by total amount in descending order
      },
    ]);

    await redis.setex(cacheKey, 3600, JSON.stringify(result)); // Cache for 1 hour
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getYearlySummary = async (req, res) => {
  const cacheKey = `yearly-summary:${req.user._id}`;
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const result = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Map month number to month name
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formattedResult = result.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item.year,
      totalAmount: item.totalAmount,
    }));

    await redis.setex(cacheKey, 86400, JSON.stringify(formattedResult)); // Cache for 1 day
    
    res.json(formattedResult);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTopExpenses = async (req, res) => {
  const cacheKey = `top-expenses:${req.user._id}`;
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $sort: { amount: -1 },
      },
      {
        $project: {
          amount: "$amount",
          description: "$description",
        },
      },
      {
        $limit: 5,
      },
    ]);

    await redis.setex(cacheKey, 3600, JSON.stringify(result));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTotalSpentThisMonth = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const result = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totalSpent = result.length > 0 ? result[0].totalAmount : 0;
        res.status(200).json({ totalSpent });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getTotalSpentThisYear = async (req, res) => {
    try {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);

        const result = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totalSpent = result.length > 0 ? result[0].totalAmount : 0;
        res.status(200).json({ totalSpent });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getExpenseStatistics = async (req, res) => {
    try {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Get total expenses for the year
        const totalExpensesResult = await Expense.aggregate([
            {
                $match: {
                    date: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: "$amount" }
                }
            }
        ]);

        // Get average monthly spending for the year
        const averageExpenseResult = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    monthlyTotal: { $sum: "$amount" }
                }
            },
            {
                $group: {
                    _id: null,
                    averageExpense: { $avg: "$monthlyTotal" }
                }
            }
        ]);

        // Get max and min expenses for the current month
        const maxMinExpenseResult = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    maxExpense: { $max: "$amount" },
                    minExpense: { $min: "$amount" }
                }
            }
        ]);

        const statistics = {
            totalExpenses: totalExpensesResult.length > 0 ? totalExpensesResult[0].totalExpenses : 0,
            averageExpense: averageExpenseResult.length > 0 ? averageExpenseResult[0].averageExpense : 0,
            maxExpense: maxMinExpenseResult.length > 0 ? maxMinExpenseResult[0].maxExpense : 0,
            minExpense: maxMinExpenseResult.length > 0 ? maxMinExpenseResult[0].minExpense : 0
        };

        res.status(200).json(statistics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
  getMonthlyComparison,
  getCategorySpending,
  getDailyTrend,
  getYearlySummary,
  getTopExpenses,
  getMonthlySummary,
  getTotalSpentThisMonth,
  getTotalSpentThisYear,
  getExpenseStatistics,
};
