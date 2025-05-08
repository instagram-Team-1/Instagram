import { Request, Response } from "express";
import { Story } from "../../models/storyModel";
import cloudinary from "../../utils/cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
});

// POST /api/story
export const createStory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { caption, expiresIn, userId } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "Image is required" });
      return;
    }

    const upload = await cloudinary.uploader.upload(file.path, {
      upload_preset: process.env.UPLOAD_PRESET,
    });

    const expiresAt = new Date(Date.now() + parseInt(expiresIn || "86400000")); // default 24h

    const story = new Story({
      userId,
      imageUrl: upload.secure_url,
      caption,
      expiresAt,
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

// GET /api/story?userId=xxx
export const getStories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const stories = await Story.find(query).sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch stories",
      message: (err as Error).message,
    });
  }
};

// PUT /api/story/:id
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

// DELETE /api/story/:id
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
