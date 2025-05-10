import { Request, Response } from "express";
import { Story } from "../../models/storyModel";

export const addStoryViewer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { storyId, userId } = req.body; // ✅ энэ мөрийг өөрчил

    if (!storyId || !userId) {
      res.status(400).json({ error: "Story ID and User ID are required" });
      return;
    }

    const story = await Story.findById(storyId);

    if (!story) {
      res.status(404).json({ error: "Story not found" });
      return;
    }

    if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      await story.save();
    }
    res.status(200).json({ hasViewed: true });
  } catch (err) {
    res.status(500).json({
      error: "Failed to add viewer",
      message: (err as Error).message,
    });
  }
};
