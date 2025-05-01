import mongoose from "mongoose";
import { User } from "../../models/userModel";
import  Post  from "../../models/PostModel";

// Like хийх функц
async function likePost(userId: string, postId: string) {
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

    if (post.likes?.some((id) => id.toString() === userId)) {
      return {
        message: "Та энэ постыг аль хэдийн like хийсэн байна",
        likes: post.likes,
      };
    }


    // Постын likes жагсаалтад хэрэглэгчийн ID-г нэмэх
    post.likes = post.likes ?? [];
    post.likes.push(userObjectId);


    await Promise.all([ post.save()]);

    return {
      message: `${user.username} successfully liked the post`,
      likes: post.likes,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Алдаа: ${error.message}`);
    }
    throw new Error("Алдаа: Тодорхойгүй алдаа гарлаа");
  }
}

export default likePost;
