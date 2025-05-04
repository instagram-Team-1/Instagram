import { Request, Response } from "express";
import { User } from "../../models/userModel";
import mongoose from "mongoose";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (id) {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
       
        user = await User.findById(id);
      }

      if (!user) {
        user = await User.findOne({ username: id });
      }

      if (!user) {
        res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
        return;
      }

      res.status(200).json(user);
    } else {
      const users = await User.find();
      res.status(200).json(users);
    }
  } catch (error) {
    console.error("Хэрэглэгч хайхад алдаа гарлаа:", error);
    res.status(500).json({ message: "Серверийн алдаа" });
  }
};
