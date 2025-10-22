import "dotenv/config";
import { cleanEnv, num, str, url } from "envalid";

const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  API_URL: str({ default: "http://localhost:3005" }),
  WEB_URL: url(),
  PORT: num(),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DB: str(),
  POSTGRES_PORT: num(),
  DATABASE_URL: url(),
  JWT_ACCESS_TOKEN_PRIVATE_KEY: str(),
  JWT_ACCESS_TOKEN_PUBLIC_KEY: str(),
});

export default {
  nodeEnv: env.NODE_ENV,
  apiUrl: env.API_URL,
  webUrl: env.WEB_URL,
  port: env.PORT,
  accessTokenPrivateKey: env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
  accessTokenExpiresIn: 60,
};
