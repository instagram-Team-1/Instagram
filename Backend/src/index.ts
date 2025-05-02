import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "../src/routers/authRoute";
import PostRouter from "./routers/PostRouter";
import userRouter from "../src/routers/userRouter";
import storyRouter from "./routers/storyRouter";

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
app.use("/api/story", storyRouter);

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Database connected");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
