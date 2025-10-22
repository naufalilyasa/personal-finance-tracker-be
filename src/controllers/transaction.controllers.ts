import type { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.services.js";
import {
  createTransactionSchema,
  paramsIdSchema,
  transactionQuerySchema,
  updateTransactionSchema,
} from "../validations/transaction.validations.js";

const transactionService = new TransactionService();

export class TransactionController {
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams = req.query;
      const userId = Number(res.locals.user.id);
      const {
        type = undefined,
        end = "",
        start = "",
      } = transactionQuerySchema.parse(queryParams);

      const data = await transactionService.getTransactions(userId, {
        type,
        end,
        start,
      });

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Transactions fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(res.locals.user.id);
      const payload = req.body;
      const parsedPayload = createTransactionSchema.parse(payload);

      const data = await transactionService.createTransaction(
        userId,
        parsedPayload,
      );

      res.status(201).json({
        status: "success",
        statusCode: 201,
        message: "Transaction created successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const userId = Number(res.locals.user.id);
      const payload = req.body;

      const parsedParamsId = paramsIdSchema.parse(id);
      const parsedPayload = updateTransactionSchema.parse(payload);

      const data = await transactionService.updateTransaction(
        parsedParamsId,
        userId,
        parsedPayload,
      );

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Transaction updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const userId = Number(res.locals.user.id);

      const parsedParamsId = paramsIdSchema.parse(id);

      await transactionService.deleteTransaction(parsedParamsId, userId);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(res.locals.user.id);
      const data = await transactionService.getSummary(userId);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Summary fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
