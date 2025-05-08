import { Request, Response } from "express";
import { User } from "../../models/userModel";

import mongoose from "mongoose";

export const savePost = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const postId = req.body.postId;

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Valid postId is required in headers" });
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const postObjectId = new mongoose.Types.ObjectId(postId);

    if (user.savedPosts.includes(postObjectId)) {
      res.status(400).json({ message: "Post already saved" });
      return;
    }

    user.savedPosts.push(postObjectId);
    await user.save();

    res.status(200).json({
      message: "Post saved successfully",
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
