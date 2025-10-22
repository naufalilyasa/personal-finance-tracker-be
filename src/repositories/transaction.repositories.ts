import { prisma } from "../prisma/client.js";
import {
  CreateTransactionRequest,
  TransactionQuery,
  UpdateTransactionRequest,
} from "../validations/transaction.validations.js";

export class TransactionRepository {
  async findAll(userId: number, queryParams: TransactionQuery) {
    const { start, end, type } = queryParams;
    return prisma.transaction.findMany({
      where: {
        user_id: userId,
        type: type ?? undefined,
        date: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
        },
      },
      orderBy: { date: "desc" },
    });
  }

  async create(userId: number, data: CreateTransactionRequest) {
    return prisma.transaction.create({
      data: { ...data, user_id: userId, date: new Date(data.date) },
    });
  }

  async update(id: number, userId: number, data: UpdateTransactionRequest) {
    return prisma.transaction.update({
      where: { id },
      data: { ...data, user_id: userId, date: new Date(data.date) },
    });
  }

  async delete(id: number, userId: number) {
    return prisma.transaction.delete({
      where: {
        id,
        AND: {
          user_id: userId,
        },
      },
    });
  }

  async getSummary(userId: number) {
    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { user_id: userId, type: "income" },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { user_id: userId, type: "expense" },
      }),
    ]);

    const incomeSum = income._sum.amount?.toNumber?.() ?? 0;
    const expenseSum = expense._sum.amount?.toNumber?.() ?? 0;
    const balance = incomeSum - expenseSum;

    return { income: incomeSum, expense: expenseSum, balance };
  }
}
