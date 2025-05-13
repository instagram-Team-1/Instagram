import express from "express";
import Notification from "../models/notification"; 

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiverId: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Notification fetch error:", err);
    res.status(500).json({ message: "Мэдэгдэл уншихад алдаа гарлаа" });
  }
});

export default router;
