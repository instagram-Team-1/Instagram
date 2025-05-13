import { Request, Response } from "express";
import Post from "../../models/PostModel";

interface PostParams {
  postId: string;
}

const editPost = async (
  req: Request<PostParams>,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;
    const { caption, imageUrl } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    if (caption !== undefined) post.caption = caption;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;

    const updatedPost = await post.save();

    res.status(200).json({
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default editPost;
