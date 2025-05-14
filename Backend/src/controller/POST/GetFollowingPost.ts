import Post from "../../models/PostModel";
import { User } from "../../models/userModel";
import { Request, Response } from "express";

export const getFeedPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

    let posts;

    if (!user.following || user.following.length === 0) {
      posts = await Post.find()
        .sort({ likes: -1 })
        .limit(5)
        .populate("userId", "username avatarImage")
        .populate("likes", "username avatarImage")
        .populate("comments.userId", "username avatarImage");
    } else {
      posts = await Post.find({ userId: { $in: user.following } })
        .sort({ createdAt: -1 })
        .populate("userId", "username avatarImage")
        .populate("likes", "username avatarImage")
        .populate("comments.userId", "username avatarImage");
    }
     res.status(200).json(posts);
     return;
  } catch (err) {
    console.error("Error fetching feed posts:", err);
     res.status(500).json({ message: "Server error", error: err });
     return;
  }
};