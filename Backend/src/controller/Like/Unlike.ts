import mongoose from "mongoose";
import { User } from "../../models/userModel";
import  Post  from "../../models/PostModel";

// Unlike хийх функц
async function unlikePost(userId: string, postId: string) {
  try {
    // ID-ийн форматыг шалгах
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(postId)
    ) {
      throw new Error("Буруу ID формат");
    }

    // string-г ObjectId болгон хөрвүүлэх
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const postObjectId = new mongoose.Types.ObjectId(postId);

    // Хэрэглэгч болон постыг хайх
    const [user, post] = await Promise.all([
      User.findById(userObjectId),
      Post.findById(postObjectId),
    ]);

    if (!user || !post) {
      throw new Error("Хэрэглэгч эсвэл пост олдсонгүй");
    }

    if (!post.likes?.includes(userObjectId)) {
      return {
        message: "Та энэ постыг like хийгээгүй байна",
        likes: post.likes,
      };
    }
    // Постын likes жагсаалтаас хэрэглэгчийн ID-г хасах
    post.likes = post.likes?.filter((id) => !id.equals(userObjectId)) ?? [];


    await Promise.all([ post.save()]);

    return {
      message: `${user.username} successfully unliked the post`,
      likes: post.likes,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Алдаа: ${error.message}`);
    }
    throw new Error("Алдаа: Тодорхойгүй алдаа гарлаа");
  }
}

export default unlikePost;