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

    await newHighlight.save(); // MongoDB руу хадгална
    res.status(201).json(newHighlight); // Хадгалсан highlight-ийг буцаана
  } catch (error) {
    res.status(500).json({ message: "Error creating highlight", error });
  }
};

// Highlight-ийн жагсаалтыг авах
export const getHighlightsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const highlights = await Highlight.find({ userId }).populate("stories");
    res.status(200).json(highlights); // Буцаах
  } catch (error) {
    res.status(500).json({ message: "Error fetching highlights", error });
  }
};

// Highlight нэгийг авах
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

// Highlight устгах
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
