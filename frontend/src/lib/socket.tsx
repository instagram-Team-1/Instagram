// lib/socket.ts
import { io } from "socket.io-client";

const socket = io("https://backend-pentagram.onrender.com", {
  withCredentials: true,
});

export default socket;
