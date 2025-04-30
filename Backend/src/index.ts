import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import messageModel from "./models/messageModel";

dotenv.config();

const app = express();
const port = process.env.PORT 
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
if (!mongoConnectionString) {
  throw new Error("MONGO_CONNECTION_STRING is not defined in .env");
}
mongoose.connect(mongoConnectionString).then(() => {
  console.log("✅ MongoDB connected");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
    const messages = await messageModel.find({ roomId }).sort({ createdAt: 1 });
    socket.emit("previousMessages", messages);
  });

  socket.on("sendmsg", async (data) => {
    const { content, from, roomId, createdAt } = data;
    const newMsg = new messageModel({ from, content, roomId, createdAt });
    await newMsg.save();

    socket.to(roomId).emit("toClient", { from, content, createdAt, roomId });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
