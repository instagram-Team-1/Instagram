import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "../src/routers/authRoute";
import PostRouter from "./routers/PostRouter";
import cookieParser from "cookie-parser";
import userRouter from '../src/routers/userRouter'
const app = express();
const port = process.env.PORT || 4000;
dotenv.config();

app.use(express.json());
app.use(cors());

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

if (!mongoConnectionString) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not defined in the environment variables"
  );
}

app.use("/api/auth", authRouter);
app.use(`/api`, PostRouter);
app.use("/api/users", userRouter);

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Database connected");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
