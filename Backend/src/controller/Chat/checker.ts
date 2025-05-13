import { Request, Response } from "express";
import roomModel from "../../models/roomModel";

const checker = async (req: Request, res: Response) => {
  const { selectedUsers } = req.body;

  if (!Array.isArray(selectedUsers) || selectedUsers.length !== 2) {
    res.status(400).send("Exactly two users are required.");
    return;
  }

  const [user1, user2] = selectedUsers;

  if (user1.id === user2.id) {
    res.status(400).send("The two users must be different.");
    return;
  }

  try {
    // Check if a room exists with exactly these two participants
    const existingRoom = await roomModel.findOne({
      participants: { $all: [user1.id, user2.id] },
      $expr: { $eq: [{ $size: "$participants" }, 2] },
    });
console.log(existingRoom);

    if (existingRoom) {
      res.send({ exists: true, roomId: existingRoom._id });
      return;
    }
    
    res.send({ exists: false });
    return;
  } catch (error) {
    console.error("Error checking room:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

export default checker;
