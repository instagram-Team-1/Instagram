import { Request, Response } from "express";
import { User } from "../../models/userModel";

const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "username fullname avatarImage"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export default getUserByUsername;
