import { Request, Response } from "express";
import { User } from "../../models/userModel";
import bcrypt from "bcryptjs";
import { PreUser } from "../../models/preUser";

const createAccount = async (req: Request, res: Response) => {
  try {
    const { code, email } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: "Email and code are required" });
      return;
    }

    const preUser = await PreUser.findOne({ email });
    if (!preUser) {
      res.status(400).json({ message: "No pending verification found for this email" });
      return;
    }

    if (preUser.code !== code.toString()) {
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }


    const newUser = await User.create({
      username: preUser.username,
      fullname: preUser.fullname,
      password: preUser.password,
      email: preUser.email,
      avatarImage:
        "https://res.cloudinary.com/dvfl0oxmj/image/upload/v1746372697/gbbju93p0xiwunwz8hie.gif",
    });

    await PreUser.deleteOne({ email });

    res.status(201).json({ message: "Account created successfully", user: newUser });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default createAccount;