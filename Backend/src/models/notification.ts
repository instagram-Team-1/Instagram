// models/notificationModel.ts
import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  senderId: string;
  receiverId: string;
  type: string; // (like, comment, follow, etc.)
  message: string; // (Тохирох мэдэгдэл)
  read: boolean; // Хэрэглэгч уншсан эсэх
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
export default Notification;
