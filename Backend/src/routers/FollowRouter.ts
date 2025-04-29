import express from "express";
import followUser from "../controller/user-profile/Follow";
import unfollowUser from "../controller/user-profile/Unfollow";

const router = express.Router();

router.post("/follow", async (req, res) => {
  const { followerId, followingId } = req.body;
  try {
    const result = await followUser(followerId, followingId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
  }
});

router.post("/unfollow", async (req, res) => {
  const { followerId, followingId } = req.body;
  try {
    const result = await unfollowUser(followerId, followingId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
  }
});

export default router;
