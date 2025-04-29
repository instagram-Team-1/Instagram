import { Request, Response } from "express";
import { User } from "../../models/userModel";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    if (username) {
      const user = await User.findOne({ username }); 
      if (!user) {
        res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
        return;
      }
      res.status(200).json(user);
      return;
    }

    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Хэрэглэгч хайхад алдаа гарлаа:", error);
    res.status(500).json({ message: "Серверийн алдаа" });
  }
};
