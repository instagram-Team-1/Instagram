import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from '../src/routers/authRoute'
const app = express();
const port = 9000;
import cors from 'cors'
dotenv.config();

app.use(express.json());

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

if (!mongoConnectionString) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not defined in the environment variables"
  );
}
app.use(cors())
app.use('/api/auth', authRouter)
mongoose.connect(mongoConnectionString).then(() => {
  console.log("Database connected");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
