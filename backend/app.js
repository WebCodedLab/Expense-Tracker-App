import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
configDotenv();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//import routes
import usersRouter from "./src/routes/user.routes.js";
import expenseRouter from "./src/routes/expense.routes.js";
import insightsRouter from "./src/routes/insights.routes.js";

//routes
app.use("/users", usersRouter);
app.use('/expenses', expenseRouter);
app.use('/insights', insightsRouter);

export { app };
