import express from "express";
import Createcomment from "../controller/Comment/CreateComment";
import { getComments } from "../controller/Comment/GetComment";

const router = express.Router();



router.post("/posts/comment/:postId", Createcomment);
router.get("/posts/comment/:postId", getComments);

export default router;
