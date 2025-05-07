import { Request, Response } from "express";
import { User } from "../../models/userModel";

export const getSavedPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .populate("savedPosts") // энэ populate нь зөв ажиллах ёстой
      .exec(); // optional, гэвч зарим тохиолдолд хэрэгтэй байдаг

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ savedPosts: user.savedPosts });
    return;
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
