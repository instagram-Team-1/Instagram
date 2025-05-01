import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "../src/routers/authRoute";
import PostRouter from "./routers/PostRouter";
import userRouter from "../src/routers/userRouter";
import Followrouter from "./routers/FollowRouter";
import LikeRouter from "./routers/LikeRouter";
import checkMsg from "./utils/auth/checkMsg";
import Message from "./models/messageModel"

import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
if (!mongoConnectionString) {
  throw new Error("MONGO_CONNECTION_STRING is not defined in the environment variables");
}

app.use("/api/auth", authRouter);
app.use(`/api`, PostRouter);
app.use("/api/users", userRouter);
app.use("/api", Followrouter);
app.use("/api", LikeRouter);

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Database connected");
});


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

 
  socket.on('join-room', async (data) => {
    const isParticipant = await checkMsg(data.roomId, data.currentId);
     socket.join(data.roomId);
    if (isParticipant) {
      socket.join(data.roomId);
      console.log(`User ${data.currentId} joined room ${data.roomId}`);
    } else {
      console.log(`User ${data.currentId} is not a participant in room ${data.roomId}`);
    }
  });

  
  socket.on('serverMSG', async ({ roomId, senderId, content }) => {
    console.log(`Received message from ${senderId}: ${content}`);
  
    const newMessage = await new Message({
      room: roomId,
      sender: senderId,
      content,
    }).save();
  
    const populatedMessage = await newMessage.populate('sender', 'username');
  
    io.to(roomId).emit('fromServer', populatedMessage);
  });

 
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server and Socket.IO listening on http://localhost:${port}`);
});
