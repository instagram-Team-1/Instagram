import express from "express";
import { savePost } from "../controller/save/SavePost";
import { getSavedPosts } from "../controller/save/GetSavedPost";
import { unsavePost } from "../controller/save/UnsavePost";

const savedRouter = express.Router();

savedRouter.post("/savePost/:userId", savePost);
savedRouter.get("/getSavePost/:userId", getSavedPosts);
savedRouter.post("/unsavePost/:postId", unsavePost);

export default savedRouter;
