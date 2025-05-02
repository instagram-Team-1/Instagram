import { Response } from "express";
import { IncomingForm } from "formidable";
import { cloudinaryImageUploadMethod } from "../../utils/FileUpload.util";
import Story from "../../models/Story.model";

export class StoryController {
  upload(request: any, response: Response) {
    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true,
    });

    form.parse(request, async (error, fields, files: any) => {
      if (error) {
        return response.status(500).json({
          error: "Failed to parse form data",
          details: error,
        });
      }

      const { text } = fields;
      const { backgroundMedia } = files;

      if (!backgroundMedia) {
        return response.status(400).json({ error: "No media file provided" });
      }

      try {
        const media_url = await cloudinaryImageUploadMethod(
          backgroundMedia.filepath
        );

        const newStory = new Story({
          media: media_url,
          text,
        });

        const savedStory = await newStory.save();
        return response
          .status(201)
          .json({ msg: "Story added successfully", savedStory });
      } catch (uploadError) {
        return response.status(500).json({
          error: "Failed to upload media or save story",
          details: uploadError,
        });
      }
    });
  }
}
