import config from "../config/config.js";
import "dotenv/config";
import cors from "cors";

const whitelist = [config.apiUrl, config.webUrl];
console.log(config.webUrl);

const corsMiddleware = cors({
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});

export default corsMiddleware;
