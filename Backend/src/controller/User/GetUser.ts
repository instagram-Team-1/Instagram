import { Request, Response } from "express";
import { User } from "../../models/userModel";
import mongoose from "mongoose";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (id) {
      let user;
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id).populate("posts");
      }
      if (!user) {
        user = await User.findOne({ username: id }).populate("posts");
      }

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } else {
      const users = await User.find().populate("posts");
      res.status(200).json(users);
    }
  } catch (error) {
    console.error("Error occurred while searching for user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
