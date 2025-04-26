import { Request, Response } from "express";
import Post from "../../models/PostModel";

const addComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId, comment, caption } = req.body;

    if (!postId || !userId ) {
       res
        .status(400)
        .json({ message: "Post ID and User ID are required." });
    }

    const updateFields: any = {
      $push: {
        comments: {
          userId,
          comment,
          createdAt: new Date(),
        },
      },
    };
    if (caption) {
      updateFields.caption = caption;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
       res.status(404).json({ message: "Post not found." });
    }

     res.status(200).json({
      message: "Comment added successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
     res.status(500).json({ message: "Internal server error." });
  }
};

export default addComment;
