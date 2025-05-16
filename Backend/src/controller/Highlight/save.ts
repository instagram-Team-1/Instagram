import { Request, Response } from "express";
import { Highlight } from "../../models/highlightModel";

export const createHighlight = async (req: Request, res: Response) => {
  const { userId, stories, title } = req.body;

  try {
    const newHighlight = new Highlight({
      userId,
      stories,
      title,
    });

    await newHighlight.save();
    res.status(201).json(newHighlight);
  } catch (error) {
    res.status(500).json({ message: "Error creating highlight", error });
  }
};

export const getHighlightsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const highlights = await Highlight.find({ userId }).populate("stories");
    res.status(200).json(highlights);
  } catch (error) {
    res.status(500).json({ message: "Error fetching highlights", error });
  }
};

export const getHighlightById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const highlight = await Highlight.findById(id).populate("stories");
    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }
    res.status(200).json(highlight);
  } catch (error) {
    res.status(500).json({ message: "Error fetching highlight", error });
  }
};

export const deleteHighlight = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const highlight = await Highlight.findByIdAndDelete(id);
    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }
    res.status(200).json({ message: "Highlight deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting highlight", error });
  }
};

// Шинэ функц: Highlight-аас story устгах
export const removeStoryFromHighlight = async (req: Request, res: Response) => {
  const { highlightId, storyId } = req.body;

  try {
    const highlight = await Highlight.findById(highlightId);
    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    highlight.stories = highlight.stories.filter(
      (s: any) => s.toString() !== storyId
    );

    await highlight.save();

    res.status(200).json({ message: "Story removed from highlight" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to remove story from highlight", error });
  }
};
