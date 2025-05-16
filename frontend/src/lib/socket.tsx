import { io } from "socket.io-client";
import { MESSENGERAPI } from "@/utils/api";

const socket = io(MESSENGERAPI, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
