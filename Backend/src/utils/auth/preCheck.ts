import { Request, Response } from "express";
import { User } from "../../models/userModel";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "./mailSender";
import { PreUser } from "../../models/preUser";

const preCheck = async (req: Request, res: Response) => {
  try {
    const { username, fullname, password, email } = req.body;

    if (!username || !fullname || !password || !email) {
       res.status(400).json({ message: "Missing required fields" });
       return
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
       res.status(400).json({ message: "Username already exists" });
       return
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
       res.status(400).json({ message: "Email already exists" });
       return
    }


    const code = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationEmail(email, code);

    const hashedPassword = await bcrypt.hash(password, 10);

    const pre = new PreUser({
      username,
      fullname,
      email,
      password: hashedPassword,
      code: code.toString(),
    });
    await pre.save()
     res.status(200).json({ message: "Verification code sent to email", code: pre._id });
     return
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: "Internal server error" });
     return
  }
};

export default preCheck;