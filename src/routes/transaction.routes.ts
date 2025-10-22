import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controllers.js";
import { deserializeUser } from "../middlewares/auth.middlewares.js";

const router = Router();
const controller = new TransactionController();

router.get("/", deserializeUser, controller.getTransactions.bind(controller));
router.post(
  "/",
  deserializeUser,
  controller.createTransaction.bind(controller),
);
router.put(
  "/:id",
  deserializeUser,
  controller.updateTransaction.bind(controller),
);
router.delete(
  "/:id",
  deserializeUser,
  controller.deleteTransaction.bind(controller),
);
router.get("/summary", deserializeUser, controller.getSummary.bind(controller));

export { router as transactionRouter };
