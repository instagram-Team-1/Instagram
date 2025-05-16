import express, { Request, Response } from "express";
import {
  createHighlight,
  getHighlightsByUser,
  getHighlightById,
  deleteHighlight,
  removeStoryFromHighlight,
} from "../controller/Highlight/save";

const router = express.Router();

router.post("/add", async (req: Request, res: Response) => {
  try {
    await createHighlight(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
});

router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    await getHighlightsByUser(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    await getHighlightById(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteHighlight(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
});

router.delete("/story/:storyId", async (req: Request, res: Response) => {
  try {
    await removeStoryFromHighlight(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
});

export default router;
