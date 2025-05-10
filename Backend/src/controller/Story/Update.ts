import { Request, Response } from "express";
import { Story } from "../../models/storyModel";

export const updateStory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { caption, expiresIn } = req.body;

    const story = await Story.findById(id);
    if (!story) {
      res.status(404).json({ error: "Story not found" });
      return;
    }

    if (caption) story.caption = caption;
    if (expiresIn) {
      story.expiresAt = new Date(Date.now() + parseInt(expiresIn));
    }

    await story.save();
    res.status(200).json(story);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update story",
      message: (err as Error).message,
    });
  }
};
