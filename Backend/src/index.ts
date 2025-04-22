import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

if (!mongoConnectionString) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not defined in the environment variables"
  );
}

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Database connected");
});
app.get("/", (req, res) => {
  res.send("hellooeoo");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
