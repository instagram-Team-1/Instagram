import { Request, Response } from "express";
import { Story } from "../../models/storyModel";

export const deleteStory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);
    if (!story) {
      res.status(404).json({ error: "Story not found" });
      return;
    }

    // Optional: Cloudinary-оос зургийг устгах бол
    // const publicId = story.imageUrl.split('/').pop()?.split('.')[0];
    // if (publicId) await cloudinary.uploader.destroy(`folder/${publicId}`);

    await Story.findByIdAndDelete(id);
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete story",
      message: (err as Error).message,
    });
  }
};
