import express from "express";
import likePost from "../controller/Like/Like";
import unlikePost from "../controller/Like/Unlike";
import checkLike from "../controller/Like/CheckLike";

const LikeRouter = express.Router();

// Like хийх
LikeRouter.post("/like", async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const result = await likePost(userId, postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа",
    });
  }
});

// Unlike хийх
LikeRouter.post("/unlike", async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const result = await unlikePost(userId, postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа",
    });
  }
});

LikeRouter.get("/check-like", async (req, res) => {
  const { userId, postId } = req.query;
  try {
    const result = await checkLike(userId as string, postId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа",
    });
  }
});
export default LikeRouter;


