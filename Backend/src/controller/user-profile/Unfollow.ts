import mongoose, { Types } from "mongoose";
import { User } from "../../models/userModel";

// Unfollow хийх функц
async function unfollowUser(followerId: string, followingId: string) {
  try {
    // ID-ийн форматыг шалгах
    if (
      !mongoose.Types.ObjectId.isValid(followerId) ||
      !mongoose.Types.ObjectId.isValid(followingId)
    ) {
      throw new Error("Буруу ID формат");
    }

    // string-г ObjectId болгон хөрвүүлэх
    const followerObjectId = new mongoose.Types.ObjectId(followerId);
    const followingObjectId = new mongoose.Types.ObjectId(followingId);

    // Хэрэглэгч өөрийгөө unfollow хийхийг оролдож байгаа эсэхийг шалгах
    if (followerObjectId.equals(followingObjectId)) {
      throw new Error("Та өөрийгөө unfollow хийх боломжгүй");
    }

    // Хэрэглэгчдийг хайх
    const [follower, following] = await Promise.all([
      User.findById(followerObjectId),
      User.findById(followingObjectId),
    ]);

    if (!follower || !following) {
      throw new Error("Хэрэглэгч олдсонгүй");
    }

    // Follow хийгээгүй бол шалгах
    if (!follower.following?.includes(followingObjectId)) {
      throw new Error("Та энэ хэрэглэгчийг follow хийгээгүй байна");
    }

    // Follower-ийн following жагсаалтаас хасах
    follower.following = follower.following ?? [];
    follower.following = follower.following.filter(
      (id) => !id.equals(followingObjectId)
    );

    // Following-ийн followers жагсаалтаас хасах
    following.followers = following.followers ?? [];
    following.followers = following.followers.filter(
      (id) => !id.equals(followerObjectId)
    );

    // Хоёр хэрэглэгчийн өөрчлөлтийг хадгалах
    await Promise.all([follower.save(), following.save()]);

    return {
      message: `${follower.username} successfully unfollowed ${following.username}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Алдаа: ${error.message}`);
    }
    throw new Error("Алдаа: Тодорхойгүй алдаа гарлаа");
  }
}

export default unfollowUser;
