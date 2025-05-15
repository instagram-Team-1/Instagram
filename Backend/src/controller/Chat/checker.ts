import { Request, Response } from "express";
import roomModel from "../../models/roomModel";

const checker = async (req: Request, res: Response) => {
  try {
    const { selectedUsers } = req.body;
    if (!Array.isArray(selectedUsers) || selectedUsers.length === 0) {
       res.status(400).json({ message: "Invalid selectedUsers array" });
       return
    }

    const validUsers = selectedUsers.filter((user) => user && user.name && user.id);
    if (validUsers.length < 2) {
       res.status(400).json({ message: "At least two valid users are required" });
       return
    }

    const userIds = validUsers.map((user) => user.id);

    // Check for an existing 1-on-1 chat (exactly two participants)
    const existingRoom = await roomModel.findOne({
      participants: { $size: 2, $all: userIds },
    });

    if (existingRoom) {
       res.status(200).json({ roomExists: true, roomId: existingRoom._id });
       return
    }

    // If no existing room, create a new one
    const userNames = validUsers.map((user) => user.name);
    const newRoom = await roomModel.create({
      participants: userIds,
      name: userNames.join(", "),
    });

     res.status(201).json({
      message: "Room created successfully",
      roomId: newRoom._id,
  
    });
    return
  } catch (error) {
    console.error("Error in createRoom:", error);
     res.status(500).json({ message: "Internal Server Error" });
     return
  }
};

export default checker;