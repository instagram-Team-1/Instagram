import express from "express";
import createPost from "../controller/POST/CreatePost";
import updatePost from "../controller/POST/Updatepost";
import { deletePost } from "../controller/POST/DeletePost";
import { getPostsByUser } from "../controller/POST/GetPost";
import editPost from "../controller/POST/EditPost";

const router = express.Router();

router.post("/CreatePost", createPost);
router.post("/posts/:postId", updatePost);
router.put("/UpdatePost", updatePost);
router.put("/:postId", editPost);
router.get("/posts/user/:username", getPostsByUser);
router.delete("/Delete/:postId" , deletePost);

export default router;
