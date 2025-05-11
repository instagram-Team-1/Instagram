import { Request, Response } from "express";
import { Story } from "../../models/storyModel";

export const hasUserViewedStories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { storyIds, userId } = req.body;

    if (!Array.isArray(storyIds) || !userId) {
      res
        .status(400)
        .json({ error: "storyIds (array) болон userId шаардлагатай." });
      return;
    }

    // Бүх story-г авчирч, тухайн хэрэглэгч үзсэн үү гэдгийг шалгана
    const stories = await Story.find({ _id: { $in: storyIds } });

    const viewedStoryIds = stories
      .filter((story) => story.viewers.includes(userId))
      .map((story) => story.id.toString());

    res.status(200).json({ viewedStoryIds }); // ['id1', 'id2']
  } catch (err) {
    res.status(500).json({
      error: "Үзсэн эсэхийг шалгах үед алдаа гарлаа",
      message: (err as Error).message,
    });
  }
};
