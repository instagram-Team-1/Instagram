import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "../src/routers/authRoute";
import PostRouter from "./routers/PostRouter";
import userRouter from "../src/routers/userRouter";
import storyRouter from "./routers/StoryRouter";
import Followrouter from "./routers/FollowRouter";
import LikeRouter from "./routers/LikeRouter";
import CommentRouter from "./routers/CommentRouter";
import ConvertRouter from "./routers/ConvertRouter";
import SuggestRouter from "./routers/SuggestedRouter";
import chatRoute from "./routers/chatRoute";
import Message from "./models/messageModel";
import roomModel from "./models/roomModel";
import http from "http";
import { Server } from "socket.io";
import checkMsg from "./utils/auth/checkMsg";
import savedRouter from "./routers/SaveRouter";
import Notification from "./models/notification";
import { User } from "./models/userModel";
import notificationRoutes from "./routers/notification";
import highlightRouter from "./routers/HighlightRoute";

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://newwinstagram.vercel.app"],
  })
);

const server = http.createServer(app);

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
if (!mongoConnectionString) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not defined in the environment variables"
  );
}

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Database connected");
});

// Routers
app.use("/api/auth", authRouter);
app.use("/api", PostRouter);
app.use("/api/users", userRouter);
app.use("/api", Followrouter);
app.use("/api", LikeRouter);
app.use("/api", CommentRouter);
app.use("/api", ConvertRouter);
app.use("/api", storyRouter);
app.use("/api", savedRouter);
app.use("/api", SuggestRouter);
app.use("/api/chat", chatRoute);
app.use("/api/notifications", notificationRoutes);
app.use("/api/highlight", highlightRouter);

// // Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000", "https://newwinstagram.vercel.app"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// type RoomUsers = { [roomId: string]: string[] };
// let roomUsers: RoomUsers = {};

// const users = new Map();

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("join-room", async (data) => {
//     const { roomId, currentId } = data;
//     const isParticipant = await checkMsg(roomId, currentId);

//     if (isParticipant) {
//       if (!roomUsers[roomId]) {
//         roomUsers[roomId] = [];
//       }
//       roomUsers[roomId].push(socket.id);
//       socket.join(roomId);
//       console.log(`User ${currentId} joined room ${roomId}`);

//       const messages = await Message.find({ room: roomId })
//         .sort({ createdAt: 1 })
//         .populate("sender", "username avatarImage");

//       socket.emit("previousMessages", messages);
//     } else {
//       console.log(`User ${currentId} is not a participant in room ${roomId}`);
//     }
//   });

//   socket.on("serverMSG", async ({ roomId, senderId, content }) => {
//     const isInRoom = [...socket.rooms].includes(roomId);
//     if (!isInRoom) {
//       return socket.emit("error", {
//         message: "You must join the room before sending messages.",
//       });
//     }

//     const newMessage = await new Message({
//       room: roomId,
//       sender: senderId,
//       content,
//     }).save();

//     const populatedMessage = await newMessage.populate(
//       "sender",
//       "username avatarImage"
//     );

//     io.to(roomId).emit("fromServer", populatedMessage);

//     await roomModel.findByIdAndUpdate(roomId, {
//       lastMessage: populatedMessage._id,
//     });
//   });

//   socket.on("disconnect", async () => {
//     for (const roomId in roomUsers) {
//       const userIndex = roomUsers[roomId].indexOf(socket.id);
//       if (userIndex !== -1) {
//         roomUsers[roomId].splice(userIndex, 1);
//         console.log(`User ${socket.id} disconnected from room ${roomId}`);

//         if (roomUsers[roomId].length === 0) {
//           console.log(`Room ${roomId} is now empty`);

//           const lastMessage = await Message.findOne({ room: roomId }).sort({
//             createdAt: -1,
//           });

//           if (lastMessage) {
//             await roomModel.findByIdAndUpdate(roomId, {
//               lastMessage: lastMessage.content,
//             });

//             console.log(
//               `Room ${roomId} updated with last message: "${lastMessage.content}"`
//             );
//           }
//         }
//         break;
//       }
//     }
//   });

//   socket.on("join-user", (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined personal room`);
//   });

//   socket.on("addUser", (userId) => {
//     users.set(userId, socket.id); // холбоод хадгална
//   });

//   socket.on("sendNotification", async ({ senderId, receiverId, type }) => {
//     try {
//       const senderUser = await User.findById(senderId);
//       if (!senderUser) return console.error("Sender user not found");

//       const username = senderUser.username;
//       const receiverSocketId = users.get(receiverId);

//       // -------------------- FOLLOW --------------------
//       if (type === "follow") {
//         const newNotification = new Notification({
//           senderId,
//           receiverId,
//           type,
//           message: `${username} followed you.`,
//         });

//         await newNotification.save();

//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("getNotification", {
//             senderId,
//             username,
//             type,
//           });
//         }
//       }

//       // -------------------- UNFOLLOW --------------------
//       if (type === "unfollow") {
//         await Notification.deleteMany({
//           senderId,
//           receiverId,
//           type: "follow",
//         });

//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("deleteNotification", {
//             senderId,
//             type: "follow",
//           });
//         }
//       }

//       // -------------------- LIKE --------------------
//       if (type === "like") {
//         const newNotification = new Notification({
//           senderId,
//           receiverId,
//           type,
//           message: `${username} liked your post.`,
//         });

//         await newNotification.save();

//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("getNotification", {
//             senderId,
//             username,
//             type,
//             message: newNotification.message,
//           });
//         }
//       }

//       // -------------------- UNLIKE --------------------
//       if (type === "unlike") {
//         await Notification.deleteMany({
//           senderId,
//           receiverId,
//           type: "like",
//         });

//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("deleteNotification", {
//             senderId,
//             type: "like",
//           });
//         }
//       }

//       // -------------------- COMMENT --------------------
//       if (type === "comment") {
//         const newNotification = new Notification({
//           senderId,
//           receiverId,
//           type,
//           message: `${username} commented on your post.`,
//         });

//         await newNotification.save();

//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("getNotification", {
//             senderId,
//             username,
//             type,
//           });
//         }
//       }
//     } catch (error) {
//       console.error("❌ Notification хадгалахад эсвэл устгахад алдаа:", error);
//     }
//   });
//   socket.on("disconnect", () => {
//     for (const [userId, socketId] of users.entries()) {
//       if (socketId === socket.id) {
//         users.delete(userId);
//         console.log("🔴 Хэрэглэгч салсан:", userId);
//         break;
//       }
//     }
//   });
// });


server.listen(port, () => {
  console.log(`Server and Socket.IO listening on http://localhost:${port}`);
});
