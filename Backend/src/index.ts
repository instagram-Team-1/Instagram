import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from '../src/routers/authRoute'
import cookieParser from "cookie-parser";
const app = express();
const port = 9000;
import cors from 'cors'
dotenv.config();

app.use(express.json());
app.use(cookieParser());

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

if (!mongoConnectionString) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not defined in the environment variables"
  );
}
const allowedOrigins = [
  "http://localhost:3000",
  "https://instagram-yourdomain.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use('/api/auth', authRouter)
mongoose.connect(mongoConnectionString).then(() => {
  console.log("Database connected");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
