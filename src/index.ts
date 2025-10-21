import express from "express";
import { middleware } from "./middlewares/index.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT ?? "9000";

app.get("/", middleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
