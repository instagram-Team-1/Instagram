import { Request, Response } from "express";
import { User } from "../../models/userModel";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.query;

    if (username) {
      const user = await User.findOne({ username });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
      return;
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
