import { Request, Response } from "express";
import Story from "../../models/storyModel";

const storyAdd = async (req: Request, res: Response) => {
  try {
    const { owner, media, text } = req.body;

    if (!owner || !media || !text) {
       res.status(400).json({ message: "Missing fields" });
       return
    }

    const newStory = new Story({
      owner,
      media,
      text,
    });

    await newStory.save();
    console.log("Story saved:", newStory);

     res.status(201).json({
      message: "Story created successfully",
      story: newStory,
      
    });
  } catch (error) {
    console.error("Error saving story:", error);
     res.status(500).json({ message: "Internal server error" });
     return
  }
};

export default storyAdd;
