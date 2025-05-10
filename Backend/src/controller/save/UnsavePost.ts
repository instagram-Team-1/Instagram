import { Request, Response } from "express";
import { User } from "../../models/userModel";
import mongoose from "mongoose";

export const unsavePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Valid postId is required in body" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const postObjectId = new mongoose.Types.ObjectId(postId);
    user.savedPosts = user.savedPosts.filter((id) => !id.equals(postObjectId));
    await user.save();

    res.status(200).json({
      message: "Post unsaved successfully",
      savedPosts: user.savedPosts,
    });
    return;
  } catch (error) {
    console.error("Error unsaving post:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
