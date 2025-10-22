import { Router } from "express";
import { UserController } from "../controllers/auth.controllers.js";
import { deserializeUser } from "../middlewares/auth.middlewares.js";

const router: Router = Router();

const userController = new UserController();

router.post("/login", userController.login.bind(userController));
router.post("/register", userController.register.bind(userController));
router.get("/me", deserializeUser, userController.getMe.bind(userController));

export { router as authRoutes };
