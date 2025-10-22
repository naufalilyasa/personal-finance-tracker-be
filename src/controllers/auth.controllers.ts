import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.services.js";
import {
  loginPayloadTokenSchema,
  loginSchema,
  registerSchema,
} from "../validations/auth.validations.js";
import { ZodError } from "zod";
import { AppError } from "../utils/appError.js";

const authService = new AuthService();

export class UserController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const payload = loginSchema.parse(req.body);

      // Get access token, refresh token and user public info
      const accessToken = await authService.loginService(payload);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Login successful",
        data: {
          token: accessToken,
        },
      });
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join(".") || "body",
          message: issue.message,
        }));

        return next(new AppError(400, "Validation failed", formattedErrors));
      } else {
        return next(error);
      }
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate body
      const parsedBody = registerSchema.parse(req.body);

      // Request data input from body
      const payload = parsedBody;

      // Register user to database
      const result = await authService.registerService(payload);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "User registered successfully",
        data: {
          name: result.name,
          email: result.email,
          password: result.password_hash,
        },
      });
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return next(new AppError(400, "Validation failed", formattedErrors));
      } else {
        return next(error);
      }
    }
  }

  getMe(req: Request, res: Response, next: NextFunction) {
    // Get data user logged in that is set from middleware
    try {
      const user = res.locals.user;

      if (!user) {
        return next(new AppError(401, "You're not logged in"));
      }

      // Validate required fields exist
      const parsedUser = loginPayloadTokenSchema.parse(user);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        data: {
          name: parsedUser.name,
          username: parsedUser.email,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return next(new AppError(400, "Validation failed", formattedErrors));
      } else {
        return next(error);
      }
    }
  }
}
