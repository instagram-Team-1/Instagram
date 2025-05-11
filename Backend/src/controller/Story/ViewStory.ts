import { Request, Response } from "express";
import { Story } from "../../models/storyModel";

export const getStoryViewers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storyId = req.params.storyId;

    const story = await Story.findById(storyId).populate(
      "viewers",
      "username avatar email"
    ); 

    if (!story) {
      res.status(404).json({ error: "Story not found" });
      return;
    }

    res.status(200).json({ viewers: story.viewers });
  } catch (err) {
    res.status(500).json({
      error: "Failed to get viewers",
      message: (err as Error).message,
    });
  }
};
