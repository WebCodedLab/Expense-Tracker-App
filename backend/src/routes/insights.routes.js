import express from "express";
import { JWTVerify } from "../middlewares/auth.middleware.js";
import {
  getMonthlyComparison,
  getCategorySpending,
  getDailyTrend,
  getYearlySummary,
  getTopExpenses,
  getMonthlySummary,
  getTotalSpentThisMonth,
  getTotalSpentThisYear,
  getExpenseStatistics,
} from "../controllers/insights.controller.js";

const router = express.Router();

router.get("/monthly-comparison", JWTVerify, getMonthlyComparison);
// router.get("/category-spending", JWTVerify, getCategorySpending);
router.get("/daily-trend", JWTVerify, getDailyTrend);
router.get("/monthly-summary", JWTVerify, getMonthlySummary);
router.get("/top-expenses", JWTVerify, getTopExpenses);
router.get("/yearly-summary", JWTVerify, getYearlySummary);
router.get("/month-total-spent", JWTVerify, getTotalSpentThisMonth);
router.get("/year-total-spent", JWTVerify, getTotalSpentThisYear);
router.get("/expense-statistics", JWTVerify, getExpenseStatistics);

export default router;
