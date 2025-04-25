import { Request, Response } from "express";
import Post from "../../models/PostModel";

const createPost = async (req: Request, res: Response) => {
  try {
    const { userId, caption, imageUrl } = req.body;

    if (!userId || !imageUrl) {
      res.status(400).json({ message: "User ID and Image URL are required." });
    }

    const newPost = new Post({
      userId,
      caption,
      imageUrl,
      likes: 0,
      shares: 0,
      comments: [],
      createdAt: new Date(),
    });

    const savedPost = await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully.", post: savedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default createPost;
