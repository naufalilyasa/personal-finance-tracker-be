import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { transactionRouter } from "./transaction.routes.js";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/transactions", transactionRouter);
