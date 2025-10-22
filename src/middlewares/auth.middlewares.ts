import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import config from "../config/config.js";
import { verifyJwt } from "../utils/jwt.js";
import { AuthRepository } from "../repositories/auth.repositories.js";
import { loginPayloadTokenSchema } from "../validations/auth.validations.js";

const authRepository = new AuthRepository();

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(401, "Unauthorized: Token is missing or invalid"));
  }

  const accessToken = authHeader.split(" ")[1];

  if (!config.accessTokenPublicKey) {
    return next(new AppError(401, "Invalid token or public key"));
  }

  try {
    const decoded = verifyJwt(accessToken, config.accessTokenPublicKey);

    if (!decoded) {
      return next(new AppError(404, "Payload not found"));
    }

    const parsedPayload = loginPayloadTokenSchema.parse(decoded);

    const user: {
      name: string;
      email: string;
    } | null = await authRepository.findUniqueUser(parsedPayload, {
      password_hash: true,
    });

    if (!user) {
      return next(new AppError(401, "Token has expired or user doesn't exist"));
    }

    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export { deserializeUser };
