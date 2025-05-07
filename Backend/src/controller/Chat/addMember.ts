import { Request, Response } from "express";
import roomModel from "../../models/roomModel";
import mongoose from "mongoose"; // Import mongoose to use ObjectId

const addMember = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({ message: "userIds must be a non-empty array" });
      return;
    }

    // Validate if all userIds are valid ObjectIds
    const invalidUserIds = userIds.filter((id: string) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidUserIds.length > 0) {
      res.status(400).json({ message: `Invalid user IDs: ${invalidUserIds.join(", ")}` });
      return;
    }

    const room = await roomModel.findById(roomId);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    // Explicitly typing 'id' as mongoose.Types.ObjectId to avoid TS7006 error
    const existingIds = room.participants.map((id: mongoose.Types.ObjectId) => id.toString());

    const newUserIds = userIds.filter((id: string) => !existingIds.includes(id));

    if (newUserIds.length === 0) {
      res.status(400).json({ message: "All users already in room" });
      return;
    }

    room.participants.push(...newUserIds);
    await room.save();

    res.status(200).json({ message: "Users added to room", added: newUserIds });
    return;
  } catch (error) {
    console.error("Error adding users to room:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export default addMember;
