require("dotenv").config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import config from "./src/configs/config";
import routes from "./src/routes";

async function startApp() {
  const app = express();
  await mongoose.connect(config.DB_URL);
  app.get("/", (req: Request, res: Response) => {
    return res.status(200).end();
  });
  app.use("/api", routes);
  app.listen(process.env.PORT, () => {
    console.log("Server is listening on port:", process.env.PORT);
  });
}

startApp();
