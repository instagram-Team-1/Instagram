import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../../models/PostModel";

export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
     res.status(400).json({ message: "Invalid post ID" });
     return;
  }

  try {
    const post = await Post.findById(postId).populate({
      path: "comments.userId",
      select: "username avatar",
    });

    if (!post) {
       res.status(404).json({ message: "Post not found" });
       return;
    }

    // Map to return username and comment cleanly (optional)
    const comments = post.comments.map((c: any) => ({
      _id: c._id,
      comment: c.comment,
      createdAt: c.createdAt,
      user: {
        _id: c.userId?._id,
        username: c.userId?.username,
        avatar: c.userId?.avatar,
      },
    }));

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
