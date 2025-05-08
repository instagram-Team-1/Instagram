import express from "express";
import upload from "../config/multer.config";
import {
  createStory,
  getStories,
  updateStory,
  deleteStory,
} from "../controller/Story/storyController";

const router = express.Router();

router.get("/story", getStories);
router.post("/story", upload.single("image"), createStory);
router.put("/story/:id", updateStory);
router.delete("/story/:id", deleteStory);

export default router;
