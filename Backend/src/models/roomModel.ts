
import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: String,
    
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);