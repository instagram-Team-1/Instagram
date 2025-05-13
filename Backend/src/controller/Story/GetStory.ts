import { Request, Response } from "express";
import { Story } from "../../models/storyModel";
import { User } from "../../models/userModel";

// GET /api/story/:userId
export const getStories = async (

  
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "userId шаардлагатай" });
      return;
    }

    // Хэрэглэгч болон дагалдагчдыг олох
    const user = await User.findById(userId).populate("following");

    if (!user || !user.following) {
      res
        .status(404)
        .json({ error: "Хэрэглэгч олдсонгүй эсвэл дагалдагчгүй байна" });
      return;
    }

    const allowedUserIds = [user._id, ...user.following.map((f) => f._id)];
    const now = new Date();

    // Story-нуудыг авах (userId болон expiresAt шалгуураар)
    const stories = await Story.find({
      userId: { $in: allowedUserIds },
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username avatarImage");

    // Story-нуудыг хэрэглэгчээр бүлэглэх
    const groupedStories: Record<string, any> = {};

    for (const story of stories) {
      const userKey = story.userId._id.toString();

      if (!groupedStories[userKey]) {
        groupedStories[userKey] = {
          user: story.userId,
          stories: [],
        };
      }

      groupedStories[userKey].stories.push(story);
    }

    // Объектийг массив болгон хөрвүүлэх
    const result = Object.values(groupedStories);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      error: "Story татаж чадсангүй",
      message: (err as Error).message,
    });
  }
};

export const getAllMyStories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "userId шаардлагатай" });
      return;
    }

    const stories = await Story.find({ userId }) // зөвхөн тухайн хэрэглэгчийн stories
      .sort({ createdAt: -1 })
      .populate("userId", "username avatarImage");

    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({
      error: "Өөрийн бүх stories-г татаж чадсангүй",
      message: (err as Error).message,
    });
  }
};
