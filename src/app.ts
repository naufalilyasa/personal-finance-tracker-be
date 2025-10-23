import express, { Request, Response } from "express";
import morgan from "morgan";
import corsMiddleware from "./middlewares/cors.middlewares.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middlewares.js";

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Health check
app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// Routes
app.use("/api/v1", router);

// Global error handler
app.use(errorHandler);

export default app;
