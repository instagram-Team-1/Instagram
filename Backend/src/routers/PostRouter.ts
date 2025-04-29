import express from "express";
import createPost from "../controller/POST/CreatePost";
import updatePost from "../controller/POST/Updatepost";
import { deletePost } from "../controller/POST/DeletePost";
import { getPostsByUser } from "../controller/POST/GetPost";
import { likePost } from "../controller/Like/LikeAndUnLike";


const router = express.Router();

router.post("/CreatePost", createPost);
router.put("/UpdatePost", updatePost);
router.post("/posts/:postId", updatePost);
router.delete("/Delete/:postId" , deletePost);
router.get("/posts/user/:username", getPostsByUser);
router.post("/posts/:postId/like", likePost);

export default router;
