import { z } from "zod";

// Schema for id params
export const paramsIdSchema = z
  .number("ID must be a number")
  .min(1, "ID is required");

// Enum for transaction type (must match Prisma enum)
export const transactionTypeEnum = z.enum(["income", "expense"]);

// Schema for creating a transaction
export const createTransactionSchema = z.object({
  type: transactionTypeEnum,
  amount: z
    .number("Amount must be a number")
    .min(1, "Amount is required")
    .positive("Amount must be greater than 0"),
  category: z
    .string("Category must be a string")
    .min(1, "Category cannot be empty"),
  description: z.string("Description must be a string").optional(),
  date: z.iso.date("Date format is invalid"),
});

// Schema for updating a transaction
export const updateTransactionSchema = z.object({
  type: transactionTypeEnum,
  amount: z
    .number("Amount must be a number")
    .positive("Amount must be greater than 0"),
  category: z
    .string("Category must be a string")
    .min(1, "Category cannot be empty"),
  description: z.string("Description must be a string"),
  date: z.iso.date("Date format is invalid"),
});

// Schema for Query Params
export const transactionQuerySchema = z.object({
  type: transactionTypeEnum.optional().nullable().catch(undefined),
  start: z
    .union([
      z.coerce.date({
        error: "Start date format is invalid",
      }),
      z.literal(""),
    ])
    .optional(),
  end: z
    .union([
      z.coerce.date({
        error: "End date format is invalid",
      }),
      z.literal(""),
    ])
    .optional(),
});

export type CreateTransactionRequest = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionRequest = z.infer<typeof updateTransactionSchema>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
