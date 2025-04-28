import { Request, Response } from "express";
import Post from "../../models/PostModel"; 

// Like эсвэл Unlike хийх
export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
       res.status(400).json({ message: "User ID is required." });
       return;
    }

    const post = await Post.findById(postId);

    if (!post) {
       res.status(404).json({ message: "Post not found." });
       return;
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked." : "Post liked.",
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
