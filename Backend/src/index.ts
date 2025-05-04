import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "../src/routers/authRoute";
import PostRouter from "./routers/PostRouter";
import userRouter from '../src/routers/userRouter'
import Followrouter from "./routers/FollowRouter";
import LikeRouter from "./routers/LikeRouter";
import CommentRouter from "./routers/CommentRouter";
import ConvertRouter from "./routers/ConvertRouter";
const app = express();
const port = process.env.PORT || 9000;
dotenv.config();

app.use(express.json());

// app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));



const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

if (!mongoConnectionString) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not defined in the environment variables"
  );
}

app.use("/api/auth", authRouter);
app.use(`/api`, PostRouter);
app.use("/api/users", userRouter);
app.use("/api", Followrouter);
app.use("/api", LikeRouter);
app.use("/api", CommentRouter);
app.use("/api",ConvertRouter);

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Database connected");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
