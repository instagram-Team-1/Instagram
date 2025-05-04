import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../../models/PostModel";

export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;


  const post = await Post.findById(postId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
     res.status(400).json({ message: "Invalid user ID" });
     return;
  }

  if (!comment) {
     res.status(400).json({ message: "Comment is required." });
     return;
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
       res.status(404).json({ message: "Post not found" });
       return;
    }

    const newComment = {
      userId: new mongoose.Types.ObjectId(userId),
      comment,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default createComment;
