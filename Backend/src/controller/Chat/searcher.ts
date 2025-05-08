import { Request, Response } from "express";
import mongoose from "mongoose";
import roomModel from "../../models/roomModel";
import { User } from "../../models/userModel";

const searcher = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId = req.params.roomId;
    const { username } = req.body;

    // Validate input
    if (!username || typeof username !== "string") {
      res.status(400).json({ message: "Invalid or missing username" });
      return;
    }

    // Find the room and select participants
    const room = await roomModel.findById(roomId).select("participants");

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    // Convert participant ObjectIds to strings
    const existingUserIds = room.participants.map(
      (id: mongoose.Types.ObjectId) => id.toString()
    );

    // Find users that start with the input username and are not in the room
    const users = await User.find({
      username: { $regex: `^${username}`, $options: "i" }, // starts with, case-insensitive
      _id: { $nin: existingUserIds },
    })
      .select("_id username")
      .limit(10); // optional: limit results

    res.status(200).json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export default searcher;
