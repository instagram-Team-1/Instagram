import { Request, Response } from "express";
import { User } from "../../models/userModel";
import Post from "../../models/PostModel";
import mongoose from "mongoose";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (id) {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id);
      }

      if (!user) {
        user = await User.findOne({ username: id });
      }

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // 🔢 Нийт постын тоог олж авах
      const postCount = await Post.countDocuments({ userId: user._id });

      res.status(200).json({
        ...user.toObject(), // хэрэглэгчийн өгөгдлийг энгийн object болгоно
        postCount, // постын тоо нэмнэ
      });
    } else {
      const users = await User.find();

      // 🔢 Хэрэглэгч бүрийн постын тоог оруулах
      const usersWithPostCount = await Promise.all(
        users.map(async (user) => {
          const postCount = await Post.countDocuments({ userId: user._id });
          return {
            ...user.toObject(),
            postCount,
          };
        })
      );

      res.status(200).json(usersWithPostCount);
    }
  } catch (error) {
    console.error("Error occurred while searching for user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
