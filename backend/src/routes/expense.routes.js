import express from "express";
import { JWTVerify } from "../middlewares/auth.middleware.js";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";

const router = express.Router();

router.post("/", JWTVerify, createExpense);


router.get("/", JWTVerify, getExpenses);

router.get("/:id", JWTVerify, getExpenseById);

router.put("/:id", JWTVerify, updateExpense);

router.delete("/:id", JWTVerify, deleteExpense);

export default router;
