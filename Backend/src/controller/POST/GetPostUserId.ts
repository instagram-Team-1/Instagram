import { Request, Response } from "express";
import Post from "../../models/PostModel";
import { User } from "../../models/userModel";

export const getPostsUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ userId });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
