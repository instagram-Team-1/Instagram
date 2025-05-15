import { Request, Response } from "express";
import { User } from "../../models/userModel";

export const convertUserIdToUsername = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
       res.status(400).json({ error: "User ID is required" });
       return;
    }

    const user = await User.findById(userId).select("username avatarImage");

    if (!user) {
       res.status(404).json({ error: "User not found" });
       return;
    }

     res
       .status(200)
       .json({ username: user.username, avatarImage: user.avatarImage });
     return;
  } catch (error) {
    console.error("Error converting user ID to username:", error);
     res.status(500).json({ error: "Internal server error" });
     return;
  }
};
