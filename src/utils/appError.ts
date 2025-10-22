export class AppError extends Error {
  errors?: { field: string; message: string }[];
  status: string;
  statusCode: number;

  constructor(
    statusCode: number,
    message: string,
    errors?: { field: string; message: string }[],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "failed" : "error";
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
