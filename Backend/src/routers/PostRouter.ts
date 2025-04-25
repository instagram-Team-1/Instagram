import express from "express";
import createPost from "../controller/POST/CreatePost";
import updatePost from "../controller/POST/Updatepost";
import { deletePost } from "../controller/POST/DeletePost";


const router = express.Router();

router.post("/CreatePost", createPost);
router.put("/UpdatePost", updatePost);
router.post("/posts/:postId", updatePost);
router.delete("/Delete/:postId" , deletePost);

export default router;
