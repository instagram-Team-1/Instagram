import { Response } from "express";
import { IncomingForm } from "formidable";
import { cloudinaryImageUploadMethod } from "../../utils/FileUpload.util";
import Story from "../../models/Story.model";

export class StoryController {
  upload(request: any, response: Response) {
    const token = request.token;
    const userId = token.id || token.userId;

    const form = new IncomingForm();

    form.parse(request, async (error, fields, files: any) => {
      if (error) {
        return response
          .status(500)
          .json({ error: "Failed to parse form data", details: error });
      }

      const { text } = fields;
      const { backgroundMedia } = files;

      if (!backgroundMedia) {
        return response.status(400).json({ error: "No media file provided" });
      }

      try {
        const media_url = await cloudinaryImageUploadMethod(
          backgroundMedia[0].path
        );

        const newStory = new Story({
          owner: userId,
          media: media_url,
          text,
        });

        const savedStory = await newStory.save();
        return response.status(201).json({ msg: "Story added", savedStory });
      } catch (error) {
        return response
          .status(500)
          .json({ error: "Failed to save the story", details: error });
      }
    });
  }
}
