import mongoose from "mongoose";
import Post from "../../models/PostModel";

async function checkLike(userId: string, postId: string) {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(postId)
    ) {
      throw new Error("ID формат буруу байна");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Пост олдсонгүй");
    }

    const liked = post.likes?.some((id) => id.toString() === userId.toString());

    return { liked: liked ?? false };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Тодорхойгүй алдаа"
    );
  }
}

export default checkLike;
