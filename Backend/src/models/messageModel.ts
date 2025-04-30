import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  roomId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, required: true }, 
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
