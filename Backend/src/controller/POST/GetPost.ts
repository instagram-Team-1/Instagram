import { Request, Response } from "express";
import Post from "../../models/PostModel";
import { User } from "../../models/userModel";

export const getPostsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
      return;
    }
  
    const posts = await Post.find({ userId: user._id });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
