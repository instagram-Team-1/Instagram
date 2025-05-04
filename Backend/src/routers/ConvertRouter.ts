import express from "express";
import {User} from "../models/userModel";

import { Request, Response } from "express";
const router = express.Router();

router.get("/username/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("username");

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

     res.json({ username: user.username })
     return;
  } catch (error) {
    console.error("Error fetching username:", error);
     res.status(500).json({ message: "Server error" });
     return;
  }
});

export default router;
