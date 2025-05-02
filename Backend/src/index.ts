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
import Message from "./models/messageModel";
import roomModel from './models/chatroomModel';
import http from "http";
import { Server } from "socket.io";

type RoomUsers = {
  [roomId: string]: string[]; // RoomId maps to a list of user socket IDs
};

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

let roomUsers: RoomUsers = {}; // Initialize roomUsers

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on('join-room', async (data) => {
    const { roomId, currentId } = data; // Destructure data
    const isParticipant = await checkMsg(roomId, currentId);

    if (isParticipant) {
      if (!roomUsers[roomId]) {
        roomUsers[roomId] = []; // Initialize array if room doesn't exist yet
      }
      roomUsers[roomId].push(socket.id); // Add socket.id to the room's list
      socket.join(roomId);
      console.log(`User ${currentId} joined room ${roomId}`);
    } else {
      console.log(`User ${currentId} is not a participant in room ${roomId}`);
    }
  });

  // Handle receiving a message
  socket.on('serverMSG', async ({ roomId, senderId, content }) => {
    console.log(`Received message from ${senderId}: ${content}`);

    const newMessage = await new Message({
      room: roomId,
      sender: senderId,
      content,
    }).save();

    const populatedMessage = await newMessage.populate('sender', 'username');

    io.to(roomId).emit('fromServer', populatedMessage);

    // Save the last message in the room
    await roomModel.findByIdAndUpdate(roomId, { lastMessage: populatedMessage._id });
  });


  socket.on("disconnect", async () => {  // Marked as async
    // Loop through roomUsers to find the user who disconnected and remove them
    for (const roomId in roomUsers) {
      const userIndex = roomUsers[roomId].indexOf(socket.id);
      if (userIndex !== -1) {
        // Remove user from the room
        roomUsers[roomId].splice(userIndex, 1);
        console.log(`User ${socket.id} disconnected from room ${roomId}`);
  
        // Check if this was the last user in the room
        if (roomUsers[roomId].length === 0) {
          console.log(`Room ${roomId} is now empty`);
  
          // Find the last message in the room
          const lastMessage = await Message.findOne({ room: roomId }).sort({ createdAt: -1 }).limit(1);
  
          if (lastMessage) {
            // Update room with the last message text
            await roomModel.findByIdAndUpdate(roomId, {
              lastMessage: lastMessage.content, 
            });
  
            console.log(`Room ${roomId} updated with last message: "${lastMessage.content}"`);
          }
        }
        break;
      }
    }
  });
  
});


server.listen(port, () => {
  console.log(`Server and Socket.IO listening on http://localhost:${port}`);
});
