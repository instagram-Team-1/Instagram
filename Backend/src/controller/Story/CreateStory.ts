import { Request, Response } from "express";
import { Story } from "../../models/storyModel";

export const createStory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    const { caption, expiresIn, imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ error: "Image is required" });
      return;
    }

   const expiresInMs = expiresIn ? parseInt(expiresIn) : 24 * 60 * 60 * 1000;
   const expiresAt = new Date(Date.now() + expiresInMs);

    const story = new Story({
      userId,
      imageUrl,
      caption,
      expiresAt,
      viewers: [],
    });

    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create story",
      message: (err as Error).message,
    });
  }
};
