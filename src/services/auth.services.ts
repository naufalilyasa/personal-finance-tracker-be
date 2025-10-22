import _ from "lodash";
import config from "../config/config.js";
import { AuthRepository } from "../repositories/auth.repositories.js";
import { AppError } from "../utils/appError.js";
import { signJwt } from "../utils/jwt.js";
import {
  LoginRequest,
  RegisterRequest,
} from "../validations/auth.validations.js";
import bcrypt from "bcrypt";

const authRepository = new AuthRepository();

export class AuthService {
  // Login
  async loginService(payload: LoginRequest) {
    const { email, password } = payload;

    const user = await authRepository.loginRepo(email);
    // Check if user exist or already register
    if (!user) {
      throw new AppError(403, `Invalid username or password`);
    }

    // Check user password using bcrypt compare
    const comparedPassword = await bcrypt.compare(password, user.password_hash);

    if (!comparedPassword) {
      throw new AppError(403, "Invalid username or password");
    }

    const userWithoutPassword = _.omit(user, ["password_hash"]);

    // Create access token and refresh token to get access of our application
    const accessToken = signJwt(
      userWithoutPassword,
      config.accessTokenPrivateKey,
      {
        expiresIn: config.accessTokenExpiresIn * 60 * 1000,
      },
    );

    return accessToken;
  }

  // Register
  async registerService(payload: RegisterRequest) {
    const { name, password, email } = payload;

    // Check username to makesure username input not yet use
    const checkEmail = await authRepository.findByEmail(email);

    if (checkEmail) {
      throw new AppError(401, `Email ${email} already exist.`);
    }

    // Hash password input
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await authRepository.registerRepo({
      name,
      email,
      password: hashedPassword,
    });

    return result;
  }
}
