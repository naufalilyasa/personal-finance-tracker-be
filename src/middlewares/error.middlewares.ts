/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from "express";
import config from "../config/config.js";
import { AppError } from "../utils/appError.js";

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let status = "error";
  let message = "Internal server error";
  let errors: any[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
    errors = err.errors ?? [];
  }

  if (config.nodeEnv === "production") {
    message = "Something went wrong";
    errors = [];
  }

  const response: Record<string, any> = {
    status,
    statusCode,
    message,
  };

  if (config.nodeEnv !== "production" && errors.length > 0) {
    response.errors = errors;
  }

  if (config.nodeEnv === "development") {
    // eslint-disable-next-line no-console
    console.error("🔥 Error:", err);
  }

  res.status(statusCode).json(response);
};
