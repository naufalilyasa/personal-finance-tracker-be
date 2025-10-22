import { TransactionRepository } from "../repositories/transaction.repositories.js";
import { AppError } from "../utils/appError.js";
import {
  CreateTransactionRequest,
  TransactionQuery,
  UpdateTransactionRequest,
} from "../validations/transaction.validations.js";

const transactionRepository = new TransactionRepository();

export class TransactionService {
  async getTransactions(userId: number, queryParams: TransactionQuery) {
    return transactionRepository.findAll(userId, queryParams);
  }

  async createTransaction(userId: number, payload: CreateTransactionRequest) {
    if (!["income", "expense"].includes(payload.type)) {
      throw new AppError(400, "Type must be either 'income' or 'expense'");
    }

    return transactionRepository.create(userId, {
      ...payload,
      type: payload.type,
    });
  }

  async updateTransaction(
    id: number,
    userId: number,
    payload: UpdateTransactionRequest,
  ) {
    return transactionRepository.update(id, userId, {
      ...payload,
    });
  }

  async deleteTransaction(id: number, userId: number) {
    return transactionRepository.delete(id, userId);
  }

  async getSummary(userId: number) {
    return transactionRepository.getSummary(userId);
  }
}
