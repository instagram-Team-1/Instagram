import mongoose, { Types } from "mongoose";
import { User } from "../../models/userModel";

// Follow хийх функц
async function followUser(followerId: string, followingId: string) {
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

    // Хэрэглэгч өөрийгөө follow хийхийг оролдож байгаа эсэхийг шалгах
    if (followerObjectId.equals(followingObjectId)) {
      throw new Error("Та өөрийгөө follow хийх боломжгүй");
    }

    // Хэрэглэгчдийг хайх
    const [follower, following] = await Promise.all([
      User.findById(followerObjectId),
      User.findById(followingObjectId),
    ]);

    if (!follower || !following) {
      throw new Error("Хэрэглэгч олдсонгүй");
    }

    // Аль хэдийн follow хийсэн эсэхийг шалгах
    if (follower.following?.includes(followingObjectId)) {
      throw new Error("Та энэ хэрэглэгчийг аль хэдийн follow хийсэн байна");
    }

    // Follower-ийн following жагсаалтад нэмэх
    follower.following = follower.following ?? [];
    follower.following.push(followingObjectId);

    // Following-ийн followers жагсаалтад нэмэх
    following.followers = following.followers ?? [];
    following.followers.push(followerObjectId);

    // Хоёр хэрэглэгчийн өөрчлөлтийг хадгалах
    await Promise.all([follower.save(), following.save()]);

    return {
      message: `${follower.username} successfully followed ${following.username}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Алдаа: ${error.message}`);
    }
    throw new Error("Алдаа: Тодорхойгүй алдаа гарлаа");
  }
}

export default followUser;
