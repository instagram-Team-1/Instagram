import express from "express";
import createPost from "../controller/POST/CreatePost";
import updatePost from "../controller/POST/Updatepost";
import { deletePost } from "../controller/POST/DeletePost";
import { getPostsByUser } from "../controller/POST/GetPost";
import  Createcomment  from "../controller/Comment/CreateComment";



const router = express.Router();

router.post("/CreatePost", createPost);
router.put("/UpdatePost", updatePost);
router.post("/posts/:postId", updatePost);
router.delete("/Delete/:postId" , deletePost);
router.get("/posts/user/:username", getPostsByUser);

export default router;
