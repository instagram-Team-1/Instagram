import { Request, Response } from "express";
import { User } from "../../models/userModel";

export const searchUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

 

    if (!query || typeof query !== "string") {
      res.status(400).json({ message: "Invalid search query" });
      return;
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullname: { $regex: query, $options: "i" } }, // name -> fullname
      ],
    }).select("username fullname avatarImage"); 



    if (users.length === 0) {
      res.status(404).json({ message: "Хэрэглэгч олдсонгүй" }); // Мессежийг нэгтгэх
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
