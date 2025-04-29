import express from "express";
import followUser from "../controller/user-profile/Follow";
import unfollowUser from "../controller/user-profile/Unfollow";

const router = express.Router();

// POST хүсэлтэнд зориулсан endpoint
router.post("/follow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    const result = await followUser(followerId, followingId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

router.post("/unfollow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    const result = await unfollowUser(followerId, followingId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;
