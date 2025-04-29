import { Request, Response } from "express";
import Post from "../../models/PostModel";

export const getPostsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    const posts = await Post.find({ username }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
