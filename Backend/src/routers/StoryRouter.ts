import express from "express";

import { getStories } from "../controller/Story/GetStory";
import { createStory } from "../controller/Story/CreateStory";
import { updateStory } from "../controller/Story/Update";
import { deleteStory } from "../controller/Story/DeleteStory";
import { getStoryViewers } from "../controller/Story/ViewStory";
import { addStoryViewer } from "../controller/Story/PostViewStory";
import { hasUserViewedStories } from "../controller/Story/GetViewStory";


const router = express.Router();

router.get("/Getstory/:userId", getStories);
router.post("/story/:userId", createStory);
router.put("/story/:id", updateStory);
router.delete("/story/:id", deleteStory);

router.post("/storyHasView", hasUserViewedStories);
router.post("/ViewStory", addStoryViewer);

export default router;
