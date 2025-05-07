import { Request, Response } from "express";
import roomModel from "../../models/roomModel";
import { User } from "../../models/userModel";  // Assuming you have a User model

const getGroup = async (req: Request, res: Response) => {
  const roomId = req.params.roomId;

  try {
    // Find the room by ID and select only participants field
    const room = await roomModel.findById(roomId).select("participants");

    if (!room) {
       res.status(404).send({ message: "Room not found" });
       return
    }

    // Get the participants' details (username and avatarImage) based on their userIds
    const participants = await User.find({
      _id: { $in: room.participants },  // Find users whose _id is in the participants array
    }).select("username avatarImage");  // Corrected field names

    // Map the participants to include username and avatarImage
    const participantsWithDetails = participants.map(user => ({
      _id: user._id,
      username: user.username,      // Corrected field name
      avatarImage: user.avatarImage, // Corrected field name
    }));

    res.status(200).json({ participants: participantsWithDetails });
  } catch (error) {
    console.error("Error fetching group participants:", error);
    res.status(500).send("Server error");
  }
};

export default getGroup;
